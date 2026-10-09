import { usePageTitle } from '../routing/usePageTitle.ts'

function HomePage() {
  usePageTitle('Pinnacle Real Estate')

  return (
    <>
      {/* h1 temporal hasta que se construya el hero real */}
      <h1 tabIndex={-1} className="p-4 focus:outline-hidden">
        Pinnacle
      </h1>

      {/* Secciones temporales para probar las anclas: las sustituye el contenido real */}
      <section id="about" aria-labelledby="about-heading" className="min-h-dvh p-4">
        <h2 id="about-heading" tabIndex={-1} className="focus:outline-hidden">
          About
        </h2>
      </section>
      <section id="services" aria-labelledby="services-heading" className="min-h-dvh p-4">
        <h2 id="services-heading" tabIndex={-1} className="focus:outline-hidden">
          Services
        </h2>
      </section>
      <section id="news" aria-labelledby="news-heading" className="min-h-dvh p-4">
        <h2 id="news-heading" tabIndex={-1} className="focus:outline-hidden">
          News
        </h2>
      </section>
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="min-h-dvh p-4"
      >
        <h2 id="testimonials-heading" tabIndex={-1} className="focus:outline-hidden">
          Testimonials
        </h2>
      </section>
      <section id="faq" aria-labelledby="faq-heading" className="min-h-dvh p-4">
        <h2 id="faq-heading" tabIndex={-1} className="focus:outline-hidden">
          FAQ
        </h2>
      </section>
    </>
  )
}

export default HomePage
