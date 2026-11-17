import { describe, expect, it, vi } from 'vitest'

// analytics → attempts → store touches browser globals at import time.
vi.hoisted(() => {
  Object.assign(globalThis, { window: { addEventListener() {}, dispatchEvent() {} }, localStorage: { getItem: () => null, setItem() {} } })
})
import { practiceTarget, skillAverages } from './analytics'
import type { Attempt, Test } from './types'

const att = (mode: Attempt['mode'], raw: number, at: number) => ({
  id: `a${at}`, testId: 't', mode, modules: ['reading'], status: 'completed', startedAt: at, finishedAt: at,
  results: { reading: { raw, total: 40, band: raw >= 30 ? 7 : 5, items: [], byType: {} } },
}) as unknown as Attempt

describe('skillAverages', () => {
  it('uses full mocks and ignores practice when a full mock exists', () => {
    expect(skillAverages([att('full', 10, 1), att('practice', 35, 2)]).reading).toEqual({ band: 5, source: 'full' })
  })
  it('falls back to practice as an estimate', () => {
    expect(skillAverages([att('practice', 35, 2)]).reading).toEqual({ band: 7, source: 'practice' })
  })
})

describe('practiceTarget', () => {
  const g = (type: string, n: number) => ({ id: type + n, type, instructions: '', questions: Array.from({ length: n }, (_, i) => ({ id: `${type}${n}${i}`, number: i, prompt: '', answer: ['x'] })) })
  const test = {
    id: 't', status: 'published', reading: { sections: [{ groups: [g('tfng', 2)] }, { groups: [g('tfng', 6), g('mcq', 1)] }] },
  } as unknown as Test
  it('picks the part with the most questions of the weak type', () => {
    expect(practiceTarget([test], [], { area: '', detail: '', score: 0, module: 'reading', type: 'True / False / Not Given' })?.sections).toEqual([1])
  })
})
