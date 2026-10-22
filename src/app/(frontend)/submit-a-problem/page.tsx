import type { Metadata } from 'next'

import { CheckList, Container, Section } from '@/components/ds/primitives'
import { PageBand, cardClass } from '@/components/sections/sections'
import { SubmitProblemForm } from '@/components/forms/SubmitProblemForm'
import { siteSettings } from '@/data/site'
import { SOLUTION_OPTIONS } from '@/lib/validation/submission'

export const metadata: Metadata = {
  title: 'Submit your problem',
  description: siteSettings.promiseText,
  alternates: { canonical: '/submit-a-problem' },
}

type Props = { searchParams: Promise<{ solution?: string }> }

export default async function SubmitPage({ searchParams }: Props) {
  const { solution } = await searchParams
  const defaultSolution = SOLUTION_OPTIONS.some((o) => o.value === solution) ? solution! : 'not-sure'

  return (
    <>
      <PageBand eyebrow="Contact" title="Submit your problem.">
        {siteSettings.promiseText}
      </PageBand>
      <Section>
        <Container className="grid items-start gap-7 lg:grid-cols-2">
          <SubmitProblemForm defaultSolution={defaultSolution} />
          <aside className={cardClass}>
            <h2 className="type-h3 mb-1.5">What happens next</h2>
            <CheckList
              items={[
                'An engineer reads your submission',
                'We reply within 2 working days',
                'Free problem review: a clear yes or no and a next step',
                'NDA first, if your data is sensitive',
              ]}
            />
            <p className="mt-3.5">
              <b>Email:</b>{' '}
              <a className="text-accent-strong hover:underline" href={`mailto:${siteSettings.notificationEmail}`}>
                {siteSettings.notificationEmail}
              </a>
            </p>
          </aside>
        </Container>
      </Section>
    </>
  )
}
