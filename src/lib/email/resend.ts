import { Resend } from 'resend'

let client: Resend | undefined

/** Lazy singleton: fails fast with a clear message when the key is missing. Server-only. */
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return (client ??= new Resend(key))
}
