import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Clock, Eye, EyeOff, Settings2, Volume2, Wifi } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { setSettings, useDB } from '../lib/store'
import type { AnswerValue, QuestionGroup } from '../lib/types'

export function useNow(interval = 500) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(t)
  }, [interval])
  return now
}

/** Fires onExpire exactly once when the stored deadline passes (survives refreshes). */
export function useDeadline(deadline: number | undefined, onExpire: () => void) {
  const now = useNow()
  const fired = useRef(false)
  const remaining = deadline ? Math.max(0, deadline - now) : undefined
  useEffect(() => {
    if (deadline && remaining === 0 && !fired.current) {
      fired.current = true
      onExpire()
    }
  }, [deadline, remaining, onExpire])
  return remaining
}

export const fmtClock = (ms: number) => {
  const s = Math.ceil(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// iOS ignores media volume set from a page, so a slider there would do nothing.
const volumeSettable = (() => { try { const a = new Audio(); a.volume = 0.5; return a.volume === 0.5 } catch { return false } })()

export function TopBar({ title, remaining, right, volume, onVolume }: { title: string; remaining?: number; right?: ReactNode; volume?: number; onVolume?: (v: number) => void }) {
  const profile = useDB(d => d.profile)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const settings = useDB(d => d.settings)
  const low = remaining !== undefined && remaining < 5 * 60_000
  const settingsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const out = (e: PointerEvent) => !settingsRef.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', out)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-4 border-b px-4 exam-line exam-panel">
      <div className="flex items-center gap-3">
        <span className="rounded bg-[#e11d2e] px-2 py-0.5 text-sm font-black tracking-wide text-white">IELTS</span>
        <div className="hidden leading-tight sm:block">
          <div className="text-sm font-semibold">{profile.name || 'Candidate'}</div>
          <div className="text-xs opacity-60">{profile.candidateId ? `ID ${profile.candidateId}` : 'Practice candidate'} · {title}</div>
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        {remaining !== undefined && (
          <button onClick={() => setHidden(h => !h)} title={hidden ? 'Show time' : 'Hide time'}
            className={`flex items-center gap-2 rounded-md px-3 py-1 font-mono text-[15px] font-bold tabular-nums transition ${low ? 'animate-pulse bg-rose-600 text-white' : 'exam-muted'}`}>
            <Clock size={15} />
            {hidden ? 'Time hidden' : `${fmtClock(remaining)} left`}
            {hidden ? <Eye size={14} /> : <EyeOff size={14} className="opacity-50" />}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {onVolume && volumeSettable && (
          <label className="flex items-center gap-2 text-xs" title="Volume">
            <Volume2 size={16} className="hidden sm:block" />
            <input type="range" min={0} max={1} step={0.05} value={volume} onChange={e => onVolume(Number(e.target.value))} className="w-16 accent-blue-600 sm:w-24" aria-label="Volume" />
          </label>
        )}
        <Wifi size={16} className="hidden opacity-50 sm:block" aria-label="Connected" />
        <div className="relative" ref={settingsRef}>
          <button onClick={() => setOpen(o => !o)} className="rounded-md p-1.5 transition hover:opacity-70" aria-label="Display settings" aria-expanded={open}><Settings2 size={18} /></button>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-10 w-64 rounded-lg border bg-white p-3 text-sm text-slate-800 shadow-xl">
                <div className="mb-1.5 font-semibold">Text size</div>
                <div className="mb-3 flex gap-1.5">
                  {[0.9, 1, 1.15, 1.3].map(s => (
                    <button key={s} onClick={() => setSettings({ fontScale: s })} className={`flex-1 rounded border py-1 ${settings.fontScale === s ? 'border-blue-600 bg-blue-50 font-bold' : 'border-slate-200'}`} style={{ fontSize: 12 * s }}>A</button>
                  ))}
                </div>
                <div className="mb-1.5 font-semibold">Colour</div>
                {([['standard', 'Black on white'], ['yellow-black', 'Yellow on black'], ['white-black', 'White on black']] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setSettings({ contrast: k })} className={`mb-1 block w-full rounded border px-2 py-1 text-left ${settings.contrast === k ? 'border-blue-600 bg-blue-50 font-semibold' : 'border-slate-200'}`}>{l}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {right}
      </div>
    </header>
  )
}

export interface NavPart {
  label: string
  numbers: { n: number; answered: boolean; flagged: boolean }[]
}

export function partNav(groups: QuestionGroup[], answers: Record<string, AnswerValue>, flags: string[], label: string): NavPart {
  return {
    label,
    numbers: groups.flatMap(g =>
      g.questions.map((q, i) => {
        const v = g.type === 'mcq_multi' ? answers[g.id] : answers[q.id]
        const answered = g.type === 'mcq_multi' ? ((v as string[] | undefined)?.length ?? 0) > i : Boolean(v && String(v).trim())
        return { n: q.number, answered, flagged: flags.includes(q.id) }
      }),
    ),
  }
}

/** Bottom bar: part tabs with question buttons — answered (filled), flagged (amber), current (ring). */
export function QuestionNav({ parts, current, onPart, onJump, currentNumber, onPrev, onNext, action }: {
  parts: NavPart[]; current: number; onPart: (i: number) => void; onJump: (n: number) => void; currentNumber?: number
  onPrev?: () => void; onNext?: () => void; action?: ReactNode
}) {
  return (
    <footer className="z-20 flex min-h-16 shrink-0 items-center gap-2 overflow-x-auto border-t px-3 py-2 exam-line exam-panel scroll-thin">
      <div className="flex flex-1 items-center gap-2">
        {parts.map((p, i) => {
          const done = p.numbers.filter(x => x.answered).length
          return (
            <div key={p.label} className={`flex items-center gap-2 rounded-md px-2 py-1 transition ${i === current ? 'exam-muted' : ''}`}>
              <button onClick={() => onPart(i)} className="whitespace-nowrap text-sm font-bold">
                {p.label}
                {i !== current && <span className="ml-1.5 text-xs font-normal opacity-60">{done} of {p.numbers.length}</span>}
              </button>
              {i === current && (
                <div className="flex flex-wrap gap-1">
                  {p.numbers.map(x => (
                    <button key={x.n} onClick={() => onJump(x.n)} aria-label={`Question ${x.n}${x.answered ? ', answered' : ''}${x.flagged ? ', flagged' : ''}`}
                      className={`relative h-7 min-w-7 rounded border text-xs font-semibold transition hover:scale-110 exam-line
                        ${x.answered ? 'bg-[var(--exam-fg)] text-[var(--exam-bg)]' : ''} ${currentNumber === x.n ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}>
                      {x.n}
                      {x.flagged && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2">
        {onPrev && <button onClick={onPrev} className="rounded-md border p-2 exam-line hover:opacity-70" aria-label="Previous"><ChevronLeft size={18} /></button>}
        {onNext && <button onClick={onNext} className="rounded-md border p-2 exam-line hover:opacity-70" aria-label="Next"><ChevronRight size={18} /></button>}
        {action}
      </div>
    </footer>
  )
}

export function jumpTo(n: number) {
  const el = document.getElementById(`q-${n}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => (el?.querySelector('input,select') as HTMLElement | null ?? (el instanceof HTMLInputElement || el instanceof HTMLSelectElement ? el : null))?.focus({ preventScroll: true }), 350)
}

/** Draggable split pane (passage | questions), like the CD-IELTS layout. */
export function SplitPane({ left, right }: { left: ReactNode; right: ReactNode }) {
  const [pct, setPct] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const drag = (e: React.PointerEvent) => {
    const box = ref.current!.getBoundingClientRect()
    const move = (ev: PointerEvent) => setPct(Math.min(75, Math.max(25, ((ev.clientX - box.left) / box.width) * 100)))
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    e.preventDefault()
  }
  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="min-h-0 overflow-y-auto p-6 scroll-thin md:p-8" style={{ flexBasis: `${pct}%` }}>{left}</div>
      <div
        onPointerDown={drag} tabIndex={0} role="separator" aria-label="Resize panels" aria-orientation="vertical"
        aria-valuemin={25} aria-valuemax={75} aria-valuenow={Math.round(pct)}
        onKeyDown={e => {
          const step = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 }[e.key]
          if (step === undefined) return
          e.preventDefault()
          setPct(p => Math.min(75, Math.max(25, p + step)))
        }}
        className="group hidden w-2 shrink-0 cursor-col-resize items-center justify-center border-x outline-none exam-line exam-muted focus-visible:ring-2 focus-visible:ring-blue-500 md:flex"
      >
        <div className="h-10 w-0.5 rounded bg-current opacity-30 transition group-hover:opacity-70" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-6 scroll-thin md:p-8">{right}</div>
    </div>
  )
}
