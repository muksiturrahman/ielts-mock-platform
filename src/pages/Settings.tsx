import { Database, Download, RotateCcw, Upload, User, Volume2 } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { Button, Card, PageHeader, useToast } from '../components/ui'
import { ensureSeeded } from '../data/seed'
import { AISection } from './AISettings'
import { speak } from '../lib/speech'
import { clearAllMedia, exportAllMedia, importAllMedia } from '../lib/media'
import { exportBackup, importBackup, resetAll, setProfile, setSettings, useDB } from '../lib/store'


export function Section({ icon, title, desc, children, delay }: { icon: ReactNode; title: string; desc: string; children: ReactNode; delay: number }) {
  return (
    <Card delay={delay} className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
      <div>
        <div className="flex items-center gap-2 font-display text-lg font-bold"><span className="rounded-lg bg-brand-50 p-1.5 text-brand-600">{icon}</span>{title}</div>
        <p className="mt-2 text-sm text-slate-500">{desc}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </Card>
  )
}

export default function Settings() {
  const { settings, profile } = useDB(d => d)
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Everything is stored privately in this browser." />

      <AISection />

      <Section icon={<User size={18} />} title="Candidate profile" delay={0.05} desc="Shown in the exam header and printed on your Test Report Form.">
        <div className="grid gap-4 sm:grid-cols-2">
          {([['name', 'Full name'], ['candidateId', 'Candidate number'], ['dob', 'Date of birth'], ['nationality', 'Country / region'], ['firstLanguage', 'First language']] as const).map(([k, l]) => (
            <label key={k}><span className="label">{l}</span><input className="input" type={k === 'dob' ? 'date' : 'text'} value={profile[k]} onChange={e => setProfile({ [k]: e.target.value })} /></label>
          ))}
          <label><span className="label">Target band</span>
            <select className="input" value={profile.targetBand} onChange={e => setProfile({ targetBand: Number(e.target.value) })}>
              {Array.from({ length: 11 }, (_, i) => 4 + i / 2).map(b => <option key={b} value={b}>{b.toFixed(1)}</option>)}
            </select>
          </label>
        </div>
      </Section>

      <Section icon={<Volume2 size={18} />} title="Exam display & audio" delay={0.1} desc="Defaults for the exam screen. You can also change text size and colours during a test from the settings icon.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="label">Text size</span>
            <select className="input" value={settings.fontScale} onChange={e => setSettings({ fontScale: Number(e.target.value) })}>
              <option value={0.9}>Small</option><option value={1}>Standard</option><option value={1.15}>Large</option><option value={1.3}>Extra large</option>
            </select>
          </label>
          <label><span className="label">Colours</span>
            <select className="input" value={settings.contrast} onChange={e => setSettings({ contrast: e.target.value as typeof settings.contrast })}>
              <option value="standard">Black on white</option><option value="yellow-black">Yellow on black</option><option value="white-black">White on black</option>
            </select>
          </label>
        </div>
        <label>
          <span className="label">Recording voice speed · {settings.ttsRate.toFixed(2)}×</span>
          <div className="flex items-center gap-3">
            <input type="range" min={0.75} max={1.15} step={0.05} value={settings.ttsRate} onChange={e => setSettings({ ttsRate: Number(e.target.value) })} className="flex-1 accent-brand-600" />
            <Button size="sm" variant="secondary" onClick={() => speak('Good morning. This is how the examiner and the listening recordings will sound.', { rate: settings.ttsRate })}><Volume2 size={14} /> Preview</Button>
          </div>
          <span className="mt-1 block text-xs text-slate-400">Used when a listening part has no uploaded audio, and for the speaking examiner.</span>
        </label>
        <label><span className="label">Examiner name (for reviews)</span><input className="input" value={settings.examinerName} onChange={e => setSettings({ examinerName: e.target.value })} /></label>
      </Section>

      <Section icon={<Database size={18} />} title="Data" delay={0.15} desc="Back up tests, results, recordings and settings to a file, or move them to another browser. API keys are not included in the file.">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={async () => {
            const a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([exportBackup(await exportAllMedia().catch(() => ({})))], { type: 'application/json' }))
            a.download = `bandready-backup-${new Date().toISOString().slice(0, 10)}.json`
            a.click()
            setTimeout(() => URL.revokeObjectURL(a.href), 1000)
          }}><Download size={16} /> Download backup</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload size={16} /> Restore backup</Button>
          <Button variant="danger" onClick={async () => {
            if (!confirm('Delete all attempts, recordings, custom tests and settings? This cannot be undone.')) return
            resetAll(); ensureSeeded()
            try { await clearAllMedia(); toast('Everything was reset') } catch { toast('Reset done, but saved recordings could not be deleted', 'error') }
          }}><RotateCcw size={16} /> Reset everything</Button>
          <input ref={fileRef} type="file" hidden accept="application/json" onChange={async e => {
            const f = e.target.files?.[0]
            if (!f) return
            if (!confirm('Restoring replaces all tests, results and settings in this browser with the backup. Continue?')) { e.target.value = ''; return }
            try { await importAllMedia(importBackup(await f.text())); toast('Backup restored', 'success') } catch (err) { toast(`Restore failed: ${(err as Error).message}`, 'error') }
            e.target.value = ''
          }} />
        </div>
      </Section>
    </div>
  )
}
