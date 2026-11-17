import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SvgFigure } from '../components/RichContent'
import { Img } from './QuestionGroupView'
import { TaskChart } from '../components/TaskChart'
import { countWords } from '../lib/scoring'
import { patchAttempt } from '../lib/store'
import { QuestionNav, SplitPane, TopBar, useDeadline } from './ExamChrome'
import type { ModuleProps } from './ExamPage'
import { SubmitButton } from './SubmitButton'

const AUTOSAVE_MS = 10_000

export default function WritingModule({ test, attempt, onSubmit, exitButton }: ModuleProps) {
  const tasks = test.writing!.tasks.filter(t => !attempt.sections || attempt.sections.includes(t.number))
  const [part, setPart] = useState(0)
  const [text, setText] = useState(attempt.writing)
  const [savedAt, setSavedAt] = useState<number>()
  const textRef = useRef(text)
  textRef.current = text

  const save = useCallback(() => {
    patchAttempt(attempt.id, { writing: textRef.current })
    setSavedAt(Date.now())
  }, [attempt.id])

  // Autosave every 10s, when the tab is hidden and when leaving the module.
  useEffect(() => {
    const t = setInterval(save, AUTOSAVE_MS)
    const onHide = () => document.visibilityState === 'hidden' && save()
    document.addEventListener('visibilitychange', onHide)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', onHide)
      save()
    }
  }, [save])

  const submit = () => {
    save()
    onSubmit()
  }
  const remaining = useDeadline(attempt.progress.writing.deadline, submit)
  const task = tasks[part]
  const key = task.number === 1 ? 'task1' : 'task2'
  const words = countWords(text[key])
  const parts = tasks.map(t => ({
    label: `Part ${t.number}`,
    numbers: [{ n: t.number, answered: countWords(text[t.number === 1 ? 'task1' : 'task2']) > 0, flagged: false }],
  }))
  const unanswered = tasks.filter(t => !countWords(text[t.number === 1 ? 'task1' : 'task2'])).length

  return (
    <>
      <TopBar title="Writing" remaining={remaining} right={exitButton} />
      <div className="flex shrink-0 items-center justify-between border-b px-6 py-2.5 exam-line exam-muted">
        <div>
          <span className="font-bold">Part {task.number}</span>
          <span className="ml-3 text-sm opacity-70">You should spend about {task.minutes} minutes on this task. Write at least {task.minWords} words.</span>
        </div>
        <AnimatePresence>
          {savedAt && (
            <motion.span key={savedAt} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} className="flex items-center gap-1 text-xs">
              <CheckCircle2 size={13} /> Saved {new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={task.id} className="flex min-h-0 flex-1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
          <SplitPane
            left={
              <div>
                <p className="whitespace-pre-line leading-relaxed">{task.prompt}</p>
                <div className="mt-6">
                  {task.chart && <TaskChart chart={task.chart} />}
                  {task.svg && <SvgFigure svg={task.svg} />}
                  {task.image && <Img src={task.image} />}
                </div>
              </div>
            }
            right={
              <div className="flex h-full flex-col">
                <textarea
                  value={text[key]}
                  onChange={e => setText(t => ({ ...t, [key]: e.target.value }))}
                  spellCheck={false} autoCorrect="off" autoCapitalize="off" autoComplete="off" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false"
                  aria-label={`Part ${task.number} answer`}
                  placeholder="Type your answer here"
                  className="min-h-80 w-full flex-1 resize-none rounded-md p-4 leading-relaxed"
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className={words < task.minWords ? 'opacity-70' : 'font-semibold text-emerald-600'}>Word count: {words}</span>
                  <div className="h-1.5 w-40 overflow-hidden rounded-full exam-muted">
                    <motion.div className="h-full bg-emerald-500" animate={{ width: `${Math.min(100, (words / task.minWords) * 100)}%` }} />
                  </div>
                </div>
              </div>
            }
          />
        </motion.div>
      </AnimatePresence>
      <QuestionNav parts={parts} current={part} onPart={i => { save(); setPart(i) }} onJump={n => setPart(tasks.findIndex(t => t.number === n))}
        action={<SubmitButton unanswered={unanswered} onSubmit={submit} label="Submit writing" />} />
    </>
  )
}
