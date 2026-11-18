import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './lib/leaveGuard' // registers its popstate listener before the router's
import './index.css'
import App from './App'
import { ensureSeeded } from './data/seed'
import { applyTheme } from './lib/theme'
import { recoverInterruptedMarking } from './lib/attempts'

ensureSeeded()
recoverInterruptedMarking()
setInterval(recoverInterruptedMarking, 30_000) // marking whose tab died while this one stays open
applyTheme() // before first paint, so dark mode doesn't flash white

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter: GitHub Pages has no server-side routing fallback. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
