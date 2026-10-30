import { ArrowDown, ArrowRight, ArrowUpRight, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'

import { Band, HeroContainer, HeroShell, SectionTitle, WIDE, otherTone, ruleCard, toneAt } from '@/components/ds/band'
import { Container } from '@/components/ds/primitives'
import { FounderPortrait } from '@/components/home/FounderPortrait'
import { HomeCta } from '@/components/home/HomeCta'
import { getAboutPage, getHomePage, getSiteSettings, pageMetadata } from '@/lib/queries/content'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo: site }, { seo }] = await Promise.all([getSiteSettings(), getAboutPage()])
  return pageMetadata(
    seo,
    {
      title: 'About Pro Solutors | Engineering, Research & Strategic Problem Solving',
      description:
        'Learn about Pro Solutors, its founder Zaid Mohiyuddin, multidisciplinary approach, philosophy and vision for solving complex engineering and business challenges.',
      path: '/about',
    },
    site,
    { absoluteTitle: true },
  )
}

const eyebrowClass = 'flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-strong'
const bodyClass = 'max-w-[40rem] text-pretty text-[17px] leading-relaxed text-muted'

const Eyebrow = ({ children }: { children: string }) => (
  <p className={eyebrowClass}>
    <span aria-hidden className="h-px w-8 bg-btn" />
    {children}
  </p>
)

/** LinkedIn buttons only render for a real https URL, so an empty field hides them. */
const isUrl = (v: string) => /^https?:\/\//i.test(v.trim())

export default async function AboutPage() {
  const [{ content }, { content: home }] = await Promise.all([getAboutPage(), getHomePage()])
  const { hero, founder, journey, why, focus, philosophy, vision } = content

  // Portrait: this page's own upload, else the one from the Home page About section, else the placeholder.
  const portrait = founder.image.src ? founder.image : home.about.founderImage
  // One sentence per line for the philosophy statement.
  const sentences = philosophy.statement.split(/(?<=[.!?])\s+/).filter(Boolean)

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
              <h1 className="mt-5 text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-[1.04] !tracking-[-0.035em] text-white">{hero.title}</h1>
              <p className="mt-6 max-w-[40rem] text-pretty text-lg leading-relaxed text-[#d5dfe9]">{hero.intro}</p>
              {hero.secondLine && <p className="mt-4 max-w-[40rem] text-pretty text-[16px] leading-relaxed text-[#a3b3c4]">{hero.secondLine}</p>}
            </div>
            {hero.image.src ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
                <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(min-width: 1024px) 500px, 92vw" className="object-cover" />
              </div>
            ) : (
              // Placeholder until a hero image is uploaded in Payload (Pages > About Us > Hero > Hero image).
              <div aria-hidden className="bg-blueprint flex aspect-[4/3] flex-col items-center justify-center rounded-[4px] border border-line bg-[#0b2038] text-center shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
                <ImageIcon className="size-10 text-accent/70" strokeWidth={1.4} />
                <span className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-accent">Hero image</span>
                <span className="mt-1 text-[13px] text-[#a3b3c4]">Image coming soon</span>
              </div>
            )}
          </div>
        </HeroContainer>
      </HeroShell>

      {/* Founder */}
      <Band tone={toneAt(0)}>
        <Container className={cn(WIDE, 'grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 lg:gap-20')}>
          <FounderPortrait image={portrait} name={founder.name} role={founder.role} className="mx-auto w-full max-w-[26rem] md:max-w-none" />
          <div className="max-w-[40rem]">
            <Eyebrow>{founder.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{founder.name}</h2>
            <p className="mt-2 text-lg font-semibold text-accent-strong">{founder.role}</p>
            <ul aria-label="Professional background" className="mt-5 flex flex-wrap gap-2">
              {founder.descriptor.map((d) => (
                <li key={d} className="rounded-[4px] border border-line bg-card px-3 py-1.5 text-[13px] font-semibold text-heading">
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-4 border-t border-line pt-6">
              {founder.paragraphs.map((p) => (
                <p key={p} className="text-pretty text-[16px] leading-relaxed text-muted first:text-[17px] first:text-ink">
                  {p}
                </p>
              ))}
            </div>
            {isUrl(founder.linkedin) && (
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg border-[1.5px] border-heading px-5 text-[15px] font-semibold text-heading transition hover:bg-alt"
              >
                LinkedIn
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </Container>
      </Band>

      {/* Journey */}
      <Band tone={toneAt(1)}>
        <Container className={WIDE}>
          <SectionTitle>{journey.title}</SectionTitle>
          <div className="mt-6 space-y-4">
            {journey.paragraphs.map((p) => (
              <p key={p} className={bodyClass}>
                {p}
              </p>
            ))}
          </div>
          <ol className="mt-10 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
            {journey.steps.map((step, i) => {
              const last = i === journey.steps.length - 1
              return (
                <li key={step} className="contents">
                  <div className={cn('flex-1 rounded-[4px] border px-5 py-4 text-[16px] font-bold', last ? 'border-btn bg-btn text-white' : 'border-line bg-card text-heading')}>
                    <span aria-hidden className={cn('mb-1 block text-[12px] font-bold', last ? 'text-white/80' : 'text-accent')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {step}
                  </div>
                  {!last && (
                    <>
                      <ArrowDown aria-hidden className="mx-auto size-5 shrink-0 text-accent md:hidden" />
                      <ArrowRight aria-hidden className="hidden size-5 shrink-0 text-accent md:block" />
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </Container>
      </Band>

      {/* Why */}
      <Band tone={toneAt(2)}>
        <Container className={cn(WIDE, 'grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20')}>
          <div>
            <SectionTitle>{why.title}</SectionTitle>
            <div className="mt-6 space-y-4">
              {why.paragraphs.map((p) => (
                <p key={p} className={bodyClass}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {why.disciplines.map((d, i) => (
              <li key={d} className={cn(ruleCard, 'border-t border-t-line p-4')}>
                <span aria-hidden className="text-[12px] font-bold text-accent-strong">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-1 text-[16px] font-bold text-heading">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      {/* Focus */}
      <Band tone={toneAt(3)}>
        <Container className={WIDE}>
          <SectionTitle>{focus.title}</SectionTitle>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {focus.items.map((f) => (
              <li key={f.number} className={cn(ruleCard, 'flex flex-col p-6')}>
                <div className="flex items-center justify-between">
                  <span aria-hidden className="text-[2rem] font-extrabold leading-none text-accent [font-family:var(--font-display)]">
                    {f.number}
                  </span>
                  <span className="rounded-[3px] border border-accent/40 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-accent">{f.label}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold leading-snug text-heading">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      {/* Philosophy */}
      <Band tone={toneAt(4)} className="py-20 sm:py-28">
        <Container className={WIDE}>
          <Eyebrow>{philosophy.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-[62rem] text-[clamp(2rem,5.6vw,4.75rem)] font-extrabold leading-[1.04] !tracking-[-0.03em] text-heading">
            {sentences.map((s, i) => (
              <span key={s} className={cn('block', i === sentences.length - 1 && 'text-accent-strong')}>
                {s}
              </span>
            ))}
          </h2>
          {philosophy.support && <p className="mt-8 max-w-[36rem] text-pretty text-lg leading-relaxed text-muted">{philosophy.support}</p>}
        </Container>
      </Band>

      {/* Global vision */}
      <Band tone={toneAt(5)}>
        <Container className={cn(WIDE, 'grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20')}>
          <div>
            <Eyebrow>{vision.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{vision.title}</h2>
          </div>
          <div className="space-y-4">
            {vision.paragraphs.map((p) => (
              <p key={p} className={bodyClass}>
                {p}
              </p>
            ))}
          </div>
        </Container>
      </Band>

      <HomeCta tone={otherTone(toneAt(5))} cta={content.cta} secondaryHref="/solutions" />
    </>
  )
}
