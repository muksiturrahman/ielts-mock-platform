import type { Test } from '../../lib/types'
import { update } from '../../lib/store'
import { listeningSections } from './listening'
import { academicReadingSections } from './academicReading'
import { generalReadingSections } from './generalReading'
import { academicExtraTask1, academicWritingTasks, generalWritingTasks, speakingSetA, speakingSetB } from './writingSpeaking'

const T0 = Date.UTC(2026, 0, 1)

export const SEED_TESTS: Test[] = [
  {
    id: 'seed-academic-1',
    title: 'Academic Mock Test 1',
    variant: 'academic',
    description: 'A complete computer-delivered Academic test: Listening, Reading, Writing and Speaking.',
    status: 'published',
    createdAt: T0,
    updatedAt: T0,
    listening: { sections: listeningSections },
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
    listening: { sections: listeningSections },
    reading: { sections: generalReadingSections },
    writing: { tasks: generalWritingTasks },
    speaking: speakingSetB,
  },
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

/** Installs seed tests once; later deletions by the admin are respected. */
export function ensureSeeded() {
  update(d => {
    const missing = SEED_TESTS.filter(t => !d.seeded.includes(t.id))
    if (!missing.length) return d
    return {
      ...d,
      tests: [...d.tests.filter(t => !missing.some(m => m.id === t.id)), ...missing],
      seeded: [...d.seeded, ...missing.map(t => t.id)],
    }
  })
}

export function restoreSeed(id: string) {
  const t = SEED_TESTS.find(s => s.id === id)
  if (t) update(d => ({ ...d, tests: [...d.tests.filter(x => x.id !== id), { ...t, updatedAt: Date.now() }] }))
}
