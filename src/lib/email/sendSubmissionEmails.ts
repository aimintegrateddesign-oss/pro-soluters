import { getResend } from './resend'
import { renderTeamNotification, renderThankYou, singleLine, type SubmissionEmailData } from './templates'

export type EmailResult = { notifiedAt?: string; confirmedAt?: string; error?: string }

const siteUrl = () => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

/**
 * Sends the team notification and the visitor's thank-you independently, so one failing never hides the other.
 * Never throws: failures are returned so the caller can record them without losing the saved submission.
 */
export async function sendSubmissionEmails(data: SubmissionEmailData, submissionId: string): Promise<EmailResult> {
  const from = process.env.EMAIL_FROM
  const to = process.env.NOTIFY_EMAIL
  if (!process.env.RESEND_API_KEY || !from || !to) return { error: 'Email not configured (RESEND_API_KEY, EMAIL_FROM, NOTIFY_EMAIL).' }

  const resend = getResend()
  const url = siteUrl()
  const result: EmailResult = {}
  const errors: string[] = []

  const team = renderTeamNotification(data, url)
  const thanks = renderThankYou(data, url)
  const replyTo = process.env.EMAIL_REPLY_TO || to

  const [teamRes, thanksRes] = await Promise.allSettled([
    resend.emails.send(
      { from, to, replyTo: data.email.trim(), subject: team.subject, html: team.html, text: team.text },
      { idempotencyKey: `submission-team/${submissionId}` },
    ),
    resend.emails.send(
      { from, to: data.email.trim(), replyTo, subject: thanks.subject, html: thanks.html, text: thanks.text },
      { idempotencyKey: `submission-thanks/${submissionId}` },
    ),
  ])

  const settle = (label: string, res: PromiseSettledResult<{ error: { message: string } | null }>, ok: () => void) => {
    if (res.status === 'rejected') errors.push(`${label}: ${singleLine(String(res.reason?.message ?? res.reason), 200)}`)
    else if (res.value.error) errors.push(`${label}: ${singleLine(res.value.error.message, 200)}`)
    else ok()
  }
  settle('team notification', teamRes, () => (result.notifiedAt = new Date().toISOString()))
  settle('thank-you', thanksRes, () => (result.confirmedAt = new Date().toISOString()))

  if (errors.length) result.error = errors.join(' | ')
  return result
}
