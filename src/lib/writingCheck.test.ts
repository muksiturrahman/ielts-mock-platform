import { describe, expect, it } from 'vitest'
import { writingChecks } from './writingCheck'

describe('writingChecks', () => {
  it('flags a short, unlinked, informal answer', () => {
    const c = Object.fromEntries(writingChecks("Cars are bad. Cars are noisy. Cars don't help. Cars cars cars.", 250).map(x => [x.label, x.ok]))
    expect(c).toMatchObject({ Length: false, Paragraphs: false, 'Linking words': false, Repetition: false, 'Formal style': false })
  })
  it('passes a well-built essay', () => {
    const p = 'In many countries, the number of private vehicles has risen sharply, and this trend raises serious questions for planners. However, the causes differ from city to city, so solutions must be local.'
    const essay = Array(4).fill(p).map((x, i) => x + ` For example, paragraph ${i} adds evidence. Moreover, transport policy matters. Therefore, governments act. In addition, residents adapt.`).join('\n\n')
    const c = writingChecks(essay, 150)
    expect(c.find(x => x.label === 'Length')!.ok).toBe(true)
    expect(c.find(x => x.label === 'Paragraphs')!.ok).toBe(true)
    expect(c.find(x => x.label === 'Linking words')!.ok).toBe(true)
  })
  it("doesn't call possessive 's a contraction, and skips register for letters", () => {
    expect(writingChecks("The city's buses are cheap.", 10).find(x => x.label === 'Formal style')!.ok).toBe(true)
    expect(writingChecks("It's cheap.", 10).find(x => x.label === 'Formal style')!.ok).toBe(false)
    expect(writingChecks("I'm writing to you.", 10, true).some(x => x.label === 'Formal style')).toBe(false)
  })
})
