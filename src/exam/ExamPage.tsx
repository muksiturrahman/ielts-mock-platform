import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowRight, Headphones, LogOut } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { MODULE_LABEL, moduleMinutes, startModule, submitModule } from '../lib/attempts'
import { patchAttempt, useDB } from '../lib/store'
import { useDialogFocus } from '../components/ui'
import type { AnswerValue, Attempt, Highlight, ModuleKey, Test } from '../lib/types'
import { stopSpeaking } from '../lib/speech'
import ListeningModule from './ListeningModule'
import ReadingModule from './ReadingModule'
import WritingModule from './WritingModule'
import SpeakingModule from './SpeakingModule'

export interface ModuleProps {
  test: Test
  attempt: Attempt
  onSubmit: () => void
  setAnswer: (id: string, v: AnswerValue) => void
  toggleFlag: (id: string) => void
  setHighlights: (key: string, h: Highlight[]) => void
  exitButton: React.ReactNode
}

const INSTRUCTIONS: Record<ModuleKey, (minutes: number, timed: boolean) => string[]> = {
  listening: m => [
    `Time: approximately ${m} minutes, including checking time.`,
    'Answer all the questions. You can change your answers at any time during the test.',
    'You will hear each part ONCE only. The recording plays automatically — there is no pause or rewind.',
    'At the end of the recording you have two minutes to check your answers.',
    'Use the volume slider at the top of the screen at any time.',
  ],
  reading: (m, timed) => [
    timed ? `Time: ${m} minutes.` : 'Untimed practice — take as long as you need.',
    'Answer all the questions. You can change your answers at any time.',
    'Right-click (or long-press) selected text in the passage to highlight it or add a note.',
    'Drag the divider to resize the passage and question panels. Flag questions to come back to them.',
    'There is no extra time to transfer answers.',
  ],
  writing: (m, timed) => [
    timed ? `Time: ${m} minutes for both tasks.` : 'Untimed practice.',
    'Task 1: about 20 minutes, at least 150 words. Task 2: about 40 minutes, at least 250 words.',
    'Task 2 contributes twice as much as Task 1 to your Writing score.',
    'Spell-check and autocorrect are switched off, as in the real test. Your work is saved automatically.',
  ],
  speaking: () => [
    'The Speaking test is a conversation with the examiner, in three parts (11–14 minutes).',
    'Part 1: questions about familiar topics. Part 2: one minute to prepare, then speak for up to two minutes on a cue card. Part 3: a discussion on more abstract ideas.',
    'Your answers are recorded and transcribed automatically. Use Chrome or Edge for live transcription.',
    'Speak naturally — answer fully and extend your ideas.',
  ],
}

export default function ExamPage() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const attempt = useDB(d => d.attempts.find(a => a.id === attemptId))
  const test = useDB(d => d.tests.find(t => t.id === attempt?.testId))
  const settings = useDB(d => d.settings)
  const [warning, setWarning] = useState(false)
  const [between, setBetween] = useState<ModuleKey | null>(null)
  const [confirmExit, setConfirmExit] = useState(false)

  const module = attempt?.modules[attempt.moduleIndex]
  const started = Boolean(module && attempt?.progress[module]?.startedAt)

  // Anti-cheat: count tab switches / window blur during a running module.
  useEffect(() => {
    if (!started || !attempt) return
    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        patchAttempt(attempt.id, a => ({ tabSwitches: a.tabSwitches + 1 }))
        setWarning(true)
      }
    }
    const beforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [started, attempt?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopSpeaking(), [])

  const id = attempt?.id
  const setAnswer = useCallback((qid: string, v: AnswerValue) => id && patchAttempt(id, a => ({ answers: { ...a.answers, [qid]: v } })), [id])
  const toggleFlag = useCallback((qid: string) => id && patchAttempt(id, a => ({ flags: a.flags.includes(qid) ? a.flags.filter(f => f !== qid) : [...a.flags, qid] })), [id])
  const setHighlights = useCallback((key: string, h: Highlight[]) => id && patchAttempt(id, a => ({ highlights: { ...a.highlights, [key]: h } })), [id])

  const onSubmit = useCallback(() => {
    if (!attempt || !module) return
    stopSpeaking()
    submitModule(attempt.id, module)
    const next = attempt.modules[attempt.modules.indexOf(module) + 1]
    if (next) setBetween(next)
    else navigate(`/results/${attempt.id}`, { replace: true })
  }, [attempt, module, navigate])

  if (!attempt || !test) return <Navigate to="/tests" replace />
  if (attempt.status === 'completed' && !between) return <Navigate to={`/results/${attempt.id}`} replace />
  if (!module) return <Navigate to={`/results/${attempt.id}`} replace />

  const minutes = moduleMinutes(test, module, attempt.sections)
  const exitButton = (
    <button onClick={() => setConfirmExit(true)} className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold exam-line hover:opacity-70">
      <LogOut size={14} /> Exit
    </button>
  )
  const props: ModuleProps = { test, attempt, onSubmit, setAnswer, toggleFlag, setHighlights, exitButton }

  return (
    <div className="exam flex h-screen flex-col overflow-hidden" data-contrast={settings.contrast} style={{ ['--exam-scale' as string]: settings.fontScale }}>
      <AnimatePresence mode="wait">
        {between ? (
          <Interlude key="between" next={between} onContinue={() => setBetween(null)} />
        ) : !started ? (
          <motion.div key={`intro-${module}`} className="flex flex-1 items-center justify-center overflow-y-auto p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="w-full max-w-2xl rounded-xl border p-8 exam-line">
              <div className="mb-6 flex items-center gap-3">
                <span className="rounded bg-[#e11d2e] px-2 py-0.5 text-sm font-black tracking-wide text-white">IELTS</span>
                <span className="text-sm opacity-60">{test.variant === 'academic' ? 'Academic' : 'General Training'} · {test.title}</span>
              </div>
              <h1 className="mb-1 text-3xl font-bold">{MODULE_LABEL[module]}</h1>
              <p className="mb-6 opacity-60">
                {attempt.mode === 'full' ? `Module ${attempt.moduleIndex + 1} of ${attempt.modules.length}` : 'Practice'}
                {attempt.sections && module !== 'speaking' && ` · ${module === 'writing' ? 'Task' : 'Part'} ${attempt.sections.map(s => (module === 'writing' ? s : s + 1)).join(', ')}`}
              </p>
              <h2 className="mb-2 font-bold uppercase tracking-wide">Instructions to candidates</h2>
              <ul className="mb-8 list-disc space-y-2 pl-5">
                {INSTRUCTIONS[module](minutes, attempt.timed).map(l => <li key={l}>{l}</li>)}
              </ul>
              {module === 'listening' && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border p-3 text-sm exam-line exam-muted">
                  <Headphones size={18} /> Put on your headphones now. The recording starts as soon as you begin.
                </div>
              )}
              <div className="flex items-center justify-between">
                <button onClick={() => navigate('/tests')} className="text-sm underline opacity-60 hover:opacity-100">Back to tests</button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => startModule(attempt.id, module)}
                  className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-6 py-3 font-semibold text-white shadow-lg">
                  Start {MODULE_LABEL[module]} <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key={`run-${module}`} className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {module === 'listening' && <ListeningModule {...props} />}
            {module === 'reading' && <ReadingModule {...props} />}
            {module === 'writing' && <WritingModule {...props} />}
            {module === 'speaking' && <SpeakingModule {...props} />}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {warning && (
          <Overlay key="left" labelId="ov-left">
            <AlertTriangle className="mx-auto mb-3 text-amber-500" size={40} />
            <h2 id="ov-left" className="mb-2 text-xl font-bold">You left the test window</h2>
            <p className="mb-5 text-sm text-slate-600">
              Leaving the test screen is not allowed in the real exam and has been recorded ({attempt.tabSwitches} time{attempt.tabSwitches === 1 ? '' : 's'}). Your timer kept running.
            </p>
            <button className="rounded-md bg-slate-900 px-5 py-2 text-white" onClick={() => setWarning(false)}>Return to test</button>
          </Overlay>
        )}
        {confirmExit && (
          <Overlay key="exit" labelId="ov-exit">
            <h2 id="ov-exit" className="mb-2 text-xl font-bold">Leave the test?</h2>
            <p className="mb-5 text-sm text-slate-600">Your answers are saved. You can resume from <b>My results</b>, but timed modules keep counting down.</p>
            <div className="flex justify-center gap-2">
              <button className="rounded-md border px-5 py-2" onClick={() => setConfirmExit(false)}>Stay</button>
              <button className="rounded-md bg-rose-600 px-5 py-2 text-white" onClick={() => { stopSpeaking(); navigate('/history') }}>Leave</button>
            </div>
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  )
}

function Overlay({ labelId, children }: { labelId: string; children: React.ReactNode }) {
  const ref = useDialogFocus<HTMLDivElement>(true)
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelId} tabIndex={-1} initial={{ scale: 0.92, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-xl bg-white p-6 text-center outline-none text-slate-900 shadow-2xl">
        {children}
      </motion.div>
    </motion.div>
  )
}

function Interlude({ next, onContinue }: { next: ModuleKey; onContinue: () => void }) {
  return (
    <motion.div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white shadow-xl">✓</motion.div>
      <div>
        <h1 className="text-3xl font-bold">Module submitted</h1>
        <p className="mt-2 opacity-70">Take a short breath. Next up: <b>{MODULE_LABEL[next]}</b>.</p>
      </div>
      <button onClick={onContinue} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-6 py-3 font-semibold text-white shadow-lg">
        Continue to {MODULE_LABEL[next]} <ArrowRight size={18} />
      </button>
    </motion.div>
  )
}
