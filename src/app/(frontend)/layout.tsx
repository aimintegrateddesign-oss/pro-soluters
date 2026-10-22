import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { headerNav, siteSettings } from '@/data/site'
import { getServerSideURL } from '@/utilities/getURL'

import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: { default: `Pro Solutors | ${siteSettings.tagline}`, template: '%s | Pro Solutors' },
  description: siteSettings.description,
  icons: { icon: '/favicon.png' },
  openGraph: {
    siteName: 'Pro Solutors',
    type: 'website',
    title: 'Pro Solutors',
    description: siteSettings.description,
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630, alt: 'Pro Solutors. Research. Solve. Align.' }],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Pro Solutors',
  slogan: siteSettings.tagline,
  description: siteSettings.description,
  url: getServerSideURL(),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded bg-card px-4 py-2 font-bold text-heading focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header nav={headerNav} />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  )
}
