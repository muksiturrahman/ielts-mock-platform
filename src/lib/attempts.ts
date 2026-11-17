import { evaluateSpeaking, evaluateWriting } from './ai'
import { computeMetrics } from './speech'
import { criteriaBand, overallBand, scoreObjective, writingBand } from './scoring'
import { getDB, patchAttempt, saveAttempt, uid } from './store'
import type { Attempt, ModuleKey, Test, WritingTaskEval } from './types'

/** Official timings in minutes. Listening = 30 + 2 min checking time (computer-delivered). */
export const MODULE_MINUTES: Record<ModuleKey, number> = { listening: 32, reading: 60, writing: 60, speaking: 14 }

export const MODULE_LABEL: Record<ModuleKey, string> = {
  listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking',
}

export function availableModules(test: Test): ModuleKey[] {
  return (['listening', 'reading', 'writing', 'speaking'] as ModuleKey[]).filter(m => {
    if (m === 'listening') return Boolean(test.listening?.sections.length)
    if (m === 'reading') return Boolean(test.reading?.sections.length)
    if (m === 'writing') return Boolean(test.writing?.tasks.length)
    return Boolean(test.speaking)
  })
}

/** Practice timing scales with the part chosen (e.g. one reading passage = 20 min). */
export function moduleMinutes(test: Test, module: ModuleKey, sections?: number[]): number {
  // Writing time = the tasks actually set (20 + 40 for a full paper, 20 for a Task 1-only pack).
  if (module === 'writing') {
    return (test.writing?.tasks ?? []).filter(t => !sections || sections.includes(t.number)).reduce((s, t) => s + t.minutes, 0) || MODULE_MINUTES.writing
  }
  if (!sections) return MODULE_MINUTES[module]
  if (module === 'reading') return 20 * sections.length
  if (module === 'listening') return 8 * sections.length
  return MODULE_MINUTES[module]
}

export function createAttempt(test: Test, opts: { mode: 'full' | 'practice'; modules: ModuleKey[]; sections?: number[]; timed: boolean }): Attempt {
  const attempt: Attempt = {
    id: uid('att-'),
    testId: test.id,
    testTitle: test.title,
    variant: test.variant,
    mode: opts.mode,
    timed: opts.timed,
    modules: opts.modules,
    sections: opts.sections,
    moduleIndex: 0,
    progress: Object.fromEntries(opts.modules.map(m => [m, { module: m, section: 0 }])),
    status: 'in_progress',
    startedAt: Date.now(),
    answers: {},
    flags: [],
    highlights: {},
    notes: {},
    writing: { task1: '', task2: '' },
    speaking: [],
    scratchpad: '',
    tabSwitches: 0,
    results: {},
  }
  saveAttempt(attempt)
  return attempt
}

export function getAttempt(id: string) {
  return getDB().attempts.find(a => a.id === id)
}
export function getTest(id: string) {
  return getDB().tests.find(t => t.id === id)
}

/** Starts the module clock once (refresh-safe: the deadline is stored, not a countdown). */
export function startModule(attemptId: string, module: ModuleKey) {
  const a = getAttempt(attemptId)
  const test = a && getTest(a.testId)
  if (!a || !test || a.progress[module]?.startedAt) return
  const minutes = moduleMinutes(test, module, a.sections)
  patchAttempt(attemptId, x => ({
    progress: {
      ...x.progress,
      // Listening is paced by the recording; its clock is only the checking time at the end.
      [module]: { ...x.progress[module], startedAt: Date.now(), deadline: x.timed && module !== 'speaking' && module !== 'listening' ? Date.now() + minutes * 60_000 : undefined },
    },
  }))
}

export function submitModule(attemptId: string, module: ModuleKey) {
  const a = getAttempt(attemptId)
  const test = a && getTest(a.testId)
  // Timer and button can fire together: submit (and start paid AI marking) only once.
  if (!a || !test || a.progress[module]?.submittedAt) return
  const results = { ...a.results }
  if (module === 'listening' && test.listening) results.listening = scoreObjective(test.listening.sections, a.answers, 'listening', a.variant, a.sections)
  if (module === 'reading' && test.reading) results.reading = scoreObjective(test.reading.sections, a.answers, 'reading', a.variant, a.sections)
  if (module === 'writing') results.writing = { status: 'pending' }
  if (module === 'speaking') results.speaking = { status: 'pending', metrics: computeMetrics(a.speaking.filter(s => !s.warmup)) }

  const nextIndex = a.modules.indexOf(module) + 1
  const done = nextIndex >= a.modules.length
  patchAttempt(attemptId, x => ({
    results,
    progress: { ...x.progress, [module]: { ...x.progress[module], submittedAt: Date.now() } },
    moduleIndex: Math.max(x.moduleIndex, nextIndex),
    status: done ? 'completed' : x.status,
    finishedAt: done ? Date.now() : x.finishedAt,
  }))
  if (module === 'writing') void markWriting(attemptId)
  if (module === 'speaking') void markSpeaking(attemptId)
}

export async function markWriting(attemptId: string) {
  const a = getAttempt(attemptId)
  const test = a && getTest(a.testId)
  if (!a || !test?.writing || isLive(a.results.writing)) return // already being marked (double click / other tab)
  const prev = a.results.writing
  patchAttempt(attemptId, x => ({ results: { ...x.results, writing: { ...x.results.writing, status: 'marking', heartbeat: Date.now() } } }))
  const tasks = test.writing.tasks.filter(t => !a.sections || a.sections.includes(t.number))
  // Mark tasks independently: one failed task keeps the other's result, and a retry only re-marks what's missing.
  const settled = await withHeartbeat(attemptId, 'writing', () => Promise.allSettled(tasks.map(t => {
    const done = t.number === 1 ? prev?.task1 : prev?.task2
    return done ?? evaluateWriting(t, t.number === 1 ? a.writing.task1 : a.writing.task2, a.variant)
  })))
  const get = (n: number) => {
    const r = settled[tasks.findIndex(t => t.number === n)]
    return r?.status === 'fulfilled' ? r.value : undefined
  }
  const task1 = get(1)
  const task2 = get(2)
  const failed = settled.find((r): r is PromiseRejectedResult => r.status === 'rejected')
  patchAttempt(attemptId, x => ({
    results: {
      ...x.results,
      writing: failed
        ? { status: 'error', task1, task2, error: `${(failed.reason as Error)?.message ?? failed.reason}${task1 || task2 ? ' (the other task was marked — retry to finish).' : ''}` }
        : { status: 'done', task1, task2, band: writingBand(task1?.band, task2?.band) },
    },
  }))
}

export async function markSpeaking(attemptId: string) {
  const a = getAttempt(attemptId)
  if (!a || isLive(a.results.speaking)) return
  const answers = a.speaking.filter(s => !s.warmup) // name/ID questions aren't assessed
  const metrics = computeMetrics(answers)
  if (a.progress.speaking?.skipped) {
    const error = 'Speaking was ended early (no microphone), so it isn\'t marked. Retake the Speaking test with a working microphone.'
    patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { status: 'error', metrics, error } } }))
    return
  }
  if (!answers.some(s => s.transcript.trim())) {
    const error = answers.length
      ? 'No speech was transcribed, so it can\'t be marked. Live transcription needs Chrome or Edge with microphone access — retake the Speaking test there.'
      : 'Speaking was skipped (no microphone), so there is nothing to mark. Retake the Speaking test with a working microphone.'
    patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { status: 'error', metrics, error } } }))
    return
  }
  patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { ...x.results.speaking, metrics, status: 'marking', heartbeat: Date.now() } } }))
  try {
    const r = await withHeartbeat(attemptId, 'speaking', () => evaluateSpeaking(answers, metrics))
    patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { status: 'done', metrics, ...r } } }))
  } catch (e) {
    patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { status: 'error', metrics, error: (e as Error).message } } }))
  }
}

// ---------- marking liveness ----------
// The tab that is marking refreshes a heartbeat; marking with a stale heartbeat was cut off (tab closed).
const HEARTBEAT_MS = 15_000
// Chrome runs timers in long-hidden tabs only once a minute, so allow well over 60s between beats.
const isLive = (r?: { status: string; heartbeat?: number }) => r?.status === 'marking' && Date.now() - (r.heartbeat ?? 0) < HEARTBEAT_MS * 6
const INTERRUPTED = 'Marking was interrupted because the page was closed or reloaded. Retry to mark it.'

async function withHeartbeat<T>(attemptId: string, m: 'writing' | 'speaking', fn: () => Promise<T>): Promise<T> {
  const beat = () => patchAttempt(attemptId, x => (x.results[m] ? { results: { ...x.results, [m]: { ...x.results[m], heartbeat: Date.now() } } } : {}))
  // Reload/close kills the request: record that at once so Retry shows straight away (crashes fall back to the heartbeat).
  const onHide = () => patchAttempt(attemptId, x => (x.results[m]?.status === 'marking' ? { results: { ...x.results, [m]: { ...x.results[m], status: 'error', error: INTERRUPTED } } } : {}))
  const timer = setInterval(beat, HEARTBEAT_MS)
  window.addEventListener('pagehide', onHide)
  try {
    return await fn()
  } finally {
    clearInterval(timer)
    window.removeEventListener('pagehide', onHide)
  }
}

/** Marking that was running when its tab closed can never finish — show it as failed so it can be retried. */
export function recoverInterruptedMarking() {
  for (const a of getDB().attempts) {
    for (const m of ['writing', 'speaking'] as const) {
      if (a.results[m]?.status !== 'marking' || isLive(a.results[m])) continue
      patchAttempt(a.id, x => ({ results: { ...x.results, [m]: { ...x.results[m]!, status: 'error', error: INTERRUPTED } } }))
    }
  }
}

type WritingCriteria = Partial<Record<'task' | 'coherence' | 'lexical' | 'grammar', number>>

/** One Writing task's band: examiner criteria override the AI's, and all four criteria are needed. */
export function writingTaskBand(ai?: WritingTaskEval, override?: WritingCriteria): number | undefined {
  if (!ai && !override) return undefined
  const vals = (['task', 'coherence', 'lexical', 'grammar'] as const).map(k => override?.[k] ?? ai?.criteria[k].band)
  return vals.every(v => typeof v === 'number') ? criteriaBand(vals as number[]) : undefined
}

/** Writing tasks this attempt included (a Task-1-only practice has just [1]). */
export function writingTasksTaken(a: Attempt): (1 | 2)[] {
  const all = getTest(a.testId)?.writing?.tasks.map(t => t.number) ?? [1, 2]
  return all.filter(n => !a.sections || a.sections.includes(n))
}

/** Final module bands, with a human examiner's overrides taking precedence over AI marks. */
export function moduleBands(a: Attempt): Partial<Record<ModuleKey, number>> {
  const out: Partial<Record<ModuleKey, number>> = {}
  if (a.results.listening) out.listening = a.results.listening.band
  if (a.results.reading) out.reading = a.results.reading.band
  const w = a.results.writing
  const rw = a.review?.writing
  const t1 = writingTaskBand(w?.task1, rw?.task1)
  const t2 = writingTaskBand(w?.task2, rw?.task2)
  // Only a full Writing band: one marked task out of two would overstate it (Task 2 counts double).
  if (writingTasksTaken(a).every(n => (n === 1 ? t1 : t2) !== undefined)) {
    const b = writingBand(t1, t2)
    if (b !== undefined) out.writing = b
  }
  const s = a.results.speaking
  const rs = a.review?.speaking
  if (s?.criteria || rs) {
    const keys = ['fluency', 'lexical', 'grammar', 'pronunciation'] as const
    const vals = keys.map(k => rs?.[k] ?? s?.criteria?.[k].band)
    if (vals.every(v => typeof v === 'number')) out.speaking = criteriaBand(vals as number[])
  }
  return out
}

export function attemptOverall(a: Attempt): number | undefined {
  const b = moduleBands(a)
  return overallBand([b.listening, b.reading, b.writing, b.speaking])
}
