import { Link } from 'react-router'
import { StrokeArrowIcon } from './icons.tsx'

type BackToProjectsLinkProps = {
  /** Alineación en el padre y ajustes de separación por ancho */
  className?: string
}

export function BackToProjectsLink({ className }: BackToProjectsLinkProps) {
  return (
    // Borde real de 1 px: el relleno de Figma (16) se reduce en 1
    <Link
      to="/projects"
      className={`flex items-center gap-2.5 rounded-lg border border-default bg-surface p-3.75 text-body-medium-12 text-muted hover:bg-surface-raised md:text-body-medium-14 ${className ?? ''}`}
    >
      <StrokeArrowIcon className="size-4.5 shrink-0 text-subtle forced-colors:text-inherit md:size-5" />
      Back to all Projects
    </Link>
  )
}
