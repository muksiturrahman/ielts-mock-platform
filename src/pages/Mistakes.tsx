import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, BookOpen, Headphones, Lightbulb, Mic, NotebookPen, PenLine, RotateCcw, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Empty, PageHeader, cx, fmtDate } from '../components/ui'
import { createAttempt } from '../lib/attempts'
import { collectMistakes, collectSpeakingNotes, collectWritingNotes, questionText, type Mistake } from '../lib/review'
import { typeLabel } from '../lib/scoring'
import { useDB } from '../lib/store'

type Tab = 'listening' | 'reading' | 'writing' | 'speaking'
const TABS: { id: Tab; label: string; icon: typeof Headphones }[] = [
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'listening', label: 'Listening', icon: Headphones },
  { id: 'writing', label: 'Writing', icon: PenLine },
  { id: 'speaking', label: 'Speaking', icon: Mic },
]

export default function Mistakes() {
  const attempts = useDB(d => d.attempts)
  const tests = useDB(d => d.tests)
  const mistakes = useMemo(() => collectMistakes(attempts, tests), [attempts, tests])
  const writing = useMemo(() => collectWritingNotes(attempts), [attempts])
  const speaking = useMemo(() => collectSpeakingNotes(attempts), [attempts])
  const counts: Record<Tab, number> = {
    reading: mistakes.filter(m => m.module === 'reading').length,
    listening: mistakes.filter(m => m.module === 'listening').length,
    writing: writing.length,
    speaking: speaking.length,
  }
  const [tab, setTab] = useState<Tab>(() => TABS.find(t => counts[t.id])?.id ?? 'reading')
  const [type, setType] = useState('all')

  const objective = mistakes.filter(m => m.module === tab)
  const types = [...new Set(objective.map(m => typeLabel(m.item.type)))]
  const shown = objective.filter(m => type === 'all' || typeLabel(m.item.type) === type)
  const worst = Object.entries(
    mistakes.reduce<Record<string, number>>((acc, m) => ({ ...acc, [typeLabel(m.item.type)]: (acc[typeLabel(m.item.type)] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1])[0]

  return (
    <div>
      <PageHeader title="Mistakes notebook" subtitle="Every wrong answer and AI correction from all your tests — learn from each one, then practise that part again." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TABS.map((t, i) => (
          <motion.button key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => { setTab(t.id); setType('all') }}
            className={cx('card flex items-center gap-3 p-4 text-left transition', tab === t.id ? 'ring-4 ring-brand-100 border-brand-500' : 'hover:border-slate-300')}>
            <span className={cx('rounded-xl p-2', tab === t.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600')}><t.icon size={18} /></span>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900">{counts[t.id]}</div>
              <div className="text-xs text-slate-500">{t.label} {t.id === 'writing' || t.id === 'speaking' ? 'corrections' : 'mistakes'}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {worst && (tab === 'listening' || tab === 'reading') && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          <Target size={18} className="shrink-0" />
          <span>Your most frequent mistake type is <b>{worst[0]}</b> ({worst[1]} wrong). Focus your next practice there.</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {(tab === 'listening' || tab === 'reading') && (
            <>
              {types.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {['all', ...types].map(t => (
                    <button key={t} onClick={() => setType(t)} className={cx('rounded-full border px-3 py-1 text-sm font-medium transition', type === t ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300')}>
                      {t === 'all' ? `All (${objective.length})` : `${t} (${objective.filter(m => typeLabel(m.item.type) === t).length})`}
                    </button>
                  ))}
                </div>
              )}
              {shown.length === 0 ? (
                <Empty icon={<NotebookPen />} title={counts[tab] ? 'No mistakes of this type' : `No ${tab} mistakes yet`}>
                  {counts[tab] ? 'Pick another filter.' : 'Wrong answers from your tests will collect here so you can learn from them.'}
                </Empty>
              ) : (
                <div className="space-y-3">{shown.map((m, i) => <MistakeCard key={m.key} m={m} index={i} />)}</div>
              )}
            </>
          )}

          {tab === 'writing' && (
            writing.length === 0 ? <Empty icon={<PenLine />} title="No writing corrections yet">Corrections from AI-marked Writing tasks appear here.</Empty> : (
              <div className="grid gap-3 md:grid-cols-2">
                {writing.map((w, i) => (
                  <Correction key={w.key} index={i} type={w.note.type} quote={w.note.quote} fix={w.note.suggestion} why={w.note.issue}
                    meta={`${w.attempt.testTitle} · Task ${w.task} · ${fmtDate(w.attempt.startedAt)}`} to={`/results/${w.attempt.id}?tab=writing`} />
                ))}
              </div>
            )
          )}

          {tab === 'speaking' && (
            speaking.length === 0 ? <Empty icon={<Mic />} title="No speaking notes yet">Notes from AI-marked Speaking tests appear here.</Empty> : (
              <div className="grid gap-3 md:grid-cols-2">
                {speaking.map((s, i) => (
                  <Correction key={s.key} index={i} type={s.note.type} quote={s.note.quote} fix={s.note.upgrade} why={s.note.note}
                    meta={`${s.attempt.testTitle} · ${fmtDate(s.attempt.startedAt)}`} to={`/results/${s.attempt.id}?tab=speaking`} />
                ))}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function MistakeCard({ m, index }: { m: Mistake; index: number }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const test = useDB(d => d.tests.find(t => t.id === m.attempt.testId))
  const q = m.located
  const retry = () => {
    if (!test || !q) return
    const a = createAttempt(test, { mode: 'practice', modules: [m.module], sections: [q.sectionIndex], timed: false })
    navigate(`/exam/${a.id}`)
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 12) * 0.03 }} className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-start gap-4 p-4 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 font-display font-extrabold text-rose-700">{m.item.number}</span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Badge tone="violet">{typeLabel(m.item.type)}</Badge>
            <span>{m.attempt.testTitle}{q ? ` · ${q.sectionTitle}` : ''} · {fmtDate(m.attempt.finishedAt ?? m.attempt.startedAt)}</span>
          </div>
          <div className="font-medium text-slate-800">{questionText(q) || `Question ${m.item.number}`}</div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-slate-500">You: <b className={m.item.given ? 'text-rose-600 line-through decoration-rose-300' : 'italic text-slate-400'}>{m.item.given || 'no answer'}</b></span>
            <span className="text-slate-500">Correct: <b className="text-emerald-600">{(m.item.accepted ?? q?.question.answer)?.join(' / ') ?? m.item.correct}</b></span>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="mt-2 text-slate-300"><ArrowRight size={16} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="border-t border-slate-100 bg-slate-50 p-4">
              {q?.group.instructions && <p className="mb-2 text-xs font-semibold text-slate-500">{q.group.instructions}</p>}
              {q?.question.explanation ? (
                <p className="flex gap-2 text-sm text-slate-700"><Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />{q.question.explanation}</p>
              ) : <p className="text-sm text-slate-500">No explanation was written for this question.</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/results/${m.attempt.id}?tab=${m.module}&q=${m.item.number}`}><Button size="sm" variant="secondary">Review in context <ArrowRight size={14} /></Button></Link>
                {test && q && <Button size="sm" onClick={retry}><RotateCcw size={14} /> Retry this part</Button>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const TYPE_TONE: Record<string, 'rose' | 'violet' | 'sky' | 'amber' | 'brand' | 'slate'> = {
  grammar: 'rose', vocabulary: 'violet', cohesion: 'sky', task: 'amber', spelling: 'rose', punctuation: 'slate', pronunciation: 'amber', hesitation: 'sky',
}

function Correction({ index, type, quote, fix, why, meta, to }: { index: number; type: string; quote: string; fix?: string; why: string; meta: string; to: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 12) * 0.03 }}>
      <Card className="h-full p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Badge tone={TYPE_TONE[type] ?? 'slate'}>{type}</Badge>
          <Link to={to} className="text-xs font-semibold text-brand-600 hover:underline">Open</Link>
        </div>
        <p className="text-sm text-rose-600 line-through decoration-rose-300">“{quote}”</p>
        {fix && <p className="mt-1 text-sm font-semibold text-emerald-600">→ {fix}</p>}
        <p className="mt-2 text-sm text-slate-600">{why}</p>
        <p className="mt-3 text-xs text-slate-400">{meta}</p>
      </Card>
    </motion.div>
  )
}
