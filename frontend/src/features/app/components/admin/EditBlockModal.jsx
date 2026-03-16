import { useState, useEffect } from 'react'
import { icons } from '../../../../shared/icons.jsx'
const Save = icons.save
import { Modal } from '../../../../shared/components/Modal.jsx'
import { LoadingButton } from '../../../../shared/components/LoadingButton.jsx'

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
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: { fontSize: '0.875rem', color: 'var(--slogbaa-error)' },
}

export function EditBlockModal({ block, courseId, module, onClose, onSubmit }) {
  const { blockType } = block || {}
  const [richText, setRichText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAltText, setImageAltText] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [activityInstructions, setActivityInstructions] = useState('')
  const [activityResources, setActivityResources] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!block) return
    setRichText(block.richText ?? '')
    setImageUrl(block.imageUrl ?? '')
    setImageAltText(block.imageAltText ?? '')
    setImageCaption(block.imageCaption ?? '')
    setVideoUrl(block.videoUrl ?? '')
    setActivityInstructions(block.activityInstructions ?? '')
    setActivityResources(block.activityResources ?? '')
  }, [block])

  const buildPayload = () => {
    const base = {
      blockType: blockType || block?.blockType || 'TEXT',
      blockOrder: block?.blockOrder ?? 0,
    }
    switch (blockType) {
      case 'TEXT':
        return { ...base, richText: richText || undefined }
      case 'IMAGE':
        return {
          ...base,
          imageUrl: imageUrl || undefined,
          imageAltText: imageAltText || undefined,
          imageCaption: imageCaption || undefined,
        }
      case 'VIDEO': {
        const vid = videoUrl?.match(/(?:v=|\/)([\w-]{11})(?:&|$)/)?.[1]
        return { ...base, videoUrl: videoUrl || undefined, videoId: vid || undefined }
      }
      case 'ACTIVITY':
        return {
          ...base,
          activityInstructions: activityInstructions || undefined,
          activityResources: activityResources || undefined,
        }
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
      setError(err?.message ?? 'Failed to update block.')
    } finally {
      setLoading(false)
    }
  }

  if (!block) return null

  return (
    <Modal title={`Edit ${blockType?.toLowerCase() || 'block'}`} onClose={onClose} maxWidth={520}>
      <form style={styles.form} onSubmit={handleSubmit}>
        {blockType === 'TEXT' && (
          <div style={styles.field}>
            <label style={styles.label}>Rich text (HTML)</label>
            <textarea
              value={richText}
              onChange={(e) => setRichText(e.target.value)}
              style={styles.textarea}
              placeholder="<p>Your content here…</p>"
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
          <button type="button" style={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <LoadingButton type="submit" loading={loading} style={styles.btnPrimary}>
            <Save size={16} /> Save
          </LoadingButton>
        </div>
      </form>
    </Modal>
  )
}
