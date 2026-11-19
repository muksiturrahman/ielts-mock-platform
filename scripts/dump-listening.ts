// Prints every seed Listening part as JSON for scripts/make_audio.py. Run: npx vite-node scripts/dump-listening.ts
import { readFileSync, readdirSync } from 'node:fs'
;(globalThis as any).localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }
;(globalThis as any).window = { addEventListener: () => {}, dispatchEvent: () => {} }
const { SEED_TESTS } = await import('../src/data/seed/index')

// Speaker genders come from the "// voices: LABEL=f|m, ..." comment in the seed file that defines the part.
const files = readdirSync('src/data/seed').map(f => readFileSync(`src/data/seed/${f}`, 'utf8'))
const voicesOf = (id: string) => {
  const m = files.find(src => src.includes(`id: '${id}'`))?.match(/\/\/ voices: (.*)/)
  return Object.fromEntries((m?.[1] ?? '').split(',').map(p => p.split('=').map(s => s.trim())).filter(p => p[0]))
}
const seen = new Set<string>()
const parts = SEED_TESTS.flatMap(t => t.listening?.sections ?? []).filter(s => !seen.has(s.id) && seen.add(s.id))
console.log(JSON.stringify(parts.map(s => ({ id: s.id, voices: voicesOf(s.id), transcript: s.transcript }))))
