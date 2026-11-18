import { describe, expect, it, vi } from 'vitest'

const stored = { 'ielts-mock.db': JSON.stringify({ tests: [], attempts: [], seeded: [], profile: {}, settings: { apiKey: 'sk-ant-old', model: 'claude-sonnet-5-5' } }) }
vi.stubGlobal('localStorage', { getItem: (k: keyof typeof stored) => stored[k] ?? null, setItem: () => {}, removeItem: () => {} })
vi.stubGlobal('window', { addEventListener: () => {}, dispatchEvent: () => {} })

const { suitableModels, evaluateWriting } = await import('./ai')
const { getDB } = await import('./store')

describe('suitableModels', () => {
  const gemini = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.5-flash-lite',
    'gemini-2.5-pro', 'gemma-4-31b-it', 'nano-banana-pro-preview', 'gemini-3.1-flash-lite-preview', 'gemini-omni-flash-preview']
  it('keeps only stable Gemini Flash and Flash-Lite, newest first', () => {
    expect(suitableModels('gemini', gemini)).toEqual(['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite'])
  })
  it('puts the documented Groq default first and drops small models', () => {
    expect(suitableModels('groq', ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'openai/gpt-oss-120b'])).toEqual(['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'])
  })
  it('keeps plain GPT models for OpenAI', () => {
    expect(suitableModels('openai', ['gpt-4o', 'gpt-5-mini', 'gpt-4.1-mini', 'o3', 'gpt-5-mini-2025-08-07'])).toEqual(['gpt-5-mini', 'gpt-4.1-mini'])
  })
})

describe('settings migration', () => {
  it('moves the old single Claude key into the provider map', () => {
    const s = getDB().settings
    expect(s.provider).toBe('anthropic')
    expect(s.keys.anthropic).toBe('sk-ant-old')
    expect(s.models.anthropic).toBe('claude-sonnet-5-5')
    expect('apiKey' in s).toBe(false)
  })
})

describe('evaluateWriting', () => {
  it('scores a blank task 0 without calling the AI', async () => {
    const fetchSpy = vi.fn(() => { throw new Error('no network in this test') })
    vi.stubGlobal('fetch', fetchSpy)
    const r = await evaluateWriting({ id: 'w', number: 2, prompt: 'Discuss.', minWords: 250 } as never, '   ', 'academic')
    expect(r.band).toBe(0)
    expect(r.criteria.task.band).toBe(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
