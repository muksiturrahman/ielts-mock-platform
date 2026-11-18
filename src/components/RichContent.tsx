import { Fragment, type ReactNode } from 'react'

/** Inline: **bold** and {{n}} answer slots. */
function inline(text: string, slot: (n: number) => ReactNode, keyBase: string): ReactNode[] {
  return text.split(/(\{\{\d+\}\}|\*\*[^*]+\*\*)/g).map((part, i) => {
    const s = part.match(/^\{\{(\d+)\}\}$/)
    if (s) return <Fragment key={`${keyBase}-${i}`}>{slot(Number(s[1]))}</Fragment>
    const b = part.match(/^\*\*([^*]+)\*\*$/)
    if (b) return <strong key={`${keyBase}-${i}`}>{b[1]}</strong>
    return <Fragment key={`${keyBase}-${i}`}>{part}</Fragment>
  })
}

const isRow = (l: string) => /^\s*\|.*\|\s*$/.test(l)
const isSep = (l: string) => /^\s*\|[\s:|-]+\|\s*$/.test(l)
const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())

/**
 * Markdown-lite used by question content: "## heading", "- bullets", "| table | rows |",
 * paragraphs separated by blank lines; {{n}} renders the answer slot for question n.
 */
export function RichContent({ text, slot = n => `(${n})` }: { text: string; slot?: (n: number) => ReactNode }) {
  const lines = text.replace(/\r/g, '').split('\n')
  const out: ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    if (line.startsWith('## ') || line.startsWith('# ')) {
      out.push(<h4 key={i} className="mb-2 mt-3 text-[1.05em] font-bold">{inline(line.replace(/^#+\s/, ''), slot, `h${i}`)}</h4>)
      i++
      continue
    }
    if (isRow(line)) {
      const rows: string[] = []
      while (i < lines.length && isRow(lines[i])) rows.push(lines[i++])
      const hasHead = rows.length > 1 && isSep(rows[1])
      const body = rows.filter((_, j) => !(hasHead && j === 1))
      out.push(
        <div key={`t${i}`} className="my-3 overflow-x-auto">
          <table className="exam-table">
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>
                  {cells(r).map((c, ci) => {
                    const Cell = hasHead && ri === 0 ? 'th' : 'td'
                    return <Cell key={ci}>{inline(c, slot, `c${i}-${ri}-${ci}`)}</Cell>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }
    if (/^\s*[-•]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-•]\s/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-•]\s/, ''))
      out.push(
        <ul key={`u${i}`} className="my-2 ml-5 list-disc space-y-2">
          {items.map((it, j) => <li key={j} className="leading-loose">{inline(it, slot, `l${i}-${j}`)}</li>)}
        </ul>,
      )
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !isRow(lines[i]) && !/^\s*[-•]\s/.test(lines[i]) && !lines[i].startsWith('#')) para.push(lines[i++])
    out.push(<p key={`p${i}`} className="my-2 leading-loose">{inline(para.join(' '), slot, `p${i}`)}</p>)
  }
  return <div>{out}</div>
}

// Drawing-only SVG elements; anything else (script, foreignObject, a, image, style, animate/set…) is dropped.
const SVG_TAGS = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'textpath', 'defs',
  'marker', 'lineargradient', 'radialgradient', 'stop', 'title', 'desc', 'clippath', 'mask', 'pattern', 'use', 'symbol',
])

/** Imported tests can carry SVG — parse it and keep only drawing elements and safe attributes (allowlist, not regex). */
export function sanitizeSvg(svg: string): string {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')
  const root = doc.documentElement
  if (root.localName !== 'svg' || doc.getElementsByTagName('parsererror').length) return ''
  const clean = (el: Element) => {
    for (const a of [...el.attributes]) {
      const name = a.name.toLowerCase()
      const value = a.value.replace(/\s/g, '').toLowerCase()
      const badLink = (name === 'href' || name.endsWith(':href')) && !value.startsWith('#')
      // style can cover the whole app or load outside images; backslashes are CSS escapes (u\72 l( = url()
      if (name.startsWith('on') || name === 'style' || badLink || value.includes('\\') || /url\((?!#)|javascript:|expression\(/.test(value)) el.removeAttribute(a.name)
    }
    // childNodes, not children: comments / <?pi?> / CDATA survive serialisation and the HTML parser
    // re-reads them differently ("<!--><img onerror>") — only elements and text may stay.
    for (const node of [...el.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE) continue
      if (node.nodeType === Node.ELEMENT_NODE && SVG_TAGS.has((node as Element).localName.toLowerCase())) clean(node as Element)
      else node.remove()
    }
  }
  clean(root)
  return new XMLSerializer().serializeToString(root)
}

export function SvgFigure({ svg }: { svg: string }) {
  return <div className="my-3 flex justify-center [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: sanitizeSvg(svg) }} />
}
