import { motion } from 'motion/react'
import { BarChart3, Copy, Download, Eye, EyeOff, FileJson, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Button, Card, Empty, PageHeader, cx, fmtBand, fmtDate, useToast } from '../components/ui'
import { restoreSeed, SEED_TESTS } from '../data/seed'
import { attemptOverall, availableModules, MODULE_LABEL } from '../lib/attempts'
import { DEFAULT_SPEAKING_PROMPT, DEFAULT_WRITING_PROMPT } from '../lib/prompts'
import { deleteTest, saveTest, setSettings, uid, useDB } from '../lib/store'
import { isTestShape, testIssues } from '../lib/validate'
import type { Test } from '../lib/types'

type Tab = 'tests' | 'analytics' | 'prompts'

export default function Admin() {
  const [tab, setTab] = useState<Tab>('tests')
  return (
    <div>
      <PageHeader title="Admin" subtitle="Build and publish mock tests, review platform analytics and tune the AI rubric." />
      <div role="tablist" className="mb-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm scroll-thin">
        {([['tests', 'Test library', FileJson], ['analytics', 'Analytics', BarChart3], ['prompts', 'Rubric prompts', SlidersHorizontal]] as const).map(([k, l, Icon]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cx('relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition', tab === k ? 'text-white' : 'text-slate-500 hover:text-slate-800')}>
            {tab === k && <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-xl bg-slate-900" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <Icon size={15} className="relative" /><span className="relative">{l}</span>
          </button>
        ))}
      </div>
      {tab === 'tests' && <Library />}
      {tab === 'analytics' && <Analytics />}
      {tab === 'prompts' && <Prompts />}
    </div>
  )
}

function download(name: string, text: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000) // after the download has started
}

export function blankTest(variant: Test['variant'] = 'academic'): Test {
  return { id: uid('test-'), title: 'Untitled test', variant, status: 'draft', createdAt: Date.now(), updatedAt: Date.now(), description: '' }
}


function Library() {
  const tests = useDB(d => d.tests.filter(t => !t.deleted).sort((a, b) => b.updatedAt - a.updatedAt))
  const seeded = useDB(d => d.seeded)
  const attempts = useDB(d => d.attempts)
  const navigate = useNavigate()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const missingSeeds = SEED_TESTS.filter(s => seeded.includes(s.id) && !tests.some(t => t.id === s.id))

  const importFile = async (f: File) => {
    try {
      const data = JSON.parse(await f.text())
      const list = (Array.isArray(data) ? data : [data]).map(t => (t && typeof t === 'object' && typeof t.id !== 'string' ? { ...t, id: 'import' } : t)).filter(isTestShape)
      if (!list.length) throw new Error('No valid tests in this file')
      list.forEach(t => saveTest({ ...t, id: uid('test-'), status: 'draft', deleted: undefined, createdAt: Date.now() }))
      toast(`Imported ${list.length} test${list.length > 1 ? 's' : ''} as draft`, 'success')
    } catch (e) {
      toast(`Import failed: ${(e as Error).message}`, 'error')
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <Button onClick={() => { const t = blankTest(); saveTest(t); navigate(`/admin/tests/${t.id}`) }}><Plus size={16} /> New test</Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload size={16} /> Import JSON</Button>
        <Button variant="secondary" onClick={() => download('bandready-tests.json', JSON.stringify(tests, null, 2))}><Download size={16} /> Export all</Button>
        {missingSeeds.map(s => <Button key={s.id} variant="ghost" onClick={() => { restoreSeed(s.id); toast(`Restored ${s.title}`, 'success') }}><RotateCcw size={15} /> Restore “{s.title}”</Button>)}
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e => { const f = e.target.files?.[0]; if (f) void importFile(f); e.target.value = '' }} />
      </div>
      {tests.length === 0 ? (
        <Empty icon={<FileJson />} title="No tests">Create a test or import one from JSON.</Empty>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-5 py-3">Test</th><th className="px-3 py-3">Modules</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Attempts</th><th className="px-3 py-3">Updated</th><th /></tr>
            </thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.id} className="border-t border-slate-100 transition hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-800">{t.title}</div>
                    <div className="text-xs text-slate-500">{t.variant === 'academic' ? 'Academic' : 'General Training'}</div>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">{availableModules(t).map(m => MODULE_LABEL[m]).join(' · ') || '—'}</td>
                  <td className="px-3 py-3"><Badge tone={t.status === 'published' ? 'green' : 'amber'}>{t.status}</Badge></td>
                  <td className="px-3 py-3">{attempts.filter(a => a.testId === t.id).length}</td>
                  <td className="px-3 py-3 text-xs text-slate-500">{fmtDate(t.updatedAt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <IconBtn title="Edit" onClick={() => navigate(`/admin/tests/${t.id}`)}><Pencil size={15} /></IconBtn>
                      <IconBtn title={t.status === 'published' ? 'Unpublish' : 'Publish'} onClick={() => {
                        if (t.status === 'published') { saveTest({ ...t, status: 'draft' }); return toast('Moved to drafts', 'success') }
                        const n = testIssues(t).blocking.length
                        if (n) return toast(`Can't publish — ${n} problem${n > 1 ? 's' : ''} to fix. Open the test to see them.`, 'error')
                        saveTest({ ...t, status: 'published' }); toast('Published — students can see it now', 'success')
                      }}>
                        {t.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                      </IconBtn>
                      <IconBtn title="Duplicate" onClick={() => { saveTest({ ...structuredClone(t), id: uid('test-'), title: `${t.title} (copy)`, status: 'draft', createdAt: Date.now() }); toast('Duplicated') }}><Copy size={15} /></IconBtn>
                      <IconBtn title="Export JSON" onClick={() => download(`${t.title.replace(/\W+/g, '-').toLowerCase()}.json`, JSON.stringify(t, null, 2))}><Download size={15} /></IconBtn>
                      <IconBtn title="Delete" danger onClick={() => { if (confirm(`Delete “${t.title}”? Past attempts keep their results.`)) { deleteTest(t.id); toast('Test deleted') } }}><Trash2 size={15} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

function IconBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean }) {
  return <button title={title} aria-label={title} onClick={onClick} className={cx('rounded-lg p-2 transition', danger ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800')}>{children}</button>
}

function Analytics() {
  const attempts = useDB(d => d.attempts)
  const tests = useDB(d => d.tests).filter(t => !t.deleted) // same list as the Library
  const visible = new Set(tests.map(t => t.id))
  const done = attempts.filter(a => a.status === 'completed' && visible.has(a.testId))
  // Per-question difficulty across attempts → hardest items first.
  const items = new Map<string, { label: string; c: number; t: number }>()
  for (const a of done) {
    for (const m of ['listening', 'reading'] as const) {
      for (const it of a.results[m]?.items ?? []) {
        const k = `${a.testId}:${it.questionId}`
        const e = items.get(k) ?? { label: `${a.testTitle} · ${MODULE_LABEL[m]} Q${it.number}`, c: 0, t: 0 }
        e.t++
        if (it.isCorrect) e.c++
        items.set(k, e)
      }
    }
  }
  const hardest = [...items.values()].filter(x => x.t >= 1).sort((a, b) => a.c / a.t - b.c / b.t).slice(0, 8)
  const byTest = tests.map(t => {
    const as = done.filter(a => a.testId === t.id)
    const os = as.map(attemptOverall).filter((x): x is number => x !== undefined)
    return { name: t.title.length > 22 ? `${t.title.slice(0, 22)}…` : t.title, attempts: as.length, avg: os.length ? os.reduce((a, b) => a + b, 0) / os.length : undefined }
  }).filter(x => x.attempts)
  const wroteSomething = (a: (typeof done)[number]) => Boolean(a.results.writing?.task1?.wordCount || a.results.writing?.task2?.wordCount)
  const aiMarked = done.filter(a => (a.results.writing?.status === 'done' && wroteSomething(a)) || a.results.speaking?.status === 'done').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[['Tests', tests.length], ['Published', tests.filter(t => t.status === 'published').length], ['Completed attempts', done.length], ['AI-marked', aiMarked]].map(([k, v], i) => (
          <Card key={k as string} delay={i * 0.05} className="p-5">
            <div className="text-sm text-slate-500">{k}</div>
            <div className="mt-1 font-display text-3xl font-extrabold">{v}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 font-display text-lg font-bold">Attempts per test</div>
          {byTest.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byTest}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, k) => (k === 'avg' ? fmtBand(v as number) : v)} />
                <Bar dataKey="attempts" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No completed attempts yet.</p>}
        </Card>
        <Card className="p-6">
          <div className="mb-4 font-display text-lg font-bold">Hardest questions</div>
          {hardest.length ? (
            <ul className="space-y-3">
              {hardest.map(h => (
                <li key={h.label}>
                  <div className="mb-1 flex justify-between text-sm"><span className="text-slate-700">{h.label}</span><b>{Math.round((h.c / h.t) * 100)}%</b></div>
                  <div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-rose-400" style={{ width: `${(h.c / h.t) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">Item statistics appear after Listening/Reading attempts.</p>}
        </Card>
      </div>
    </div>
  )
}

function Prompts() {
  const settings = useDB(d => d.settings)
  const toast = useToast()
  const [w, setW] = useState(settings.writingPrompt)
  const [s, setS] = useState(settings.speakingPrompt)
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {([['Writing examiner prompt', w, setW, DEFAULT_WRITING_PROMPT], ['Speaking examiner prompt', s, setS, DEFAULT_SPEAKING_PROMPT]] as const).map(([title, val, set, def]) => (
        <Card key={title} className="p-6">
          <div className="mb-1 font-display text-lg font-bold">{title}</div>
          <p className="mb-3 text-sm text-slate-500">System prompt sent to the AI examiner (whichever provider is chosen in Settings). The scoring schema (criteria, annotations, model answer) is fixed in code, so only tune wording and calibration here.</p>
          <textarea className="input h-80 font-mono text-xs leading-relaxed" value={val} onChange={e => set(e.target.value)} />
          <div className="mt-3 flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => set(def)}><RotateCcw size={14} /> Reset to default</Button>
          </div>
        </Card>
      ))}
      <div className="lg:col-span-2">
        <Button onClick={() => { setSettings({ writingPrompt: w, speakingPrompt: s }); toast('Rubric prompts saved', 'success') }}>Save prompts</Button>
      </div>
    </div>
  )
}
