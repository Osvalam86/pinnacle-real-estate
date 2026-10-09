import { usePageTitle } from '../routing/usePageTitle.ts'

function ContactPage() {
  usePageTitle('Contact Us – Pinnacle')

  return (
    <>
      <h1 tabIndex={-1} className="p-4 focus:outline-hidden">
        Contact Us
      </h1>

      {/* Secciones temporales para probar las anclas: las sustituye el contenido real */}
      <section id="office" aria-labelledby="office-heading" className="min-h-dvh p-4">
        <h2 id="office-heading" tabIndex={-1} className="focus:outline-hidden">
          Our Office
        </h2>
      </section>
      <section id="form" aria-labelledby="form-heading" className="min-h-dvh p-4">
        <h2 id="form-heading" tabIndex={-1} className="focus:outline-hidden">
          Have a project in mind?
        </h2>
      </section>
    </>
  )
}

export default ContactPage
