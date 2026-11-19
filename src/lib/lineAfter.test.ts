import { describe, expect, it } from 'vitest'
import { lineAfter } from './speech'

describe('lineAfter', () => {
  it('counts the 20 s reading pause after a mid-part "look at questions" line', () => {
    const lines = [
      { speaker: 'NARRATOR', text: 'Part One. First you have some time to look at questions 1 to 5.' },
      { speaker: 'A', text: 'x'.repeat(14) }, // ~1.5 s
      { speaker: 'NARRATOR', text: 'Now look at questions 6 to 10.' }, // ~2.6 s + 20 s pause
      { speaker: 'A', text: 'y'.repeat(14) },
    ]
    // 15 s from line 1: line 1 (1.5 s) then the pause line (22.6 s) — still inside the pause, so resume at line 3, not later.
    expect(lineAfter(lines, 1, 15, 1).line).toBe(3)
    // Without the pause 15 s would have run past the end.
    expect(lineAfter(lines, 1, 40, 1)).toEqual({ line: 4, left: expect.any(Number) })
  })
})
