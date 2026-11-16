import type { Option, Question } from './types'

/** RFC-4180-ish CSV: quoted fields, escaped quotes (""), commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      if (row.some(f => f.trim())) rows.push(row)
      row = []
    } else field += c
  }
  row.push(field)
  if (row.some(f => f.trim())) rows.push(row)
  return rows
}

export const CSV_HEADER = 'number,prompt,answer,options,explanation'

/**
 * Columns: number, prompt, answer ("|" separates accepted answers), options ("A=text|B=text", mcq only), explanation.
 * A header row is optional.
 */
export function questionsFromCsv(text: string, idPrefix: string): Question[] {
  const rows = parseCsv(text.trim())
  if (rows[0]?.[0]?.toLowerCase() === 'number') rows.shift()
  return rows.map((r, i) => {
    const number = Number(r[0])
    if (!Number.isInteger(number) || number < 1) throw new Error(`Row ${i + 1}: "${r[0]}" is not a question number`)
    if (!r[2]?.trim()) throw new Error(`Row ${i + 1}: answer is empty`)
    const options: Option[] | undefined = r[3]?.trim()
      ? r[3].split('|').map(o => {
          const [key, ...t] = o.split('=')
          return { key: key.trim(), text: t.join('=').trim() }
        })
      : undefined
    return {
      id: `${idPrefix}${number}-${Math.random().toString(36).slice(2, 6)}`,
      number,
      prompt: r[1]?.trim() ?? '',
      answer: r[2].split('|').map(a => a.trim()).filter(Boolean),
      ...(options ? { options } : {}),
      ...(r[4]?.trim() ? { explanation: r[4].trim() } : {}),
    }
  })
}
