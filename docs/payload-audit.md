# Payload audit: folder structure, media storage, email

Project: `D:\ProSoluters\pro-soluters` (Payload 3.91.0 embedded in Next.js 16.3.3, MongoDB via `@payloadcms/db-mongodb`).
Scope: report only. No code was changed, nothing was installed, nothing was committed. This file is the only thing written.

## Update: hosting target is Vercel

Confirmed by the project owner after the first draft. This changes the conclusions below as follows (the detailed rows are left as originally written so the reasoning stays visible):

- **Dockerfile and docker-compose (rows 3, 4, 5): not applicable.** Vercel builds with `next build` itself and ignores both files. Treat them as dev-only or delete them. The "Dockerfile won't build" blocker is dropped, and so is the `public/media` volume advice (row 2).
- **Media storage (Decision A): use Vercel Blob.** Vercel Functions have no persistent disk, so local `staticDir` cannot work. Use `@payloadcms/storage-vercel-blob` with `clientUploads: true` (server uploads are capped at 4.5 MB on Vercel [doc: storage-adapters]). The CSP change in row 8 becomes a required step, not a conditional one.
- **Email (Decision B): use Resend** (`@payloadcms/email-resend`). The docs call it preferred for serverless platforms such as Vercel [doc: email-overview].
- **Cron:** `payload.config.ts:90-92` expects a `Bearer CRON_SECRET` header from "Vercel Cron", but the repo has no `vercel.json` and no cron entries, and `jobs.tasks` is empty (`payload.config.ts:98`). Nothing is scheduled. Either add real cron entries when a job exists, or leave it unused.
- **DNS override (row 25):** the `dns.setServers` call runs in production on Vercel too. It is a local-network workaround; limit it to development.
- **Environment variables to set in the Vercel project:** `DATABASE_URL`, `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`, `IP_HASH_SALT`, `NEXT_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN` (created when a Blob store is linked to the project), `RESEND_API_KEY`. Leave `OFFLINE_DATA` unset.
- **MongoDB Atlas access (not verified):** Vercel functions use changing IP addresses, so the Atlas network allow-list has to permit them. I did not check the current Atlas settings.
- **Server-action body limit (not verified):** if attachments on the Submit form are ever built, Vercel's 4.5 MB function limit applies, so files would need a direct-to-Blob upload.

Revised blocker list for Vercel:

1. Add Vercel Blob storage (with `clientUploads: true`), and update the CSP `img-src` and `connect-src` for the Blob host.
2. Add the Resend adapter, verify the sending domain, and set `RESEND_API_KEY`.
3. Send a notification email when a submission is created (row 14), never blocking the save.
4. Remove the destructive seed paths (`SeedButton`, `src/endpoints/seed`, `next/seed`).
5. Fix `next.config.ts` base-URL handling (rows 6, 7). On Vercel this is less urgent because `VERCEL_PROJECT_PRODUCTION_URL` is set, but preview deployments get different URLs.

How to read the citations:

- **[doc: name]** means a page on payloadcms.com/docs (or the vendor page named) fetched during this audit. URLs are in the Sources section at the end.
- **[local: path]** means something read directly from the installed packages in `node_modules` or from this repo. I use this where the Payload docs page did not state the fact.
- **file:line** means a line in the Pro Solutors repo, as of branch HEAD `0449976` plus the uncommitted edits (`next.config.ts`, `src/lib/validation/submission.ts`, `src/payload-types.ts`).
- Anything I could not confirm is listed under "Could not verify" and is not stated as fact elsewhere.

---

## 1. Research summary

### Part 1: Folder structure

| Point | What the docs say | Source |
| --- | --- | --- |
| Route groups | Payload's files live in an `app/(payload)/` route group; your frontend goes in a second group. The name of the second group "does not matter" (`(frontend)`, `(app)`, `(my-app)`). The root layout moves into that group. | [doc: installation] |
| Config location | `payload.config.ts` is "usually at the repository root or next to the `/app` folder". Alias `@payload-config` in `tsconfig`. | [doc: installation] |
| Files to leave alone | The `(payload)` files are copied from the Blank Template. They "do not regenerate, and will never change" and "are not meant to be edited". The page does not name individual files. | [doc: installation] |
| Import map | `app/(payload)/admin/importMap.js` is generated. "The import map file should never be manually edited." It is regenerated at startup, on HMR, and by `payload generate:importmap`. It is not regenerated at runtime after a production build. `layout.tsx` next to it may be edited. | [doc: custom-components] |
| Generated types | `payload-types.ts` comes from `payload generate:types`. The TypeScript docs page does not say whether to commit it. The file header itself says "DO NOT MODIFY IT BY HAND". | [doc: typescript], [local: `src/payload-types.ts:1-5`] |
| Website template tree | Top-level of `templates/website/src`: `Footer`, `Header`, `access`, `app`, `blocks`, `collections`, `components`, `endpoints/seed`, `fields`, `heros`, `hooks`, `plugins`, `providers`, `search`, `utilities`, plus `cssVariables.js`, `environment.d.ts`, `payload-types.ts`, `payload.config.ts`. The page notes the listing may be incomplete. | [doc: template tree] |
| Template contents | Collections: Users, Posts, Pages, Media, Categories (+ a `redirects` collection from the plugin). Globals: Header, Footer. Blocks: Hero, Content, Media, Call To Action, Archive. Plugins: SEO, Search, Redirects, Nested Docs, Admin Bar, Form Builder (in code), Vercel Blob, Jobs queue (scheduled publish). The seed script is destructive. | [doc: template README] |
| Collections: folder vs single file | I found no official rule. The template's visible layout (see tree) does not state one either. | Not stated; see "Could not verify" |

Commands that regenerate generated files:

| File | Command | Source |
| --- | --- | --- |
| `src/app/(payload)/admin/importMap.js` | `payload generate:importmap` (also automatic on start/HMR) | [doc: custom-components] |
| `src/payload-types.ts` | `payload generate:types` | [doc: typescript] |

### Part 2: Media storage

**Upload collection options** [doc: upload-overview]

| Option | Documented default / behaviour |
| --- | --- |
| `staticDir` | Absolute path, or relative to the config. Defaults to the collection slug. |
| `imageSizes` | Each upload is cropped and resized to every listed size. |
| `focalPoint` | Only shown when `imageSizes` or `resizeOptions` is set. |
| `mimeTypes` | Restricts the admin file picker (`image/*` style). If it is set, the built-in blocklist of risky types is skipped. |
| `allowRestrictedFileTypes` | Default `false`. Without `mimeTypes`, executables, installers, scripts and HTML/PHP are blocked. |
| `filesRequiredOnCreate` | Default `true`. |
| `disableLocalStorage` | Stops writing to local disk. You must provide your own admin thumbnail. Storage adapters set it to `true` automatically. |
| `adminThumbnail` | An image-size name or a function. |
| `formatOptions`, `resizeOptions`, `withMetadata` | Passed to Sharp. The page does not mention WebP or AVIF. The same page says Sharp options "are configured through `sharpTransformer({collections})`" in the current docs. |
| `pasteURL` | Default enabled; set `false` or give an `allowList`. |
| Limits (top-level `upload`) | `requestSizeLimit` 50 MiB, `limits.fileSize` 20 MiB, `limits.files` 3, `limits.fields` 20, `abortOnLimit` true. |
| Read access | "All files that are uploaded to each Collection automatically support the `read` Access Control." |

**Where files are served.** The Payload docs pages I fetched do not state the default file URL. The installed package does: `generateFilePathOrURL.js` builds `/${collectionSlug}/file/${filename}` [local: `node_modules/payload/dist/uploads/generateFilePathOrURL.js:21`], which under the default API route becomes `/api/media/file/<name>`. The storage-adapter page confirms the pattern: by default files "stay on Payload's `/collectionSlug/staticURL/filename` path, so your `read` access rules still apply" unless `disablePayloadAccessControl: true` is set [doc: storage-adapters].

**Why local `staticDir` is unsafe on ephemeral hosting.** [doc: deployment] says to "use a host with a persistent filesystem", that hosts like Heroku use "ephemeral file systems" and uploads can "accidentally disappear without any way to get them back". It lists Heroku and DigitalOcean Apps as ephemeral and DigitalOcean Droplets and Amazon EC2 as persistent. The page does not use the word "serverless". Vercel Functions have no durable disk, so the same warning applies. That is my inference, not a quote.

Safe cases for local storage (inference from the above): a single VPS or VM with a persistent disk, or Docker with a named volume (or bind mount) on the `staticDir` path, plus a backup plan for that directory. The Dockerfile in this repo has neither (see audit rows).

**Official storage adapters** [doc: storage-adapters]

| Adapter | Package | Setup (docs) | Serverless fit | Public vs private | URL / CDN notes |
| --- | --- | --- | --- | --- | --- |
| Vercel Blob | `@payloadcms/storage-vercel-blob` | Token `BLOB_READ_WRITE_TOKEN`; the template uses `collections: { [Media.slug]: true }` | Built for Vercel. Server uploads capped at 4.5 MB; use `clientUploads: true` | Vercel offers private and public stores [doc: vercel-blob-pricing] | `cacheControlMaxAge` default 1 year; files go through Payload access control unless disabled |
| AWS S3 | `@payloadcms/storage-s3` | bucket + `config` (S3ClientConfig) | Works anywhere; 4.5 MB Vercel cap applies to server uploads | `acl` (default undefined); `signedDownloads` for presigned URLs | `prefix`, `generateFileURL`, `disablePayloadAccessControl` per collection |
| Cloudflare R2 (S3 API) | `@payloadcms/storage-s3` | `region: 'auto'`, `endpoint`, `forcePathStyle: true`; public via `r2.dev` or a custom domain | Docs recommend this route for Vercel, Netlify and other Node hosts | Buckets are private by default; public needs the public domain | `disablePayloadAccessControl: true` plus `generateFileURL` to `R2_PUBLIC_URL` |
| R2 (Workers binding) | `@payloadcms/storage-r2` | Binding on a Worker | Cloudflare Workers only; marked beta | n/a | n/a |
| Google Cloud Storage | `@payloadcms/storage-gcs` | bucket + options | 4.5 MB Vercel cap applies; CORS `PUT` for client uploads | `acl` default `Private` | `prefix`, `clientUploads` |
| Azure Blob | `@payloadcms/storage-azure` | connection string, container | Client uploads up to about 5 GB, chunking available | `containerAccess` default `private` | `baseURL` is the only explicit CDN-style option |
| Uploadthing | `@payloadcms/storage-uploadthing` | `UPLOADTHING_TOKEN` | 4.5 MB Vercel cap applies | `acl` default `public-read` | none documented |

Cost (only vendor pages I fetched; I did not verify S3, GCS, Azure or Uploadthing prices):

- Cloudflare R2: free tier 10 GB-month storage, 1 M Class A and 10 M Class B operations per month; $0.015 per GB-month after that; egress free [vendor: r2-pricing].
- Vercel Blob: Hobby includes 1 GB storage, first 10,000 simple operations, first 2,000 advanced operations and 10 GB transfer; on Hobby, going over the limits stops Blob access for 30 days rather than billing. The vendor's worked example uses $0.023 per GB for storage and $0.05 per GB data transfer [vendor: vercel-blob-pricing].
- Not covered by the Payload docs for any adapter: a general CDN option. Only Azure (`baseURL`) and R2 (`R2_PUBLIC_URL` through `generateFileURL`) expose explicit URL settings.

**Next.js `<Image>` configuration** (read from the Next 16 docs shipped in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`)

- `localPatterns` allows optimising images from listed local paths and "block[s] all others". Omitting `search` "allows all search parameters", which can allow URLs you did not intend.
- `remotePatterns` allows only listed external hosts and paths. Any other protocol, hostname, port or path returns an error. Allowed hosts that redirect are followed without re-validating.
- With local `staticDir` and Payload's default URLs, images are same-origin paths, so only `localPatterns` is needed. With any cloud adapter that returns absolute URLs (R2 public domain, Blob URLs, S3 URLs), each host must be added to `remotePatterns`. If `disablePayloadAccessControl` is left at its default, URLs stay on the Payload path and `localPatterns` still covers them.
- `NEXT_PUBLIC_SERVER_URL` is the template's base-URL variable. It feeds CORS and absolute links; it only matters to `remotePatterns` if the config derives patterns from it.

Image workflow recommended by the docs and template: define `imageSizes`, keep `sharp` in the config, enable `focalPoint`, and let `next/image` serve AVIF/WebP. The "make alt text required" step is not a documented Payload setting; it is a one-line `required: true` on the field (my recommendation).

**Folders feature** [doc: folders]: `folders: true` on a collection (default `false`) adds a hidden `folders` relationship; global `folders` config has `browseByFolder` (default `true`), `slug` (default `payload-folders`), `fieldName`. It is in beta and "may be subject to change in minor versions updates".

### Part 3: Email

| Point | What the docs say | Source |
| --- | --- | --- |
| Configuration | The adapter goes in `email` on `buildConfig`. It powers auth emails (password reset, verification). | [doc: email-overview] |
| No adapter | Docs: a warning is logged at startup and on each send; the page does not say mail content is printed. The installed code does: it logs "Email attempted without being configured. To: ..., Subject: ..." and sends nothing. | [doc: email-overview], [local: `node_modules/payload/dist/index.js:394`, `.../email/consoleEmailAdapter.js:9`] |
| `@payloadcms/email-nodemailer` | Any Nodemailer transport (SMTP, SendGrid, ...). Required: `defaultFromName`, `defaultFromAddress`. Calling it with no arguments uses Ethereal and logs the test account at startup. | [doc: email-overview] |
| `@payloadcms/email-resend` | REST API; `defaultFromName`, `defaultFromAddress`, `apiKey`. Docs call it "preferred for serverless platforms such as Vercel" because it is lighter than Nodemailer. | [doc: email-overview] |
| Env vars in docs | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SENDGRID_API_KEY`, `RESEND_API_KEY`. | [doc: email-overview] |
| Features that need email | Auth: `auth.verify` and `auth.forgotPassword` (with `generateEmailHTML`/`generateEmailSubject`); Form Builder plugin "relies on the email configuration defined in your Payload configuration"; any custom `payload.sendEmail()` call. | [doc: auth-email], [doc: form-builder] |
| Form Builder detail | `emails` field is locked to authenticated users by default; `beforeEmail` runs after emails are prepared and before send; `defaultToEmail` falls back to `defaultFromAddress`; `{{field}}` interpolation is supported. The docs say nothing about escaping. | [doc: form-builder] |
| Sending | `payload.sendEmail({ to, subject, html or text })`. | [doc: email-overview] |
| Hooks | `afterChange` receives `doc`, `previousDoc`, `operation`, `req`, `context`. A hook that returns a Promise is awaited; one that returns nothing is not awaited, and "any work started this way might continue after the request has already completed". The docs say nothing here about what happens when a hook throws. | [doc: hooks-collections], [doc: hooks-overview] |
| Providers | Resend free: 3,000 emails per month, 100 per day, 3 domains; Pro $20 per month for 50,000. Domain verification uses DKIM and SPF records (plus an MX or CNAME for bounces) copied from the dashboard; DMARC is a separate recommended step after verification. Verification often completes within 15 minutes. Nodemailer is a free library; the cost is whatever SMTP provider you pick (not researched). | [vendor: resend-pricing], [vendor: resend-domains] |
| Local testing | Ethereal is documented. MailHog is not mentioned by the Payload docs. | [doc: email-overview] |

How to notify on a new record, safely (design guidance; Payload docs cover the hook mechanics, not these rules):

1. Put the send in an `afterChange` hook on the collection, or call it from the server action after `payload.create`. Gate on `operation === 'create'`.
2. Wrap the send in `try/catch` and log; never rethrow. A thrown error in an awaited hook fails the request, and the docs do not promise a rollback.
3. Either await it inside the `try/catch` (simple) or hand it to the jobs queue (this repo already enables jobs with an empty task list at `src/payload.config.ts:82-99`). I did not fetch the jobs docs, so that route is not source-backed.
4. Header injection: never put user input into `from`, `to`, `cc`, `bcc` or `subject` without stripping `\r` and `\n`. Use a fixed `from`, a fixed or configured `to`, and set `replyTo` to the submitter's email only after validation. Payload's docs do not discuss this; it is general email-handling practice.

---

## 2. Audit: Pro Solutors against the recommendations

Status key: OK = matches; Gap = missing or off-convention but not dangerous; Risk = likely to break or leak in production. Effort: S = under an hour, M = a few hours, L = a day or more.

| # | Area | Payload recommendation | Pro Solutors current state | Status | Recommended fix | Effort |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Media: storage target | Use a host with persistent disk, or a storage adapter [doc: deployment, storage-adapters] | `Media` writes to `public/media` via `staticDir` (`src/collections/Media.ts:44`). No storage plugin: `plugins` array has redirects, nested-docs, seo, form-builder, search only (`src/plugins/index.ts:26-92`); `package.json` has no `@payloadcms/storage-*` package. `public/media/` is gitignored (`.gitignore:11`) and does not exist yet | **Risk** | Pick a provider (see Decisions). If Vercel or any container host without a mounted volume: add an adapter. If a VPS with a persistent disk: mount and back up the directory | M |
| 2 | Media: container persistence | Persistent volume if using local storage [doc: deployment] | `Dockerfile` copies `public` into the image (`Dockerfile:52`), runs as user `nextjs` (`Dockerfile:63`), and declares no volume. Uploads written inside the container are lost on every redeploy. Write permission to `public/media` for that user is also unconfirmed (the folder is root-owned, copied at `Dockerfile:52`) | **Risk** | Mount a named volume at the `staticDir` path and `chown` it to `nextjs`, or move to cloud storage | S |
| 3 | Dockerfile vs Next config | Set `output: 'standalone'` in the Next config [doc: deployment] | `Dockerfile:1` says it is required and `Dockerfile:60` copies `.next/standalone`, but `next.config.ts` has no `output` key (lines 40-84) and no `.next/standalone` exists locally | **Risk** | Add `output: 'standalone'` or stop using the Dockerfile. The image build would fail at the `COPY` as written | S |
| 4 | Dockerfile: build needs the DB | Env vars set on deployment [doc: deployment] | The build stage has no `DATABASE_URL` or `PAYLOAD_SECRET` (`Dockerfile:23-38`). Pages query the database at build time (`src/lib/queries/*`) | **Risk (unverified)** | Test `docker build`; pass build args or secrets, or rely on `OFFLINE_DATA` only for CI | M |
| 5 | docker-compose | Template compose reads `.env` [doc: template README] | Dev-only setup: bind mount `.:/home/node/app` (`docker-compose.yml:9`) which does persist `public/media` on the host in dev; runs `yarn install && yarn dev` (`:12`) though the repo uses `package-lock.json`; `version: '3'` is obsolete; `mongo:latest` unpinned with no auth and port 27017 published (`:18-28`) | **Gap** | Pin the Mongo image, drop the published port or add auth, use `npm`, remove `version` | S |
| 6 | next.config image settings | `localPatterns` for same-origin media; `remotePatterns` for external hosts [Next docs, local] | `localPatterns` allows `/api/media/file/**` and `/images/**` (`next.config.ts:50-57`) with no `search` restriction. `remotePatterns` is built from `NEXT_PUBLIC_SERVER_URL`, which in this file is a local constant that reads only `VERCEL_PROJECT_PRODUCTION_URL` then `__NEXT_PRIVATE_ORIGIN` (`next.config.ts:10-12`) and **never reads the env var `NEXT_PUBLIC_SERVER_URL`** | **Gap** | Confirmed as you suspected. It is harmless today because media URLs are relative (see `src/utilities/getMediaUrl.ts:7-9`), but it breaks if any absolute URL is used on a non-Vercel host. Rename the constant, read the real env var, and add the storage host when an adapter is chosen. Add `search: ''` (or a fixed value) to the `localPatterns` entries | S |
| 7 | Base URL is read two different ways | One base-URL rule | `src/utilities/getURL.ts:4-8` reads `NEXT_PUBLIC_SERVER_URL` first, then the Vercel variable; `next.config.ts:10-12` does not read `NEXT_PUBLIC_SERVER_URL`. Same name, different behaviour | **Gap** | Share one helper, or rename the constant in `next.config.ts` | S |
| 8 | CSP vs external storage | A CSP must allow the image and upload hosts you use | `img-src 'self' data: blob:` (`next.config.ts:23`) and `connect-src 'self'` (`:25`). Any adapter that serves from another origin, and any `clientUploads` direct-to-storage upload from the browser, will be blocked | **Risk (when adopting a cloud adapter)** | Add the storage host to `img-src` and, for client uploads, to `connect-src`. Test the admin upload flow after the change | S |
| 9 | Media collection config | `imageSizes`, `focalPoint`, `adminThumbnail`, `mimeTypes`, alt text [doc: upload-overview] | Seven image sizes, focal point, thumbnail all present (`Media.ts:45-79`). No `mimeTypes` (so only the default blocklist applies); `alt` is optional with `required: true` commented out (`Media.ts:28-31`); no `limits` override; `read: anyone` (`Media.ts:23`) is fine for public images | **Gap** | Add `mimeTypes: ['image/*']` (plus `application/pdf` if needed); make `alt` required; keep `read` public only for public assets | S |
| 10 | Media usage in content | Reference uploaded media through `upload` fields | `Solutions.image`/`imageAlt` are text paths under `/public` (`src/collections/Solutions.ts:21-22`, rationale at `:8`); `CaseStudies.cover`/`coverAlt` are text paths (`src/collections/CaseStudies.ts:46-47`, rationale at `:15`); `Industries` has no image field. Only the template's Pages/Posts/blocks use real `Media` relations | **Gap** | Cost of text paths: editors cannot upload or replace an image without a code deploy; no alt-text validation beyond the text field; no Sharp sizes, no focal point, no folders, and no storage adapter benefits; broken paths are not caught at save time. Benefit: nothing extra to host, zero migration. Convert to `upload` relations only if editors must change these images. Keep as paths if the set is small and developer-managed (currently 16 files in `public/images`; all of `public`, including the hero video, is 5.5 MB) | M |
| 11 | Media folders feature | `folders: true` is optional and in beta [doc: folders] | Enabled on `Media` (`Media.ts:19`); `payload-folders` appears in `payload-types.ts:85-92` | **OK** | Fine. Note the beta warning when upgrading Payload | n/a |
| 12 | Email adapter | Set `email` in `buildConfig` [doc: email-overview] | None. `src/payload.config.ts:31-100` has no `email` key and no email package is in `package.json`. At startup Payload logs "No email adapter provided" [local: `payload/dist/index.js:394`] | **Risk** | Add an adapter (see Decisions) | S |
| 13 | Features silently broken without email | Auth emails and form-builder emails need an adapter [doc: auth-email, form-builder] | `Users` has `auth: true` with no `verify` (`src/collections/Users/index.ts:17`), so **forgot-password emails are only logged to the server console**; admins locked out cannot reset their password by email. The form-builder plugin is registered (`src/plugins/index.ts:57-82`) and its seed form has `emailFrom: '"Payload" <demo@payloadcms.com>'` (`src/endpoints/seed/contact-form.ts:36-38`); no form is wired on the public site, which uses a custom form | **Risk** | Configure email; decide whether to keep the form-builder plugin at all (it adds `forms` and `form-submissions` collections that nothing uses) | S |
| 14 | submit-a-problem notification | Notify on create with a fail-safe send | `src/app/(frontend)/submit-a-problem/actions.ts:54-71` saves the submission with `payload.create` and redirects. There is no `sendEmail` call, no `afterChange` hook on `Submissions` (`src/collections/Submissions.ts:9-39`), and nobody is notified; the only way to see a lead is to open `/admin` | **Risk** | Add a notification to `SiteSettings.notificationEmail` (`src/globals/index.ts:16`) or a fixed address; send in `try/catch`, never block the save | M |
| 15 | Header-injection exposure (when #14 is built) | Strip CR/LF from user text used in headers (general practice) | `name` and `company` are only length-checked (`src/lib/validation/submission.ts:59-72`); only `email` is regex-checked and the regex excludes whitespace, so newlines in `name` are accepted | **Gap** | Reject or strip `\r\n` in `name`/`company`, and never use them in `from`/`to`/`subject` | S |
| 16 | Submit form attachments | n/a (consistency) | `ALLOWED_EXTENSIONS`, `MAX_FILES`, `MAX_FILE_BYTES` and `validateFile` are defined (`submission.ts:35-38`, `:77`) but unused: no file input exists on the form, `Submissions` has no upload field, and the action ignores files | **Gap** | Remove the dead code, or add real attachments with a private upload collection and a storage adapter | S (remove) / L (build) |
| 17 | Folder: two Header/Footer implementations | Template has `Header/` and `Footer/` global configs plus their components [doc: template tree] | Both exist. The site renders `src/components/layout/Header.tsx` and `Footer.tsx` (`src/app/(frontend)/layout.tsx:5-6`) which read from the `navigation` global in `src/globals/index.ts`. The template's `src/Header/Component.tsx` and `src/Footer/Component.tsx` are not imported by the layout, yet the `header` and `footer` globals still register in the admin (`payload.config.ts:17-18,75`) and are editable but have no effect on the site | **Gap** | Delete `src/Header`, `src/Footer`, their globals, and the `header`/`footer` seed entries, or retire `components/layout`. Pick one | M |
| 18 | Folder: unused template code | Remove template parts you do not use | Still present: `Posts` collection and its hooks (`payload.config.ts:15,73`), `src/blocks/*` (Archive, Banner, Code, Content, Form, MediaBlock, RelatedPosts, CallToAction), `src/heros/*`, `components/Card`, `CollectionArchive`, `AdminBar`, `PayloadRedirects`, `RichText`, the search plugin (`plugins/index.ts:83-91`), `src/endpoints/seed` and the dashboard `SeedButton`. The Pages and Posts collections carry the layout builder these feed | **Gap** | Decide whether Pages/Posts stay. If not, remove them and everything above in one change. The seed button is destructive in the template [doc: template README]; remove it before production | L |
| 19 | Template leftovers in SEO and OG | Replace template branding | `generateTitle` returns "... | Payload Website Template" (`src/plugins/index.ts:17`); `generateMeta.ts:11,30-31` and `mergeOpenGraph.ts:9,12-13` reference `Payload Website Template` and `/website-template-OG.webp` (file at `public/website-template-OG.webp`) | **Gap** | Replace strings and image with Pro Solutors values | S |
| 20 | Folder structure vs convention | `(payload)` and a separate frontend group; config at root or beside `app` [doc: installation] | `src/app/(payload)` and `src/app/(frontend)`; `src/payload.config.ts` sits beside `app`; `@payload-config` alias in use (`src/lib/payload.ts:1`). `src/app/(frontend)/next/seed|preview|exit-preview` are template routes | **OK** | Keep. Remove `next/seed` with #18 | n/a |
| 21 | Custom (non-template) layout | n/a | Custom code is organised as `src/globals/{index,helpers}.ts`, `src/data/*`, `src/lib/{queries,validation}`, `src/components/{home,solutions,ds,forms,...}`. Collections are single files (`Solutions.ts`, `Submissions.ts`, ...) next to the template's folders (`Pages/`, `Posts/`, `Users/`) | **OK / Gap** | Consistent enough. Mixed single-file and folder collections is cosmetic | n/a |
| 22 | Generated files | Never hand-edit `importMap.js`, `payload-types.ts`; regenerate with the two commands | Both present and headed as generated. `package.json` has `generate:importmap` and `generate:types` scripts. `src/payload-types.ts` has uncommitted changes in the working tree | **OK** | Run `npm run generate:types` after schema changes and commit the result with them | S |
| 23 | Access control on Submissions | Local API with `overrideAccess` for server-only create | `create: () => false`, reads authenticated only (`Submissions.ts:11`); the action uses `overrideAccess: true` (`actions.ts:56`) | **OK** | Keep | n/a |
| 24 | `.env.example` completeness | Document every env var used | Documents `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `CRON_SECRET`, `PREVIEW_SECRET`, `OFFLINE_DATA`. Missing: `IP_HASH_SALT` (read at `actions.ts:40`), `DNS_SERVERS` (`payload.config.ts:26`), and any storage or email variables | **Gap** | Add them when the providers are chosen | S |
| 25 | DNS override in config | n/a | `dns.setServers(...)` runs unconditionally in production too (`payload.config.ts:26`), pinning resolvers to 8.8.8.8 and 1.1.1.1 unless `DNS_SERVERS` is set | **Gap** | Limit it to development, or document it | S |
| 26 | Root `README.md` | Project-specific docs | Still the template README ("Payload Website Template", Vercel Postgres instructions) | **Gap** | Rewrite for this project | S |

---

## 3. Prioritised fix list

### Blockers before production

1. **Persist uploads (rows 1, 2).** Choose storage (Decisions A) and implement it. Nothing uploaded in `/admin` survives a redeploy on a container or serverless host today.
2. **Fix or drop the Dockerfile (rows 3, 4).** As written, it copies a `.next/standalone` folder that the Next config never produces, and the build stage has no database settings. Do not rely on it until a clean `docker build` succeeds.
3. **Configure email (rows 12, 13).** Without it, password reset for admins does nothing but log to the console.
4. **Notify someone on new submissions (row 14).** Without it, leads are only visible by logging into `/admin`.
5. **If a cloud storage adapter is chosen, update the CSP at the same time (row 8).** Otherwise images and browser uploads are blocked.
6. **Remove the destructive seed paths (row 18, part):** the dashboard `SeedButton`, `src/endpoints/seed`, and `src/app/(frontend)/next/seed`.

### Should fix

7. `next.config.ts` base-URL constant and `localPatterns` `search` restriction (rows 6, 7).
8. Media collection: `mimeTypes`, required `alt` (row 9).
9. Header-injection hygiene for `name` and `company` before building #14 (row 15).
10. Replace template branding in SEO titles, Open Graph defaults and the root README (rows 19, 26).
11. Add missing variables to `.env.example` (row 24).
12. Constrain the `dns.setServers` override to development (row 25).
13. Resolve the two Header/Footer implementations (row 17).
14. docker-compose hygiene (row 5).

### Nice to have

15. Remove unused template code: Posts, blocks, heros, search, Card, AdminBar and friends (row 18), or commit to using them.
16. Decide on the dead attachment code (row 16).
17. Move `Solutions.image` and `CaseStudies.cover` to `Media` relations if editors need to change images (row 10).
18. Remove the form-builder plugin if it stays unused (row 13).

---

## 4. Decisions that need your input

Hosting target is not stated anywhere in the repo. Evidence is mixed: Vercel-specific code and comments exist (`VERCEL_PROJECT_PRODUCTION_URL` in `next.config.ts:10` and `src/utilities/getURL.ts`, a "Vercel Cron" comment in `payload.config.ts:90-92`), and there is also a Dockerfile and compose file (both unchanged template files as far as I can tell). The recommendations below are conditional on that answer. **First question: where will production run?**

### A. Media storage provider

| Option | Fits | Cost (from fetched vendor pages) | Setup | Trade-offs |
| --- | --- | --- | --- | --- |
| **Vercel Blob** (`@payloadcms/storage-vercel-blob`) | Vercel hosting | Hobby is free inside 1 GB storage, 10 GB transfer, 10,000 simple and 2,000 advanced operations, and Blob stops (does not bill) if exceeded; vendor's example rates are $0.023 per GB storage and $0.05 per GB transfer | Smallest: one token, the template shows it in 3 lines; add `clientUploads: true` to avoid the 4.5 MB server-upload cap | Tied to Vercel. Needs CSP changes |
| **Cloudflare R2 via `s3Storage`** | Any host, including Vercel and Docker | 10 GB free; $0.015 per GB-month after; **no egress fees** | More setup: bucket, API keys, `endpoint`, `forcePathStyle`, public domain, `generateFileURL`, `disablePayloadAccessControl` | Best long-term cost for a media-heavy site; docs recommend this route for Vercel, Netlify and other Node hosts |
| **AWS S3** | Any host | Not verified in this audit | Similar to R2 | Egress costs apply (not verified here) |
| **Local `staticDir` + persistent volume** | A single VPS or a Docker host with a mounted volume | No extra service cost | Mount and back up the folder; fix the Dockerfile permissions | Not safe on ephemeral hosting. No CDN. Single point of failure |
| GCS, Azure, Uploadthing | If you already use that vendor | Not verified | Documented in [doc: storage-adapters] | No reason to pick them without an existing account |

**Recommendation:**

- Hosting on Vercel: use **Vercel Blob** (least setup, matches the template), with `clientUploads: true`.
- Hosting on a VPS or Docker host you control: keep **local storage on a mounted, backed-up volume** for launch; move to **R2** when you want a CDN or off-box backups.
- Undecided: choose **R2**, because it works the same on any host and has no egress charges.

### B. Email provider

| Option | Cost | Setup | Deliverability and DNS | Fit |
| --- | --- | --- | --- | --- |
| **Resend** (`@payloadcms/email-resend`) | Free: 3,000 per month, 100 per day, 3 domains. Pro: $20 per month for 50,000 | One API key, three config lines | Verify a domain with DKIM and SPF records (plus MX or CNAME for bounces); add DMARC after verification. Often verifies within 15 minutes | Docs call it preferred for serverless; works fine on a VPS too |
| **Nodemailer + SMTP** (`@payloadcms/email-nodemailer`) | Library is free; SMTP service cost depends on the provider | Host, port, user, password | Same SPF/DKIM/DMARC duties, handled by whichever SMTP service you use | Good if you already have SMTP (hosting provider, Google Workspace, SendGrid) |
| Nodemailer with no arguments (Ethereal) | Free | Zero | Test inbox only, nothing is delivered | Local development only |

Recommendation: **Resend**, with a verified `prosolutors.com` (or a subdomain such as `updates.`), `defaultFromAddress` on that domain, and `RESEND_API_KEY` in the host's env. At 100 emails per day on the free plan, this is far above the current volume. Use the Ethereal default (`nodemailerAdapter()` with no arguments) in development only. Decide the notification recipient: `SiteSettings.notificationEmail` (editable in admin) or a fixed address in env.

### C. Other choices

- **Pages, Posts and layout builder:** keep or remove (row 18). Removing saves the most code, but only do it if the marketing pages will never be editor-built.
- **Form Builder plugin:** keep or remove (row 13). It is unused, and its seed uses a demo sender.
- **Solutions, case-study and industry images:** keep as paths, or move to Media (row 10).
- **Attachments on the Submit form:** build or delete the dead code (row 16).

---

## 5. Could not verify

- **Production hosting target.** Not stated in the repo. All hosting recommendations are conditional.
- **Whether `docker build` succeeds.** I read the Dockerfile and config but did not run Docker (no installs or builds were allowed). Rows 3 and 4 are code-reading findings. Row 4 (database needed at build time) is a likelihood, not a confirmed failure.
- **Write permission for `public/media` inside the container.** I did not run the image. The path resolution of `staticDir` inside the standalone build is also unconfirmed.
- **Official convention for splitting collections into folders vs single files, and for where hooks and access functions live.** The docs pages I fetched do not state one. The template's top-level folder list is known (Part 1), but I could not open its subfolders, so I only report what exists in this repo.
- **Whether committing `payload-types.ts` is recommended.** The TypeScript docs page does not say.
- **Prices for S3, GCS, Azure and Uploadthing.** Not researched. Only R2, Vercel Blob and Resend prices were fetched, as of the date of this audit.
- **Payload's current default for the file URL** is not on the docs pages I could fetch; I confirmed it from the installed package version 3.91.0 instead.
- **The jobs-queue docs.** Not fetched, so using it for notification email is a suggestion without a Payload doc citation. The same applies to the "never put user input in email headers" advice, which is general practice, not a Payload doc.
- **MailHog.** Not covered by Payload's docs; I did not research it.
- **The seed script and `OFFLINE_DATA` mode in production.** I saw the flag (`.env.example`) but did not trace every code path.
- **The `.env` file contents.** I deliberately did not read secret values; only variable names from `.env.example`.
- **The reference docs I did not fetch:** access control (beyond what the template README states), plugin-cloud-storage internals, and the Next.js standalone output docs (the Payload deployment page states the requirement).

---

## Sources

Payload docs (primary):

- [doc: installation] https://payloadcms.com/docs/getting-started/installation
- [doc: upload-overview] https://payloadcms.com/docs/upload/overview
- [doc: storage-adapters] https://payloadcms.com/docs/upload/storage-adapters
- [doc: folders] https://payloadcms.com/docs/folders/overview
- [doc: email-overview] https://payloadcms.com/docs/email/overview
- [doc: auth-email] https://payloadcms.com/docs/authentication/email
- [doc: form-builder] https://payloadcms.com/docs/plugins/form-builder
- [doc: hooks-collections] https://payloadcms.com/docs/hooks/collections
- [doc: hooks-overview] https://payloadcms.com/docs/hooks/overview
- [doc: deployment] https://payloadcms.com/docs/production/deployment
- [doc: custom-components] https://payloadcms.com/docs/custom-components/overview
- [doc: typescript] https://payloadcms.com/docs/typescript/overview
- [doc: template README] https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/README.md
- [doc: template tree] https://github.com/payloadcms/payload/tree/main/templates/website/src

Other:

- Next.js 16 image docs, local copy: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` (AIM project; same Next major)
- [vendor: r2-pricing] https://developers.cloudflare.com/r2/pricing/
- [vendor: vercel-blob-pricing] https://vercel.com/docs/vercel-blob/usage-and-pricing
- [vendor: resend-pricing] https://resend.com/pricing
- [vendor: resend-domains] https://resend.com/docs/dashboard/domains/introduction and https://resend.com/docs/add-a-domain
- Local: `D:\ProSoluters\pro-soluters\node_modules\payload\dist\uploads\generateFilePathOrURL.js`, `...\dist\index.js`, `...\dist\email\consoleEmailAdapter.js`; project skill `.claude/skills/payload/reference/ADAPTERS.md`
