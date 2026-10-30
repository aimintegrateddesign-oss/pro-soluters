import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ds/primitives'
import type { navigation } from '@/data/site'
import type { SiteSettings } from '@/data/types'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'

// The footer is always navy (theme-dark), so its text contrast holds on every page and in either OS theme.
export function Footer({ settings, navigation: nav }: { settings: SiteSettings; navigation: typeof navigation }) {
  // Retired columns may still be present in saved CMS navigation.
  const footerColumns = nav.footerColumns.filter(({ title }) => !['disciplines', 'for institutions'].includes(title.trim().toLowerCase()))
  const contact = [
    { label: 'Email an engineer', value: settings.notificationEmail, href: `mailto:${settings.notificationEmail}` },
    { label: 'Response time', value: nav.footer.responseTime },
    { label: 'Confidential', value: nav.footer.confidentiality },
  ]
  // Split at the first full stop followed by a space: "Pro Solutors." and "All rights reserved."
  const copyrightParts = nav.footer.copyright.match(/^(.*?\.)\s+(.+)$/)
  const copyrightLeft = copyrightParts?.[1] ?? nav.footer.copyright
  const copyrightRight = copyrightParts?.[2] ?? ''
  return (
    <footer className="theme-dark relative overflow-hidden border-t border-accent/40 bg-[#050e19] text-ink">
      <div className="mx-auto w-full max-w-[90rem] px-5 pt-10">
        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <Logo variant="full" />
            <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-muted">{nav.footer.blurb}</p>
            <Button href="/submit-a-problem" className="mt-6">
              Submit your problem
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="border-b border-line pb-2 text-[13px] font-bold text-accent [font-family:var(--font-sans)] !tracking-normal">{col.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href === '#' ? (
                        // Placeholder entry (e.g. Blog before it exists): looks like a link but goes nowhere.
                        <span className="text-[15px] leading-snug text-white">{l.label}</span>
                      ) : (
                        <Link
                          href={l.href}
                          className={cn(
                            'text-[15px] leading-snug hover:text-accent',
                            l.accent ? 'font-semibold text-accent' : l.muted ? 'text-muted' : 'text-white',
                            )}
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="border-b border-line pb-2 text-[13px] font-bold text-accent [font-family:var(--font-sans)] !tracking-normal">Contact</h2>
              <ul className="mt-3 space-y-4">
                {contact.map(({ label, value, href }) => (
                  <li key={label} className="min-w-0">
                    <p className="text-[12px] text-muted">{label}</p>
                    {href ? (
                      <a href={href} className="text-[14px] font-semibold leading-snug text-white hover:text-accent [overflow-wrap:anywhere]">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[15px] font-semibold leading-snug text-white">{value}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* The copyright text splits at its first full stop: the name on the left, "All rights reserved." on the right. */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line py-5 text-[13px] text-muted">
          <p>
            © {new Date().getFullYear()} {copyrightLeft}
          </p>
          {copyrightRight && <p>{copyrightRight}</p>}
        </div>
      </div>
    </footer>
  )
}
