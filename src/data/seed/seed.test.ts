import { describe, expect, it, vi } from 'vitest'

// The seed index installs into the store, which touches localStorage — stub it for node.
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} })
vi.stubGlobal('window', { addEventListener: () => {}, dispatchEvent: () => {} })

const { SEED_TESTS } = await import('./index')
const { scoreObjective } = await import('../../lib/scoring')

describe('seed tests', () => {
  for (const test of SEED_TESTS) {
    for (const module of ['listening', 'reading'] as const) {
      const sections = test[module]?.sections
      if (!sections) continue
      it(`${test.title} · ${module}: 40 unique questions with keys`, () => {
        const qs = sections.flatMap(s => s.groups.flatMap(g => g.questions))
        expect(qs.map(q => q.number).sort((a, b) => a - b)).toEqual(Array.from({ length: 40 }, (_, i) => i + 1))
        expect(new Set(qs.map(q => q.id)).size).toBe(40)
        for (const q of qs) expect(q.answer.length, `Q${q.number}`).toBeGreaterThan(0)
        // Every {{n}} placeholder must point at a question in that group.
        for (const g of sections.flatMap(s => s.groups)) {
          for (const m of (g.content ?? '').matchAll(/\{\{(\d+)\}\}/g)) expect(g.questions.some(q => q.number === Number(m[1])), `${g.id} {{${m[1]}}}`).toBe(true)
        }
      })
      it(`${test.title} · ${module}: answer key scores 40/40 (band 9)`, () => {
        const answers: Record<string, string | string[]> = {}
        for (const g of sections.flatMap(s => s.groups)) {
          if (g.type === 'mcq_multi') answers[g.id] = g.questions.map(q => q.answer[0])
          else for (const q of g.questions) answers[q.id] = q.answer[0].replace(/[()]/g, '')
        }
        const r = scoreObjective(sections, answers, module, test.variant)
        const wrong = r.items.filter(i => !i.isCorrect).map(i => `Q${i.number}: "${i.given}"`)
        expect(wrong).toEqual([])
        expect(r.band).toBe(9)
      })
    }
    if (test.writing) {
      it(`${test.title} · writing tasks are complete`, () => {
        for (const t of test.writing!.tasks) {
          expect(t.prompt.length).toBeGreaterThan(40)
          if (t.number === 1 && test.variant === 'academic') expect(t.visualDescription?.length ?? 0).toBeGreaterThan(40)
        }
      })
    }
  }
})
