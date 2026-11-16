import { AnimatePresence, motion } from 'motion/react'
import { Captions, CaptionsOff, Mic, MicOff, Square, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { putMedia } from '../lib/media'
import { examinerVoice, getMicStream, recognitionSupported, speak, startRecording, stopSpeaking, watchLevel, type RecorderHandle } from '../lib/speech'
import { patchAttempt, useDB } from '../lib/store'
import type { SpeakingAnswer } from '../lib/types'
import { fmtClock, TopBar, useNow } from './ExamChrome'
import type { ModuleProps } from './ExamPage'

interface Step {
  part: 1 | 2 | 3
  question: string
  /** Spoken before the question (transitions between parts) */
  lead?: string
  limitSec: number
  cue?: boolean
}

const PREP_SEC = 60

function buildSteps(sp: NonNullable<ModuleProps['test']['speaking']>, name: string): Step[] {
  const steps: Step[] = []
  sp.part1.topics.forEach((t, ti) =>
    t.questions.forEach((q, qi) =>
      steps.push({
        part: 1, question: q, limitSec: 45,
        lead: ti === 0 && qi === 0
          ? `Good morning. My name is Alex and I'll be your examiner today.${name ? '' : ' Could you tell me your full name, please?'} Thank you. In this first part, I'd like to ask you some questions about yourself. Let's talk about ${t.topic.toLowerCase()}.`
          : qi === 0 ? `Now let's talk about ${t.topic.toLowerCase()}.` : undefined,
      }),
    ),
  )
  steps.push({
    part: 2, cue: true, limitSec: 120,
    question: `${sp.part2.topic}`,
    lead: "Now, I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Here is your topic.",
  })
  sp.part2.roundOff.forEach(q => steps.push({ part: 2, question: q, limitSec: 30 }))
  sp.part3.questions.forEach((q, i) =>
    steps.push({
      part: 3, question: q, limitSec: 75,
      lead: i === 0 ? `We've been talking about ${sp.part2.topic.replace(/^Describe /i, '').toLowerCase()}. I'd like to discuss with you some more general questions related to this. Let's consider ${sp.part3.theme.toLowerCase()}.` : undefined,
    }),
  )
  return steps
}

type Phase = 'check' | 'asking' | 'prep' | 'answering' | 'saving' | 'done'

export default function SpeakingModule({ test, attempt, onSubmit, exitButton }: ModuleProps) {
  const profile = useDB(d => d.profile)
  const rate = useDB(d => d.settings.ttsRate)
  const steps = useMemo(() => buildSteps(test.speaking!, profile.name), [test.speaking, profile.name])
  const [index, setIndex] = useState(attempt.speaking.length)
  const [phase, setPhase] = useState<Phase>(attempt.speaking.length >= steps.length ? 'done' : 'check')
  const [stream, setStream] = useState<MediaStream>()
  const [micError, setMicError] = useState('')
  const [level, setLevel] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [captions, setCaptions] = useState(true)
  const [phaseStart, setPhaseStart] = useState(Date.now())
  const [notes, setNotes] = useState(attempt.scratchpad)
  const recRef = useRef<RecorderHandle>(null)
  const now = useNow(250)
  const step = steps[index]

  useEffect(() => () => { stopSpeaking(); stream?.getTracks().forEach(t => t.stop()) }, [stream])

  // Mic check level meter
  useEffect(() => {
    if (phase !== 'check' || !stream) return
    return watchLevel(stream, setLevel)
  }, [phase, stream])

  const enableMic = async () => {
    try {
      setStream(await getMicStream())
      setMicError('')
    } catch {
      setMicError('Microphone access was blocked. Allow it in the browser address bar and try again.')
    }
  }

  const ask = async (i: number) => {
    const s = steps[i]
    if (!s) return finish()
    setIndex(i)
    setTranscript('')
    setPhase('asking')
    const voice = examinerVoice()
    if (s.lead) await speak(s.lead, { voice, rate })
    if (s.cue) {
      setPhase('prep')
      setPhaseStart(Date.now())
      return
    }
    await speak(s.question, { voice, rate })
    beginAnswer()
  }

  const beginAnswer = () => {
    if (!stream) return
    setPhase('answering')
    setPhaseStart(Date.now())
    recRef.current = startRecording(stream, { onLevel: setLevel, onTranscript: setTranscript })
  }

  const endAnswer = async () => {
    const rec = recRef.current
    if (!rec) return
    recRef.current = null
    setPhase('saving')
    const r = await rec.stop()
    const recordingId = await putMedia(r.blob).catch(() => undefined)
    const answer: SpeakingAnswer = {
      part: step.part, question: step.cue ? `${step.question} (${test.speaking!.part2.bullets.join('; ')}; ${test.speaking!.part2.closing})` : step.question,
      transcript: r.transcript, durationSec: r.durationSec, recordingId, pauses: r.pauses, startedAt: phaseStart,
    }
    patchAttempt(attempt.id, a => ({ speaking: [...a.speaking, answer], scratchpad: notes }))
    if (step.cue) await speak('Thank you.', { voice: examinerVoice(), rate })
    void ask(index + 1)
  }

  const finish = () => {
    setPhase('done')
    speak("Thank you. That is the end of the speaking test.", { voice: examinerVoice(), rate })
  }

  // Timers: Part 2 prep (60s) → "please start speaking now"; answer time limits → auto stop.
  const elapsed = (now - phaseStart) / 1000
  useEffect(() => {
    if (phase === 'prep' && elapsed >= PREP_SEC) {
      setPhase('asking')
      void speak('All right? Remember you have one to two minutes for this, so don\'t worry if I stop you. I\'ll tell you when the time is up. Can you start speaking now, please?', { voice: examinerVoice(), rate }).then(beginAnswer)
    }
    if (phase === 'answering' && elapsed >= step.limitSec) void endAnswer()
  }, [elapsed]) // eslint-disable-line react-hooks/exhaustive-deps

  const partTitle = step ? `Part ${step.part}` : 'Complete'
  const limit = step?.limitSec ?? 0

  return (
    <>
      <TopBar title="Speaking" right={exitButton} />
      <div className="flex shrink-0 items-center gap-3 border-b px-6 py-2.5 exam-line exam-muted">
        <span className="font-bold">{partTitle}</span>
        {step && <span className="text-sm opacity-70">Question {index + 1} of {steps.length}</span>}
        <div className="ml-auto h-1.5 w-48 overflow-hidden rounded-full bg-black/10">
          <motion.div className="h-full bg-[#1d4ed8]" animate={{ width: `${(Math.min(index, steps.length) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-thin">
        <AnimatePresence mode="wait">
          {phase === 'check' ? (
            <motion.div key="check" className="mx-auto flex max-w-xl flex-col items-center gap-5 p-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold">Microphone check</h2>
              <p className="opacity-70">Speak normally — the bars should move. Sit in a quiet room and keep the microphone at the same distance throughout.</p>
              <LevelBars level={level} big />
              {micError && <p className="text-sm text-rose-600">{micError}</p>}
              {!recognitionSupported() && <p className="rounded-md border border-amber-400 bg-amber-50 p-3 text-sm text-amber-800">Live transcription isn't available in this browser, so AI feedback will be limited. Chrome or Edge is recommended.</p>}
              {!stream ? (
                <button onClick={enableMic} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-5 py-2.5 font-semibold text-white"><Mic size={18} /> Allow microphone</button>
              ) : (
                <button onClick={() => void ask(index)} className="rounded-md bg-[#1d4ed8] px-6 py-3 font-semibold text-white shadow-lg">{index > 0 ? 'Resume speaking test' : 'Start speaking test'}</button>
              )}
            </motion.div>
          ) : phase === 'done' ? (
            <motion.div key="done" className="flex flex-col items-center gap-4 p-12 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white">✓</div>
              <h2 className="text-2xl font-bold">Speaking test complete</h2>
              <p className="opacity-70">{attempt.speaking.length} answers recorded. Submit to get your band score and feedback.</p>
              <button onClick={() => { stream?.getTracks().forEach(t => t.stop()); onSubmit() }} className="rounded-md bg-[#1d4ed8] px-6 py-3 font-semibold text-white shadow-lg">Submit speaking</button>
            </motion.div>
          ) : (
            <motion.div key={`step-${index}`} className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-[280px_1fr] md:p-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <Examiner talking={phase === 'asking'} />
              <div className="flex flex-col gap-4">
                {step.cue && (phase === 'prep' || phase === 'answering' || phase === 'saving') ? (
                  <div className="rounded-lg border-2 p-5 exam-line">
                    <div className="mb-2 font-bold">{step.question}</div>
                    <div className="mb-1 text-sm opacity-70">You should say:</div>
                    <ul className="ml-5 list-disc space-y-0.5">{test.speaking!.part2.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                    <div className="mt-1">{test.speaking!.part2.closing}</div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-5 exam-line">
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase opacity-60">
                      Examiner
                      <button onClick={() => setCaptions(c => !c)} className="flex items-center gap-1 normal-case hover:opacity-80" title="Show/hide the question text">
                        {captions ? <Captions size={15} /> : <CaptionsOff size={15} />} {captions ? 'Captions on' : 'Captions off'}
                      </button>
                    </div>
                    <p className="text-lg font-medium">{captions ? step.question : '• • •'}</p>
                    <button onClick={() => speak(step.question, { voice: examinerVoice(), rate })} className="mt-2 flex items-center gap-1 text-xs opacity-60 hover:opacity-100"><Volume2 size={13} /> Ask again</button>
                  </div>
                )}

                {phase === 'prep' && (
                  <div className="rounded-lg border p-4 exam-line">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">Preparation time</span>
                      <span className="font-mono text-xl font-bold tabular-nums">{fmtClock(Math.max(0, (PREP_SEC - elapsed) * 1000))}</span>
                    </div>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Make notes here…" spellCheck={false} className="h-36 w-full rounded-md p-3" />
                    <button onClick={() => setPhaseStart(Date.now() - PREP_SEC * 1000)} className="mt-2 text-sm underline opacity-60">I'm ready — start speaking</button>
                  </div>
                )}

                {(phase === 'answering' || phase === 'saving') && (
                  <div className="rounded-lg border p-4 exam-line">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" /><span className="relative inline-flex h-3 w-3 rounded-full bg-rose-600" /></span>
                      <span className="font-semibold">Recording</span>
                      <span className="ml-auto font-mono font-bold tabular-nums">{fmtClock(elapsed * 1000)} / {fmtClock(limit * 1000)}</span>
                    </div>
                    <LevelBars level={level} />
                    <div className="mt-3 min-h-16 rounded-md p-3 text-sm exam-muted">{transcript || <span className="opacity-50">Your words will appear here as you speak…</span>}</div>
                    {step.cue && notes && <details className="mt-2 text-sm"><summary className="cursor-pointer opacity-70">My notes</summary><p className="mt-1 whitespace-pre-line">{notes}</p></details>}
                    <button disabled={phase === 'saving'} onClick={() => void endAnswer()} className="mt-3 flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      <Square size={14} /> {phase === 'saving' ? 'Saving…' : 'Finish answer'}
                    </button>
                  </div>
                )}
                {phase === 'asking' && <p className="flex items-center gap-2 text-sm opacity-60"><MicOff size={15} /> Listen to the examiner — recording starts automatically.</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function LevelBars({ level, big }: { level: number; big?: boolean }) {
  const bars = big ? 24 : 32
  return (
    <div className={`flex w-full items-end justify-center gap-1 ${big ? 'h-20' : 'h-10'}`} aria-label="Microphone level">
      {Array.from({ length: bars }, (_, i) => {
        const center = 1 - Math.abs(i - bars / 2) / (bars / 2)
        const h = Math.max(0.08, Math.min(1, level * (0.6 + center) * 1.6))
        return <motion.span key={i} className="w-1.5 rounded-full bg-[#1d4ed8]" animate={{ height: `${h * 100}%` }} transition={{ duration: 0.08 }} />
      })}
    </div>
  )
}

function Examiner({ talking }: { talking: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border p-6 exam-line">
      <div className="relative">
        {talking && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-blue-500/30" />}
        <motion.div animate={talking ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ duration: 0.8, repeat: talking ? Infinity : 0 }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-4xl font-bold text-white shadow-xl">
          A
        </motion.div>
      </div>
      <div className="text-center">
        <div className="font-semibold">Alex</div>
        <div className="text-xs opacity-60">IELTS Examiner (AI)</div>
      </div>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-60">{talking ? 'Speaking…' : 'Listening'}</div>
    </div>
  )
}
