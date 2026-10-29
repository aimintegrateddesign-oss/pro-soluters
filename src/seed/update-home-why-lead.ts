/**
 * One-off content update: the home page "Why engineering organisations call us" lead text (now shown under the heading).
 * Writes only home.why.lead and leaves everything else on the page untouched. Safe to re-run.
 *
 *   npx cross-env NODE_OPTIONS=--no-deprecation payload run src/seed/update-home-why-lead.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { homePage } from '../data/site'

const payload = await getPayload({ config })
const col = (payload.db as unknown as { connection: { collection: (n: string) => { updateOne: Function; findOne: Function } } }).connection.collection('site-pages')
await col.updateOne({ slug: 'home' }, { $set: { 'home.why.lead': homePage.why.lead } })
const doc = (await col.findOne({ slug: 'home' })) as { home: { why: { lead: string } } }
console.log('home.why.lead is now:', doc.home.why.lead)
process.exit(0)
