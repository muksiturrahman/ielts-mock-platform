import type { AnswerValue, ObjectiveItem, ObjectiveResult, QuestionGroup, Variant } from './types'

// ---------- Band conversion (raw /40 → band) ----------
// Tables follow the published IELTS conversion ranges; each row = [minimum raw score, band].
const LISTENING: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5],
  [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [3, 2], [2, 1.5], [1, 1],
]
const ACADEMIC_READING: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5],
  [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [3, 2], [2, 1.5], [1, 1],
]
const GENERAL_READING: [number, number][] = [
  [40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5], [23, 5],
  [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5], [4, 2], [2, 1.5], [1, 1],
]

export function rawToBand(raw: number, module: 'listening' | 'reading', variant: Variant, total = 40): number {
  // Practice runs on fewer questions are scaled to /40 so the band stays meaningful.
  const scaled = total === 40 ? raw : Math.round((raw / Math.max(total, 1)) * 40)
  const table = module === 'listening' ? LISTENING : variant === 'academic' ? ACADEMIC_READING : GENERAL_READING
  for (const [min, band] of table) if (scaled >= min) return band
  return 0
}

/** Official overall-band rounding: .25 rounds up to .5, .75 rounds up to the next whole band. */
export function roundBand(mean: number): number {
  const whole = Math.floor(mean)
  const frac = mean - whole
  if (frac < 0.25) return whole
  if (frac < 0.75) return whole + 0.5
  return whole + 1
}

export function overallBand(bands: (number | undefined)[]): number | undefined {
  const got = bands.filter((b): b is number => typeof b === 'number')
  if (got.length !== 4) return undefined
  return roundBand(got.reduce((a, b) => a + b, 0) / 4)
}

/** Criterion average → task/module band, rounded down to the nearest half band (examiner practice). */
export function criteriaBand(scores: number[]): number {
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.floor(mean * 2) / 2
}

/** Writing: Task 2 carries double the weight of Task 1. */
export function writingBand(task1?: number, task2?: number): number | undefined {
  if (task1 === undefined && task2 === undefined) return undefined
  if (task1 === undefined) return task2
  if (task2 === undefined) return task1
  return roundBand((task1 + 2 * task2) / 3)
}

// ---------- Answer normalisation ----------
const NUMBER_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9',
  ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16',
  seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', hundred: '100',
}
// British ↔ American spellings accepted in IELTS. shortcut: fixed list + -ise/-ize rule, extend when a test needs more.
const SPELLING: Record<string, string> = {
  colour: 'color', favour: 'favor', favourite: 'favorite', centre: 'center', theatre: 'theater', metre: 'meter',
  litre: 'liter', programme: 'program', neighbour: 'neighbor', neighbourhood: 'neighborhood', harbour: 'harbor',
  labour: 'labor', behaviour: 'behavior', honour: 'honor', humour: 'humor', jewellery: 'jewelry', cheque: 'check',
  catalogue: 'catalog', travelling: 'traveling', travelled: 'traveled', cancelled: 'canceled', grey: 'gray',
  aluminium: 'aluminum', defence: 'defense', licence: 'license', practise: 'practice', tyre: 'tire', storey: 'story',
  enrolment: 'enrollment', fulfil: 'fulfill', analyse: 'analyze', paralyse: 'paralyze', mould: 'mold', plough: 'plow',
}
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

function normWord(w: string): string {
  if (NUMBER_WORDS[w]) return NUMBER_WORDS[w]
  if (SPELLING[w]) return SPELLING[w]
  const ise = w.match(/^(.{3,})is(e|es|ed|ing|ation|ations)$/)
  if (ise) return `${ise[1]}iz${ise[2]}`
  return w
}

export function normalizeAnswer(s: string): string {
  let t = s.toLowerCase().trim()
  // times: 10am, 10 am, 10.00 am, 10:00am → 10:00 am
  t = t.replace(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?m\.?|p\.?m\.?)/g, (_m, h, mm, ap) => `${Number(h)}:${mm ?? '00'} ${ap[0]}m`)
  // dates: "21st march", "march 21", "21 march" → "21 march"
  t = t.replace(/\b(\d{1,2})(st|nd|rd|th)\b/g, '$1')
  const monthRe = new RegExp(`\\b(${MONTHS.join('|')})\\s+(\\d{1,2})\\b`, 'g')
  t = t.replace(monthRe, '$2 $1')
  t = t.replace(/[£$€]/g, '').replace(/(\d),(\d{3})\b/g, '$1$2')
  t = t.replace(/[“”"'‘’`]/g, '').replace(/[.,;!?]+$/g, '').replace(/[.,;!?](\s|$)/g, '$1')
  t = t.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
  return t.split(' ').map(normWord).join(' ')
}

/** "(the) library" → ["the library", "library"]; "colour/color" → both. */
export function expandAccepted(answer: string): string[] {
  const slashParts = /\s/.test(answer) ? [answer] : answer.split('/') // "colour/color" but not "10 am / 10:00"
  const out = new Set<string>()
  for (const part of slashParts) {
    const optional = [...part.matchAll(/\(([^)]*)\)/g)]
    let variants = [part]
    for (const m of optional) {
      variants = variants.flatMap(v => [v.replace(m[0], m[1]), v.replace(m[0], '')])
    }
    variants.forEach(v => out.add(normalizeAnswer(v)))
  }
  return [...out].filter(Boolean)
}

function wordCount(s: string): { words: number; numbers: number } {
  const parts = s.trim().split(/\s+/).filter(Boolean)
  const numbers = parts.filter(p => /^[£$€]?\d[\d,.:/]*(am|pm)?$/i.test(p)).length
  return { words: parts.length - numbers, numbers }
}

export function isCompletionCorrect(given: string, accepted: string[], group?: Pick<QuestionGroup, 'maxWords' | 'allowNumber'>): boolean {
  if (!given.trim()) return false
  if (group?.maxWords) {
    const { words, numbers } = wordCount(given)
    // Exceeding the word limit is marked wrong in the real test.
    if (words > group.maxWords || (numbers > 0 && !group.allowNumber && words + numbers > group.maxWords)) return false
    if (numbers > 1) return false
  }
  const g = normalizeAnswer(given)
  return accepted.flatMap(expandAccepted).includes(g)
}

// ---------- Section scoring ----------
interface SectionLike {
  groups: QuestionGroup[]
}

export function scoreObjective(
  sections: SectionLike[],
  answers: Record<string, AnswerValue>,
  module: 'listening' | 'reading',
  variant: Variant,
  onlySections?: number[],
): ObjectiveResult {
  const items: ObjectiveItem[] = []
  sections.forEach((section, sectionIndex) => {
    if (onlySections && !onlySections.includes(sectionIndex)) return
    for (const group of section.groups) {
      if (group.type === 'mcq_multi') {
        const chosen = new Set(((answers[group.id] as string[]) ?? []).map(s => s.toUpperCase()))
        const keys = group.questions.map(q => q.answer[0].toUpperCase())
        let credit = keys.filter(k => chosen.has(k)).length
        // Each question number earns one mark; answer order doesn't matter.
        group.questions.forEach((q, i) => {
          const ok = credit > 0
          if (ok) credit--
          items.push({
            questionId: q.id, number: q.number, type: group.type, sectionIndex,
            given: i === 0 ? [...chosen].join(', ') : '', correct: keys.join(', '), isCorrect: ok,
          })
        })
        continue
      }
      for (const q of group.questions) {
        const raw = answers[q.id]
        const given = Array.isArray(raw) ? raw.join(', ') : (raw ?? '')
        const isCorrect =
          group.type === 'completion'
            ? isCompletionCorrect(given, q.answer, group)
            : q.answer.some(a => a.trim().toUpperCase() === given.trim().toUpperCase())
        items.push({ questionId: q.id, number: q.number, type: group.type, sectionIndex, given, correct: q.answer[0], isCorrect })
      }
    }
  })
  items.sort((a, b) => a.number - b.number)
  const raw = items.filter(i => i.isCorrect).length
  const byType: ObjectiveResult['byType'] = {}
  for (const i of items) {
    const k = typeLabel(i.type)
    byType[k] ??= { correct: 0, total: 0 }
    byType[k].total++
    if (i.isCorrect) byType[k].correct++
  }
  return { raw, total: items.length, band: rawToBand(raw, module, variant, items.length), items, byType }
}

export function typeLabel(t: string): string {
  return (
    {
      mcq: 'Multiple choice', mcq_multi: 'Multiple choice (multi)', tfng: 'True / False / Not Given',
      ynng: 'Yes / No / Not Given', matching: 'Matching', completion: 'Completion',
    } as Record<string, string>
  )[t] ?? t
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}
