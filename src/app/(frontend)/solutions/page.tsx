import { ArrowDown } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'

import { Band, HeroContainer, HeroShell, SectionTitle, WIDE } from '@/components/ds/band'
import { Button, Container } from '@/components/ds/primitives'
import { HomeCta } from '@/components/home/HomeCta'
import { ProcessTimeline } from '@/components/solutions/ProcessTimeline'
import { Sequence, SolutionSection } from '@/components/solutions/SolutionSection'
import { SolutionFinder } from '@/components/solutions/SolutionFinder'
import { PhotoVisual } from '@/components/solutions/visuals'
import { getHomePage, getSiteSettings, getSolutionsPage, pageMetadata } from '@/lib/queries/content'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo: site }, { seo }] = await Promise.all([getSiteSettings(), getSolutionsPage()])
  return pageMetadata(
    seo,
    {
      title: 'Engineering Solutions | Improve, Align & Solve | Pro Solutors',
      description:
        "Explore Pro Solutors' three engineering solution paths: improve operations and innovation, align technical data, and solve complex challenges through feasibility analysis and evidence-based recommendations.",
      path: '/solutions',
    },
    site,
    { absoluteTitle: true },
  )
}

const anchors = ['#improve', '#align', '#solve']

export default async function SolutionsPage() {
  const [{ content }, { content: home }] = await Promise.all([getSolutionsPage(), getHomePage()])
  const { hero, navigator, improve, align, solve, finder, how } = content

  return (
    <>
      <HeroShell>
        <HeroContainer>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-14">
            <div>
              <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent">
                <span aria-hidden className="h-px w-8 bg-accent" />
                {hero.eyebrow}
              </p>
              <h1 className="mt-5 text-balance text-[clamp(2.25rem,4.6vw,4.25rem)] font-extrabold leading-[1.04] !tracking-[-0.035em] text-white">
                {hero.title} <span className="text-accent">{hero.accent}</span>
              </h1>
              <p className="mt-6 max-w-[34rem] text-pretty text-lg leading-relaxed text-[#d5dfe9]">{hero.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/submit-a-problem" className="min-h-12 w-full px-7 sm:w-auto">
                  {hero.primaryLabel}
                </Button>
                <Button href="#find-your-solution" tone="navy" variant="secondary" className="min-h-12 w-full px-7 !border-white/30 sm:w-auto">
                  {hero.secondaryLabel}
                  <ArrowDown aria-hidden className="size-4" />
                </Button>
              </div>
            </div>

            <figure>
              {hero.image.src && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
                  <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(min-width: 1024px) 500px, 92vw" className="object-cover" />
                </div>
              )}
              <figcaption className={cn(hero.image.src && 'mt-4')}>
                <Sequence items={hero.flow} className="text-[#a3b3c4]" />
              </figcaption>
            </figure>
          </div>
        </HeroContainer>
      </HeroShell>

      {/* Navigator */}
      <Band tone="light" aria-label="The three solutions" className="py-10 sm:py-14">
        <Container className={WIDE}>
          <ul className="grid gap-4 md:grid-cols-3">
            {navigator.items.map((n, i) => (
              <li key={n.label}>
                <a
                  href={anchors[i]}
                  className="group flex h-full flex-col rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card p-5 transition hover:-translate-y-[3px] hover:border-accent motion-reduce:hover:translate-y-0"
                >
                  <span className="flex items-baseline gap-3">
                    <span aria-hidden className="text-[1.75rem] font-extrabold leading-none text-accent [font-family:var(--font-display)]">
                      {n.number}
                    </span>
                    <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-heading">{n.label}</span>
                  </span>
                  <span className="mt-3 flex-1 text-[15px] leading-snug text-muted">{n.text}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-strong">
                    {n.cta}
                    <ArrowDown aria-hidden className="size-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      <SolutionSection id="improve" tone="light" className="!bg-alt" block={improve} visual={<PhotoVisual image={improve.image} sequence={improve.sequence} aspect="aspect-[3/2]" />} />
      <SolutionSection id="align" tone="light" block={align} flip visual={<PhotoVisual image={align.image} sequence={align.sequence} />} />
      <SolutionSection id="solve" tone="light" className="!bg-alt" block={solve} visual={<PhotoVisual image={solve.image} sequence={solve.sequence} />} />

      {/* Finder */}
      <Band tone="dark" id="find-your-solution" aria-labelledby="finder-title" className="scroll-mt-[var(--header-h)]">
        <Container className={WIDE}>
          <SectionTitle>
            <span id="finder-title">{finder.title}</span>
          </SectionTitle>
          <p className="mb-10 mt-3 text-muted">{finder.lead}</p>
          <SolutionFinder options={finder.options} />
        </Container>
      </Band>

      {/* How we work */}
      <Band tone="light" aria-labelledby="how-title">
        <Container className={WIDE}>
          <SectionTitle>
            <span id="how-title">{how.title}</span>
          </SectionTitle>
          <p className="mb-10 mt-3 max-w-[40rem] text-muted">{how.lead}</p>
          <ProcessTimeline steps={how.steps} previewTitle={how.previewTitle} previewItems={how.previewItems} previewLinkLabel={how.previewLinkLabel} />
        </Container>
      </Band>

      <HomeCta cta={home.cta} secondaryHref="/sample-reports" />
    </>
  )
}
