import { useState, useEffect } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.js'
import { Modal } from '../../../../shared/components/Modal.jsx'
import { serializeTextLines } from './TextBlockInlineEditor.jsx'

function uuid() {
  return crypto.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const BLOCK_TYPES = [
  { value: 'TEXT', label: 'Text', icon: icons.blockText },
  { value: 'IMAGE', label: 'Image', icon: icons.blockImage },
  { value: 'VIDEO', label: 'Video', icon: icons.blockVideo },
  { value: 'ACTIVITY', label: 'Activity', icon: icons.blockActivity },
]

const styles = {
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  typeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    border: '2px solid var(--slogbaa-border)',
    borderRadius: 8,
    background: 'var(--slogbaa-surface)',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  typeBtnSelected: {
    borderColor: 'var(--slogbaa-orange)',
    background: 'rgba(241, 134, 37, 0.08)',
    color: 'var(--slogbaa-orange)',
  },
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
    minHeight: 100,
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

export function AddBlockModal({ course, module, preselectedType, onClose, onSubmit }) {
  const nextOrder = (module?.contentBlocks?.length ?? 0)
  const [blockType, setBlockType] = useState(preselectedType || 'TEXT')
  useEffect(() => {
    if (preselectedType) setBlockType(preselectedType)
  }, [preselectedType])
  const [richText, setRichText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAltText, setImageAltText] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [activityInstructions, setActivityInstructions] = useState('')
  const [activityResources, setActivityResources] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const buildPayload = () => {
    const base = { blockType, blockOrder: nextOrder }
    switch (blockType) {
      case 'TEXT': {
        const lines = [{ id: uuid(), type: 'paragraph', content: richText.trim(), indent: 0 }]
        return { ...base, richText: serializeTextLines(lines) || undefined }
      }
      case 'IMAGE':
        return { ...base, imageUrl: imageUrl || undefined, imageAltText: imageAltText || undefined, imageCaption: imageCaption || undefined }
      case 'VIDEO': {
        const vid = videoUrl?.match(/(?:v=|\/)([\w-]{11})(?:&|$)/)?.[1]
        return { ...base, videoUrl: videoUrl || undefined, videoId: vid || undefined }
      }
      case 'ACTIVITY':
        return { ...base, activityInstructions: activityInstructions || undefined, activityResources: activityResources || undefined }
      default:
        return base
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const payload = buildPayload()
    if (blockType === 'TEXT' && !richText?.trim()) {
      setError('Content is required for text blocks.')
      return
    }
    if (blockType === 'IMAGE' && !imageUrl?.trim()) {
      setError('Image URL is required.')
      return
    }
    if (blockType === 'VIDEO' && !videoUrl?.trim()) {
      setError('Video URL is required.')
      return
    }
    setLoading(true)
    try {
      await onSubmit?.(payload)
      onClose?.()
    } catch (err) {
      setError(err?.message ?? 'Failed to add block.')
    } finally {
      setLoading(false)
    }
  }

  const showTypePicker = !preselectedType

  return (
    <Modal title="Add content block" onClose={onClose} maxWidth={520}>
      {showTypePicker && (
        <>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
            Choose block type, then fill in the content.
          </p>
          <div style={styles.typeGrid}>
            {BLOCK_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            style={{
              ...styles.typeBtn,
              ...(blockType === t.value ? styles.typeBtnSelected : {}),
            }}
            onClick={() => setBlockType(t.value)}
          >
            <FontAwesomeIcon icon={t.icon} />
            {t.label}
          </button>
            ))}
          </div>
        </>
      )}
      <form style={styles.form} onSubmit={handleSubmit}>
        {blockType === 'TEXT' && (
          <div style={styles.field}>
            <label style={styles.label}>Text content</label>
            <textarea
              value={richText}
              onChange={(e) => setRichText(e.target.value)}
              style={styles.textarea}
              placeholder="Your content here… (use the inline editor for bullet/numbered lists)"
            />
          </div>
        )}
        {blockType === 'IMAGE' && (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={styles.input}
                placeholder="https://…"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Alt text (optional)</label>
              <input
                type="text"
                value={imageAltText}
                onChange={(e) => setImageAltText(e.target.value)}
                style={styles.input}
                placeholder="Describe the image"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Caption (optional)</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                style={styles.input}
                placeholder="Caption"
              />
            </div>
          </>
        )}
        {blockType === 'VIDEO' && (
          <div style={styles.field}>
            <label style={styles.label}>YouTube URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={styles.input}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </div>
        )}
        {blockType === 'ACTIVITY' && (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Instructions (HTML)</label>
              <textarea
                value={activityInstructions}
                onChange={(e) => setActivityInstructions(e.target.value)}
                style={styles.textarea}
                placeholder="<p>Activity instructions…</p>"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Resources (HTML, optional)</label>
              <textarea
                value={activityResources}
                onChange={(e) => setActivityResources(e.target.value)}
                style={styles.textarea}
                placeholder="<p>Resources or links…</p>"
              />
            </div>
          </>
        )}
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.actions}>
          <button type="button" style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            <FontAwesomeIcon icon={icons.addBlock} /> {loading ? 'Adding…' : 'Add block'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
