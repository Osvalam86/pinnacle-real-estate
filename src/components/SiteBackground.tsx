import bgLinesUrl from '../assets/bg-lines.svg'

type SiteBackgroundVariant = 'base' | 'home' | 'contact'

// Posición de cada pieza respecto a la caja de anclaje, según la página y el ancho
const LINES_A_CLASSES: Record<SiteBackgroundVariant, string> = {
  base: '-left-60 -top-79.75',
  home: '-left-154 -top-79.75 md:-left-106 xl:-left-60',
  contact: '-left-142 -top-79.75 md:-left-132 xl:-left-60',
}

const LINES_B_CLASSES: Record<SiteBackgroundVariant, string> = {
  base: 'left-[219.6943px] top-[1099.3972px]',
  home: 'left-[-156.3057px] top-[1099.3972px] md:left-[195.6943px] xl:left-[219.6943px]',
  contact: 'left-[-12.3057px] top-[1099.3972px] md:left-[-148.3057px] xl:left-[219.6943px]',
}

const GLOW_CLASSES: Record<SiteBackgroundVariant, string> = {
  base: 'left-[185.375px] top-[280.022px] h-[316.45px] w-[257.85px]',
  home: 'left-[132.1465px] top-[228.9756px] h-[248.15px] w-[202.2px] md:left-[185.375px] md:top-[280.022px] md:h-[316.45px] md:w-[257.85px]',
  contact: 'left-[185.375px] top-[280.022px] h-[316.45px] w-[257.85px]',
}

type SiteBackgroundProps = {
  variant: SiteBackgroundVariant
}

export function SiteBackground({ variant }: SiteBackgroundProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 forced-colors:hidden">
      {/* mx-auto: centra la caja de 1440 en la que se ancla el dibujo */}
      <div className="relative mx-auto h-full max-w-page">
        <img
          src={bgLinesUrl}
          alt=""
          width={1703}
          height={958}
          className={`absolute max-w-none origin-top-left ${LINES_A_CLASSES[variant]}`}
        />
        <img
          src={bgLinesUrl}
          alt=""
          width={1703}
          height={958}
          className={`absolute max-w-none origin-top-left -rotate-45 ${LINES_B_CLASSES[variant]}`}
        />
        {/* Degradado en sRGB, como Figma. Figma: desenfoque de capa 140; 52 px calibrado midiendo
            contra el render de Figma (de 40 a 70 px, mínima diferencia) */}
        <div
          className={`absolute origin-top-left rotate-[155.9678deg] bg-[radial-gradient(220%_220%_at_50%_50%,#ff5200_0%,#141414_50%,#e0c5b8_100%)] opacity-60 blur-[52px] ${GLOW_CLASSES[variant]}`}
        />
      </div>
    </div>
  )
}
