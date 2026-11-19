import { motion } from 'motion/react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Passage } from '../exam/Passage'
import { QuestionGroupView } from '../exam/QuestionGroupView'
import { drillSections } from '../lib/attempts'
import { parseScript } from '../lib/speech'
import { useDB } from '../lib/store'
import type { Attempt, ListeningSection, ObjectiveResult, ReadingSection, Test } from '../lib/types'
import { cx } from './ui'

/** Re-opens a finished Listening/Reading module exactly as sat, with every answer marked and explained. */
export function ExamReview({ attempt, test, module, result, focus }: { attempt: Attempt; test: Test; module: 'listening' | 'reading'; result: ObjectiveResult; focus?: number }) {
  const contrast = useDB(d => d.settings.contrast)
  const all: (ListeningSection | ReadingSection)[] = test[module]?.sections ?? []
  const sections = drillSections(all, attempt.drill)
  const shown = result.items.length ? [...new Set(result.items.map(i => i.sectionIndex))].sort((a, b) => a - b) : sections.map((_, i) => i)
  const startSection = focus ? result.items.find(i => i.number === focus)?.sectionIndex ?? shown[0] : shown[0]
  const [sectionIndex, setSectionIndex] = useState(startSection)
  const section = sections[sectionIndex]
  const wrong = result.items.filter(i => !i.isCorrect)
  const marks = Object.fromEntries(result.items.map(i => [i.questionId, i]))

  const jump = (n: number) => {
    const target = result.items.find(i => i.number === n)
    if (target && target.sectionIndex !== sectionIndex) setSectionIndex(target.sectionIndex)
    setTimeout(() => document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), target?.sectionIndex !== sectionIndex ? 300 : 0)
  }
  useEffect(() => { if (focus) jump(focus) }, [focus]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!section) return <p className="text-sm text-slate-500">This test has been changed or deleted, so the full review is no longer available. The answer sheet still shows every answer.</p>

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-2 p-4">
        <span className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <XCircle size={16} className="text-rose-500" /> {wrong.length} to learn from
        </span>
        {wrong.map(i => (
          <button key={i.questionId} onClick={() => jump(i.number)} className="h-8 min-w-8 rounded-lg bg-rose-50 px-2 text-sm font-bold text-rose-700 transition hover:scale-110" title={`Question ${i.number}`}>
            {i.number}
          </button>
        ))}
        {wrong.length === 0 && <span className="flex items-center gap-1 text-sm text-emerald-600"><CheckCircle2 size={16} /> All correct — excellent!</span>}
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {shown.map(i => {
          const items = result.items.filter(x => x.sectionIndex === i)
          const right = items.filter(x => x.isCorrect).length
          return (
            <button key={i} aria-pressed={i === sectionIndex} onClick={() => setSectionIndex(i)}
              className={cx('whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition', i === sectionIndex ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')}>
              {sections[i]?.title} <span className="ml-1 opacity-70">{right}/{items.length}</span>
            </button>
          )
        })}
      </div>

      <motion.div key={section.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="exam overflow-hidden rounded-2xl border border-slate-200 shadow-sm" data-contrast={contrast}>
        <div className={cx('grid', module === 'reading' && 'lg:grid-cols-2')}>
          {module === 'reading' && 'passage' in section && (
            <div className="max-h-[75vh] overflow-y-auto border-b p-6 exam-line scroll-thin lg:border-b-0 lg:border-r">
              <Passage title={section.passageTitle} text={section.passage} highlights={attempt.highlights[section.id] ?? []} onChange={() => {}} />
            </div>
          )}
          <div className="max-h-[75vh] overflow-y-auto p-6 scroll-thin">
            {section.groups.map(g => (
              <QuestionGroupView key={g.id} group={g} answers={attempt.answers} setAnswer={() => {}} flags={attempt.flags} toggleFlag={() => {}} review readOnly marks={marks} />
            ))}
          </div>
        </div>
        {module === 'listening' && 'transcript' in section && (
          <details open className="border-t p-6 exam-line">
            <summary className="cursor-pointer font-bold">Transcript — find where each answer was said</summary>
            <div className="mt-3 space-y-1.5 leading-relaxed">
              {parseScript(section.transcript).map((l, i) => <p key={i}><b>{l.speaker}:</b> {l.text}</p>)}
            </div>
          </details>
        )}
      </motion.div>
    </div>
  )
}
