import Image from 'next/image'
import type { ReactNode } from 'react'

import { Container, Eyebrow } from '@/components/ds/primitives'
import { cn } from '@/lib/utils'

/** Navy band that opens the plain pages (legal, thank-you, 404, error). The redesigned pages use HeroShell instead. */
export function PageBand({
  eyebrow,
  title,
  children,
  image,
  className,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  /** Optional photo shown on the right from lg up, fading into the navy band. */
  image?: { src: string; alt: string }
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-dot-grid text-white', className)}>
      {image && (
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <Image src={image.src} alt={image.alt} fill sizes="50vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-hero via-hero/70 to-transparent" />
        </div>
      )}
      <Container className="relative pb-12 pt-[calc(var(--header-h)+3rem)]">
        <Eyebrow onNavy className="mb-3">
          {eyebrow}
        </Eyebrow>
        <h1 className="type-h1 mb-4 max-w-[48.75rem]">{title}</h1>
        {children && <div className="max-w-[43.75rem] text-lg text-on-navy-muted">{children}</div>}
      </Container>
    </div>
  )
}
