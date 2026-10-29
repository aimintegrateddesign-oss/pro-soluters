import type { Metadata } from 'next'
import { LayoutGrid, RefreshCw, ShieldCheck } from 'lucide-react'

import { Container } from '@/components/ds/primitives'
import { AboutPreview } from '@/components/home/AboutPreview'
import { HomeCta } from '@/components/home/HomeCta'
import { HomeHero } from '@/components/home/HomeHero'
import { SolutionRow } from '@/components/home/SolutionRow'
import { SolutionStack } from '@/components/home/SolutionStack'
import { Reveal } from '@/components/motion/Reveal'
import { SequentialReveal } from '@/components/motion/SequentialReveal'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { getHomePage, getSiteSettings, pageMetadata } from '@/lib/queries/content'
import { getSolutions } from '@/lib/queries/solutions'

export async function generateMetadata(): Promise<Metadata> {
  const [{ content: settings, seo: site }, { seo }] = await Promise.all([getSiteSettings(), getHomePage()])
  return pageMetadata(seo, { title: `Pro Solutors | ${settings.tagline}`, description: settings.description, path: '/' }, site, { absoluteTitle: true })
}

const homeImage = (images: Awaited<ReturnType<typeof getHomePage>>['content']['solutions']['images'], slug: string) =>
  images[slug.replace(/-(\w)/g, (_, ch: string) => ch.toUpperCase()) as keyof typeof images]
const whyIcons = [LayoutGrid, RefreshCw, ShieldCheck]

const cardBase = 'h-full rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-6 shadow-[0_12px_30px_-18px_rgba(15,42,71,0.35)]'
// The problem cards have no coloured top rule.
const plainCard = 'h-full rounded-[4px] border border-line bg-card p-6 shadow-[0_12px_30px_-18px_rgba(15,42,71,0.35)]'

export default async function HomePage() {
  const [solutions, { content: home }, { content: settings }] = await Promise.all([getSolutions(), getHomePage(), getSiteSettings()])

  return (
    <SmoothScroll>
      {/* Sections alternate navy (theme-dark) and white (theme-light), whatever the OS colour scheme. */}
      <div className="overflow-x-clip">
        <HomeHero hero={home.hero} promiseText={settings.promiseText} />

        <section className="theme-light bg-bg py-16 sm:py-20">
          <Container className="!max-w-[77.5rem]">
            <div className="mb-10">
              <h2 className="max-w-[34rem] text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{home.why.title}</h2>
              <p className="mt-3 max-w-[44rem] text-pretty text-[17px] leading-relaxed text-muted">{home.why.lead}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {home.why.items.map((c, i) => {
                const Icon = whyIcons[i % whyIcons.length]
                return (
                  <Reveal key={c.title} delay={i * 0.14}>
                    <div className={plainCard}>
                      <Icon aria-hidden className="mb-5 size-6 text-accent-strong" />
                      <h3 className="text-lg font-bold text-heading">{c.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.text}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </Container>
        </section>

        <section className="theme-dark bg-bg py-16 sm:py-20">
          <Container className="!max-w-[77.5rem]">
            <div className="mb-10">
              <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{home.solutions.title}</h2>
              <p className="mt-3 text-muted">{home.solutions.lead}</p>
            </div>
            {/* Alternating layout: image left, then right, then left. */}
            <SolutionStack cards={solutions.map((s, i) => <SolutionRow key={s.slug} solution={s} image={homeImage(home.solutions.images, s.slug)} flip={i % 2 === 1} />)} />
          </Container>
        </section>

        <AboutPreview about={home.about} />

        {/* About is white, so this section is navy to keep the alternation; the closing CTA band is then white. */}
        <section className="theme-dark bg-bg py-16 sm:py-20">
          <Container className="!max-w-[77.5rem]">
            <div className="mb-10">
              <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{home.path.title}</h2>
              <p className="mt-3 text-muted">{home.path.lead}</p>
            </div>
            <ol className="grid gap-5 md:grid-cols-3 lg:items-end lg:pt-24">
              {home.path.steps.map((c, i) => (
                <li key={c.title} className={['', 'lg:mb-12', 'lg:mb-24'][i]}>
                  <SequentialReveal index={i}>
                    <div className={`${cardBase} border-b-[3px] border-b-btn`}>
                      <span aria-hidden className="mb-4 inline-flex size-9 items-center justify-center rounded-[4px] bg-btn font-bold text-white">
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-bold text-heading">{c.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.text}</p>
                    </div>
                  </SequentialReveal>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <HomeCta tone="light" cta={home.cta} secondaryHref="/sample-reports" />
      </div>
    </SmoothScroll>
  )
}
