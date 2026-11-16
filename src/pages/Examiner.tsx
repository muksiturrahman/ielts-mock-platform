import { motion } from 'motion/react'
import { ClipboardCheck, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Empty, PageHeader, bandColor, cx, fmtBand, fmtDate, useToast } from '../components/ui'
import { moduleBands } from '../lib/attempts'
import { countWords } from '../lib/scoring'
import { patchAttempt, useDB } from '../lib/store'
import type { Attempt, ExaminerReview } from '../lib/types'

const W_CRIT = [['task', 'TA/TR'], ['coherence', 'CC'], ['lexical', 'LR'], ['grammar', 'GRA']] as const
const S_CRIT = [['fluency', 'FC'], ['lexical', 'LR'], ['grammar', 'GRA'], ['pronunciation', 'P']] as const
const BANDS = Array.from({ length: 19 }, (_, i) => i / 2)

export default function Examiner() {
  const queue = useDB(d => d.attempts.filter(a => a.status === 'completed' && (a.results.writing || a.results.speaking)).sort((a, b) => Number(Boolean(a.review)) - Number(Boolean(b.review)) || b.startedAt - a.startedAt))
  const [selected, setSelected] = useState<string>()
  const current = queue.find(a => a.id === selected) ?? queue[0]

  return (
    <div>
      <PageHeader title="Examiner review" subtitle="Hybrid marking: check the AI's Writing and Speaking bands, override any criterion and add feedback." />
      {queue.length === 0 ? (
        <Empty icon={<ClipboardCheck />} title="Nothing to review">Completed Writing and Speaking submissions will appear here.</Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="space-y-2">
            {queue.map(a => (
              <button key={a.id} onClick={() => setSelected(a.id)}
                className={cx('w-full rounded-2xl border p-4 text-left transition', current?.id === a.id ? 'border-brand-300 bg-brand-50 shadow' : 'border-slate-200 bg-white hover:border-slate-300')}>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-slate-800">{a.testTitle}</span>
                  {a.review ? <Badge tone="green">Reviewed</Badge> : <Badge tone="amber">To review</Badge>}
                </div>
                <div className="mt-1 text-xs text-slate-500">{fmtDate(a.startedAt)} · {[a.results.writing && 'Writing', a.results.speaking && 'Speaking'].filter(Boolean).join(' + ')}</div>
              </button>
            ))}
          </div>
          {current && <ReviewPanel key={current.id} attempt={current} />}
        </div>
      )}
    </div>
  )
}

function ReviewPanel({ attempt }: { attempt: Attempt }) {
  const examinerName = useDB(d => d.settings.examinerName)
  const toast = useToast()
  const [review, setReview] = useState<ExaminerReview>(attempt.review ?? { examiner: examinerName, at: 0, feedback: '' })
  useEffect(() => setReview(attempt.review ?? { examiner: examinerName, at: 0, feedback: '' }), [attempt.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const w = attempt.results.writing
  const s = attempt.results.speaking
  const bands = moduleBands({ ...attempt, review })

  const setW = (task: 'task1' | 'task2', k: string, v: string) =>
    setReview(r => ({ ...r, writing: { ...r.writing, [task]: { ...r.writing?.[task], [k]: v === '' ? undefined : Number(v) } } }))
  const setS = (k: string, v: string) => setReview(r => ({ ...r, speaking: { ...r.speaking, [k]: v === '' ? undefined : Number(v) } }))

  const save = () => {
    patchAttempt(attempt.id, { review: { ...review, examiner: examinerName, at: Date.now() } })
    toast('Review saved — bands updated for the candidate', 'success')
  }

  const BandSelect = ({ ai, value, onChange }: { ai?: number; value?: number; onChange: (v: string) => void }) => (
    <select value={value ?? ''} onChange={e => onChange(e.target.value)} className="input w-24 py-1.5">
      <option value="">{ai === undefined ? '—' : `AI ${fmtBand(ai)}`}</option>
      {BANDS.map(b => <option key={b} value={b}>{fmtBand(b)}</option>)}
    </select>
  )

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <Card className="flex flex-wrap items-center gap-6 p-5">
        <div className="flex-1">
          <div className="font-display text-lg font-bold">{attempt.testTitle}</div>
          <Link to={`/results/${attempt.id}`} className="text-sm font-semibold text-brand-600 hover:underline">Open candidate results →</Link>
        </div>
        {(['writing', 'speaking'] as const).filter(m => attempt.results[m]).map(m => (
          <div key={m} className="text-center">
            <div className="text-xs font-semibold uppercase text-slate-400">{m}</div>
            <div className="font-display text-3xl font-extrabold" style={{ color: bandColor(bands[m]) }}>{fmtBand(bands[m])}</div>
          </div>
        ))}
      </Card>

      {w && (['task1', 'task2'] as const).map(t => {
        const text = attempt.writing[t]
        const ev = w[t]
        if (!ev && !text) return null
        return (
          <Card key={t} className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-lg font-bold">Writing {t === 'task1' ? 'Task 1' : 'Task 2'}</span>
              <span className="text-sm text-slate-500">{countWords(text)} words</span>
            </div>
            <div className="mb-4 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 scroll-thin">{text || <i>No response</i>}</div>
            <div className="flex flex-wrap gap-4">
              {W_CRIT.map(([k, l]) => (
                <label key={k} className="text-sm">
                  <span className="label">{l}</span>
                  <BandSelect ai={ev?.criteria[k].band} value={review.writing?.[t]?.[k]} onChange={v => setW(t, k, v)} />
                </label>
              ))}
            </div>
          </Card>
        )
      })}

      {s && (
        <Card className="p-6">
          <div className="mb-3 font-display text-lg font-bold">Speaking</div>
          <div className="mb-4 max-h-80 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-4 text-sm scroll-thin">
            {attempt.speaking.map((a, i) => (
              <div key={i}><b>P{a.part}: {a.question}</b><p className="text-slate-600">{a.transcript || <i>(no speech recognised)</i>}</p></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {S_CRIT.map(([k, l]) => (
              <label key={k} className="text-sm">
                <span className="label">{l}</span>
                <BandSelect ai={s.criteria?.[k].band} value={review.speaking?.[k]} onChange={v => setS(k, v)} />
              </label>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <label className="label">Examiner feedback to the candidate</label>
        <textarea className="input h-32" value={review.feedback} onChange={e => setReview(r => ({ ...r, feedback: e.target.value }))} placeholder="Overall comments, priorities for improvement…" />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">{attempt.review ? `Last saved by ${attempt.review.examiner}, ${fmtDate(attempt.review.at)}` : 'Leave a criterion on “AI” to keep the AI band.'}</span>
          <Button onClick={save}><Save size={16} /> Save review</Button>
        </div>
      </Card>
    </motion.div>
  )
}
