import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowLeft, ChevronDown, Eye, FileUp, ImagePlus, Music, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, Modal, cx, useToast } from '../components/ui'
import { TaskChart } from '../components/TaskChart'
import { CSV_HEADER, questionsFromCsv } from '../lib/csv'
import { putMedia, resolveMediaUrl } from '../lib/media'
import { isTestShape, testIssues } from '../lib/validate'
import { saveTest, uid, useDB } from '../lib/store'
import type { ChartData, ListeningSection, Option, QuestionGroup, QuestionType, ReadingSection, Test, WritingTask } from '../lib/types'
import { Passage } from '../exam/Passage'
import { QuestionGroupView } from '../exam/QuestionGroupView'

type Tab = 'details' | 'listening' | 'reading' | 'writing' | 'speaking' | 'json'

const TYPES: [QuestionType, string][] = [
  ['completion', 'Completion (form/note/table/sentence/summary/short answer)'], ['mcq', 'Multiple choice (one answer)'],
  ['mcq_multi', 'Multiple choice (choose TWO/THREE)'], ['tfng', 'True / False / Not Given'], ['ynng', 'Yes / No / Not Given'],
  ['matching', 'Matching (headings, information, features, endings, map/plan)'],
]

const optsToText = (o?: Option[]) => (o ?? []).map(x => `${x.key}: ${x.text}`).join('\n')
const textToOpts = (t: string): Option[] => t.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
  const m = l.match(/^([^:]+):\s*(.*)$/)
  return m ? { key: m[1].trim(), text: m[2] } : { key: l, text: '' }
})
const lines = (t: string) => t.split('\n').map(x => x.trim()).filter(Boolean)

export default function TestEditor() {
  const { testId } = useParams()
  const stored = useDB(d => d.tests.find(t => t.id === testId))
  const [test, setTest] = useState<Test | undefined>(stored && structuredClone(stored))
  const [tab, setTab] = useState<Tab>('details')
  const [dirty, setDirty] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => dirty && e.preventDefault()
    // In-app links (sidebar, "← Admin") don't fire beforeunload — ask before they discard edits.
    const ask = () => confirm('You have unsaved changes to this test. Leave without saving?')
    const leave = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#/"]')
      if (!dirty || !link || link.getAttribute('href') === location.hash) return
      // New-tab opens (modifier/middle click, target=_blank) don't leave this page.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.getAttribute('target') === '_blank') return
      if (!ask()) { e.preventDefault(); e.stopPropagation() }
    }
    // Browser Back/Forward: the router has already moved, so on cancel navigate straight back
    // in the same tick — React batches both updates and the editor never unmounts.
    const here = location.hash.slice(1)
    const back = () => { if (dirty && location.hash.slice(1) !== here && !ask()) navigate(here) }
    window.addEventListener('beforeunload', warn)
    window.addEventListener('popstate', back)
    document.addEventListener('click', leave, true)
    return () => {
      window.removeEventListener('beforeunload', warn)
      window.removeEventListener('popstate', back)
      document.removeEventListener('click', leave, true)
    }
  }, [dirty, navigate])

  const { blocking, warnings } = useMemo(() => (test ? testIssues(test) : { blocking: [], warnings: [] }), [test])
  const issues = [...blocking, ...warnings]
  if (!stored || !test) return <Navigate to="/admin" replace />

  const set = (fn: (t: Test) => Test) => { setTest(t => fn(t!)); setDirty(true) }
  const save = (status?: Test['status']) => {
    const next = { ...test, ...(status ? { status } : {}) }
    const saved = saveTest(next)
    setTest({ ...next, status: saved })
    setDirty(false)
    if (next.status === 'published' && saved !== 'published') toast(`Saved as a draft — fix ${blocking.length} problem${blocking.length > 1 ? 's' : ''} before publishing`, 'error')
    else toast(status === 'published' ? 'Saved and published' : 'Saved', 'success')
  }

  return (
    <div>
      <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft size={16} /> Admin</Link>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input className="min-w-64 flex-1 rounded-xl border-0 bg-transparent font-display text-3xl font-extrabold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-brand-100" value={test.title} onChange={e => set(t => ({ ...t, title: e.target.value }))} aria-label="Test title" />
        <Badge tone={test.status === 'published' ? 'green' : 'amber'}>{test.status}</Badge>
        {dirty && <Badge tone="rose">Unsaved changes</Badge>}
        <Button variant="secondary" onClick={() => save()}><Save size={16} /> Save</Button>
        {test.status === 'draft' ? <Button onClick={() => save('published')} disabled={blocking.length > 0} title={blocking.length ? 'Fix the problems listed below first' : undefined}>Publish</Button> : <Button variant="ghost" onClick={() => save('draft')}>Unpublish</Button>}
      </div>

      {issues.length > 0 && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="mb-1 flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> Check before publishing</div>
          <ul className="list-disc pl-5">{issues.map(i => <li key={i}>{i}</li>)}</ul>
        </div>
      )}

      <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm">
        {(['details', 'listening', 'reading', 'writing', 'speaking', 'json'] as Tab[]).map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx('relative whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold capitalize transition', tab === t ? 'text-white' : 'text-slate-500 hover:text-slate-800')}>
            {tab === t && <motion.span layoutId="editor-tab" className="absolute inset-0 rounded-xl bg-slate-900" />}
            <span className="relative">{t === 'json' ? 'JSON' : t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {tab === 'details' && (
            <Card className="grid max-w-2xl gap-4 p-6">
              <label><span className="label">Variant</span>
                <select className="input" value={test.variant} onChange={e => set(t => ({ ...t, variant: e.target.value as Test['variant'] }))}>
                  <option value="academic">Academic</option><option value="general">General Training</option>
                </select>
              </label>
              <label><span className="label">Description</span><textarea className="input h-24" value={test.description ?? ''} onChange={e => set(t => ({ ...t, description: e.target.value }))} /></label>
              <p className="text-sm text-slate-500">Reading band conversion follows the variant. Listening and Speaking are the same for both variants.</p>
              <Button variant="danger" className="w-fit" onClick={() => { if (confirm('Discard unsaved changes?')) navigate('/admin') }}>Discard changes</Button>
            </Card>
          )}
          {tab === 'listening' && (
            <SectionList<ListeningSection>
              items={test.listening?.sections ?? []}
              onChange={s => set(t => ({ ...t, listening: { sections: s } }))}
              make={i => ({ id: uid('ls-'), title: `Part ${i + 1}`, context: '', transcript: 'NARRATOR: ', groups: [] })}
              label={s => s.title}
              render={(s, upd) => (
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Text label="Part title" value={s.title} onChange={v => upd({ ...s, title: v })} />
                    <Text label="Context (announced before the part)" value={s.context} onChange={v => upd({ ...s, context: v })} />
                  </div>
                  <Area label="Transcript — one line per utterance, “SPEAKER: text” (spoken by text-to-speech when no audio is uploaded)" value={s.transcript} onChange={v => upd({ ...s, transcript: v })} rows={10} />
                  <MediaField kind="audio" value={s.audio} onChange={v => upd({ ...s, audio: v })} />
                  <GroupsEditor groups={s.groups} onChange={g => upd({ ...s, groups: g })} />
                </div>
              )}
            />
          )}
          {tab === 'reading' && (
            <SectionList<ReadingSection>
              items={test.reading?.sections ?? []}
              onChange={s => set(t => ({ ...t, reading: { sections: s } }))}
              make={i => ({ id: uid('rs-'), title: `${test.variant === 'academic' ? 'Passage' : 'Section'} ${i + 1}`, passageTitle: '', passage: '', groups: [] })}
              label={s => `${s.title}${s.passageTitle ? ` — ${s.passageTitle}` : ''}`}
              render={(s, upd) => <ReadingSectionEditor s={s} upd={upd} />}
            />
          )}
          {tab === 'writing' && (
            <SectionList<WritingTask>
              items={test.writing?.tasks ?? []}
              onChange={s => set(t => ({ ...t, writing: { tasks: s } }))}
              make={i => ({ id: uid('wt-'), number: i === 0 ? 1 : 2, kind: i === 0 ? (test.variant === 'academic' ? 'chart' : 'letter') : 'essay', prompt: '', minWords: i === 0 ? 150 : 250, minutes: i === 0 ? 20 : 40 })}
              max={2}
              label={w => `Task ${w.number} · ${w.kind}`}
              render={(w, upd) => <WritingTaskEditor w={w} upd={upd} />}
            />
          )}
          {tab === 'speaking' && <SpeakingEditor test={test} set={set} />}
          {tab === 'json' && <JsonEditor test={test} onApply={t => { set(() => ({ ...t, id: test.id })); toast('JSON applied — remember to save', 'success') }} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ---------- building blocks ----------
function Text({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return <label className="block"><span className="label">{label}</span><input type={type} className="input" value={value} onChange={e => onChange(e.target.value)} /></label>
}
function Area({ label, value, onChange, rows = 4, mono }: { label: string; value: string; onChange: (v: string) => void; rows?: number; mono?: boolean }) {
  return <label className="block"><span className="label">{label}</span><textarea className={cx('input', mono && 'font-mono text-xs')} rows={rows} value={value} onChange={e => onChange(e.target.value)} /></label>
}

function Collapsible({ title, children, actions, defaultOpen }: { title: ReactNode; children: ReactNode; actions?: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4">
        <button onClick={() => setOpen(o => !o)} className="flex flex-1 items-center gap-2 text-left font-semibold text-slate-800">
          <motion.span animate={{ rotate: open ? 0 : -90 }}><ChevronDown size={18} /></motion.span>{title}
        </button>
        {actions}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="border-t border-slate-100 p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function SectionList<T extends { id: string }>({ items, onChange, make, label, render, max = 4 }: {
  items: T[]; onChange: (v: T[]) => void; make: (i: number) => T; label: (t: T) => string; render: (t: T, upd: (t: T) => void) => ReactNode; max?: number
}) {
  return (
    <div className="space-y-4">
      {items.map(s => (
        <Collapsible key={s.id} title={label(s)} defaultOpen={items.length === 1}
          actions={<button aria-label="Remove" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" onClick={() => confirm('Remove this part and its questions?') && onChange(items.filter(x => x.id !== s.id))}><Trash2 size={15} /></button>}>
          {render(s, next => onChange(items.map(x => (x.id === s.id ? next : x))))}
        </Collapsible>
      ))}
      {items.length < max && <Button variant="secondary" onClick={() => onChange([...items, make(items.length)])}><Plus size={16} /> Add {items.length ? 'another' : 'first'} part</Button>}
    </div>
  )
}

function MediaField({ kind, value, onChange }: { kind: 'audio' | 'image'; value?: string; onChange: (v?: string) => void }) {
  const [url, setUrl] = useState<string>()
  useEffect(() => { void resolveMediaUrl(value).then(setUrl) }, [value])
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-200 p-3">
      <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-sm font-semibold text-brand-600">
        {kind === 'audio' ? <Music size={16} /> : <ImagePlus size={16} />} {value ? 'Replace' : 'Upload'} {kind}
      </button>
      <input ref={fileRef} type="file" hidden accept={kind === 'audio' ? 'audio/*' : 'image/*'} onChange={async e => { const f = e.target.files?.[0]; if (f) onChange(await putMedia(f)) }} />
      {url && (kind === 'audio' ? <audio src={url} controls className="h-9" /> : <img src={url} alt="" className="h-16 rounded" />)}
      {value && <button className="text-xs text-rose-500 hover:underline" onClick={() => onChange(undefined)}>Remove</button>}
      <span className="text-xs text-slate-400">Stored in this browser. Or paste a URL:</span>
      <input className="input w-56 py-1.5" placeholder="https://…" value={value?.startsWith('media:') ? '' : value ?? ''} onChange={e => onChange(e.target.value || undefined)} />
    </div>
  )
}

function ReadingSectionEditor({ s, upd }: { s: ReadingSection; upd: (s: ReadingSection) => void }) {
  const [preview, setPreview] = useState(false)
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Text label="Section title" value={s.title} onChange={v => upd({ ...s, title: v })} />
        <Text label="Passage headline" value={s.passageTitle} onChange={v => upd({ ...s, passageTitle: v })} />
      </div>
      <div className="flex items-center justify-between">
        <span className="label mb-0">Passage — blank line between paragraphs · “A| ” labels a paragraph · “## ” sub-heading · **bold**</span>
        <Button size="sm" variant="ghost" onClick={() => setPreview(p => !p)}><Eye size={14} /> {preview ? 'Edit' : 'Preview'}</Button>
      </div>
      {preview
        ? <div className="exam max-h-[500px] overflow-y-auto rounded-xl border p-5"><Passage title={s.passageTitle} text={s.passage} highlights={[]} onChange={() => {}} /></div>
        : <textarea className="input font-serif text-[15px] leading-7" rows={16} value={s.passage} onChange={e => upd({ ...s, passage: e.target.value })} />}
      <GroupsEditor groups={s.groups} onChange={g => upd({ ...s, groups: g })} />
    </div>
  )
}

function GroupsEditor({ groups, onChange }: { groups: QuestionGroup[]; onChange: (g: QuestionGroup[]) => void }) {
  const next = Math.max(0, ...groups.flatMap(g => g.questions.map(q => q.number))) + 1
  return (
    <div className="space-y-3">
      <div className="label">Question groups</div>
      {groups.map(g => (
        <GroupEditor key={g.id} g={g} upd={n => onChange(groups.map(x => (x.id === g.id ? n : x)))} remove={() => onChange(groups.filter(x => x.id !== g.id))} />
      ))}
      <Button size="sm" variant="secondary" onClick={() => onChange([...groups, { id: uid('g-'), type: 'completion', instructions: 'Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.', maxWords: 2, questions: [{ id: uid('q-'), number: next, prompt: '', answer: [] }] }])}>
        <Plus size={15} /> Add question group
      </Button>
    </div>
  )
}

function GroupEditor({ g, upd, remove }: { g: QuestionGroup; upd: (g: QuestionGroup) => void; remove: () => void }) {
  const [csvOpen, setCsvOpen] = useState(false)
  const [csv, setCsv] = useState('')
  const csvFileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(false)
  const toast = useToast()
  const range = g.questions.length ? `Q${Math.min(...g.questions.map(q => q.number))}–${Math.max(...g.questions.map(q => q.number))}` : 'no questions'
  const nextNum = Math.max(0, ...g.questions.map(q => q.number)) + 1

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="brand">{range}</Badge>
        <select className="input w-auto flex-1 py-1.5" value={g.type} onChange={e => upd({ ...g, type: e.target.value as QuestionType })}>
          {TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <Button size="sm" variant="ghost" onClick={() => setPreview(p => !p)}><Eye size={14} /> {preview ? 'Edit' : 'Preview'}</Button>
        <Button size="sm" variant="ghost" onClick={() => setCsvOpen(true)}><FileUp size={14} /> CSV</Button>
        <button aria-label="Remove group" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" onClick={() => confirm('Remove this question group?') && remove()}><Trash2 size={15} /></button>
      </div>
      {preview ? (
        <div className="exam rounded-xl border p-5">
          <QuestionGroupView group={g} answers={{}} setAnswer={() => {}} flags={[]} toggleFlag={() => {}} readOnly />
        </div>
      ) : (
        <div className="grid gap-3">
          <Area label="Instructions" value={g.instructions} onChange={v => upd({ ...g, instructions: v })} rows={2} />
          {g.type === 'completion' && (
            <div className="flex flex-wrap items-end gap-4">
              <Text label="Max words" type="number" value={g.maxWords ?? ''} onChange={v => upd({ ...g, maxWords: v ? Number(v) : undefined })} />
              <label className="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" checked={Boolean(g.allowNumber)} onChange={e => upd({ ...g, allowNumber: e.target.checked })} /> AND/OR A NUMBER</label>
            </div>
          )}
          {(g.type === 'matching' || g.type === 'mcq_multi') && <Area label="Options — one per line, “A: text” (headings: “i: heading”)" value={optsToText(g.options)} onChange={v => upd({ ...g, options: textToOpts(v) })} rows={5} />}
          <Area label={g.type === 'mcq_multi' ? 'Question text' : 'Content (optional) — form/notes/table/summary with {{n}} answer boxes; “| a | b |” for table rows'} value={g.content ?? ''} onChange={v => upd({ ...g, content: v || undefined })} rows={5} mono />
          <details className="text-sm"><summary className="cursor-pointer font-semibold text-slate-600">Map / diagram (SVG or image)</summary>
            <div className="mt-2 grid gap-2">
              <Area label="Inline SVG" value={g.svg ?? ''} onChange={v => upd({ ...g, svg: v || undefined })} rows={4} mono />
              <MediaField kind="image" value={g.image} onChange={v => upd({ ...g, image: v })} />
            </div>
          </details>
          <div className="space-y-2">
            {g.questions.map(q => (
              <div key={q.id} className="grid gap-2 rounded-xl bg-white p-3 shadow-sm md:grid-cols-[70px_1fr_1fr_auto]">
                <input type="number" className="input py-1.5" value={q.number} aria-label="Number" onChange={e => upd({ ...g, questions: g.questions.map(x => (x.id === q.id ? { ...x, number: Number(e.target.value) } : x)) })} />
                <input className="input py-1.5" placeholder={g.content ? 'Prompt (optional — lives in content)' : 'Question / statement'} value={q.prompt} onChange={e => upd({ ...g, questions: g.questions.map(x => (x.id === q.id ? { ...x, prompt: e.target.value } : x)) })} />
                <input className="input py-1.5" placeholder={g.type === 'tfng' ? 'TRUE | FALSE | NOT GIVEN' : 'Answer(s) — separate with |'} value={q.answer.join(' | ')}
                  onChange={e => upd({ ...g, questions: g.questions.map(x => (x.id === q.id ? { ...x, answer: e.target.value.split('|').map(a => a.trim()).filter(Boolean) } : x)) })} />
                <button aria-label="Remove question" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" onClick={() => upd({ ...g, questions: g.questions.filter(x => x.id !== q.id) })}><Trash2 size={14} /></button>
                {g.type === 'mcq' && <textarea className="input text-xs md:col-span-4" rows={3} placeholder="Options — A: text (one per line)" value={optsToText(q.options)} onChange={e => upd({ ...g, questions: g.questions.map(x => (x.id === q.id ? { ...x, options: textToOpts(e.target.value) } : x)) })} />}
                <input className="input py-1.5 text-xs md:col-span-4" placeholder="Explanation (shown in practice review and results)" value={q.explanation ?? ''} onChange={e => upd({ ...g, questions: g.questions.map(x => (x.id === q.id ? { ...x, explanation: e.target.value || undefined } : x)) })} />
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => upd({ ...g, questions: [...g.questions, { id: uid('q-'), number: nextNum, prompt: '', answer: [] }] })}><Plus size={14} /> Add question</Button>
          </div>
        </div>
      )}
      <Modal open={csvOpen} onClose={() => setCsvOpen(false)} title="Import questions from CSV" wide>
        <p className="mb-2 text-sm text-slate-500">Columns: <code className="rounded bg-slate-100 px-1">{CSV_HEADER}</code>. Separate accepted answers or MCQ options with “|”, options as “A=text”. Rows are appended to this group.</p>
        <textarea className="input h-56 font-mono text-xs" value={csv} onChange={e => setCsv(e.target.value)} placeholder={`${CSV_HEADER}\n1,The museum opens at,10 am|10:00 am,,Speaker 2 corrects the time`} />
        <div className="mt-3 flex items-center justify-between">
          <button type="button" onClick={() => csvFileRef.current?.click()} className="text-sm font-semibold text-brand-600">Load .csv file</button>
          <input ref={csvFileRef} type="file" hidden accept=".csv,text/csv" onChange={async e => { const f = e.target.files?.[0]; if (f) setCsv(await f.text()) }} />
          <Button onClick={() => {
            try {
              const qs = questionsFromCsv(csv, `${g.id}-q`)
              upd({ ...g, questions: [...g.questions, ...qs].sort((a, b) => a.number - b.number) })
              toast(`Imported ${qs.length} questions`, 'success')
              setCsvOpen(false)
              setCsv('')
            } catch (e) {
              toast((e as Error).message, 'error')
            }
          }}>Import</Button>
        </div>
      </Modal>
    </div>
  )
}

function WritingTaskEditor({ w, upd }: { w: WritingTask; upd: (w: WritingTask) => void }) {
  const [chartText, setChartText] = useState(w.chart ? JSON.stringify(w.chart, null, 2) : '')
  const [chartErr, setChartErr] = useState('')
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <label><span className="label">Task</span><select className="input" value={w.number} onChange={e => upd({ ...w, number: Number(e.target.value) as 1 | 2 })}><option value={1}>Task 1</option><option value={2}>Task 2</option></select></label>
        <label><span className="label">Kind</span><select className="input" value={w.kind} onChange={e => upd({ ...w, kind: e.target.value as WritingTask['kind'] })}>
          {['chart', 'process', 'map', 'letter', 'essay'].map(k => <option key={k}>{k}</option>)}
        </select></label>
        <Text label="Min words" type="number" value={w.minWords} onChange={v => upd({ ...w, minWords: Number(v) })} />
        <Text label="Minutes" type="number" value={w.minutes} onChange={v => upd({ ...w, minutes: Number(v) })} />
      </div>
      <Area label="Prompt" value={w.prompt} onChange={v => upd({ ...w, prompt: v })} rows={6} />
      {w.number === 1 && w.kind !== 'letter' && (
        <>
          <Area label="Visual description for the AI marker (every figure, in words)" value={w.visualDescription ?? ''} onChange={v => upd({ ...w, visualDescription: v })} rows={4} />
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Area mono rows={12} label='Chart data (JSON) — {"kind":"bar|line|pie|table","title","categories":[],"series":[{"name","values":[]}],"unit"}' value={chartText} onChange={v => {
                setChartText(v)
                if (!v.trim()) { setChartErr(''); upd({ ...w, chart: undefined }); return }
                try { const c = JSON.parse(v) as ChartData; if (!c.categories || !c.series) throw new Error('needs categories and series'); setChartErr(''); upd({ ...w, chart: c }) } catch (e) { setChartErr((e as Error).message) }
              }} />
              {chartErr && <p className="mt-1 text-xs text-rose-500">{chartErr}</p>}
            </div>
            <div className="exam rounded-xl border p-4">{w.chart ? <TaskChart chart={w.chart} /> : <p className="text-sm opacity-50">Chart preview</p>}</div>
          </div>
          <Area label="Or an inline SVG (process diagram / map)" value={w.svg ?? ''} onChange={v => upd({ ...w, svg: v || undefined })} rows={4} mono />
          <MediaField kind="image" value={w.image} onChange={v => upd({ ...w, image: v })} />
        </>
      )}
    </div>
  )
}

function SpeakingEditor({ test, set }: { test: Test; set: (fn: (t: Test) => Test) => void }) {
  const sp = test.speaking ?? { part1: { topics: [] }, part2: { topic: '', bullets: [], closing: '', roundOff: [] }, part3: { theme: '', questions: [] } }
  const put = (next: typeof sp) => set(t => ({ ...t, speaking: next }))
  return (
    <div className="space-y-4">
      <Collapsible title="Part 1 — Interview" defaultOpen>
        <div className="space-y-3">
          {sp.part1.topics.map((t, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-slate-50 p-3 md:grid-cols-[220px_1fr_auto]">
              <input className="input" value={t.topic} placeholder="Topic" onChange={e => put({ ...sp, part1: { topics: sp.part1.topics.map((x, j) => (j === i ? { ...x, topic: e.target.value } : x)) } })} />
              <textarea className="input" rows={4} value={t.questions.join('\n')} placeholder="One question per line" onChange={e => put({ ...sp, part1: { topics: sp.part1.topics.map((x, j) => (j === i ? { ...x, questions: lines(e.target.value) } : x)) } })} />
              <button className="h-fit rounded-lg p-2 text-rose-500 hover:bg-rose-50" aria-label="Remove topic" onClick={() => put({ ...sp, part1: { topics: sp.part1.topics.filter((_, j) => j !== i) } })}><Trash2 size={15} /></button>
            </div>
          ))}
          <Button size="sm" variant="secondary" onClick={() => put({ ...sp, part1: { topics: [...sp.part1.topics, { topic: '', questions: [] }] } })}><Plus size={14} /> Add topic</Button>
        </div>
      </Collapsible>
      <Collapsible title="Part 2 — Cue card">
        <div className="grid gap-3">
          <Text label="Topic (Describe …)" value={sp.part2.topic} onChange={v => put({ ...sp, part2: { ...sp.part2, topic: v } })} />
          <Area label="You should say — one bullet per line" value={sp.part2.bullets.join('\n')} onChange={v => put({ ...sp, part2: { ...sp.part2, bullets: lines(v) } })} />
          <Text label="Closing line (and explain …)" value={sp.part2.closing} onChange={v => put({ ...sp, part2: { ...sp.part2, closing: v } })} />
          <Area label="Round-off questions — one per line" value={sp.part2.roundOff.join('\n')} onChange={v => put({ ...sp, part2: { ...sp.part2, roundOff: lines(v) } })} rows={2} />
        </div>
      </Collapsible>
      <Collapsible title="Part 3 — Discussion">
        <div className="grid gap-3">
          <Text label="Theme" value={sp.part3.theme} onChange={v => put({ ...sp, part3: { ...sp.part3, theme: v } })} />
          <Area label="Questions — one per line" value={sp.part3.questions.join('\n')} onChange={v => put({ ...sp, part3: { ...sp.part3, questions: lines(v) } })} rows={6} />
        </div>
      </Collapsible>
      {test.speaking && <Button variant="ghost" className="text-rose-600" onClick={() => confirm('Remove the speaking module from this test?') && set(t => ({ ...t, speaking: undefined }))}><Trash2 size={15} /> Remove speaking module</Button>}
    </div>
  )
}

function JsonEditor({ test, onApply }: { test: Test; onApply: (t: Test) => void }) {
  const [text, setText] = useState(() => JSON.stringify(test, null, 2))
  const [err, setErr] = useState('')
  return (
    <Card className="p-6">
      <p className="mb-3 text-sm text-slate-500">Full control over the test document (schema in <code>src/lib/types.ts</code>). Useful for bulk edits or pasting a test generated elsewhere.</p>
      <textarea className="input h-[60vh] font-mono text-xs leading-relaxed" value={text} onChange={e => setText(e.target.value)} spellCheck={false} />
      {err && <p className="mt-2 text-sm text-rose-500">{err}</p>}
      <div className="mt-3 flex gap-2">
        <Button onClick={() => {
          try {
            const t = JSON.parse(text) as Test
            if (typeof t.title !== 'string' || !['academic', 'general'].includes(t.variant)) throw new Error('title and variant ("academic" | "general") are required')
            // Same structure check as imports: a broken question or chart would crash the editor or the exam.
            if (!isTestShape({ ...t, id: test.id })) throw new Error('Some questions, sections or chart data are malformed (every question needs an id, a number and an answer list; charts need one number per category)')
            setErr('')
            onApply(t)
          } catch (e) { setErr((e as Error).message) }
        }}>Apply JSON</Button>
        <Button variant="ghost" onClick={() => setText(JSON.stringify(test, null, 2))}>Reset</Button>
      </div>
    </Card>
  )
}
