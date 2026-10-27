import { ArrowRight } from 'lucide-react'
import { Button, Container } from '@/components/ds/primitives'
import { FounderPortrait } from '@/components/home/FounderPortrait'
import { Reveal } from '@/components/motion/Reveal'
import type { homePage } from '@/data/site'

type AboutContent = (typeof homePage)['about']

/**
 * Homepage "About Pro Solutors" preview: founder portrait on the left, company introduction on the right.
 * All text comes from the Home page in Payload. Without an uploaded portrait it shows a branded placeholder, so
 * adding the real photo later needs no code change. Renders nothing when switched off in the admin.
 */
export function AboutPreview({ about }: { about: AboutContent }) {
  if (!about.enabled) return null

  const { founderName, founderRole, founderImage, expertise } = about

  return (
    <section className="theme-light bg-bg py-16 sm:py-20 lg:py-24">
      <Container className="!max-w-[77.5rem]">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 lg:gap-20">
          <Reveal tilt={0} lift={28}>
            <figure className="mx-auto w-full max-w-[26rem] md:max-w-none">
              <FounderPortrait image={founderImage} name={founderName} role={founderRole} />
              <figcaption className="mt-4 md:hidden">
                <p className="text-lg font-bold text-heading">{founderName}</p>
                <p className="text-[14px] text-muted">{founderRole}</p>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal tilt={0} lift={28} delay={0.12}>
            <div className="max-w-[40rem]">
              <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-strong">
                <span aria-hidden className="h-px w-8 bg-btn" />
                {about.eyebrow}
              </p>
              <h2 className="mt-4 text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[1.05] text-heading">{about.heading}</h2>
              <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink">{about.description}</p>
              {about.secondaryDescription && <p className="mt-4 text-pretty text-[16px] leading-relaxed text-muted">{about.secondaryDescription}</p>}

              <div className="mt-7 hidden border-t border-line pt-5 md:block">
                <p className="text-lg font-bold text-heading">{founderName}</p>
                <p className="text-[14px] text-muted">{founderRole}</p>
              </div>

              {expertise.length > 0 && (
                <ul aria-label="Areas of expertise" className="mt-5 flex flex-wrap gap-2">
                  {expertise.map((label) => (
                    <li key={label} className="rounded-[4px] border border-line bg-card px-3 py-1.5 text-[13px] font-semibold text-heading">
                      {label}
                    </li>
                  ))}
                </ul>
              )}

              {about.ctaLabel && about.ctaLink && (
                <Button href={about.ctaLink} className="mt-8 min-h-12 w-full px-7 sm:w-auto">
                  {about.ctaLabel}
                  <ArrowRight aria-hidden className="size-4" />
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
