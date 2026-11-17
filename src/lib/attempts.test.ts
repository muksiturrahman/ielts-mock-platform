import { describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  Object.assign(globalThis, { window: { addEventListener() {}, dispatchEvent() {} }, localStorage: { getItem: () => null, setItem() {} } })
})
const { moduleBands, writingTaskBand } = await import('./attempts')
import type { Attempt, WritingTaskEval } from './types'

const ev = (b: number) => ({ band: b, criteria: { task: { band: b }, coherence: { band: b }, lexical: { band: b }, grammar: { band: b } } }) as unknown as WritingTaskEval
const attempt = (results: Attempt['results'], review?: Attempt['review']) => ({ testId: 'missing', results, review }) as unknown as Attempt

describe('writing bands', () => {
  it('gives no Writing band while one of two tasks is unmarked', () => {
    expect(moduleBands(attempt({ writing: { status: 'error', task1: ev(7) } })).writing).toBeUndefined()
  })
  it('lets examiner marks complete the missing task', () => {
    const review = { examiner: 'x', at: 1, feedback: '', writing: { task2: { task: 5, coherence: 5, lexical: 5, grammar: 5 } } }
    expect(moduleBands(attempt({ writing: { status: 'error', task1: ev(7) } }, review)).writing).toBe(5.5) // (7 + 2×5) / 3
  })
  it('task band uses examiner criteria over AI ones', () => {
    expect(writingTaskBand(ev(6), { task: 8, coherence: 8 })).toBe(7)
  })
})
