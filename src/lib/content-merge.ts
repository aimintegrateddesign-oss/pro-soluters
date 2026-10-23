/**
 * Pure helpers (no Payload or Next imports) that translate between the site copy in src/data/site.ts and the shape
 * Payload stores. They are shared by the page data layer and the seed script.
 *
 * Rules:
 * - A list of plain strings is stored in Payload as `{ text }` rows.
 * - A blank, missing or wrong-typed value in the database falls back to the default, so an unfinished admin form
 *   can never leave a gap on the page.
 * - Database row ids and nulls are dropped.
 */

type Rec = Record<string, unknown>
const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Strip Payload row ids and nulls from a row (recursively). */
function normalize(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(normalize)
  if (!isRec(v)) return v
  const out: Rec = {}
  for (const [k, val] of Object.entries(v)) {
    if (k === 'id' || val === null) continue
    out[k] = normalize(val)
  }
  return out
}

/** Merge a document read from Payload over the defaults, keeping the defaults' shape. */
export function mergeContent<T>(defaults: T, doc: unknown): T {
  if (doc === undefined || doc === null) return defaults

  if (Array.isArray(defaults)) {
    if (!Array.isArray(doc) || doc.length === 0) return defaults
    if (typeof defaults[0] === 'string') {
      const lines = doc.map((r) => (typeof r === 'string' ? r : isRec(r) && typeof r.text === 'string' ? r.text : '')).filter((l) => l.trim())
      return (lines.length ? lines : defaults) as T
    }
    return doc.map(normalize) as T
  }

  if (isRec(defaults)) {
    if (!isRec(doc)) return defaults
    const out: Rec = {}
    for (const key of Object.keys(defaults)) out[key] = mergeContent(defaults[key], doc[key])
    return out as T
  }

  if (typeof defaults === 'string') return (typeof doc === 'string' && doc.trim() ? doc : defaults) as T
  if (typeof defaults === 'number') return (typeof doc === 'number' ? doc : defaults) as T
  if (typeof defaults === 'boolean') return (typeof doc === 'boolean' ? doc : defaults) as T
  return defaults
}

/** Inverse of the string-list mapping: turn defaults into the shape Payload stores. */
export function toDoc<T>(value: T): unknown {
  if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? { text: v } : toDoc(v)))
  if (isRec(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toDoc(v)]))
  return value
}

export type Seo = { title?: string; description?: string; image?: string }

/** Clean the `meta` group of a document: blanks become undefined. */
export function readSeo(doc: unknown): Seo {
  const meta = isRec(doc) && isRec(doc.meta) ? doc.meta : {}
  const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
  return { title: s(meta.title), description: s(meta.description), image: s(meta.image) }
}
