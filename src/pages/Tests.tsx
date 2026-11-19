import { motion } from 'motion/react'
import { BookOpen, GraduationCap, Headphones, Mic, PenLine, Play, Search, Timer } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Empty, Modal, PageHeader, Toggle, cx } from '../components/ui'
import { availableModules, createAttempt, MODULE_LABEL, MODULE_MINUTES, moduleMinutes } from '../lib/attempts'
import { useDB } from '../lib/store'
import type { ModuleKey, Test } from '../lib/types'

export const MODULE_ICON: Record<ModuleKey, typeof Headphones> = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: Mic }
export const MODULE_TONE: Record<ModuleKey, string> = {
  listening: 'from-sky-500 to-blue-600', reading: 'from-emerald-500 to-teal-600', writing: 'from-amber-500 to-orange-600', speaking: 'from-fuchsia-500 to-violet-600',
}

export default function Tests() {
  const tests = useDB(d => d.tests.filter(t => t.status === 'published' && !t.deleted))
  const [filter, setFilter] = useState<'all' | 'academic' | 'general'>('all')
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<Test>()
  const hasKey = useDB(d => Boolean(d.settings.keys[d.settings.provider]?.trim()))
  const shown = useMemo(
    () => tests
      .filter(t => (filter === 'all' || t.variant === filter) && t.title.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => Number(availableModules(b).length === 4) - Number(availableModules(a).length === 4)), // full exams first
    [tests, filter, q],
  )

  return (
    <div>
      <PageHeader title="Mock tests" subtitle="Full computer-delivered mock exams, or practise one module at a time." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          {(['all', 'academic', 'general'] as const).map(f => (
            <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} className={cx('relative rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition', filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-800')}>
              {filter === f && <motion.span layoutId="filter" className="absolute inset-0 rounded-lg bg-slate-900" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative">{f === 'general' ? 'General Training' : f}</span>
            </button>
          ))}
        </div>
        <label className="relative min-w-60 flex-1 sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search tests" aria-label="Search tests" value={q} onChange={e => setQ(e.target.value)} />
        </label>
      </div>

      <div className="mb-6 flex gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-slate-700">
        <GraduationCap size={20} className="mt-0.5 shrink-0 text-brand-600" />
        <div>
          <b className="text-slate-900">New here? Start with a Full mock exam.</b> It's the complete test in the real order and timing:
          Listening, Reading, Writing, then Speaking — about {fmtDuration(Object.values(MODULE_MINUTES).reduce((a, b) => a + b, 0))}.
          Choose <b>Academic</b> if you're taking IELTS for university study, or <b>General Training</b> for work or migration.
          <span className="text-slate-500"> Or use Practice to drill one part at a time.</span>
          {!hasKey && (
            <span className="mt-1.5 block font-medium text-amber-700">
              Writing and Speaking need a free AI key to be marked — <Link to="/settings" className="underline">add one in Settings</Link> (takes 2 minutes). Listening and Reading are marked without it.
            </span>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <Empty icon={<BookOpen />} title="No tests found">Try another search or filter.</Empty>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((t, i) => <TestCard key={t.id} test={t} index={i} onStart={() => setPicked(t)} />)}
        </div>
      )}
      {picked && <StartDialog test={picked} onClose={() => setPicked(undefined)} />}
    </div>
  )
}

function TestCard({ test, index, onStart }: { test: Test; index: number; onStart: () => void }) {
  const mods = availableModules(test)
  const full = mods.length === 4
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={cx('card group relative flex flex-col overflow-hidden p-5 transition-shadow hover:shadow-xl hover:shadow-brand-500/10', full && 'ring-2 ring-brand-300')}
    >
      <div className={cx('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', test.variant === 'academic' ? 'from-brand-500 to-violet-500' : 'from-emerald-500 to-teal-500')} />
      <div className="mb-3 flex items-center gap-2">
        <Badge tone={test.variant === 'academic' ? 'brand' : 'green'}>{test.variant === 'academic' ? 'Academic' : 'General Training'}</Badge>
        {full ? <Badge tone="violet">Full mock</Badge> : <Badge>Practice</Badge>}
      </div>
      <h3 className="font-display text-lg font-bold text-slate-900">{test.title}</h3>
      {full && (
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-brand-600">
          <Timer size={13} /> Real exam format · 4 parts · about {fmtDuration(mods.reduce((n, m) => n + moduleMinutes(test, m), 0))}
        </p>
      )}
      <p className="mt-1 flex-1 text-sm text-slate-500">{test.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {mods.map(m => {
          const Icon = MODULE_ICON[m]
          return (
            <span key={m} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              <Icon size={13} /> {MODULE_LABEL[m]}
            </span>
          )
        })}
      </div>
      <Button className="mt-5" variant={full ? 'primary' : 'secondary'} onClick={onStart}><Play size={16} /> {full ? 'Start full exam' : 'Start practice'}</Button>
    </motion.div>
  )
}

function StartDialog({ test, onClose }: { test: Test; onClose: () => void }) {
  const navigate = useNavigate()
  const hasKey = useDB(d => Boolean(d.settings.keys[d.settings.provider]?.trim()))
  const mods = availableModules(test)
  const [mode, setMode] = useState<'full' | 'practice'>(mods.length === 4 ? 'full' : 'practice')
  const [module, setModule] = useState<ModuleKey>(mods[0])
  const [sections, setSections] = useState<number[] | undefined>()
  const [timed, setTimed] = useState(true)

  const partOptions: { label: string; value: number }[] =
    module === 'listening' ? test.listening!.sections.map((s, i) => ({ label: s.title, value: i }))
      : module === 'reading' ? test.reading!.sections.map((s, i) => ({ label: s.title, value: i }))
        : module === 'writing' ? test.writing!.tasks.map(t => ({ label: `Task ${t.number}`, value: t.number }))
          : []

  const start = () => {
    const a = mode === 'full'
      ? createAttempt(test, { mode: 'full', modules: mods, timed: true })
      : createAttempt(test, { mode: 'practice', modules: [module], sections, timed })
    navigate(`/exam/${a.id}`)
  }
  const totalMin = mode === 'full' ? mods.reduce((s, m) => s + moduleMinutes(test, m), 0) : moduleMinutes(test, module, sections)

  return (
    <Modal open onClose={onClose} title={test.title}>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
        {(['full', 'practice'] as const).map(m => (
          <button key={m} aria-pressed={mode === m} disabled={m === 'full' && mods.length < 4} onClick={() => setMode(m)}
            className={cx('rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-40', mode === m ? 'bg-white text-slate-900 shadow' : 'text-slate-500')}>
            {m === 'full' ? 'Full mock exam' : 'Practice'}
          </button>
        ))}
      </div>

      {mode === 'full' ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Sit the whole test in one go, exactly like exam day. All modules are timed.</p>
          {mods.map((m, i) => {
            const Icon = MODULE_ICON[m]
            return (
              <motion.div key={m} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                <span className={cx('rounded-lg bg-gradient-to-br p-2 text-white', MODULE_TONE[m])}><Icon size={16} /></span>
                <span className="font-semibold">{MODULE_LABEL[m]}</span>
                <span className="ml-auto text-sm text-slate-500">{m === 'speaking' ? '11–14' : moduleMinutes(test, m)} min</span>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="label">Module</div>
            <div className="grid grid-cols-2 gap-2">
              {mods.map(m => {
                const Icon = MODULE_ICON[m]
                return (
                  <button key={m} aria-pressed={module === m} onClick={() => { setModule(m); setSections(undefined) }}
                    className={cx('flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-semibold transition', module === m ? 'border-brand-500 bg-brand-50 text-brand-700 ring-4 ring-brand-100' : 'border-slate-200 hover:border-slate-300')}>
                    <Icon size={16} /> {MODULE_LABEL[m]}
                  </button>
                )
              })}
            </div>
          </div>
          {partOptions.length > 1 && (
            <div>
              <div className="label">Part</div>
              <div className="flex flex-wrap gap-2">
                <button aria-pressed={!sections} onClick={() => setSections(undefined)} className={cx('rounded-lg border px-3 py-1.5 text-sm font-medium', !sections ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200')}>All</button>
                {partOptions.map(p => (
                  <button key={p.value} aria-pressed={sections?.[0] === p.value} onClick={() => setSections([p.value])} className={cx('rounded-lg border px-3 py-1.5 text-sm font-medium', sections?.[0] === p.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200')}>{p.label}</button>
                ))}
              </div>
            </div>
          )}
          {module !== 'speaking' && <Toggle checked={timed} onChange={setTimed} label="Timed (exam conditions)" />}
          <p className="text-xs text-slate-400">Practice mode lets you check answers with explanations before submitting.</p>
        </div>
      )}

      {!hasKey && (mode === 'full' || module === 'writing' || module === 'speaking') && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          No AI key yet: {mode === 'full' ? 'Writing and Speaking' : MODULE_LABEL[module]} won't get a band{mode === 'full' ? ', so there is no overall band' : ''} until you <Link to="/settings" className="font-semibold underline">add a free key in Settings</Link>. You can still take the test and mark it later.
        </p>
      )}
      <div className="mt-6 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-slate-500"><Timer size={15} /> {mode === 'practice' && !timed ? 'Untimed' : `about ${fmtDuration(totalMin)}`}</span>
        <Button size="lg" onClick={start}><Play size={18} /> Begin</Button>
      </div>
    </Modal>
  )
}

const fmtDuration = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}` : `${min} min`)
