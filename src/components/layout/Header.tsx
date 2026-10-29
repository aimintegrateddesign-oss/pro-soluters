'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { NavItem } from '@/data/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ds/primitives'
import { Logo } from './Logo'

// DECISION: the header is fixed. Over the home hero it is transparent (like the full-bleed hero
// photo) and turns solid navy once scrolled; every other page opens with a navy band, so it is
// solid there. Four short links keep the bar uncluttered; below lg the menu is an accessible dialog.
export function Header({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on route change.
  useEffect(() => setOpen(false), [pathname])

  // Focus trap + Esc + scroll lock while the mobile dialog is open.
  useEffect(() => {
    if (!open) return
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href],button')
    focusable?.[0]?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close()
      if (e.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const solid = scrolled || pathname !== '/'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        pathname === '/' && 'theme-dark',
        solid ? 'bg-hero/95 backdrop-blur' : 'bg-gradient-to-b from-hero/70 to-transparent',
        // The home hero runs straight under the header, so there is no dividing line there; other pages keep the thin line.
        pathname !== '/' && 'border-b border-white/10',
      )}
    >
      <div className={cn('mx-auto grid h-[var(--header-h)] w-full max-w-[77.5rem] grid-cols-[1fr_auto] items-center gap-6 px-5 lg:grid-cols-[1fr_auto_1fr]')}>
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'relative py-2 text-[15px] font-medium text-white/90 transition-colors hover:text-white',
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100',
                isActive(item.href) && 'text-white after:scale-x-100',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <Button href="/submit-a-problem" className="hidden px-5 py-2.5 sm:inline-flex">
            Submit your problem
          </Button>
          <button
            ref={toggleRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
            className="flex size-11 items-center justify-center rounded-lg text-white lg:hidden"
          >
            <Menu aria-hidden className="size-6" />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-hero px-5 py-3 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" aria-label="Close menu" onClick={close} className="flex size-11 items-center justify-center rounded-lg text-white">
              <X aria-hidden className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn('rounded-lg px-3 py-3 text-xl font-semibold hover:bg-white/10', isActive(item.href) ? 'text-accent' : 'text-white')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button href="/submit-a-problem" className="mt-6">
            Submit your problem
          </Button>
        </div>
      )}
    </header>
  )
}
