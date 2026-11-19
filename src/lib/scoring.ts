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
  seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60',
  seventy: '70', eighty: '80', ninety: '90',
}
// Ordinals ("fifteenth March", "first floor") become digits on both sides, like "15th" / "1st".
const ORDINALS: Record<string, number> = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
  eleventh: 11, twelfth: 12, thirteenth: 13, fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17,
  eighteenth: 18, nineteenth: 19, twentieth: 20, thirtieth: 30, fortieth: 40, fiftieth: 50, sixtieth: 60,
  seventieth: 70, eightieth: 80, ninetieth: 90,
}
// British ↔ American spellings accepted in IELTS. shortcut: fixed list + -ise/-ize rule, extend when a test needs more.
const LL_STEMS = new Set('travel label model cancel fuel signal level counsel equal total channel tunnel dial panel quarrel marvel jewel'.split(' '))
const SPELLING: Record<string, string> = {
  fibre: 'fiber', calibre: 'caliber', judgement: 'judgment', enrol: 'enroll', dialogue: 'dialog',
  flavour: 'flavor', odour: 'odor', vapour: 'vapor', rumour: 'rumor', armour: 'armor', vigour: 'vigor', endeavour: 'endeavor',
  savoury: 'savory', paediatrician: 'pediatrician', anaesthetic: 'anesthetic', archaeology: 'archeology', encyclopaedia: 'encyclopedia',
  oesophagus: 'esophagus', offence: 'offense', fulfilment: 'fulfillment', skilful: 'skillful', ageing: 'aging', sulphur: 'sulfur',
  yoghurt: 'yogurt', pyjamas: 'pajamas', spectre: 'specter', sombre: 'somber', lustre: 'luster', mum: 'mom',
  analogue: 'analog', sceptical: 'skeptical', manoeuvre: 'maneuver', paediatric: 'pediatric', oestrogen: 'estrogen',
  colour: 'color', favour: 'favor', favourite: 'favorite', centre: 'center', theatre: 'theater', metre: 'meter',
  litre: 'liter', programme: 'program', neighbour: 'neighbor', neighbourhood: 'neighborhood', harbour: 'harbor',
  labour: 'labor', behaviour: 'behavior', honour: 'honor', humour: 'humor', jewellery: 'jewelry', cheque: 'check',
  catalogue: 'catalog', travelling: 'traveling', travelled: 'traveled', cancelled: 'canceled', grey: 'gray',
  aluminium: 'aluminum', defence: 'defense', licence: 'license', practise: 'practice', tyre: 'tire', storey: 'story',
  enrolment: 'enrollment', fulfil: 'fulfill', analyse: 'analyze', paralyse: 'paralyze', mould: 'mold', plough: 'plow',
}
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const TENS = 'twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety'
const TENS_VALUE: Record<string, number> = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 }
const ONES = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const MONTH_RE = MONTHS.join('|')

// Words spelt -ise (UK) or -ize (US). A list, not a rule: "promise", "expertise", "exercise" have no -ize form.
const ISE_STEMS = new Set((
  'agon antagon apolog critic digit item mechan public pasteur oxid moistur author capital categor central character civil colon commercial computer container '
  + 'criminal custom decentral democrat dramat econom emphas energ equal evangel external familiar fantas fertil '
  + 'final fossil general glamor global harmon hospital hypothes ideal immun individual industrial internal italic '
  + 'jeopard legal legitim liberal local magnet material maxim memor mesmer metabol miniatur minim mobil modern '
  + 'monopol motor national natural neutral normal optim organ ostrac patron penal personal polar popular pressur '
  + 'priorit privat radical random rational real recogn regular revolution sanit satir scandal scrutin sensit '
  + 'serial social special spiritual stabil standard steril stigmat strateg subsid summar symbol sympath synchron '
  + 'tempor terror theor trivial tyrann union urban util vandal vapor visual vocal western').split(/\s+/))

function normWord(w: string): string {
  if (NUMBER_WORDS[w]) return NUMBER_WORDS[w]
  if (SPELLING[w]) return SPELLING[w]
  if (w.endsWith('s') && SPELLING[w.slice(0, -1)]) return `${SPELLING[w.slice(0, -1)]}s` // colours, metres
  // Derived forms of listed words: colourful, labourers, flavoured, neighbourly…
  for (const suf of ['ful', 'fully', 'less', 'ers', 'er', 'ing', 'ed', 'ly', 'ian', 'ians', 'ite', 'ites', 'able', 'ism']) {
    const stem = w.slice(0, -suf.length)
    if (w.endsWith(suf) && stem.length > 2 && SPELLING[stem]) return SPELLING[stem] + suf
  }
  const tre = w.match(/^(\w*(?:metre|litre))(s?)$/) // kilometre, centimetre, millilitre…
  if (tre) return `${tre[1].slice(0, -2)}er${tre[2]}`
  const ll = w.match(/^(\w+)ll(ed|ing|er|ers)$/) // travelled, labelling, modeller (UK doubles the l)
  if (ll && LL_STEMS.has(ll[1] + 'l')) return `${ll[1]}l${ll[2]}`
  const ise = w.match(/^(.{3,})is(e|es|ed|ing|ation|ations|er|ers|able)$/)
  if (ise && ISE_STEMS.has(ise[1])) return `${ise[1]}iz${ise[2]}`
  const yse = w.match(/^(anal|paral|catal|electrol|dial)ys(e|es|ed|ing|er|ers)$/)
  if (yse) return `${yse[1]}yz${yse[2]}`
  return w
}

/** Number words → digits: "twenty-five" → 25, "a hundred and fifty" → 150, "one" → 1. */
function numberWords(t: string, ordinals = true): string {
  if (ordinals) t = t.replace(new RegExp(`\\b(${TENS})[-\\s]+(${Object.keys(ORDINALS).slice(0, 9).join('|')})\\b`, 'g'), (_m, a, b) => String(TENS_VALUE[a] + ORDINALS[b]))
  t = t.replace(new RegExp(`\\b(${TENS})[-\\s]+(${ONES.join('|')})\\b`, 'g'), (_m, a, b) => String(TENS_VALUE[a] + ONES.indexOf(b) + 1))
  t = t.replace(/\b[a-z]+\b/g, w => NUMBER_WORDS[w] ?? (ordinals && ORDINALS[w] ? String(ORDINALS[w]) : w))
  // Only the words "hundred"/"thousand" multiply — typed digits like "5 100" stay as written.
  t = t.replace(/\b(a|\d{1,2})\s+hundred(?:\s+and\s+(\d{1,2}))?\b/g, (_m, n, rest) => String((n === 'a' ? 1 : Number(n)) * 100 + Number(rest ?? 0)))
  t = t.replace(/\bhundred\b/g, '100')
  // "two thousand", "a thousand and fifty", "3 thousand 500" → digits
  t = t.replace(/\b(a|\d{1,3})\s+thousand(?:\s+(?:and\s+)?(\d{1,3}))?\b/g, (_m, n, rest) => String((n === 'a' ? 1 : Number(n)) * 1000 + Number(rest ?? 0)))
  return t.replace(/\bthousand\b/g, '1000')
}

export function normalizeAnswer(s: string): string {
  let t = numberWords(s.toLowerCase().trim().replace(/&/g, ' and '))
  // 24-hour clock written with a colon ("15:00") = "3 pm" (not "15.00", which may be a price)
  t = t.replace(/\b(1[3-9]|2[0-3]):(\d{2})\b(?!\s*[ap]\.?m)/g, (_m, h, mm) => `${Number(h) - 12}:${mm} pm`)
  // times: 10am, 10 am, 10.00 am, 10:00am → 10.00 am (but not "2 ambulances")
  t = t.replace(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/g, (_m, h, mm, ap) => `${Number(h)}:${mm ?? '00'} ${ap[0]}m`)
  // dates: "21st march", "march 21", "21 march" → "21 march" (before digit groups are joined, so the year stays separate)
  t = t.replace(/\b(\d{1,2})(st|nd|rd|th)\b/g, '$1')
  t = t.replace(new RegExp(`\\b(\\d{1,2})\\s+of\\s+(${MONTH_RE})\\b`, 'g'), '$1 $2')
  t = t.replace(new RegExp(`\\b(${MONTH_RE})\\s+(?:the\\s+)?(\\d{1,2})\\b`, 'g'), '$2 $1') // "June (the) 1" → "1 june"
  t = t.replace(new RegExp(`\\bthe\\s+(\\d{1,2} (?:${MONTH_RE}))\\b`, 'g'), '$1') // "the 15 march" = "15 march"
  // phone / long numbers written in groups: "07962 551 340" → "07962551340"
  t = t.replace(/(\d)[\s-]+(?=\d{3,})/g, '$1')
  t = t.replace(/[£$€]/g, '').replace(/(\d),(?=\d{3}\b)/g, '$1')
  t = t.replace(/(\d)\s*%/g, '$1 percent').replace(/\bper\s+cent\b/g, 'percent') // 25% = 25 percent = 25 per cent
  // units: "100km" → "100 km"
  t = t.replace(/(\d)([a-z]{2,})\b/g, '$1 $2')
  // "10:30" and "10.30" (times) or "3.50" (prices) all written one way, so either style matches; "09.30" = "9.30"
  t = t.replace(/(\d):(\d{2})\b/g, '$1.$2').replace(/\b0(\d)\.(\d{2})\b/g, '$1.$2')
  // "£75.00" = "75", "3.50" = "3.5", "10.00 am" = "10 am" — the same on both sides, so styles never matter
  t = t.replace(/(\d)\.0+\b/g, '$1').replace(/(\d\.\d*[1-9])0+\b/g, '$1')
  t = t.replace(/[“”"'‘’`]/g, '').replace(/[.,;!?]+$/g, '').replace(/[.,;!?](\s|$)/g, '$1')
  t = t.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
  return t.split(' ').map(normWord).join(' ')
}

/** "(the) library" → ["the library", "library"]; "colour/color", "bus/coach station" → each alternative. */
export function expandAccepted(answer: string): string[] {
  // " / " separates whole answers ("10 am / 10:00"); "a/b" inside a word swaps just that word. Digit slashes (21/3) stay.
  const slashParts = answer.split(/\s+\/\s+/).flatMap(part =>
    part.split(/\s+/).reduce<string[]>((acc, w) => {
      const alts = /^[a-z()'-]+(\/[a-z()'-]+)+$/i.test(w) ? w.split('/') : [w]
      return acc.flatMap(a => alts.map(x => (a ? `${a} ${x}` : x)))
    }, ['']),
  )
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
  // A date ("21 March 2024") or grouped digits ("07962 551 340") count as one number, as in the real test.
  // A number in words is still one number ("one hundred"); ordinal words are words ("first two weeks")
  // except in a date ("fifteenth of March" is one number, like "15 March").
  const ord = `(?:(?:${TENS})[-\\s]+)?(?:${Object.keys(ORDINALS).join('|')})`
  const t = numberWords(s.toLowerCase()
    .replace(new RegExp(`\\b${ord}\\s+(of\\s+)?(${MONTH_RE})\\b`, 'g'), '1 $2') // fifteenth of March
    .replace(new RegExp(`\\b(${MONTH_RE})\\s+(the\\s+)?${ord}\\b`, 'g'), '$1 1') // March (the) fifteenth
    .replace(/\bper\s+cent\b/g, 'percent'), false) // "per cent" is one word, like "%" 
    .replace(new RegExp(`\\b\\d{1,2}(st|nd|rd|th)?\\s+(of\\s+)?(${MONTH_RE})(,?\\s+\\d{4})?\\b`, 'g'), '0')
    .replace(new RegExp(`\\b(${MONTH_RE})\\s+(the\\s+)?\\d{1,2}(st|nd|rd|th)?(,?\\s+\\d{4})?\\b`, 'g'), '0')
    .replace(/(\d)[\s-]+(?=\d{3,})/g, '$1')
  const parts = t.trim().split(/\s+/).filter(Boolean)
  // A token with a digit is a number ("25%", "1st", "BR7", "3B"); a run of them is one ("BR7 4QT" postcode)
  const isNum = (p: string) => /^[£$€]?\d[\d,.:/]*(%|st|nd|rd|th|am|pm)?$/i.test(p) || (/\d/.test(p) && /^[a-z0-9]+$/i.test(p))
  const merged = parts.filter((p, i) => !(isNum(p) && i > 0 && isNum(parts[i - 1]) && /[a-z]/i.test(p + parts[i - 1])))
  const numbers = merged.filter(isNum).length
  return { words: merged.length - numbers, numbers }
}

export function isCompletionCorrect(given: string, accepted: string[], group?: Pick<QuestionGroup, 'maxWords' | 'allowNumber'>): boolean {
  if (!given.trim()) return false
  if (group?.maxWords) {
    const { words, numbers } = wordCount(given)
    // Exceeding the word limit is marked wrong in the real test.
    if (words > group.maxWords || (numbers > 0 && !group.allowNumber && words + numbers > group.maxWords)) return false
    // "A NUMBER" means one — unless the key itself has more (e.g. "9 to 5"), which the candidate can't be blamed for.
    if (numbers > 1 && !accepted.flatMap(expandAccepted).some(k => wordCount(k).numbers > 1)) return false
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
        const keys = group.questions.map(q => (q.answer[0] ?? '').toUpperCase())
        let credit = keys.filter(k => chosen.has(k)).length
        // Each question number earns one mark; answer order doesn't matter.
        group.questions.forEach((q, i) => {
          const ok = credit > 0
          if (ok) credit--
          items.push({
            questionId: q.id, number: q.number, type: group.type, sectionIndex,
            given: i === 0 ? [...chosen].join(', ') : '', correct: keys.join(', '), accepted: [q.answer[0]], isCorrect: ok,
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
        items.push({ questionId: q.id, number: q.number, type: group.type, sectionIndex, given, correct: q.answer[0], accepted: q.answer, isCorrect })
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
