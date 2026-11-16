import { motion } from 'motion/react'
import { ArrowRight, History as HistoryIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Empty, PageHeader, cx, bandColor, fmtBand, fmtDate, useToast } from '../components/ui'
import { attemptOverall, MODULE_LABEL, moduleBands } from '../lib/attempts'
import { deleteMedia } from '../lib/media'
import { deleteAttempt, useDB } from '../lib/store'

export default function HistoryPage() {
  const all = useDB(d => [...d.attempts].sort((a, b) => b.startedAt - a.startedAt))
  const toast = useToast()
  const [mode, setMode] = useState<'all' | 'full' | 'practice'>('all')
  const [mod, setMod] = useState<'all' | 'listening' | 'reading' | 'writing' | 'speaking'>('all')
  const attempts = all.filter(a => (mode === 'all' || a.mode === mode) && (mod === 'all' || a.modules.includes(mod)))
  const chip = (on: boolean) => cx('rounded-full border px-3 py-1 text-sm font-medium transition', on ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300')
  return (
    <div>
      <PageHeader title="My results" subtitle="Every attempt, with full feedback. In-progress tests can be resumed." />
      {all.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {(['all', 'full', 'practice'] as const).map(m => <button key={m} onClick={() => setMode(m)} className={chip(mode === m)}>{m === 'all' ? 'All modes' : m === 'full' ? 'Full mocks' : 'Practice'}</button>)}
          <span className="mx-1 w-px bg-slate-200" />
          {(['all', 'listening', 'reading', 'writing', 'speaking'] as const).map(m => <button key={m} onClick={() => setMod(m)} className={chip(mod === m)}>{m === 'all' ? 'All modules' : MODULE_LABEL[m]}</button>)}
        </div>
      )}
      {attempts.length === 0 ? (
        <Empty icon={<HistoryIcon />} title={all.length ? 'No attempts match these filters' : 'No attempts yet'}>{all.length ? 'Try another filter.' : 'Start a mock test from the catalogue.'}</Empty>
      ) : (
        <div className="space-y-3">
          {attempts.map((a, i) => {
            const bands = moduleBands(a)
            const o = attemptOverall(a)
            return (
              <motion.div key={a.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.04 }}
                className="card flex flex-wrap items-center gap-4 p-4 transition hover:shadow-md">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-extrabold text-white" style={{ background: bandColor(o ?? Object.values(bands)[0]) }}>
                  {o !== undefined ? fmtBand(o) : Object.values(bands)[0] !== undefined ? fmtBand(Object.values(bands)[0]) : '…'}
                </div>
                <div className="min-w-48 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{a.testTitle}</span>
                    <Badge tone={a.mode === 'full' ? 'violet' : 'slate'}>{a.mode === 'full' ? 'Full mock' : 'Practice'}</Badge>
                    {a.status === 'in_progress' && <Badge tone="amber">In progress</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{fmtDate(a.startedAt)}</span>
                    {a.modules.map(m => {
                      const r = m === 'listening' || m === 'reading' ? a.results[m] : undefined
                      return <span key={m}>{MODULE_LABEL[m]} <b className="text-slate-700">{fmtBand(bands[m])}</b>{r && <span className="ml-1 text-slate-400">({r.items.filter(x => x.isCorrect).length}/{r.items.length})</span>}</span>
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" aria-label="Delete attempt" onClick={() => {
                    if (!confirm('Delete this attempt and its recordings?')) return
                    a.speaking.forEach(s => s.recordingId && void deleteMedia(s.recordingId))
                    deleteAttempt(a.id)
                    toast('Attempt deleted')
                  }}><Trash2 size={15} /></Button>
                  <Link to={a.status === 'completed' ? `/results/${a.id}` : `/exam/${a.id}`}>
                    <Button size="sm" variant={a.status === 'completed' ? 'secondary' : 'primary'}>{a.status === 'completed' ? 'View results' : 'Resume'} <ArrowRight size={15} /></Button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
