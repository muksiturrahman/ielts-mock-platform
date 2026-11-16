import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { ensureSeeded } from './data/seed'
import { applyTheme } from './lib/theme'

ensureSeeded()
applyTheme() // before first paint, so dark mode doesn't flash white

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter: GitHub Pages has no server-side routing fallback. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
