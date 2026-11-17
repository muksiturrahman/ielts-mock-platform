import { motion } from 'motion/react'
import { CheckCircle2, Flag, XCircle } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichContent, SvgFigure } from '../components/RichContent'
import { resolveMediaUrl } from '../lib/media'
import { isCompletionCorrect } from '../lib/scoring'
import type { AnswerValue, ObjectiveItem, Question, QuestionGroup } from '../lib/types'

export interface GroupProps {
  group: QuestionGroup
  answers: Record<string, AnswerValue>
  setAnswer: (id: string, v: AnswerValue) => void
  flags: string[]
  toggleFlag: (id: string) => void
  onFocusQuestion?: (n: number) => void
  /** Practice review: show right/wrong + explanation */
  review?: boolean
  readOnly?: boolean
  /** Stored marks of a finished attempt — review uses these, not the (possibly edited) current answer key. */
  marks?: Record<string, ObjectiveItem>
}

const TFNG = ['TRUE', 'FALSE', 'NOT GIVEN']
const YNNG = ['YES', 'NO', 'NOT GIVEN']

export function rangeLabel(g: QuestionGroup) {
  const nums = g.questions.map(q => q.number)
  const a = Math.min(...nums)
  const b = Math.max(...nums)
  return a === b ? `Question ${a}` : `Questions ${a}–${b}`
}

function isRight(g: QuestionGroup, q: Question, answers: Record<string, AnswerValue>): boolean {
  const v = answers[q.id]
  const given = Array.isArray(v) ? v.join(', ') : (v ?? '')
  if (g.type === 'completion') return isCompletionCorrect(given, q.answer, g)
  return q.answer.some(a => a.toUpperCase() === given.toUpperCase())
}

function Feedback({ ok, q, given, answer }: { ok: boolean; q: Question; given: string; answer: string[] }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`mt-2 rounded-lg border px-3 py-2 text-sm ${ok ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-900'}`}>
      <div className="flex items-center gap-1.5 font-semibold">
        {ok ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
        {ok ? 'Correct' : `Correct answer: ${answer.join(' / ')}`}
      </div>
      {!ok && <div className="mt-0.5">Your answer: {given ? <b>{given}</b> : <i>no answer</i>}</div>}
      {q.explanation && <p className="mt-1 opacity-90">{q.explanation}</p>}
    </motion.div>
  )
}

/** ids: the question(s) this button flags — a multi-answer group flags all its numbers together. */
function FlagBtn({ ids, flags, toggle, className = 'ml-auto' }: { ids: string[]; flags: string[]; toggle: (id: string) => void; className?: string }) {
  const on = flags.includes(ids[0])
  return (
    <button type="button" onClick={() => ids.forEach(id => (flags.includes(id) === on) && toggle(id))} title={on ? 'Remove review flag' : 'Flag for review'} aria-pressed={on}
      className={`${className} shrink-0 rounded p-1 transition ${on ? 'text-amber-500' : 'opacity-30 hover:opacity-70'}`}>
      <Flag size={15} fill={on ? 'currentColor' : 'none'} />
    </button>
  )
}

export function Img({ src }: { src: string }) {
  const [url, setUrl] = useState<string>()
  useEffect(() => { void resolveMediaUrl(src).then(setUrl) }, [src])
  return url ? <img src={url} alt="" className="mx-auto my-3 max-h-96 rounded border exam-line" /> : null
}

export function QuestionGroupView({ group: g, answers, setAnswer, flags, toggleFlag, onFocusQuestion, review, readOnly, marks }: GroupProps) {
  const byNumber = new Map(g.questions.map(q => [q.number, q]))
  const keyOf = (q: Question) => marks?.[q.id]?.accepted ?? q.answer
  const right = (q: Question) => marks?.[q.id]?.isCorrect ?? isRight(g, q, answers)
  const disabled = readOnly || review

  const text = (q: Question) => (
    <input
      type="text" id={`q-${q.number}`} aria-label={`Question ${q.number}`} disabled={disabled}
      className="q-input" spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
      value={(answers[q.id] as string) ?? ''} placeholder={String(q.number)}
      onFocus={() => onFocusQuestion?.(q.number)}
      onChange={e => setAnswer(q.id, e.target.value)}
    />
  )
  const select = (q: Question) => (
    <select
      id={`q-${q.number}`} aria-label={`Question ${q.number}`} disabled={disabled}
      className="mx-1 h-8 rounded px-2 align-middle"
      value={(answers[q.id] as string) ?? ''}
      onFocus={() => onFocusQuestion?.(q.number)}
      onChange={e => setAnswer(q.id, e.target.value)}
    >
      <option value="">{q.number}</option>
      {(g.options ?? []).map(o => <option key={o.key} value={o.key}>{o.key}</option>)}
    </select>
  )

  const slot = (n: number): ReactNode => {
    const q = byNumber.get(n)
    if (!q) return `(${n})`
    return (
      <span className="inline-flex items-center">
        {g.type === 'matching' ? select(q) : text(q)}
        {!readOnly && <FlagBtn ids={[q.id]} flags={flags} toggle={toggleFlag} className="ml-0.5" />}
        {review && (right(q) ? <CheckCircle2 size={16} className="text-emerald-500" /> : <span className="text-xs font-semibold text-rose-500">✗ {keyOf(q)[0]}</span>)}
      </span>
    )
  }

  let body: ReactNode
  if (g.type === 'mcq_multi') {
    const chosen = (answers[g.id] as string[]) ?? []
    const max = g.questions.length
    body = (
      <div id={`q-${g.questions[0].number}`} onFocus={() => onFocusQuestion?.(g.questions[0].number)}>
        {g.content && <RichContent text={g.content} />}
        <div className="mt-2 space-y-1.5">
          {(g.options ?? []).map(o => {
            const on = chosen.includes(o.key)
            const correct = review && g.questions.some(q => keyOf(q)[0] === o.key)
            return (
              <label key={o.key} className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 transition exam-line ${on ? 'exam-muted font-medium' : ''} ${correct ? 'ring-2 ring-emerald-400' : ''}`}>
                <input type="checkbox" disabled={disabled || (!on && chosen.length >= max)} checked={on} className="mt-1"
                  onChange={() => setAnswer(g.id, on ? chosen.filter(k => k !== o.key) : [...chosen, o.key])} />
                <span><b className="mr-2">{o.key}</b>{o.text}</span>
              </label>
            )
          })}
        </div>
        <div className="mt-1 flex items-center text-xs">
          <span className="opacity-60">Select {max} answers ({chosen.length}/{max})</span>
          {!readOnly && <FlagBtn ids={g.questions.map(q => q.id)} flags={flags} toggle={toggleFlag} />}
        </div>
      </div>
    )
  } else if (g.content) {
    body = (
      <>
        {g.type === 'matching' && g.options && <OptionBox g={g} />}
        <div className="rounded-md border p-4 exam-line">
          {g.title && <div className="mb-2 text-center font-bold">{g.title}</div>}
          <RichContent text={g.content} slot={slot} />
        </div>
        {review && <div className="mt-2 space-y-1">{g.questions.map(q => q.explanation && <p key={q.id} className="text-sm opacity-80"><b>{q.number}.</b> {q.explanation}</p>)}</div>}
      </>
    )
  } else {
    body = (
      <>
        {g.type === 'matching' && g.options && <OptionBox g={g} />}
        <div className="space-y-4">
          {g.questions.map(q => {
            const val = (answers[q.id] as string) ?? ''
            return (
              <div key={q.id} id={`q-${q.number}`} onFocus={() => onFocusQuestion?.(q.number)} className="scroll-mt-24">
                <div className="flex items-start gap-1">
                  <span className="q-num">{q.number}</span>
                  <div className="flex-1">
                    {g.type === 'completion' ? (
                      q.prompt.includes('{{') ? <RichContent text={q.prompt} slot={slot} /> : <span className="leading-loose">{q.prompt} {text(q)}</span>
                    ) : g.type === 'matching' ? (
                      <span className="leading-loose">{q.prompt} {select(q)}</span>
                    ) : (
                      <span className="font-medium">{q.prompt}</span>
                    )}
                  </div>
                  {!readOnly && <FlagBtn ids={[q.id]} flags={flags} toggle={toggleFlag} />}
                </div>
                {(g.type === 'mcq' || g.type === 'tfng' || g.type === 'ynng') && (
                  <div className="ml-8 mt-2 space-y-1.5" role="radiogroup">
                    {(g.type === 'mcq' ? q.options ?? [] : (g.type === 'tfng' ? TFNG : YNNG).map(k => ({ key: k, text: '' }))).map(o => (
                      <label key={o.key} className={`flex cursor-pointer items-start gap-3 rounded-md px-2 py-1.5 transition hover:opacity-90 ${val === o.key ? 'exam-muted font-medium' : ''}`}>
                        <input type="radio" name={q.id} disabled={disabled} checked={val === o.key} className="mt-1" onFocus={() => onFocusQuestion?.(q.number)} onChange={() => setAnswer(q.id, o.key)} />
                        <span>{o.text ? <><b className="mr-2">{o.key}</b>{o.text}</> : o.key}</span>
                      </label>
                    ))}
                  </div>
                )}
                {review && <div className="ml-8"><Feedback ok={right(q)} q={q} answer={keyOf(q)} given={String(answers[q.id] ?? '')} /></div>}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <section className="mb-10">
      <h3 className="text-[1.1em] font-bold">{rangeLabel(g)}</h3>
      <p className="mb-3 mt-1 whitespace-pre-line font-semibold">{g.instructions}</p>
      {g.svg && <SvgFigure svg={g.svg} />}
      {g.image && <Img src={g.image} />}
      {body}
      {review && g.type === 'mcq_multi' && (
        <p className="mt-2 text-sm">
          Correct: <b>{g.questions.map(q => keyOf(q)[0]).join(', ')}</b>
          {g.questions[0].explanation && <span className="opacity-80"> — {g.questions[0].explanation}</span>}
        </p>
      )}
    </section>
  )
}

function OptionBox({ g }: { g: QuestionGroup }) {
  const onlyLetters = (g.options ?? []).every(o => !o.text || o.text === o.key || o.text === `Paragraph ${o.key}`)
  if (onlyLetters) return null
  return (
    <div className="mb-4 rounded-md border p-3 exam-line">
      {g.title && !g.content && <div className="mb-1.5 font-bold">{g.title}</div>}
      <ul className="space-y-1">
        {(g.options ?? []).map(o => <li key={o.key} className="flex gap-3"><b className="w-8 shrink-0">{o.key}</b><span>{o.text}</span></li>)}
      </ul>
    </div>
  )
}
