import { useState, useEffect, useRef } from 'react'
import { Plus, GripVertical, Trash2, Pencil, Type } from 'lucide-react'
import { parseTextLines, serializeTextLines } from './TextBlockInlineEditor.jsx'

const TEXT_STYLES = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'bullet', label: 'Bullet list' },
  { value: 'numbered', label: 'Numbered list' },
]

const styles = {
  blockControls: {
    position: 'absolute',
    left: -36,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    opacity: 0,
    transition: 'opacity 0.15s ease',
  },
  blockControlsVisible: { opacity: 1 },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    border: 'none',
    borderRadius: 6,
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  iconBtnHover: {
    background: 'rgba(241, 134, 37, 0.15)',
    color: 'var(--slogbaa-orange)',
  },
  menuWrap: {
    position: 'relative',
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: '100%',
    marginTop: 4,
    minWidth: 180,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    zIndex: 100,
    overflow: 'hidden',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    textAlign: 'left',
    transition: 'background 0.15s',
  },
  menuItemHover: { background: 'rgba(241, 134, 37, 0.08)' },
  menuItemDanger: { color: 'var(--slogbaa-error, #c0392b)' },
  menuDivider: {
    height: 1,
    margin: '0.25rem 0',
    background: 'var(--slogbaa-border)',
  },
}

/** Apply style (paragraph/bullet/numbered) to all TextLines */
export function applyTextLineStyle(richText, style) {
  const lines = parseTextLines(richText)
  if (!lines?.length) return ''
  const updated = lines.map((l) => ({ ...l, type: style || 'paragraph' }))
  return serializeTextLines(updated)
}

/** Detect current text style from first TextLine */
export function detectTextLineStyle(richText) {
  const lines = parseTextLines(richText)
  if (!lines?.length) return 'paragraph'
  return lines[0]?.type || 'paragraph'
}

/** True if block has no user-visible content */
export function isBlockEmpty(block) {
  if (!block) return true
  const { blockType, richText, imageUrl, videoUrl, videoId, activityInstructions, activityResources } = block
  if (blockType === 'TEXT') {
    const lines = parseTextLines(richText)
    return !lines?.some((l) => (l.content || '').trim())
  }
  if (blockType === 'IMAGE') return !imageUrl?.trim()
  if (blockType === 'VIDEO') return !(videoUrl?.trim() || videoId?.trim())
  if (blockType === 'ACTIVITY') return !(activityInstructions?.trim() || activityResources?.trim())
  return true
}

export function BlockOptionsMenu({
  block,
  module,
  courseId,
  isSuperAdmin,
  onAddBefore,
  onEdit,
  onEditText,
  onDelete,
  onStyleChange,
  visible,
  inline,
  empty,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [addHover, setAddHover] = useState(false)
  const [gripHover, setGripHover] = useState(false)
  const menuRef = useRef(null)
  const showGrip = isSuperAdmin && !empty && block != null

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const isText = block?.blockType === 'TEXT'
  const currentStyle = isText ? detectTextLineStyle(block.richText) : null

  return (
    <div
      style={{
        ...styles.blockControls,
        ...(inline ? { position: 'relative', left: 0 } : {}),
        ...(visible ? styles.blockControlsVisible : {}),
      }}
    >
      {/* Plus - add block */}
      {isSuperAdmin && (
        <button
          type="button"
          style={{
            ...styles.iconBtn,
            ...(addHover ? styles.iconBtnHover : {}),
          }}
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
          onClick={onAddBefore}
          title="Add block"
          aria-label="Add block"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      )}

      {/* Grip - options menu (only when block has content) */}
      {showGrip && (
        <div style={styles.menuWrap} ref={menuRef}>
          <button
            type="button"
            style={{
              ...styles.iconBtn,
              ...(gripHover || menuOpen ? styles.iconBtnHover : {}),
            }}
            onMouseEnter={() => setGripHover(true)}
            onMouseLeave={() => setGripHover(false)}
            onClick={() => setMenuOpen((o) => !o)}
            title="Block options"
            aria-label="Block options"
            aria-expanded={menuOpen}
          >
            <GripVertical size={14} strokeWidth={2} />
          </button>

          {menuOpen && (
            <div style={styles.menu} role="menu">
              <button
                type="button"
                style={styles.menuItem}
                onClick={() => { (onEditText || onEdit)?.(); setMenuOpen(false) }}
                role="menuitem"
              >
                <Pencil size={14} />
                Edit
              </button>

              {isText && (
                <>
                  <div style={styles.menuDivider} aria-hidden />
                  {TEXT_STYLES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      style={{
                        ...styles.menuItem,
                        ...(currentStyle === s.value ? { fontWeight: 600, color: 'var(--slogbaa-orange)' } : {}),
                      }}
                      onClick={() => { onStyleChange?.(s.value); setMenuOpen(false) }}
                      role="menuitem"
                    >
                      <Type size={14} />
                      {s.label}
                    </button>
                  ))}
                  <div style={styles.menuDivider} aria-hidden />
                </>
              )}

              <button
                type="button"
                style={{ ...styles.menuItem, ...styles.menuItemDanger }}
                onClick={() => { onDelete?.(); setMenuOpen(false) }}
                role="menuitem"
              >
                <Trash2 size={14} />
                Delete block
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
