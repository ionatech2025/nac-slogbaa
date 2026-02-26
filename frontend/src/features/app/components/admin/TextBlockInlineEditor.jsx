import { useState, useEffect, useCallback, useRef, useImperativeHandle } from 'react'

function uuid() {
  return crypto.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function extractTextFromHtml(html) {
  if (!html || typeof document === 'undefined') return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

/** Parse richText (JSON string) to TextLine array. Falls back to single paragraph for legacy HTML. */
export function parseTextLines(richText) {
  if (!richText || typeof richText !== 'string') return []
  try {
    const parsed = JSON.parse(richText)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    /* not JSON */
  }
  if (richText.trimStart().startsWith('<')) {
    const text = extractTextFromHtml(richText)
    if (text.trim()) return [{ id: uuid(), type: 'paragraph', content: text, indent: 0 }]
  }
  return []
}

/** Serialize TextLine array to JSON string */
export function serializeTextLines(lines) {
  if (!lines || lines.length === 0) return ''
  return JSON.stringify(lines)
}

function createEmptyLine() {
  return { id: uuid(), type: 'paragraph', content: '', indent: 0 }
}

const styles = {
  line: {
    display: 'flex',
    alignItems: 'flex-start',
    minHeight: '1.5em',
    marginBottom: '0.25rem',
  },
  lineContent: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text)',
    font: 'inherit',
    width: '100%',
    padding: 0,
  },
  bullet: {
    marginRight: '0.5rem',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
    userSelect: 'none',
  },
}

export function TextBlockInlineEditor({
  block,
  isSuperAdmin,
  innerRef,
  onBlur,
  onFocus,
  onSpaceBar,
}) {
  const [lines, setLines] = useState(() => parseTextLines(block?.richText) || [createEmptyLine()])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const lineRefs = useRef([])

  useEffect(() => {
    const parsed = parseTextLines(block?.richText)
    if (parsed.length > 0) {
      setLines(parsed)
    } else {
      setLines([createEmptyLine()])
    }
  }, [block?.id])

  const getLineRef = (i) => {
    if (!lineRefs.current[i]) lineRefs.current[i] = { current: null }
    return lineRefs.current[i]
  }

  useImperativeHandle(innerRef, () => ({
    focus: () => getLineRef(0).current?.focus?.(),
  }), [])

  const handleLineChange = useCallback((index, content) => {
    setLines((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], content }
      return next
    })
  }, [])

  const handleKeyDown = useCallback((e, index) => {
    if (!isSuperAdmin) return

    const line = lines[index]
    if (!line) return

    if (e.key === ' ') {
      const input = e.currentTarget
      const val = input.value
      const cursorPos = input.selectionStart
      const beforeCursor = val.slice(0, cursorPos)

      // "- " -> bullet
      if (beforeCursor.endsWith('- ')) {
        e.preventDefault()
        const newContent = beforeCursor.slice(0, -2) + val.slice(cursorPos)
        setLines((prev) => {
          const next = [...prev]
          next[index] = { ...next[index], type: 'bullet', content: newContent }
          return next
        })
        return
      }

      // "1. " or "2. " etc -> numbered
      if (/^\d+\.\s*$/.test(beforeCursor.trim()) || /^\s*\d+\.\s*$/.test(beforeCursor)) {
        e.preventDefault()
        const newContent = val.slice(cursorPos).trimStart()
        setLines((prev) => {
          const next = [...prev]
          next[index] = { ...next[index], type: 'numbered', content: newContent }
          return next
        })
        return
      }

      // Empty line + Space: open block type picker
      if (!val.trim()) {
        e.preventDefault()
        onSpaceBar?.(e)
      }
      return
    }

    // Tab: increment indent
    if (e.key === 'Tab') {
      e.preventDefault()
      setLines((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], indent: Math.min((next[index].indent ?? 0) + 1, 4) }
        return next
      })
      return
    }

    // Enter
    if (e.key === 'Enter') {
      e.preventDefault()
      const input = e.currentTarget
      const val = input.value
      const cursorPos = input.selectionStart
      const beforeCursor = val.slice(0, cursorPos)
      const afterCursor = val.slice(cursorPos)
      const contentBefore = beforeCursor
      const contentAfter = afterCursor

      // Enter twice on empty: reset type to paragraph, indent to 0
      if (!val.trim() && (line.type !== 'paragraph' || (line.indent ?? 0) > 0)) {
        setLines((prev) => {
          const next = [...prev]
          next[index] = { ...next[index], type: 'paragraph', indent: 0, content: '' }
          return next
        })
        return
      }

      // Insert new line after current
      const newLine = createEmptyLine()
      setLines((prev) => {
        const next = prev.map((l, i) => (i === index ? { ...l, content: contentBefore } : l))
        next.splice(index + 1, 0, { ...newLine, content: contentAfter })
        return next
      })
      setFocusedIndex(index + 1)
      setTimeout(() => getLineRef(index + 1).current?.focus(), 0)
    }
  }, [lines, isSuperAdmin, onSpaceBar])

  const handleBlur = useCallback(() => {
    const serialized = serializeTextLines(lines)
    if (serialized) onBlur?.(serialized)
  }, [lines, onBlur])

  const renderLine = (line, i) => {
    const indent = (line.indent ?? 0) * 24
    const prefix = line.type === 'bullet' ? '• ' : line.type === 'numbered' ? '1. ' : ''

    return (
      <div key={line.id} style={{ ...styles.line, marginLeft: indent }}>
        {line.type !== 'paragraph' && <span style={styles.bullet}>{line.type === 'bullet' ? '•' : '1.'}</span>}
        <input
          ref={getLineRef(i)}
          type="text"
          value={line.content}
          onChange={(e) => handleLineChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onBlur={handleBlur}
          onFocus={() => { setFocusedIndex(i); onFocus?.() }}
          style={{ ...styles.lineContent, paddingLeft: line.type !== 'paragraph' ? 0 : 0 }}
          placeholder={prefix || 'Type something…'}
          disabled={!isSuperAdmin}
        />
      </div>
    )
  }

  const displayLines = lines.length > 0 ? lines : [createEmptyLine()]

  return (
    <div ref={innerRef} style={{ outline: 'none' }}>
      {displayLines.map((line, i) => renderLine(line, i))}
    </div>
  )
}
