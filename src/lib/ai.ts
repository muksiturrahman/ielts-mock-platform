import Anthropic from '@anthropic-ai/sdk'
import { getDB, setSettings } from './store'
import { countWords, criteriaBand } from './scoring'
import type { AIProvider, SpeakingAnswer, SpeakingMetrics, SpeakingResult, WritingTask, WritingTaskEval } from './types'

export class AIError extends Error {}

export interface ProviderInfo {
  label: string
  free: boolean
  tagline: string
  keyUrl: string
  /** OpenAI-compatible base URL (all providers except Anthropic) */
  baseUrl?: string
  defaultModel: string
  /** Shown in the model picker before the live list loads */
  suggested: string[]
}

export const PROVIDERS: Record<AIProvider, ProviderInfo> = {
  gemini: {
    label: 'Google Gemini', free: true, tagline: 'Free tier · very good marking · best free choice',
    keyUrl: 'https://aistudio.google.com/apikey', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: '', suggested: [],
  },
  groq: {
    label: 'Groq', free: true, tagline: 'Free tier · extremely fast · open models',
    keyUrl: 'https://console.groq.com/keys', baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'openai/gpt-oss-120b', suggested: ['openai/gpt-oss-120b'],
  },
  openrouter: {
    label: 'OpenRouter', free: true, tagline: 'Free “:free” models · one key, many models · ~50 requests/day',
    keyUrl: 'https://openrouter.ai/keys', baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openrouter/free', suggested: ['openrouter/free'],
  },
  anthropic: {
    label: 'Anthropic Claude', free: false, tagline: 'Paid · most accurate, best-calibrated examiner',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    defaultModel: 'claude-opus-5-5', suggested: ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'],
  },
  openai: {
    label: 'OpenAI', free: false, tagline: 'Paid · strong general models',
    keyUrl: 'https://platform.openai.com/api-keys', baseUrl: 'https://api.openai.com/v1',
    defaultModel: '', suggested: [],
  },
}

export const PROVIDER_ORDER: AIProvider[] = ['gemini', 'groq', 'openrouter', 'anthropic', 'openai']

export function activeKey(): string {
  const s = getDB().settings
  return s.keys[s.provider]?.trim() ?? ''
}

// ---------- model lists ----------
/** Live model ids from the provider, filtered to text chat models. */
export async function listModels(provider: AIProvider, key: string): Promise<string[]> {
  if (provider === 'anthropic') {
    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
    const ids: string[] = []
    for await (const m of client.models.list()) ids.push(m.id)
    return ids
  }
  const info = PROVIDERS[provider]
  const res = await fetch(`${info.baseUrl}/models`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) })
  // Gemini answers a bad key with 400 "API key not valid" rather than 401.
  if (!res.ok) throw new AIError(res.status === 401 || res.status === 403 || /api.key/i.test(await res.text()) ? 'The API key was rejected.' : `Could not load models (${res.status}).`)
  const data = await res.json()
  const ids: string[] = (data.data ?? []).map((m: { id: string }) => m.id.replace(/^models\//, ''))
  const textOnly = (id: string) => !/(embed|tts|audio|image|vision-preview|whisper|dall-e|moderation|transcribe|realtime|search|guard|live|veo|imagen|aqa)/i.test(id)
  if (provider === 'openrouter') return ids.filter(id => id.endsWith(':free') || id === 'openrouter/free')
  return ids.filter(textOnly)
}

/** Best default from a live list: the newest non-lite Gemini Flash, or a mini GPT model. */
export function pickDefaultModel(provider: AIProvider, ids: string[]): string | undefined {
  const version = (id: string) => Number(id.match(/(\d+(?:\.\d+)?)/)?.[1] ?? 0)
  const newest = (xs: string[]) => [...xs].sort((a, b) => version(b) - version(a))[0]
  if (provider === 'gemini') {
    const flash = ids.filter(id => /gemini-[\d.]+-flash$/.test(id))
    return newest(flash) ?? newest(ids.filter(id => /flash/.test(id) && !/lite/.test(id))) ?? ids[0]
  }
  if (provider === 'openai') return newest(ids.filter(id => /^gpt-[\d.]+(-mini)?$/.test(id) && id.includes('mini'))) ?? newest(ids.filter(id => /^gpt-/.test(id)))
  return ids.includes(PROVIDERS[provider].defaultModel) ? PROVIDERS[provider].defaultModel : ids[0]
}

async function resolveModel(provider: AIProvider, key: string): Promise<string> {
  const s = getDB().settings
  const chosen = s.models[provider]?.trim() || PROVIDERS[provider].defaultModel
  if (chosen) return chosen
  // No sensible fixed default (model names change often) — pick from the live list once and remember it.
  const picked = pickDefaultModel(provider, await listModels(provider, key))
  if (!picked) throw new AIError('No suitable model found for this key. Pick one in Settings.')
  setSettings({ models: { ...s.models, [provider]: picked } })
  return picked
}

// ---------- structured calls ----------
/** One evaluation request; always returns parsed JSON matching `schema`. */
async function callStructured<T>(system: string, user: string, schema: object, maxTokens = 16000): Promise<T> {
  const s = getDB().settings
  const provider = s.provider
  const key = activeKey()
  if (!key) throw new AIError(`Add your ${PROVIDERS[provider].label} API key in Settings to enable AI marking.`)
  const model = await resolveModel(provider, key)
  return provider === 'anthropic' ? callClaude<T>(key, model, system, user, schema, maxTokens) : callOpenAICompatible<T>(provider, key, model, system, user, schema, maxTokens)
}

async function callClaude<T>(key: string, model: string, system: string, user: string, schema: object, maxTokens: number): Promise<T> {
  // The key is the user's own and only ever goes to api.anthropic.com.
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
  const params = {
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user' as const, content: user }],
    output_config: { format: { type: 'json_schema' as const, schema: schema as Record<string, unknown> } },
  }
  try {
    // Opus/Sonnet 5.5 can decline under safety classifiers; server-side fallback re-runs on a suitable model.
    const withFallback = /^claude-(opus|sonnet)-5-5$/.test(model)
    const res = withFallback
      ? await client.beta.messages.create({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' })
      : await client.messages.create(params)
    if (res.stop_reason === 'refusal') throw new AIError('The AI declined to mark this response. Try again or use another model.')
    if (res.stop_reason === 'max_tokens') throw new AIError('The AI ran out of output space. Try again.')
    const text = res.content.flatMap(b => (b.type === 'text' ? [b.text] : [])).join('')
    return JSON.parse(text) as T
  } catch (e) {
    if (e instanceof AIError) throw e
    if (e instanceof Anthropic.AuthenticationError) throw new AIError('Your Anthropic API key was rejected. Check it in Settings.')
    if (e instanceof Anthropic.RateLimitError) throw new AIError('Rate limited by Anthropic. Wait a moment and try again.')
    if (e instanceof Anthropic.NotFoundError) throw new AIError(`Model “${model}” isn't available for this key. Pick another in Settings.`)
    if (e instanceof Anthropic.APIError) throw new AIError(`AI marking failed (${e.status}): ${e.message}`)
    if (e instanceof SyntaxError) throw new AIError('The AI returned an unreadable result. Try again.')
    throw new AIError(`Could not reach Anthropic: ${(e as Error).message}`)
  }
}

/** Gemini, Groq, OpenRouter and OpenAI all speak the OpenAI chat-completions API. */
const BUSY = new Set([500, 502, 503, 504])
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

/** Busy models (503 "high demand") are common on free tiers: retry, then try other models from the same provider. */
async function callOpenAICompatible<T>(provider: AIProvider, key: string, model: string, system: string, user: string, schema: object, maxTokens: number): Promise<T> {
  const tried: string[] = []
  let current = model
  for (;;) {
    tried.push(current)
    try {
      const out = await callModel<T>(provider, key, current, system, user, schema, maxTokens)
      // Remember the model that answered so the next call goes straight to it.
      if (current !== model) setSettings({ models: { ...getDB().settings.models, [provider]: current } })
      return out
    } catch (e) {
      if (!(e instanceof BusyError)) throw e
      const ids = await listModels(provider, key).catch(() => [] as string[])
      const next = fallbackModels(provider, ids).find(id => !tried.includes(id))
      if (!next || tried.length >= 4) throw new AIError(`${PROVIDERS[provider].label} isn't answering right now (tried ${tried.join(', ')}). Try again in a minute, or switch provider in Settings.`)
      current = next
    }
  }
}

/** The model is overloaded, timed out, or not available to this key: worth trying another model. */
class BusyError extends Error {}

/** Other models worth trying when the chosen one is overloaded: Flash first, then Flash-Lite, newest first. */
export function fallbackModels(provider: AIProvider, ids: string[]): string[] {
  if (provider !== 'gemini') return []
  const version = (id: string) => Number(id.match(/(\d+(?:\.\d+)?)/)?.[1] ?? 0)
  const byNewest = (xs: string[]) => [...xs].sort((a, b) => version(b) - version(a))
  return [...byNewest(ids.filter(id => /gemini-[\d.]+-flash$/.test(id))), ...byNewest(ids.filter(id => /gemini-[\d.]+-flash-lite$/.test(id)))]
}

async function callModel<T>(provider: AIProvider, key: string, model: string, system: string, user: string, schema: object, maxTokens: number): Promise<T> {
  const info = PROVIDERS[provider]
  const body = (jsonMode: boolean) => ({
    model,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: `${system}\n\nRespond with ONLY a JSON object (no markdown fences, no commentary) that matches this JSON Schema exactly — every listed property is required:\n${JSON.stringify(schema)}` },
      { role: 'user', content: user },
    ],
    ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
  })
  const send = (jsonMode: boolean) =>
    fetch(`${info.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${key}`,
        ...(provider === 'openrouter' ? { 'HTTP-Referer': location.origin, 'X-Title': 'BandReady IELTS' } : {}),
      },
      body: JSON.stringify(body(jsonMode)),
      // Short for the connection test, long enough for a full essay evaluation.
      signal: AbortSignal.timeout(maxTokens <= 1000 ? 15000 : 120000),
    })

  let res: Response
  try {
    res = await send(true)
    // Some free models don't support JSON mode — retry once with prompt-only JSON.
    if (res.status === 400) {
      const msg = await res.clone().text()
      if (/response_format|json/i.test(msg)) res = await send(false)
    }
    for (const delay of [1500, 4000]) {
      if (!BUSY.has(res.status)) break
      await wait(delay)
      res = await send(true)
    }
  } catch (e) {
    if ((e as Error).name === 'TimeoutError') throw new BusyError(`${model} timed out`)
    throw new AIError(`Could not reach ${info.label}: ${(e as Error).message}`)
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message ?? (Array.isArray(err) ? err[0]?.error?.message : undefined) ?? res.statusText
    if (res.status === 401 || res.status === 403 || /api.key (not valid|invalid)|invalid api.key/i.test(msg)) throw new AIError(`Your ${info.label} API key was rejected. Check it in Settings.`)
    if (BUSY.has(res.status) || /high demand|overloaded/i.test(msg)) throw new BusyError(msg)
    if (res.status === 429) throw new AIError(`${info.label} rate limit or free daily quota reached. Wait, or switch provider in Settings.`)
    if (res.status === 404) {
      if (provider === 'gemini') throw new BusyError(msg)
      throw new AIError(`Model “${model}” isn't available on ${info.label}. Pick another in Settings.`)
    }
    throw new AIError(`AI marking failed (${res.status}): ${msg}`)
  }
  const data = await res.json()
  const text: string = data.choices?.[0]?.message?.content ?? ''
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
  try {
    return JSON.parse(json) as T
  } catch {
    throw new AIError('The AI returned an unreadable result. Try again or pick a stronger model.')
  }
}

export async function testConnection(): Promise<string> {
  const r = await callStructured<{ ok: string }>('You check connectivity.', 'Reply with ok = "ready".', {
    type: 'object', properties: { ok: { type: 'string' } }, required: ['ok'], additionalProperties: false,
  }, 1000)
  if (!r.ok) throw new AIError('Unexpected reply from the AI.')
  const s = getDB().settings
  return s.models[s.provider] || PROVIDERS[s.provider].defaultModel
}

// ---------- schemas (Claude structured outputs: every object closed, every property required) ----------
const band = { type: 'number', description: 'Band 0–9 in 0.5 steps' }
const criterion = {
  type: 'object',
  properties: { band, comment: { type: 'string', description: '2–4 sentences referencing the band descriptors' } },
  required: ['band', 'comment'],
  additionalProperties: false,
}
const obj = (properties: Record<string, object>) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false })
const strings = { type: 'array', items: { type: 'string' } }

const WRITING_SCHEMA = obj({
  criteria: obj({ task: criterion, coherence: criterion, lexical: criterion, grammar: criterion }),
  annotations: {
    type: 'array',
    description: '6–20 specific issues, each quoting the exact text',
    items: obj({
      quote: { type: 'string', description: 'Exact excerpt copied from the response (3–12 words)' },
      type: { type: 'string', enum: ['grammar', 'vocabulary', 'cohesion', 'task', 'spelling', 'punctuation'] },
      issue: { type: 'string' },
      suggestion: { type: 'string', description: 'Corrected/upgraded version' },
    }),
  },
  strengths: strings,
  improvements: { ...strings, description: 'Concrete steps to reach the next band' },
  modelAnswer: { type: 'string', description: 'Band 8.5–9 rewrite keeping the candidate’s ideas' },
})

const SPEAKING_SCHEMA = obj({
  criteria: obj({ fluency: criterion, lexical: criterion, grammar: criterion, pronunciation: criterion }),
  notes: {
    type: 'array',
    description: '6–20 transcript notes',
    items: obj({
      quote: { type: 'string', description: 'Exact words from a transcript' },
      type: { type: 'string', enum: ['pronunciation', 'hesitation', 'grammar', 'vocabulary'] },
      note: { type: 'string' },
      upgrade: { type: 'string', description: 'Better word/phrase, or empty string' },
    }),
  },
  strengths: strings,
  improvements: strings,
})

// Free models are less reliable at following schemas — validate before trusting a result.
const clampBand = (b: unknown) => {
  const n = Number(b)
  if (!Number.isFinite(n)) throw new AIError('The AI returned an incomplete evaluation. Try again or pick a stronger model.')
  return Math.min(9, Math.max(0, Math.round(n * 2) / 2))
}
const asCriterion = (c: unknown) => {
  const x = (c ?? {}) as { band?: unknown; comment?: unknown }
  return { band: clampBand(x.band), comment: String(x.comment ?? '') }
}
const asStrings = (xs: unknown) => (Array.isArray(xs) ? xs.map(String) : [])

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
  const r = await callStructured<{ criteria: Record<string, unknown>; annotations?: unknown[]; strengths?: unknown; improvements?: unknown; modelAnswer?: unknown }>(
    getDB().settings.writingPrompt, user, WRITING_SCHEMA,
  )
  const keys = ['task', 'coherence', 'lexical', 'grammar'] as const
  const criteria = Object.fromEntries(keys.map(k => [k, response.trim() ? asCriterion(r.criteria?.[k]) : { band: 0, comment: 'No response.' }])) as WritingTaskEval['criteria']
  return {
    criteria,
    annotations: (Array.isArray(r.annotations) ? r.annotations : []).map(a => {
      const x = a as Record<string, unknown>
      return { quote: String(x.quote ?? ''), type: (x.type as WritingTaskEval['annotations'][number]['type']) ?? 'grammar', issue: String(x.issue ?? ''), suggestion: String(x.suggestion ?? '') }
    }),
    strengths: asStrings(r.strengths),
    improvements: asStrings(r.improvements),
    modelAnswer: String(r.modelAnswer ?? ''),
    wordCount: words,
    band: criteriaBand(keys.map(k => criteria[k].band)),
  }
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
  const r = await callStructured<{ criteria: Record<string, unknown>; notes?: unknown[]; strengths?: unknown; improvements?: unknown }>(getDB().settings.speakingPrompt, user, SPEAKING_SCHEMA)
  const keys = ['fluency', 'lexical', 'grammar', 'pronunciation'] as const
  const criteria = Object.fromEntries(keys.map(k => [k, asCriterion(r.criteria?.[k])])) as NonNullable<SpeakingResult['criteria']>
  return {
    criteria,
    band: criteriaBand(keys.map(k => criteria[k].band)),
    notes: (Array.isArray(r.notes) ? r.notes : []).map(n => {
      const x = n as Record<string, unknown>
      return { quote: String(x.quote ?? ''), type: (x.type as NonNullable<SpeakingResult['notes']>[number]['type']) ?? 'vocabulary', note: String(x.note ?? ''), ...(x.upgrade ? { upgrade: String(x.upgrade) } : {}) }
    }),
    strengths: asStrings(r.strengths),
    improvements: asStrings(r.improvements),
  }
}
