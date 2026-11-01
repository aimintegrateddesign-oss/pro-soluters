import { createElement, type ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Footer } from '@/components/layout/Footer'
import { navigation, siteSettings } from '@/data/site'
import { getSiteSettings } from '@/lib/queries/content'

const payload = vi.hoisted(() => ({ findGlobal: vi.fn() }))
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => payload }))
vi.mock('next/link', () => ({
  default: ({ children, ...props }: ComponentProps<'a'>) => createElement('a', props, children),
}))
vi.mock('@/components/layout/Logo', () => ({
  Logo: () => createElement('a', { href: '/' }, 'Pro Solutors'),
}))

const email = 'zaidmohiyuddin21@gmail.com'
const phone = '+61 459 258 322'
const address = '49 Sweeney Ave, Plumpton, Sydney'
const contactSettings = { ...siteSettings, notificationEmail: email, phone, address }
const footerMarkup = (settings = contactSettings, nav = navigation) => renderToStaticMarkup(createElement(Footer, { settings, navigation: nav }))

beforeEach(() => {
  vi.stubEnv('OFFLINE_DATA', 'false')
  payload.findGlobal.mockReset().mockResolvedValue({})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('footer contact details', () => {
  it('shows the supplied address, email and actionable international phone number', () => {
    const markup = footerMarkup()

    expect(markup).toContain(address)
    expect(markup).toContain(phone)
    expect(markup).toContain(email)
    expect(markup).toContain('href="mailto:zaidmohiyuddin21@gmail.com"')
    expect(markup).toContain('href="tel:+61459258322"')
  })

  it('keeps navigation, submission CTA, response time and confidentiality content', () => {
    const markup = footerMarkup()

    expect(markup).toContain('href="/submit-a-problem"')
    expect(markup).toContain('href="/solutions/improve-and-innovate"')
    expect(markup).toContain('href="/about"')
    expect(markup).toContain(navigation.footer.responseTime)
    expect(markup).toContain(navigation.footer.confidentiality)
    expect(markup).toContain('All rights reserved.')
  })

  it('continues excluding retired columns from older saved navigation', () => {
    const savedNavigation = {
      ...navigation,
      footerColumns: [
        ...navigation.footerColumns,
        { title: ' Disciplines ', links: [{ label: 'Retired discipline link', href: '/who-we-serve' }] },
        { title: 'For institutions', links: [{ label: 'Retired institutions link', href: '/who-we-serve' }] },
      ],
    }
    const markup = footerMarkup(contactSettings, savedNavigation)

    expect(markup).not.toContain('Retired discipline link')
    expect(markup).not.toContain('Retired institutions link')
    expect(markup).toContain('Solutions')
    expect(markup).toContain('Company')
    expect(markup).toContain(address)
  })
})

describe('editable site contact settings', () => {
  it('provides the requested contact defaults for an empty CMS document', async () => {
    const page = await getSiteSettings()

    expect(page.content).toMatchObject({ notificationEmail: email, phone, address })
    expect(payload.findGlobal).toHaveBeenCalledWith({ slug: 'site-settings', depth: 1 })
  })

  it.each(['hello@prosolutors.com', ' HELLO@PROSOLUTORS.COM '])('replaces only the retired template email %s', async (legacyEmail) => {
    payload.findGlobal.mockResolvedValue({
      notificationEmail: legacyEmail,
      tagline: 'A saved tagline',
      promiseText: 'A saved response promise',
      meta: { title: 'Saved search title' },
    })

    const page = await getSiteSettings()

    expect(page.content).toMatchObject({
      notificationEmail: email,
      phone,
      address,
      tagline: 'A saved tagline',
      promiseText: 'A saved response promise',
    })
    expect(page.seo.title).toBe('Saved search title')
  })

  it('preserves custom contact fields saved by an editor', async () => {
    const custom = {
      notificationEmail: 'engineer@example.test',
      phone: '+61 2 1234 5678',
      address: 'An updated office address',
      tagline: 'A custom tagline',
      meta: { title: 'Custom site title' },
    }
    payload.findGlobal.mockResolvedValue(custom)

    const page = await getSiteSettings()

    expect(page.content).toMatchObject({ notificationEmail: custom.notificationEmail, phone: custom.phone, address: custom.address, tagline: custom.tagline })
    expect(page.seo.title).toBe(custom.meta.title)
    expect(footerMarkup(page.content)).toContain('href="tel:+61212345678"')
    expect(footerMarkup(page.content)).toContain('href="mailto:engineer@example.test"')
  })

  it('fills new contact fields when older CMS records have null or blank values', async () => {
    payload.findGlobal.mockResolvedValue({ notificationEmail: email, phone: null, address: '   ' })

    expect((await getSiteSettings()).content).toMatchObject({ notificationEmail: email, phone, address })
  })

  it('keeps the same contact defaults in offline mode without querying Payload', async () => {
    vi.stubEnv('OFFLINE_DATA', 'true')

    expect((await getSiteSettings()).content).toMatchObject({ notificationEmail: email, phone, address })
    expect(payload.findGlobal).not.toHaveBeenCalled()
  })
})
