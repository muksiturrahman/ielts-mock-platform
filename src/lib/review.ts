import type { Annotation, Attempt, ObjectiveItem, Question, QuestionGroup, Test, TranscriptNote, VocabWord } from './types'

export interface LocatedQuestion {
  question: Question
  group: QuestionGroup
  sectionIndex: number
  sectionTitle: string
}

export function locateQuestion(test: Test | undefined, module: 'listening' | 'reading', questionId: string): LocatedQuestion | undefined {
  const sections = test?.[module]?.sections ?? []
  for (const [sectionIndex, s] of sections.entries()) {
    for (const group of s.groups) {
      const question = group.questions.find(q => q.id === questionId)
      if (question) return { question, group, sectionIndex, sectionTitle: s.title }
    }
  }
  return undefined
}

export interface Mistake {
  key: string
  attempt: Attempt
  module: 'listening' | 'reading'
  item: ObjectiveItem
  located?: LocatedQuestion
}

/** Every wrong Listening/Reading answer across completed attempts, newest first. */
export function collectMistakes(attempts: Attempt[], tests: Test[]): Mistake[] {
  const byId = new Map(tests.map(t => [t.id, t]))
  return attempts
    .filter(a => a.status === 'completed' || a.results.listening || a.results.reading)
    .sort((a, b) => (b.finishedAt ?? b.startedAt) - (a.finishedAt ?? a.startedAt))
    .flatMap(a =>
      (['listening', 'reading'] as const).flatMap(module =>
        (a.results[module]?.items ?? [])
          .filter(i => !i.isCorrect)
          .map(item => ({ key: `${a.id}:${item.questionId}`, attempt: a, module, item, located: locateQuestion(byId.get(a.testId), module, item.questionId) })),
      ),
    )
}

export interface WritingNote {
  key: string
  attempt: Attempt
  task: 1 | 2
  note: Annotation
}

export interface SpeakingNote {
  key: string
  attempt: Attempt
  note: TranscriptNote
}

export function collectWritingNotes(attempts: Attempt[]): WritingNote[] {
  return attempts.flatMap(a =>
    ([1, 2] as const).flatMap(task =>
      (a.results.writing?.[task === 1 ? 'task1' : 'task2']?.annotations ?? []).map((note, i) => ({ key: `${a.id}:w${task}:${i}`, attempt: a, task, note })),
    ),
  )
}

export function collectSpeakingNotes(attempts: Attempt[]): SpeakingNote[] {
  return attempts.flatMap(a => (a.results.speaking?.notes ?? []).map((note, i) => ({ key: `${a.id}:s:${i}`, attempt: a, note })))
}

/** Short readable question text, even for questions that live inside a form/table/summary. */
export function questionText(l?: LocatedQuestion): string {
  if (!l) return ''
  if (l.question.prompt.trim()) return l.question.prompt
  const content = l.group.content ?? ''
  // The sentence/line around the {{n}} gap gives the learner the context of the blank.
  const line = content.split('\n').find(x => x.includes(`{{${l.question.number}}}`)) ?? ''
  return line.replace(/^[-•#|\s]+|\|\s*$/g, '').replace(/\|/g, ' · ').replace(`{{${l.question.number}}}`, '_____').replace(/\{\{\d+\}\}/g, '…').trim()
}

export interface VocabItem {
  key: string
  from: string // what the learner wrote/said (empty for words they added)
  to: string // the better word/phrase
  why: string
  source: string
  link?: string
}

/** AI vocabulary upgrades from Writing and Speaking, plus the learner's own words; duplicates collapse to the newest. */
export function collectVocab(attempts: Attempt[], own: VocabWord[] = []): VocabItem[] {
  const ai = [
    ...collectWritingNotes(attempts).filter(w => w.note.type === 'vocabulary' && w.note.suggestion).map(w => ({
      key: w.key, from: w.note.quote, to: w.note.suggestion, why: w.note.issue, source: `Writing Task ${w.task} · ${w.attempt.testTitle}`, link: `/results/${w.attempt.id}?tab=writing`, at: w.attempt.startedAt,
    })),
    ...collectSpeakingNotes(attempts).filter(s => s.note.type === 'vocabulary' && s.note.upgrade).map(s => ({
      key: s.key, from: s.note.quote, to: s.note.upgrade!, why: s.note.note, source: `Speaking · ${s.attempt.testTitle}`, link: `/results/${s.attempt.id}?tab=speaking`, at: s.attempt.startedAt,
    })),
  ].sort((a, b) => b.at - a.at)
  const seen = new Set<string>()
  const unique = ai.filter(v => {
    const k = `${v.from}→${v.to}`.toLowerCase()
    return !seen.has(k) && seen.add(k)
  }).map(({ at: _at, ...v }) => v)
  return [...own.map(w => ({ key: `vocab:${w.id}`, from: '', to: w.word, why: w.meaning, source: 'Added by you' })), ...unique]
}
