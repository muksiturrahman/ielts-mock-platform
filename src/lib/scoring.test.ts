import { describe, expect, it } from 'vitest'
import { criteriaBand, expandAccepted, isCompletionCorrect, normalizeAnswer, overallBand, rawToBand, roundBand, scoreObjective, writingBand } from './scoring'
import type { QuestionGroup } from './types'

describe('band conversion', () => {
  it('listening', () => {
    expect(rawToBand(40, 'listening', 'academic')).toBe(9)
    expect(rawToBand(30, 'listening', 'academic')).toBe(7)
    expect(rawToBand(23, 'listening', 'general')).toBe(6)
    expect(rawToBand(0, 'listening', 'academic')).toBe(0)
  })
  it('academic vs general reading differ', () => {
    expect(rawToBand(30, 'reading', 'academic')).toBe(7)
    expect(rawToBand(30, 'reading', 'general')).toBe(6)
    expect(rawToBand(34, 'reading', 'general')).toBe(7)
  })
  it('scales partial practice sets', () => {
    expect(rawToBand(13, 'reading', 'academic', 13)).toBe(9)
  })
})

describe('overall rounding', () => {
  it('follows official rules', () => {
    expect(roundBand(6.125)).toBe(6)
    expect(roundBand(6.25)).toBe(6.5)
    expect(roundBand(6.625)).toBe(6.5)
    expect(roundBand(6.75)).toBe(7)
    expect(overallBand([6.5, 6.5, 5, 7])).toBe(6.5) // 6.25 → 6.5
    expect(overallBand([4, 3.5, 4, 4])).toBe(4) // 3.875 → 4
    expect(overallBand([6, 6, 6, undefined])).toBeUndefined()
  })
  it('criteria and writing weighting', () => {
    expect(criteriaBand([6, 7, 6, 6])).toBe(6) // 6.25 → down to 6
    expect(criteriaBand([6, 7, 7, 6])).toBe(6.5)
    expect(writingBand(6, 7)).toBe(6.5) // 6.67
    expect(writingBand(undefined, 7)).toBe(7)
  })
})

describe('answer matching', () => {
  it('normalises case, punctuation, spelling, numbers and times', () => {
    expect(normalizeAnswer('Colour')).toBe(normalizeAnswer('color'))
    expect(normalizeAnswer('10 am')).toBe(normalizeAnswer('10:00am'))
    expect(normalizeAnswer('21st March')).toBe(normalizeAnswer('March 21'))
    expect(normalizeAnswer('organise')).toBe(normalizeAnswer('organize'))
    expect(normalizeAnswer('recognised')).toBe(normalizeAnswer('recognized'))
    expect(normalizeAnswer('organisations')).toBe(normalizeAnswer('organizations'))
    // -ise words with no -ize form: a "z" spelling is a misspelling
    expect(normalizeAnswer('privatisation')).toBe(normalizeAnswer('privatization'))
    expect(normalizeAnswer('criticised')).toBe(normalizeAnswer('criticized'))
    expect(normalizeAnswer('recognisable')).toBe(normalizeAnswer('recognizable'))
    expect(normalizeAnswer('analysed')).toBe(normalizeAnswer('analyzed'))
    expect(normalizeAnswer('promize')).not.toBe(normalizeAnswer('promise'))
    expect(normalizeAnswer('exercize')).not.toBe(normalizeAnswer('exercise'))
    expect(normalizeAnswer('expertize')).not.toBe(normalizeAnswer('expertise'))
    expect(normalizeAnswer('three')).toBe('3')
    expect(normalizeAnswer('sixty')).toBe('60')
    expect(normalizeAnswer('ninety-nine')).toBe('99')
    expect(normalizeAnswer('two thousand')).toBe('2000')
    expect(normalizeAnswer('a thousand and fifty')).toBe('1050')
    expect(normalizeAnswer('colors')).toBe(normalizeAnswer('colours'))
    expect(normalizeAnswer('meters')).toBe(normalizeAnswer('metres'))
    expect(normalizeAnswer('15th of March')).toBe(normalizeAnswer('15 March'))
    expect(normalizeAnswer('fifteenth March')).toBe(normalizeAnswer('15 March'))
    expect(normalizeAnswer('twenty-first of May')).toBe(normalizeAnswer('May 21'))
    expect(normalizeAnswer('forty-second street')).toBe(normalizeAnswer('42nd street'))
    expect(normalizeAnswer('thousand')).toBe('1000')
    expect(normalizeAnswer('£1,250')).toBe('1250')
  })
  it('expands optional words and alternatives', () => {
    expect(expandAccepted('(the) library')).toEqual(['the library', 'library'])
    expect(expandAccepted('colour/color')).toEqual(['color'])
  })
  it('applies word limits', () => {
    const g = { maxWords: 2, allowNumber: true }
    expect(isCompletionCorrect('the old library', ['(the) old library'], g)).toBe(false)
    expect(isCompletionCorrect('old library', ['(the) old library'], g)).toBe(true)
    expect(isCompletionCorrect('', ['x'], g)).toBe(false)
    // a date is one number, with or without "of" (the seed Listening Q3 says "the 15th of March")
    expect(isCompletionCorrect('15th of March', ['15 March'], { maxWords: 1, allowNumber: true })).toBe(true)
    // "the" + a date fits ONE WORD AND/OR A NUMBER, and "the" before a date is ignored when matching
    expect(isCompletionCorrect('the 15th of March', ['15 March'], { maxWords: 1, allowNumber: true })).toBe(true)
    expect(isCompletionCorrect('the 15th of March', ['15 March'], { maxWords: 1, allowNumber: false })).toBe(false)
  })
})

describe('section scoring', () => {
  const groups: QuestionGroup[] = [
    { id: 'g1', type: 'completion', instructions: '', maxWords: 2, questions: [{ id: 'q1', number: 1, prompt: '', answer: ['(the) museum'] }] },
    { id: 'g2', type: 'tfng', instructions: '', questions: [{ id: 'q2', number: 2, prompt: '', answer: ['NOT GIVEN'] }] },
    {
      id: 'g3', type: 'mcq_multi', instructions: '', options: [], questions: [
        { id: 'q3', number: 3, prompt: '', answer: ['B'] },
        { id: 'q4', number: 4, prompt: '', answer: ['D'] },
      ],
    },
  ]
  it('scores each type and mcq_multi order-independently', () => {
    const r = scoreObjective([{ groups }], { q1: 'Museum', q2: 'not given', g3: ['D', 'A'] }, 'listening', 'academic')
    expect(r.raw).toBe(3)
    expect(r.total).toBe(4)
    expect(r.items.map(i => i.isCorrect)).toEqual([true, true, true, false])
  })
})

describe('real-test answer forms', () => {
  const oneWordAndOrNumber = { maxWords: 1, allowNumber: true }
  it('phone numbers written in groups', () => {
    expect(isCompletionCorrect('07962 551 340', ['07962551340'], oneWordAndOrNumber)).toBe(true)
  })
  it('a full date counts as one number', () => {
    expect(isCompletionCorrect('21 March 2024', ['21 March 2024'], { maxWords: 2, allowNumber: true })).toBe(true)
    expect(isCompletionCorrect('March 21, 2024', ['21 March 2024'], { maxWords: 2, allowNumber: true })).toBe(true)
  })
  it('compound number words', () => {
    expect(isCompletionCorrect('twenty-five', ['25'], oneWordAndOrNumber)).toBe(true)
    expect(normalizeAnswer('thirty two')).toBe('32')
  })
  it('word-level slash alternatives', () => {
    expect(expandAccepted('bus/coach station')).toEqual(['bus station', 'coach station'])
    expect(isCompletionCorrect('coach station', ['bus/coach station'])).toBe(true)
    expect(expandAccepted('10 am / 10:00')).toContain('10') // ':00' / '.00' dropped on both sides
  })
})

describe('audit round 2 answer forms', () => {
  it('am/pm only as a whole word', () => {
    expect(isCompletionCorrect('two ambulances', ['2 ambulances'])).toBe(true)
    expect(normalizeAnswer('10am')).toBe('10')
  })
  it('millions with several commas', () => {
    expect(isCompletionCorrect('3,000,000', ['3000000'])).toBe(true)
  })
  it('month-first date with a year', () => {
    expect(isCompletionCorrect('March 21 2024', ['21 March 2024'], { maxWords: 2, allowNumber: true })).toBe(true)
  })
  it('hundreds', () => {
    expect(isCompletionCorrect('one hundred', ['100'])).toBe(true)
    expect(isCompletionCorrect('a hundred', ['100'])).toBe(true)
  })
  it('24-hour dot times, units and ampersand', () => {
    expect(isCompletionCorrect('10.30', ['10:30'])).toBe(true)
    expect(isCompletionCorrect('100km', ['100 km'])).toBe(true)
    expect(isCompletionCorrect('bread & butter', ['bread and butter'])).toBe(true)
  })
  it('prices keep working', () => {
    expect(isCompletionCorrect('£4.50', ['4.50'])).toBe(true)
    expect(isCompletionCorrect('£45.00', ['45.00'])).toBe(true)
  })
})

describe('audit round 2 re-check', () => {
  it('number words count as one number for the word limit', () => {
    expect(isCompletionCorrect('one hundred', ['100'], { maxWords: 1, allowNumber: true })).toBe(true)
    expect(isCompletionCorrect('a hundred and fifty', ['150'])).toBe(true)
  })
  it('decimals with units and leading-zero times', () => {
    expect(isCompletionCorrect('3.50km', ['3.50 km'])).toBe(true)
    expect(isCompletionCorrect('09.30', ['9:30'])).toBe(true)
    expect(isCompletionCorrect('£3.50', ['3.50'])).toBe(true)
  })
})

describe('round-3 scoring', () => {
  const g3 = { maxWords: 3, allowNumber: true }
  it('number words and ordinals in a key typed exactly are accepted', () => {
    expect(isCompletionCorrect('first two weeks', ['first two weeks'], g3)).toBe(true)
    expect(isCompletionCorrect('one or two', ['one or two'], g3)).toBe(true)
    expect(isCompletionCorrect('9 to 5', ['9 to 5'], g3)).toBe(true)
    expect(isCompletionCorrect('3 or 4', ['3'], g3)).toBe(false) // two numbers where the key has one
    expect(isCompletionCorrect('fifteenth of March', ['15 March'], { maxWords: 1, allowNumber: true })).toBe(true)
  })
  it('typed digits are not multiplied, only the word hundred', () => {
    expect(normalizeAnswer('5 100')).not.toBe('500')
    expect(normalizeAnswer('two hundred')).toBe('200')
  })
  it('more UK/US spellings and percent forms', () => {
    expect(normalizeAnswer('kilometers')).toBe(normalizeAnswer('kilometres'))
    expect(normalizeAnswer('fibres')).toBe(normalizeAnswer('fibers'))
    expect(normalizeAnswer('labelled')).toBe(normalizeAnswer('labeled'))
    expect(normalizeAnswer('telling')).toBe('telling')
    expect(normalizeAnswer('25%')).toBe(normalizeAnswer('25 per cent'))
    expect(normalizeAnswer('25 percent')).toBe(normalizeAnswer('25 per cent'))
  })
})

describe('round-3 re-audit word limits', () => {
  const one = { maxWords: 1, allowNumber: true }
  it('month-first ordinal dates are one number', () => {
    expect(isCompletionCorrect('March fifteenth', ['15 March'], one)).toBe(true)
    expect(isCompletionCorrect('June the first', ['1 June'], one)).toBe(true)
  })
  it('percent and digit ordinals are numbers', () => {
    expect(isCompletionCorrect('25 per cent', ['25%'], one)).toBe(true)
    expect(isCompletionCorrect('25%', ['25%'], one)).toBe(true)
    expect(isCompletionCorrect('1st floor', ['first floor'], one)).toBe(true)
  })
})

describe('round-4 scoring', () => {
  const one = { maxWords: 1, allowNumber: true }
  it('postcodes and flat numbers are one number', () => {
    expect(isCompletionCorrect('BR7 4QT', ['BR7 4QT'], one)).toBe(true)
    expect(isCompletionCorrect('flat 3B', ['flat 3B'], one)).toBe(true)
  })
  it('more spellings, incl. derived forms', () => {
    expect(normalizeAnswer('flavour')).toBe(normalizeAnswer('flavor'))
    expect(normalizeAnswer('colourful')).toBe(normalizeAnswer('colorful'))
    expect(normalizeAnswer('labourers')).toBe(normalizeAnswer('laborers'))
    expect(normalizeAnswer('offence')).toBe(normalizeAnswer('offense'))
    expect(normalizeAnswer('four')).toBe('4') // -our words outside the list are untouched
  })
  it('dates, times and decimals written different ways', () => {
    expect(isCompletionCorrect('March the 15th', ['15 March'], one)).toBe(true)
    expect(isCompletionCorrect('the 15th of March', ['15 March'], { maxWords: 2, allowNumber: true })).toBe(true)
    expect(normalizeAnswer('15:00')).toBe(normalizeAnswer('3 pm'))
    expect(normalizeAnswer('£75.00')).toBe(normalizeAnswer('75'))
    expect(normalizeAnswer('3.5')).toBe(normalizeAnswer('3.50'))
    expect(normalizeAnswer('10.00 am')).toBe(normalizeAnswer('10am'))
    expect(isCompletionCorrect('15:00', ['15.00'])).toBe(true)
    expect(isCompletionCorrect('15.30', ['15:30'])).toBe(true)
    expect(isCompletionCorrect('3.30 pm', ['15:30'])).toBe(true)
    expect(isCompletionCorrect('12 pm', ['12:00'])).toBe(true)
    expect(isCompletionCorrect('12.30 pm', ['12:30'])).toBe(true)
    expect(normalizeAnswer('13.50')).toBe('13.5') // a price, not a time
    expect(normalizeAnswer('3.0.1')).toBe('3.0.1') // a version number keeps its zeros
    expect(normalizeAnswer('the 1st')).toBe(normalizeAnswer('1st'))
  })
})
