import { getDB } from './store'
import { countWords, criteriaBand } from './scoring'
import type { SpeakingAnswer, SpeakingMetrics, SpeakingResult, WritingTask, WritingTaskEval } from './types'

const API = 'https://api.anthropic.com/v1/messages'

export class AIError extends Error {}

/** Calls Claude with a forced tool so the reply is always schema-shaped JSON. */
async function callStructured<T>(system: string, user: string, schema: object, maxTokens = 6000): Promise<T> {
  const { apiKey, model } = getDB().settings
  if (!apiKey) throw new AIError('Add your Anthropic API key in Settings to enable AI marking.')
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // The key belongs to the user and never leaves their browser except to Anthropic.
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      tools: [{ name: 'submit_evaluation', description: 'Submit the marked evaluation.', input_schema: schema }],
      tool_choice: { type: 'tool', name: 'submit_evaluation' },
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg = body?.error?.message ?? res.statusText
    if (res.status === 401) throw new AIError('Your API key was rejected. Check it in Settings.')
    if (res.status === 429) throw new AIError('Rate limited by Anthropic. Wait a moment and try again.')
    throw new AIError(`AI marking failed (${res.status}): ${msg}`)
  }
  const data = await res.json()
  const block = data.content?.find((c: { type: string }) => c.type === 'tool_use')
  if (!block) throw new AIError('The AI returned no evaluation. Try again.')
  return block.input as T
}

export async function testConnection(): Promise<string> {
  const r = await callStructured<{ ok: string }>('Reply via the tool.', 'Say ready.', {
    type: 'object', properties: { ok: { type: 'string' } }, required: ['ok'],
  }, 50)
  return r.ok
}

const band = { type: 'number', description: 'Band 0–9 in 0.5 steps' }
const criterion = {
  type: 'object',
  properties: { band, comment: { type: 'string', description: '2–4 sentences referencing the band descriptors' } },
  required: ['band', 'comment'],
}

const WRITING_SCHEMA = {
  type: 'object',
  properties: {
    criteria: {
      type: 'object',
      properties: { task: criterion, coherence: criterion, lexical: criterion, grammar: criterion },
      required: ['task', 'coherence', 'lexical', 'grammar'],
    },
    annotations: {
      type: 'array',
      description: '6–20 specific issues, each quoting the exact text',
      items: {
        type: 'object',
        properties: {
          quote: { type: 'string', description: 'Exact excerpt copied from the response (3–12 words)' },
          type: { type: 'string', enum: ['grammar', 'vocabulary', 'cohesion', 'task', 'spelling', 'punctuation'] },
          issue: { type: 'string' },
          suggestion: { type: 'string', description: 'Corrected/upgraded version' },
        },
        required: ['quote', 'type', 'issue', 'suggestion'],
      },
    },
    strengths: { type: 'array', items: { type: 'string' } },
    improvements: { type: 'array', items: { type: 'string' }, description: 'Concrete steps to reach the next band' },
    modelAnswer: { type: 'string', description: 'Band 8.5–9 rewrite keeping the candidate’s ideas' },
  },
  required: ['criteria', 'annotations', 'strengths', 'improvements', 'modelAnswer'],
}

const clampBand = (b: number) => Math.min(9, Math.max(0, Math.round(b * 2) / 2))

export async function evaluateWriting(task: WritingTask, response: string, variant: 'academic' | 'general'): Promise<WritingTaskEval> {
  const words = countWords(response)
  const visual = task.number === 1 && variant === 'academic'
    ? `\n\nVisual information (the candidate saw this as a ${task.kind}):\n${task.visualDescription ?? JSON.stringify(task.chart)}`
    : ''
  const user = `IELTS ${variant === 'academic' ? 'Academic' : 'General Training'} Writing Task ${task.number}.
Minimum words: ${task.minWords}. Candidate wrote: ${words} words.

Question:
${task.prompt}${visual}

Candidate response:
"""
${response || '(no response)'}
"""`
  const r = await callStructured<Omit<WritingTaskEval, 'band' | 'wordCount'>>(getDB().settings.writingPrompt, user, WRITING_SCHEMA)
  const c = r.criteria
  for (const k of ['task', 'coherence', 'lexical', 'grammar'] as const) c[k].band = clampBand(c[k].band)
  if (!response.trim()) for (const k of ['task', 'coherence', 'lexical', 'grammar'] as const) c[k] = { band: 0, comment: 'No response.' }
  return {
    ...r,
    criteria: c,
    wordCount: words,
    band: criteriaBand([c.task.band, c.coherence.band, c.lexical.band, c.grammar.band]),
  }
}

const SPEAKING_SCHEMA = {
  type: 'object',
  properties: {
    criteria: {
      type: 'object',
      properties: { fluency: criterion, lexical: criterion, grammar: criterion, pronunciation: criterion },
      required: ['fluency', 'lexical', 'grammar', 'pronunciation'],
    },
    notes: {
      type: 'array',
      description: '6–20 transcript notes',
      items: {
        type: 'object',
        properties: {
          quote: { type: 'string', description: 'Exact words from a transcript' },
          type: { type: 'string', enum: ['pronunciation', 'hesitation', 'grammar', 'vocabulary'] },
          note: { type: 'string' },
          upgrade: { type: 'string', description: 'Better word/phrase, if relevant' },
        },
        required: ['quote', 'type', 'note'],
      },
    },
    strengths: { type: 'array', items: { type: 'string' } },
    improvements: { type: 'array', items: { type: 'string' } },
  },
  required: ['criteria', 'notes', 'strengths', 'improvements'],
}

export async function evaluateSpeaking(answers: SpeakingAnswer[], metrics: SpeakingMetrics): Promise<Required<Pick<SpeakingResult, 'criteria' | 'band' | 'notes' | 'strengths' | 'improvements'>>> {
  const transcript = answers
    .map(a => `[Part ${a.part}] Examiner: ${a.question}\nCandidate (${Math.round(a.durationSec)}s, ${a.pauses.length} pauses >1s): ${a.transcript || '(silence / not recognised)'}`)
    .join('\n\n')
  const user = `Acoustic measurements:
- Speaking rate: ${metrics.wordsPerMinute} words per minute
- Long pauses (>1s): ${metrics.longPauses}, average ${metrics.avgPauseSec}s
- Filler words: ${metrics.fillerCount} (${Object.entries(metrics.fillers).map(([k, v]) => `${k}×${v}`).join(', ') || 'none'})
- Total speaking time: ${Math.round(metrics.totalSpeakingSec)}s
- Unique word ratio: ${metrics.uniqueWordRatio}

Transcripts:
${transcript}`
  const r = await callStructured<{ criteria: NonNullable<SpeakingResult['criteria']>; notes: NonNullable<SpeakingResult['notes']>; strengths: string[]; improvements: string[] }>(
    getDB().settings.speakingPrompt, user, SPEAKING_SCHEMA,
  )
  const c = r.criteria
  for (const k of ['fluency', 'lexical', 'grammar', 'pronunciation'] as const) c[k].band = clampBand(c[k].band)
  return { ...r, criteria: c, band: criteriaBand([c.fluency.band, c.lexical.band, c.grammar.band, c.pronunciation.band]) }
}
