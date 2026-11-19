import type { ModuleKey } from './types'

export type PlanTask =
  | { kind: 'mock' } // full timed mock
  | { kind: 'module'; module: ModuleKey } // practise one module
  | { kind: 'drill'; module: 'listening' | 'reading'; type: string }
  | { kind: 'review' } // mistakes + vocabulary review
  | { kind: 'rest' }

export interface PlanDay { date: Date; task: PlanTask }

const DAY = 86_400_000

/**
 * The next 7 days. One full mock a week (more often in the last fortnight, none in the final 2 days),
 * the other days spent on skills furthest below target, a drill for the weakest question type, and review.
 */
export function studyPlan(opts: {
  today: Date
  examDate?: Date
  target: number
  bands: Partial<Record<ModuleKey, number>>
  weakTypes: { module: 'listening' | 'reading'; type: string }[]
}): { daysLeft?: number; days: PlanDay[] } {
  const start = new Date(opts.today.getFullYear(), opts.today.getMonth(), opts.today.getDate())
  const daysLeft = opts.examDate ? Math.round((opts.examDate.getTime() - start.getTime()) / DAY) : undefined
  // Unmeasured skills count as the biggest gap, so they get practised first.
  const gap = (m: ModuleKey) => opts.target - (opts.bands[m] ?? 0)
  const skills = (['listening', 'reading', 'writing', 'speaking'] as ModuleKey[]).sort((a, b) => gap(b) - gap(a))
  const rotation: PlanTask[] = [
    { kind: 'module', module: skills[0] },
    opts.weakTypes[0] ? { kind: 'drill', ...opts.weakTypes[0] } : { kind: 'module', module: skills[1] },
    { kind: 'module', module: skills[1] },
    { kind: 'review' },
    { kind: 'module', module: skills[2] },
    opts.weakTypes[1] ? { kind: 'drill', ...opts.weakTypes[1] } : { kind: 'module', module: skills[0] },
  ]
  const days: PlanDay[] = []
  let r = 0
  for (let i = 0; i < 7; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i) // not +24 h: DST days are 23/25 h
    const left = daysLeft === undefined ? undefined : daysLeft - i
    let task: PlanTask
    if (left !== undefined && left < 0) break
    if (left === 0) task = { kind: 'rest' } // exam day
    else if (left !== undefined && left <= 2) task = left === 1 ? { kind: 'rest' } : { kind: 'review' }
    else if (left !== undefined && left <= 14 ? i % 3 === 2 : i === 5) task = { kind: 'mock' }
    else task = rotation[r++ % rotation.length]
    days.push({ date, task })
  }
  return { daysLeft, days }
}
