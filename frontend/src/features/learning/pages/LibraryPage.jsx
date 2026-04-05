import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { usePublishedLibrary } from '../../../lib/hooks/use-library.js'
import { usePublishedCourses } from '../../../lib/hooks/use-courses.js'
import { LibraryListSkeleton } from '../../../shared/components/ContentSkeletons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useMemo } from 'react'

const RESOURCE_TYPE_LABELS = {
  DOCUMENT: 'Document',
  POLICY_DOCUMENT: 'Policy document',
  READING_MATERIAL: 'Reading material',
}

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
    maxWidth: 900,
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
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    padding: '1rem 1.25rem',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 16,
    boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  },
  cardTitle: {
    margin: '0 0 0.35rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  cardMeta: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    marginBottom: '0.5rem',
  },
  cardDescription: {
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    margin: '0 0 0.75rem',
    lineHeight: 1.5,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  error: {
    padding: '1rem',
    color: 'var(--slogbaa-error)',
    fontSize: '0.9375rem',
  },
  loading: {
    padding: '2rem',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
}

export function LibraryPage() {
  useDocumentTitle('Library')
  const { data: resources = [], isLoading: libLoading, error: libError } = usePublishedLibrary()
  const { data: pagedCourses, isLoading: coursesLoading } = usePublishedCourses(0, 1000)
  const courses = pagedCourses?.content ?? []

  const isLoading = libLoading || coursesLoading
  const error = libError

  const groupedResources = useMemo(() => {
    if (!resources.length) return { general: [], byCourse: [] }

    const general = resources.filter(r => !r.courseId)
    const courseIds = [...new Set(resources.filter(r => r.courseId).map(r => r.courseId))]

    const byCourse = courseIds.map(courseId => {
      const course = courses.find(c => c.id === courseId)
      return {
        courseId,
        courseTitle: course ? course.title : 'Associated Course',
        resources: resources.filter(r => r.courseId === courseId)
      }
    })

    return { general, byCourse }
  }, [resources, courses])

  const ResourceItem = ({ r }) => (
    <li key={r.id} style={styles.card}>
      <h2 style={styles.cardTitle}>{r.title}</h2>
      <div style={styles.cardMeta}>
        {RESOURCE_TYPE_LABELS[r.resourceType] ?? r.resourceType}
        {r.fileType && ` · ${r.fileType}`}
      </div>
      {r.description && (
        <p style={styles.cardDescription}>{r.description}</p>
      )}
      <a
        href={r.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        <FontAwesomeIcon icon={icons.download} />
        Open / download
      </a>
    </li>
  )

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Library</h1>
          <p style={styles.subtitle}>
            Published documents and reading materials you can open or download.
          </p>
        </header>

        {error && <p style={styles.error}>{error.message || 'Failed to load library.'}</p>}
        {isLoading && <LibraryListSkeleton count={4} />}
        {!isLoading && !error && resources.length === 0 && (
          <p style={styles.empty}>No library resources published yet.</p>
        )}
        {!isLoading && !error && resources.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {groupedResources.general.length > 0 && (
              <section>
                <h2 style={{ ...styles.subtitle, color: 'var(--slogbaa-text)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  General Resources
                </h2>
                <ul style={styles.list}>
                  {groupedResources.general.map(r => <ResourceItem key={r.id} r={r} />)}
                </ul>
              </section>
            )}

            {groupedResources.byCourse.map(group => (
              <section key={group.courseId}>
                <h2 style={{ ...styles.subtitle, color: 'var(--slogbaa-text)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {group.courseTitle}
                </h2>
                <ul style={styles.list}>
                  {group.resources.map(r => <ResourceItem key={r.id} r={r} />)}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
