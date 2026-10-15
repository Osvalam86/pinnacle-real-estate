import { MessageHero } from '../components/MessageHero.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function NotFoundPage() {
  usePageTitle('Page Not Found – Pinnacle')

  return (
    <MessageHero
      title={
        <>
          404
          <br />
          Page Not Found
        </>
      }
    />
  )
}

export default NotFoundPage
