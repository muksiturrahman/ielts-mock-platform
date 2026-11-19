import { AnimatePresence, motion } from 'motion/react'
import { Check, Languages, Plus, RotateCcw, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, PageHeader, cx } from '../components/ui'
import { VOCAB_TOPICS, type TopicWord } from '../data/vocab'
import { addVocab, useDB } from '../lib/store'

const shuffle = <T,>(xs: T[]) => xs.map(x => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map(x => x[1])
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** The example sentence with the item blanked out, or the definition if the sentence doesn't contain it verbatim. */
export function gapOf(w: TopicWord): string {
  const re = new RegExp(`\\b${escape(w.word)}\\b`, 'i')
  return re.test(w.example) ? w.example.replace(re, '_____') : `Which word or phrase means: “${w.meaning}”?`
}

interface Q { word: TopicWord; options: string[] }
const makeQuiz = (words: TopicWord[]): Q[] =>
  shuffle(words).slice(0, 10).map(w => ({ word: w, options: shuffle([w.word, ...shuffle(words.filter(x => x !== w)).slice(0, 3).map(x => x.word)]) }))

export default function Vocabulary() {
  const [topicId, setTopicId] = useState(VOCAB_TOPICS[0].id)
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn')
  const topic = VOCAB_TOPICS.find(t => t.id === topicId)!
  return (
    <div>
      <PageHeader title="Vocabulary" subtitle="Topic words that lift Lexical Resource in Writing and Speaking. Learn them, test yourself, and save the ones you want to review." />
      <div className="mb-4 flex flex-wrap gap-2">
        {VOCAB_TOPICS.map(t => (
          <button key={t.id} aria-pressed={t.id === topicId} onClick={() => setTopicId(t.id)}
            className={cx('rounded-lg border px-3 py-1.5 text-sm font-medium transition', t.id === topicId ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300')}>{t.title}</button>
        ))}
      </div>
      <div className="mb-6 flex items-center gap-2">
        <Button size="sm" variant={mode === 'learn' ? 'dark' : 'secondary'} aria-pressed={mode === 'learn'} onClick={() => setMode('learn')}>Learn</Button>
        <Button size="sm" variant={mode === 'quiz' ? 'dark' : 'secondary'} aria-pressed={mode === 'quiz'} onClick={() => setMode('quiz')}>Quiz</Button>
        <Link to="/mistakes?tab=vocabulary" className="ml-auto text-sm font-semibold text-brand-600 hover:underline">My saved words →</Link>
      </div>
      {mode === 'learn' ? <Learn words={topic.words} /> : <Quiz key={topic.id} words={topic.words} />}
    </div>
  )
}

function SaveButton({ w }: { w: TopicWord }) {
  const saved = useDB(d => (d.vocab ?? []).some(v => v.word.toLowerCase() === w.word.toLowerCase()))
  return (
    <Button size="sm" variant="secondary" disabled={saved} onClick={() => addVocab(w.word, `${w.meaning} — e.g. ${w.example}`)}>
      {saved ? <><Check size={14} /> Saved</> : <><Plus size={14} /> Save</>}
    </Button>
  )
}

function Learn({ words }: { words: TopicWord[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {words.map((w, i) => (
        <Card key={w.word} delay={i * 0.02} className="p-4">
          <div className="mb-1 flex items-start justify-between gap-3">
            <div className="font-display text-lg font-bold text-slate-900">{w.word}</div>
            <SaveButton w={w} />
          </div>
          <div className="text-sm text-slate-600">{w.meaning}</div>
          <div className="mt-2 text-sm italic text-slate-500">“{w.example}”</div>
        </Card>
      ))}
    </div>
  )
}

function Quiz({ words }: { words: TopicWord[] }) {
  const [quiz, setQuiz] = useState(() => makeQuiz(words))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const q = quiz[i]
  const answered = picked[i] !== undefined
  const score = useMemo(() => picked.filter((p, n) => p === quiz[n].word.word).length, [picked, quiz])
  if (!q) {
    const missed = quiz.filter((x, n) => picked[n] !== x.word.word)
    return (
      <Card className="p-6">
        <div className="font-display text-2xl font-bold">{score} / {quiz.length}</div>
        <p className="mb-4 text-sm text-slate-500">{missed.length ? 'Save the ones you missed to review them later.' : 'All correct — try another topic.'}</p>
        <div className="space-y-2">
          {missed.map(x => <div key={x.word.word} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"><div><b>{x.word.word}</b> <span className="text-sm text-slate-500">— {x.word.meaning}</span></div><SaveButton w={x.word} /></div>)}
        </div>
        <Button className="mt-5" onClick={() => { setQuiz(makeQuiz(words)); setI(0); setPicked([]) }}><RotateCcw size={15} /> New quiz</Button>
      </Card>
    )
  }
  return (
    <Card className="p-6">
      <div className="mb-1 text-xs font-semibold uppercase text-slate-400">Question {i + 1} of {quiz.length} · score {score}</div>
      <p className="mb-5 text-lg text-slate-800">{gapOf(q.word)}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map(o => {
          const right = o === q.word.word
          const mine = picked[i] === o
          return (
            <button key={o} disabled={answered} onClick={() => setPicked(p => { const n = [...p]; n[i] = o; return n })}
              className={cx('flex items-center justify-between rounded-xl border px-4 py-3 text-left font-medium transition',
                !answered && 'border-slate-200 hover:border-brand-400 hover:bg-brand-50',
                answered && right && 'border-emerald-500 bg-emerald-50 text-emerald-800',
                answered && mine && !right && 'border-rose-400 bg-rose-50 text-rose-800',
                answered && !right && !mine && 'border-slate-100 text-slate-400')}>
              {o}{answered && right && <Check size={16} />}{answered && mine && !right && <X size={16} />}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex flex-wrap items-center gap-3">
            <span className="flex-1 text-sm text-slate-600"><Languages size={14} className="mr-1 inline" /><b>{q.word.word}</b>: {q.word.meaning}</span>
            <Button onClick={() => setI(i + 1)}>{i + 1 < quiz.length ? 'Next' : 'See score'}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
