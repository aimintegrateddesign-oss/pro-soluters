import type { Payload } from 'payload'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { COUNTRIES, findCountryByName, normalizeCountrySearch } from '@/data/countries'
import { getCountries } from '@/lib/queries/countries'
import { validateSubmission, type SubmissionFields } from '@/lib/validation/submission'
import { seedCountries } from '@/seed/countries'

const payload = vi.hoisted(() => ({ find: vi.fn() }))
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => payload }))

beforeEach(() => {
  vi.stubEnv('OFFLINE_DATA', 'false')
  payload.find.mockReset().mockResolvedValue({ docs: [] })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('country reference data', () => {
  it('contains a complete, unique two-letter country and territory list', () => {
    expect(COUNTRIES).toHaveLength(249)
    expect(new Set(COUNTRIES.map(({ code }) => code)).size).toBe(249)
    expect(new Set(COUNTRIES.map(({ name }) => name)).size).toBe(249)
    expect(COUNTRIES.every(({ code, name }) => /^[A-Z]{2}$/.test(code) && name.length > 0 && name.length <= 80)).toBe(true)
    expect(COUNTRIES).toEqual(expect.arrayContaining([
      { code: 'PK', name: 'Pakistan' },
      { code: 'AU', name: 'Australia' },
      { code: 'US', name: 'United States' },
    ]))
  })

  it('matches complete names case-insensitively and ignores accents while rejecting partial search text', () => {
    expect(findCountryByName('  pAKISTAN  ')?.code).toBe('PK')
    expect(findCountryByName('COTE D’IVOIRE')?.code).toBe('CI')
    expect(normalizeCountrySearch('  ÅLAND  ')).toBe('aland')
    expect(findCountryByName('Pak')).toBeUndefined()
    expect(findCountryByName('Atlantis')).toBeUndefined()
    expect(findCountryByName('')).toBeUndefined()
  })
})

describe('CMS-backed country options', () => {
  it('keeps the complete list before seeding', async () => {
    expect(await getCountries()).toHaveLength(249)
    expect(payload.find).toHaveBeenCalledWith(expect.objectContaining({ collection: 'countries', pagination: false, depth: 0 }))
  })

  it('merges a partial seed and custom CMS labels by country code', async () => {
    payload.find.mockResolvedValue({ docs: [
      { code: ' au ', name: 'Australia (edited)' },
      { code: 'XK', name: 'Kosovo' },
    ] })
    const countries = await getCountries()

    expect(countries).toHaveLength(250)
    expect(countries.filter(({ code }) => code === 'AU')).toEqual([{ code: 'AU', name: 'Australia (edited)' }])
    expect(countries).toContainEqual({ code: 'PK', name: 'Pakistan' })
    expect(countries).toContainEqual({ code: 'XK', name: 'Kosovo' })
    expect(countries.map(({ name }) => name)).toEqual(countries.map(({ name }) => name).sort((a, b) => a.localeCompare(b, 'en')))
  })

  it('does not replace valid defaults with malformed or empty CMS options', async () => {
    payload.find.mockResolvedValue({ docs: [
      { code: 'AU', name: '   ' },
      { code: 'invalid', name: 'Invalid option' },
      { code: 'PK', name: 'x'.repeat(81) },
    ] })
    const countries = await getCountries()

    expect(countries).toHaveLength(249)
    expect(countries).toContainEqual({ code: 'AU', name: 'Australia' })
    expect(countries).toContainEqual({ code: 'PK', name: 'Pakistan' })
  })

  it('provides all options offline without accessing Payload', async () => {
    vi.stubEnv('OFFLINE_DATA', 'true')

    expect(await getCountries()).toHaveLength(249)
    expect(payload.find).not.toHaveBeenCalled()
  })

  it('falls back safely if the CMS is unavailable without exposing connection details', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    payload.find.mockRejectedValue(new Error('private database connection details'))

    expect(await getCountries()).toHaveLength(249)
    expect(warning).toHaveBeenCalled()
    expect(JSON.stringify(warning.mock.calls)).not.toContain('private database connection details')
  })
})

describe('country-only seeding', () => {
  it('adds only missing country codes, preserves existing labels, and is safe to repeat', async () => {
    const records = new Map([['PK', { code: 'PK', name: 'Pakistan (edited)' }]])
    const find = vi.fn(async (_args: { collection: string }) => ({ docs: [...records.values()] }))
    const create = vi.fn(async ({ data }: { data: { code: string; name: string } }) => {
      records.set(data.code, { ...data })
      return data
    })
    const database = { find, create } as unknown as Payload

    expect(await seedCountries(database)).toEqual({ created: 248, skipped: 1 })
    expect(records.size).toBe(249)
    expect(records.get('PK')?.name).toBe('Pakistan (edited)')
    expect(create).toHaveBeenCalledTimes(248)
    expect(create.mock.calls.every(([args]) => args.data.code !== 'PK')).toBe(true)
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ collection: 'countries', overrideAccess: true, context: { disableRevalidate: true } }))

    expect(await seedCountries(database)).toEqual({ created: 0, skipped: 249 })
    expect(create).toHaveBeenCalledTimes(248)
    expect(find).toHaveBeenCalledTimes(2)
    expect(find.mock.calls.every(([args]) => args.collection === 'countries')).toBe(true)
  })
})

describe('submission country validation', () => {
  const valid: SubmissionFields = {
    name: 'Test Engineer', company: 'Example Engineering', email: 'engineer@example.test', country: 'Pakistan',
    orgType: 'consultant', discipline: 'civil', solution: 'not-sure', urgency: 'exploring',
    description: 'We need a feasibility review for an engineering project.', consent: true,
  }

  it('requires a real selected country rather than accepting any search text', () => {
    expect(validateSubmission(valid).country).toBeUndefined()
    expect(validateSubmission({ ...valid, country: 'Pak' }).country).toBeTruthy()
    expect(validateSubmission({ ...valid, country: 'Atlantis' }).country).toBeTruthy()
  })

  it('uses the same editable country names supplied by Payload', () => {
    const options = [{ code: 'AU', name: 'Australia (edited)' }]

    expect(validateSubmission({ ...valid, country: 'Australia (edited)' }, options).country).toBeUndefined()
    expect(validateSubmission({ ...valid, country: 'Australia' }, options).country).toBeTruthy()
    expect(findCountryByName(' australia (EDITED) ', options)?.name).toBe('Australia (edited)')
  })
})
