import type { ComponentPropsWithRef, ReactNode, Ref } from 'react'
import { Link, type LinkProps } from 'react-router'

// En Figma la variante «tertiary» se llama «Tetiary»
type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

type CommonProps = {
  variant: ButtonVariant
  /** Texto, ancho y alineación los pone quien lo usa */
  className?: string
  children: ReactNode
}

type LinkButtonProps = CommonProps &
  Omit<LinkProps, 'className' | 'children'> & { ref?: Ref<HTMLAnchorElement> }

type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithRef<'button'>, 'className' | 'children' | 'type'> & {
    type: 'button' | 'submit' | 'reset'
  }

type ButtonProps = LinkButtonProps | NativeButtonProps

// Sin borde: movería 1 px la sombra interior. En alto contraste la sombra desaparece y el contorno marca el límite
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Texto gray-13 y no gray-4 como en Figma: D6
  primary:
    'bg-accent px-6 py-4 text-inverse inset-shadow-button-accent hover:bg-accent-hover forced-colors:not-focus-visible:outline forced-colors:not-focus-visible:-outline-offset-1',
  secondary:
    'bg-surface-raised px-6 py-4 text-default inset-shadow-button hover:bg-gray-10 forced-colors:not-focus-visible:outline forced-colors:not-focus-visible:-outline-offset-1',
  // Borde real de 1 px: el relleno de Figma (16/24) se reduce en 1 para medir lo mismo
  tertiary: 'border border-default bg-surface px-5.75 py-3.75 text-default hover:bg-surface-raised',
}

function getClasses(variant: ButtonVariant, className: string | undefined) {
  return `rounded-lg text-center ${VARIANT_CLASSES[variant]} ${className ?? ''}`
}

export function Button(props: ButtonProps) {
  if ('to' in props) {
    const { variant, className, ...linkProps } = props
    return <Link {...linkProps} className={getClasses(variant, className)} />
  }

  const { variant, className, ...buttonProps } = props
  return <button {...buttonProps} className={getClasses(variant, className)} />
}
