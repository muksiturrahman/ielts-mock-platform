import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
export function Button({
  variant = 'primary', size = 'md', className, children, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3.5 text-base',
        variant === 'primary' && 'bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110',
        variant === 'secondary' && 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
        variant === 'danger' && 'bg-rose-600 text-white hover:bg-rose-700',
        variant === 'dark' && 'bg-slate-900 text-white hover:bg-slate-800',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Card({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cx('card', className)}
    >
      {children}
    </motion.div>
  )
}

export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'brand' | 'green' | 'amber' | 'rose' | 'violet' | 'sky' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600', brand: 'bg-brand-50 text-brand-700', green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700', rose: 'bg-rose-50 text-rose-700', violet: 'bg-violet-50 text-violet-700', sky: 'bg-sky-50 text-sky-700',
  }
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone])}>{children}</span>
}

/** Counts up to the value — used for band scores and stats. */
export function CountUp({ value, decimals = 1, duration = 1.2 }: { value: number; decimals?: number; duration?: number }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, v => v.toFixed(decimals))
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [value, duration, mv])
  return <motion.span>{text}</motion.span>
}

export function bandColor(band?: number) {
  if (band === undefined) return '#cbd5e1'
  if (band >= 8) return '#10b981'
  if (band >= 7) return '#6366f1'
  if (band >= 6) return '#0ea5e9'
  if (band >= 5) return '#f59e0b'
  return '#f43f5e'
}

export function BandRing({ band, size = 120, label, stroke = 10 }: { band?: number; size?: number; label?: string; stroke?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = band === undefined ? 0 : band / 9
  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} style={{ stroke: 'var(--color-slate-100)' }} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bandColor(band)} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ height: size }}>
        <span className="font-display font-extrabold text-slate-900" style={{ fontSize: size * 0.28 }}>
          {band === undefined ? '–' : <CountUp value={band} />}
        </span>
        {label && <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; wide?: boolean }) {
  const ref = useDialogFocus<HTMLDivElement>(open, onClose)
  const titleId = useId()
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={ref} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} tabIndex={-1}
            initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={cx('relative max-h-[90vh] w-full overflow-y-auto rounded-3xl outline-none bg-white p-6 shadow-2xl scroll-thin', wide ? 'max-w-3xl' : 'max-w-lg')}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div id={titleId} className="font-display text-xl font-bold text-slate-900">{title}</div>
              <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Dialog focus: moves focus in when `active`, keeps Tab inside, Escape calls onEscape, and returns focus on close. */
export function useDialogFocus<T extends HTMLElement>(active: boolean, onEscape?: () => void) {
  const ref = useRef<T>(null)
  const esc = useRef(onEscape)
  esc.current = onEscape
  useEffect(() => {
    const el = ref.current
    if (!active || !el) return
    const prev = document.activeElement as HTMLElement | null
    const items = () => [...el.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x => !x.hasAttribute('disabled'))
    ;(el.querySelector<HTMLElement>('[autofocus]') ?? el).focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && esc.current) { e.preventDefault(); esc.current(); return }
      if (e.key !== 'Tab') return
      const f = items()
      if (!f.length) { e.preventDefault(); return }
      const at = document.activeElement
      if (e.shiftKey && (at === f[0] || at === el || !el.contains(at))) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && (at === f[f.length - 1] || !el.contains(at))) { e.preventDefault(); f[0].focus() }
    }
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('keydown', key); prev?.focus?.() }
  }, [active])
  return ref
}

// ---------- Unsaved changes ----------
let unsaved = false
/** Marks the page as having unsaved edits: closing the tab warns, and confirmDiscard() asks before switching away. */
export function useUnsaved(dirty: boolean) {
  useEffect(() => {
    unsaved = dirty
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault() }
    // In-app links (sidebar, menu) don't fire beforeunload: ask before they discard the edits.
    const leave = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#/"]')
      if (!dirty || !link || link.getAttribute('href') === location.hash) return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.getAttribute('target') === '_blank') return
      if (!confirm('You have unsaved changes. Discard them?')) { e.preventDefault(); e.stopPropagation() }
    }
    window.addEventListener('beforeunload', warn)
    document.addEventListener('click', leave, true)
    return () => { unsaved = false; window.removeEventListener('beforeunload', warn); document.removeEventListener('click', leave, true) }
  }, [dirty])
}
export const confirmDiscard = () => !unsaved || confirm('You have unsaved changes. Discard them?')

// ---------- Toasts ----------
type Toast = { id: number; text: string; tone: 'info' | 'success' | 'error' }
const ToastCtx = createContext<(text: string, tone?: Toast['tone']) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((text: string, tone: Toast['tone'] = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, text, tone }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40 }}
              className={cx(
                'pointer-events-auto max-w-sm rounded-2xl px-4 py-3 text-sm font-medium shadow-xl',
                t.tone === 'success' && 'bg-emerald-600 text-white', t.tone === 'error' && 'bg-rose-600 text-white', t.tone === 'info' && 'bg-slate-900 text-white',
              )}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1.5 text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </motion.div>
  )
}

export function Empty({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
      <div className="mb-3 rounded-2xl bg-brand-50 p-3 text-brand-600">{icon}</div>
      <div className="font-semibold text-slate-800">{title}</div>
      {children && <div className="mt-1 max-w-md text-sm text-slate-500">{children}</div>}
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-700">
      <span className={cx('relative h-6 w-11 rounded-full transition-colors', checked ? 'bg-brand-600' : 'bg-slate-300')}>
        <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={cx('toggle-knob absolute top-0.5 h-5 w-5 rounded-full bg-white shadow', checked ? 'right-0.5' : 'left-0.5')} />
      </span>
      {label}
    </button>
  )
}

export const fmtDate = (t: number) => new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
export const fmtBand = (b?: number) => (b === undefined ? '–' : b.toFixed(1))
