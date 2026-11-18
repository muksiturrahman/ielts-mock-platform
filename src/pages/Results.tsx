import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, ArrowLeft, CheckCircle2, Download, KeyRound, Loader2, Play, RefreshCw, Sparkles, XCircle } from 'lucide-react'
import { Fragment, useEffect, useId, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ExamReview } from '../components/ExamReview'
import { questionText, locateQuestion } from '../lib/review'
import { Badge, BandRing, Button, Card, bandColor, cx, fmtBand, fmtDate } from '../components/ui'
import { countWords } from '../lib/scoring'
import { attemptOverall, markSpeaking, markWriting, MODULE_LABEL, moduleBands, writingTaskBand, writingTasksTaken } from '../lib/attempts'
import { resolveMediaUrl } from '../lib/media'
import { useDB } from '../lib/store'
import type { Annotation, Attempt, ModuleKey, ObjectiveResult, Test, TranscriptNote, WritingTaskEval } from '../lib/types'
import { MODULE_ICON } from './Tests'
import { TestReportForm } from './TestReportForm'

type Tab = 'overview' | ModuleKey | 'report'

export default function Results() {
  const { attemptId } = useParams()
  const attempt = useDB(d => d.attempts.find(a => a.id === attemptId))
  const test = useDB(d => d.tests.find(t => t.id === attempt?.testId))
  // ?tab=reading&q=12 opens the full review at question 12 (links from the Mistakes page).
  const [params] = useSearchParams()
  const [tab, setTab] = useState<Tab>((params.get('tab') as Tab) || 'overview')
  const focus = Number(params.get('q')) || undefined
  if (!attempt) return <Navigate to="/history" replace />

  const bands = moduleBands(attempt)
  const overall = attemptOverall(attempt)
  const tabs: Tab[] = ['overview', ...attempt.modules.filter(m => attempt.results[m]), ...(attempt.mode === 'full' ? ['report' as const] : [])]

  return (
    <div>
      <Link to="/history" className="no-print mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft size={16} /> My results</Link>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="no-print card mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center gap-6 bg-gradient-to-r from-slate-900 to-brand-600 p-6 text-white">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge tone="violet">{attempt.variant === 'academic' ? 'Academic' : 'General Training'}</Badge>
              <Badge tone="slate">{attempt.mode === 'full' ? 'Full mock' : 'Practice'}</Badge>
              {attempt.review && <Badge tone="green">Examiner reviewed</Badge>}
              {attempt.tabSwitches > 0 && <Badge tone="amber">Left window {attempt.tabSwitches}×</Badge>}
            </div>
            <h1 className="mt-2 font-display text-3xl font-extrabold">{attempt.testTitle}</h1>
            <p className="text-white/70">{fmtDate(attempt.startedAt)} {attempt.status === 'in_progress' && '· in progress'}</p>
          </div>
          {attempt.mode === 'full' && (
            <div className="rounded-3xl bg-white p-3"><BandRing band={overall} size={130} label="Overall band" /></div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
          {attempt.modules.map((m, i) => {
            const Icon = MODULE_ICON[m]
            const status = m === 'writing' ? attempt.results.writing?.status : m === 'speaking' ? attempt.results.speaking?.status : attempt.results[m] ? 'done' : undefined
            return (
              <motion.button key={m} aria-pressed={tab === m} onClick={() => setTab(m)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 text-left transition hover:border-brand-200 hover:bg-brand-50/40">
                <BandRing band={bands[m]} size={64} stroke={6} />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800"><Icon size={14} />{MODULE_LABEL[m]}</div>
                  <StatusLine status={status} />
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.section>

      <div role="tablist" className="no-print mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm">
        {tabs.map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx('relative whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold capitalize transition', tab === t ? 'text-white' : 'text-slate-500 hover:text-slate-800')}>
            {tab === t && <motion.span layoutId="result-tab" className="absolute inset-0 rounded-xl bg-slate-900" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span className="relative">{t === 'report' ? 'Score report' : t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          {tab === 'overview' && <Overview attempt={attempt} bands={bands} onOpen={setTab} />}
          {(tab === 'listening' || tab === 'reading') && attempt.results[tab] && <ObjectiveView result={attempt.results[tab]!} test={test} module={tab} attempt={attempt} focus={focus} />}
          {tab === 'writing' && <WritingView attempt={attempt} test={test} />}
          {tab === 'speaking' && <SpeakingView attempt={attempt} />}
          {tab === 'report' && <TestReportForm attempt={attempt} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function StatusLine({ status }: { status?: string }) {
  if (status === 'marking') return <span className="flex items-center gap-1 text-xs text-brand-600"><Loader2 size={12} className="animate-spin" /> AI marking…</span>
  if (status === 'pending') return <span className="text-xs text-slate-400">Awaiting marking</span>
  if (status === 'error') return <span className="text-xs text-rose-500">Marking failed</span>
  if (status === 'done') return <span className="text-xs text-emerald-600">Marked</span>
  return <span className="text-xs text-slate-400">Not taken</span>
}

function Overview({ attempt, bands, onOpen }: { attempt: Attempt; bands: Partial<Record<ModuleKey, number>>; onOpen: (t: Tab) => void }) {
  const w = attempt.results.writing
  const s = attempt.results.speaking
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {attempt.modules.map((m, i) => (
        <Card key={m} delay={i * 0.05} className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-lg font-bold">{MODULE_LABEL[m]}</span>
            <span className="font-display text-2xl font-extrabold" style={{ color: bandColor(bands[m]) }}>{fmtBand(bands[m])}</span>
          </div>
          {(m === 'listening' || m === 'reading') && attempt.results[m] && (
            <>
              <p className="mb-3 text-sm text-slate-500">{attempt.results[m]!.raw} / {attempt.results[m]!.total} correct</p>
              <TypeBars result={attempt.results[m]!} />
            </>
          )}
          {m === 'writing' && (
            <div className="space-y-3">
              {w?.status !== 'done' && <MarkingState status={w?.status} error={w?.error} retry={() => markWriting(attempt.id)}>{null}</MarkingState>}
              <CriteriaList items={writingTasksTaken(attempt).flatMap(n => {
                const b = writingTaskBand(n === 1 ? w?.task1 : w?.task2, attempt.review?.writing?.[n === 1 ? 'task1' : 'task2'])
                return b === undefined ? [] : [[`Task ${n}`, b] as const]
              })} />
            </div>
          )}
          {m === 'speaking' && (
            <div className="space-y-3">
              {s?.status !== 'done' && <MarkingState status={s?.status} error={s?.error} retry={() => markSpeaking(attempt.id)}>{null}</MarkingState>}
              <CriteriaList items={SPEAKING_CRITERIA.flatMap(([k, label]) => {
                const b = attempt.review?.speaking?.[k] ?? s?.criteria?.[k].band
                return b === undefined ? [] : [[label, b] as const]
              })} />
            </div>
          )}
          <button onClick={() => onOpen(m)} className="mt-4 text-sm font-semibold text-brand-600 hover:underline">See detailed feedback →</button>
        </Card>
      ))}
      {attempt.review?.feedback && (
        <Card className="p-6 lg:col-span-2">
          <div className="mb-2 font-display text-lg font-bold">Examiner comments · {attempt.review.examiner}</div>
          <p className="whitespace-pre-line text-slate-600">{attempt.review.feedback}</p>
        </Card>
      )}
    </div>
  )
}

function MarkingState({ status, error, retry, children }: { status?: string; error?: string; retry: () => void; children: ReactNode }) {
  const hasKey = useDB(d => Boolean(d.settings.keys[d.settings.provider]?.trim()))
  if (status === 'marking') return <div className="space-y-2"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-4 w-1/2" /><p className="flex items-center gap-1.5 text-sm text-brand-600"><Sparkles size={14} /> The AI examiner is marking against the band descriptors…</p></div>
  if (status === 'error' || status === 'pending') {
    return (
      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        <div className="flex items-start gap-2"><AlertCircle size={16} className="mt-0.5 shrink-0" />{status === 'error' ? error : 'Not marked yet.'}</div>
        <div className="mt-3 flex gap-2">
          {!hasKey && <Link to="/settings"><Button size="sm" variant="secondary"><KeyRound size={14} /> Add API key</Button></Link>}
          <Button size="sm" onClick={retry}><RefreshCw size={14} /> {status === 'error' ? 'Retry marking' : 'Mark now'}</Button>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

const SPEAKING_CRITERIA = [['fluency', 'Fluency & Coherence'], ['lexical', 'Lexical Resource'], ['grammar', 'Grammatical Range & Accuracy'], ['pronunciation', 'Pronunciation']] as const

function CriteriaList({ items }: { items: readonly (readonly [string, number])[] }) {
  if (!items.length) return null
  return (
    <div className="space-y-2.5">
      {items.map(([k, v], i) => (
        <div key={k}>
          <div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">{k}</span><b>{fmtBand(v)}</b></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div className="h-full rounded-full" style={{ background: bandColor(v) }} initial={{ width: 0 }} animate={{ width: `${(v / 9) * 100}%` }} transition={{ duration: 0.9, delay: i * 0.08 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function TypeBars({ result }: { result: ObjectiveResult }) {
  return (
    <div className="space-y-2">
      {Object.entries(result.byType).map(([k, v], i) => {
        const pct = v.correct / v.total
        return (
          <div key={k}>
            <div className="mb-1 flex justify-between text-xs"><span className="text-slate-600">{k}</span><span className="font-semibold">{v.correct}/{v.total}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div className={cx('h-full rounded-full', pct >= 0.75 ? 'bg-emerald-500' : pct >= 0.5 ? 'bg-amber-500' : 'bg-rose-500')} initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.8, delay: i * 0.06 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ObjectiveView({ result, test, module, attempt, focus }: { result: ObjectiveResult; test?: Test; module: 'listening' | 'reading'; attempt: Attempt; focus?: number }) {
  const [open, setOpen] = useState<string>()
  const [view, setView] = useState<'review' | 'sheet'>(test ? 'review' : 'sheet')
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit p-6">
          <div className="flex flex-col items-center">
            <BandRing band={result.band} size={140} label={MODULE_LABEL[module]} />
            <p className="mt-3 font-semibold text-slate-700">{result.raw} / {result.total} correct</p>
          </div>
          <div className="mt-6"><TypeBars result={result} /></div>
        </Card>
        <div className="min-w-0 space-y-4">{/* grid items default to min-width:auto — without this the wide table stretches the page on phones */}
          <div className="flex w-fit gap-1 rounded-2xl bg-white p-1 shadow-sm">
            {([['review', 'Full review'], ['sheet', 'Answer sheet']] as const).map(([k, l]) => (
              <button key={k} aria-pressed={view === k} disabled={k === 'review' && !test} onClick={() => setView(k)}
                className={cx('relative rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-40', view === k ? 'text-white' : 'text-slate-500 hover:text-slate-800')}>
                {view === k && <motion.span layoutId={`view-${module}`} className="absolute inset-0 rounded-xl bg-slate-900" />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
          {view === 'review' && test ? (
            <ExamReview attempt={attempt} test={test} module={module} result={result} focus={focus} />
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Question</th><th className="px-4 py-3">Your answer</th><th className="px-4 py-3">Correct answer</th><th className="px-4 py-3" /></tr>
                </thead>
                <tbody>
                  {result.items.map(it => {
                    const loc = locateQuestion(test, module, it.questionId)
                    return (
                      <Fragment key={it.questionId}>
                        <tr onClick={() => setOpen(o => (o === it.questionId ? undefined : it.questionId))} className={cx('cursor-pointer border-t border-slate-100 transition hover:bg-slate-50', open === it.questionId && 'bg-slate-50', !it.isCorrect && 'bg-rose-50/40')}>
                          <td className="px-4 py-2.5 font-semibold">{it.number}</td>
                          <td className="px-4 py-2.5 text-slate-600" title={questionText(loc)}><div className="line-clamp-2 max-w-xs">{questionText(loc) || '—'}</div></td>
                          <td className={cx('px-4 py-2.5', !it.given && 'italic text-slate-400', !it.isCorrect && it.given && 'text-rose-600 line-through decoration-rose-300')}>{it.given || 'No answer'}</td>
                          <td className="px-4 py-2.5 font-medium text-emerald-700">{(it.accepted ?? loc?.question.answer)?.join(' / ') ?? it.correct}</td>
                          <td className="px-4 py-2.5">
                            {/* the row toggles by mouse; this button makes the explanation reachable by keyboard */}
                            <button type="button" aria-expanded={open === it.questionId} aria-label={`Question ${it.number}: ${it.isCorrect ? 'correct' : 'wrong'}${loc?.question.explanation ? ' — show explanation' : ''}`}
                              onClick={e => { e.stopPropagation(); setOpen(o => (o === it.questionId ? undefined : it.questionId)) }} className="rounded">
                              {it.isCorrect ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-rose-500" />}
                            </button>
                          </td>
                        </tr>
                        {open === it.questionId && loc?.question.explanation && (
                          <tr><td colSpan={5} className="bg-brand-50/50 px-4 py-3 text-slate-600">{loc.question.explanation}</td></tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

/** Highlights each annotation's quote inside the candidate's text. */
function Annotated({ text, notes }: { text: string; notes: { quote: string; label: string; detail: string; tone: string }[] }) {
  const uid = useId()
  const lower = text.toLowerCase()
  const spans: { s: number; e: number; n: (typeof notes)[number] }[] = []
  for (const n of notes) {
    const q = n.quote.trim().toLowerCase()
    if (!q) continue
    const s = lower.indexOf(q)
    if (s >= 0 && !spans.some(x => s < x.e && s + q.length > x.s)) spans.push({ s, e: s + q.length, n })
  }
  spans.sort((a, b) => a.s - b.s)
  const out: ReactNode[] = []
  let pos = 0
  spans.forEach((sp, i) => {
    out.push(text.slice(pos, sp.s))
    out.push(
      <span key={i} tabIndex={0} aria-describedby={`${uid}-${i}`} onMouseEnter={keepOnScreen} onFocus={keepOnScreen} className={cx('group relative cursor-help rounded outline-none focus-visible:ring-2 focus-visible:ring-brand-400 px-0.5 underline decoration-2 underline-offset-4', sp.n.tone)}>
        {text.slice(sp.s, sp.e)}
        <span id={`${uid}-${i}`} role="tooltip" className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-64 max-w-[75vw] rounded-xl bg-slate-900 p-3 text-xs leading-relaxed text-white shadow-xl group-hover:block group-focus:block">
          <b className="uppercase">{sp.n.label}</b><br />{sp.n.detail}
        </span>
      </span>,
    )
    pos = sp.e
  })
  out.push(text.slice(pos))
  return <div className="whitespace-pre-wrap leading-8 text-slate-700">{out}</div>
}

/** Shift a note's tooltip left so it doesn't run off the right edge of a phone screen. */
function keepOnScreen(e: React.SyntheticEvent<HTMLElement>) {
  const tip = e.currentTarget.querySelector<HTMLElement>('[role=tooltip]')
  if (!tip) return
  const left = e.currentTarget.getBoundingClientRect().left
  const width = Math.min(256, innerWidth * 0.75)
  tip.style.left = `${Math.max(8 - left, Math.min(0, innerWidth - 8 - width - left))}px`
}

const TONE: Record<string, string> = {
  grammar: 'decoration-rose-400 bg-rose-50', vocabulary: 'decoration-violet-400 bg-violet-50', cohesion: 'decoration-sky-400 bg-sky-50',
  task: 'decoration-amber-400 bg-amber-50', spelling: 'decoration-pink-400 bg-pink-50', punctuation: 'decoration-slate-400 bg-slate-100',
  pronunciation: 'decoration-amber-400 bg-amber-50', hesitation: 'decoration-sky-400 bg-sky-50',
}

function WritingView({ attempt, test }: { attempt: Attempt; test?: Test }) {
  const w = attempt.results.writing
  // A task shows once it has an AI mark or examiner marks — a failed other task doesn't hide it.
  const tasks = writingTasksTaken(attempt)
    .map(n => ({ n, ev: n === 1 ? w?.task1 : w?.task2, override: attempt.review?.writing?.[n === 1 ? 'task1' : 'task2'] }))
    .filter(t => t.ev || t.override)
  return (
    <div className="space-y-6">
      {w?.status !== 'done' && <Card className="p-6"><MarkingState status={w?.status} error={w?.error} retry={() => markWriting(attempt.id)}>{null}</MarkingState></Card>}
      {tasks.map(({ n, ev, override }) => <WritingTaskCard key={n} n={n} ev={ev} text={n === 1 ? attempt.writing.task1 : attempt.writing.task2} prompt={test?.writing?.tasks.find(t => t.number === n)?.prompt} override={override} />)}
    </div>
  )
}

function WritingTaskCard({ n, ev, text, prompt, override }: { n: 1 | 2; ev?: WritingTaskEval; text: string; prompt?: string; override?: Partial<Record<'task' | 'coherence' | 'lexical' | 'grammar', number>> }) {
  const [showModel, setShowModel] = useState(false)
  const crit = [['task', n === 1 ? 'Task Achievement' : 'Task Response'], ['coherence', 'Coherence & Cohesion'], ['lexical', 'Lexical Resource'], ['grammar', 'Grammatical Range & Accuracy']] as const
  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-xl font-bold">Task {n}</div>
          <div className="text-sm text-slate-500">{ev?.wordCount ?? countWords(text)} words{!ev && ' · marked by the examiner'}</div>
        </div>
        <BandRing band={writingTaskBand(ev, override)} size={80} stroke={7} />
      </div>
      {prompt && <details className="mb-5 rounded-xl bg-slate-50 p-4 text-sm"><summary className="cursor-pointer font-semibold">Question</summary><p className="mt-2 whitespace-pre-line text-slate-600">{prompt}</p></details>}
      <div className="grid gap-4 md:grid-cols-2">
        {crit.map(([k, label]) => {
          const c = ev?.criteria[k]
          const ov = override?.[k]
          return (
            <div key={k} className="rounded-xl border border-slate-100 p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold">{label}</span>
                <span className="font-display text-lg font-extrabold" style={{ color: bandColor(ov ?? c?.band) }}>
                  {fmtBand(ov ?? c?.band)}{ov !== undefined && c && ov !== c.band && <span className="ml-1 text-xs font-medium text-slate-400 line-through">{fmtBand(c.band)}</span>}
                </span>
              </div>
              {c && <p className="text-sm text-slate-600">{c.comment}</p>}
            </div>
          )
        })}
      </div>
      <div className="mt-6">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold">Your response <span className="font-normal text-slate-400">— hover the underlined text</span></div>
        <div className="rounded-xl border border-slate-100 p-4">
          <Annotated text={text} notes={(ev?.annotations ?? []).map((a: Annotation) => ({ quote: a.quote, label: a.type, detail: `${a.issue} → ${a.suggestion}`, tone: TONE[a.type] ?? '' }))} />
        </div>
      </div>
      {ev && ev.wordCount > 0 && <div className="mt-6 grid gap-4 md:grid-cols-2">
        <List title="Strengths" items={ev.strengths} tone="text-emerald-600" />
        <List title="How to reach the next band" items={ev.improvements} tone="text-brand-600" />
      </div>}
      {ev?.modelAnswer && <div className="mt-6">
        <Button variant="secondary" onClick={() => setShowModel(s => !s)}><Sparkles size={15} /> {showModel ? 'Hide' : 'Show'} Band 8.5+ model answer</Button>
        <AnimatePresence>
          {showModel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-3 whitespace-pre-wrap rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 p-5 leading-8 text-slate-700">{ev.modelAnswer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>}
    </Card>
  )
}

function List({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className={cx('mb-2 text-sm font-bold', tone)}>{title}</div>
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">{items.map((s, i) => <li key={i}>{s}</li>)}</ul>
    </div>
  )
}

function SpeakingView({ attempt }: { attempt: Attempt }) {
  const s = attempt.results.speaking
  const m = s?.metrics
  return (
    <div className="space-y-6">
      {m && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Speech rate', `${m.wordsPerMinute}`, 'words / min', m.wordsPerMinute >= 110 && m.wordsPerMinute <= 170],
            ['Long pauses', `${m.longPauses}`, `avg ${m.avgPauseSec}s`, m.longPauses <= 6],
            ['Filler words', `${m.fillerCount}`, Object.keys(m.fillers).slice(0, 3).join(', ') || 'none', m.fillerCount <= 8],
            ['Vocabulary range', `${Math.round(m.uniqueWordRatio * 100)}%`, 'unique words', m.uniqueWordRatio >= 0.45],
          ].map(([k, v, sub, ok], i) => (
            <Card key={k as string} delay={i * 0.05} className="p-5">
              <div className="text-xs font-semibold uppercase text-slate-400">{k}</div>
              <div className={cx('mt-1 font-display text-3xl font-extrabold', ok ? 'text-emerald-600' : 'text-amber-600')}>{v}</div>
              <div className="text-xs text-slate-500">{sub}</div>
            </Card>
          ))}
        </div>
      )}
      <Card className="p-6">
        {s?.status !== 'done' && <MarkingState status={s?.status} error={s?.error} retry={() => markSpeaking(attempt.id)}>{null}</MarkingState>}
        {/* Examiner marks show even when the AI hasn't marked (no key, or it failed). */}
        {(s?.criteria || attempt.review?.speaking) && (
          <>
            <div className={cx('grid gap-4 md:grid-cols-2', s?.status !== 'done' && 'mt-4')}>
              {SPEAKING_CRITERIA.map(([k, label]) => {
                const ov = attempt.review?.speaking?.[k]
                const c = s?.criteria?.[k]
                return (
                  <div key={k} className="rounded-xl border border-slate-100 p-4">
                    <div className="mb-1 flex items-center justify-between"><span className="text-sm font-semibold">{label}</span><span className="font-display text-lg font-extrabold" style={{ color: bandColor(ov ?? c?.band) }}>{fmtBand(ov ?? c?.band)}</span></div>
                    {c && <p className="text-sm text-slate-600">{c.comment}</p>}
                  </div>
                )
              })}
            </div>
            {s?.criteria && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <List title="Strengths" items={s.strengths ?? []} tone="text-emerald-600" />
                <List title="How to reach the next band" items={s.improvements ?? []} tone="text-brand-600" />
              </div>
            )}
          </>
        )}
      </Card>
      <Card className="p-6">
        <div className="mb-4 font-display text-lg font-bold">Your answers</div>
        <div className="space-y-4">
          {attempt.speaking.map((a, i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="violet">Part {a.part}</Badge>
                <span className="text-xs text-slate-400">{Math.round(a.durationSec)}s · {a.pauses.length} long pause{a.pauses.length === 1 ? '' : 's'}</span>
                {a.recordingId && <PlayRecording id={a.recordingId} />}
              </div>
              <div className="mb-2 text-sm font-semibold text-slate-700">{a.question}</div>
              <Annotated text={a.transcript || '(no speech recognised)'} notes={(s?.notes ?? []).map((n: TranscriptNote) => ({ quote: n.quote, label: n.type, detail: `${n.note}${n.upgrade ? ` → ${n.upgrade}` : ''}`, tone: TONE[n.type] ?? '' }))} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function PlayRecording({ id }: { id: string }) {
  const [url, setUrl] = useState<string>()
  useEffect(() => { void resolveMediaUrl(id).then(setUrl) }, [id])
  if (!url) return null
  return (
    <span className="ml-auto flex items-center gap-1 text-xs text-slate-500"><Play size={12} /><audio src={url} controls className="h-8" /></span>
  )
}

export function DownloadTrf() {
  return <Button variant="dark" onClick={() => window.print()}><Download size={16} /> Download PDF</Button>
}
