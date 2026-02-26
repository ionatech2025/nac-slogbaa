import { useState, useEffect } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.js'
import { Modal } from '../../../../shared/components/Modal.jsx'

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: 'var(--slogbaa-text)' },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
  },
  textarea: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    minHeight: 80,
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  btnSecondary: {
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: { fontSize: '0.875rem', color: 'var(--slogbaa-error)' },
}

export function EditCourseModal({ course, onClose, onSubmit }) {
  const [title, setTitle] = useState(course?.title ?? '')
  const [description, setDescription] = useState(course?.description ?? '')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(course?.title ?? '')
    setDescription(course?.description ?? '')
  }, [course])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setLoading(true)
    try {
      await onSubmit?.({ title: title.trim(), description: description.trim() || undefined })
      onClose?.()
    } catch (err) {
      setError(err?.message ?? 'Failed to update course.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Edit course" onClose={onClose}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="edit-title">Title</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="Course title"
            maxLength={500}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="edit-desc">Description (optional)</label>
          <textarea
            id="edit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Brief description"
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.actions}>
          <button type="button" style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            <FontAwesomeIcon icon={icons.edit} /> {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
