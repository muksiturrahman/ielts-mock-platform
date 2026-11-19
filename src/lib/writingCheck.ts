import { countWords } from './scoring'

export interface Check { ok: boolean; label: string; detail: string }

const LINKERS = ['however', 'moreover', 'furthermore', 'in addition', 'therefore', 'consequently', 'as a result', 'on the other hand',
  'in contrast', 'whereas', 'while', 'although', 'despite', 'for example', 'for instance', 'such as', 'in conclusion', 'overall',
  'firstly', 'secondly', 'finally', 'similarly', 'nevertheless', 'thus', 'hence', 'in particular', 'by contrast', 'meanwhile']
const STOP = new Set('the a an and or but of to in on at for with by from as is are was were be been it this that these those there their they them i we you he she his her its our your my not no so than then also more most can could will would should may might do does did has have had which who what when where why how very much many such into over about between each other some any all only just own same too up out if'.split(' '))
const CONTRACTION = /\b\w+['’](t|s|re|ve|ll|d|m)\b/gi // straight or curly (phones/Macs type ’)

/** Rule-based feedback that needs no AI: length, paragraphs, linking, repetition, sentences, register. */
export function writingChecks(text: string, minWords: number, letter = false): Check[] {
  const words = countWords(text)
  const paras = text.split(/\n+/).filter(p => p.trim()).length // most people press Enter once between paragraphs
  const lower = text.toLowerCase()
  const linkers = LINKERS.filter(l => new RegExp(`\\b${l}\\b`).test(lower))
  const freq = new Map<string, number>()
  for (const w of lower.match(/[a-z']+/g) ?? []) if (w.length > 3 && !STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1)
  const overused = [...freq].filter(([, n]) => n >= Math.max(4, words / 40)).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter(s => s.trim().split(/\s+/).length > 2)
  const avg = sentences.length ? words / sentences.length : 0
  const contractions = letter ? [] : [...new Set(text.match(CONTRACTION) ?? [])].filter(c => !/['’]s$/i.test(c) || /^(it|that|there|here|what|who|he|she|let)['’]s$/i.test(c)) // other 's is usually possessive
  return [
    { ok: words >= minWords, label: 'Length', detail: words >= minWords ? `${words} words — meets the ${minWords}-word minimum.` : `${words} words — under ${minWords} loses marks for task achievement.` },
    { ok: paras >= (minWords >= 250 ? 4 : 3), label: 'Paragraphs', detail: `${paras} paragraph${paras === 1 ? '' : 's'}. ${minWords >= 250 ? 'Aim for 4–5: introduction, 2–3 body paragraphs, conclusion.' : 'Aim for 3–4, with a clear overview or purpose.'}` },
    { ok: linkers.length >= 4, label: 'Linking words', detail: linkers.length ? `${linkers.length} different: ${linkers.slice(0, 8).join(', ')}.${linkers.length < 4 ? ' Use a wider range to connect ideas.' : ''}` : 'None found — use linking words (however, as a result, for example) to connect ideas.' },
    { ok: !overused.length, label: 'Repetition', detail: overused.length ? `Repeated a lot: ${overused.map(([w, n]) => `“${w}” ×${n}`).join(', ')}. Use synonyms or pronouns.` : 'No word is overused.' },
    { ok: avg >= 12 && avg <= 28, label: 'Sentence length', detail: `About ${Math.round(avg)} words per sentence. ${avg < 12 ? 'Combine short sentences with relative clauses or linkers to show range.' : avg > 28 ? 'Some sentences may be too long — split them for clarity.' : 'A good mix for clarity and range.'}` },
    ...(letter ? [] : [{ ok: !contractions.length, label: 'Formal style', detail: contractions.length ? `Contractions found (${contractions.slice(0, 5).join(', ')}). Write them in full in academic writing.` : 'No contractions — appropriately formal.' }]),
  ]
}
