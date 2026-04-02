import { useState, useEffect } from 'react'
import { Modal } from '../../../shared/components/Modal.jsx'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getCourseDetails } from '../../../api/learning/courses.js'
import { getAssetUrl } from '../../../api/client.js'
import defaultCourseImg from '../../../assets/images/courses/course1.jpg'

function findFirstVideoBlock(course) {
  for (const module of course?.modules ?? []) {
    for (const block of module?.contentBlocks ?? []) {
      if (block.blockType === 'VIDEO' && (block.videoId || block.videoUrl)) return block
    }
  }
  return null
}

const styles = {
  image: {
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: '1.25rem',
    background: 'var(--slogbaa-border)',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: 8,
    marginBottom: '1.25rem',
    background: 'var(--slogbaa-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '3rem',
  },
  description: {
    margin: '0 0 1.25rem',
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text-muted)',
  },
  meta: {
    margin: '0 0 1.25rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  sectionTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  moduleList: {
    margin: '0 0 1.25rem',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  moduleItem: {
    display: 'flex',
    gap: '0.875rem',
    alignItems: 'flex-start',
    padding: '0.75rem',
    borderRadius: 8,
    background: 'rgba(39, 129, 191, 0.04)',
    border: '1px solid var(--slogbaa-border)',
  },
  moduleThumb: {
    width: 64,
    height: 48,
    borderRadius: 4,
    objectFit: 'cover',
    flexShrink: 0,
    background: 'var(--slogbaa-border)',
  },
  moduleTitle: {
    margin: '0 0 0.15rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  moduleDesc: {
    margin: 0,
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.4,
  },
  videoWrap: {
    marginBottom: '1.25rem',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-border)',
  },
  video: {
    aspectRatio: '16/9',
    width: '100%',
    display: 'block',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--slogbaa-text-muted)',
  },
  error: {
    padding: '1rem',
    background: 'rgba(197, 48, 48, 0.08)',
    border: '1px solid var(--slogbaa-error)',
    borderRadius: 8,
    color: 'var(--slogbaa-error)',
    fontSize: '0.9375rem',
  },
  enrollBtn: {
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
    textDecoration: 'none',
  },
}

export function CoursePreviewModal({ course, onClose, onEnroll, prerequisiteMet = true }) {
  const { token } = useAuth()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token || !course?.id) return
    setLoading(true)
    setError(null)
    getCourseDetails(token, course.id)
      .then(setDetails)
      .catch((err) => setError(err?.message ?? 'Failed to load preview.'))
      .finally(() => setLoading(false))
  }, [token, course?.id])

  const videoBlock = details ? findFirstVideoBlock(details) : null
  const embedId = videoBlock?.videoId || (videoBlock?.videoUrl && videoBlock.videoUrl.match(/(?:v=|\/)([\w-]{11})(?:&|$)/)?.[1])

  return (
    <Modal title={course?.title ?? 'Course preview'} onClose={onClose} maxWidth={640}>
      {loading && <p style={styles.loading}>Loading preview…</p>}
      {error && <div style={styles.error}>{error}</div>}
      {!loading && !error && details && (
        <>
          <img
            src={details.imageUrl ? getAssetUrl(details.imageUrl) : defaultCourseImg}
            alt={`Course: ${details.title ?? ''}`}
            style={styles.image}
            onError={(e) => { e.target.onerror = null; e.target.src = defaultCourseImg }}
          />
          {details.description && (
            <p style={styles.description}>{details.description}</p>
          )}
          <p style={styles.meta}>
            {details.modules?.length ?? 0} module{(details.modules?.length ?? 0) !== 1 ? 's' : ''}
            {details.reviewCount > 0 && (
              <>
                <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>|</span>
                <FontAwesomeIcon icon={icons.star} style={{ marginRight: '0.35rem', color: '#f59e0b' }} />
                <span style={{ fontWeight: 600, color: 'var(--slogbaa-text)' }}>{details.averageRating?.toFixed(1)}</span>
                <span style={{ marginLeft: '0.25rem' }}>({details.reviewCount} {details.reviewCount === 1 ? 'review' : 'reviews'})</span>
              </>
            )}
          </p>
          {details.modules?.length > 0 && (
            <>
              <h3 style={styles.sectionTitle}>Curriculum ({details.modules.length} module{details.modules.length !== 1 ? 's' : ''})</h3>
              <ul style={styles.moduleList}>
                {details.modules.map((m) => (
                  <li key={m.id} style={styles.moduleItem}>
                    {m.imageUrl ? (
                      <img
                        src={getAssetUrl(m.imageUrl)}
                        alt=""
                        style={styles.moduleThumb}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div style={{ ...styles.moduleThumb, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'var(--slogbaa-text-muted)', opacity: 0.5 }}>
                        <FontAwesomeIcon icon={icons.modules} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={styles.moduleTitle}>{m.title}</h4>
                      {m.description && <p style={styles.moduleDesc}>{m.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {embedId && (
            <>
              <h3 style={styles.sectionTitle}>Introductory video</h3>
              <div style={styles.videoWrap}>
                <iframe
                  title="Course introductory video"
                  src={`https://www.youtube.com/embed/${embedId}`}
                  style={styles.video}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </>
          )}
          {course?.prerequisiteCourseId && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              marginBottom: '1rem',
              ...(prerequisiteMet
                ? { background: 'rgba(56, 161, 105, 0.1)', color: 'var(--slogbaa-green)', border: '1px solid rgba(56, 161, 105, 0.25)' }
                : { background: 'rgba(237, 137, 54, 0.1)', color: 'var(--slogbaa-warning, #dd6b20)', border: '1px solid rgba(237, 137, 54, 0.25)' }),
            }}>
              <FontAwesomeIcon icon={prerequisiteMet ? icons.checkCircle : icons.lock} style={{ width: '1em' }} />
              <span>
                {prerequisiteMet
                  ? 'Prerequisite met'
                  : `Requires: ${course.prerequisiteCourseName ?? 'a prerequisite course'}`}
              </span>
            </div>
          )}
          {onEnroll && (
            <button type="button" style={styles.enrollBtn} onClick={() => onEnroll(course)}>
              <FontAwesomeIcon icon={icons.enroll} />
              Enroll now →
            </button>
          )}
          {!onEnroll && course?.prerequisiteCourseId && !prerequisiteMet && (
            <button type="button" disabled style={{ ...styles.enrollBtn, opacity: 0.5, cursor: 'not-allowed', background: 'var(--slogbaa-text-muted)' }}>
              <FontAwesomeIcon icon={icons.lock} />
              Locked
            </button>
          )}
        </>
      )}
    </Modal>
  )
}
