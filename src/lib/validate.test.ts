import { describe, expect, it, vi } from 'vitest'
import { isCompletionCorrect } from './scoring'
import { chartIssue, isTestShape, testIssues } from './validate'
import type { Test } from './types'

// The seed module pulls in the store, which touches browser globals at import time.
vi.hoisted(() => {
  Object.assign(globalThis, { window: { addEventListener() {}, dispatchEvent() {} }, localStorage: { getItem: () => null, setItem() {} } })
})
const { SEED_TESTS } = await import('../data/seed')

describe('built-in tests', () => {
  it.each(SEED_TESTS.map(t => [t.title, t] as const))('%s has no blocking problems', (_title, t) => {
    expect(testIssues(t).blocking).toEqual([])
  })
  it('every accepted alternative fits its word limit', () => {
    const bad: string[] = []
    for (const t of SEED_TESTS) for (const m of ['listening', 'reading'] as const) {
      for (const s of t[m]?.sections ?? []) for (const g of s.groups) {
        if (g.type !== 'completion') continue
        for (const q of g.questions) for (const a of q.answer) {
          // Expand "(the) x" / "a/b" the same way the scorer does, and check each form can score.
          if (!isCompletionCorrect(a.replace(/[()]/g, ''), q.answer, g) && !isCompletionCorrect(a.replace(/\([^)]*\)\s*/g, ''), q.answer, g)) bad.push(`${t.title} ${m} Q${q.number}: "${a}"`)
        }
      }
    }
    expect(bad).toEqual([])
  })
})

describe('testIssues', () => {
  const base = (groups: Test['reading']) => ({ id: 't', title: 'x', variant: 'academic', status: 'draft', createdAt: 0, updatedAt: 0, reading: groups }) as Test
  const sec = (g: object) => ({ sections: [{ id: 's', title: 'P1', passageTitle: '', passage: '', groups: [g] }] }) as unknown as Test['reading']
  it('blocks gaps without questions, answers outside the options and duplicate multi keys', () => {
    expect(testIssues(base(sec({ id: 'g', type: 'completion', instructions: '', content: 'a {{1}} b {{2}}', questions: [{ id: 'q', number: 1, prompt: '', answer: ['x'] }] }))).blocking.join()).toContain('{{2}}')
    expect(testIssues(base(sec({ id: 'g', type: 'tfng', instructions: '', questions: [{ id: 'q', number: 1, prompt: 'p', answer: ['T'] }] }))).blocking.join()).toContain("isn't one of the options")
    expect(testIssues(base(sec({ id: 'g', type: 'mcq_multi', instructions: '', options: [{ key: 'A', text: '' }, { key: 'B', text: '' }], questions: [{ id: 'q1', number: 1, prompt: '', answer: ['B'] }, { id: 'q2', number: 2, prompt: '', answer: ['B'] }] }))).blocking.join()).toContain('different answer letter')
  })
  it('allows a practice pack numbered from 14 and blocks prompt-only gaps under content', () => {
    const q = (n: number) => ({ id: `q${n}`, number: n, prompt: '', answer: ['TRUE'] })
    expect(testIssues(base(sec({ id: 'g', type: 'tfng', instructions: '', questions: [q(14), q(15)] }))).blocking).toEqual([])
    expect(testIssues(base(sec({ id: 'g', type: 'completion', instructions: '', content: 'Notes', questions: [{ id: 'q', number: 1, prompt: 'The {{1}} is open', answer: ['x'] }] }))).blocking.join()).toContain('no {{n}} gap')
  })
})

describe('isTestShape (imports and backups)', () => {
  it('accepts every built-in test', () => {
    expect(SEED_TESTS.every(isTestShape)).toBe(true)
  })
  it('rejects tests the app could not open', () => {
    const base = { id: 'x', title: 'T', variant: 'academic' }
    expect(isTestShape({ ...base, listening: {} })).toBe(false)
    expect(isTestShape({ ...base, reading: { sections: [{ id: 's' }] } })).toBe(false)
    expect(isTestShape({ ...base, writing: { tasks: [{ number: 3, prompt: 'p' }] } })).toBe(false)
    expect(isTestShape({ ...base, speaking: { part1: {}, part2: {}, part3: {} } })).toBe(false)
    expect(isTestShape({ ...base, variant: 'ielts' })).toBe(false)
    const withQ = (q: unknown) => ({ ...base, reading: { sections: [{ id: 's', groups: [{ type: 'completion', questions: [q] }] }] } })
    expect(isTestShape(withQ(null))).toBe(false)
    expect(isTestShape(withQ({}))).toBe(false)
    expect(isTestShape(withQ({ id: 'q', number: 1, answer: 'x' }))).toBe(false)
    expect(isTestShape(base)).toBe(true)
  })
})

describe('round-3 publish checks', () => {
  const base = { id: 't', title: 'T', variant: 'academic' as const, status: 'draft' as const, createdAt: 0, updatedAt: 0 }
  it('blocks a completion key longer than its word limit', () => {
    const t = { ...base, reading: { sections: [{ id: 's', title: 'P1', passage: 'x', groups: [{ id: 'g', type: 'completion' as const, instructions: 'ONE WORD ONLY', maxWords: 1, questions: [{ id: 'q', number: 1, prompt: 'A {{1}}', answer: ['freeze dried'] }] }] }] } }
    expect(testIssues(t as never).blocking.join()).toMatch(/longer than the word limit/)
  })
  it('blocks a malformed chart and rejects it on import', () => {
    const t = { ...base, writing: { tasks: [{ id: 'w', number: 1 as const, prompt: 'Describe', minWords: 150, chart: { kind: 'bar', title: 'x', categories: ['a', 'b'], series: [{ name: 's' }] } }] } }
    expect(testIssues(t as never).blocking.join()).toMatch(/needs 2 values/)
    expect(isTestShape(t)).toBe(false)
  })
})

describe('round-4 chart checks', () => {
  it('rejects duplicate or reserved series names and odd categories', () => {
    const chart = (series: unknown, categories: unknown = ['a', 'b']) => ({ kind: 'bar', title: 't', categories, series })
    expect(chartIssue(chart([{ name: 'x', values: [1, 2] }, { name: 'x', values: [3, 4] }]))).toMatch(/different/)
    expect(chartIssue(chart([{ name: 'name', values: [1, 2] }]))).toMatch(/different/)
    expect(chartIssue(chart([{ name: 'x', values: [1, 2] }], [{}, 'b']))).toMatch(/categories/)
    expect(chartIssue(chart([{ name: 'x', values: [1, null] }]))).toBeUndefined()
  })
})
