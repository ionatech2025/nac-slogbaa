import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { usePublishedCourses, useEnrolledCourses, useEnrollInCourse } from '../../../lib/hooks/use-courses.js'
import { CourseCard } from '../../app/components/trainee/CourseCard.jsx'
import { CoursePreviewModal } from '../components/CoursePreviewModal.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'
import { QueryError } from '../../../shared/components/QueryError.jsx'
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
    maxWidth: 1000,
    margin: '0 auto',
    width: '100%',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    marginBottom: '1rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
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
  const { data: courses = [], isLoading: coursesLoading, error: coursesError, refetch } = usePublishedCourses()
  const { data: enrolled = [], isLoading: enrolledLoading } = useEnrolledCourses()
  const enrollMutation = useEnrollInCourse()
  const [courseView, setCourseView] = useState('vertical')
  const [previewCourse, setPreviewCourse] = useState(null)

  const loading = coursesLoading || enrolledLoading
  const error = coursesError?.message ?? (enrollMutation.error?.message || null)

  const enrolledIds = new Set(enrolled.map((c) => c.id))

  const toast = useToast()

  const handleEnroll = async (course) => {
    setPreviewCourse(null)
    enrollMutation.mutate(course.id, {
      onSuccess: () => toast.success(`Enrolled in "${course.title}"!`),
      onError: (err) => toast.error(err?.message ?? 'Enrollment failed.'),
    })
  }

  const handlePreview = (course) => setPreviewCourse(course)

  if (loading) {
    return (
      <div style={styles.layout}>
        <main style={styles.main}>
          <Link to="/dashboard" style={styles.backLink}>
            ← Back to dashboard
          </Link>
          <div style={styles.header}>
            <h1 style={styles.title}>Courses</h1>
            <p style={styles.subtitle}>Browse available courses</p>
          </div>
          <CardGridSkeleton count={4} />
        </main>
      </div>
    )
  }

  if (coursesError) {
    return (
      <div style={styles.layout}>
        <main style={styles.main}>
          <Link to="/dashboard" style={styles.backLink}>
            ← Back to dashboard
          </Link>
          <div style={styles.header}>
            <h1 style={styles.title}>Courses</h1>
          </div>
          <QueryError error={coursesError} onRetry={refetch} message="Failed to load courses" />
        </main>
      </div>
    )
  }

  const unenrolledCourses = courses.filter((c) => !enrolledIds.has(c.id))
  const isHorizontal = courseView === 'horizontal'

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <Link to="/dashboard" style={styles.backLink}>
          ← Back to dashboard
        </Link>
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
        {error && (
          <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-error)', fontSize: '0.9375rem' }}>{error}</p>
        )}
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
                imageUrl: course.imageUrl,
                meta: `${course.moduleCount} module${course.moduleCount !== 1 ? 's' : ''}`,
              }}
              onEnroll={handleEnroll}
              onPreview={handlePreview}
              variant={courseView}
              enrolling={enrollMutation.isPending && enrollMutation.variables === course.id}
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
