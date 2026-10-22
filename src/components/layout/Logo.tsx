import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

/** Brand logo. The artwork is a transparent, reversed version (white wordmark, teal accents) for the navy header and footer. */
export function Logo({ className, variant = 'header' }: { className?: string; variant?: 'header' | 'full' }) {
  const full = variant === 'full'
  return (
    <Link href="/" aria-label="Pro Solutors, home" className={cn('inline-block shrink-0', className)}>
      <Image
        src={full ? '/images/logo-full.png' : '/images/logo-header.png'}
        alt="Pro Solutors"
        width={full ? 1015 : 664}
        height={full ? 220 : 144}
        priority={!full}
        sizes={full ? '240px' : '180px'}
        className={cn('w-auto', full ? 'h-12' : 'h-9 sm:h-10')}
      />
    </Link>
  )
}
