/** Seed country options without running the website/content seed. */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { seedCountries } from './countries'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be configured before seeding countries.')
  const payload = await getPayload({ config })
  try {
    const { created, skipped } = await seedCountries(payload)
    payload.logger.info('Countries: ' + created + ' created; ' + skipped + ' existing records preserved.')
  } finally {
    await payload.destroy()
  }
}

// Payload's optional background workers may keep a CLI process alive after the database closes.
main().then(() => process.exit(0)).catch(() => {
  console.error('[seed:countries] Countries could not be seeded. Check the database configuration and country records.')
  process.exit(1)
})
