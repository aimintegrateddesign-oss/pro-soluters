import { Mail } from 'lucide-react'
import type { Metadata } from 'next'

import { Band, HeroContainer, HeroShell, WIDE } from '@/components/ds/band'
import { Container } from '@/components/ds/primitives'
import { SubmitProblemForm } from '@/components/forms/SubmitProblemForm'
import { getSiteSettings, getSubmitPage, pageMetadata } from '@/lib/queries/content'
import { SOLUTION_OPTIONS } from '@/lib/validation/submission'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [{ content: settings, seo: site }, { seo }] = await Promise.all([getSiteSettings(), getSubmitPage()])
  return pageMetadata(seo, { title: 'Submit your problem', description: settings.promiseText, path: '/submit-a-problem' }, site)
}

type Props = { searchParams: Promise<{ solution?: string }> }

// Navy cards sitting on the white band, like the rest of the redesigned pages.
const card = 'theme-dark rounded-[4px] border border-line border-t-[3px] border-t-accent bg-[#0e1d30] text-ink shadow-[0_24px_50px_-28px_rgba(10,22,38,0.7)]'

export default async function SubmitPage({ searchParams }: Props) {
  const { solution } = await searchParams
  const [{ content }, { content: settings }] = await Promise.all([getSubmitPage(), getSiteSettings()])
  const defaultSolution = SOLUTION_OPTIONS.some((o) => o.value === solution) ? solution! : 'not-sure'

  return (
    <>
      <HeroShell>
        <HeroContainer>
          <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">
            {content.hero.title} <span className="text-accent">{content.hero.accent}</span>
          </h1>
          <p className="mt-4 max-w-[40rem] text-lg text-[#c3d0dd]">{content.hero.intro}</p>
        </HeroContainer>
      </HeroShell>

      <Band tone="light" className="py-10 sm:py-14">
        <Container className={cn(WIDE, 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]')}>
          <div className={cn(card, 'p-6 sm:p-8')}>
            <SubmitProblemForm defaultSolution={defaultSolution} />
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
