import { BookOpen, CalendarDays, Coffee, Headphones, Mic, NotebookPen, PenLine, Play, Target, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, cx } from '../components/ui'
import { skillAverages, startDrill, weaknesses } from '../lib/analytics'
import { availableModules, createAttempt, MODULE_LABEL } from '../lib/attempts'
import { studyPlan, type PlanTask } from '../lib/plan'
import { setProfile, useDB } from '../lib/store'
import type { ModuleKey } from '../lib/types'

const MOD_ICON: Record<ModuleKey, typeof Headphones> = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: Mic }

function describe(t: PlanTask): { title: string; detail: string; icon: typeof Headphones } {
  switch (t.kind) {
    case 'mock': return { title: 'Full mock exam', detail: 'All four modules, timed, in one sitting — like the real day.', icon: Zap }
    case 'module': return { title: `${MODULE_LABEL[t.module]} practice`, detail: `One timed ${MODULE_LABEL[t.module]} paper — chosen because it is below your target or not measured yet.`, icon: MOD_ICON[t.module] }
    case 'drill': return { title: `${t.type} drill (${MODULE_LABEL[t.module]})`, detail: 'Your weakest question type — short, untimed, one type only.', icon: Target }
    case 'review': return { title: 'Review mistakes & vocabulary', detail: 'Clear what is due in the Mistakes notebook.', icon: NotebookPen }
    case 'rest': return { title: 'Rest', detail: 'Sleep well and keep it light — no new tests.', icon: Coffee }
  }
}

export default function Plan() {
  const navigate = useNavigate()
  const profile = useDB(d => d.profile)
  const attempts = useDB(d => d.attempts)
  const tests = useDB(d => d.tests.filter(t => t.status === 'published' && !t.deleted))
  const done = attempts.filter(a => a.status === 'completed')
  const bands = Object.fromEntries(Object.entries(skillAverages(done)).map(([k, v]) => [k, v!.band])) as Partial<Record<ModuleKey, number>>
  const weakTypes = weaknesses(done).filter(w => w.type && (w.module === 'listening' || w.module === 'reading')).map(w => ({ module: w.module as 'listening' | 'reading', type: w.type! }))
  const exam = profile.examDate ? new Date(`${profile.examDate}T00:00`) : undefined
  const plan = studyPlan({ today: new Date(), examDate: exam, target: profile.targetBand, bands, weakTypes })

  const start = (t: PlanTask) => {
    if (t.kind === 'review') return navigate('/mistakes')
    if (t.kind === 'drill') { const a = startDrill(tests, attempts, t.module, t.type); return a ? navigate(`/exam/${a.id}`) : navigate('/tests') }
    if (t.kind === 'mock') return navigate('/tests')
    if (t.kind !== 'module') return
    // The test this module was practised on least.
    const used = (id: string) => attempts.filter(a => a.testId === id && a.modules.includes(t.module)).length
    const test = tests.filter(x => availableModules(x).includes(t.module)).sort((a, b) => used(a.id) - used(b.id))[0]
    if (!test) return navigate('/tests')
    navigate(`/exam/${createAttempt(test, { mode: 'practice', modules: [t.module], timed: true }).id}`)
  }

  return (
    <div>
      <PageHeader title="Study plan" subtitle="Your next 7 days, built from your target, your exam date and your results so far." />
      <Card className="mb-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="label">Target band</span>
            <select className="input" value={profile.targetBand} onChange={e => setProfile({ targetBand: Number(e.target.value) })}>
              {Array.from({ length: 11 }, (_, i) => 4 + i / 2).map(b => <option key={b} value={b}>{b.toFixed(1)}</option>)}
            </select>
          </label>
          <label><span className="label">Exam date</span>
            <input className="input" type="date" value={profile.examDate ?? ''} min={new Date().toISOString().slice(0, 10)} onChange={e => setProfile({ examDate: e.target.value || undefined })} />
          </label>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays size={16} className="text-brand-600" />
          {plan.daysLeft === undefined ? 'Add your exam date to taper the plan before the test.'
            : plan.daysLeft < 0 ? 'That date has passed — set your next exam date.'
            : plan.daysLeft === 0 ? 'Your exam is today. Good luck!'
            : `${plan.daysLeft} day${plan.daysLeft === 1 ? '' : 's'} to your exam.`}
          {!done.length && ' Take a full mock first so the plan can target your weakest skills.'}
        </p>
      </Card>
      <div className="space-y-3">
        {plan.days.map((d, i) => {
          const info = describe(d.task)
          const Icon = info.icon
          return (
            <Card key={i} delay={i * 0.03} className={cx('flex flex-wrap items-center gap-3 p-4 sm:gap-4', i === 0 && 'ring-2 ring-brand-200')}>
              <div className="w-14 shrink-0 text-sm sm:w-20">
                <div className="font-semibold text-slate-900">{i === 0 ? 'Today' : d.date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <div className="text-xs text-slate-500">{d.date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
              </div>
              <span className="hidden rounded-xl bg-brand-50 p-2 text-brand-600 sm:block"><Icon size={18} /></span>
              <div className="min-w-40 flex-1">
                <div className="font-semibold text-slate-800">{info.title}</div>
                <div className="text-sm text-slate-500">{info.detail}</div>
              </div>
              {d.task.kind !== 'rest' && <Button className="ml-auto" size="sm" variant={i === 0 ? 'primary' : 'secondary'} onClick={() => start(d.task)}><Play size={14} /> Start</Button>}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
