import { useState, useEffect, useRef, useCallback, useId } from 'react'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(12px) saturate(150%)',
    WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '15vh',
    zIndex: 2000,
  },
  dialog: {
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    borderRadius: 20,
    boxShadow: 'var(--slogbaa-glass-shadow-lg), var(--slogbaa-glass-highlight)',
    border: '1px solid var(--slogbaa-glass-border)',
    width: 'calc(100% - 2rem)',
    maxWidth: 560,
    overflow: 'hidden',
    animation: 'glass-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
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
    maxHeight: 'min(380px, 50vh)',
    overflowY: 'auto',
    padding: '0.5rem 0',
  },
  group: {
    padding: '0.625rem 1.25rem 0.25rem',
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
    padding: '0.625rem 1.25rem',
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
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-blue)',
    flexShrink: 0,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
  },
  itemLabel: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemSubtitle: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginTop: 1,
  },
  itemShortcut: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
    flexShrink: 0,
  },
  empty: {
    padding: '2.5rem 1.25rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  emptyIcon: {
    opacity: 0.35,
    marginBottom: 8,
    display: 'block',
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
 * Reusable command palette / search overlay.
 *
 * @param {Object} props
 * @param {{ label: string, subtitle?: string, icon?: any, group?: string, onSelect: () => void, shortcut?: string }[]} props.commands
 * @param {() => void} props.onClose
 * @param {string} [props.placeholder] - Input placeholder text
 * @param {React.ReactNode} [props.searchIconElement] - Custom search icon element
 * @param {React.ReactNode} [props.emptyIcon] - Custom empty-state icon
 * @param {string} [props.emptyText] - Custom empty-state text
 * @param {number} [props.debounceMs] - Debounce delay for search input (0 = no debounce)
 * @param {(query: string) => void} [props.onQueryChange] - Callback when debounced query changes
 */
export function CommandPalette({
  commands = [],
  onClose,
  placeholder = 'Type to search...',
  searchIconElement,
  emptyIcon,
  emptyText = 'No results found.',
  debounceMs = 0,
  onQueryChange,
}) {
  const [rawQuery, setRawQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const dialogRef = useRef(null)
  const labelId = useId()

  // Debounce logic
  useEffect(() => {
    if (debounceMs <= 0) {
      setDebouncedQuery(rawQuery)
      return
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(rawQuery)
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [rawQuery, debounceMs])

  // Notify parent of query changes
  useEffect(() => {
    onQueryChange?.(debouncedQuery)
  }, [debouncedQuery, onQueryChange])

  const query = debounceMs > 0 ? debouncedQuery : rawQuery

  const filtered = query.trim()
    ? commands.filter((c) => {
        const q = query.toLowerCase()
        return (
          c.label.toLowerCase().includes(q) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(q))
        )
      })
    : commands

  // Focus input on mount + lock body scroll
  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Reset index when filtered list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    // Find the actual item elements (skip group headers)
    const items = list.querySelectorAll('[data-palette-item]')
    const active = items[activeIndex]
    if (active) active.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex])

  const handleSelect = useCallback(
    (cmd) => {
      onClose()
      cmd.onSelect()
    },
    [onClose]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
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
    },
    [filtered, activeIndex, handleSelect, onClose]
  )

  // Focus trap: keep Tab inside the dialog
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    function handleFocusTrap(e) {
      if (e.key !== 'Tab') return

      const focusable = dialog.querySelectorAll(
        'input, button, [tabindex]:not([tabindex="-1"]), [role="option"]'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleFocusTrap)
    return () => document.removeEventListener('keydown', handleFocusTrap)
  }, [])

  // Build grouped entries for rendering
  const groups = []
  let currentGroup = null
  filtered.forEach((cmd, i) => {
    if (cmd.group !== currentGroup) {
      currentGroup = cmd.group
      groups.push({ type: 'group', label: cmd.group || 'Commands', key: `g-${cmd.group}-${i}` })
    }
    groups.push({ type: 'item', cmd, index: i, key: `i-${i}` })
  })

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        style={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onKeyDown={handleKeyDown}
      >
        <div style={styles.inputWrap}>
          {searchIconElement || (
            <span style={styles.searchIcon} aria-hidden>
              &#128269;
            </span>
          )}
          <input
            ref={inputRef}
            style={styles.input}
            placeholder={placeholder}
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            aria-label="Search"
            id={labelId}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd style={styles.kbd}>Esc</kbd>
        </div>

        <div ref={listRef} style={styles.list} role="listbox">
          {filtered.length === 0 && (
            <div style={styles.empty}>
              {emptyIcon && <span style={styles.emptyIcon}>{emptyIcon}</span>}
              {emptyText}
            </div>
          )}
          {groups.map((entry) => {
            if (entry.type === 'group') {
              return (
                <div key={entry.key} style={styles.group}>
                  {entry.label}
                </div>
              )
            }
            const { cmd, index } = entry
            const isActive = index === activeIndex
            return (
              <div
                key={entry.key}
                data-palette-item
                style={{ ...styles.item, ...(isActive ? styles.itemActive : {}) }}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(cmd)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {cmd.icon && <div style={styles.itemIcon}>{cmd.icon}</div>}
                <div style={styles.itemText}>
                  <div style={styles.itemLabel}>{cmd.label}</div>
                  {cmd.subtitle && <div style={styles.itemSubtitle}>{cmd.subtitle}</div>}
                </div>
                {cmd.shortcut && <span style={styles.itemShortcut}>{cmd.shortcut}</span>}
              </div>
            )
          })}
        </div>

        <div style={styles.footer}>
          <span>&#8593;&#8595; Navigate</span>
          <span>&#8629; Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}
