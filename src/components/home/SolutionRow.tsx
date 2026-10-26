import { ArrowRight, Check, Database, SearchCheck, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { Solution } from '@/data/types'
import { cn } from '@/lib/utils'

const icons = { 'search-check': SearchCheck, 'trending-up': TrendingUp, database: Database }

// Illustrations for the home page cards, keyed by solution slug. Other pages keep using the image stored on the solution.
const HOME_IMAGES: Record<string, { src: string; alt: string }> = {
  'improve-and-innovate': {
    src: '/images/home-improve-and-innovate.webp',
    alt: 'Isometric illustration of a connected factory with machines, conveyors and a cloud, representing improved operations',
  },
  'align-your-technical-data': {
    src: '/images/home-align-your-technical-data.webp',
    alt: 'Isometric illustration of a glowing building model above layered technical drawings, representing aligned technical data',
  },
  'solve-and-prove': {
    src: '/images/home-solve-and-prove.webp',
    alt: 'Illustration comparing three chiller options with a scoring panel, representing a feasibility analysis',
  },
}

/** One solution as a wide card. `flip` puts the image on the right from lg up, so rows alternate left and right. */
export function SolutionRow({ solution, flip }: { solution: Solution; flip?: boolean }) {
  const Icon = icons[solution.icon]
  const image = HOME_IMAGES[solution.slug] ?? { src: solution.image, alt: solution.imageAlt }
  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-[4px] border border-line border-t-[3px] border-t-btn bg-card shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)] lg:min-h-[19rem] lg:flex-row',
        flip && 'lg:flex-row-reverse',
      )}
    >
      <div className="relative aspect-video w-full shrink-0 bg-hero lg:aspect-auto lg:w-[46%]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent">
            <Icon className="size-5" />
          </span>
          <h3 className="text-2xl font-extrabold leading-tight text-heading">{solution.name}</h3>
        </div>
        <p className="mt-4 max-w-[34rem] text-[15px] leading-relaxed text-muted">{solution.shortSummary}</p>
        <ul className="mt-4 space-y-2">
          {solution.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-[14px] text-ink">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5 lg:mt-auto">
          <p className="text-[13px] text-muted">
            Entry offer
            <span className="mt-0.5 block text-[15px] font-bold text-accent">{solution.entryOffer.label}</span>
          </p>
          <Link
            href={`/solutions/${solution.slug}`}
            aria-label={`Learn more about ${solution.name}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-line px-5 text-[14px] font-semibold text-white transition hover:border-accent hover:bg-accent/10"
          >
            Learn more
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
