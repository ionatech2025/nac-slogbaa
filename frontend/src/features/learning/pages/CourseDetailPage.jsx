import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getCourseDetails, checkEnrollment } from '../../../api/learning/courses.js'
import { EditorJsReadOnly } from '../../app/components/admin/EditorJsReadOnly.jsx'

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
  },
  header: {
    marginBottom: '1.5rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  courseImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    objectFit: 'cover',
    flexShrink: 0,
    background: 'var(--slogbaa-border)',
  },
  courseImagePlaceholder: {
    width: 120,
    height: 80,
    borderRadius: 8,
    background: 'var(--slogbaa-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '2rem',
    flexShrink: 0,
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  description: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  content: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  sidebar: {
    flex: '0 0 240px',
    minWidth: 200,
  },
  moduleList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  moduleItem: {
    marginBottom: '0.25rem',
  },
  moduleLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 0.75rem',
    borderRadius: 8,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    textDecoration: 'none',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
  },
  moduleLinkThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    objectFit: 'cover',
    flexShrink: 0,
    background: 'var(--slogbaa-border)',
  },
  moduleLinkActive: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    borderColor: 'var(--slogbaa-blue)',
  },
  moduleTitle: {
    fontWeight: 500,
  },
  moduleMeta: {
    fontSize: '0.75rem',
    opacity: 0.85,
  },
  article: {
    flex: 1,
    minWidth: 280,
  },
  block: {
    marginBottom: '1.5rem',
  },
  blockTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  blockContent: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  blockContentHtml: {
    fontSize: '1rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text)',
  },
  blockImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
  },
  blockImageCaption: {
    margin: '0.5rem 0 0',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    fontStyle: 'italic',
  },
  blockVideo: {
    aspectRatio: '16/9',
    width: '100%',
    maxWidth: 640,
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
  },
  activityBlock: {
    padding: '1.25rem 1.5rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    borderLeft: '4px solid var(--slogbaa-orange)',
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
  enrollGate: {
    padding: '2rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    textAlign: 'center',
  },
  enrollGateTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  enrollGateText: {
    margin: '0 0 1.5rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
}

function ContentBlockRenderer({ block }) {
  const { blockType, richText, imageUrl, imageAltText, imageCaption, videoUrl, videoId, activityInstructions, activityResources } = block

  if (blockType === 'TEXT' && richText) {
    const isEditorJs = typeof richText === 'string' && richText.trim().startsWith('{') && (() => {
      try {
        const o = JSON.parse(richText)
        return o != null && typeof o === 'object' && 'blocks' in o
      } catch { return false }
    })()
    return (
      <div style={styles.block}>
        {isEditorJs ? (
          <EditorJsReadOnly data={richText} style={styles.blockContentHtml} />
        ) : (
          <div style={styles.blockContentHtml} dangerouslySetInnerHTML={{ __html: richText }} />
        )}
      </div>
    )
  }
  if (blockType === 'IMAGE' && imageUrl) {
    return (
      <div style={styles.block}>
        <figure style={{ margin: 0 }}>
          <img src={imageUrl} alt={imageAltText || ''} style={styles.blockImage} loading="lazy" />
          {imageCaption && <figcaption style={styles.blockImageCaption}>{imageCaption}</figcaption>}
        </figure>
      </div>
    )
  }
  if (blockType === 'VIDEO' && (videoId || videoUrl)) {
    const embedId = videoId || (videoUrl && videoUrl.match(/(?:v=|\/)([\w-]{11})(?:&|$)/)?.[1])
    return (
      <div style={styles.block}>
        {embedId ? (
          <iframe
            title="Video content"
            src={`https://www.youtube.com/embed/${embedId}`}
            style={styles.blockVideo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--slogbaa-blue)' }}>
            Watch video
          </a>
        )}
      </div>
    )
  }
  if (blockType === 'ACTIVITY' && (activityInstructions || activityResources)) {
    return (
      <div style={styles.block}>
        <div style={styles.activityBlock}>
          {activityInstructions && (
            <div style={styles.blockContentHtml} dangerouslySetInnerHTML={{ __html: activityInstructions }} />
          )}
          {activityResources && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--slogbaa-border)' }} dangerouslySetInnerHTML={{ __html: activityResources }} />
          )}
        </div>
      </div>
    )
  }
  return null
}

export function CourseDetailPage() {
  const { courseId, moduleId } = useParams()
  const { token } = useAuth()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token || !courseId) return
    setLoading(true)
    setError(null)
    Promise.all([getCourseDetails(token, courseId), checkEnrollment(token, courseId)])
      .then(([courseData, isEnrolled]) => {
        setCourse(courseData)
        setEnrolled(isEnrolled)
      })
      .catch((err) => setError(err?.message ?? 'Failed to load course.'))
      .finally(() => setLoading(false))
  }, [token, courseId])

  const selectedModule = course?.modules?.find((m) => m.id === moduleId) ?? course?.modules?.[0]

  if (loading) {
    return (
      <div style={styles.layout}>
        <main style={styles.main}>
          <p style={styles.loading}>Loading course…</p>
        </main>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div style={styles.layout}>
        <main style={styles.main}>
          <Link to="/dashboard/courses" style={styles.backLink}>
            ← Back to courses
          </Link>
          <div style={styles.error}>{error || 'Course not found.'}</div>
        </main>
      </div>
    )
  }

  if (!enrolled) {
    return (
      <div style={styles.layout}>
        <main style={styles.main}>
          <Link to="/dashboard/courses" style={styles.backLink}>
            ← Back to courses
          </Link>
          <div style={styles.enrollGate}>
            <h2 style={styles.enrollGateTitle}>{course.title}</h2>
            <p style={styles.enrollGateText}>
              You must enroll in this course to view its content. Go to the course list and click Enroll to get started.
            </p>
            <Link
              to="/dashboard/courses"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                background: 'var(--slogbaa-orange)',
                color: '#fff',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Browse courses →
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <Link to="/dashboard/courses" style={styles.backLink}>
          ← Back to courses
        </Link>
        <header style={styles.header}>
          {course.imageUrl ? (
            <img src={course.imageUrl} alt="" style={styles.courseImage} onError={(e) => { e.target.style.display = 'none' }} />
          ) : (
            <div style={styles.courseImagePlaceholder}>📚</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={styles.title}>{course.title}</h1>
            <p style={styles.description}>{course.description || ''}</p>
          </div>
        </header>
        <div style={styles.content}>
          <aside style={styles.sidebar}>
            <ul style={styles.moduleList}>
              {course.modules?.map((m) => (
                <li key={m.id} style={styles.moduleItem}>
                  <Link
                    to={`/dashboard/courses/${courseId}/modules/${m.id}`}
                    style={{
                      ...styles.moduleLink,
                      ...(selectedModule?.id === m.id ? styles.moduleLinkActive : {}),
                    }}
                  >
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt="" style={styles.moduleLinkThumb} loading="lazy" onError={(e) => { e.target.style.display = 'none' }} />
                    ) : (
                      <div style={{ ...styles.moduleLinkThumb, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📦</div>
                    )}
                    <span>
                      <span style={styles.moduleTitle}>{m.title}</span>
                      {m.hasQuiz && <span style={styles.moduleMeta}> · Quiz</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <article style={styles.article}>
            {selectedModule ? (
              <>
                <h2 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: 'var(--slogbaa-text)' }}>
                  {selectedModule.title}
                </h2>
                {selectedModule.description && (
                  <p style={{ margin: '0 0 1.5rem', color: 'var(--slogbaa-text-muted)' }}>{selectedModule.description}</p>
                )}
                {selectedModule.contentBlocks?.map((block) => (
                  <ContentBlockRenderer key={block.id} block={block} />
                ))}
                {(!selectedModule.contentBlocks || selectedModule.contentBlocks.length === 0) && (
                  <p style={{ color: 'var(--slogbaa-text-muted)' }}>No content in this module yet.</p>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--slogbaa-text-muted)' }}>Select a module to view content.</p>
            )}
          </article>
        </div>
      </main>
    </div>
  )
}
