import type { QuestionGroup, Test } from './types'

export interface TestIssues {
  /** Problems that break the exam or its scoring — publishing is blocked. */
  blocking: string[]
  /** Worth knowing, but the test still works (e.g. a short practice pack). */
  warnings: string[]
}

const FIXED_KEYS: Partial<Record<QuestionGroup['type'], string[]>> = {
  tfng: ['TRUE', 'FALSE', 'NOT GIVEN'],
  ynng: ['YES', 'NO', 'NOT GIVEN'],
}

function groupIssues(g: QuestionGroup, where: string): string[] {
  const out: string[] = []
  if (!g.questions.length) return [`${where}: a question group has no questions`]
  const slots = [...(g.content ?? '').matchAll(/\{\{(\d+)\}\}/g)].map(m => Number(m[1]))
  const nums = g.questions.map(q => q.number)
  if (g.content && (g.type === 'mcq' || g.type === 'tfng' || g.type === 'ynng')) {
    out.push(`${where} Q${nums[0]}: ${g.type.toUpperCase()} groups can't have Content — it hides the answer options`)
  }
  if (g.content && (g.type === 'completion' || g.type === 'matching')) {
    // With content, only the content is shown — gaps in question prompts never appear.
    const noSlot = nums.filter(n => !slots.includes(n))
    if (noSlot.length) out.push(`${where}: Q${noSlot.join(', Q')} ${noSlot.length > 1 ? 'have' : 'has'} no {{n}} gap in the content, so ${noSlot.length > 1 ? 'they' : 'it'} can't be answered`)
    const orphan = slots.filter(n => !nums.includes(n))
    if (orphan.length) out.push(`${where}: gap {{${orphan.join('}}, {{')}}} has no matching question`)
  }
  const optionKeys =
    g.type === 'mcq' ? undefined : g.type === 'matching' || g.type === 'mcq_multi' ? (g.options ?? []).map(o => o.key.toUpperCase()) : FIXED_KEYS[g.type]
  for (const q of g.questions) {
    if (!Number.isInteger(q.number) || q.number < 1) out.push(`${where}: a question has no valid number`)
    if (!q.answer.length || !q.answer.some(a => a.trim())) { out.push(`${where} Q${q.number}: no answer key`); continue }
    const keys = g.type === 'mcq' ? (q.options ?? []).map(o => o.key.toUpperCase()) : optionKeys
    if (keys) {
      const bad = q.answer.filter(a => !keys.includes(a.trim().toUpperCase()))
      if (bad.length) out.push(`${where} Q${q.number}: answer "${bad.join('", "')}" isn't one of the options (${keys.join(', ') || 'none'})`)
    }
  }
  if (g.type === 'mcq_multi') {
    const k = g.questions.map(q => (q.answer[0] ?? '').toUpperCase())
    if (new Set(k).size !== k.length) out.push(`${where} Q${nums.join('–')}: each question of a "choose N" group needs a different answer letter`)
  }
  return out
}

/** Everything that would break a test for students. Shared by the editor, the Admin publish toggle and the store. */
export function testIssues(t: Test): TestIssues {
  const blocking: string[] = []
  const warnings: string[] = []
  for (const [m, secs] of [['Listening', t.listening?.sections], ['Reading', t.reading?.sections]] as const) {
    if (!secs?.length) continue
    secs.forEach(s => s.groups.forEach(g => blocking.push(...groupIssues(g, m))))
    const nums = secs.flatMap(s => s.groups.flatMap(g => g.questions.map(q => q.number)))
    const dup = nums.filter((n, i) => nums.indexOf(n) !== i)
    if (dup.length) blocking.push(`${m}: duplicate question numbers ${[...new Set(dup)].join(', ')}`)
    // Practice packs may start at Q14; only gaps inside the range are worth a look (scoring still works).
    const min = Math.min(...nums)
    const missing = nums.length ? Array.from({ length: Math.max(...nums) - min + 1 }, (_, i) => i + min).filter(n => !nums.includes(n)) : []
    if (missing.length) warnings.push(`${m}: missing question numbers ${missing.join(', ')}`)
    if (nums.length && nums.length !== 40) warnings.push(`${m}: ${nums.length} questions (a full test has 40)`)
  }
  const taskNums = (t.writing?.tasks ?? []).map(w => w.number)
  if (new Set(taskNums).size !== taskNums.length) blocking.push('Writing: two tasks have the same task number')
  return { blocking: [...new Set(blocking)], warnings }
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const arrayOf = (x: unknown, ok: (v: Record<string, unknown>) => boolean) => Array.isArray(x) && x.every(v => isObj(v) && ok(v))

/** Structure check for tests from a file (import or backup): everything the app reads without optional chaining. */
export function isTestShape(t: unknown): t is Test {
  if (!isObj(t) || typeof t.id !== 'string' || typeof t.title !== 'string' || (t.variant !== 'academic' && t.variant !== 'general')) return false
  const question = (q: Record<string, unknown>) => typeof q.id === 'string' && typeof q.number === 'number'
    && Array.isArray(q.answer) && q.answer.every(a => typeof a === 'string') && (q.options === undefined || Array.isArray(q.options))
  const group = (g: Record<string, unknown>) => typeof g.type === 'string' && arrayOf(g.questions, question) && (g.options === undefined || Array.isArray(g.options))
  const sectioned = (m: unknown) => m === undefined || (isObj(m) && arrayOf(m.sections, s => typeof s.id === 'string' && arrayOf(s.groups, group)))
  const writing = t.writing === undefined || (isObj(t.writing) && arrayOf(t.writing.tasks, k => (k.number === 1 || k.number === 2) && typeof k.prompt === 'string'))
  const sp = t.speaking
  const speaking = sp === undefined || (isObj(sp) && isObj(sp.part1) && isObj(sp.part2) && isObj(sp.part3)
    && Array.isArray(sp.part1.topics) && Array.isArray(sp.part2.bullets) && Array.isArray(sp.part3.questions))
  if (!(sectioned(t.listening) && sectioned(t.reading) && writing && speaking)) return false
  try { testIssues(t as unknown as Test); return true } catch { return false } // the editor and publish run this too
}
