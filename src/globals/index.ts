import type { GlobalConfig } from 'payload'

import { area, ctaGroup, paragraphs, imageField, definePage, flag, group, heroGroup, lines, makeGlobal, rows, text, type PageDef } from './helpers'

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

export const HomePage = definePage({
  key: 'home',
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
    group('solutions', 'Solutions section', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      group('images', 'Card images', [imageField('improveAndInnovate', 'Improve and Innovate card'), imageField('alignYourTechnicalData', 'Align Your Technical Data card'), imageField('solveAndProve', 'Solve and Prove card')]),
    ]),
    group('about', 'Homepage — About Pro Solutors', [
      { name: 'enabled', type: 'checkbox', label: 'Show this section', defaultValue: true },
      text('eyebrow', 'Small label'),
      text('heading', 'Heading'),
      area('description', 'First paragraph'),
      area('secondaryDescription', 'Second paragraph'),
      text('founderName', 'Founder name'),
      text('founderRole', 'Founder job title'),
      { name: 'founderImage', type: 'upload', relationTo: 'media', label: 'Founder image', admin: { description: 'Upload a professional portrait of the founder. Recommended portrait ratio: 4:5. If no image is uploaded, the website shows a branded placeholder.' } },
      lines('expertise', 'Expertise tags'),
      text('ctaLabel', 'Button label'),
      text('ctaLink', 'Button link', { admin: { description: 'Use an internal route such as /about.' } }),
    ]),
    group('path', 'Path section', [text('title', 'Heading'), area('lead', 'Lead line'), rows('steps', 'Steps', [text('title', 'Title', { required: true }), area('text', 'Text', { required: true })])]),
    ctaGroup(),
  ],
})

export const AboutPage = definePage({
  key: 'about',
  label: 'About Us page',
  description: 'The About Us page (/about). The founder portrait falls back to the image on the Home page About section.',
  content: [
    group('hero', 'Hero', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading'),
      area('intro', 'Intro'),
      area('secondLine', 'Second line'),
      { name: 'image', type: 'upload', relationTo: 'media', label: 'Hero image', admin: { description: 'Optional, landscape 4:3. If empty, a placeholder panel is shown.' } },
    ]),
    group('founder', 'Founder', [
      text('eyebrow', 'Small label'),
      text('name', 'Name'),
      text('role', 'Job title'),
      lines('descriptor', 'Professional descriptor (one item per line)'),
      paragraphs('paragraphs', 'Biography'),
      text('linkedin', 'LinkedIn URL', { admin: { description: 'Optional. Leave empty to hide the LinkedIn button.' } }),
      { name: 'image', type: 'upload', relationTo: 'media', label: 'Portrait', admin: { description: 'Optional, portrait 4:5. If empty, the image from the Home page About section is used, then a placeholder.' } },
    ]),
    group('journey', 'Multidisciplinary journey', [text('title', 'Heading'), paragraphs('paragraphs', 'Paragraphs'), lines('steps', 'Steps (in order)')]),
    group('why', 'Why Pro Solutors exists', [text('title', 'Heading'), paragraphs('paragraphs', 'Paragraphs'), lines('disciplines', 'Connected disciplines')]),
    group('focus', 'Focus areas', [
      text('title', 'Heading'),
      rows('items', 'Focus areas', [text('number', 'Number', { required: true }), text('label', 'Label (Improve, Align or Solve)', { required: true }), text('title', 'Title', { required: true }), area('text', 'Description', { required: true })], { maxRows: 3 }),
    ]),
    group('philosophy', 'Philosophy', [text('eyebrow', 'Small label'), text('statement', 'Statement (one sentence per line on the page)'), area('support', 'Supporting line')]),
    group('vision', 'Global vision', [text('eyebrow', 'Small label'), text('title', 'Heading'), paragraphs('paragraphs', 'Paragraphs')]),
    ctaGroup(),
  ],
})

export const CaseStudiesPage = definePage({
  key: 'caseStudies',
  label: 'Case studies page',
  description: 'Heading and call to action of the case studies list. The studies themselves are in the Case studies collection.',
  content: [
    group('hero', 'Hero', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading (first part)'),
      text('accent', 'Heading (teal part)'),
      area('intro', 'Supporting copy'),
      area('disclosure', 'Sample disclosure'),
      text('primaryLabel', 'Main button label (scrolls to the results)'),
      text('secondaryLabel', 'Second button label (sample report)'),
      imageField('image', 'Hero image'),
    ]),
    ctaGroup(),
  ],
})

export const SolutionsPage = definePage({
  key: 'solutions',
  label: 'Solutions page',
  description: 'Text on the Solutions overview. The three solutions themselves are in the Solutions collection.',
  content: [
    group('hero', 'Hero', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading (first part)'),
      text('accent', 'Heading (teal part)'),
      area('intro', 'Intro'),
      text('primaryLabel', 'Main button label'),
      text('secondaryLabel', 'Second button label (scrolls to the finder)'),
      lines('flow', 'Visual flow (four labels)'),
      imageField('image', 'Hero image'),
    ]),
    group('navigator', 'Solution navigator', [
      rows('items', 'Cards (in order: Improve, Align, Solve)', [text('number', 'Number', { required: true }), text('label', 'Label', { required: true }), text('text', 'Description', { required: true }), text('cta', 'Link text', { required: true })], { minRows: 3, maxRows: 3 }),
    ]),
    group('improve', 'Improve and Innovate', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading'),
      area('value', 'Value proposition'),
      lines('sequence', 'Visual sequence (labels under the visual)'),
      text('analyseTitle', 'Analysis list heading'),
      lines('analyse', 'What we analyse'),
      text('receiveTitle', 'Deliverables list heading'),
      lines('receive', 'What you receive'),
      text('offerName', 'Entry offer name'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link', { admin: { description: 'e.g. /solutions/improve-and-innovate' } }),
      imageField('image', 'Photo'),
    ]),
    group('align', 'Align Your Technical Data', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading'),
      area('value', 'Value proposition'),
      lines('sequence', 'Visual sequence (labels under the visual)'),
      text('analyseTitle', 'Analysis list heading'),
      lines('analyse', 'What we analyse'),
      text('receiveTitle', 'Deliverables list heading'),
      lines('receive', 'What you receive'),
      text('offerName', 'Entry offer name'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link', { admin: { description: 'e.g. /solutions/improve-and-innovate' } }),
      imageField('image', 'Photo'),
    ]),
    group('solve', 'Solve and Prove', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading'),
      area('value', 'Value proposition'),
      lines('sequence', 'Visual sequence (labels under the visual)'),
      text('analyseTitle', 'Analysis list heading'),
      lines('analyse', 'What we analyse'),
      text('receiveTitle', 'Deliverables list heading'),
      lines('receive', 'What you receive'),
      text('offerName', 'Entry offer name'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link', { admin: { description: 'e.g. /solutions/improve-and-innovate' } }),
      imageField('image', 'Photo'),
    ]),
    group('finder', 'Which solution fits your challenge?', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('options', 'Challenge options', [
        text('statement', 'What the visitor says', { required: true }),
        text('resultTitle', 'Recommendation title', { required: true }),
        area('resultText', 'Recommendation text'),
        text('offer', 'Entry offer (optional)'),
        text('ctaLabel', 'Main button label'),
        text('ctaHref', 'Main button link'),
        text('learnLabel', 'Second link label (optional)'),
        text('learnHref', 'Second link'),
      ]),
    ]),
    group('how', 'How we work', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('steps', 'Steps', [text('title', 'Title', { required: true }), text('description', 'Short description', { required: true }), area('detail', 'Detail'), text('youGet', 'You get')]),
      text('previewTitle', 'Report preview title'),
      lines('previewItems', 'Report preview contents'),
      text('previewLinkLabel', 'Report preview link label'),
    ]),
  ],
})

export const WhoWeServePage = definePage({
  key: 'whoWeServe',
  label: 'Who we serve page',
  content: [
    group('hero', 'Hero', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading (first part)'),
      text('accent', 'Heading (teal part)'),
      area('intro', 'Intro'),
      area('support', 'Supporting line'),
      text('primaryLabel', 'Main button label'),
      text('secondaryLabel', 'Second button label'),
      lines('labels', 'Audience labels (four short names)'),
      imageField('image', 'Hero image'),
    ]),
    group('audiences', 'Audiences', [
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('items', 'Audience cards', [
        text('code', 'Initials', { required: true, maxLength: 4 }),
        text('title', 'Title', { required: true }),
        area('text', 'Who they are', { required: true }),
        area('challenge', 'Common challenge'),
        text('lead', 'Best-fit solution'),
        text('start', 'Start with'),
      ]),
      text('cardCta', 'Card link text'),
    ]),
    group('domains', 'Engineering domains', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      rows('items', 'Domains', [text('name', 'Name', { required: true }), text('note', 'Note, e.g. Coming soon')]),
      { name: 'image', type: 'upload', relationTo: 'media', label: 'Visual', admin: { description: 'Optional. If empty, the built-in engineering illustration is shown.' } },
    ]),
    group('reassurance', 'Institutional buyers', [
      text('eyebrow', 'Small label'),
      text('title', 'Heading'),
      area('lead', 'Lead line'),
      lines('items', 'Points'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link'),
      { name: 'image', type: 'upload', relationTo: 'media', label: 'Document visual', admin: { description: 'Optional. If empty, the built-in capability statement mockup is shown.' } },
    ]),
    ctaGroup(),
  ],
})

export const SampleReportPage = definePage({
  key: 'sampleReport',
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
    group('example', 'Worked example card', [text('title', 'Title'), area('text', 'Text'), text('linkLabel', 'Link label'), imageField('image', 'Card image')]),
    group('feedback', 'Client feedback card', [text('title', 'Title'), area('text', 'Text'), text('buttonLabel', 'Button label'), imageField('image', 'Photo (optional, wide, no text in the image)')]),
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

export const SubmitPage = definePage({
  key: 'submit',
  label: 'Submit page',
  description: 'Text around the Submit your problem form. The form fields and their options are part of the code.',
  content: [
    heroGroup(),
    group('next', 'What happens next', [text('title', 'Heading'), lines('steps', 'Steps')]),
    group('thanks', 'Thank-you page', [text('eyebrow', 'Small label'), text('title', 'Heading'), area('text', 'Text')]),
  ],
})

export const LegalPage = definePage({
  key: 'legal',
  tabs: false,
  label: 'Legal page',
  description: 'Privacy policy, Terms of use and any other simple text page. The page slug (above) becomes the URL, e.g. privacy gives /privacy.',
  content: [
    { name: 'updated', type: 'date', label: 'Last updated', admin: { date: { pickerAppearance: 'dayOnly' } } },
    rows('sections', 'Sections', [text('heading', 'Heading', { required: true }), area('text', 'Text', { required: true })]),
  ],
})

export const siteGlobals: GlobalConfig[] = [SiteSettings, Navigation]

/** Editable page types, one group each in the `site-pages` collection. Legal is the only type that can have many documents. */
export const pageDefs: PageDef[] = [HomePage, AboutPage, CaseStudiesPage, SolutionsPage, WhoWeServePage, SampleReportPage, SubmitPage, LegalPage]
