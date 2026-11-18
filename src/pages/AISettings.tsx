import { motion } from 'motion/react'
import { CheckCircle2, ExternalLink, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge, Button, cx, useToast } from '../components/ui'
import { listModels, PROVIDER_ORDER, PROVIDERS, suitableModels, testConnection } from '../lib/ai'
import { setSettings, useDB } from '../lib/store'
import type { AIProvider } from '../lib/types'
import { Section } from './Settings'

export function AISection() {
  const settings = useDB(d => d.settings)
  const toast = useToast()
  const p = settings.provider
  const info = PROVIDERS[p]
  const key = settings.keys[p] ?? ''
  const [show, setShow] = useState(false)
  const [testing, setTesting] = useState(false)
  const [models, setModels] = useState<string[]>([])

  // Load the short list of models that suit marking whenever the provider or key changes.
  useEffect(() => {
    setModels([])
    if (!key) return
    let live = true
    const t = setTimeout(() => void listModels(p, key).then(ids => live && setModels(suitableModels(p, ids))).catch(() => {}), 400)
    return () => { live = false; clearTimeout(t) }
  }, [p, key])
  const chosen = settings.models[p] ?? ''
  const auto = settings.autoModels?.[p] || info.defaultModel
  const options = [...new Set([...(chosen ? [chosen] : []), ...models])]

  return (
    <Section icon={<KeyRound size={18} />} title="AI marking" delay={0}
      desc="Writing and Speaking are marked by an AI examiner against the four official criteria. Pick a provider — Gemini and Groq are free. Keys are stored only in this browser and sent only to that provider.">
      <div className="grid gap-2 sm:grid-cols-2">
        {PROVIDER_ORDER.map((id: AIProvider) => {
          const pi = PROVIDERS[id]
          const on = id === p
          return (
            <motion.button key={id} aria-pressed={on} whileTap={{ scale: 0.98 }} onClick={() => setSettings({ provider: id })}
              className={cx('relative rounded-2xl border p-3.5 text-left transition', on ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100' : 'border-slate-200 bg-white hover:border-slate-300')}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">{pi.label}</span>
                <span className="flex items-center gap-1.5">
                  {settings.keys[id] && <CheckCircle2 size={15} className="text-emerald-500" aria-label="Key saved" />}
                  <Badge tone={pi.free ? 'green' : 'slate'}>{pi.free ? 'Free' : 'Paid'}</Badge>
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{pi.tagline}</div>
              {id === 'gemini' && <span className="absolute -top-2 left-3 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Recommended</span>}
            </motion.button>
          )
        })}
      </div>

      <label>
        <span className="label flex items-center justify-between">
          {info.label} API key
          <a href={info.keyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 normal-case tracking-normal text-brand-600 hover:underline">
            {info.free ? 'Get a free key' : 'Get a key'} <ExternalLink size={12} />
          </a>
        </span>
        <div className="flex gap-2">
          <input className="input font-mono" type={show ? 'text' : 'password'} autoComplete="off" spellCheck={false} placeholder="Paste your key"
            value={key} onChange={e => setSettings({ keys: { ...settings.keys, [p]: e.target.value.trim() }, autoModels: { ...settings.autoModels, [p]: undefined } })} />
          <Button variant="secondary" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide key' : 'Show key'}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</Button>
        </div>
        {info.free && <span className="mt-1 block text-xs text-slate-400">Free tiers have daily limits. If you hit one, switch to another free provider — keys for each are remembered.</span>}
      </label>

      <label>
        <span className="label">Model</span>
        <select className="input" value={chosen} disabled={!key}
          onChange={e => setSettings({ models: { ...settings.models, [p]: e.target.value } })}>
          <option value="">Automatic (recommended){auto ? ` — using ${auto}` : ''}</option>
          {options.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <span className="mt-1 block text-xs text-slate-400">
          {chosen ? 'Fixed model. Switch back to Automatic if it gets slow or busy.' : p === 'gemini' || p === 'openai' ? 'Automatic tests the best models for your key and uses the best one that answers. If it gets busy, the app switches by itself.' : 'Automatic uses the recommended model for this provider and switches by itself if it gets busy.'}
        </span>
      </label>

      <div>
        <Button variant="dark" disabled={!key || testing} onClick={async () => {
          setTesting(true)
          try { const m = await testConnection(); toast(`Connected to ${info.label} (${m}) — AI marking is ready`, 'success') } catch (e) { toast((e as Error).message, 'error') } finally { setTesting(false) }
        }}>
          {testing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} {testing ? 'Testing…' : 'Test connection'}
        </Button>
      </div>
    </Section>
  )
}
