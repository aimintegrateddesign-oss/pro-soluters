import type { GlobalConfig } from 'payload'

import { area, ctaGroup, flag, group, heroGroup, lines, makeGlobal, rows, text } from './helpers'

const link = [text('label', 'Label', { required: true }), text('href', 'Link', { required: true, admin: { description: 'e.g. /solutions or https://example.com' } })]
const sectionHead = (name: string, label: string) => group(name, label, [text('title', 'Heading'), area('lead', 'Lead line')])

export const SiteSettings = makeGlobal({
  slug: 'site-settings',
  label: 'Site settings',
  description: 'Company-wide text: tagline, contact email, the promise line and the sample disclaimer. The SEO tab is the site default.',
  content: [
    text('tagline', 'Tagline'),
    area('description', 'Site description'),
    area('promiseText', 'Promise line', { admin: { description: 'Shown in the hero, on the Submit page and in call-to-action panels.' } }),
    text('notificationEmail', 'Contact email'),
    area('sampleDisclaimerText', 'Sample disclaimer', { admin: { description: 'Shown on sample case studies and reports.' } }),
  ],
})

export const Navigation = makeGlobal({
  slug: 'navigation',
  label: 'Navigation and footer',
  description: 'Header links, footer columns and footer text.',
  seo: false,
  content: [
    rows('headerNav', 'Header links', link),
    group('footer', 'Footer text', [
      area('blurb', 'Description under the logo'),
      text('responseTime', 'Response time'),
      text('confidentiality', 'Confidentiality line'),
      text('sampleNote', 'Sample content note'),
      text('copyright', 'Copyright (the year is added automatically)'),
    ]),
    rows('footerColumns', 'Footer columns', [text('title', 'Column title', { required: true }), rows('links', 'Links', [...link, flag('muted', 'Muted (greyed out)'), flag('accent', 'Highlighted')])]),
    rows('legalLinks', 'Legal links', link),
  ],
})

export const HomePage = makeGlobal({
  slug: 'home-page',
  label: 'Home page',
  content: [
    group('hero', 'Hero', [
      text('eyebrow', 'Small label'),
      text('headline', 'Headline (white part)'),
      text('headlineAccent', 'Headline (teal part)'),
      area('intro', 'Intro'),
      text('primaryCta', 'Main button label'),
      text('secondaryCta', 'Second button label'),
      rows(
        'stages',
        'Solution pillars (three)',
        [
          { name: 'icon', type: 'select', required: true, options: ['search-check', 'trending-up', 'database'] },
          text('label', 'Short name', { required: true }),
          text('text', 'Short description'),
        ],
        { minRows: 3, maxRows: 3 },
      ),
    ]),
    group('why', 'Problems section', [text('title', 'Heading'), area('lead', 'Lead line'), rows('items', 'Cards', [text('title', 'Title', { required: true }), area('text', 'Text', { required: true })])]),
    sectionHead('solutions', 'Solutions section heading'),
    group('path', 'Path section', [text('title', 'Heading'), area('lead', 'Lead line'), rows('steps', 'Steps', [text('title', 'Title', { required: true }), area('text', 'Text', { required: true })])]),
    ctaGroup(),
  ],
})

export const CaseStudiesPage = makeGlobal({
  slug: 'case-studies-page',
  label: 'Case studies page',
  description: 'Heading and call to action of the case studies list. The studies themselves are in the Case studies collection.',
  content: [heroGroup(), ctaGroup()],
})

export const SolutionsPage = makeGlobal({
  slug: 'solutions-page',
  label: 'Solutions page',
  description: 'Text on the Solutions overview. The three solutions themselves are in the Solutions collection.',
  content: [
    heroGroup(),
    group('fit', 'Which solution fits you?', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('items', 'Sentences', [
        text('quote', 'What the visitor says', { required: true }),
        text('startWith', 'Start with', { required: true, admin: { description: 'The exact name of a solution, or "Free Problem Review".' } }),
      ]),
    ]),
    group('how', 'How we work', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('steps', 'Steps', [text('title', 'Title', { required: true }), text('description', 'Short description', { required: true }), area('detail', 'Detail'), text('youGet', 'You get')]),
    ]),
    ctaGroup(),
  ],
})

export const WhoWeServePage = makeGlobal({
  slug: 'who-we-serve-page',
  label: 'Who we serve page',
  content: [
    heroGroup(),
    group('audiences', 'Audiences', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('items', 'Audience cards', [
        text('code', 'Two-letter code', { required: true, maxLength: 3 }),
        text('title', 'Title', { required: true }),
        area('text', 'Text', { required: true }),
        text('lead', 'Lead solution'),
        text('start', 'Starting offer'),
      ]),
    ]),
    group('domains', 'Engineering domains', [text('title', 'Heading'), area('lead', 'Lead line'), rows('items', 'Domains', [text('name', 'Name', { required: true }), text('note', 'Note, e.g. Coming soon')])]),
    group('reassurance', 'Reassurance for institutional buyers', [text('title', 'Heading'), area('lead', 'Lead line'), lines('items', 'Points')]),
    ctaGroup(),
  ],
})

export const SampleReportPage = makeGlobal({
  slug: 'sample-report-page',
  label: 'Sample report page',
  description: 'The fictional sample report. Keep figures in step with the sample case study PS-SAMPLE-001.',
  content: [
    group('hero', 'Hero', [
      text('tag', 'Tag'),
      text('title', 'Heading (white part)'),
      text('accent', 'Heading (teal part)'),
      area('intro', 'Intro'),
      text('primaryCta', 'Main button label'),
      text('secondaryCta', 'Second button label'),
    ]),
    area('notice', 'Sample notice (shown after a bold "Sample only.")'),
    group('report', 'Report card', [text('title', 'Title'), text('client', 'Client'), text('project', 'Project'), text('decision', 'Decision needed')]),
    group('summary', 'Summary card', [text('title', 'Title'), area('text', 'Text')]),
    group('options', 'Options compared', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('rows', 'Options', [
        text('option', 'Option', { required: true }),
        text('capital', 'Capital'),
        text('energy', 'Energy / yr'),
        text('maintenance', 'Maintenance / yr'),
        text('total', '10-year total', { admin: { description: 'The option with the lowest total is highlighted.' } }),
        text('risk', 'Main risk'),
      ]),
      area('note', 'Note under the table'),
    ]),
    group('conditions', 'Conditions card', [text('title', 'Title'), lines('items', 'Items')]),
    group('risks', 'Risks card', [text('title', 'Title'), lines('items', 'Items')]),
    group('assumptions', 'Assumptions card', [text('title', 'Title'), lines('items', 'Items')]),
    group('example', 'Worked example card', [text('title', 'Title'), area('text', 'Text'), text('linkLabel', 'Link label')]),
    group('feedback', 'Client feedback card', [text('title', 'Title'), area('text', 'Text'), text('buttonLabel', 'Button label')]),
    group('sheet', 'Hero report sheet', [
      text('reference', 'Reference'),
      text('title', 'Title'),
      text('recommendation', 'Recommendation'),
      area('recommendationText', 'Recommendation text'),
      rows('scores', 'Scores', [text('label', 'Label', { required: true }), { name: 'score', type: 'number', min: 0, max: 100, required: true }, flag('best', 'Recommended option')], { maxRows: 4 }),
    ]),
    ctaGroup(),
  ],
})

export const SubmitPage = makeGlobal({
  slug: 'submit-page',
  label: 'Submit page',
  description: 'Text around the Submit your problem form. The form fields and their options are part of the code.',
  content: [
    heroGroup(),
    group('next', 'What happens next', [text('title', 'Heading'), lines('steps', 'Steps')]),
    group('thanks', 'Thank-you page', [text('eyebrow', 'Small label'), text('title', 'Heading'), area('text', 'Text')]),
  ],
})

export const LegalPages = makeGlobal({
  slug: 'legal-pages',
  label: 'Legal pages',
  description: 'Privacy policy, Terms of use and any other simple text page. The slug becomes the URL, e.g. privacy gives /privacy.',
  seo: false,
  content: [
    rows('pages', 'Pages', [
      text('slug', 'URL slug', { required: true, admin: { description: 'Lowercase, no spaces, e.g. privacy' } }),
      text('title', 'Title', { required: true }),
      { name: 'updated', type: 'date', label: 'Last updated', admin: { date: { pickerAppearance: 'dayOnly' } } },
      rows('sections', 'Sections', [text('heading', 'Heading', { required: true }), area('text', 'Text', { required: true })]),
    ]),
  ],
})

export const siteGlobals: GlobalConfig[] = [SiteSettings, Navigation, HomePage, CaseStudiesPage, SolutionsPage, WhoWeServePage, SampleReportPage, SubmitPage, LegalPages]
