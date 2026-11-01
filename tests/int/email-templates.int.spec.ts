import { describe, expect, it } from 'vitest'

import { escapeHtml, renderTeamNotification, renderThankYou, singleLine } from '@/lib/email/templates'

const data = {
  name: 'Ada\r\nBcc: evil@x.com',
  company: '<b>Acme</b>',
  email: 'ada@example.com',
  country: 'Pakistan',
  orgType: 'consultant',
  discipline: 'civil',
  solution: 'Solve and Prove',
  urgency: 'urgent',
  description: '<script>alert(1)</script> a long enough problem description',
}

describe('email templates', () => {
  it('escapes HTML in user text', () => {
    expect(escapeHtml('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;')
    const { html } = renderTeamNotification(data, 'https://example.com')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<b>Acme</b>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('keeps newlines out of subjects', () => {
    expect(singleLine('a\r\nb\tc')).toBe('a b c')
    const { subject } = renderTeamNotification(data, 'https://example.com')
    expect(subject).not.toMatch(/[\r\n]/)
    expect(subject).toContain('Urgent')
  })

  it('renders thank-you with a plain-text version', () => {
    const mail = renderThankYou(data, 'https://example.com')
    expect(mail.text).toContain('Thank you')
    expect(mail.html).toContain('one business day')
  })
})
