import type { Annotation, Attempt, ObjectiveItem, Question, QuestionGroup, Test, TranscriptNote } from './types'

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
