import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export type Audience = { code: string; title: string; text: string; challenge: string; lead: string; start: string }

/** Four audience cards. Each shows who they are, their common challenge, the best-fit solution and where to start. */
export function AudienceGrid({ audiences, cardCta, href = '/submit-a-problem' }: { audiences: Audience[]; cardCta: string; href?: string }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {audiences.map((a) => (
        <li key={a.title}>
          <article className="relative flex h-full flex-col overflow-hidden rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-6 shadow-[0_12px_30px_-20px_rgba(10,22,38,0.45)] sm:p-8">
            {/* Large faint initials: decorative only. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-4 select-none text-[7.5rem] font-extrabold leading-none text-heading opacity-[0.05] [font-family:var(--font-display)]"
            >
              {a.code}
            </span>
            <span aria-hidden className="relative flex size-10 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-[11px] font-bold text-accent-strong">
              {a.code}
            </span>
            <h3 className="relative mt-5 text-xl font-bold leading-snug text-heading">{a.title}</h3>
            <p className="relative mt-1 text-[15px] text-muted">{a.text}</p>

            <dl className="relative mt-6 space-y-4 border-t border-line pt-5 text-[14px]">
              {a.challenge && (
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Common challenge</dt>
                  <dd className="mt-1 text-ink">{a.challenge}</dd>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Best fit</dt>
                  <dd className="mt-1 font-semibold text-accent-strong">{a.lead}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Start with</dt>
                  <dd className="mt-1 font-semibold text-heading">{a.start}</dd>
                </div>
              </div>
            </dl>

            <Link
              href={href}
              className="relative mt-6 inline-flex min-h-11 items-center gap-1.5 self-start pt-1 text-[14px] font-semibold text-accent-strong hover:underline"
            >
              {cardCta}
              <ArrowRight aria-hidden className="size-4" />
              <span className="sr-only"> for {a.title}</span>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  )
}
