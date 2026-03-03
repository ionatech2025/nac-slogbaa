import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { getAdminCourseDetails, addModule, publishCourse } from '../../../api/admin/courses.js'
import { AddModuleModal } from '../components/admin/AddModuleModal.jsx'

const styles = {
  page: {
    maxWidth: 720,
    margin: '0 auto',
    paddingTop: '2rem',
    paddingBottom: '3rem',
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
    marginBottom: '2rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  description: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  badge: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 500,
    background: 'rgba(81, 175, 56, 0.15)',
    color: 'var(--slogbaa-green, #0a7c42)',
  },
  badgeDraft: {
    background: 'rgba(128,128,128,0.15)',
    color: 'var(--slogbaa-text-muted)',
  },
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  moduleCard: {
    display: 'block',
    padding: '1.25rem 1.5rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  moduleCardHover: {
    borderColor: 'var(--slogbaa-orange)',
    boxShadow: '0 2px 8px rgba(241, 134, 37, 0.12)',
  },
  moduleCardTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  moduleCardMeta: {
    margin: 0,
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  moduleCardDescription: {
    margin: '0.5rem 0 0',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  quizBadge: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.15rem 0.4rem',
    borderRadius: 4,
    fontSize: '0.7rem',
    fontWeight: 500,
    background: 'rgba(81, 175, 56, 0.12)',
    color: 'var(--slogbaa-green, #0a7c42)',
  },
  addModuleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-surface)',
    border: '2px dashed var(--slogbaa-border)',
    borderRadius: 8,
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
  addModuleBtnHover: {
    borderColor: 'var(--slogbaa-orange)',
    color: 'var(--slogbaa-orange)',
  },
  publishBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  loading: { padding: '2rem', color: 'var(--slogbaa-text-muted)' },
  error: { padding: '1.5rem', color: 'var(--slogbaa-error)' },
}

function ModuleCard({ module, courseId, onMouseEnter, onMouseLeave, hover }) {
  const blockCount = module.contentBlocks?.length ?? 0
  return (
    <Link
      to={`/admin/learning/${courseId}/modules/${module.id}`}
      style={{
        ...styles.moduleCard,
        ...(hover ? styles.moduleCardHover : {}),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 style={styles.moduleCardTitle}>{module.title}</h3>
      <p style={styles.moduleCardMeta}>
        Order: {module.moduleOrder ?? 0} · {blockCount} block{blockCount !== 1 ? 's' : ''}
      </p>
      {module.description && (
        <p style={styles.moduleCardDescription}>{module.description}</p>
      )}
      {module.hasQuiz && <span style={styles.quizBadge}>Has quiz</span>}
    </Link>
  )
}

export function AdminCoursePage() {
  const { courseId } = useParams()
  const { token, isSuperAdmin } = useOutletContext()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [hoveredModuleId, setHoveredModuleId] = useState(null)

  const refresh = useCallback(async () => {
    if (!token || !courseId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminCourseDetails(token, courseId)
      setCourse(data)
    } catch (err) {
      setError(err?.message ?? 'Failed to load course.')
    } finally {
      setLoading(false)
    }
  }, [token, courseId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleAddModule = async (data) => {
    await addModule(token, courseId, data)
    setModal(null)
    await refresh()
  }

  const handlePublish = async () => {
    await publishCourse(token, courseId)
    await refresh()
  }

  if (loading) return <p style={styles.loading}>Loading course…</p>
  if (error || !course) return <p style={styles.error}>{error || 'Course not found.'}</p>

  return (
    <div style={styles.page}>
      <Link to="/admin/learning" style={styles.backLink}>
        ← Back to Learning
      </Link>

      <header style={styles.header}>
        <h1 style={styles.title}>{course.title}</h1>
        {course.description && <p style={styles.description}>{course.description}</p>}
        <span style={{ ...styles.badge, ...(course.published ? {} : styles.badgeDraft) }}>
          {course.published ? 'Published' : 'Draft'}
        </span>
        {isSuperAdmin && !course.published && (
          <button type="button" style={styles.publishBtn} onClick={handlePublish}>
            <FontAwesomeIcon icon={icons.publish} /> Publish
          </button>
        )}
      </header>

      <div style={styles.moduleGrid}>
        {course.modules?.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            courseId={courseId}
            hover={hoveredModuleId === module.id}
            onMouseEnter={() => setHoveredModuleId(module.id)}
            onMouseLeave={() => setHoveredModuleId(null)}
          />
        ))}
      </div>

      {isSuperAdmin && (
        <button
          type="button"
          style={styles.addModuleBtn}
          onClick={() => setModal('addModule')}
          title="Add module"
        >
          <FontAwesomeIcon icon={icons.modules} /> Add module
        </button>
      )}

      {modal === 'addModule' && (
        <AddModuleModal
          token={token}
          course={course}
          onClose={() => setModal(null)}
          onSubmit={handleAddModule}
        />
      )}
    </div>
  )
}
