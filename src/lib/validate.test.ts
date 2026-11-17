import { describe, expect, it, vi } from 'vitest'
import { isCompletionCorrect } from './scoring'
import { testIssues } from './validate'
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
})
