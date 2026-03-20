import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useToast } from '../../../shared/hooks/useToast.js'
import { useAllBookmarks, useUpdateNote, useDeleteBookmark } from '../../../lib/hooks/use-bookmarks.js'
import { CardGridSkeleton } from '../../../shared/components/ContentSkeletons.jsx'

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--slogbaa-bg)',
  },
  main: {
    flex: 1,
    padding: '1.5rem 2rem',
    maxWidth: 900,
    margin: '0 auto',
    width: '100%',
  },
  heading: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: '0 0 1.5rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1 1 240px',
    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    minHeight: 44,
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '1.25rem 0 0.5rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  card: {
    padding: '1rem 1.25rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    marginBottom: '0.75rem',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  breadcrumb: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    margin: '0 0 0.35rem',
    lineHeight: 1.4,
  },
  blockTitle: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
    margin: 0,
  },
  note: {
    margin: '0.5rem 0 0',
    padding: '0.5rem 0.75rem',
    background: 'var(--slogbaa-bg)',
    borderRadius: 8,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
    border: '1px solid var(--slogbaa-border)',
  },
  noteInput: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    background: 'var(--slogbaa-bg)',
    borderRadius: 8,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
    border: '1px solid var(--slogbaa-blue)',
    resize: 'vertical',
    minHeight: 60,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginTop: '0.5rem',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    flexShrink: 0,
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    minHeight: 44,
    minWidth: 44,
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    cursor: 'pointer',
    color: 'var(--slogbaa-text-muted)',
    transition: 'background 0.15s, color 0.15s',
  },
  goBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--slogbaa-blue)',
    background: 'transparent',
    border: '1px solid var(--slogbaa-blue)',
    borderRadius: 8,
    cursor: 'pointer',
    minHeight: 36,
    transition: 'background 0.15s',
  },
  noteActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.35rem',
    justifyContent: 'flex-end',
  },
  smallBtn: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    minHeight: 32,
  },
  empty: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: 'var(--slogbaa-text-muted)',
  },
}

function BookmarkCard({ bookmark, onNavigate }) {
  const toast = useToast()
  const updateNote = useUpdateNote()
  const deleteBookmark = useDeleteBookmark()
  const [editing, setEditing] = useState(false)
  const [noteText, setNoteText] = useState(bookmark.note ?? '')

  const handleSaveNote = useCallback(() => {
    updateNote.mutate(
      { bookmarkId: bookmark.id, note: noteText.trim() },
      {
        onSuccess: () => { setEditing(false); toast.success('Note updated.') },
        onError: (err) => toast.error(err?.message ?? 'Failed to update note.'),
      }
    )
  }, [bookmark.id, noteText, updateNote, toast])

  const handleDelete = useCallback(() => {
    deleteBookmark.mutate(bookmark.id, {
      onSuccess: () => toast.success('Bookmark removed.'),
      onError: (err) => toast.error(err?.message ?? 'Failed to delete bookmark.'),
    })
  }, [bookmark.id, deleteBookmark, toast])

  const courseName = bookmark.courseTitle ?? `Course ${bookmark.courseId}`
  const moduleName = bookmark.moduleTitle ?? `Module ${bookmark.moduleId}`

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={styles.breadcrumb}>
            {courseName} &rsaquo; {moduleName}
          </p>
          <p style={styles.blockTitle}>
            <Icon icon={icons.bookmark} size="0.875rem" style={{ marginRight: 6, color: 'var(--slogbaa-orange)', verticalAlign: '-1px' }} />
            {moduleName}
          </p>
        </div>
        <div style={styles.actions}>
          <button
            type="button"
            style={styles.goBtn}
            onClick={() => onNavigate(bookmark.courseId, bookmark.moduleId)}
            title="Go to content"
          >
            <Icon icon={icons.externalLink} size={14} />
            Open
          </button>
          <button
            type="button"
            style={styles.iconBtn}
            onClick={() => { setEditing(true); setNoteText(bookmark.note ?? '') }}
            title="Edit note"
            aria-label="Edit note"
          >
            <Icon icon={icons.edit} size={16} />
          </button>
          <button
            type="button"
            style={{ ...styles.iconBtn, color: 'var(--slogbaa-error)' }}
            onClick={handleDelete}
            disabled={deleteBookmark.isPending}
            title="Remove bookmark"
            aria-label="Remove bookmark"
          >
            <Icon icon={icons.trash} size={16} />
          </button>
        </div>
      </div>

      {editing ? (
        <>
          <textarea
            style={styles.noteInput}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note..."
            autoFocus
          />
          <div style={styles.noteActions}>
            <button
              type="button"
              style={{ ...styles.smallBtn, background: 'var(--slogbaa-surface)', color: 'var(--slogbaa-text)', border: '1px solid var(--slogbaa-border)' }}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              style={{ ...styles.smallBtn, background: 'var(--slogbaa-blue)', color: '#fff' }}
              onClick={handleSaveNote}
              disabled={updateNote.isPending}
            >
              {updateNote.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      ) : bookmark.note ? (
        <div style={styles.note}>{bookmark.note}</div>
      ) : null}
    </div>
  )
}

export function BookmarksPage() {
  useDocumentTitle('My Bookmarks')
  const navigate = useNavigate()
  const { data: bookmarks, isLoading, error } = useAllBookmarks()
  const [search, setSearch] = useState('')

  const handleNavigate = useCallback(
    (courseId, moduleId) => {
      navigate(`/dashboard/courses/${courseId}/modules/${moduleId}`)
    },
    [navigate]
  )

  const grouped = useMemo(() => {
    if (!bookmarks?.length) return {}
    const q = search.toLowerCase()
    const filtered = q
      ? bookmarks.filter(
          (b) =>
            (b.note ?? '').toLowerCase().includes(q) ||
            (b.courseTitle ?? '').toLowerCase().includes(q) ||
            (b.moduleTitle ?? '').toLowerCase().includes(q)
        )
      : bookmarks
    const groups = {}
    for (const b of filtered) {
      const key = b.courseTitle ?? `Course ${b.courseId}`
      if (!groups[key]) groups[key] = []
      groups[key].push(b)
    }
    return groups
  }, [bookmarks, search])

  const groupKeys = Object.keys(grouped)

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <h1 style={styles.heading}>My Bookmarks</h1>
        <p style={styles.subtitle}>Saved content across your courses.</p>

        {!isLoading && bookmarks?.length > 0 && (
          <div style={styles.toolbar}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Icon
                icon={icons.search}
                size={16}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slogbaa-text-muted)', pointerEvents: 'none' }}
              />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>
              {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {isLoading && <CardGridSkeleton count={4} />}

        {error && (
          <div style={{ ...styles.empty, color: 'var(--slogbaa-error)' }}>
            <p>{error.message ?? 'Failed to load bookmarks.'}</p>
          </div>
        )}

        {!isLoading && !error && bookmarks?.length === 0 && (
          <div style={styles.empty}>
            <Icon icon={icons.bookmark} size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', color: 'var(--slogbaa-text)' }}>
              No bookmarks yet
            </h2>
            <p style={{ margin: 0 }}>
              Bookmark content while studying to find it here later.
            </p>
          </div>
        )}

        {!isLoading && !error && bookmarks?.length > 0 && search && groupKeys.length === 0 && (
          <div style={styles.empty}>
            <p>No bookmarks match your search.</p>
          </div>
        )}

        {groupKeys.map((courseName) => (
          <div key={courseName}>
            <h2 style={styles.groupHeader}>
              <Icon icon={icons.course} size="1rem" />
              {courseName}
              <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--slogbaa-text-muted)' }}>
                ({grouped[courseName].length})
              </span>
            </h2>
            {grouped[courseName].map((b) => (
              <BookmarkCard key={b.id} bookmark={b} onNavigate={handleNavigate} />
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}
