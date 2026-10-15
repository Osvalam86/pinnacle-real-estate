import { useId } from 'react'
import titleIconUrl from '../assets/faq-title-icon.svg'
import { faqItems, type FaqItem } from '../data/faq.ts'
import { SectionTitle } from './SectionTitle.tsx'

// Calca los dos frames «Questions» de Figma (24 dentro del grupo y 32 entre grupos a 360)
const FAQ_GROUPS = [faqItems.slice(0, 2), faqItems.slice(2, 4)]

function FaqCard({ question, answer }: FaqItem) {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-default bg-page px-3.75 py-5.75 md:bg-transparent">
      {/* gray-3 a 360, estilo «White» de Figma */}
      <h3 className="font-heading text-body-medium-24 text-gray-3 md:text-default">{question}</h3>
      <p className="text-body-regular-16 text-muted md:text-body-regular-18">{answer}</p>
    </div>
  )
}

type FaqSectionProps = {
  /** Relleno inferior en cada ancho: Contact lo reduce a 1440 */
  paddingBottomClassName?: string
}

export function FaqSection({ paddingBottomClassName = 'pb-20 md:pb-26 xl:pb-32' }: FaqSectionProps) {
  const headingId = useId()

  return (
    // mx-auto: centra la caja de 1440 en ventanas más anchas
    <section
      id="faq"
      aria-labelledby={headingId}
      className={`mx-auto flex max-w-page flex-col gap-10.5 px-4 pt-16 md:gap-16 md:px-10 md:pt-20 xl:gap-18 xl:px-16 xl:pt-22 ${paddingBottomClassName}`}
    >
      {/* El icono va arriba por debajo de 1440, como en Figma */}
      <SectionTitle
        as="h2"
        id={headingId}
        iconSrc={titleIconUrl}
        className="gap-6"
        alignClassName="items-start xl:items-center"
        tabIndex={-1}
        headingClassName="focus:outline-hidden"
      >
        Frequently Asked Questions
      </SectionTitle>
      <div className="flex min-w-70 flex-col gap-8 overflow-clip rounded-2xl border border-default bg-page p-3.75 md:p-5.75">
        {FAQ_GROUPS.map((group) => (
          <div key={group[0].question} className="flex flex-col gap-6 md:gap-8 xl:grid xl:grid-cols-2">
            {group.map((item) => (
              <FaqCard key={item.question} {...item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
