import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAssetUrl } from '../../../api/client.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getCourseDetails, checkEnrollment, getResumePoint, recordProgress } from '../../../api/learning/courses.js'
import { EditorJsReadOnly } from '../../app/components/admin/EditorJsReadOnly.jsx'

const styles = {
  layout: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'var(--slogbaa-bg)',
  },
  main: {
    flex: 1,
    minHeight: 0,
    padding: '1.5rem 2rem',
    maxWidth: 1000,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topBar: {
    flexShrink: 0,
    background: 'var(--slogbaa-bg)',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
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
    flex: 1,
    minHeight: 0,
    display: 'flex',
    gap: '2rem',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  sidebar: {
    flex: '0 0 240px',
    minWidth: 200,
    overflowY: 'auto',
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
  sidebarBackLinks: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  sidebarBackLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
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
    minHeight: 0,
    overflowY: 'auto',
  },
  block: {
    marginBottom: '1.5rem',
  },
  blockWrapper: {
    marginBottom: '1.5rem',
    borderRadius: 12,
    padding: '0.5rem',
    transition: 'background 0.2s, box-shadow 0.2s, border-color 0.2s',
  },
  blockWrapperFocused: {
    background: 'rgba(241, 134, 37, 0.06)',
    borderLeft: '4px solid var(--slogbaa-orange)',
    boxShadow: '0 2px 12px rgba(241, 134, 37, 0.12)',
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

function BlockWithProgressObserver({ block, moduleId, blockOrder, onViewed, onFocusChange, isFocused, scrollRoot }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!moduleId || !block?.id) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio
        onFocusChange?.(block.id, ratio)
        // Only record progress when advancing (higher blockOrder) and block is meaningfully visible
        if (ratio >= 0.25 && onViewed && blockOrder != null) {
          onViewed(moduleId, block.id, blockOrder)
        }
      },
      {
        root: scrollRoot ?? null,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px 0px -10% 0px',
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [block?.id, blockOrder, moduleId, onViewed, onFocusChange, scrollRoot])

  return (
    <div
      ref={ref}
      style={{
        ...styles.blockWrapper,
        ...(isFocused ? styles.blockWrapperFocused : {}),
      }}
    >
      <ContentBlockRenderer block={block} />
    </div>
  )
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
          <img src={getAssetUrl(imageUrl)} alt={imageAltText || ''} style={styles.blockImage} loading="lazy" />
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
  const navigate = useNavigate()
  const { token } = useAuth()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const resumeCheckedRef = useRef(false)

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

  // Resume: when no module in URL and enrolled, redirect to last viewed module
  useEffect(() => {
    if (!token || !courseId || !enrolled || !course || resumeCheckedRef.current) return
    if (moduleId) {
      resumeCheckedRef.current = true
      return
    }
    resumeCheckedRef.current = true
    getResumePoint(token, courseId).then((resume) => {
      if (resume?.lastModuleId && course.modules?.some((m) => m.id === resume.lastModuleId)) {
        navigate(`/dashboard/courses/${courseId}/modules/${resume.lastModuleId}`, { replace: true })
      }
    })
  }, [token, courseId, enrolled, course, moduleId, navigate])

  const selectedModule = course?.modules?.find((m) => m.id === moduleId) ?? course?.modules?.[0]
  const maxBlockOrderRecordedRef = useRef(-1)
  const blockRatiosRef = useRef({})
  const [articleEl, setArticleEl] = useState(null)
  const articleRef = useCallback((el) => setArticleEl(el), [])
  const [focusedBlockId, setFocusedBlockId] = useState(null)

  // Reset max recorded and focus when switching modules
  useEffect(() => {
    maxBlockOrderRecordedRef.current = -1
    blockRatiosRef.current = {}
    setFocusedBlockId(null)
  }, [selectedModule?.id])

  // Record progress only when advancing (never overwrite with earlier blocks when scrolling up)
  const handleBlockViewed = useCallback(
    (modId, blockId, blockOrder) => {
      if (!token || !courseId || !modId || !blockId || blockOrder == null) return
      if (blockOrder <= maxBlockOrderRecordedRef.current) return
      maxBlockOrderRecordedRef.current = blockOrder
      recordProgress(token, courseId, modId, blockId)
    },
    [token, courseId]
  )

  const handleFocusChange = useCallback((blockId, ratio) => {
    blockRatiosRef.current[blockId] = ratio
    const entries = Object.entries(blockRatiosRef.current).filter(([, r]) => r > 0.05)
    if (entries.length === 0) {
      setFocusedBlockId(null)
      return
    }
    const best = entries.reduce((a, b) => (a[1] >= b[1] ? a : b))
    setFocusedBlockId((prev) => (prev === best[0] ? prev : best[0]))
  }, [])

  // Record progress for modules with no content blocks (use module id as block id)
  useEffect(() => {
    if (!token || !courseId || !selectedModule || !enrolled) return
    const blocks = selectedModule.contentBlocks
    if (blocks && blocks.length > 0) return // blocks case handled by BlockWithProgressObserver
    recordProgress(token, courseId, selectedModule.id, selectedModule.id)
  }, [token, courseId, selectedModule?.id, enrolled])

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
        <div style={styles.topBar}>
          <header style={styles.header}>
          {course.imageUrl ? (
            <img src={getAssetUrl(course.imageUrl)} alt="" style={styles.courseImage} onError={(e) => { e.target.style.display = 'none' }} />
          ) : (
            <div style={styles.courseImagePlaceholder}>📚</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={styles.title}>{course.title}</h1>
            <p style={styles.description}>{course.description || ''}</p>
          </div>
        </header>
        </div>
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
                      <img src={getAssetUrl(m.imageUrl)} alt="" style={styles.moduleLinkThumb} loading="lazy" onError={(e) => { e.target.style.display = 'none' }} />
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
            <div style={styles.sidebarBackLinks}>
              <Link to="/dashboard/courses" style={styles.sidebarBackLink}>
                ← Back to courses
              </Link>
              <Link to="/dashboard" style={styles.sidebarBackLink}>
                ← Back to dashboard
              </Link>
            </div>
          </aside>
          <article ref={articleRef} style={styles.article}>
            {selectedModule ? (
              <>
                <h2 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: 'var(--slogbaa-text)' }}>
                  {selectedModule.title}
                </h2>
                {selectedModule.description && (
                  <p style={{ margin: '0 0 1.5rem', color: 'var(--slogbaa-text-muted)' }}>{selectedModule.description}</p>
                )}
                {selectedModule.contentBlocks?.map((block) => (
                  <BlockWithProgressObserver
                    key={block.id}
                    block={block}
                    moduleId={selectedModule.id}
                    blockOrder={block.blockOrder ?? 0}
                    onViewed={handleBlockViewed}
                    onFocusChange={handleFocusChange}
                    isFocused={focusedBlockId === block.id}
                    scrollRoot={articleEl}
                  />
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
