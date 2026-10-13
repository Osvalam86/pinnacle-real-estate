import { CtaSection } from '../components/CtaSection.tsx'
import { FeaturedProjectsSection } from '../components/FeaturedProjectsSection.tsx'
import { HomeHero } from '../components/HomeHero.tsx'
import { LatestNewsSection } from '../components/LatestNewsSection.tsx'
import { ServicesSection } from '../components/ServicesSection.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function HomePage() {
  usePageTitle('Pinnacle Real Estate')

  return (
    <>
      <HomeHero />

      {/* Caja exterior de About: tapa la parte de la torre que sale por debajo del hero. Desde 1440
          se pone encima del escenario; por debajo no lleva z-index para que el panel del menú quede encima */}
      <div className="relative bg-accent xl:z-hero-cover">
        {/* Secciones temporales para probar las anclas: las sustituye el contenido real */}
        <section id="about" aria-labelledby="about-heading" className="min-h-dvh p-4">
          <h2 id="about-heading" tabIndex={-1} className="focus:outline-hidden">
            About
          </h2>
        </section>
      </div>
      <FeaturedProjectsSection />
      <ServicesSection />
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="min-h-dvh p-4"
      >
        <h2 id="testimonials-heading" tabIndex={-1} className="focus:outline-hidden">
          Testimonials
        </h2>
      </section>
      <LatestNewsSection />
      <section id="faq" aria-labelledby="faq-heading" className="min-h-dvh p-4">
        <h2 id="faq-heading" tabIndex={-1} className="focus:outline-hidden">
          FAQ
        </h2>
      </section>

      <CtaSection />
    </>
  )
}

export default HomePage
