import { DISCIPLINES, ORG_TYPES, URGENCIES } from '@/lib/validation/submission'

export type SubmissionEmailData = {
  name: string
  company: string
  email: string
  country: string
  orgType: string
  discipline: string
  solution?: string | null
  urgency: string
  description: string
}

export type RenderedEmail = { subject: string; html: string; text: string }

const BRAND = { navy: '#0f2a47', accent: '#2f80ed', text: '#1f2937', muted: '#6b7280', line: '#e5e7eb', bg: '#f3f4f6' }

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** Collapses newlines and control characters so user input can never inject headers via a subject line. */
export const singleLine = (s: string, max = 80) =>
  s.replace(/[\r\n\t\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)

const labelOf = (list: readonly { value: string; label: string }[], value: string) => list.find((o) => o.value === value)?.label ?? value

const layout = (title: string, bodyHtml: string, siteUrl: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${BRAND.line};">
<tr><td style="background:${BRAND.navy};padding:20px 28px;"><a href="${escapeHtml(siteUrl)}" style="color:#ffffff;text-decoration:none;font-size:20px;font-weight:bold;letter-spacing:0.02em;">Pro Solutors</a></td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid ${BRAND.line};font-size:12px;color:${BRAND.muted};">Pro Solutors &middot; <a href="${escapeHtml(siteUrl)}" style="color:${BRAND.muted};">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a></td></tr>
</table></td></tr></table></body></html>`

const rows = (data: SubmissionEmailData) => [
  ['Name', data.name],
  ['Organisation', data.company],
  ['Email', data.email],
  ['Country', data.country],
  ['Organisation type', labelOf(ORG_TYPES, data.orgType)],
  ['Discipline', labelOf(DISCIPLINES, data.discipline)],
  ['Solution of interest', data.solution || 'Not sure'],
  ['Urgency', labelOf(URGENCIES, data.urgency)],
]

const detailTable = (data: SubmissionEmailData) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.line};border-collapse:collapse;">${rows(data)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid ${BRAND.line};width:38%;font-size:13px;color:${BRAND.muted};">${escapeHtml(k)}</td><td style="padding:8px 12px;border-bottom:1px solid ${BRAND.line};font-size:14px;">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>`

const messageBlock = (description: string) =>
  `<p style="margin:20px 0 6px;font-size:13px;color:${BRAND.muted};">Problem description</p><div style="border-left:3px solid ${BRAND.accent};padding:4px 0 4px 14px;white-space:pre-wrap;font-size:14px;">${escapeHtml(description)}</div>`

export function renderTeamNotification(data: SubmissionEmailData, siteUrl: string): RenderedEmail {
  const urgency = labelOf(URGENCIES, data.urgency)
  const subject = `New problem submission (${urgency}): ${singleLine(data.name, 60)}`
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;color:${BRAND.navy};">New problem submission</h1>${detailTable(data)}${messageBlock(data.description)}<p style="margin:24px 0 0;"><a href="mailto:${escapeHtml(encodeURI(data.email))}" style="display:inline-block;background:${BRAND.accent};color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:4px;font-weight:bold;">Reply to ${escapeHtml(data.name)}</a></p>`,
    siteUrl,
  )
  const text = [`New problem submission`, '', ...rows(data).map(([k, v]) => `${k}: ${v}`), '', 'Problem description:', data.description].join('\n')
  return { subject, html, text }
}

export function renderThankYou(data: SubmissionEmailData, siteUrl: string, responseTime = 'one business day'): RenderedEmail {
  const subject = 'We have received your problem submission'
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;color:${BRAND.navy};">Thank you, ${escapeHtml(singleLine(data.name, 60))}</h1>
<p style="margin:0 0 14px;">We have received your submission and an engineer will review it. You can expect a reply within ${escapeHtml(responseTime)}.</p>
<p style="margin:0 0 6px;font-size:13px;color:${BRAND.muted};">Here is a copy of what you sent us:</p>${detailTable(data)}${messageBlock(data.description)}
<p style="margin:24px 0 0;color:${BRAND.muted};font-size:13px;">Just reply to this email if you need to add anything.</p>`,
    siteUrl,
  )
  const text = [
    `Thank you, ${singleLine(data.name, 60)}.`,
    '',
    `We have received your submission and an engineer will review it. You can expect a reply within ${responseTime}.`,
    '',
    ...rows(data).map(([k, v]) => `${k}: ${v}`),
    '',
    'Problem description:',
    data.description,
  ].join('\n')
  return { subject, html, text }
}
