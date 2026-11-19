import type { ListeningSection, Test } from '../../lib/types'
import durations from './audioDurations.json'
import { update } from '../../lib/store'
import { listeningSections } from './listening'
import { academicReadingSections } from './academicReading'
import { generalReadingSections } from './generalReading'
import { mock2 } from './mock2'
import { mock3 } from './mock3'
import { mock4 } from './mock4'
import { mock5 } from './mock5'
import { academicExtraTask1, academicWritingTasks, generalWritingTasks, speakingSetA, speakingSetB } from './writingSpeaking'

const T0 = Date.UTC(2026, 0, 1)

/** Recorded audio for every seed part (made by scripts/make_audio.py); the read-aloud script stays as the fallback. */
const recorded = (sections: ListeningSection[]) => sections.map(s => ({ ...s, audio: s.audio ?? `${import.meta.env.BASE_URL}audio/${s.id}.mp3`, durationSec: (durations as Record<string, number>)[s.id] }))

export const SEED_TESTS: Test[] = [
  {
    id: 'seed-academic-1',
    title: 'Academic Mock Test 1',
    variant: 'academic',
    description: 'A complete computer-delivered Academic test: Listening, Reading, Writing and Speaking.',
    status: 'published',
    createdAt: T0,
    updatedAt: T0,
    listening: { sections: recorded(listeningSections) },
    reading: { sections: academicReadingSections },
    writing: { tasks: academicWritingTasks },
    speaking: speakingSetA,
  },
  {
    id: 'seed-general-1',
    title: 'General Training Mock Test 1',
    variant: 'general',
    description: 'A complete computer-delivered General Training test: Listening, Reading, Writing and Speaking.',
    status: 'published',
    createdAt: T0,
    updatedAt: T0,
    listening: { sections: recorded(listeningSections) },
    reading: { sections: generalReadingSections },
    writing: { tasks: generalWritingTasks },
    speaking: speakingSetB,
  },
  ...[mock2, mock3, mock4, mock5].map(t => ({ ...t, listening: t.listening && { sections: recorded(t.listening.sections) } })),
  ...academicExtraTask1.map((task, i): Test => ({
    id: `seed-task1-${i + 1}`,
    title: `Academic Writing Task 1 — ${task.kind === 'process' ? 'Process diagram' : task.chart?.kind === 'pie' ? 'Pie charts' : 'Table'}`,
    variant: 'academic',
    description: 'Single-task writing practice with full AI feedback.',
    status: 'published',
    createdAt: T0,
    updatedAt: T0,
    writing: { tasks: [{ ...task, number: 1 }] },
  })),
]

/**
 * Installs seed tests once (later deletions by the admin are respected) and refreshes copies the admin never
 * edited, so answer-key fixes reach existing users. An edit sets updatedAt, which marks the copy as the admin's own.
 */
/** An admin-edited seed copy still gets the recordings for parts whose script it hasn't changed. */
function withRecordings(t: Test, seed: Test): Test {
  const missing = (s: ListeningSection) => {
    const src = seed.listening?.sections.find(x => x.id === s.id)
    return !s.audio && src?.audio && src.transcript === s.transcript ? src : undefined
  }
  if (!t.listening?.sections.some(missing)) return t
  return { ...t, listening: { ...t.listening, sections: t.listening.sections.map(s => { const src = missing(s); return src ? { ...s, audio: src.audio, durationSec: src.durationSec } : s }) } }
}

export function ensureSeeded() {
  update(d => {
    const missing = SEED_TESTS.filter(t => !d.seeded.includes(t.id))
    const fresh = (t: Test) => {
      const seed = SEED_TESTS.find(s => s.id === t.id)
      const unedited = seed && !t.deleted && t.updatedAt === seed.updatedAt
      if (unedited) return JSON.stringify(t) !== JSON.stringify(seed) ? seed : t
      return seed ? withRecordings(t, seed) : t
    }
    const tests = d.tests.map(fresh)
    if (!missing.length && tests.every((t, i) => t === d.tests[i])) return d
    return {
      ...d,
      tests: [...tests.filter(t => !missing.some(m => m.id === t.id)), ...missing],
      seeded: [...d.seeded, ...missing.map(t => t.id)],
    }
  })
}

export function restoreSeed(id: string) {
  const t = SEED_TESTS.find(s => s.id === id)
  if (t) update(d => ({ ...d, tests: [...d.tests.filter(x => x.id !== id), t] })) // unedited, so it gets later fixes too
}
