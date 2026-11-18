import { Download } from 'lucide-react'
import { useEffect } from 'react'
import { applyTheme } from '../lib/theme'
import { Button, fmtBand } from '../components/ui'
import { attemptOverall, moduleBands } from '../lib/attempts'
import { useDB } from '../lib/store'
import type { Attempt } from '../lib/types'

const CEFR = (b?: number) => (b === undefined ? '–' : b >= 8.5 ? 'C2' : b >= 7 ? 'C1' : b >= 5.5 ? 'B2' : b >= 4 ? 'B1' : 'A2')

/** BandReady score report (a practice summary, not the official form). Printing (Save as PDF) downloads it. */
export function TestReportForm({ attempt }: { attempt: Attempt }) {
  // The report is printed on paper: drop the dark theme while printing.
  useEffect(() => {
    const light = () => document.documentElement.classList.remove('dark')
    window.addEventListener('beforeprint', light)
    window.addEventListener('afterprint', applyTheme)
    return () => { window.removeEventListener('beforeprint', light); window.removeEventListener('afterprint', applyTheme) }
  }, [])
  const p = useDB(d => d.profile)
  const b = moduleBands(attempt)
  const overall = attemptOverall(attempt)
  const ref = `BR-${attempt.id.slice(-8).toUpperCase()}`
  const date = new Date(attempt.finishedAt ?? attempt.startedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  const Field = ({ label, value }: { label: string; value?: string }) => (
    <div className="border-b border-slate-300 py-1.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="min-h-5 font-mono text-sm font-semibold uppercase text-slate-900">{value || '—'}</div>
    </div>
  )

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Use “Save as PDF” in the print dialog to download your report.</p>
        <Button variant="dark" onClick={() => window.print()}><Download size={16} /> Download PDF</Button>
      </div>
      <div className="print-page mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* Deliberately not the official form's look (no IELTS mark, centre number or "Test Report Form"):
            a printed practice report must never pass as a real result. */}
        <div className="flex items-start justify-between border-b-4 border-brand-600 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{attempt.variant === 'academic' ? 'Academic' : 'General Training'} practice test</div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">BandReady Score Report</h1>
            <div className="text-xs font-semibold text-slate-600">Practice result — not an official IELTS score and not valid for any application</div>
          </div>
          <span className="rounded bg-brand-600 px-3 py-1 text-lg font-black tracking-wide text-white">BandReady</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-8">
          <Field label="Practice date" value={date} />
          <Field label="Candidate name" value={p.name} />
          <Field label="Candidate ID (self-chosen)" value={p.candidateId} />
          <Field label="Date of birth" value={p.dob} />
          <Field label="Country or region of origin" value={p.nationality} />
          <Field label="First language" value={p.firstLanguage} />
          <Field label="Test" value={attempt.testTitle} />
        </div>

        <div className="mt-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Test results</div>
        <div className="mt-2 grid grid-cols-2 overflow-hidden sm:grid-cols-6 rounded-xl border border-slate-300 text-center">
          {([['Listening', b.listening], ['Reading', b.reading], ['Writing', b.writing], ['Speaking', b.speaking]] as const).map(([k, v]) => (
            <div key={k} className="border-b border-r border-slate-300 p-3 even:border-r-0 sm:border-b-0 sm:even:border-r">
              <div className="text-[10px] font-semibold uppercase text-slate-500">{k}</div>
              <div className="font-display text-3xl font-extrabold text-slate-900">{fmtBand(v)}</div>
            </div>
          ))}
          <div className="col-span-2 bg-slate-900 p-3 text-white">
            <div className="text-[10px] font-semibold uppercase text-white/70">Overall band score</div>
            <div className="font-display text-4xl font-extrabold">{fmtBand(overall)}</div>
            <div className="text-[10px] text-white/70">CEFR level {CEFR(overall)}</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 text-xs text-slate-600">
          <div>
            <div className="mb-1 font-semibold uppercase text-slate-500">Comments</div>
            <p>{attempt.review?.feedback ? clip(attempt.review.feedback, 280) : attempt.tabSwitches ? `Candidate left the test window ${attempt.tabSwitches} time(s).` : 'No comments.'}</p>
          </div>
          <div className="text-right">
            <div className="mb-1 font-semibold uppercase text-slate-500">Report reference</div>
            <div className="font-mono text-sm font-bold text-slate-900">{ref}</div>
            <div className="mt-4 font-semibold uppercase text-slate-500">Marking</div>
            <div>{markingLine(attempt)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)

/** How each module was actually marked — never claims marking that didn't happen. */
function markingLine(a: Attempt): string {
  const parts: string[] = []
  const auto = (['listening', 'reading'] as const).filter(m => a.results[m])
  if (auto.length) parts.push(`${auto.map(m => m[0].toUpperCase() + m.slice(1)).join('/')} auto-marked`)
  const who = a.review?.examiner?.trim() || 'examiner'
  for (const m of ['writing', 'speaking'] as const) {
    if (!a.modules.includes(m)) continue
    const name = m[0].toUpperCase() + m.slice(1)
    const r = a.results[m]
    const marks = countMarks(m === 'writing' ? a.review?.writing : a.review?.speaking)
    const full = m === 'writing' ? 4 * (a.writingTasks?.length ?? 2) : 4
    const blank = m === 'writing' && r?.status === 'done' && !a.results.writing?.task1?.wordCount && !a.results.writing?.task2?.wordCount
    if (marks >= full) parts.push(`${name} examiner-marked (${who})`)
    else if (blank) parts.push(`${name}: no response (0)`)
    else if (r?.status === 'done') parts.push(marks ? `${name} AI-marked, examiner-reviewed (${who})` : `${name} AI-marked`)
    else if (marks) parts.push(`${name} partly examiner-marked (${who})`)
    else parts.push(`${name} not marked`)
  }
  return parts.join(' · ') || 'Not marked'
}

/** Number of criteria an examiner actually set (nested objects of bands). */
const countMarks = (o: unknown): number => (typeof o === 'number' ? 1 : o && typeof o === 'object' ? Object.values(o).reduce((n: number, v) => n + countMarks(v), 0) : 0)
