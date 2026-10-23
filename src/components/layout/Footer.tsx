import { ArrowRight, Clock, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ds/primitives'
import { footerColumns, footerLinks, siteSettings } from '@/data/site'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'

const contact = [
  { icon: Mail, label: 'Email an engineer', value: siteSettings.notificationEmail, href: `mailto:${siteSettings.notificationEmail}` },
  { icon: Clock, label: 'Response time', value: 'Within 2 working days' },
  { icon: ShieldCheck, label: 'Confidential', value: 'NDA first on request' },
]

// The footer is always navy (theme-dark), so its text contrast holds on every page and in either OS theme.
export function Footer() {
  return (
    <footer className="theme-dark bg-blueprint relative overflow-hidden border-t border-accent/40 bg-[#050e19] text-ink">
      <div className="mx-auto w-full max-w-[77.5rem] px-5 pt-10">
        <ul className="grid divide-line overflow-hidden rounded-[4px] border border-line bg-[#09172a] md:grid-cols-3 md:divide-x">
          {contact.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-center gap-4 p-4">
              <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent">
                <Icon className="size-5" />
              </span>
              <p className="min-w-0 text-[13px] text-muted">
                {label}
                {href ? (
                  <a href={href} className="block truncate text-[16px] font-bold text-white hover:text-accent">
                    {value}
                  </a>
                ) : (
                  <span className="block text-[16px] font-bold text-white">{value}</span>
                )}
              </p>
            </li>
          ))}
        </ul>

        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <div>
            <Logo variant="full" />
            <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-muted">
              Practical engineering solutions that solve problems, improve performance and align your data. Research-led, evidence-based and
              built only for engineering organisations worldwide.
            </p>
            <Button href="/submit-a-problem" className="mt-6">
              Submit your problem
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="border-b border-line pb-2 text-[13px] font-bold text-accent [font-family:var(--font-sans)] !tracking-normal">{col.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className={cn(
                          'text-[15px] leading-snug hover:text-accent',
                          l.accent ? 'font-semibold text-accent' : l.muted ? 'text-muted' : 'text-white',
                        )}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

                <div className="flex flex-col items-start justify-between gap-3 border-t border-line py-5 text-[13px] text-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Pro Solutors. All rights reserved.</p>
          <p>Sample reports and case studies are illustrative and fictional.</p>
          <nav aria-label="Legal" className="flex gap-5">
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-white hover:text-accent">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
