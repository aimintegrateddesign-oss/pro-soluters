import Image from 'next/image'

import { cn } from '@/lib/utils'

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

/**
 * Portrait box (4:5) shared by the homepage About preview and the About page. Shows the uploaded image, or a branded
 * placeholder with the person's initials when there is none, so there is never a broken or empty frame.
 */
export function FounderPortrait({
  image,
  name,
  role,
  sizes = '(min-width: 1024px) 460px, (min-width: 768px) 40vw, 90vw',
  className,
}: {
  image?: { src: string; alt: string } | null
  name: string
  role: string
  sizes?: string
  className?: string
}) {
  const hasImage = Boolean(image?.src)
  return (
    <div className={cn('relative aspect-[4/5] overflow-hidden rounded-[4px] border border-line border-t-[3px] border-t-btn bg-alt', className)}>
      {hasImage ? (
        <Image src={image!.src} alt={image!.alt || `${name}, ${role}`} fill sizes={sizes} className="object-cover" />
      ) : (
        <div aria-hidden className="theme-dark bg-blueprint absolute inset-0 flex flex-col items-center justify-center bg-[#0b2038] text-center">
          <span className="text-[clamp(4rem,9vw,6.5rem)] font-extrabold leading-none tracking-tight text-white/90 [font-family:var(--font-display)]">{initials(name)}</span>
          <span className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-accent">Founder Portrait</span>
        </div>
      )}
    </div>
  )
}
