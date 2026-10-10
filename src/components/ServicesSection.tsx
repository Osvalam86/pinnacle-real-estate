import { useId, useSyncExternalStore } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'
import { Link } from 'react-router'
import titleIconUrl from '../assets/services-title-icon.svg'
import { serviceCategories, type Service } from '../data/services.ts'

// Mismo valor que --breakpoint-md: desde ahí las pestañas van en fila
const MD_QUERY = '(width >= 48.375rem)'

function subscribeToMd(onChange: () => void) {
  const query = window.matchMedia(MD_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getMdSnapshot() {
  return window.matchMedia(MD_QUERY).matches
}

function ServiceCard({ title, description }: Service) {
  const titleId = useId()
  const linkId = useId()

  return (
    <li className="flex flex-col gap-8 rounded-2xl border border-default bg-page px-3.75 pt-3.75 pb-5.75 md:px-5.75 md:pt-5.75 md:pb-7.75">
      <img
        src="/images/shared/card-default.webp"
        alt=""
        width="379"
        height="300"
        loading="lazy"
        className="h-75 w-full rounded-2xl object-cover"
      />
      <div className="flex flex-col items-start gap-6">
        <div className="flex flex-col gap-1.5">
          <h3 id={titleId} className="font-heading text-body-medium-24 text-default">
            {title}
          </h3>
          <p className="line-clamp-2 text-body-regular-16 text-muted">{description}</p>
        </div>
        {/* Línea dibujada dentro de la caja de 21 px para que no sume alto a la tarjeta */}
        <Link
          to="/case-study"
          id={linkId}
          aria-labelledby={`${linkId} ${titleId}`}
          className="relative text-body-medium-14 text-default after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current hover:text-gray-1"
        >
          Learn more...
        </Link>
      </div>
    </li>
  )
}

export function ServicesSection() {
  const headingId = useId()
  const isMd = useSyncExternalStore(subscribeToMd, getMdSnapshot)

  return (
    <section
      id="services"
      aria-labelledby={headingId}
      className="mx-auto max-w-page px-4 py-16 md:px-10 md:py-20 xl:px-16 xl:py-22"
    >
      <Tabs
        orientation={isMd ? 'horizontal' : 'vertical'}
        defaultSelectedKey={serviceCategories[0].id}
        className="flex flex-col gap-16 xl:gap-18"
      >
        <div className="flex flex-col items-center gap-8 md:gap-10">
          <div className="flex w-full flex-col gap-4 xl:gap-6">
            <div className="flex items-center gap-2 md:justify-center md:gap-6">
              <h2
                id={headingId}
                tabIndex={-1}
                className="w-69.25 text-center font-heading text-extra-30 text-default focus:outline-hidden md:w-auto md:text-h5 xl:text-h4"
              >
                Quality service you get
              </h2>
              <img
                src={titleIconUrl}
                alt=""
                width="40"
                height="38"
                className="h-6 w-auto shrink-0 md:h-9.5"
              />
            </div>
            <p className="text-body-regular-16 text-muted md:text-center md:text-body-regular-18 xl:w-168.5 xl:self-center">
              At Pinnacle, we offer a wide range of services to cater to your unique needs. From
              residential construction to commercial development, we've got you covered.
            </p>
          </div>

          <TabList
            aria-label="Services"
            className="flex w-full flex-col gap-2 rounded-lg bg-surface p-2 md:w-auto md:flex-row"
          >
            {serviceCategories.map((category) => (
              <Tab
                key={category.id}
                id={category.id}
                className="cursor-pointer rounded-lg border border-default bg-surface px-5.75 py-3.75 text-center text-body-medium-14 text-default not-aria-selected:hover:bg-surface-raised aria-selected:border-control aria-selected:bg-page"
              >
                {category.label}
              </Tab>
            ))}
          </TabList>
        </div>

        {serviceCategories.map((category) => (
          <TabPanel key={category.id} id={category.id}>
            {/* Columnas automáticas de 26rem (416 px, ancho de la tarjeta en Figma); min() evita desbordar por debajo de ese ancho */}
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] items-start gap-4">
              {category.services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </ul>
          </TabPanel>
        ))}
      </Tabs>
    </section>
  )
}
