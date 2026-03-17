import { useState, useRef, useCallback } from 'react'
import { Icon, icons } from '../icons.jsx'
import { useToggleBookmark, useUpdateNote } from '../../lib/hooks/use-bookmarks.js'

const styles = {
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 6,
    background: 'transparent',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    transition: 'color 0.15s, background 0.15s, border-color 0.15s',
    flexShrink: 0,
  },
  btnActive: {
    color: 'var(--slogbaa-blue)',
    borderColor: 'var(--slogbaa-blue)',
    background: 'rgba(37, 99, 235, 0.08)',
  },
  notePopover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    width: 240,
    padding: '0.75rem',
    borderRadius: 10,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    zIndex: 20,
  },
  noteLabel: {
    margin: '0 0 0.375rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  noteInput: {
    width: '100%',
    minHeight: 60,
    padding: '0.5rem',
    borderRadius: 6,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.875rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  noteBtns: {
    display: 'flex',
    gap: '0.375rem',
    marginTop: '0.5rem',
    justifyContent: 'flex-end',
  },
  noteBtn: {
    padding: '0.3rem 0.6rem',
    borderRadius: 6,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    cursor: 'pointer',
  },
  noteBtnSave: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    borderColor: 'var(--slogbaa-blue)',
  },
}

export function BookmarkButton({ courseId, moduleId, contentBlockId, bookmarks = [] }) {
  const [showNote, setShowNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const longPressRef = useRef(null)

  const existing = bookmarks.find(
    (b) => b.courseId === courseId && b.moduleId === moduleId && b.contentBlockId === contentBlockId
  )
  const isBookmarked = !!existing

  const toggleMutation = useToggleBookmark()
  const updateNoteMutation = useUpdateNote()

  const handleClick = useCallback(() => {
    toggleMutation.mutate({ courseId, moduleId, contentBlockId })
  }, [toggleMutation, courseId, moduleId, contentBlockId])

  const handlePointerDown = useCallback(() => {
    longPressRef.current = setTimeout(() => {
      setNoteText(existing?.note ?? '')
      setShowNote(true)
    }, 500)
  }, [existing])

  const handlePointerUp = useCallback(() => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }, [])

  const handleSaveNote = useCallback(() => {
    if (existing) {
      updateNoteMutation.mutate({ bookmarkId: existing.id, note: noteText })
    } else {
      toggleMutation.mutate({ courseId, moduleId, contentBlockId, note: noteText })
    }
    setShowNote(false)
  }, [existing, noteText, updateNoteMutation, toggleMutation, courseId, moduleId, contentBlockId])

  return (
    <span style={styles.wrapper}>
      <button
        type="button"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          ...styles.btn,
          ...(isBookmarked ? styles.btnActive : {}),
        }}
        title={isBookmarked ? 'Remove bookmark (long-press for note)' : 'Bookmark (long-press for note)'}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        aria-pressed={isBookmarked}
      >
        <Icon
          icon={icons.bookmark}
          size="1rem"
          style={isBookmarked ? { fill: 'currentColor' } : {}}
        />
      </button>
      {showNote && (
        <div style={styles.notePopover} role="dialog" aria-label="Bookmark note">
          <p style={styles.noteLabel}>Note</p>
          <textarea
            style={styles.noteInput}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note..."
            aria-label="Bookmark note text"
          />
          <div style={styles.noteBtns}>
            <button
              type="button"
              onClick={() => setShowNote(false)}
              style={styles.noteBtn}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveNote}
              style={{ ...styles.noteBtn, ...styles.noteBtnSave }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </span>
  )
}
