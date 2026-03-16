import { useState, useEffect, useRef, useCallback, useId } from 'react'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '15vh',
    zIndex: 2000,
  },
  dialog: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
    border: '1px solid var(--slogbaa-border)',
    width: 'calc(100% - 2rem)',
    maxWidth: 520,
    overflow: 'hidden',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  searchIcon: {
    color: 'var(--slogbaa-text-muted)',
    fontSize: '1rem',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '1rem',
    color: 'var(--slogbaa-text)',
  },
  kbd: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    padding: '0.15rem 0.4rem',
    borderRadius: 4,
    border: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text-muted)',
    background: 'var(--slogbaa-bg-secondary)',
    fontFamily: 'ui-monospace, monospace',
  },
  list: {
    maxHeight: 'min(320px, 50vh)',
    overflowY: 'auto',
    padding: '0.5rem 0',
  },
  group: {
    padding: '0.5rem 1.25rem 0.25rem',
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--slogbaa-text-muted)',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.25rem',
    minHeight: 44,
    cursor: 'pointer',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    transition: 'background 0.1s',
  },
  itemActive: {
    background: 'var(--slogbaa-bg-secondary)',
  },
  itemIcon: {
    width: '1em',
    opacity: 0.7,
    flexShrink: 0,
  },
  itemLabel: {
    flex: 1,
  },
  itemShortcut: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },
  empty: {
    padding: '2rem 1.25rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  footer: {
    display: 'flex',
    gap: '1rem',
    padding: '0.5rem 1.25rem',
    borderTop: '1px solid var(--slogbaa-border)',
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },
}

/**
 * Linear-style command palette.
 *
 * @param {{ label: string, icon?: any, group?: string, onSelect: () => void, shortcut?: string }[]} commands
 * @param {() => void} onClose
 */
export function CommandPalette({ commands = [], onClose }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const labelId = useId()

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Reset index when query changes
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Scroll active into view
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.children[activeIndex]
    if (active) active.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex])

  const handleSelect = useCallback((cmd) => {
    onClose()
    cmd.onSelect()
  }, [onClose])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault()
      handleSelect(filtered[activeIndex])
    }
  }, [filtered, activeIndex, handleSelect, onClose])

  // Group items
  const groups = []
  let currentGroup = null
  filtered.forEach((cmd, i) => {
    if (cmd.group !== currentGroup) {
      currentGroup = cmd.group
      groups.push({ type: 'group', label: cmd.group || 'Commands', key: `g-${i}` })
    }
    groups.push({ type: 'item', cmd, index: i, key: `i-${i}` })
  })

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        style={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onKeyDown={handleKeyDown}
      >
        <div style={styles.inputWrap}>
          <span style={styles.searchIcon} aria-hidden>&#128269;</span>
          <input
            ref={inputRef}
            style={styles.input}
            placeholder="Type a command…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search commands"
            id={labelId}
          />
          <kbd style={styles.kbd}>Esc</kbd>
        </div>
        <div ref={listRef} style={styles.list} role="listbox">
          {filtered.length === 0 && (
            <div style={styles.empty}>No matching commands.</div>
          )}
          {groups.map((entry) => {
            if (entry.type === 'group') {
              return <div key={entry.key} style={styles.group}>{entry.label}</div>
            }
            const { cmd, index } = entry
            const isActive = index === activeIndex
            return (
              <div
                key={entry.key}
                style={{ ...styles.item, ...(isActive ? styles.itemActive : {}) }}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(cmd)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {cmd.icon && <span style={styles.itemIcon}>{cmd.icon}</span>}
                <span style={styles.itemLabel}>{cmd.label}</span>
                {cmd.shortcut && <span style={styles.itemShortcut}>{cmd.shortcut}</span>}
              </div>
            )
          })}
        </div>
        <div style={styles.footer}>
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}
