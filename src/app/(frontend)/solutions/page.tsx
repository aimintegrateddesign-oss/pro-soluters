import { Check } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Band, HeroContainer, HeroShell, SectionTitle, WIDE, otherTone, toneAt } from '@/components/ds/band'
import { Container, NumberBadge } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { Reveal } from '@/components/motion/Reveal'
import { FitGuide, type FitOption } from '@/components/solutions/FitGuide'
import { HowWeWork } from '@/components/solutions/HowWeWork'
import { getHomePage, getSiteSettings, getSolutionsPage, pageMetadata } from '@/lib/queries/content'
import { getSolutions } from '@/lib/queries/solutions'

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo: site }, { seo }] = await Promise.all([getSiteSettings(), getSolutionsPage()])
  return pageMetadata(
    seo,
    {
      title: 'Solutions',
      description: 'Improve and Innovate, Align Your Technical Data, and Solve and Prove: three ways Pro Solutors delivers decision-ready engineering.',
      path: '/solutions',
    },
    site,
  )
}

export default async function SolutionsPage() {
  const [solutions, { content }, { content: home }] = await Promise.all([getSolutions(), getSolutionsPage(), getHomePage()])

  // "Which solution fits you?" options: the guide copy in site.ts, resolved against the live solutions.
  const freeReview = home.path.steps[0]
  const fitOptions: FitOption[] = content.fit.items.map(({ quote, startWith }) => {
    const match = solutions.find((s) => s.name === startWith)
    return match
      ? { quote, name: match.name, summary: match.shortSummary, firstStep: match.entryOffer.label, slug: match.slug }
      : { quote, name: startWith, summary: freeReview.text, firstStep: 'A 30-minute call or written review' }
  })

  return (
    <>
      <HeroShell>
        <HeroContainer>
          <div className="grid items-end gap-6 lg:grid-cols-[2fr_1fr]">
            <h1 className="text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold leading-[1.02] !tracking-[-0.035em] text-white">
              {content.hero.title} <span className="text-accent">{content.hero.accent}</span>
            </h1>
            <p className="text-lg text-[#c3d0dd]">{content.hero.intro}</p>
          </div>

          <div className="relative mx-auto mt-6 lg:mt-10 lg:w-[min(100%,max(24rem,calc((100svh-var(--header-h)-16rem)*1.9532)))]">
            <span aria-hidden className="absolute -left-3 -top-3 hidden size-8 border-l border-t border-accent lg:block" />
            <span aria-hidden className="absolute -bottom-3 -right-3 hidden size-8 border-b border-r border-accent lg:block" />
            <div className="relative aspect-[1752/897] overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
              <Image
                src={content.hero.image.src}
                alt={content.hero.image.alt}
                fill
                priority
                sizes="(min-width: 1280px) 1240px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </HeroContainer>
      </HeroShell>

      <Band tone={toneAt(0)}>
        <Container className={WIDE}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s, i) => (
              <li key={s.slug}>
                <Reveal delay={i * 0.14}>
                  <article className="flex h-full flex-col overflow-hidden rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card shadow-[0_12px_30px_-20px_rgba(10,22,38,0.45)]">
                    <div className="relative aspect-video bg-hero">
                      <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <NumberBadge className="mb-3 size-8 rounded-[4px]">{s.order}</NumberBadge>
                      <h2 className="text-2xl font-extrabold leading-tight text-heading">{s.name}</h2>
                      <p className="mt-2 text-[15px] text-muted">{s.shortSummary}</p>
                      <ul className="mt-4 flex-1 space-y-2">
                        {s.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2.5 text-[14px]">
                            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 rounded-[4px] border border-line bg-bg p-3 text-[12px] text-muted">
                        Entry offer
                        <span className="mt-0.5 block text-[14px] font-bold text-accent-strong">{s.entryOffer.label}</span>
                      </p>
                      <Link
                        href={`/solutions/${s.slug}`}
                        className="mt-4 inline-flex min-h-11 items-center justify-between gap-2 rounded-[4px] border border-line px-4 text-[14px] font-semibold text-heading transition hover:border-accent"
                      >
                        Read more about {s.name}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      <Band tone={toneAt(1)}>
        <Container className={WIDE}>
          <SectionTitle>{content.fit.title}</SectionTitle>
          <p className="mb-10 mt-3 text-muted">{content.fit.lead}</p>
          <FitGuide options={fitOptions} />
        </Container>
      </Band>

      <Band tone={toneAt(2)}>
        <Container className={WIDE}>
          <SectionTitle>{content.how.title}</SectionTitle>
          <p className="mb-10 mt-3 max-w-[40rem] text-muted">{content.how.lead}</p>
          <HowWeWork steps={content.how.steps} />
        </Container>
      </Band>

      <HomeCta tone={otherTone(toneAt(2))} cta={content.cta} secondaryHref="/case-studies" />
    </>
  )
}
