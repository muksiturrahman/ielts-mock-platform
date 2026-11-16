import { Download } from 'lucide-react'
import { Button, fmtBand } from '../components/ui'
import { attemptOverall, moduleBands } from '../lib/attempts'
import { useDB } from '../lib/store'
import type { Attempt } from '../lib/types'

const CEFR = (b?: number) => (b === undefined ? '–' : b >= 8.5 ? 'C2' : b >= 7 ? 'C1' : b >= 5.5 ? 'B2' : b >= 4 ? 'B1' : 'A2')

/** Official-style Test Report Form. Printing (Save as PDF) gives the downloadable TRF. */
export function TestReportForm({ attempt }: { attempt: Attempt }) {
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
        <div className="flex items-start justify-between border-b-4 border-[#e11d2e] pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{attempt.variant === 'academic' ? 'Academic' : 'General Training'}</div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Test Report Form</h1>
            <div className="text-xs text-slate-500">BandReady practice result — not an official IELTS certificate</div>
          </div>
          <span className="rounded bg-[#e11d2e] px-3 py-1 text-lg font-black tracking-wide text-white">IELTS</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-8">
          <Field label="Centre number" value="BR001" />
          <Field label="Test date" value={date} />
          <Field label="Candidate name" value={p.name} />
          <Field label="Candidate number" value={p.candidateId} />
          <Field label="Date of birth" value={p.dob} />
          <Field label="Country or region of origin" value={p.nationality} />
          <Field label="First language" value={p.firstLanguage} />
          <Field label="Test" value={attempt.testTitle} />
        </div>

        <div className="mt-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Test results</div>
        <div className="mt-2 grid grid-cols-6 overflow-hidden rounded-xl border border-slate-300 text-center">
          {([['Listening', b.listening], ['Reading', b.reading], ['Writing', b.writing], ['Speaking', b.speaking]] as const).map(([k, v]) => (
            <div key={k} className="border-r border-slate-300 p-3">
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
            <div className="mb-1 font-semibold uppercase text-slate-500">Administrator comments</div>
            <p>{attempt.review?.feedback ? attempt.review.feedback.slice(0, 280) : attempt.tabSwitches ? `Candidate left the test window ${attempt.tabSwitches} time(s).` : 'No comments.'}</p>
          </div>
          <div className="text-right">
            <div className="mb-1 font-semibold uppercase text-slate-500">Test report form number</div>
            <div className="font-mono text-sm font-bold text-slate-900">{ref}</div>
            <div className="mt-4 font-semibold uppercase text-slate-500">Marking</div>
            <div>{attempt.review ? `Examiner reviewed (${attempt.review.examiner})` : 'Listening/Reading auto-marked · Writing/Speaking AI-marked'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
