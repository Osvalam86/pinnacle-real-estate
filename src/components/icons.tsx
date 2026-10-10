// Iconos en línea para que sigan el color del texto con currentColor

export function MenuIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M4 9C4 8.44772 4.44772 8 5 8H27C27.5523 8 28 8.44772 28 9C28 9.55228 27.5523 10 27 10H5C4.44772 10 4 9.55228 4 9ZM4 16C4 15.4477 4.44772 15 5 15H27C27.5523 15 28 15.4477 28 16C28 16.5523 27.5523 17 27 17H5C4.44772 17 4 16.5523 4 16ZM15 23C15 22.4477 15.4477 22 16 22H27C27.5523 22 28 22.4477 28 23C28 23.5523 27.5523 24 27 24H16C15.4477 24 15 23.5523 15 23Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M9 9L23 23M23 9L9 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
