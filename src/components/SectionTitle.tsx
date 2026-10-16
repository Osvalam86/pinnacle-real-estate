import type { ReactNode } from 'react'

type SectionTitleProps = {
  as: 'h1' | 'h2'
  /** Lo usa la sección en aria-labelledby */
  id: string
  iconSrc: string
  /** Separación entre icono y encabezado */
  className?: string
  /** Alineación vertical de icono y encabezado */
  alignClassName?: string
  headingClassName?: string
  tabIndex?: number
  'data-route-focus'?: string
  children: ReactNode
}

export function SectionTitle({
  as: Heading,
  id,
  iconSrc,
  className,
  alignClassName = 'items-center',
  headingClassName,
  tabIndex,
  'data-route-focus': routeFocus,
  children,
}: SectionTitleProps) {
  return (
    <div className={`flex ${alignClassName} ${className ?? ''}`}>
      <img src={iconSrc} alt="" width="38" height="38" className="size-6 shrink-0 md:size-9.5" />
      <Heading
        id={id}
        tabIndex={tabIndex}
        data-route-focus={routeFocus}
        className={`font-heading text-extra-30 text-default md:text-h5 xl:text-h4 ${headingClassName ?? ''}`}
      >
        {children}
      </Heading>
    </div>
  )
}
