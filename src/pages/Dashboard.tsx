import { motion } from 'motion/react'
import { ArrowRight, Award, BarChart3, Flame, Target, TrendingUp, TriangleAlert, Zap, RotateCcw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BandRing, Button, Card, CountUp, Empty, bandColor, fmtBand, fmtDate } from '../components/ui'
import { practiceTarget, progressSeries, skillAverages, weaknesses, type Weakness } from '../lib/analytics'
import { reviewItems } from '../lib/review'
import { createAttempt } from '../lib/attempts'
import { isDue } from '../lib/store'
import { attemptOverall, MODULE_LABEL } from '../lib/attempts'
import { useDB } from '../lib/store'
import type { ModuleKey } from '../lib/types'
import { MODULE_ICON, MODULE_TONE } from './Tests'

const LINE_COLORS: Record<string, string> = { listening: '#0ea5e9', reading: '#10b981', writing: '#f59e0b', speaking: '#d946ef', overall: '#4f46e5' }

export default function Dashboard() {
  const attempts = useDB(d => d.attempts)
  const profile = useDB(d => d.profile)
  const navigate = useNavigate()
  const done = attempts.filter(a => a.status === 'completed')
  const inProgress = attempts.filter(a => a.status === 'in_progress')
  const overalls = done.map(attemptOverall).filter((x): x is number => x !== undefined)
  const latest = overalls.at(-1)
  const best = overalls.length ? Math.max(...overalls) : undefined
  const skills = skillAverages(done)
  const series = progressSeries(attempts)
  const weak = weaknesses(done)
  const tests = useDB(d => d.tests)
  const reviews = useDB(d => d.reviews)
  const ownVocab = useDB(d => d.vocab)
  const dueCount = reviewItems(attempts, tests, ownVocab).filter(x => isDue(reviews?.[x.key])).length
  const practise = (w: Weakness) => {
    const target = practiceTarget(tests, attempts, w)
    if (!target) return navigate('/tests')
    const a = createAttempt(target.test, { mode: 'practice', modules: [w.module], sections: target.sections, timed: false })
    navigate(`/exam/${a.id}`)
  }
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const streak = (() => {
    const days = new Set(attempts.map(a => new Date(a.startedAt).toDateString()))
    let n = 0
    for (let d = new Date(); days.has(d.toDateString()); d.setDate(d.getDate() - 1)) n++
    return n
  })()

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-2xl shadow-brand-500/25"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 right-40 h-56 w-56 animate-float rounded-full bg-fuchsia-300/20 blur-2xl [animation-delay:2s]" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-white/70">{greet}{profile.name ? `, ${profile.name.split(' ')[0]}` : ''} 👋</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              {latest ? <>You're tracking at band <span className="text-amber-300">{fmtBand(latest)}</span></> : 'Ready for your first mock test?'}
            </h1>
            <p className="mt-2 text-white/80">
              {latest
                ? `Target: band ${fmtBand(profile.targetBand)}. ${latest >= profile.targetBand ? 'You are at or above target — keep it consistent.' : `${(profile.targetBand - latest).toFixed(1)} band to go.`}`
                : 'Sit a full computer-delivered mock or practise one skill at a time. Writing and Speaking are marked by AI against the official criteria.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate('/tests')} className="border-0">
                <Zap size={16} className="text-brand-600" /> Start a mock test
              </Button>
              {dueCount > 0 && (
                <Button variant="ghost" onClick={() => navigate('/mistakes')} className="bg-white/15 text-white hover:bg-white/25">
                  <RotateCcw size={16} /> Review {dueCount} due mistake{dueCount === 1 ? '' : 's'}
                </Button>
              )}
              {inProgress[0] && (
                <Button variant="ghost" onClick={() => navigate(`/exam/${inProgress[0].id}`)} className="bg-white/15 text-white hover:bg-white/25">
                  Resume “{inProgress[0].testTitle}” <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </div>
          <div className="rounded-3xl bg-white/95 p-4 shadow-xl">
            <BandRing band={latest} size={140} label="Latest overall" />
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<BarChart3 size={18} />} label="Tests completed" value={done.length} decimals={0} delay={0.05} />
        <Stat icon={<Award size={18} />} label="Best overall" value={best} delay={0.1} />
        <Stat icon={<Target size={18} />} label="Target band" value={profile.targetBand} delay={0.15} />
        <Stat icon={<Flame size={18} />} label="Day streak" value={streak} decimals={0} delay={0.2} />
      </div>

      {/* Skills */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['listening', 'reading', 'writing', 'speaking'] as ModuleKey[]).map((m, i) => {
          const Icon = MODULE_ICON[m]
          const sk = skills[m]
          const b = sk?.band
          return (
            <Card key={m} delay={0.1 + i * 0.05} className="p-5">
              <div className="flex items-center justify-between">
                <span className={`rounded-xl bg-gradient-to-br p-2 text-white ${MODULE_TONE[m]}`}><Icon size={18} /></span>
                <span className="font-display text-2xl font-extrabold" style={{ color: bandColor(b) }}>{b === undefined ? '–' : <CountUp value={b} />}</span>
              </div>
              <div className="mt-3 font-semibold text-slate-800">{MODULE_LABEL[m]}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div className="h-full rounded-full" style={{ background: bandColor(b) }} initial={{ width: 0 }} animate={{ width: `${((b ?? 0) / 9) * 100}%` }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
              <div className="mt-1.5 text-xs text-slate-400" title={sk?.source === 'practice' ? 'No full mock yet — estimated from practice, which tends to score higher' : 'Average of your last 5 full mocks'}>{sk?.source === 'practice' ? 'Practice estimate' : 'Full-mock average'}</div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2" delay={0.2}>
          <div className="mb-4 flex items-center gap-2 font-display text-lg font-bold"><TrendingUp size={18} className="text-brand-600" /> Score progression</div>
          {series.length < 1 ? (
            <Empty icon={<TrendingUp />} title="No results yet">Complete a test to see your progress over time.</Empty>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={series} margin={{ left: -20, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 9]} ticks={[0, 3, 5, 6, 7, 8, 9]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend />
                {Object.entries(LINE_COLORS).map(([k, c]) => (
                  <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={k === 'overall' ? 3 : 2} dot={{ r: 3 }} connectNulls name={k[0].toUpperCase() + k.slice(1)} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6" delay={0.25}>
          <div className="mb-2 font-display text-lg font-bold">Skill balance</div>
          {Object.keys(skills).length < 3 ? (
            <p className="text-sm text-slate-500">Complete more modules to see your skill profile.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={(['listening', 'reading', 'writing', 'speaking'] as ModuleKey[]).map(m => ({ skill: MODULE_LABEL[m], band: skills[m]?.band ?? 0 }))}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <Radar dataKey="band" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6" delay={0.3}>
          <div className="mb-4 flex items-center gap-2 font-display text-lg font-bold"><TriangleAlert size={18} className="text-amber-500" /> Focus areas</div>
          {weak.length === 0 ? (
            <p className="text-sm text-slate-500">{done.length ? 'No clear weak spots yet — great work. Keep practising every question type.' : 'Your weakest question types and criteria will appear here.'}</p>
          ) : (
            <ul className="space-y-3">
              {weak.map((w, i) => (
                <motion.li key={w.area} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }} className="flex items-center gap-3">
                  <div className="h-10 w-1.5 rounded-full" style={{ background: bandColor(w.score * 9) }} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">{w.area}</div>
                    <div className="text-xs text-slate-500">{w.detail}</div>
                  </div>
                  {w.type && <Link to={`/mistakes?tab=${w.module}&type=${encodeURIComponent(w.type)}`} className="text-xs font-semibold text-slate-500 hover:underline">Mistakes</Link>}
                  <button onClick={() => practise(w)} className="text-xs font-semibold text-brand-600 hover:underline" title={w.type ? `Opens the part with the most ${w.type} questions` : `Practise ${w.module}`}>Practise</button>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6" delay={0.35}>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-lg font-bold">Recent attempts</span>
            <Link to="/history" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
          </div>
          {attempts.length === 0 ? (
            <p className="text-sm text-slate-500">Your attempts will show here.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...attempts].sort((a, b) => b.startedAt - a.startedAt).slice(0, 5).map(a => {
                const o = attemptOverall(a)
                return (
                  <li key={a.id}>
                    <Link to={a.status === 'completed' ? `/results/${a.id}` : `/exam/${a.id}`} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-slate-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl font-display font-extrabold text-white" style={{ background: bandColor(o) }}>{o === undefined ? '…' : fmtBand(o)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-800">{a.testTitle}</div>
                        <div className="text-xs text-slate-500">{a.mode === 'full' ? 'Full mock' : `Practice · ${a.modules.map(m => MODULE_LABEL[m]).join(', ')}`} · {fmtDate(a.startedAt)}</div>
                      </div>
                      {a.status === 'in_progress' && <span className="text-xs font-semibold text-amber-600">Resume</span>}
                      <ArrowRight size={16} className="text-slate-300" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, decimals = 1, delay }: { icon: React.ReactNode; label: string; value?: number; decimals?: number; delay: number }) {
  return (
    <Card delay={delay} className="p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500"><span className="rounded-lg bg-brand-50 p-1.5 text-brand-600">{icon}</span>{label}</div>
      <div className="mt-3 font-display text-3xl font-extrabold text-slate-900">{value === undefined ? '–' : <CountUp value={value} decimals={decimals} />}</div>
    </Card>
  )
}
