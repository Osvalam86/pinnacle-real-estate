import { ContactFormSection } from '../components/ContactFormSection.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function ContactPage() {
  usePageTitle('Contact Us – Pinnacle')

  return (
    <>
      <h1 tabIndex={-1} className="p-4 focus:outline-hidden">
        Contact Us
      </h1>

      <div className="bg-page">
        {/* mx-auto centra el contenido limitado a 1440 en pantallas más anchas */}
        <div className="mx-auto flex max-w-page flex-col gap-16 px-4 pt-22 pb-16 md:gap-22 md:px-10 md:pt-26 md:pb-20 xl:flex-row xl:gap-14 xl:px-16 xl:pt-32">
          {/* Sección temporal para probar el ancla: la sustituye el contenido real */}
          <section id="office" aria-labelledby="office-heading" className="p-4 xl:w-99.25 xl:shrink-0">
            <h2 id="office-heading" tabIndex={-1} className="focus:outline-hidden">
              Our Office
            </h2>
          </section>
          <ContactFormSection />
        </div>
      </div>
    </>
  )
}

export default ContactPage
