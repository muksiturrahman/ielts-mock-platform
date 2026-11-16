import { evaluateSpeaking, evaluateWriting } from './ai'
import { computeMetrics } from './speech'
import { criteriaBand, overallBand, scoreObjective, writingBand } from './scoring'
import { getDB, patchAttempt, saveAttempt, uid } from './store'
import type { Attempt, ModuleKey, Test } from './types'

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
      [module]: { ...x.progress[module], startedAt: Date.now(), deadline: x.timed && module !== 'speaking' ? Date.now() + minutes * 60_000 : undefined },
    },
  }))
}

export function submitModule(attemptId: string, module: ModuleKey) {
  const a = getAttempt(attemptId)
  const test = a && getTest(a.testId)
  if (!a || !test) return
  const results = { ...a.results }
  if (module === 'listening' && test.listening) results.listening = scoreObjective(test.listening.sections, a.answers, 'listening', a.variant, a.sections)
  if (module === 'reading' && test.reading) results.reading = scoreObjective(test.reading.sections, a.answers, 'reading', a.variant, a.sections)
  if (module === 'writing') results.writing = { status: 'pending' }
  if (module === 'speaking') results.speaking = { status: 'pending', metrics: computeMetrics(a.speaking) }

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
  if (!a || !test?.writing) return
  patchAttempt(attemptId, x => ({ results: { ...x.results, writing: { ...x.results.writing, status: 'marking' } } }))
  try {
    const tasks = test.writing.tasks.filter(t => !a.sections || a.sections.includes(t.number))
    const evals = await Promise.all(tasks.map(t => evaluateWriting(t, t.number === 1 ? a.writing.task1 : a.writing.task2, a.variant)))
    const task1 = evals[tasks.findIndex(t => t.number === 1)]
    const task2 = evals[tasks.findIndex(t => t.number === 2)]
    patchAttempt(attemptId, x => ({
      results: { ...x.results, writing: { status: 'done', task1, task2, band: writingBand(task1?.band, task2?.band) } },
    }))
  } catch (e) {
    patchAttempt(attemptId, x => ({ results: { ...x.results, writing: { status: 'error', error: (e as Error).message } } }))
  }
}

export async function markSpeaking(attemptId: string) {
  const a = getAttempt(attemptId)
  if (!a) return
  const metrics = computeMetrics(a.speaking)
  patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { ...x.results.speaking, metrics, status: 'marking' } } }))
  try {
    const r = await evaluateSpeaking(a.speaking, metrics)
    patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { status: 'done', metrics, ...r } } }))
  } catch (e) {
    patchAttempt(attemptId, x => ({ results: { ...x.results, speaking: { status: 'error', metrics, error: (e as Error).message } } }))
  }
}

/** Final module bands, with a human examiner's overrides taking precedence over AI marks. */
export function moduleBands(a: Attempt): Partial<Record<ModuleKey, number>> {
  const out: Partial<Record<ModuleKey, number>> = {}
  if (a.results.listening) out.listening = a.results.listening.band
  if (a.results.reading) out.reading = a.results.reading.band
  const w = a.results.writing
  const rw = a.review?.writing
  const taskBand = (ai: typeof w extends undefined ? never : NonNullable<typeof w>['task1'], ov?: Partial<Record<'task' | 'coherence' | 'lexical' | 'grammar', number>>) => {
    if (!ai && !ov) return undefined
    const keys = ['task', 'coherence', 'lexical', 'grammar'] as const
    const vals = keys.map(k => ov?.[k] ?? ai?.criteria[k].band)
    return vals.every(v => typeof v === 'number') ? criteriaBand(vals as number[]) : undefined
  }
  if (w?.status === 'done' || rw) {
    const b = writingBand(taskBand(w?.task1, rw?.task1), taskBand(w?.task2, rw?.task2))
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
