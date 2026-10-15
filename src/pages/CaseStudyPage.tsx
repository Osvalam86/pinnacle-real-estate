import type { ReactNode } from 'react'
import { MessageHero } from '../components/MessageHero.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

// Las mismas clases que «Terms of Use» y «Privacy Policy» del formulario de Contact
function CreditLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline [text-decoration-skip-ink:none] hover:text-gray-1"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

function CaseStudyPage() {
  usePageTitle('About this case study – Pinnacle')

  return (
    <MessageHero
      title="This page isn’t part of the case study"
      description="Only Home, Projects, Project Details and Contact were built."
      footnote={
        <>
          Design based on{' '}
          <CreditLink href="https://www.figma.com/community/file/1387710768278467368/free-real-estate-portfolio-website-template">
            Free Real Estate Portfolio website template
          </CreditLink>{' '}
          by Herve Wabo, licensed under{' '}
          <CreditLink href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</CreditLink> and adapted for this
          case study. Icons by <CreditLink href="https://www.streamlinehq.com">Streamline</CreditLink> (CC BY 4.0),{' '}
          <CreditLink href="https://hugeicons.com">Hugeicons</CreditLink> (MIT) and{' '}
          <CreditLink href="https://iconscout.com/unicons">Unicons</CreditLink> (Apache 2.0).
        </>
      }
    />
  )
}

export default CaseStudyPage
