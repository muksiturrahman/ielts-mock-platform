import { describe, expect, it } from 'vitest'
import { studyPlan } from './plan'

const today = new Date(2026, 10, 2)
const at = (d: number) => new Date(2026, 10, 2 + d)

describe('studyPlan', () => {
  it('gives 7 days with one weekly mock and the weakest skill first', () => {
    const p = studyPlan({ today, examDate: at(60), target: 7, bands: { listening: 7, reading: 6.5, writing: 5.5, speaking: 6 }, weakTypes: [{ module: 'reading', type: 'Matching' }] })
    expect(p.daysLeft).toBe(60)
    expect(p.days).toHaveLength(7)
    expect(p.days.filter(d => d.task.kind === 'mock')).toHaveLength(1)
    expect(p.days[0].task).toEqual({ kind: 'module', module: 'writing' })
    expect(p.days[1].task).toEqual({ kind: 'drill', module: 'reading', type: 'Matching' })
  })
  it('tapers before the exam and stops on exam day', () => {
    const p = studyPlan({ today, examDate: at(3), target: 7, bands: {}, weakTypes: [] })
    expect(p.days.map(d => d.task.kind)).toEqual(['module', 'review', 'rest', 'rest'])
  })
  it('works without an exam date', () => {
    expect(studyPlan({ today, target: 6.5, bands: {}, weakTypes: [] }).days).toHaveLength(7)
  })
})
