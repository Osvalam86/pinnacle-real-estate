import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/app.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Sin transiciones: la ruta se aplica en el mismo render que el cierre del menú y RouteFocus
        desplaza antes de pintar (evita 1–2 fotogramas en los que se veía el hero al pulsar un ancla
        desde el panel) */}
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
