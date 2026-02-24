import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getPublishedCourses } from '../../../api/learning/courses.js'

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
  card: {
    display: 'block',
    background: 'var(--slogbaa-surface)',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid var(--slogbaa-border)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'box-shadow 0.2s',
  },
  cardHover: {
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
  },
  cardBody: {
    padding: '1.25rem',
  },
  cardTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  cardDescription: {
    margin: '0 0 0.75rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.45,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardMeta: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-blue)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError(null)
    getPublishedCourses(token)
      .then(setCourses)
      .catch((err) => setError(err?.message ?? 'Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [token])

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

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Courses</h1>
          <p style={styles.subtitle}>
            {courses.length === 0 ? 'No courses available yet.' : `${courses.length} course${courses.length === 1 ? '' : 's'} available`}
          </p>
        </div>
        <div style={styles.cardGrid}>
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/dashboard/courses/${course.id}`}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = styles.card.boxShadow
              }}
            >
              <div style={styles.cardBody}>
                <h2 style={styles.cardTitle}>{course.title}</h2>
                <p style={styles.cardDescription}>{course.description || 'No description.'}</p>
                <span style={styles.cardMeta}>
                  <FontAwesomeIcon icon={icons.course} />
                  {course.moduleCount} module{course.moduleCount !== 1 ? 's' : ''} · View course →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
