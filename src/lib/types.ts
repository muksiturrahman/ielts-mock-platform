export type Variant = 'academic' | 'general'
export type ModuleKey = 'listening' | 'reading' | 'writing' | 'speaking'
export const MODULES: ModuleKey[] = ['listening', 'reading', 'writing', 'speaking']

/**
 * Question types. Every official IELTS task maps onto one of these renderers:
 * - mcq: one answer (A/B/C/D)
 * - mcq_multi: "Choose TWO/THREE letters" — the group's questions share one prompt + option list
 * - tfng / ynng: True/False/Not Given, Yes/No/Not Given
 * - matching: pick a key from group.options (headings, information, features, sentence endings,
 *   listening matching, plan/map/diagram labelling with lettered images)
 * - completion: typed answer (sentence, summary, note, table, flow-chart, form, diagram label,
 *   short answer). If group.content is set, inputs render inline at {{n}} placeholders.
 */
export type QuestionType = 'mcq' | 'mcq_multi' | 'tfng' | 'ynng' | 'matching' | 'completion'

export interface Option {
  key: string // "A", "i", "B"...
  text: string
}

export interface Question {
  id: string
  number: number // 1..40 within the module
  prompt: string // may be empty when the question lives inside group.content
  options?: Option[] // mcq only
  /** Accepted answers. Completion: any listed string ("(the) library", "colour/color" allowed).
   *  mcq/matching/tfng: the key, e.g. "B", "TRUE", "NOT GIVEN". mcq_multi: one key per question. */
  answer: string[]
  explanation?: string
}

export interface QuestionGroup {
  id: string
  type: QuestionType
  /** e.g. "Questions 1–5" is derived; this is the instruction text shown in bold. */
  instructions: string
  /** Completion word limit, e.g. 2 → "NO MORE THAN TWO WORDS" */
  maxWords?: number
  /** Completion: "AND/OR A NUMBER" */
  allowNumber?: boolean
  /** Shared option list for matching / mcq_multi */
  options?: Option[]
  /** Optional title above the content, e.g. "Booking form" */
  title?: string
  /** Markdown-lite body with {{n}} placeholders (paragraphs, "- " bullets, "| a | b |" tables, "## heading") */
  content?: string
  /** Inline SVG markup (maps, plans, diagrams) */
  svg?: string
  /** Uploaded image: media id ("media:<id>") or URL */
  image?: string
  questions: Question[]
}

export interface ListeningSection {
  id: string
  title: string // "Part 1"
  context: string // announced before the recording
  /** One line per utterance: "SPEAKER: text". Used for TTS when no audio is uploaded, and for review. */
  transcript: string
  audio?: string // media id or URL; overrides TTS
  groups: QuestionGroup[]
}

export interface ReadingSection {
  id: string
  title: string // "Section 1" / "Passage 1"
  passageTitle: string
  /** Paragraphs separated by blank lines. "A| text" labels a paragraph A (matching information/headings). */
  passage: string
  groups: QuestionGroup[]
}

export interface ChartSeries {
  name: string
  values: number[]
}

export interface ChartData {
  kind: 'bar' | 'line' | 'pie' | 'table'
  title: string
  categories: string[] // x-axis / slices / table rows
  series: ChartSeries[]
  unit?: string // "%", "millions"
  xLabel?: string
  yLabel?: string
}

export interface WritingTask {
  id: string
  number: 1 | 2
  kind: 'chart' | 'process' | 'map' | 'letter' | 'essay'
  prompt: string
  chart?: ChartData
  svg?: string
  image?: string
  /** Text description of the visual, given to the AI marker (it can't see images). */
  visualDescription?: string
  minWords: number
  minutes: number
  /** A Band 8+ sample answer shown after the test (works without an AI key). */
  sample?: string
}

export interface SpeakingPart1 {
  topics: { topic: string; questions: string[] }[]
}
export interface SpeakingPart2 {
  topic: string
  bullets: string[]
  closing: string // "and explain why ..."
  roundOff: string[] // 1–2 follow-up questions after the long turn
  /** A Band 8+ sample long turn shown after the test. */
  sample?: string
}
export interface SpeakingPart3 {
  theme: string
  questions: string[]
}

export interface Test {
  id: string
  title: string
  variant: Variant
  description?: string
  status: 'draft' | 'published'
  /** Deleted but kept (hidden) because past attempts still point to it. */
  deleted?: boolean
  createdAt: number
  updatedAt: number
  listening?: { sections: ListeningSection[] }
  reading?: { sections: ReadingSection[] }
  writing?: { tasks: WritingTask[] }
  speaking?: { part1: SpeakingPart1; part2: SpeakingPart2; part3: SpeakingPart3 }
}

// ---------- Attempts & results ----------

export type AnswerValue = string | string[]

export interface ObjectiveItem {
  questionId: string
  number: number
  type: QuestionType
  given: string
  correct: string
  /** Answer key at the time of marking, so later edits to the test don't change past reviews. */
  accepted?: string[]
  isCorrect: boolean
  sectionIndex: number
}

export interface ObjectiveResult {
  raw: number
  total: number
  band: number
  items: ObjectiveItem[]
  byType: Record<string, { correct: number; total: number }>
}

export interface CriterionScore {
  band: number
  comment: string
}

export interface Annotation {
  quote: string
  type: 'grammar' | 'vocabulary' | 'cohesion' | 'task' | 'spelling' | 'punctuation'
  issue: string
  suggestion: string
}

export interface WritingTaskEval {
  criteria: { task: CriterionScore; coherence: CriterionScore; lexical: CriterionScore; grammar: CriterionScore }
  band: number
  wordCount: number
  annotations: Annotation[]
  strengths: string[]
  improvements: string[]
  modelAnswer: string
  /** The response rewritten one band higher (older results don't have it). */
  nextBandAnswer?: string
}

export interface WritingResult {
  task1?: WritingTaskEval
  task2?: WritingTaskEval
  band?: number
  status: 'pending' | 'marking' | 'done' | 'error'
  error?: string
  /** Last time the tab doing the marking said it was still alive (epoch ms). */
  heartbeat?: number
}

export interface SpeakingAnswer {
  part: 1 | 2 | 3
  question: string
  transcript: string
  durationSec: number
  recordingId?: string // IndexedDB media id
  /** Seconds of silence > 1s inside the answer, measured from the mic level */
  pauses: number[]
  startedAt: number
  /** Opening ID/name questions — part of the real routine, not assessed. */
  warmup?: boolean
}

export interface SpeakingMetrics {
  wordsPerMinute: number
  fillerCount: number
  fillers: Record<string, number>
  longPauses: number
  avgPauseSec: number
  totalSpeakingSec: number
  uniqueWordRatio: number
}

export interface TranscriptNote {
  quote: string
  type: 'pronunciation' | 'hesitation' | 'grammar' | 'vocabulary'
  note: string
  upgrade?: string
}

export interface SpeakingResult {
  criteria?: { fluency: CriterionScore; lexical: CriterionScore; grammar: CriterionScore; pronunciation: CriterionScore }
  band?: number
  metrics?: SpeakingMetrics
  notes?: TranscriptNote[]
  strengths?: string[]
  improvements?: string[]
  status: 'pending' | 'marking' | 'done' | 'error'
  error?: string
  /** Last time the tab doing the marking said it was still alive (epoch ms). */
  heartbeat?: number
}

export interface ExaminerReview {
  examiner: string
  at: number
  writing?: { task1?: Partial<Record<'task' | 'coherence' | 'lexical' | 'grammar', number>>; task2?: Partial<Record<'task' | 'coherence' | 'lexical' | 'grammar', number>> }
  speaking?: Partial<Record<'fluency' | 'lexical' | 'grammar' | 'pronunciation', number>>
  feedback: string
}

export interface ModuleProgress {
  module: ModuleKey
  startedAt?: number
  deadline?: number // epoch ms; resume-safe
  submittedAt?: number
  section: number
  /** Practice: answers were revealed, so they stay locked (survives refresh). */
  revealed?: boolean
  /** Speaking ended early because the microphone failed — not marked. */
  skipped?: boolean
  /** Listening: where the current part's audio (seconds) or script (line) had got to — a refresh resumes there. */
  audioPos?: number
  scriptLine?: number
  /** Listening: when the candidate left mid-recording (full mock skips the time away on return). */
  leftAt?: number
  /** Speaking: the Part 2 preparation minute already started (step index + start time), so a refresh can't restart it. */
  prep?: { step: number; at: number }
}

export interface Attempt {
  id: string
  testId: string
  testTitle: string
  variant: Variant
  mode: 'full' | 'practice'
  timed: boolean
  modules: ModuleKey[]
  /** Practice: only these section indexes (reading/listening) or task numbers (writing) */
  sections?: number[]
  /** Question-type drill (a typeLabel, e.g. "Matching"): only that type's questions are shown and marked. */
  drill?: string
  /** Writing task numbers set when the attempt started (later test edits don't change them) */
  writingTasks?: (1 | 2)[]
  moduleIndex: number
  progress: Record<string, ModuleProgress>
  status: 'in_progress' | 'completed'
  startedAt: number
  finishedAt?: number
  answers: Record<string, AnswerValue> // questionId (or groupId for mcq_multi) → answer
  flags: string[] // flagged question ids
  highlights: Record<string, Highlight[]> // passage/section id → ranges
  notes: Record<string, string> // highlight id → note
  writing: { task1: string; task2: string }
  speaking: SpeakingAnswer[]
  scratchpad: string
  tabSwitches: number
  results: {
    listening?: ObjectiveResult
    reading?: ObjectiveResult
    writing?: WritingResult
    speaking?: SpeakingResult
  }
  review?: ExaminerReview
}

export interface Highlight {
  id: string
  start: number
  end: number
  paragraph: number
  note?: string
}

export interface Profile {
  name: string
  candidateId: string
  dob: string
  nationality: string
  firstLanguage: string
  targetBand: number
  /** yyyy-mm-dd, for the study plan */
  examDate?: string
}

export type AIProvider = 'gemini' | 'groq' | 'openrouter' | 'anthropic' | 'openai'

export interface Settings {
  provider: AIProvider
  /** API key per provider (stored only in this browser) */
  keys: Partial<Record<AIProvider, string>>
  /** Model the user picked per provider; empty = automatic */
  models: Partial<Record<AIProvider, string>>
  /** Model the app chose automatically (tested to work with this key) */
  autoModels?: Partial<Record<AIProvider, string>>
  examinerName: string
  writingPrompt: string
  speakingPrompt: string
  theme: 'system' | 'light' | 'dark'
  fontScale: number
  contrast: 'standard' | 'yellow-black' | 'white-black'
  ttsRate: number
  /** Paper-based Listening: 10 minutes to transfer answers instead of 2 to check. */
  paperListening?: boolean
}

/** Spaced review of one mistake/correction (Leitner boxes). */
export interface ReviewState {
  box: number // 0 = new/unsure … REVIEW_DAYS.length = mastered
  due: number // epoch ms
}

export interface VocabWord {
  id: string
  word: string
  meaning: string
  addedAt: number
}
