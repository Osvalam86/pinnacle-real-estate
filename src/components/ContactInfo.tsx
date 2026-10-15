import { FacebookIcon, LinkedInIcon, StrokeXIcon } from './icons.tsx'

// Borde real de 1 px: el relleno de Figma (18/24) se reduce en 1
const BOX =
  'block rounded-lg border border-default bg-surface px-5.75 py-4.25 text-body-medium-16 text-muted hover:bg-surface-raised md:text-body-medium-18'

// Borde real de 1 px: el relleno de Figma (18/30) se reduce en 1
const SOCIAL = 'flex rounded-md border border-default bg-surface px-7.25 py-4.25 hover:bg-surface-raised'

const SOCIAL_LINKS = [
  { label: 'Facebook (opens in a new tab)', href: 'https://www.facebook.com/', Icon: FacebookIcon, color: 'text-default' },
  { label: 'X (opens in a new tab)', href: 'https://x.com/', Icon: StrokeXIcon, color: 'text-gray-3' },
  { label: 'LinkedIn (opens in a new tab)', href: 'https://www.linkedin.com/', Icon: LinkedInIcon, color: 'text-default' },
]

export function ContactInfo() {
  return (
    // md:items-start: en la fila con salto, Figma alinea arriba y cada grupo conserva su alto.
    // xl:items-stretch: a 1440 los grupos son «Fill» y vuelven a ocupar los 397 de la columna
    <div className="flex flex-col gap-10 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-x-12 md:gap-y-10 xl:w-99.25 xl:shrink-0 xl:flex-col xl:flex-nowrap xl:items-stretch xl:justify-start xl:gap-12">
      <div className="flex flex-col gap-8">
        <h2 className="font-heading text-extra-25 text-gray-3 md:text-h6">Get in Touch</h2>
        <ul className="flex flex-col items-start gap-3.75">
          <li>
            <a href="mailto:info@pinnacle.com" className={BOX}>
              info@pinnacle.com
            </a>
          </li>
          <li>
            <a href="tel:+11234567890" className={BOX}>
              +1 (123) 456-7890
            </a>
          </li>
        </ul>
      </div>

      <div id="office" className="flex flex-col gap-8">
        <h2 id="office-heading" tabIndex={-1} className="font-heading text-extra-25 text-gray-3 focus:outline-hidden md:text-h6">
          Our Office
        </h2>
        <div className="flex flex-col gap-3.75">
          {/* Ajustada al texto desde md, como en Figma; a 360 ocupa el ancho */}
          <p className="text-body-medium-16 text-default md:self-start md:text-body-medium-18">Address: 123 Main St, Anytown, USA 12345</p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Upper%20Macungie%20Township%2C%20PA"
            target="_blank"
            rel="noopener noreferrer"
            className={`self-start ${BOX}`}
          >
            Get Directions<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      {/* Ancho fijo de 305 entre 774 y 1439, calcado de Figma */}
      <div className="flex flex-col gap-8 md:w-76.25 xl:w-auto">
        <h2 className="font-heading text-extra-25 text-gray-3 md:text-h6">Connect with us</h2>
        <ul className="flex gap-5">
          {SOCIAL_LINKS.map(({ label, href, Icon, color }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${SOCIAL} ${color}`}>
                <Icon className="size-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
