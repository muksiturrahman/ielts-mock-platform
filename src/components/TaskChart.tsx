import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartData } from '../lib/types'

const COLORS = ['#1d4ed8', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#4b5563']

/** Renders Writing Task 1 visuals from data, so they stay sharp at any size and contrast. */
export function TaskChart({ chart }: { chart: ChartData }) {
  const rows = chart.categories.map((c, i) => Object.fromEntries([['name', c], ...chart.series.map(s => [s.name, s.values[i]])]))
  const unit = chart.unit ? ` ${chart.unit}` : ''

  if (chart.kind === 'table') {
    return (
      <figure>
        <figcaption className="mb-2 text-center font-semibold">{chart.title}</figcaption>
        <table className="exam-table text-[0.9em]">
          <thead>
            <tr><th>{chart.xLabel ?? ''}</th>{chart.series.map(s => <th key={s.name}>{s.name}</th>)}</tr>
          </thead>
          <tbody>
            {chart.categories.map((c, i) => (
              <tr key={c}><th className="text-left">{c}</th>{chart.series.map(s => { const v = s.values[i] as number | null; return <td key={s.name} className="text-center">{v ?? '—'}{v != null && chart.unit === '%' ? '%' : ''}</td> })}</tr>
            ))}
          </tbody>
        </table>
        {chart.unit && chart.unit !== '%' && <p className="mt-1 text-xs opacity-60">Figures in {chart.unit}</p>}
      </figure>
    )
  }

  if (chart.kind === 'pie') {
    return (
      <figure>
        <figcaption className="mb-2 text-center font-semibold">{chart.title}</figcaption>
        <div className="grid gap-2 sm:grid-cols-2">
          {chart.series.map(s => (
            <div key={s.name} className="text-center">
              <div className="text-sm font-semibold">{s.name}</div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={chart.categories.map((c, i) => ({ name: c, value: s.values[i] }))} dataKey="value" nameKey="name" outerRadius={85}
                    label={({ value }) => `${value}${unit.trim() === "%" ? "%" : ""}`} isAnimationActive={false}>
                    {chart.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
        <div className="mt-1 flex flex-wrap justify-center gap-3 text-xs">
          {chart.categories.map((c, i) => <span key={c} className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />{c}</span>)}
        </div>
      </figure>
    )
  }

  const Chart = chart.kind === 'line' ? LineChart : BarChart
  return (
    <figure>
      <figcaption className="mb-2 text-center font-semibold">{chart.title}</figcaption>
      <ResponsiveContainer width="100%" height={300}>
        <Chart data={rows} margin={{ top: 8, right: 16, left: 4, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'currentColor' }} label={chart.xLabel ? { value: chart.xLabel, position: 'insideBottom', offset: -10, fontSize: 12 } : undefined} />
          <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} label={chart.yLabel ? { value: chart.yLabel, angle: -90, position: 'insideLeft', fontSize: 12 } : undefined} />
          <Tooltip formatter={v => `${v}${unit}`} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 13, paddingBottom: 8 }} />
          {chart.series.map((s, i) =>
            chart.kind === 'line'
              ? <Line key={s.name} type="monotone" dataKey={s.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={{ r: 3 }} />
              : <Bar key={s.name} dataKey={s.name} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />,
          )}
        </Chart>
      </ResponsiveContainer>
    </figure>
  )
}
