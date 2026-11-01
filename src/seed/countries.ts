import type { Payload } from 'payload'

import { COUNTRIES } from '../data/countries'

/** Add missing country codes only. Saved country names and unrelated collections are never overwritten. */
export async function seedCountries(payload: Payload): Promise<{ created: number; skipped: number }> {
  const { docs } = await payload.find({
    collection: 'countries',
    select: { code: true },
    limit: 1_000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  const existingCodes = new Set(docs.map((country) => country.code.trim().toUpperCase()))
  let created = 0
  for (const country of COUNTRIES) {
    if (existingCodes.has(country.code)) continue
    await payload.create({
      collection: 'countries',
      data: { code: country.code, name: country.name },
      depth: 0,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    existingCodes.add(country.code)
    created += 1
  }
  return { created, skipped: COUNTRIES.length - created }
}
