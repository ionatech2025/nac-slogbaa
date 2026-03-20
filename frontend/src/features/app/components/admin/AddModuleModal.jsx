import { useState, useRef } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'
import { Modal } from '../../../../shared/components/Modal.jsx'
import { LoadingButton } from '../../../../shared/components/LoadingButton.jsx'
import { uploadFile } from '../../../../api/files.js'
import { getAssetUrl } from '../../../../api/client.js'

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
    minHeight: 60,
    resize: 'vertical',
  },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
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
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: { fontSize: '0.875rem', color: 'var(--slogbaa-error)' },
  fileInput: { display: 'none' },
  uploadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.75rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
  },
  imagePreview: {
    maxWidth: 120,
    maxHeight: 80,
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
    objectFit: 'cover',
  },
}

export function AddModuleModal({ token, course, onClose, onSubmit }) {
  const nextOrder = (course?.modules?.length ?? 0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [hasQuiz, setHasQuiz] = useState(false)
  const [estimatedMinutes, setEstimatedMinutes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target?.files?.[0]
    if (!file || !token) return
    setError(null)
    setUploading(true)
    try {
      const { url } = await uploadFile(token, file, 'courses')
      setImageUrl(url)
    } catch (err) {
      setError(err?.message ?? 'Image upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setLoading(true)
    try {
      await onSubmit?.({
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl || undefined,
        moduleOrder: nextOrder,
        hasQuiz,
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes, 10) : undefined,
      })
      onClose?.()
    } catch (err) {
      setError(err?.message ?? 'Failed to add module.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Add module" onClose={onClose}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="module-title">Title</label>
          <input
            id="module-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="Module title"
            maxLength={500}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Image (optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <button
            type="button"
            style={styles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <FontAwesomeIcon icon={icons.blockImage} /> {uploading ? 'Uploading…' : (imageUrl ? 'Change image' : 'Choose image')}
          </button>
          {imageUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <img
                src={typeof imageUrl === 'string' && (imageUrl.startsWith('blob:') || imageUrl.startsWith('/') || imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) ? getAssetUrl(imageUrl) : ''}
                alt="Preview"
                style={styles.imagePreview}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          )}
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="module-desc">Description (optional)</label>
          <textarea
            id="module-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Brief description"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="module-estimated-minutes">Estimated minutes (optional)</label>
          <input
            id="module-estimated-minutes"
            type="number"
            min="0"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            style={styles.input}
            placeholder="e.g. 15"
          />
        </div>
        <div style={styles.checkboxRow}>
          <input
            id="module-has-quiz"
            type="checkbox"
            checked={hasQuiz}
            onChange={(e) => setHasQuiz(e.target.checked)}
          />
          <label style={styles.label} htmlFor="module-has-quiz">Has quiz</label>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.actions}>
          <button type="button" style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <LoadingButton type="submit" loading={loading} style={styles.btnPrimary}>
            <FontAwesomeIcon icon={icons.modules} /> Add module
          </LoadingButton>
        </div>
      </form>
    </Modal>
  )
}
