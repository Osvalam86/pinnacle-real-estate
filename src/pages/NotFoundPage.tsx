import { Link } from 'react-router'
import { usePageTitle } from '../routing/usePageTitle.ts'

function NotFoundPage() {
  usePageTitle('Page Not Found – Pinnacle')

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <h1 tabIndex={-1} className="focus:outline-hidden">
          404 Page Not Found
        </h1>
        <p>
          <Link to="/" className="underline">
            Back to Home Page
          </Link>
        </p>
      </div>
    </>
  )
}

export default NotFoundPage
