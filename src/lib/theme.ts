import { getDB } from './store'

const media = window.matchMedia('(prefers-color-scheme: dark)')

/** Adds/removes the .dark class on <html> from the saved theme (or the OS setting for "system"). */
export function applyTheme() {
  const t = getDB().settings.theme
  const dark = t === 'dark' || (t === 'system' && media.matches)
  document.documentElement.classList.toggle('dark', dark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1120' : '#4f46e5')
}

media.addEventListener('change', applyTheme)
