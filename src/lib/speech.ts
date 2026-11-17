import type { SpeakingAnswer, SpeakingMetrics } from './types'

// ---------- Text-to-speech (listening scripts without uploaded audio, AI examiner) ----------
let voicesCache: SpeechSynthesisVoice[] = []
function englishVoices(): SpeechSynthesisVoice[] {
  if (!voicesCache.length) voicesCache = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang))
  return voicesCache
}
if (typeof speechSynthesis !== 'undefined') speechSynthesis.onvoiceschanged = () => (voicesCache = [])

export function ttsSupported() {
  return typeof speechSynthesis !== 'undefined'
}

/** Stable, distinct voice per speaker name; British voices first (IELTS uses a mix of accents). */
function voiceFor(speaker: string, index: number): SpeechSynthesisVoice | undefined {
  const all = englishVoices()
  if (!all.length) return undefined
  const preferred = [...all].sort((a, b) => Number(/GB|AU/.test(b.lang)) - Number(/GB|AU/.test(a.lang)))
  const pick = speaker === 'NARRATOR' ? 0 : index + 1
  return preferred[pick % preferred.length]
}

export interface ScriptLine {
  speaker: string
  text: string
}

export function parseScript(transcript: string): ScriptLine[] {
  return transcript
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const m = l.match(/^([A-Z][A-Z .'-]{1,30}):\s*(.*)$/)
      return m ? { speaker: m[1].trim(), text: m[2] } : { speaker: 'NARRATOR', text: l }
    })
}

let generation = 0 // bumped by stopSpeaking so a multi-sentence speak() stops too

function speakOne(text: string, opts: { voice?: SpeechSynthesisVoice; rate?: number; volume?: number }): Promise<void> {
  return new Promise(resolve => {
    const u = new SpeechSynthesisUtterance(text)
    if (opts.voice) u.voice = opts.voice
    u.rate = opts.rate ?? 0.95
    u.volume = opts.volume ?? 1
    // Chrome sometimes drops an utterance without firing onend and then stays "speaking", so later lines
    // queue behind it in silence. After a generous limit, clear the queue and move on.
    const watchdog = setTimeout(() => { speechSynthesis.cancel(); resolve() }, (text.length * 90) / u.rate + 3000)
    const done = () => { clearTimeout(watchdog); resolve() }
    u.onend = done
    u.onerror = done
    speechSynthesis.speak(u)
  })
}

/** Speaks text sentence by sentence: Chrome's online voices cut off any single utterance after ~15 s. */
export async function speak(text: string, opts: { voice?: SpeechSynthesisVoice; rate?: number; volume?: number } = {}): Promise<void> {
  if (!ttsSupported()) return
  const gen = generation
  const chunks = (text.match(/[^.!?]+[.!?]*["')\]]*\s*/g) ?? [text]).reduce<string[]>((acc, c) => {
    if (acc.length && (acc[acc.length - 1] + c).length < 160) acc[acc.length - 1] += c
    else acc.push(c)
    return acc
  }, [])
  for (const c of chunks) {
    if (gen !== generation) return
    if (c.trim()) await speakOne(c.trim(), opts)
  }
}

export function stopSpeaking() {
  generation++
  if (ttsSupported()) speechSynthesis.cancel()
}

/** Plays a whole script once. `getVolume` is read per utterance so the volume slider works mid-play. */
export async function playScript(
  lines: ScriptLine[],
  opts: { rate: number; getVolume: () => number; onLine?: (i: number) => void; signal: AbortSignal },
) {
  const speakers = [...new Set(lines.map(l => l.speaker).filter(s => s !== 'NARRATOR'))]
  for (let i = 0; i < lines.length; i++) {
    if (opts.signal.aborted) return
    opts.onLine?.(i)
    const l = lines[i]
    await speak(l.text, { voice: voiceFor(l.speaker, speakers.indexOf(l.speaker)), rate: opts.rate, volume: opts.getVolume() })
    await new Promise(r => setTimeout(r, l.speaker === 'NARRATOR' ? 700 : 250))
  }
}

export function examinerVoice(): SpeechSynthesisVoice | undefined {
  return voiceFor('EXAMINER', 0)
}

// ---------- Speech recognition (live transcript) ----------
type Recognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}

export function recognitionSupported() {
  const w = window as unknown as Record<string, unknown>
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)
}

function createRecognition(): Recognition | null {
  const w = window as unknown as Record<string, new () => Recognition>
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
  if (!Ctor) return null
  const r = new Ctor()
  r.continuous = true
  r.interimResults = true
  r.lang = 'en-GB'
  return r
}

// ---------- Recorder: MediaRecorder + level meter + pause detection + recognition ----------
export interface RecorderHandle {
  stop(): Promise<{ blob: Blob; transcript: string; durationSec: number; pauses: number[] }>
}

export async function getMicStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
}

/** Live mic level 0..1 for meters; returns a stop function. */
export function watchLevel(stream: MediaStream, onLevel: (level: number) => void): () => void {
  const ctx = new AudioContext()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 1024
  ctx.createMediaStreamSource(stream).connect(analyser)
  const data = new Uint8Array(analyser.fftSize)
  let raf = 0
  const tick = () => {
    analyser.getByteTimeDomainData(data)
    let sum = 0
    for (const v of data) sum += ((v - 128) / 128) ** 2
    onLevel(Math.min(1, Math.sqrt(sum / data.length) * 4))
    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => {
    cancelAnimationFrame(raf)
    ctx.close()
  }
}

export function startRecording(
  stream: MediaStream,
  callbacks: { onLevel?: (l: number) => void; onTranscript?: (text: string) => void },
): RecorderHandle {
  const chunks: Blob[] = []
  const rec = new MediaRecorder(stream)
  rec.ondataavailable = e => e.data.size && chunks.push(e.data)
  rec.start(500)
  const started = performance.now()

  // Silence tracking: a pause = level under threshold for > 1s, counted after the first speech.
  const pauses: number[] = []
  let silentSince: number | null = null
  let spoke = false
  const stopLevel = watchLevel(stream, level => {
    callbacks.onLevel?.(level)
    const now = performance.now()
    if (level > 0.06) {
      if (spoke && silentSince !== null && now - silentSince > 1000) pauses.push((now - silentSince) / 1000)
      spoke = true
      silentSince = null
    } else if (silentSince === null) silentSince = now
  })

  let finalText = ''
  let interim = ''
  let active = true
  const recognition = createRecognition()
  if (recognition) {
    recognition.onresult = e => {
      interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalText += `${r[0].transcript.trim()} `
        else interim += r[0].transcript
      }
      callbacks.onTranscript?.(`${finalText}${interim}`.trim())
    }
    recognition.onerror = () => {}
    // Chrome ends recognition after silence — restart while recording.
    recognition.onend = () => {
      if (active) try { recognition.start() } catch { /* already started */ }
    }
    try { recognition.start() } catch { /* ignore */ }
  }

  return {
    stop: () =>
      new Promise(resolve => {
        active = false
        recognition?.stop()
        stopLevel()
        rec.onstop = () =>
          resolve({
            blob: new Blob(chunks, { type: rec.mimeType || 'audio/webm' }),
            transcript: `${finalText}${interim}`.trim(),
            durationSec: (performance.now() - started) / 1000,
            pauses,
          })
        rec.stop()
      }),
  }
}

// ---------- Fluency metrics ----------
const FILLERS = ['um', 'uh', 'erm', 'er', 'ah', 'hmm', 'like', 'you know', 'i mean', 'sort of', 'kind of', 'basically', 'actually']

export function computeMetrics(answers: SpeakingAnswer[]): SpeakingMetrics {
  const text = answers.map(a => a.transcript).join(' ').toLowerCase()
  const words = text.match(/[a-z']+/g) ?? []
  const total = answers.reduce((s, a) => s + a.durationSec, 0)
  const fillers: Record<string, number> = {}
  for (const f of FILLERS) {
    const n = (text.match(new RegExp(`\\b${f}\\b`, 'g')) ?? []).length
    if (n) fillers[f] = n
  }
  const allPauses = answers.flatMap(a => a.pauses)
  return {
    wordsPerMinute: total ? Math.round((words.length / total) * 60) : 0,
    fillerCount: Object.values(fillers).reduce((a, b) => a + b, 0),
    fillers,
    longPauses: allPauses.length,
    avgPauseSec: allPauses.length ? Math.round((allPauses.reduce((a, b) => a + b, 0) / allPauses.length) * 10) / 10 : 0,
    totalSpeakingSec: Math.round(total),
    uniqueWordRatio: words.length ? Math.round((new Set(words).size / words.length) * 100) / 100 : 0,
  }
}
