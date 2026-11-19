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

// macOS novelty voices and the old robotic ones — never use them for an exam.
const NOVELTY = /bad news|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|fred|junior|ralph|kathy|grandma|grandpa/i

/** Higher = more natural-sounding. Neural/online voices beat local ones; British, then other IELTS accents. */
function voiceQuality(v: SpeechSynthesisVoice): number {
  let q = 0
  if (/natural|neural|premium|enhanced/i.test(v.name)) q += 5
  if (/online|google/i.test(v.name) || !v.localService) q += 2
  if (/GB/i.test(v.lang)) q += 3
  else if (/AU|NZ|IE|CA/i.test(v.lang)) q += 1
  if (/eddy|flo|reed|rocko|sandy|shelley/i.test(v.name)) q -= 3 // Apple's cartoon-ish multilingual set
  if (NOVELTY.test(v.name)) q -= 20
  return q
}

function rankedVoices(): SpeechSynthesisVoice[] {
  return englishVoices().filter(v => !NOVELTY.test(v.name)).sort((a, b) => voiceQuality(b) - voiceQuality(a))
}

/** Stable, distinct voice per speaker; the most natural voices first (IELTS uses a mix of accents). */
function voiceFor(speaker: string, index: number): SpeechSynthesisVoice | undefined {
  const ranked = rankedVoices()
  if (!ranked.length) return undefined
  const pick = speaker === 'NARRATOR' ? 0 : index + 1
  return ranked[pick % ranked.length]
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
    const gen = generation
    const watchdog = setTimeout(() => {
      u.onend = u.onerror = null // cancel() fires end/error on some browsers — that would skip the line after all
      speechSynthesis.cancel()
      // Phones suspend speech when the screen locks or the app is switched: say this line again once the page
      // is visible, instead of skipping it (a listening part would otherwise run on in silence).
      if (!document.hidden) return resolve()
      const back = () => {
        if (document.hidden) return
        document.removeEventListener('visibilitychange', back)
        if (gen !== generation) resolve()
        else void speakOne(text, opts).then(resolve)
      }
      document.addEventListener('visibilitychange', back)
    }, (text.length * 90) / u.rate + 3000)
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

/** Seconds of question-reading time after a script line (mid-part "you have some time to look at questions …"). */
export const READING_PAUSE_SEC = 20
export const isReadingPause = (l: { speaker: string; text: string }, i: number) =>
  i > 0 && l.speaker === 'NARRATOR' && /time to look at|^now look at questions/i.test(l.text) // the opening one has its own preview

/** How many script lines fit in `sec` seconds of speech (~14 characters a second at rate 1). */
export function lineAfter(lines: ScriptLine[], start: number, sec: number, rate: number): { line: number; left: number } {
  let line = start
  while (line < lines.length && sec > 0) { sec -= lines[line].text.length / (14 * rate) + 0.5 + (isReadingPause(lines[line], line) ? READING_PAUSE_SEC : 0); line++ }
  return { line, left: line < lines.length ? 0 : Math.max(0, sec) }
}

/** Plays a whole script once. `getVolume` is read per utterance so the volume slider works mid-play. */
export async function playScript(
  lines: ScriptLine[],
  opts: { rate: number; getVolume: () => number; onLine?: (i: number) => void; signal: AbortSignal; from?: number },
) {
  const speakers = [...new Set(lines.map(l => l.speaker).filter(s => s !== 'NARRATOR'))]
  for (let i = opts.from ?? 0; i < lines.length; i++) {
    if (opts.signal.aborted) return
    opts.onLine?.(i)
    const l = lines[i]
    await speak(l.text, { voice: voiceFor(l.speaker, speakers.indexOf(l.speaker)), rate: opts.rate, volume: opts.getVolume() })
    await new Promise<void>(r => { const t = setTimeout(r, isReadingPause(l, i) ? READING_PAUSE_SEC * 1000 : l.speaker === 'NARRATOR' ? 700 : 250); opts.signal.addEventListener('abort', () => { clearTimeout(t); r() }, { once: true }) })
  }
}

/** The examiner is always the most natural British-leaning voice available. */
export function examinerVoice(): SpeechSynthesisVoice | undefined {
  return rankedVoices()[0]
}

/** A human first name for the examiner, taken from the voice when it has one ("Microsoft Libby Online" → Libby). */
export function examinerName(voice = examinerVoice()): string {
  const first = voice?.name.replace(/^(microsoft|apple)\s+/i, '').split(/[\s(-]/)[0] ?? ''
  return /^[A-Z][a-z]{2,}$/.test(first) && !/^(Google|English|British|United|Samantha)$/.test(first) ? first : 'Alex'
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
  /** Has the candidate said anything yet (mic level above the speech threshold)? */
  hasSpoken(): boolean
  /** How long the candidate has been silent since they last spoke, in ms (0 while speaking or before speaking). */
  silentMs(): number
  /** Restart the silence clock (after a dialog covered the test, the candidate wasn't "silent"). */
  resetSilence(): void
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
    // Permission/device errors won't fix themselves — stop restarting instead of looping.
    recognition.onerror = e => { if (/not-allowed|service-not-allowed|audio-capture/.test(e.error)) active = false }
    // Chrome ends recognition after silence — restart while recording.
    recognition.onend = () => {
      if (active) try { recognition.start() } catch { /* already started */ }
    }
    try { recognition.start() } catch { /* ignore */ }
  }

  return {
    hasSpoken: () => spoke,
    silentMs: () => (spoke && silentSince !== null ? performance.now() - silentSince : 0),
    resetSilence: () => { if (silentSince !== null) silentSince = performance.now() },
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
// Not "like": in transcripts (no commas) "I like reading" can't be told apart from a filler.
const FILLERS = ['um', 'uh', 'erm', 'er', 'ah', 'hmm', 'you know', 'i mean', 'sort of', 'kind of', 'basically', 'actually']

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
