import { ContactFormSection } from '../components/ContactFormSection.tsx'
import { ContactHero } from '../components/ContactHero.tsx'
import { ContactInfo } from '../components/ContactInfo.tsx'
import { FaqSection } from '../components/FaqSection.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function ContactPage() {
  usePageTitle('Contact Us – Pinnacle')

  return (
    <>
      <ContactHero />
      <div className="bg-page">
        {/* mx-auto centra el contenido limitado a 1440 en pantallas más anchas.
            xl:items-start calca la alineación arriba de Figma: el formulario no se estira hasta el alto de la columna */}
        <div className="mx-auto flex max-w-page flex-col gap-16 px-4 pt-22 pb-16 md:gap-22 md:px-10 md:pt-26 md:pb-20 xl:flex-row xl:items-start xl:gap-14 xl:px-16 xl:pt-32">
          <ContactInfo />
          <ContactFormSection />
        </div>
      </div>

      <FaqSection paddingBottomClassName="pb-20 md:pb-26 xl:pb-22" />
    </>
  )
}

export default ContactPage
