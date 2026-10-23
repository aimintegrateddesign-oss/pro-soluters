import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-content px-5', className)} {...props} />
}

export function Section({
  className,
  tone = 'white',
  ...props
}: ComponentProps<'section'> & { tone?: 'white' | 'alt' | 'tint' | 'navy' }) {
  return (
    <section
      className={cn(
        'py-14',
        tone === 'alt' && 'bg-alt',
        tone === 'tint' && 'bg-tint',
        tone === 'navy' && 'bg-dot-grid text-white',
        className,
      )}
      {...props}
    />
  )
}

export function Eyebrow({ className, onNavy, ...props }: ComponentProps<'p'> & { onNavy?: boolean }) {
  return (
    <p
      className={cn(
        'text-[13px] font-bold uppercase tracking-[0.08em]',
        onNavy ? 'text-accent' : 'text-accent-strong',
        className,
      )}
      {...props}
    />
  )
}

/** Section heading + optional lead, as used across the approved design. */
export function SectionHead({ title, lead, className }: { title: string; lead?: string; className?: string }) {
  return (
    <div className={cn('mb-7', className)}>
      <h2 className="type-h2">{title}</h2>
      {lead && <p className="mt-2 max-w-[42rem] text-muted">{lead}</p>}
    </div>
  )
}

type ButtonProps = {
  variant?: 'primary' | 'secondary'
  /** `navy` = sits on a navy band, `light` = sits on the page background. */
  tone?: 'navy' | 'light'
  href?: string
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'button'>, 'className' | 'children'>

// DECISION: the approved design uses white text on the teal button; the fill is --btn (5:1 with white) so it stays readable.
export function Button({ variant = 'primary', tone = 'light', href, className, children, ...rest }: ButtonProps) {
  const styles = cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-[22px] py-3 text-[15px] font-semibold leading-none transition',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variant === 'primary' && 'bg-btn text-white hover:brightness-110',
    variant === 'secondary' && tone === 'navy' && 'border-[1.5px] border-white text-white hover:bg-white/10',
    variant === 'secondary' && tone === 'light' && 'border-[1.5px] border-heading text-heading hover:bg-alt',
    className,
  )
  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    )
  }
  return (
    <button className={styles} {...rest}>
      {children}
    </button>
  )
}

export function NumberBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-flex size-[34px] shrink-0 items-center justify-center rounded-full bg-btn font-bold text-white', className)}
    >
      {children}
    </span>
  )
}

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap rounded-full border-2 border-accent px-4 py-1 text-[12px] font-bold uppercase tracking-wide text-accent-strong',
        className,
      )}
    >
      Sample - Fictional company
    </span>
  )
}

export function Disclaimer({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm italic text-muted', className)}>{children}</p>
}

export function Callout({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-r-lg border-l-4 border-accent bg-tint p-5 md:p-6', className)}>
      <p className="font-bold text-heading">{title}</p>
      <div className="mt-1 text-ink">{children}</div>
    </div>
  )
}

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('m-0 list-none p-0', className)}>
      {items.map((item) => (
        <li key={item} className="relative my-2 pl-[26px] text-muted before:absolute before:left-0 before:font-bold before:text-accent before:content-['\2713']">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function DataTable({
  caption,
  headings,
  rows,
  className,
}: {
  caption: string
  headings: string[]
  rows: ReactNode[][]
  className?: string
}) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-line', className)} tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[34rem] border-collapse bg-card text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-navy text-white">
            {headings.map((h) => (
              <th key={h} scope="col" className="px-3.5 py-3 text-sm font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line">
              {row.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="px-3.5 py-3 text-left align-top font-semibold text-heading">
                    {cell}
                  </th>
                ) : (
                  <td key={j} className="px-3.5 py-3 align-top">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
