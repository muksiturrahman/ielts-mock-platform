import { motion } from 'motion/react'
import { CheckCircle2, ExternalLink, Eye, EyeOff, KeyRound, Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge, Button, cx, useToast } from '../components/ui'
import { listModels, PROVIDER_ORDER, PROVIDERS, testConnection } from '../lib/ai'
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
  const [loading, setLoading] = useState(false)

  useEffect(() => setModels([]), [p])

  const loadModels = async () => {
    setLoading(true)
    try {
      const ids = await listModels(p, key)
      setModels(ids)
      toast(`${ids.length} models available`, 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }
  const options = [...new Set([...(settings.models[p] ? [settings.models[p]!] : []), ...info.suggested, ...models])]

  return (
    <Section icon={<KeyRound size={18} />} title="AI marking" delay={0}
      desc="Writing and Speaking are marked by an AI examiner against the four official criteria. Pick a provider — Gemini and Groq are free. Keys are stored only in this browser and sent only to that provider.">
      <div className="grid gap-2 sm:grid-cols-2">
        {PROVIDER_ORDER.map((id: AIProvider) => {
          const pi = PROVIDERS[id]
          const on = id === p
          return (
            <motion.button key={id} whileTap={{ scale: 0.98 }} onClick={() => setSettings({ provider: id })}
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
            value={key} onChange={e => setSettings({ keys: { ...settings.keys, [p]: e.target.value.trim() } })} />
          <Button variant="secondary" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide key' : 'Show key'}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</Button>
        </div>
        {info.free && <span className="mt-1 block text-xs text-slate-400">Free tiers have daily limits. If you hit one, switch to another free provider — keys for each are remembered.</span>}
      </label>

      <label>
        <span className="label">Model</span>
        <div className="flex gap-2">
          <input className="input" list={`models-${p}`} placeholder={info.defaultModel || 'Automatic — best available model'}
            value={settings.models[p] ?? ''} onChange={e => setSettings({ models: { ...settings.models, [p]: e.target.value.trim() } })} />
          <datalist id={`models-${p}`}>{options.map(m => <option key={m} value={m} />)}</datalist>
          <Button variant="secondary" disabled={!key || loading} onClick={loadModels} title="Load the models this key can use">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Load
          </Button>
        </div>
        <span className="mt-1 block text-xs text-slate-400">Leave empty for the recommended default{info.defaultModel ? ` (${info.defaultModel})` : ', picked automatically from your key’s models'}.</span>
      </label>

      <div>
        <Button variant="dark" disabled={!key || testing} onClick={async () => {
          setTesting(true)
          try { await testConnection(); toast(`Connected to ${info.label} — AI marking is ready`, 'success') } catch (e) { toast((e as Error).message, 'error') } finally { setTesting(false) }
        }}>
          {testing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Test connection
        </Button>
      </div>
    </Section>
  )
}
