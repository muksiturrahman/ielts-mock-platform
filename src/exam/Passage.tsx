import { AnimatePresence, motion } from 'motion/react'
import { Eraser, Highlighter, StickyNote } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Highlight } from '../lib/types'
import { useDialogFocus } from '../components/ui'

interface Props {
  title?: string
  text: string
  highlights: Highlight[]
  onChange: (h: Highlight[]) => void
}

interface Block {
  kind: 'p' | 'h'
  label?: string
  text: string
}

/** Blank lines split paragraphs; "## " lines are sub-headings; "A| text" labels a paragraph. */
export function parsePassage(text: string): Block[] {
  const blocks: Block[] = []
  for (const chunk of text.replace(/\r/g, '').split(/\n\s*\n/)) {
    let para: string[] = []
    const flush = () => {
      const t = para.join(' ').trim()
      para = []
      if (!t) return
      const m = t.match(/^([A-Z])\|\s*(.*)$/)
      blocks.push(m ? { kind: 'p', label: m[1], text: m[2] } : { kind: 'p', text: t })
    }
    for (const line of chunk.split('\n')) {
      if (line.startsWith('## ')) {
        flush()
        blocks.push({ kind: 'h', text: line.slice(3).trim() })
      } else para.push(line.trim())
    }
    flush()
  }
  return blocks
}

function offsetIn(container: Node, node: Node, offset: number): number {
  const r = document.createRange()
  r.setStart(container, 0)
  r.setEnd(node, offset)
  return r.toString().length
}

function renderMarked(text: string, hs: Highlight[], onMarkClick: (h: Highlight, e: React.MouseEvent) => void): ReactNode[] {
  const sorted = [...hs].sort((a, b) => a.start - b.start)
  const out: ReactNode[] = []
  let pos = 0
  for (const h of sorted) {
    if (h.start < pos) continue
    if (h.start > pos) out.push(text.slice(pos, h.start))
    out.push(
      <mark key={h.id} data-hl={h.id} title={h.note || undefined} className={`hl${h.note ? ' has-note' : ''}`} onClick={e => onMarkClick(h, e)}>
        {text.slice(h.start, h.end)}
      </mark>,
    )
    pos = h.end
  }
  out.push(text.slice(pos))
  return out
}

/** Passage with the CD-IELTS right-click menu: Highlight / Add note / Clear. */
export function Passage({ title, text, highlights, onChange }: Props) {
  const blocks = parsePassage(text)
  const ref = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<{ x: number; y: number; sel?: { paragraph: number; start: number; end: number }; hl?: Highlight } | null>(null)
  const [noteFor, setNoteFor] = useState<Highlight | null>(null)
  const [noteText, setNoteText] = useState('')
  const noteRef = useDialogFocus<HTMLDivElement>(!!noteFor, () => setNoteFor(null))

  useEffect(() => {
    const close = () => setMenu(null)
    window.addEventListener('click', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [])

  const currentSelection = () => {
    const s = window.getSelection()
    if (!s || s.isCollapsed || !s.rangeCount) return undefined
    const range = s.getRangeAt(0)
    const pEl = (range.startContainer.parentElement as HTMLElement | null)?.closest('[data-para]') as HTMLElement | null
    const pEnd = (range.endContainer.parentElement as HTMLElement | null)?.closest('[data-para]') as HTMLElement | null
    if (!pEl || pEl !== pEnd || !ref.current?.contains(pEl)) return undefined // one paragraph at a time, like the real test
    const textEl = pEl.querySelector('[data-text]')!
    const start = offsetIn(textEl, range.startContainer, range.startOffset)
    const end = offsetIn(textEl, range.endContainer, range.endOffset)
    return end > start ? { paragraph: Number(pEl.dataset.para), start, end } : undefined
  }

  // Touch screens have no right-click: open the menu under a finished text selection instead.
  useEffect(() => {
    if (!matchMedia('(any-pointer: coarse)').matches) return // touch laptops report a fine primary pointer
    let t = 0
    const onSel = () => {
      clearTimeout(t)
      t = window.setTimeout(() => {
        const sel = currentSelection()
        if (!sel) return
        const r = window.getSelection()!.getRangeAt(0).getBoundingClientRect()
        // Below the selection, or above it when there's no room underneath.
        setMenu({ x: r.left, y: r.bottom + 160 < innerHeight ? r.bottom + 12 : Math.max(8, r.top - 160), sel })
      }, 450)
    }
    document.addEventListener('selectionchange', onSel)
    return () => { clearTimeout(t); document.removeEventListener('selectionchange', onSel) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- currentSelection only reads the DOM

  const addHighlight = (sel: { paragraph: number; start: number; end: number }, note?: string) => {
    const others = highlights.filter(h => h.paragraph !== sel.paragraph || h.end <= sel.start || h.start >= sel.end)
    const h: Highlight = { id: `h${Date.now()}`, ...sel, note }
    onChange([...others, h])
    window.getSelection()?.removeAllRanges()
    return h
  }

  return (
    <div
      ref={ref}
      className="passage relative select-text"
      onContextMenu={e => {
        const sel = currentSelection()
        const hlId = (e.target as HTMLElement).closest('mark')?.getAttribute('data-hl')
        const hl = highlights.find(h => h.id === hlId)
        if (!sel && !hl) return
        e.preventDefault()
        setMenu({ x: e.clientX, y: e.clientY, sel, hl })
      }}
    >
      {title && <h2 className="mb-4 text-center text-[1.35em] font-bold">{title}</h2>}
      {blocks.map((b, i) =>
        b.kind === 'h' ? (
          <h3 key={i} className="mb-2 mt-5 text-[1.05em] font-bold">{b.text}</h3>
        ) : (
          <p key={i} data-para={i} className="flex gap-3">
            {b.label && <span className="mt-0.5 shrink-0 font-bold">{b.label}</span>}
            <span data-text>{renderMarked(b.text, highlights.filter(h => h.paragraph === i), (h, e) => { e.stopPropagation(); setMenu({ x: e.clientX, y: e.clientY, hl: h }) })}</span>
          </p>
        ),
      )}

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ position: 'fixed', left: Math.max(8, Math.min(menu.x, innerWidth - 200)), top: Math.max(8, Math.min(menu.y, innerHeight - 180)) }}
            className="z-50 min-w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm text-slate-800 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {menu.sel && (
              <>
                <MenuItem icon={<Highlighter size={15} />} onClick={() => { addHighlight(menu.sel!); setMenu(null) }}>Highlight</MenuItem>
                <MenuItem icon={<StickyNote size={15} />} onClick={() => { const h = addHighlight(menu.sel!); setNoteFor(h); setNoteText(''); setMenu(null) }}>Add note</MenuItem>
              </>
            )}
            {menu.hl && (
              <>
                {menu.hl.note && <p className="max-w-64 whitespace-pre-wrap border-b border-slate-100 px-3 py-2 text-slate-600">{menu.hl.note}</p>}
                <MenuItem icon={<StickyNote size={15} />} onClick={() => { setNoteFor(menu.hl!); setNoteText(menu.hl!.note ?? ''); setMenu(null) }}>{menu.hl.note ? 'Edit note' : 'Add note'}</MenuItem>
                <MenuItem icon={<Eraser size={15} />} onClick={() => { onChange(highlights.filter(h => h.id !== menu.hl!.id)); setMenu(null) }}>Clear</MenuItem>
              </>
            )}
            <MenuItem icon={<Eraser size={15} />} onClick={() => { onChange([]); setMenu(null) }}>Clear all</MenuItem>
          </motion.div>
        )}
        {noteFor && (
          <motion.div ref={noteRef} role="dialog" aria-label="Note" tabIndex={-1} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-24 left-1/2 z-50 w-80 max-w-[calc(100vw-2rem)] outline-none -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-slate-800 shadow-2xl">
            <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Note</div>
            <textarea autoFocus value={noteText} onChange={e => setNoteText(e.target.value)} className="h-24 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500" />
            <div className="mt-2 flex justify-end gap-2">
              <button className="rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100" onClick={() => setNoteFor(null)}>Cancel</button>
              <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => {
                onChange(highlights.map(h => (h.id === noteFor.id ? { ...h, note: noteText.trim() || undefined } : h)))
                setNoteFor(null)
              }}>Save</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuItem({ icon, children, onClick }: { icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <button className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100" onClick={onClick}>
      {icon}
      {children}
    </button>
  )
}
