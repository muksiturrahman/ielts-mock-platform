import { AnimatePresence, motion } from 'motion/react'
import { Headphones, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { resolveMediaUrl } from '../lib/media'
import { parseScript, playScript, speak, stopSpeaking, ttsSupported } from '../lib/speech'
import { patchAttempt, useDB } from '../lib/store'
import { useToast } from '../components/ui'
import { fmtClock, jumpTo, partNav, QuestionNav, TopBar, useDeadline, useNow } from './ExamChrome'
import type { ModuleProps } from './ExamPage'
import { QuestionGroupView } from './QuestionGroupView'
import { SubmitButton } from './SubmitButton'

const CHECK_MS = 2 * 60_000
/** Before each part the candidate gets time to read its questions, as in the real recording. */
const PREVIEW_SEC = 30

/** Plays one listening part once: uploaded audio if present, otherwise the script via text-to-speech. */
async function playPart(section: { transcript: string; audio?: string; context: string }, opts: { rate: number; getVolume: () => number; signal: AbortSignal; onLine: (i: number) => void; audioEl: HTMLAudioElement; onAudioError?: () => void }) {
  const url = await resolveMediaUrl(section.audio).catch(() => undefined)
  if (url) {
    const el = opts.audioEl
    try {
      el.src = url
      el.volume = opts.getVolume()
      await new Promise<void>((resolve, reject) => {
        el.onended = () => resolve()
        el.onerror = () => reject(el.error)
        opts.signal.addEventListener('abort', () => { el.pause(); resolve() })
        el.play().catch(reject) // corrupt file, or the browser blocked playback (iOS)
      })
      return
    } catch {
      el.pause()
      if (opts.signal.aborted) return
      opts.onAudioError?.()
      // fall through: read the script aloud so the test can continue
    }
  }
  await playScript(parseScript(section.transcript), opts)
}

export default function ListeningModule({ test, attempt, onSubmit, setAnswer, toggleFlag, exitButton }: ModuleProps) {
  const all = test.listening!.sections
  const indexes = attempt.sections ?? all.map((_, i) => i)
  const sections = indexes.map(i => all[i])
  const progress = attempt.progress.listening
  const rate = useDB(d => d.settings.ttsRate)
  const [volume, setVolume] = useState(0.9)
  const volumeRef = useRef(volume)
  volumeRef.current = volume
  const audioRef = useRef<HTMLAudioElement>(null)
  const toast = useToast()

  // progress.section = part whose audio is playing; -1 when all audio has finished.
  const [playing, setPlaying] = useState<number | null>(null)
  const [view, setView] = useState(Math.max(0, progress.section))
  // Listening has no clock while audio plays; the stored deadline is the end of checking time (refresh-safe).
  const checkUntil = progress.section === -1 ? progress.deadline : undefined
  const [previewUntil, setPreviewUntil] = useState<number>()
  const skipPreview = useRef<() => void>(null)
  const [current, setCurrent] = useState<number>()
  const review = Boolean(progress.revealed)
  const now = useNow()
  const abortRef = useRef<AbortController>(null)

  const remaining = useDeadline(checkUntil, onSubmit)

  const previewTime = async (i: number, signal: AbortSignal) => {
    const nums = sections[i].groups.flatMap(g => g.questions.map(q => q.number))
    await speak(`${sections[i].title}. Before you hear the recording, you have ${PREVIEW_SEC} seconds to look at questions ${Math.min(...nums)} to ${Math.max(...nums)}.`, { rate, volume: volumeRef.current })
    if (signal.aborted) return
    setPreviewUntil(Date.now() + PREVIEW_SEC * 1000)
    await new Promise<void>(resolve => {
      const t = setTimeout(resolve, PREVIEW_SEC * 1000)
      const done = () => { clearTimeout(t); resolve() }
      skipPreview.current = done
      signal.addEventListener('abort', done)
    })
    setPreviewUntil(undefined)
  }

  const run = async (from: number) => {
    const ctrl = new AbortController()
    abortRef.current = ctrl
    for (let i = from; i < sections.length; i++) {
      if (ctrl.signal.aborted) return
      patchAttempt(attempt.id, a => ({ progress: { ...a.progress, listening: { ...a.progress.listening, section: i } } }))
      setPlaying(i)
      setView(i)
      // An uploaded recording carries its own "you have some time to look at…" pauses.
      if (!sections[i].audio) await previewTime(i, ctrl.signal)
      if (ctrl.signal.aborted) return
      await playPart(sections[i], { rate, getVolume: () => volumeRef.current, signal: ctrl.signal, onLine: () => {}, audioEl: audioRef.current!,
        onAudioError: () => toast(`The audio for ${sections[i].title} couldn't play, so the recording script is being read aloud instead.`, 'error') })
      if (i < sections.length - 1 && !ctrl.signal.aborted) await speak(`That is the end of ${sections[i].title}.`, { rate, volume: volumeRef.current })
    }
    if (ctrl.signal.aborted) return
    setPlaying(null)
    patchAttempt(attempt.id, a => ({
      progress: { ...a.progress, listening: { ...a.progress.listening, section: -1, deadline: a.timed ? Date.now() + CHECK_MS : undefined } },
    }))
    await speak('That is the end of the listening test. You now have two minutes to check your answers.', { rate, volume: volumeRef.current })
  }

  useEffect(() => () => { abortRef.current?.abort(); stopSpeaking() }, [])
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])

  const started = playing !== null || progress.section === -1
  const interrupted = !started && progress.section > 0
  const parts = sections.map(s => partNav(s.groups, attempt.answers, attempt.flags, s.title))
  const unanswered = parts.flatMap(p => p.numbers).filter(n => !n.answered).length
  const section = sections[view]
  const goTo = (n: number) => {
    const p = parts.findIndex(x => x.numbers.some(y => y.n === n))
    setView(p)
    setCurrent(n)
    setTimeout(() => jumpTo(n), 200)
  }

  return (
    <>
      <audio ref={audioRef} preload="auto" className="hidden" />
      <TopBar title="Listening" remaining={remaining} volume={volume} onVolume={setVolume} right={exitButton} />
      <div className="flex shrink-0 items-center gap-4 border-b px-6 py-2.5 exam-line exam-muted">
        <span className="font-bold">{section.title}</span>
        <span className="text-sm opacity-70">Listen and answer questions {parts[view].numbers[0]?.n}–{parts[view].numbers.at(-1)?.n}.</span>
        <div className="ml-auto flex items-center gap-2 text-sm">
          {previewUntil ? (
            <>
              <span className="font-semibold">Look at the questions · {fmtClock(Math.max(0, previewUntil - now))}</span>
              {attempt.mode === 'practice' && <button onClick={() => skipPreview.current?.()} className="rounded border px-2 py-0.5 text-xs font-semibold exam-line hover:opacity-70">Skip</button>}
            </>
          ) : playing !== null && <><AudioWave /><span className="font-semibold">Playing {sections[playing].title}</span></>}
          {checkUntil && <span className="font-semibold">Checking time · {fmtClock(Math.max(0, checkUntil - now))}</span>}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-thin">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div key="start" className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-blue-500/30" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#1d4ed8] text-white"><Headphones size={42} /></div>
              </div>
              <h2 className="text-2xl font-bold">{interrupted ? 'Recording interrupted' : 'Sound check'}</h2>
              <p className="max-w-md opacity-70">
                {interrupted
                  ? `The audio stopped when the page was reloaded. It will continue from the start of ${sections[progress.section].title}.`
                  : 'Click "Test sound" and adjust the volume slider at the top. When you can hear clearly, start the test — the recording plays once only.'}
              </p>
              {!ttsSupported() && <p className="text-sm text-rose-600">Your browser can't play spoken audio. Use Chrome, Edge or Safari.</p>}
              <div className="flex gap-3">
                <button onClick={() => speak('This is a sound check. Adjust the volume until you can hear clearly.', { rate, volume })} className="flex items-center gap-2 rounded-md border px-4 py-2.5 font-semibold exam-line hover:opacity-70">
                  <Play size={16} /> Test sound
                </button>
                <button onClick={() => void run(Math.max(0, progress.section))} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-5 py-2.5 font-semibold text-white shadow-lg">
                  <Headphones size={16} /> {interrupted ? 'Continue recording' : 'Play recording'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={section.id} className="mx-auto max-w-4xl p-6 md:p-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {section.groups.map(g => (
                <QuestionGroupView key={g.id} group={g} answers={attempt.answers} setAnswer={setAnswer} flags={attempt.flags} toggleFlag={toggleFlag} onFocusQuestion={setCurrent} review={review} />
              ))}
              {attempt.mode === 'practice' && progress.section === -1 && (
                <details className="mt-6 rounded-md border p-4 exam-line">
                  <summary className="cursor-pointer font-semibold">Show transcript</summary>
                  <div className="mt-3 space-y-1.5 text-sm">
                    {parseScript(section.transcript).map((l, i) => <p key={i}><b>{l.speaker}:</b> {l.text}</p>)}
                  </div>
                </details>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <QuestionNav parts={parts} current={view} onPart={setView} onJump={goTo} currentNumber={current}
        action={<>
          {attempt.mode === 'practice' && progress.section === -1 && (
            <>
              <button onClick={() => { stopSpeaking(); void run(0) }} className="flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-2 text-sm font-semibold exam-line hover:opacity-70"><RotateCcw size={14} /> Replay</button>
              <button onClick={() => patchAttempt(attempt.id, a => ({ progress: { ...a.progress, listening: { ...a.progress.listening, revealed: true } } }))} disabled={review} title="Shows the answers and locks yours" className="whitespace-nowrap rounded-md border px-3 py-2 text-sm font-semibold exam-line hover:opacity-70 disabled:opacity-50">{review ? 'Answers shown · locked' : 'Check answers'}</button>
            </>
          )}
          <SubmitButton unanswered={unanswered} onSubmit={() => { abortRef.current?.abort(); stopSpeaking(); onSubmit() }} />
        </>} />
    </>
  )
}

function AudioWave() {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {[0, 1, 2, 3].map(i => (
        <motion.span key={i} className="w-1 rounded bg-current" animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </span>
  )
}
