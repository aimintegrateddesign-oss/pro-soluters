import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

/** Brand logo. The artwork is the official logo, reversed (white wordmark, original gradient mark) for the navy header and footer. */
export function Logo({ className, variant = 'header' }: { className?: string; variant?: 'header' | 'full' }) {
  const full = variant === 'full'
  return (
    <Link href="/" aria-label="Pro Solutors, home" className={cn('inline-block shrink-0', className)}>
      <Image
        src={full ? '/images/logo-full.png' : '/images/logo-header.png'}
        alt="Pro Solutors"
        width={full ? 1264 : 795}
        height={full ? 776 : 120}
        priority={!full}
        sizes={full ? '240px' : '180px'}
        className={cn('w-auto', full ? 'h-28' : 'h-8 sm:h-10')}
      />
    </Link>
  )
}
