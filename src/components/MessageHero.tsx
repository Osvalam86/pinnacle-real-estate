import type { ReactNode } from 'react'
import { Button } from './Button.tsx'
import { HeroFade } from './HeroFade.tsx'

type MessageHeroProps = {
  title: ReactNode
  description?: ReactNode
  footnote?: ReactNode
}

// Sin <section>: es el único bloque de la página
export function MessageHero({ title, description, footnote }: MessageHeroProps) {
  const heading = (
    <h1 tabIndex={-1} className="text-center font-heading text-h6 text-default focus:outline-hidden md:text-h4 xl:text-h3">
      {title}
    </h1>
  )

  return (
    <div className="relative">
      <HeroFade className="h-85.75 md:h-115.25 xl:h-131.75" />
      {/* A49: en ventanas más altas que la página, el hueco hasta el footer se pinta con el negro de la página.
          Lo que pasa bajo el footer queda tapado por su relleno, y overflow-clip del envoltorio lo recorta sin alargar la página */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full -z-10 h-dvh bg-page" />
      {/* mx-auto: centra la caja de 1440.
          La caja calca a la vez el relleno del hero y la columna «Text»: el hero solo tiene un hijo en flujo */}
      <div className="relative mx-auto flex max-w-page flex-col gap-10 px-4 py-22 md:gap-12 md:px-16 md:py-26 xl:gap-18 xl:py-40">
        {description ? (
          <div className="flex flex-col gap-4 md:gap-8">
            {heading}
            <p className="max-w-191.25 self-center text-center text-body-regular-16 text-muted md:text-body-regular-18">
              {description}
            </p>
          </div>
        ) : (
          heading
        )}
        <Button variant="primary" to="/" className="self-center text-body-medium-16 md:text-body-medium-18">
          Back to Home Page
        </Button>
        {footnote && (
          <p className="max-w-191.25 self-center text-center text-body-regular-14 text-muted">{footnote}</p>
        )}
      </div>
    </div>
  )
}
