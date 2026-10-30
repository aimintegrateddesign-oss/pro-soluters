import { cache } from 'react'

import { COUNTRIES, type CountryOption } from '@/data/countries'
import { getPayloadClient } from '@/lib/payload'
import { isOffline } from './offline'

/** CMS names override the built-in list; partial seeding never hides the remaining countries. */
export const getCountries = cache(async (): Promise<CountryOption[]> => {
  const options = new Map<string, CountryOption>(COUNTRIES.map((country) => [country.code, { ...country }]))
  if (!isOffline()) {
    try {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'countries',
        sort: 'name',
        select: { code: true, name: true },
        limit: 1_000,
        depth: 0,
        pagination: false,
      })
      for (const country of docs) {
        if (typeof country.code !== 'string' || typeof country.name !== 'string') continue
        const code = country.code.trim().toUpperCase()
        const name = country.name.trim()
        if (/^[A-Z]{2}$/.test(code) && name && name.length <= 80) options.set(code, { code, name })
      }
    } catch {
      console.warn('[countries] CMS unavailable; using the built-in country list.')
    }
  }
  return [...options.values()].sort((a, b) => a.name.localeCompare(b.name, 'en') || a.code.localeCompare(b.code))
})
