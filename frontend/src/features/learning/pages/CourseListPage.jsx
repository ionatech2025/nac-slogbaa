import { useState, useEffect } from 'react'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getPublishedCourses, getEnrolledCourses, enrollInCourse } from '../../../api/learning/courses.js'
import { CourseCard } from '../../app/components/trainee/CourseCard.jsx'
import { CoursePreviewModal } from '../components/CoursePreviewModal.jsx'

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
    maxWidth: 1000,
    margin: '0 auto',
    width: '100%',
  },
  header: {
    marginBottom: '1.5rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  viewToggle: {
    display: 'flex',
    gap: 0,
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    overflow: 'hidden',
    background: 'var(--slogbaa-surface)',
  },
  viewToggleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.5rem 0.75rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  viewToggleBtnActive: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem 2rem',
    color: 'var(--slogbaa-text-muted)',
  },
  error: {
    padding: '1.5rem',
    background: 'rgba(197, 48, 48, 0.08)',
    border: '1px solid var(--slogbaa-error)',
    borderRadius: 8,
    color: 'var(--slogbaa-error)',
  },
}

export function CourseListPage() {
  const { token } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [courseView, setCourseView] = useState('vertical')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrollingId, setEnrollingId] = useState(null)
  const [previewCourse, setPreviewCourse] = useState(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError(null)
    Promise.all([getPublishedCourses(token), getEnrolledCourses(token)])
      .then(([published, enrolled]) => {
        setCourses(published)
        setEnrolledIds(new Set(enrolled.map((c) => c.id)))
      })
      .catch((err) => setError(err?.message ?? 'Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [token])

  const handleEnroll = async (course) => {
    if (!token || enrollingId) return
    setEnrollingId(course.id)
    setPreviewCourse(null)
    try {
      await enrollInCourse(token, course.id)
      setEnrolledIds((prev) => new Set([...prev, course.id]))
    } catch (err) {
      setError(err?.message ?? 'Enrollment failed.')
    } finally {
      setEnrollingId(null)
    }
  }

  const handlePreview = (course) => setPreviewCourse(course)

  if (loading) {
    return (
      <div style={styles.layout}>
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Courses</h1>
            <p style={styles.subtitle}>Browse available courses</p>
          </div>
          <p style={styles.loading}>Loading courses…</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.layout}>
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Courses</h1>
          </div>
          <div style={styles.error}>{error}</div>
        </main>
      </div>
    )
  }

  const unenrolledCourses = courses.filter((c) => !enrolledIds.has(c.id))
  const isHorizontal = courseView === 'horizontal'

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Courses</h1>
          <p style={styles.subtitle}>
            {unenrolledCourses.length === 0
              ? enrolledIds.size > 0
                ? "You're enrolled in all available courses."
                : 'No courses available yet.'
              : `${unenrolledCourses.length} course${unenrolledCourses.length === 1 ? '' : 's'} available to enroll`}
          </p>
        </div>
        {unenrolledCourses.length > 0 && (
          <div style={styles.sectionHeader}>
            <div />
            <div style={styles.viewToggle} role="group" aria-label="Course view">
              <button
                type="button"
                style={{
                  ...styles.viewToggleBtn,
                  ...(courseView === 'vertical' ? styles.viewToggleBtnActive : {}),
                }}
                onClick={() => setCourseView('vertical')}
                aria-pressed={courseView === 'vertical'}
                title="Card view"
              >
                <FontAwesomeIcon icon={icons.viewCards} style={{ width: '1em', opacity: 0.9 }} />
                Cards
              </button>
              <button
                type="button"
                style={{
                  ...styles.viewToggleBtn,
                  ...(courseView === 'horizontal' ? styles.viewToggleBtnActive : {}),
                }}
                onClick={() => setCourseView('horizontal')}
                aria-pressed={courseView === 'horizontal'}
                title="Row view"
              >
                <FontAwesomeIcon icon={icons.viewList} style={{ width: '1em', opacity: 0.9 }} />
                Rows
              </button>
            </div>
          </div>
        )}
        <div style={isHorizontal ? styles.cardList : styles.cardGrid}>
          {unenrolledCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={{
                id: course.id,
                title: course.title,
                description: course.description || 'No description.',
                meta: `${course.moduleCount} module${course.moduleCount !== 1 ? 's' : ''}`,
              }}
              onEnroll={handleEnroll}
              onPreview={handlePreview}
              variant={courseView}
              enrolling={enrollingId === course.id}
            />
          ))}
        </div>
        {previewCourse && (
          <CoursePreviewModal
            course={previewCourse}
            onClose={() => setPreviewCourse(null)}
            onEnroll={(c) => handleEnroll(c)}
          />
        )}
      </main>
    </div>
  )
}
