import Link from 'next/link'

import { footerLinks, siteSettings } from '@/data/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-hero px-5 py-7 text-center text-sm text-[#9db0c2]">
      <Logo variant="full" className="mb-4" />
      <p>
        © Pro Solutors · Research. Solve. Align. ·{' '}
        <a className="text-on-navy-muted underline-offset-2 hover:underline" href={`mailto:${siteSettings.notificationEmail}`}>
          {siteSettings.notificationEmail}
        </a>
      </p>
      <nav aria-label="Legal" className="mt-2 flex justify-center gap-4">
        {footerLinks.map((l) => (
          <Link key={l.href} href={l.href} className="text-on-navy-muted underline-offset-2 hover:underline">
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="mt-2 text-xs">Sample reports and case studies are illustrative and fictional.</p>
    </footer>
  )
}
