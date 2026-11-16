import { describe, expect, it, vi } from 'vitest'

const stored = { 'ielts-mock.db': JSON.stringify({ tests: [], attempts: [], seeded: [], profile: {}, settings: { apiKey: 'sk-ant-old', model: 'claude-sonnet-5-5' } }) }
vi.stubGlobal('localStorage', { getItem: (k: keyof typeof stored) => stored[k] ?? null, setItem: () => {}, removeItem: () => {} })
vi.stubGlobal('window', { addEventListener: () => {}, dispatchEvent: () => {} })

const { pickDefaultModel } = await import('./ai')
const { getDB } = await import('./store')

describe('provider model defaults', () => {
  it('picks the newest non-lite Gemini Flash', () => {
    expect(pickDefaultModel('gemini', ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.5-pro', 'gemma-4'])).toBe('gemini-3.5-flash')
  })
  it('keeps the documented default when available', () => {
    expect(pickDefaultModel('groq', ['llama-3.3-70b', 'openai/gpt-oss-120b'])).toBe('openai/gpt-oss-120b')
    expect(pickDefaultModel('groq', ['llama-3.3-70b'])).toBe('llama-3.3-70b')
  })
  it('picks a mini GPT model for OpenAI', () => {
    expect(pickDefaultModel('openai', ['gpt-4o', 'gpt-5-mini', 'gpt-4.1-mini', 'o3'])).toBe('gpt-5-mini')
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
