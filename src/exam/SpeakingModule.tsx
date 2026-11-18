import { AnimatePresence, motion } from 'motion/react'
import { Captions, CaptionsOff, Mic, MicOff, Square, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { putMedia } from '../lib/media'
import { examinerName, examinerVoice, getMicStream, recognitionSupported, speak, startRecording, stopSpeaking, watchLevel, type RecorderHandle } from '../lib/speech'
import { patchAttempt, useDB } from '../lib/store'
import type { SpeakingAnswer } from '../lib/types'
import { fmtClock, TopBar, useNow } from './ExamChrome'
import type { ModuleProps } from './ExamPage'

interface Step {
  part: 1 | 2 | 3
  question: string
  /** Spoken before the question (transitions between parts) */
  lead?: string
  /** Short acknowledgement of the previous answer ("Right.") when there's no lead */
  ack?: string
  limitSec: number
  /** The examiner moves on after this much silence once the candidate has spoken */
  silenceSec: number
  /** …but not before this many seconds (Part 2 must run at least a minute) */
  minSec?: number
  cue?: boolean
  /** Name/origin questions at the start — part of the routine, not assessed */
  warmup?: boolean
}

const PREP_SEC = 60
// Real examiners mostly go straight to the next question, sometimes with a short acknowledgement.
const ACKS = ['', 'Right.', '', 'OK.', 'Thank you.', '', 'I see.']

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

/** The official routine: ID check → Part 1 topics → Part 2 long turn → Part 3 discussion. */
function buildSteps(sp: NonNullable<ModuleProps['test']['speaking']>): Step[] {
  const steps: Step[] = [
    { part: 1, warmup: true, limitSec: 15, silenceSec: 1.5, lead: `${greeting()}. My name is {examiner}, and I'll be your examiner today.`, question: 'Can you tell me your full name, please?' },
    { part: 1, warmup: true, limitSec: 10, silenceSec: 1.5, ack: 'Thank you.', question: 'And what can I call you?' },
    { part: 1, warmup: true, limitSec: 15, silenceSec: 1.5, question: 'And can you tell me where you\'re from?' },
  ]
  let n = 0
  sp.part1.topics.forEach((t, ti) =>
    t.questions.forEach((q, qi) =>
      steps.push({
        part: 1, question: q, limitSec: 40, silenceSec: 2.5, ack: ACKS[n++ % ACKS.length],
        lead: ti === 0 && qi === 0
          ? `Thank you. Now, in this first part of the test, I'd like to ask you some questions about yourself. Let's talk about ${t.topic.toLowerCase()}.`
          : qi === 0 ? `${ti % 2 ? 'Now' : 'Let\'s move on to'} talk about ${t.topic.toLowerCase()}.`.replace('Now talk', 'Now let\'s talk') : undefined,
      }),
    ),
  )
  const topic = sp.part2.topic.replace(/^Describe/i, 'describe')
  steps.push({
    part: 2, cue: true, limitSec: 120, silenceSec: 5, minSec: 60,
    question: sp.part2.topic,
    lead: `Now, I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Here's some paper and a pencil for making notes, and here's your topic. I'd like you to ${topic}`,
  })
  sp.part2.roundOff.forEach(q => steps.push({ part: 2, question: q, limitSec: 30, silenceSec: 2.5 }))
  sp.part3.questions.forEach((q, i) =>
    steps.push({
      part: 3, question: q, limitSec: 75, silenceSec: 3.5, ack: ACKS[(i + 3) % ACKS.length],
      lead: i === 0 ? `Thank you. We've been talking about ${sp.part2.topic.replace(/^Describe /i, '').toLowerCase()}, and I'd like to discuss with you one or two more general questions related to this. Let's consider, first of all, ${sp.part3.theme.toLowerCase()}.` : undefined,
    }),
  )
  return steps
}

const pause = (ms: number) => new Promise(r => setTimeout(r, ms))

type Phase = 'check' | 'asking' | 'prep' | 'answering' | 'saving' | 'done'

export default function SpeakingModule({ test, attempt, onSubmit, exitButton, paused }: ModuleProps) {
  const rate = useDB(d => d.settings.ttsRate)
  // Voices load asynchronously, so the examiner's voice (and name) is fixed when the test starts.
  const [voice, setVoice] = useState<SpeechSynthesisVoice>()
  const examiner = examinerName(voice)
  const steps = useMemo(() => buildSteps(test.speaking!), [test.speaking])
  // Full mock = exam conditions: no question captions, timer or live transcript on screen (toggleable for access).
  const examMode = attempt.mode === 'full'
  const [showWords, setShowWords] = useState(!examMode)
  const [repeated, setRepeated] = useState(false)
  const pendingAck = useRef('')
  const [index, setIndex] = useState(attempt.speaking.length)
  const [phase, setPhase] = useState<Phase>(attempt.speaking.length >= steps.length ? 'done' : 'check')
  const [stream, setStream] = useState<MediaStream>()
  const [micError, setMicError] = useState('')
  const [level, setLevel] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [captions, setCaptions] = useState(!examMode)
  const [phaseStart, setPhaseStart] = useState(Date.now())
  const [notes, setNotes] = useState(attempt.scratchpad)
  const recRef = useRef<RecorderHandle>(null)
  const streamRef = useRef(stream)
  streamRef.current = stream
  const startedRef = useRef(false)
  const [saving, setSaving] = useState(false) // an answer is still being stored: Resume would ask the same question twice
  // Bumped when the mic is lost: async steps from before it (an ask() chain, a save) must not carry on.
  const genRef = useRef(0)
  const live = (gen: number) => alive.current && gen === genRef.current
  const now = useNow(250)
  const step = steps[index]

  useEffect(() => () => { stream?.getTracks().forEach(t => t.stop()) }, [stream])
  // Leaving mid-test: stop the examiner, the recording and recognition, and stop any pending ask() chain.
  const alive = useRef(true)
  const notesRef = useRef(notes)
  notesRef.current = notes
  useEffect(() => {
    alive.current = true // StrictMode re-runs effects: mount → cleanup → mount
    return () => {
      alive.current = false
      stopSpeaking()
      void recRef.current?.stop()
      recRef.current = null
      patchAttempt(attempt.id, a => (a.scratchpad === notesRef.current ? {} : { scratchpad: notesRef.current }))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Part 2 notes survive a refresh or exit.
  useEffect(() => {
    if (notes === attempt.scratchpad) return
    const t = setTimeout(() => patchAttempt(attempt.id, { scratchpad: notes }), 800)
    const flush = () => patchAttempt(attempt.id, { scratchpad: notesRef.current })
    window.addEventListener('pagehide', flush)
    return () => { clearTimeout(t); window.removeEventListener('pagehide', flush) }
  }, [notes]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const ask = async (i: number, v = voice) => {
    const gen = genRef.current
    if (!live(gen)) return
    const s = steps[i]
    if (!s) return finish()
    setIndex(i)
    setTranscript('')
    setRepeated(false)
    setPhase('asking')
    // A cut-off answer gets "Thank you."; otherwise the step's own acknowledgement — never both before a lead.
    const ack = pendingAck.current || (s.lead ? '' : s.ack ?? '')
    pendingAck.current = ''
    if (ack && !s.lead?.startsWith(ack)) { await speak(ack, { voice: v, rate }); await pause(350) }
    if (!live(gen)) return
    // Refreshed during the Part 2 minute: the topic card is on screen already and the minute keeps counting.
    const prep = attempt.progress.speaking?.prep
    if (s.cue && prep?.step === i) {
      setPhase('prep')
      setPhaseStart(prep.at)
      return
    }
    if (s.lead) { await speak(s.lead.replace('{examiner}', examinerName(v)), { voice: v, rate }); await pause(400) }
    if (!live(gen)) return
    if (s.cue) {
      const at = Date.now()
      patchAttempt(attempt.id, a => ({ progress: { ...a.progress, speaking: { ...a.progress.speaking, prep: { step: i, at } } } }))
      setPhase('prep')
      setPhaseStart(at)
      return
    }
    await speak(s.question, { voice: v, rate })
    if (live(gen)) beginAnswer()
  }

  const start = () => {
    if (startedRef.current) return // the check screen fades out and stays clickable for a moment
    startedRef.current = true
    const v = examinerVoice()
    setVoice(v)
    void ask(index, v)
  }

  /** Headset unplugged or permission revoked mid-test: back to the mic check; the same question is asked again. */
  const micLost = () => {
    genRef.current++
    stopSpeaking()
    const rec = recRef.current
    recRef.current = null
    void rec?.stop().catch(() => {})
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = undefined // before the re-render, so nothing records on the dead track
    setStream(undefined)
    startedRef.current = false
    setMicError('Your microphone stopped working. Reconnect it and allow it again to carry on from this question.')
    setPhase('check')
  }

  const beginAnswer = () => {
    const s = streamRef.current
    if (!s || !alive.current) return
    try {
      recRef.current = startRecording(s, { onLevel: setLevel, onTranscript: setTranscript })
    } catch {
      return micLost()
    }
    setPhase('answering')
    setPhaseStart(Date.now())
  }

  useEffect(() => {
    if (!stream) return
    const track = stream.getAudioTracks()[0]
    const lost = () => { if (alive.current && startedRef.current) micLost() } // not after finish(): startedRef is cleared there
    track?.addEventListener('ended', lost)
    return () => track?.removeEventListener('ended', lost)
  }, [stream]) // eslint-disable-line react-hooks/exhaustive-deps

  /** "Could you repeat the question?" — once per question, before the candidate has started answering. */
  const repeatQuestion = async () => {
    const rec = recRef.current
    if (!rec || repeated) return
    recRef.current = null
    setRepeated(true)
    setPhase('asking')
    await rec.stop() // discard: it only holds the candidate asking for the repeat
    await speak(step.question, { voice, rate })
    beginAnswer()
  }

  const endAnswer = async (interrupted = false) => {
    const rec = recRef.current
    if (!rec) return
    const gen = genRef.current
    recRef.current = null
    setPhase('saving')
    setSaving(true)
    const r = await rec.stop()
    const recordingId = await putMedia(r.blob).catch(() => undefined)
    const answer: SpeakingAnswer = {
      part: step.part, question: step.cue ? `${step.question} (${test.speaking!.part2.bullets.join('; ')}; ${test.speaking!.part2.closing})` : step.question,
      transcript: r.transcript, durationSec: r.durationSec, recordingId, pauses: r.pauses, startedAt: phaseStart,
      ...(step.warmup ? { warmup: true } : {}),
    }
    patchAttempt(attempt.id, a => ({ speaking: [...a.speaking, answer], scratchpad: notes }))
    // Examiners stop a long answer politely; Part 2 always ends with "Thank you."
    if (interrupted || step.cue) pendingAck.current = 'Thank you.'
    setSaving(false)
    // Mic lost while saving: resume at the next question — or simply end if that was the last one.
    if (gen !== genRef.current) return index + 1 >= steps.length ? finish() : setIndex(index + 1)
    void ask(index + 1)
  }

  const finish = () => {
    if (!alive.current) return
    startedRef.current = false // a mic unplugged after the end must not reopen the mic check
    setPhase('done')
    speak('Thank you. That is the end of the speaking test.', { voice, rate })
  }

  // While a dialog covers the test the clocks stop: on close, the answer / prep time it took is given back.
  const pausedAt = useRef<number>(undefined)
  useEffect(() => {
    if (paused) { pausedAt.current = Date.now(); return }
    if (pausedAt.current === undefined) return
    const away = Date.now() - pausedAt.current
    pausedAt.current = undefined
    if (phase !== 'answering' && phase !== 'prep') return
    setPhaseStart(s => s + away)
    recRef.current?.resetSilence()
    if (phase === 'prep') patchAttempt(attempt.id, a => {
      const prep = a.progress.speaking?.prep
      return prep ? { progress: { ...a.progress, speaking: { ...a.progress.speaking, prep: { ...prep, at: prep.at + away } } } } : {}
    })
  }, [paused]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timers: Part 2 prep (60s) → "please start speaking now"; answer time limits → auto stop.
  const elapsed = (now - phaseStart) / 1000
  useEffect(() => {
    if (paused) return // a dialog is open: the examiner waits
    if (phase === 'prep' && elapsed >= PREP_SEC) {
      setPhase('asking')
      const gen = genRef.current
      void speak('All right? Remember you have one to two minutes for this, so don\'t worry if I stop you. I\'ll tell you when the time is up. Can you start speaking now, please?', { voice, rate }).then(() => live(gen) && beginAnswer())
    }
    if (phase !== 'answering' || !recRef.current) return
    if (elapsed >= step.limitSec) return void endAnswer(true)
    // Turn-taking: when the candidate stops talking, the examiner moves on, as in the real test.
    if (elapsed >= (step.minSec ?? 3) && recRef.current.silentMs() >= step.silenceSec * 1000) void endAnswer()
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
              <p className="text-sm opacity-60">Use headphones if you can, so the examiner's voice isn't picked up by your microphone. Like the real test, the examiner moves on when you finish speaking.</p>
              <LevelBars level={level} big />
              {micError && (
                <div className="space-y-2 text-sm">
                  <p className="text-rose-600">{micError}</p>
                  {/* Without a mic the module can't be done — let the candidate finish the rest of the test. */}
                  <button onClick={() => {
                    if (!confirm('Skip the Speaking test? It will have no score, so this attempt won\'t get an overall band.')) return
                    patchAttempt(attempt.id, a => ({ progress: { ...a.progress, speaking: { ...a.progress.speaking, skipped: true } } }))
                    onSubmit()
                  }} className="underline opacity-70 hover:opacity-100">
                    Skip Speaking and finish the test
                  </button>
                </div>
              )}
              {!recognitionSupported() && <p className="rounded-md border border-amber-400 bg-amber-50 p-3 text-sm text-amber-800">Live transcription isn't available in this browser, so AI feedback will be limited. Chrome or Edge is recommended.</p>}
              {!stream ? (
                <button onClick={enableMic} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-5 py-2.5 font-semibold text-white"><Mic size={18} /> Allow microphone</button>
              ) : (
                <button onClick={start} disabled={saving} className="rounded-md bg-[#1d4ed8] px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-50">{index > 0 ? 'Resume speaking test' : 'Start speaking test'}</button>
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
              <Examiner talking={phase === 'asking'} name={examiner} />
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
                      {/* No clock in front of the candidate in the real test; Part 2 shows one so they can pace the long turn. */}
                      {(!examMode || step.cue) && <span className="ml-auto font-mono font-bold tabular-nums">{fmtClock(elapsed * 1000)} / {fmtClock(limit * 1000)}</span>}
                    </div>
                    <LevelBars level={level} />
                    {showWords && <div className="mt-3 min-h-16 rounded-md p-3 text-sm exam-muted">{transcript || <span className="opacity-50">Your words will appear here as you speak…</span>}</div>}
                    {step.cue && notes && <details className="mt-2 text-sm"><summary className="cursor-pointer opacity-70">My notes</summary><p className="mt-1 whitespace-pre-line">{notes}</p></details>}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button disabled={phase === 'saving'} onClick={() => void endAnswer()} className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                        <Square size={14} /> {phase === 'saving' ? 'Saving…' : "I've finished"}
                      </button>
                      {phase === 'answering' && !repeated && !step.cue && !recRef.current?.hasSpoken() && (
                        <button onClick={() => void repeatQuestion()} className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100"><Volume2 size={14} /> Could you repeat the question?</button>
                      )}
                      <button onClick={() => setShowWords(w => !w)} className="ml-auto text-xs opacity-60 hover:opacity-100">{showWords ? 'Hide my words' : 'Show my words'}</button>
                    </div>
                    {phase === 'answering' && <p className="mt-2 text-xs opacity-50">The examiner moves on when you stop speaking.</p>}
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

function Examiner({ talking, name }: { talking: boolean; name: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border p-6 exam-line">
      <div className="relative">
        {talking && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-blue-500/30" />}
        <motion.div animate={talking ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ duration: 0.8, repeat: talking ? Infinity : 0 }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-4xl font-bold text-white shadow-xl">
          {name[0]}
        </motion.div>
      </div>
      <div className="text-center">
        <div className="font-semibold">{name}</div>
        <div className="text-xs opacity-60">IELTS Examiner (AI)</div>
      </div>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-60">{talking ? 'Speaking…' : 'Listening'}</div>
    </div>
  )
}
