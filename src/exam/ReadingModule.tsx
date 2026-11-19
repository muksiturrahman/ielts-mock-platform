import { AnimatePresence, motion } from 'motion/react'
import { drillSections } from '../lib/attempts'
import { useState } from 'react'
import { patchAttempt } from '../lib/store'
import { jumpTo, partNav, QuestionNav, SplitPane, TopBar, useDeadline } from './ExamChrome'
import type { ModuleProps } from './ExamPage'
import { Passage } from './Passage'
import { QuestionGroupView } from './QuestionGroupView'
import { SubmitButton } from './SubmitButton'

export default function ReadingModule({ test, attempt, onSubmit, setAnswer, toggleFlag, setHighlights, exitButton }: ModuleProps) {
  const all = drillSections(test.reading!.sections, attempt.drill)
  const indexes = attempt.sections ?? all.map((_, i) => i)
  const sections = indexes.map(i => all[i])
  const progress = attempt.progress.reading
  const [part, setPartState] = useState(Math.min(progress.section, sections.length - 1))
  const [current, setCurrent] = useState<number>()
  const remaining = useDeadline(progress.deadline, onSubmit)

  const setPart = (i: number) => {
    setPartState(i)
    patchAttempt(attempt.id, a => ({ progress: { ...a.progress, reading: { ...a.progress.reading, section: i } } }))
  }
  const parts = sections.map(s => partNav(s.groups, attempt.answers, attempt.flags, s.title))
  const unanswered = parts.flatMap(p => p.numbers).filter(n => !n.answered).length
  const section = sections[part]
  const review = Boolean(progress.revealed)
  // Practice mode: instant answer checking with explanations.

  const goTo = (n: number) => {
    const p = parts.findIndex(x => x.numbers.some(y => y.n === n))
    if (p !== part) setPart(p)
    setCurrent(n)
    setTimeout(() => jumpTo(n), p !== part ? 250 : 0)
  }
  const flat = parts.flatMap(p => p.numbers.map(x => x.n))
  const step = (d: number) => {
    const i = current ? flat.indexOf(current) : -1
    const n = flat[Math.min(flat.length - 1, Math.max(0, i + d))]
    if (n) goTo(n)
  }

  return (
    <>
      <TopBar title="Reading" remaining={remaining} right={exitButton} />
      <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2.5 exam-line exam-muted sm:px-6">
        <div>
          <span className="font-bold">{section.title}</span>
          <span className="ml-3 text-sm opacity-70">Read the text and answer questions {parts[part].numbers[0]?.n}–{parts[part].numbers.at(-1)?.n}.</span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={section.id} className="flex min-h-0 flex-1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
          <SplitPane
            left={<Passage title={section.passageTitle} text={section.passage} highlights={attempt.highlights[section.id] ?? []} onChange={h => setHighlights(section.id, h)} />}
            right={section.groups.map(g => (
              <QuestionGroupView key={g.id} group={g} answers={attempt.answers} setAnswer={setAnswer} flags={attempt.flags} toggleFlag={toggleFlag} onFocusQuestion={setCurrent} review={review} />
            ))}
          />
        </motion.div>
      </AnimatePresence>
      <QuestionNav parts={parts} current={part} onPart={setPart} onJump={goTo} currentNumber={current} onPrev={() => step(-1)} onNext={() => step(1)}
        action={<>
          {attempt.mode === 'practice' && (
            <button onClick={() => patchAttempt(attempt.id, a => ({ progress: { ...a.progress, reading: { ...a.progress.reading, revealed: true } } }))} disabled={review} title="Shows the answers and locks yours" className="whitespace-nowrap rounded-md border px-3 py-2 text-sm font-semibold exam-line hover:opacity-70 disabled:opacity-50">
              {review ? 'Answers shown · locked' : 'Check answers'}
            </button>
          )}
          <SubmitButton unanswered={unanswered} onSubmit={onSubmit} />
        </>} />
    </>
  )
}
