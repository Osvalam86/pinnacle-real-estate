import { Link } from 'react-router'
import { usePageTitle } from '../routing/usePageTitle.ts'

function CaseStudyPage() {
  usePageTitle('About this case study – Pinnacle')

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <h1 tabIndex={-1} className="focus:outline-hidden">
          This page isn’t part of the case study
        </h1>
        <p>Only Home, Projects, Project Details and Contact were built.</p>
        <p>
          <Link to="/" className="underline">
            Back to Home Page
          </Link>
        </p>
      </div>
    </>
  )
}

export default CaseStudyPage
