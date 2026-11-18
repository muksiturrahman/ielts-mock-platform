import { useSyncExternalStore } from 'react'
import type { Attempt, Profile, ReviewState, Settings, Test, VocabWord } from './types'
import { DEFAULT_SPEAKING_PROMPT, DEFAULT_WRITING_PROMPT } from './prompts'
import { isTestShape, testIssues } from './validate'

export interface DB {
  version: number
  tests: Test[]
  attempts: Attempt[]
  profile: Profile
  settings: Settings
  seeded: string[] // seed test ids already installed (so deleting one doesn't resurrect it)
  reviews?: Record<string, ReviewState> // mistake key → spaced-review state
  vocab?: VocabWord[] // words the learner added themselves
}

const KEY = 'ielts-mock.db'
const VERSION = 1

export const DEFAULT_SETTINGS: Settings = {
  provider: 'gemini',
  keys: {},
  models: {},
  examinerName: 'Examiner',
  writingPrompt: DEFAULT_WRITING_PROMPT,
  speakingPrompt: DEFAULT_SPEAKING_PROMPT,
  theme: 'system',
  fontScale: 1,
  contrast: 'standard',
  ttsRate: 0.95,
}

const DEFAULT_PROFILE: Profile = {
  name: '', candidateId: '', dob: '', nationality: '', firstLanguage: '', targetBand: 7,
}

/** v1 stored a single Claude key as settings.apiKey/model — move it into the per-provider maps. */
function migrateSettings(raw: Partial<Settings> & { apiKey?: string; model?: string }): Settings {
  const { apiKey, model, ...rest } = raw ?? {}
  const s: Settings = { ...DEFAULT_SETTINGS, ...rest, keys: { ...rest.keys }, models: { ...rest.models } }
  if (apiKey && !s.keys.anthropic) {
    s.keys.anthropic = apiKey
    s.provider = 'anthropic'
  }
  if (model?.startsWith('claude') && !s.models.anthropic) s.models.anthropic = model
  // Before autoModels existed, the automatic Gemini/OpenAI pick was saved as if the user chose it.
  if (!raw?.autoModels) {
    s.autoModels = {}
    for (const p of ['gemini', 'openai'] as const) delete s.models[p]
  }
  // Prompts saved from an older default asked for half bands per criterion; real criteria are whole bands.
  for (const k of ['writingPrompt', 'speakingPrompt'] as const) s[k] = s[k]?.replace('Criteria (each a whole or half band 0–9):', 'Criteria (each a WHOLE band 0–9 — examiners never give half bands per criterion):')
  return s
}

/** True when saved data couldn't be read and couldn't be set aside — writing now would destroy it. */
let readOnly = false

function load(): DB {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
    if (raw) {
      const db = JSON.parse(raw) as DB
      return { ...db, settings: migrateSettings(db.settings), profile: { ...DEFAULT_PROFILE, ...db.profile } }
    }
  } catch {
    // Corrupted data: keep a copy before starting fresh, so a bad write never silently wipes history.
    if (raw) {
      try {
        localStorage.setItem(`${KEY}.corrupt-${Date.now()}`, raw)
      } catch {
        readOnly = true
      }
    }
  }
  return { version: VERSION, tests: [], attempts: [], profile: DEFAULT_PROFILE, settings: DEFAULT_SETTINGS, seeded: [] }
}

let db: DB = load()
const listeners = new Set<() => void>()

function persist() {
  if (readOnly) {
    window.dispatchEvent(new CustomEvent('ielts:storage-error'))
    return
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch (e) {
    console.error('Could not save to localStorage', e)
    window.dispatchEvent(new CustomEvent('ielts:storage-error'))
  }
}

export function getDB(): DB {
  return db
}

export function update(fn: (draft: DB) => DB) {
  db = fn(db)
  persist()
  listeners.forEach(l => l())
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** Selectors may build new arrays (filter/sort), so subscribe to the stable db object and select during render. */
export function useDB<T>(select: (db: DB) => T): T {
  return select(useSyncExternalStore(subscribe, getDB))
}

// Other tabs editing the same data
window.addEventListener('storage', e => {
  if (e.key === KEY) {
    db = load()
    listeners.forEach(l => l())
  }
})

// ---------- helpers ----------
export const uid = (p = '') => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

/** Saves a test; a published test with blocking problems is saved as a draft. Returns the status actually saved. */
export function saveTest(test: Test): Test['status'] {
  const status = test.status === 'published' && testIssues(test).blocking.length ? 'draft' : test.status
  update(d => {
    const exists = d.tests.some(t => t.id === test.id)
    const t = { ...test, status, updatedAt: Date.now() }
    return { ...d, tests: exists ? d.tests.map(x => (x.id === test.id ? t : x)) : [...d.tests, t] }
  })
  return status
}

export function deleteTest(id: string) {
  // Tests with attempts are hidden, not removed, so their results, reviews and mistakes stay usable.
  update(d => ({
    ...d,
    tests: d.attempts.some(a => a.testId === id)
      ? d.tests.map(t => (t.id === id ? { ...t, deleted: true, status: 'draft' as const } : t))
      : d.tests.filter(t => t.id !== id),
  }))
}

export function saveAttempt(attempt: Attempt) {
  update(d => {
    const exists = d.attempts.some(a => a.id === attempt.id)
    return { ...d, attempts: exists ? d.attempts.map(a => (a.id === attempt.id ? attempt : a)) : [...d.attempts, attempt] }
  })
}

export function patchAttempt(id: string, patch: Partial<Attempt> | ((a: Attempt) => Partial<Attempt>)) {
  update(d => ({
    ...d,
    attempts: d.attempts.map(a => (a.id === id ? { ...a, ...(typeof patch === 'function' ? patch(a) : patch) } : a)),
  }))
}

export function deleteAttempt(id: string) {
  update(d => ({ ...d, attempts: d.attempts.filter(a => a.id !== id) }))
}

export function setSettings(patch: Partial<Settings>) {
  update(d => ({ ...d, settings: { ...d.settings, ...patch } }))
}

// ---------- spaced review ----------
/** Days until the next review after each "Got it"; passing the last box = mastered. */
export const REVIEW_DAYS = [1, 3, 7]
const DAY = 86_400_000

export function isMastered(r?: ReviewState) {
  return (r?.box ?? 0) >= REVIEW_DAYS.length
}
export function isDue(r?: ReviewState, now = Date.now()) {
  return !isMastered(r) && (r?.due ?? 0) <= now
}

export function markReview(key: string, gotIt: boolean) {
  update(d => {
    const box = gotIt ? (d.reviews?.[key]?.box ?? 0) + 1 : 0
    const days = gotIt ? REVIEW_DAYS[box - 1] ?? 0 : 1
    return { ...d, reviews: { ...d.reviews, [key]: { box, due: Date.now() + days * DAY } } }
  })
}

export function resetReview(key: string) {
  update(d => {
    const { [key]: _, ...rest } = d.reviews ?? {}
    return { ...d, reviews: rest }
  })
}

export function addVocab(word: string, meaning: string) {
  update(d => ({ ...d, vocab: [{ id: uid('v-'), word, meaning, addedAt: Date.now() }, ...(d.vocab ?? [])] }))
}

export function deleteVocab(id: string) {
  update(d => ({ ...d, vocab: (d.vocab ?? []).filter(v => v.id !== id) }))
}

export function setProfile(patch: Partial<Profile>) {
  update(d => ({ ...d, profile: { ...d.profile, ...patch } }))
}

/** API keys are left out: a backup file gets shared and synced more casually than the browser it came from. */
export function exportBackup(media: Record<string, string> = {}): string {
  return JSON.stringify({ ...db, settings: { ...db.settings, keys: {} }, media }, null, 2)
}

/** Restores everything; keeps this browser's API keys when the file has none. Returns the media to restore. */
export function importBackup(json: string): { media: Record<string, string>; dropped: number } {
  const { media, ...parsed } = JSON.parse(json) as DB & { media?: Record<string, string> }
  if (!Array.isArray(parsed.tests) || !Array.isArray(parsed.attempts)) throw new Error('Not a valid backup file')
  // A hand-edited or damaged file must not leave the app unable to start: drop what can't be read, fill the rest.
  const tests = parsed.tests.filter(isTestShape).map(t => (t.status === 'published' && testIssues(t).blocking.length ? { ...t, status: 'draft' as const } : t))
  const attempts = parsed.attempts
    .filter(a => a && typeof a.id === 'string' && typeof a.testId === 'string' && Array.isArray(a.modules) && a.progress && a.results && a.writing && Array.isArray(a.speaking))
    .map(a => ({ ...a, answers: a.answers ?? {}, flags: Array.isArray(a.flags) ? a.flags : [], highlights: a.highlights ?? {}, notes: a.notes ?? {}, scratchpad: a.scratchpad ?? '' }))
  if (parsed.tests.length && !tests.length) throw new Error('No readable tests in this backup')
  const settings = migrateSettings(parsed.settings)
  if (!Object.values(settings.keys).some(Boolean)) settings.keys = db.settings.keys
  update(() => ({
    version: VERSION,
    tests,
    attempts,
    seeded: Array.isArray(parsed.seeded) ? parsed.seeded.filter(x => typeof x === 'string') : [],
    reviews: parsed.reviews && typeof parsed.reviews === 'object' ? parsed.reviews : {},
    vocab: Array.isArray(parsed.vocab) ? parsed.vocab : [],
    settings,
    profile: { ...DEFAULT_PROFILE, ...parsed.profile },
  }))
  return { media: media && typeof media === 'object' ? media : {}, dropped: parsed.tests.length - tests.length + parsed.attempts.length - attempts.length }
}

export function resetAll() {
  readOnly = false
  localStorage.removeItem(KEY)
  // Copies kept from corrupted data can hold old attempts and API keys.
  Object.keys(localStorage).filter(k => k.startsWith(`${KEY}.corrupt-`)).forEach(k => localStorage.removeItem(k))
  db = load()
  listeners.forEach(l => l())
}
