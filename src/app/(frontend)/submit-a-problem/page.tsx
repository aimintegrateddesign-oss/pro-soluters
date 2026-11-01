import { Clock, Mail, ShieldCheck, UserCheck } from 'lucide-react'
import type { Metadata } from 'next'

import { Band, HeroContainer, HeroShell, WIDE } from '@/components/ds/band'
import { Container } from '@/components/ds/primitives'
import { SubmitProblemForm } from '@/components/forms/SubmitProblemForm'
import { getSiteSettings, getSubmitPage, pageMetadata } from '@/lib/queries/content'
import { getCountries } from '@/lib/queries/countries'
import { SOLUTION_OPTIONS } from '@/lib/validation/submission'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [{ content: settings, seo: site }, { seo }] = await Promise.all([getSiteSettings(), getSubmitPage()])
  return pageMetadata(seo, { title: 'Submit your problem', description: settings.promiseText, path: '/submit-a-problem' }, site)
}

// Commitments already stated elsewhere on the site, repeated here at the moment of decision.
const trust = [
  { icon: UserCheck, text: 'Read by an engineer' },
  { icon: Clock, text: 'Clear reply within 2 working days' },
  { icon: ShieldCheck, text: 'NDA available before you share details' },
]

type Props = { searchParams: Promise<{ solution?: string }> }

// Navy cards sitting on the white band, like the rest of the redesigned pages.
const card = 'theme-dark rounded-[4px] border border-line border-t-[3px] border-t-accent bg-[#0e1d30] text-ink shadow-[0_24px_50px_-28px_rgba(10,22,38,0.7)]'

export default async function SubmitPage({ searchParams }: Props) {
  const { solution } = await searchParams
  const [{ content }, { content: settings }, countries] = await Promise.all([getSubmitPage(), getSiteSettings(), getCountries()])
  const defaultSolution = SOLUTION_OPTIONS.some((o) => o.value === solution) ? solution! : 'not-sure'

  return (
    <>
      {/* Compact hero: the form is the point of this page, so it starts close to the top of the screen. */}
      <HeroShell className="lg:min-h-0 lg:justify-start">
        <HeroContainer>
          <div className="pt-3 lg:pt-6">
            <h1 className="text-balance text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-[1.04] !tracking-[-0.035em] text-white">
              {content.hero.title} <span className="text-accent">{content.hero.accent}</span>
            </h1>
            <p className="mt-4 max-w-[40rem] text-pretty text-lg leading-relaxed text-[#d5dfe9]">{content.hero.intro}</p>
            <ul className="mt-6 flex flex-col gap-2 text-[14px] text-[#c3d0dd] sm:flex-row sm:flex-wrap sm:gap-x-7">
              {trust.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon aria-hidden className="size-4 shrink-0 text-accent" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </HeroContainer>
      </HeroShell>

      <Band tone="light" className="py-10 sm:py-14">
        <Container className={cn(WIDE, 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]')}>
          <div className={cn(card, 'p-6 sm:p-8')}>
            <SubmitProblemForm defaultSolution={defaultSolution} countries={countries} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className={cn(card, 'p-6')}>
              <h2 className="text-2xl font-extrabold text-heading">{content.next.title}</h2>
              <ol className="relative mt-5 space-y-5">
                <span aria-hidden className="absolute bottom-4 left-[13px] top-4 w-px bg-line" />
                {content.next.steps.map((s, i) => (
                  <li key={s} className="relative flex items-start gap-3">
                    <span aria-hidden className="relative flex size-7 shrink-0 items-center justify-center rounded-[4px] bg-btn text-[13px] font-bold text-white ring-4 ring-[#0e1d30]">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[15px] leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <a href={`mailto:${settings.notificationEmail}`} className={cn(card, 'flex items-center gap-4 p-4 transition hover:border-accent')}>
              <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent">
                <Mail className="size-5" />
              </span>
              <span className="min-w-0 text-[13px] text-muted">
                Email
                <span className="block truncate text-[16px] font-bold text-heading">{settings.notificationEmail}</span>
              </span>
            </a>
          </aside>
        </Container>
      </Band>
    </>
  )
}
