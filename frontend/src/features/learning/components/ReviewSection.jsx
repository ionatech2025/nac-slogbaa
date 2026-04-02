import { useState } from 'react'
import { StarRating } from '../../../shared/components/StarRating.jsx'
import { useCourseReviews, useCourseRating, useSubmitReview, useDeleteReview } from '../../../lib/hooks/use-reviews.js'
import { useAuth } from '../../iam/hooks/useAuth.js'

const sectionStyles = {
  wrapper: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  heading: {
    margin: '0 0 1rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
    borderRadius: 14,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  avgNumber: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    lineHeight: 1,
  },
  totalReviews: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    marginTop: '0.25rem',
  },
  formCard: {
    padding: '1.25rem',
    marginBottom: '1.5rem',
    borderRadius: 14,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  textarea: {
    width: '100%',
    minHeight: 80,
    padding: '0.75rem',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-glass-bg-subtle)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  buttonRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap',
  },
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.55rem 1.25rem',
    borderRadius: 10,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.55rem 1rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-error, #c53030)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  reviewCard: {
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
    borderRadius: 12,
    background: 'var(--slogbaa-glass-bg-subtle)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border-subtle)',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.35rem',
  },
  reviewAuthor: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  reviewDate: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  reviewText: {
    margin: '0.5rem 0 0',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
  },
  emptyText: {
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  errorText: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error, #c53030)',
    marginTop: '0.5rem',
  },
}

function formatDate(isoString) {
  if (!isoString) return ''
  try {
    return new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

export function ReviewSection({ courseId }) {
  const { data: reviews = [], isLoading: reviewsLoading } = useCourseReviews(courseId)
  const { data: ratingSummary } = useCourseRating(courseId)
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const currentUserId = user?.userId

  const hasMyReview = reviews.some(r => r.authorId === currentUserId)

  const submitMutation = useSubmitReview()
  const deleteMutation = useDeleteReview()

  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating < 1) return
    submitMutation.mutate(
      { courseId, rating, reviewText: reviewText.trim() || null },
      {
        onSuccess: () => {
          setRating(0)
          setReviewText('')
        },
      }
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(courseId)
  }

  const avgRating = ratingSummary?.averageRating ?? 0
  const totalReviews = ratingSummary?.totalReviews ?? 0

  return (
    <div style={sectionStyles.wrapper}>
      <h3 style={sectionStyles.heading}>Ratings & Reviews</h3>

      {/* Rating summary */}
      <div style={sectionStyles.summaryCard}>
        <div>
          <div style={sectionStyles.avgNumber}>{avgRating > 0 ? avgRating.toFixed(1) : '--'}</div>
          <div style={sectionStyles.totalReviews}>
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>
        {avgRating > 0 && <StarRating value={avgRating} readOnly showLabel={false} size="md" />}
      </div>

      {/* Review form (hidden for superadmins or if already reviewed) */}
      {!isSuperAdmin && !hasMyReview && (
        <form onSubmit={handleSubmit} style={sectionStyles.formCard}>
          <label style={sectionStyles.formLabel}>Your rating</label>
          <StarRating value={rating} onChange={setRating} size="lg" />

          <label style={{ ...sectionStyles.formLabel, marginTop: '0.75rem' }}>Review (optional)</label>
          <textarea
            style={sectionStyles.textarea}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this course..."
            maxLength={2000}
            rows={3}
          />

          <div style={sectionStyles.buttonRow}>
            <button
              type="submit"
              disabled={rating < 1 || submitMutation.isPending}
              style={{
                ...sectionStyles.submitBtn,
                opacity: rating < 1 || submitMutation.isPending ? 0.5 : 1,
              }}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              style={sectionStyles.deleteBtn}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete My Review'}
            </button>
          </div>

          {submitMutation.isError && (
            <p style={sectionStyles.errorText}>{submitMutation.error?.message ?? 'Failed to submit review.'}</p>
          )}
          {deleteMutation.isError && (
            <p style={sectionStyles.errorText}>{deleteMutation.error?.message ?? 'Failed to delete review.'}</p>
          )}
        </form>
      )}

      {/* Review list */}
      {reviewsLoading ? (
        <p style={sectionStyles.emptyText}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={sectionStyles.emptyText}>No reviews yet. Be the first to review this course!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={sectionStyles.reviewCard}>
            <div style={sectionStyles.reviewHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span style={sectionStyles.reviewAuthor}>
                  {review.authorDisplayName ?? review.traineeDisplayName}
                </span>
                {review.authorType === 'STAFF' && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--slogbaa-blue)',
                    }}
                  >
                    Staff
                  </span>
                )}
              </div>
              <span style={sectionStyles.reviewDate}>{formatDate(review.createdAt)}</span>
            </div>
            <StarRating value={review.rating} readOnly size="sm" />
            {review.reviewText && <p style={sectionStyles.reviewText}>{review.reviewText}</p>}
          </div>
        ))
      )}
    </div>
  )
}
