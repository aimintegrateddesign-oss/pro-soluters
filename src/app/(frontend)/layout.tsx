import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getNavigation, getSiteSettings } from '@/lib/queries/content'
import { getServerSideURL } from '@/utilities/getURL'

import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const interTight = Inter_Tight({ subsets: ['latin'], display: 'swap', weight: ['700', '800'], variable: '--font-inter-tight' })

// Site-wide defaults. Each page overrides title, description and image from its own SEO fields in Payload.
export async function generateMetadata(): Promise<Metadata> {
  const { content: settings, seo } = await getSiteSettings()
  const title = seo.title ?? `Pro Solutors | ${settings.tagline}`
  const description = seo.description ?? settings.description
  return {
    metadataBase: new URL(getServerSideURL()),
    title: { default: title, template: '%s | Pro Solutors' },
    description,
    icons: { icon: '/favicon.png' },
    openGraph: {
      siteName: 'Pro Solutors',
      type: 'website',
      title: 'Pro Solutors',
      description,
      images: [{ url: seo.image ?? '/images/og-default.jpg', width: 1200, height: 630, alt: 'Pro Solutors. Research. Solve. Align.' }],
    },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [{ content: settings }, { content: nav }] = await Promise.all([getSiteSettings(), getNavigation()])

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pro Solutors',
    slogan: settings.tagline,
    description: settings.description,
    url: getServerSideURL(),
  }

  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded bg-card px-4 py-2 font-bold text-heading focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header nav={nav.headerNav} />
        <main id="main">{children}</main>
        <Footer settings={settings} navigation={nav} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  )
}
