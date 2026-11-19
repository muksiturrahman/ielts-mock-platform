import { attemptOverall, moduleBands } from './attempts'
import { availableModules, createAttempt } from './attempts'
import { typeLabel } from './scoring'
import type { Attempt, ModuleKey, Test } from './types'

export interface Weakness {
  area: string
  detail: string
  score: number // 0..1 accuracy, or band/9
  module: ModuleKey
  /** Question type label, for Listening/Reading weaknesses. */
  type?: string
}

/** Points for the progress chart, oldest first. */
export function progressSeries(attempts: Attempt[]) {
  return attempts
    .filter(a => a.status === 'completed')
    .sort((a, b) => (a.finishedAt ?? 0) - (b.finishedAt ?? 0))
    .map(a => ({ date: new Date(a.finishedAt ?? a.startedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), ...moduleBands(a), overall: attemptOverall(a) }))
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined)

export interface SkillBand {
  band: number
  /** 'full' = average of full mocks; 'practice' = no full mock yet, so an estimate from practice runs. */
  source: 'full' | 'practice'
}

/**
 * Skill bands from the last 5 full mocks. Practice runs (one passage, untimed, answers checkable) score
 * easier, so they only count when there's no full-mock result for that skill yet.
 */
export function skillAverages(attempts: Attempt[]): Partial<Record<ModuleKey, SkillBand>> {
  const out: Partial<Record<ModuleKey, SkillBand>> = {}
  const recent = [...attempts].sort((a, b) => (b.finishedAt ?? b.startedAt) - (a.finishedAt ?? a.startedAt))
  for (const m of ['listening', 'reading', 'writing', 'speaking'] as ModuleKey[]) {
    // A one-type drill isn't a band estimate.
    const bands = (mode: Attempt['mode']) => recent.filter(a => a.mode === mode && !a.drill).map(a => moduleBands(a)[m]).filter((x): x is number => typeof x === 'number').slice(0, 5)
    const full = bands('full')
    const source = full.length ? 'full' : 'practice'
    const v = mean(full.length ? full : bands('practice'))
    if (v !== undefined) out[m] = { band: Math.round(v * 2) / 2, source }
  }
  return out
}

/** The test part with the most questions of a type — or, for Writing/Speaking, a test not yet practised. */
export function practiceTarget(tests: Test[], attempts: Attempt[], w: Weakness): { test: Test; sections?: number[] } | undefined {
  const usable = tests.filter(t => t.status === 'published' && !t.deleted && availableModules(t).includes(w.module))
  if (w.module === 'listening' || w.module === 'reading') {
    // Rotate: the least-drilled part with this type, then the one with the most such questions.
    const drilled = (testId: string, i: number) => attempts.filter(a => a.testId === testId && a.drill === w.type && a.sections?.[0] === i).length
    let best: { test: Test; sections: number[]; n: number; used: number } | undefined
    for (const test of usable) {
      test[w.module]!.sections.forEach((s, i) => {
        const n = s.groups.filter(g => typeLabel(g.type) === w.type).reduce((c, g) => c + g.questions.length, 0)
        const used = drilled(test.id, i)
        if (n && (!best || used < best.used || (used === best.used && n > best.n))) best = { test, sections: [i], n, used }
      })
    }
    return best
  }
  const used = new Set(attempts.filter(a => a.modules.includes(w.module)).map(a => a.testId))
  const test = usable.find(t => !used.has(t.id)) ?? usable[0]
  if (!test) return undefined
  // Writing: practise the task the criterion hurts most — Task 2 carries double weight.
  return { test, sections: w.module === 'writing' ? [test.writing!.tasks.some(t => t.number === 2) ? 2 : 1] : undefined }
}

/** Starts an untimed drill of one question type on the part that has been drilled least. */
export function startDrill(tests: Test[], attempts: Attempt[], module: 'listening' | 'reading', type: string) {
  const t = practiceTarget(tests, attempts, { area: type, detail: '', score: 0, module, type })
  return t && createAttempt(t.test, { mode: 'practice', modules: [module], sections: t.sections, timed: false, drill: type })
}

/** Question types under 60% accuracy and rubric criteria averaging below 6, worst first. */
export function weaknesses(attempts: Attempt[]): Weakness[] {
  const out: Weakness[] = []
  for (const module of ['listening', 'reading'] as const) {
    const agg: Record<string, { c: number; t: number }> = {}
    for (const a of attempts) {
      for (const [k, v] of Object.entries(a.results[module]?.byType ?? {})) {
        agg[k] ??= { c: 0, t: 0 }
        agg[k].c += v.correct
        agg[k].t += v.total
      }
    }
    for (const [k, v] of Object.entries(agg)) {
      if (v.t >= 3 && v.c / v.t < 0.6) out.push({ area: `${k} (${module})`, detail: `${Math.round((v.c / v.t) * 100)}% accuracy over ${v.t} questions`, score: v.c / v.t, module, type: k })
    }
  }
  const crit: Record<string, number[]> = {}
  const labels: Record<string, string> = {
    task: 'Task Achievement / Response', coherence: 'Coherence & Cohesion', lexical: 'Lexical Resource', grammar: 'Grammatical Range & Accuracy',
    fluency: 'Fluency & Coherence', 'speaking-lexical': 'Lexical Resource (speaking)', 'speaking-grammar': 'Grammar (speaking)', pronunciation: 'Pronunciation',
  }
  for (const a of attempts) {
    // Examiner marks take precedence over the AI's, as in the bands themselves.
    for (const n of ['task1', 'task2'] as const) {
      const ai = a.results.writing?.[n]
      const ov = a.review?.writing?.[n]
      for (const k of ['task', 'coherence', 'lexical', 'grammar'] as const) {
        const b = ov?.[k] ?? ai?.criteria[k].band
        if (b !== undefined) (crit[k] ??= []).push(b)
      }
    }
    const s = a.results.speaking?.criteria
    const rs = a.review?.speaking
    for (const [k, key] of [['fluency', 'fluency'], ['lexical', 'speaking-lexical'], ['grammar', 'speaking-grammar'], ['pronunciation', 'pronunciation']] as const) {
      const b = rs?.[k] ?? s?.[k].band
      if (b !== undefined) (crit[key] ??= []).push(b)
    }
  }
  for (const [k, v] of Object.entries(crit)) {
    const m = mean(v)!
    if (m < 6.5) {
      out.push({
        area: labels[k], detail: `averaging band ${m.toFixed(1)}`, score: m / 9,
        module: ['fluency', 'speaking-lexical', 'speaking-grammar', 'pronunciation'].includes(k) ? 'speaking' : 'writing',
      })
    }
  }
  return out.sort((a, b) => a.score - b.score).slice(0, 6)
}
