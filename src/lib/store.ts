import { useSyncExternalStore } from 'react'
import type { Attempt, Profile, Settings, Test } from './types'
import { DEFAULT_SPEAKING_PROMPT, DEFAULT_WRITING_PROMPT } from './prompts'

export interface DB {
  version: number
  tests: Test[]
  attempts: Attempt[]
  profile: Profile
  settings: Settings
  seeded: string[] // seed test ids already installed (so deleting one doesn't resurrect it)
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
  return s
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const db = JSON.parse(raw) as DB
      return { ...db, settings: migrateSettings(db.settings), profile: { ...DEFAULT_PROFILE, ...db.profile } }
    }
  } catch {
    /* corrupted or blocked storage → start fresh */
  }
  return { version: VERSION, tests: [], attempts: [], profile: DEFAULT_PROFILE, settings: DEFAULT_SETTINGS, seeded: [] }
}

let db: DB = load()
const listeners = new Set<() => void>()

function persist() {
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

export function saveTest(test: Test) {
  update(d => {
    const exists = d.tests.some(t => t.id === test.id)
    const t = { ...test, updatedAt: Date.now() }
    return { ...d, tests: exists ? d.tests.map(x => (x.id === test.id ? t : x)) : [...d.tests, t] }
  })
}

export function deleteTest(id: string) {
  update(d => ({ ...d, tests: d.tests.filter(t => t.id !== id) }))
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

export function setProfile(patch: Partial<Profile>) {
  update(d => ({ ...d, profile: { ...d.profile, ...patch } }))
}

export function exportBackup(): string {
  return JSON.stringify(db, null, 2)
}

export function importBackup(json: string) {
  const parsed = JSON.parse(json) as DB
  if (!Array.isArray(parsed.tests) || !Array.isArray(parsed.attempts)) throw new Error('Not a valid backup file')
  update(() => ({ ...parsed, settings: migrateSettings(parsed.settings), profile: { ...DEFAULT_PROFILE, ...parsed.profile } }))
}

export function resetAll() {
  localStorage.removeItem(KEY)
  db = load()
  listeners.forEach(l => l())
}
