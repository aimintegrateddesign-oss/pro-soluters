import Image from 'next/image'

import { Sequence } from '@/components/solutions/SolutionSection'
import { cn } from '@/lib/utils'

/** Photo with a short sequence beneath it, used by all three solution chapters. Without a photo, only the sequence shows. */
export function PhotoVisual({ image, sequence, aspect = 'aspect-[4/3]' }: { image: { src: string; alt: string }; sequence: string[]; aspect?: string }) {
  return (
    <figure>
      {image.src && (
        <div className={cn('relative overflow-hidden rounded-[4px] border border-line', aspect)}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
        </div>
      )}
      <figcaption className={cn(image.src && 'mt-4')}>
        <Sequence items={sequence} />
      </figcaption>
    </figure>
  )
}
