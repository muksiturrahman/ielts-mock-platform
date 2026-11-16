import { describe, expect, it } from 'vitest'
import { parseCsv, questionsFromCsv } from './csv'

describe('csv', () => {
  it('handles quotes, commas and newlines', () => {
    expect(parseCsv('a,"b, c","d ""e"""\n1,2,3')).toEqual([['a', 'b, c', 'd "e"'], ['1', '2', '3']])
    expect(parseCsv('x,"line1\nline2"\r\n')).toEqual([['x', 'line1\nline2']])
  })
  it('builds questions with alternatives and options', () => {
    const qs = questionsFromCsv('number,prompt,answer,options,explanation\n5,"Where?",(the) library|archive,,Para B\n6,Pick,B,"A=one|B=two, three",', 'q')
    expect(qs).toHaveLength(2)
    expect(qs[0]).toMatchObject({ number: 5, prompt: 'Where?', answer: ['(the) library', 'archive'], explanation: 'Para B' })
    expect(qs[1].options).toEqual([{ key: 'A', text: 'one' }, { key: 'B', text: 'two, three' }])
  })
  it('rejects bad rows', () => {
    expect(() => questionsFromCsv('x,prompt,ans', 'q')).toThrow(/question number/)
    expect(() => questionsFromCsv('3,prompt,', 'q')).toThrow(/answer is empty/)
  })
})
