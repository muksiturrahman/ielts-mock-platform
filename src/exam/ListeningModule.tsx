import { AnimatePresence, motion } from 'motion/react'
import { drillSections } from '../lib/attempts'
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

const checkMin = (paper?: boolean) => (paper ? 10 : 2)
/** Before each part the candidate gets time to read its questions, as in the real recording. */
const PREVIEW_SEC = 30

/** No progress for this long while "playing" = stalled network/decoder: give up on the file. */
const STALL_MS = 20_000
// 0.1 s of silence. Playing it inside the click "unlocks" the audio element on iOS, which otherwise blocks
// play() once the click handler has awaited anything (the IndexedDB lookup). Real samples: an empty WAV may not decode.
let silentUrl = ''
function silentWav() {
  if (silentUrl) return silentUrl
  const n = 800, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf)
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true)
  return (silentUrl = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })))
}

/**
 * Plays one listening part once: uploaded audio if it plays, otherwise the script via text-to-speech.
 * `preview` (the 30 s question time) runs only for the script — real recordings include their own pauses.
 */
/** How many script lines fit in `sec` seconds of speech (~14 characters a second at rate 1). */
function lineAfter(lines: { text: string }[], start: number, sec: number, rate: number): { line: number; left: number } {
  let line = start
  while (line < lines.length && sec > 0) { sec -= lines[line].text.length / (14 * rate) + 0.5; line++ }
  return { line, left: line < lines.length ? 0 : Math.max(0, sec) }
}

async function playPart(
  section: { transcript: string; audio?: string; context: string },
  opts: {
    rate: number; getVolume: () => number; signal: AbortSignal; audioEl: HTMLAudioElement; onAudioError: () => void; preview: () => Promise<void>
    /** Resume point after a refresh (audio seconds / script line); the question preview is not repeated. */
    resumeAt?: { audioPos?: number; scriptLine?: number }
    onProgress: (p: { audioPos?: number; scriptLine?: number }) => void
    /** The audio was paused by something outside the test (headphones unplugged, a call): show a Resume button. */
    onPausedChange: (paused: boolean) => void
  },
): Promise<number> {
  const url = section.audio ? await resolveMediaUrl(section.audio).catch(() => undefined) : undefined
  let heardShare = 0
  // Resuming a part whose script was being read (its audio had failed): stay on the script, even if the file loads now.
  const onScript = opts.resumeAt?.scriptLine !== undefined
  if (url && !onScript) {
    const el = opts.audioEl
    let stallTimer: ReturnType<typeof setInterval> | undefined
    let onVisible: (() => void) | undefined
    try {
      el.src = url
      el.volume = opts.getVolume()
      if (opts.resumeAt?.audioPos) {
        await new Promise<void>(r => {
          if (el.readyState >= 1) return r()
          const t = setTimeout(() => done(), STALL_MS) // a URL that never answers falls through to the stall/error handling
          const done = () => {
            clearTimeout(t)
            el.removeEventListener('loadedmetadata', done); el.removeEventListener('error', done); opts.signal.removeEventListener('abort', done)
            r()
          }
          el.addEventListener('loadedmetadata', done, { once: true })
          el.addEventListener('error', done, { once: true })
          opts.signal.addEventListener('abort', done, { once: true })
        })
        if (opts.signal.aborted) return 0
        // Away for longer than the rest of this recording: it has already finished — the rest carries to the next part.
        if (Number.isFinite(el.duration) && opts.resumeAt.audioPos >= el.duration) return opts.resumeAt.audioPos - el.duration
        el.currentTime = opts.resumeAt.audioPos
      }
      await new Promise<void>((resolve, reject) => {
        let last = Date.now()
        let lastPos = el.currentTime
        let saved = 0
        // Timers freeze while the laptop sleeps or the app is in the background: coming back is not a stall.
        onVisible = () => { if (!document.hidden) last = Date.now() }
        document.addEventListener('visibilitychange', onVisible)
        el.ontimeupdate = () => {
          last = Date.now()
          if (Math.abs(el.currentTime - saved) >= 3) { saved = el.currentTime; opts.onProgress({ audioPos: saved, scriptLine: undefined }) }
        }
        el.onended = () => resolve()
        el.onerror = () => reject(el.error)
        // Paused from outside: try to carry on; if the browser refuses, the candidate gets a Resume button.
        el.onpause = () => { if (!el.ended && !opts.signal.aborted) el.play().then(() => opts.onPausedChange(false), () => opts.onPausedChange(true)) }
        el.onplay = () => { last = Date.now(); opts.onPausedChange(false) }
        opts.signal.addEventListener('abort', () => { el.onpause = null; el.pause(); resolve() })
        // A stall is no progress while playing — a paused recording waits for Resume instead.
        stallTimer = setInterval(() => {
          if (el.currentTime !== lastPos) { lastPos = el.currentTime; last = Date.now() } // playing, even if timeupdate was late
          else if (!el.paused && Date.now() - last > STALL_MS) reject(new Error('stalled'))
        }, 2000)
        el.play().catch(reject) // corrupt file, or the browser blocked playback
      })
      return 0
    } catch {
      el.onpause = null
      // How far the recording got: the script carries on from about there instead of replaying the part.
      if (el.duration > 0 && el.currentTime / el.duration > 0.02) heardShare = el.currentTime / el.duration
      else if (el.duration > 0 && opts.resumeAt?.audioPos) heardShare = Math.min(1, opts.resumeAt.audioPos / el.duration)
      el.pause()
      opts.onPausedChange(false)
      if (opts.signal.aborted) return 0
    } finally {
      clearInterval(stallTimer)
      if (onVisible) document.removeEventListener('visibilitychange', onVisible)
    }
  }
  if (section.audio && !onScript) opts.onAudioError() // file failed, stalled, or is missing from this browser
  const lines = parseScript(section.transcript)
  if (section.audio) opts.onProgress({ audioPos: undefined }) // from here on the script is the position to resume
  // the file never loaded but there was a time position (a carried absence): estimate the line; time past the end carries on
  const estimate = opts.resumeAt?.scriptLine === undefined && !heardShare && opts.resumeAt?.audioPos ? lineAfter(lines, 0, opts.resumeAt.audioPos, opts.rate) : undefined
  const from = opts.resumeAt?.scriptLine
    ?? (heardShare ? Math.floor(lines.length * heardShare) : undefined)
    ?? estimate?.line
  if (from === undefined) await opts.preview()
  if (opts.signal.aborted) return 0
  await playScript(lines, { ...opts, from: from ?? 0, onLine: i => opts.onProgress({ scriptLine: i }) })
  return estimate?.left ?? 0
}

export default function ListeningModule({ test, attempt, onSubmit, setAnswer, toggleFlag, exitButton }: ModuleProps) {
  const all = drillSections(test.listening!.sections, attempt.drill)
  const indexes = attempt.sections ?? all.map((_, i) => i)
  const sections = indexes.map(i => all[i])
  const progress = attempt.progress.listening
  const rate = useDB(d => d.settings.ttsRate)
  const paper = useDB(d => d.settings.paperListening)
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

  const [audioPaused, setAudioPaused] = useState(false)
  const run = async (from: number) => {
    // The start screen fades out for a moment and stays clickable: a second click must not start a second run.
    if (abortRef.current) return
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const el = audioRef.current!
    if (!el.src) { el.src = silentWav(); el.play().then(() => el.pause(), () => {}) } // iOS unlock, inside the click
    if (ttsSupported()) speechSynthesis.speak(new SpeechSynthesisUtterance('')) // and speech, for announcements / the script fallback
    const saved = attempt.progress.listening
    setPlaying(from)
    // Full mock: the real recording never stops. Time spent away is skipped, as if it had kept playing —
    // carried on into the following parts if the absence was longer than the rest of this one.
    let carry = attempt.mode === 'full' && saved.leftAt && saved.section === from ? (Date.now() - saved.leftAt) / 1000 : 0
    const skipScript = (i: number, startLine: number) => {
      const r = lineAfter(parseScript(sections[i].transcript), startLine, carry, rate)
      carry = r.left
      return r.line
    }
    for (let i = from; i < sections.length; i++) {
      if (ctrl.signal.aborted) return
      let resumeAt: { audioPos?: number; scriptLine?: number } | undefined = i === from && saved.section === i ? { audioPos: saved.audioPos, scriptLine: saved.scriptLine } : undefined
      if (carry > 0) {
        // the part's announcement (and, for the read-aloud script, its 30 s preview) went by too
        if (i !== from) carry = Math.max(0, carry - 3 - (sections[i].audio ? 0 : PREVIEW_SEC))
        // A saved script line means the script was being read (audio failed): stay on the script.
        if (sections[i].audio && resumeAt?.scriptLine === undefined) { resumeAt = { audioPos: (resumeAt?.audioPos ?? 0) + carry }; carry = 0 }
        else if (carry > 0) resumeAt = { scriptLine: skipScript(i, resumeAt?.scriptLine ?? 0) }
      }
      patchAttempt(attempt.id, a => ({ progress: { ...a.progress, listening: { ...a.progress.listening, section: i, leftAt: undefined, audioPos: resumeAt?.audioPos, scriptLine: resumeAt?.scriptLine } } }))
      setPlaying(i)
      setView(i)
      carry += await playPart(sections[i], {
        rate, getVolume: () => volumeRef.current, signal: ctrl.signal, audioEl: el, resumeAt,
        onProgress: p => patchAttempt(attempt.id, a => ({ progress: { ...a.progress, listening: { ...a.progress.listening, ...p } } })),
        onPausedChange: setAudioPaused,
        preview: () => previewTime(i, ctrl.signal),
        onAudioError: () => toast(
          sections[i].transcript.trim()
            ? `The audio for ${sections[i].title} couldn't play, so the recording script is being read aloud instead.`
            : `The audio for ${sections[i].title} couldn't play and this part has no script. Ask your teacher to re-upload it.`,
          'error',
        ),
      })
      // Most scripts (and so their recordings) already end with "That is the end of Part …" — don't say it twice.
      const announced = /end of (part|section)/i.test(parseScript(sections[i].transcript).at(-1)?.text ?? '')
      if (i < sections.length - 1 && !ctrl.signal.aborted && !carry && !announced) await speak(`That is the end of ${sections[i].title}.`, { rate, volume: volumeRef.current })
    }
    if (ctrl.signal.aborted) return
    abortRef.current = null // finished: practice Replay may start a new run
    setPlaying(null)
    patchAttempt(attempt.id, a => ({
      progress: { ...a.progress, listening: { ...a.progress.listening, section: -1, audioPos: undefined, scriptLine: undefined, deadline: a.timed ? Date.now() + Math.max(0, checkMin(paper) * 60_000 - carry * 1000) : undefined } }, // time away also ran past the recording
    }))
    await speak(paper ? 'That is the end of the listening test. You now have ten minutes to transfer your answers to the answer sheet.' : 'That is the end of the listening test. You now have two minutes to check your answers.', { rate, volume: volumeRef.current })
  }

  // Remember when the candidate left mid-recording (Exit, refresh, closing the tab) — a full mock skips that time on return.
  useEffect(() => {
    const left = (e?: PageTransitionEvent) => { if (!e?.persisted && abortRef.current) patchAttempt(attempt.id, a => ({ progress: { ...a.progress, listening: { ...a.progress.listening, leftAt: Date.now() } } })) }
    window.addEventListener('pagehide', left)
    return () => { window.removeEventListener('pagehide', left); left(); abortRef.current?.abort(); stopSpeaking() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])
  // While the recording is paused, the candidate's next click or key press (they'll be answering) resumes it.
  useEffect(() => {
    if (!audioPaused) return
    const resume = () => void audioRef.current?.play().catch(() => {})
    document.addEventListener('pointerdown', resume)
    document.addEventListener('keydown', resume)
    return () => { document.removeEventListener('pointerdown', resume); document.removeEventListener('keydown', resume) }
  }, [audioPaused])

  const started = playing !== null || progress.section === -1
  const interrupted = !started && (progress.section > 0 || Boolean(progress.audioPos) || progress.scriptLine !== undefined)
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
      <div className="flex shrink-0 items-center gap-4 gap-3 border-b px-4 py-2.5 exam-line exam-muted sm:px-6">
        <span className="font-bold">{section.title}</span>
        <span className="text-sm opacity-70">Listen and answer questions {parts[view].numbers[0]?.n}–{parts[view].numbers.at(-1)?.n}.</span>
        <div className="ml-auto flex items-center gap-2 text-sm">
          {previewUntil ? (
            <>
              <span className="font-semibold">Look at the questions · {fmtClock(Math.max(0, previewUntil - now))}</span>
              {attempt.mode === 'practice' && <button onClick={() => skipPreview.current?.()} className="rounded border px-2 py-0.5 text-xs font-semibold exam-line hover:opacity-70">Skip</button>}
            </>
          ) : audioPaused ? (
            <button onClick={() => void audioRef.current?.play()} className="rounded-md bg-[#1d4ed8] px-3 py-1 text-xs font-semibold text-white">The recording paused — Resume</button>
          ) : playing !== null && (
            <>
              <AudioWave /><span className="font-semibold">Playing {sections[playing].title}</span>
              {progress.startedAt && <span className="font-mono tabular-nums opacity-70" title="Time since Listening started">{fmtClock(Math.max(0, now - progress.startedAt))}</span>}
            </>
          )}
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
                  ? attempt.mode === 'full'
                    ? `You left during ${sections[progress.section].title}. As in the real test the recording doesn't wait — it continues from where it would be now.`
                    : `The audio stopped when you left or reloaded the page. It will continue from where it stopped in ${sections[progress.section].title}.`
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
