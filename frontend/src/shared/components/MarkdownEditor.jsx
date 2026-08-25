import { useRef, useState } from 'react'
import { Icon, icons } from '../icons.jsx'
import { MarkdownContent } from './MarkdownContent.jsx'

/**
 * GitHub-comment-style markdown editor: toolbar + write/preview.
 * Value remains markdown so existing CMS content stays compatible.
 */
export function MarkdownEditor({
  value = '',
  onChange,
  required = false,
  minHeight = 160,
  placeholder = 'Write markdown…',
  id,
  'aria-label': ariaLabel,
}) {
  const taRef = useRef(null)
  const [tab, setTab] = useState('write')

  const restoreSelection = (start, end) => {
    requestAnimationFrame(() => {
      const ta = taRef.current
      if (!ta) return
      ta.focus()
      ta.setSelectionRange(start, end)
    })
  }

  const apply = (next, selStart, selEnd) => {
    onChange(next)
    restoreSelection(selStart, selEnd)
  }

  const surround = (before, after = before, placeholderText = 'text') => {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const inner = selected || placeholderText
    const next = value.slice(0, start) + before + inner + after + value.slice(end)
    apply(next, start + before.length, start + before.length + inner.length)
  }

  const prefixLines = (prefix, { heading = false } = {}) => {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    let lineEnd = value.indexOf('\n', end)
    if (lineEnd === -1) lineEnd = value.length
    const block = value.slice(lineStart, lineEnd)
    const nextBlock = block.split('\n').map((line) => {
      if (!line.trim()) return line
      if (heading) {
        return prefix + line.replace(/^#{1,6}\s+/, '')
      }
      if (line.startsWith(prefix)) return line.slice(prefix.length)
      return prefix + line.replace(/^\s*[-*+]\s+/, '').replace(/^\s*\d+\.\s+/, '')
    }).join('\n')
    const next = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd)
    apply(next, lineStart, lineStart + nextBlock.length)
  }

  const insertLink = () => {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end) || 'link text'
    const url = window.prompt('Link URL', 'https://')
    if (!url) return
    const snippet = `[${selected}](${url.trim()})`
    const next = value.slice(0, start) + snippet + value.slice(end)
    apply(next, start, start + snippet.length)
  }

  const onKeyDown = (e) => {
    const mod = e.metaKey || e.ctrlKey
    if (!mod) return
    const key = e.key.toLowerCase()
    if (key === 'b') {
      e.preventDefault()
      surround('**', '**', 'bold text')
    } else if (key === 'i') {
      e.preventDefault()
      surround('*', '*', 'italic text')
    } else if (key === 'k') {
      e.preventDefault()
      insertLink()
    }
  }

  const tools = [
    { label: 'Heading 1', icon: icons.heading1, run: () => prefixLines('# ', { heading: true }) },
    { label: 'Heading 2', icon: icons.heading2, run: () => prefixLines('## ', { heading: true }) },
    { label: 'Heading 3', icon: icons.heading3, run: () => prefixLines('### ', { heading: true }) },
    { sep: true },
    { label: 'Bold (Ctrl+B)', icon: icons.bold, run: () => surround('**', '**', 'bold text') },
    { label: 'Italic (Ctrl+I)', icon: icons.italic, run: () => surround('*', '*', 'italic text') },
    { label: 'Strikethrough', icon: icons.strikethrough, run: () => surround('~~', '~~', 'text') },
    { sep: true },
    { label: 'Quote', icon: icons.quote, run: () => prefixLines('> ') },
    { label: 'Bulleted list', icon: icons.listUl, run: () => prefixLines('- ') },
    { label: 'Numbered list', icon: icons.listOl, run: () => prefixLines('1. ') },
    { sep: true },
    { label: 'Code', icon: icons.code, run: () => surround('`', '`', 'code') },
    { label: 'Link (Ctrl+K)', icon: icons.link, run: insertLink },
  ]

  return (
    <div className="md-editor">
      <div className="md-toolbar">
        <div className="md-toolbar-group" role="toolbar" aria-label="Formatting">
          {tab === 'write' && tools.map((t, i) => (
            t.sep
              ? <span key={`sep-${i}`} className="md-sep" aria-hidden="true" />
              : (
                <button
                  key={t.label}
                  type="button"
                  className="md-tool"
                  title={t.label}
                  aria-label={t.label}
                  onClick={t.run}
                >
                  <Icon icon={t.icon} size={15} />
                </button>
              )
          ))}
        </div>
        <div className="md-toolbar-group">
          <button
            type="button"
            className="md-tool"
            aria-pressed={tab === 'write'}
            onClick={() => setTab('write')}
          >
            Write
          </button>
          <button
            type="button"
            className="md-tool"
            aria-pressed={tab === 'preview'}
            onClick={() => setTab('preview')}
          >
            Preview
          </button>
        </div>
      </div>

      <textarea
        ref={taRef}
        id={id}
        className="md-textarea"
        style={{ minHeight, display: tab === 'write' ? 'block' : 'none' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        required={required}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {tab === 'preview' && (
        <div className="md-preview" style={{ minHeight }}>
          {value.trim()
            ? <MarkdownContent markdown={value} />
            : <p style={{ margin: 0, color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem' }}>Nothing to preview</p>}
        </div>
      )}
    </div>
  )
}
