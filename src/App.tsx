import { AnimatePresence, motion } from 'motion/react'
import { BookOpenCheck, ClipboardCheck, History, LayoutDashboard, Menu, Monitor, Moon, NotebookPen, Settings as SettingsIcon, ShieldCheck, Sparkles, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider, cx } from './components/ui'
import { setSettings, useDB } from './lib/store'
import { applyTheme } from './lib/theme'
import { PROVIDERS } from './lib/ai'
import Dashboard from './pages/Dashboard'
import Tests from './pages/Tests'
import HistoryPage from './pages/History'
import Mistakes from './pages/Mistakes'
import Results from './pages/Results'
import Admin from './pages/Admin'
import TestEditor from './pages/TestEditor'
import Examiner from './pages/Examiner'
import Settings from './pages/Settings'
import ExamPage from './exam/ExamPage'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tests', label: 'Mock tests', icon: BookOpenCheck },
  { to: '/history', label: 'My results', icon: History },
  { to: '/mistakes', label: 'Mistakes', icon: NotebookPen },
  { to: '/examiner', label: 'Examiner', icon: ClipboardCheck },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 font-display text-lg font-extrabold text-white shadow-lg shadow-brand-500/30">
        B<span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-300" />
      </div>
      <div>
        <div className="font-display text-lg font-extrabold leading-none text-slate-900">BandReady</div>
        <div className="text-[11px] font-medium text-slate-400">IELTS mock tests</div>
      </div>
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const hasKey = useDB(d => Boolean(d.settings.keys[d.settings.provider]?.trim()))
  const provider = useDB(d => PROVIDERS[d.settings.provider].label)
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo />
      <nav className="flex flex-col gap-1">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate}
            className={({ isActive }) => cx('relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors', isActive ? 'text-brand-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800')}>
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-brand-50" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <n.icon size={18} className="relative" />
                <span className="relative">{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-3">
        <ThemeToggle />
        <NavLink to="/settings" onClick={onNavigate} className={cx('block rounded-2xl p-4 text-sm transition hover:scale-[1.02]', hasKey ? 'bg-emerald-50' : 'bg-gradient-to-br from-brand-600 to-violet-600 text-white')}>
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles size={16} /> {hasKey ? 'AI marking active' : 'Enable AI marking'}
          </div>
          <p className={cx('mt-1 text-xs', hasKey ? 'text-emerald-700' : 'text-white/80')}>
            {hasKey ? `Writing & Speaking are marked by ${provider}.` : 'Add a free Gemini or Groq key to get band scores for Writing & Speaking.'}
          </p>
        </NavLink>
      </div>
    </div>
  )
}

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
] as const

function ThemeToggle() {
  const theme = useDB(d => d.settings.theme)
  return (
    <div className="flex rounded-xl bg-slate-100 p-1" role="radiogroup" aria-label="Theme">
      {THEMES.map(t => (
        <button key={t.id} role="radio" aria-checked={theme === t.id} title={t.label} onClick={() => setSettings({ theme: t.id })}
          className={cx('relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition', theme === t.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800')}>
          {theme === t.id && <motion.span layoutId="theme-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <t.icon size={14} className="relative" /><span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useDB(d => d.settings.theme)
  useEffect(applyTheme, [theme])

  // The exam runs full-screen, without app chrome — like the real test centre.
  if (location.pathname.startsWith('/exam/')) {
    return (
      <ToastProvider>
        <Routes>
          <Route path="/exam/:attemptId" element={<ExamPage />} />
        </Routes>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen">
        <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200/70 bg-white/80 backdrop-blur-xl lg:block">
          <Sidebar />
        </aside>
        <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Logo />
          <button className="rounded-xl p-2 hover:bg-slate-100" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button>
        </header>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-slate-900/30" onClick={() => setMobileOpen(false)} />
              <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }} className="relative h-full w-72 bg-white shadow-2xl">
                <button className="absolute right-3 top-4 rounded-xl p-2 hover:bg-slate-100" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="lg:pl-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10"
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/mistakes" element={<Mistakes />} />
                <Route path="/results/:attemptId" element={<Results />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/tests/:testId" element={<TestEditor />} />
                <Route path="/examiner" element={<Examiner />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ToastProvider>
  )
}
