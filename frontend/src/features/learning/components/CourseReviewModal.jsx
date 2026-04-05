import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { StarRating } from '../../../shared/components/StarRating.jsx'
import { useSubmitReview } from '../../../lib/hooks/use-reviews.js'
import { Icon, icons } from '../../../shared/icons.jsx'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    background: 'var(--slogbaa-surface)',
    borderRadius: 20,
    border: '1px solid var(--slogbaa-border)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    position: 'relative',
    animation: 'modalOpen 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  closeBtn: {
    border: 'none',
    background: 'transparent',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  content: {
    padding: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.75rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  textarea: {
    width: '100%',
    minHeight: 120,
    padding: '1rem',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    marginTop: '0.5rem',
  },
  footer: {
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid var(--slogbaa-border)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    background: 'rgba(0, 0, 0, 0.02)',
  },
  cancelBtn: {
    padding: '0.625rem 1.25rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '0.625rem 1.5rem',
    borderRadius: 10,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  error: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: 8,
    background: 'rgba(197, 48, 48, 0.08)',
    border: '1px solid var(--slogbaa-error)',
    color: 'var(--slogbaa-error)',
    fontSize: '0.8125rem',
  },
}

export function CourseReviewModal({ courseId, courseTitle, onClose }) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const submitMutation = useSubmitReview()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating < 1) return

    submitMutation.mutate(
      { courseId, rating, reviewText: reviewText.trim() || null },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  // Prevent click propagation to overlay
  const handleModalClick = (e) => e.stopPropagation()

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={handleModalClick}>
        <div style={styles.header}>
          <h2 style={styles.title}>Rate & Review Course</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.content}>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.5 }}>
               Your feedback helps us improve <strong>{courseTitle}</strong> and assists other students in their learning journey.
            </p>

            <span style={styles.label}>How would you rate this course?</span>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
               <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            <label style={styles.label} htmlFor="review-text">
              Write a review (optional)
            </label>
            <textarea
              id="review-text"
              style={styles.textarea}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you like? What could be better? Share your thoughts..."
              maxLength={2000}
            />

            {submitMutation.isError && (
              <div style={styles.error}>
                {submitMutation.error?.message || 'Failed to submit review. Please try again.'}
              </div>
            )}
          </div>

          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose} disabled={submitMutation.isPending}>
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: rating < 1 || submitMutation.isPending ? 0.6 : 1,
              }}
              disabled={rating < 1 || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <>
                  <Icon icon={icons.loader} className="spin" size={16} />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalOpen {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .spin {
          animation: common-spin 1s linear infinite;
        }
        @keyframes common-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
