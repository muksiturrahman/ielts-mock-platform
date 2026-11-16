import { attemptOverall, moduleBands } from './attempts'
import type { Attempt, ModuleKey } from './types'

export interface Weakness {
  area: string
  detail: string
  score: number // 0..1 accuracy, or band/9
  module: ModuleKey
}

/** Points for the progress chart, oldest first. */
export function progressSeries(attempts: Attempt[]) {
  return attempts
    .filter(a => a.status === 'completed')
    .sort((a, b) => (a.finishedAt ?? 0) - (b.finishedAt ?? 0))
    .map(a => ({ date: new Date(a.finishedAt ?? a.startedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), ...moduleBands(a), overall: attemptOverall(a) }))
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined)

export function skillAverages(attempts: Attempt[]): Partial<Record<ModuleKey, number>> {
  const out: Partial<Record<ModuleKey, number>> = {}
  for (const m of ['listening', 'reading', 'writing', 'speaking'] as ModuleKey[]) {
    const v = mean(attempts.map(a => moduleBands(a)[m]).filter((x): x is number => typeof x === 'number'))
    if (v !== undefined) out[m] = Math.round(v * 2) / 2
  }
  return out
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
      if (v.t >= 3 && v.c / v.t < 0.6) out.push({ area: `${k} (${module})`, detail: `${Math.round((v.c / v.t) * 100)}% accuracy over ${v.t} questions`, score: v.c / v.t, module })
    }
  }
  const crit: Record<string, number[]> = {}
  const labels: Record<string, string> = {
    task: 'Task Achievement / Response', coherence: 'Coherence & Cohesion', lexical: 'Lexical Resource', grammar: 'Grammatical Range & Accuracy',
    fluency: 'Fluency & Coherence', 'speaking-lexical': 'Lexical Resource (speaking)', 'speaking-grammar': 'Grammar (speaking)', pronunciation: 'Pronunciation',
  }
  for (const a of attempts) {
    for (const t of [a.results.writing?.task1, a.results.writing?.task2]) {
      if (!t) continue
      for (const [k, v] of Object.entries(t.criteria)) (crit[k] ??= []).push(v.band)
    }
    const s = a.results.speaking?.criteria
    if (s) {
      ;(crit.fluency ??= []).push(s.fluency.band)
      ;(crit['speaking-lexical'] ??= []).push(s.lexical.band)
      ;(crit['speaking-grammar'] ??= []).push(s.grammar.band)
      ;(crit.pronunciation ??= []).push(s.pronunciation.band)
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
