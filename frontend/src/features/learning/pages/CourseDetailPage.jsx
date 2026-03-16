import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAssetUrl } from '../../../api/client.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useCourseDetail, useCheckEnrollment, useResumePoint, useRecordProgress } from '../../../lib/hooks/use-courses.js'
import { EditorJsReadOnly } from '../../app/components/admin/EditorJsReadOnly.jsx'
import { ModuleQuizPanel } from '../../assessment/components/ModuleQuizPanel.jsx'
import { SafeHtml } from '../../../shared/components/SafeHtml.jsx'

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
    width: 'clamp(80px, 15vw, 120px)',
    height: 'auto',
    aspectRatio: '3/2',
    borderRadius: 8,
    objectFit: 'cover',
    flexShrink: 0,
    background: 'var(--slogbaa-border)',
  },
  courseImagePlaceholder: {
    width: 'clamp(80px, 15vw, 120px)',
    aspectRatio: '3/2',
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
    gap: '1.5rem',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  sidebar: {
    flex: '0 0 240px',
    minWidth: 200,
    maxWidth: '100%',
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
    padding: '0.75rem',
    minHeight: 44,
    borderRadius: 8,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    textDecoration: 'none',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border)',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
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
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  article: {
    flex: '1 1 280px',
    minWidth: 0,
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
    background: 'rgba(37, 99, 235, 0.06)',
    borderLeft: '4px solid var(--slogbaa-blue)',
    boxShadow: '0 2px 12px rgba(37, 99, 235, 0.12)',
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
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 14,
    borderLeft: '4px solid var(--slogbaa-blue)',
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
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 18,
    boxShadow: 'var(--slogbaa-glass-shadow)',
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
          <SafeHtml html={richText} style={styles.blockContentHtml} />
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
            <SafeHtml html={activityInstructions} style={styles.blockContentHtml} />
          )}
          {activityResources && (
            <SafeHtml html={activityResources} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--slogbaa-border)' }} />
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
  const resumeCheckedRef = useRef(false)

  // TanStack Query — cached, deduplicated, auto-retry
  const { data: course = null, isLoading: courseLoading, error: courseError } = useCourseDetail(courseId)
  const { data: enrolled = false, isLoading: enrolledLoading } = useCheckEnrollment(courseId)
  const { data: resumePoint } = useResumePoint(courseId, { enabled: enrolled && !moduleId && !resumeCheckedRef.current })

  const loading = courseLoading || enrolledLoading
  const error = courseError?.message ?? null

  // Resume: when no module in URL and enrolled, redirect to last viewed module
  useEffect(() => {
    if (!enrolled || !course || resumeCheckedRef.current || moduleId) {
      if (moduleId) resumeCheckedRef.current = true
      return
    }
    if (resumePoint?.lastModuleId && course.modules?.some((m) => m.id === resumePoint.lastModuleId)) {
      resumeCheckedRef.current = true
      navigate(`/dashboard/courses/${courseId}/modules/${resumePoint.lastModuleId}`, { replace: true })
    } else {
      resumeCheckedRef.current = true
    }
  }, [enrolled, course, resumePoint, moduleId, courseId, navigate])

  const selectedModule = course?.modules?.find((m) => m.id === moduleId) ?? course?.modules?.[0]
  const maxBlockOrderRecordedRef = useRef(-1)
  const maxBlockOrderRef = useRef(0)
  const blockRatiosRef = useRef({})
  const [articleEl, setArticleEl] = useState(null)
  const articleRef = useCallback((el) => setArticleEl(el), [])
  const [focusedBlockId, setFocusedBlockId] = useState(null)
  const [notesVisible, setNotesVisible] = useState(true)
  const [notesReadThrough, setNotesReadThrough] = useState(false)

  const blocks = selectedModule?.contentBlocks ?? []
  const maxBlockOrder = blocks.length === 0 ? 0 : Math.max(0, ...blocks.map((b) => b.blockOrder ?? 0))

  // Keep max block order ref in sync for use inside handleBlockViewed
  useEffect(() => {
    maxBlockOrderRef.current = maxBlockOrder
  }, [maxBlockOrder])

  // Reset state when switching modules
  useEffect(() => {
    maxBlockOrderRecordedRef.current = -1
    blockRatiosRef.current = {}
    setFocusedBlockId(null)
    setNotesVisible(true)
    setNotesReadThrough(false)
  }, [selectedModule?.id])

  const progressMutation = useRecordProgress()

  // Record progress only when advancing; mark notes as read-through when last block is viewed
  const handleBlockViewed = useCallback(
    (modId, blockId, blockOrder) => {
      if (!courseId || !modId || !blockId || blockOrder == null) return
      if (blockOrder <= maxBlockOrderRecordedRef.current) return
      maxBlockOrderRecordedRef.current = blockOrder
      progressMutation.mutate({ courseId, moduleId: modId, contentBlockId: blockId })
      if (blockOrder >= maxBlockOrderRef.current) setNotesReadThrough(true)
    },
    [courseId, progressMutation]
  )

  const handleStartQuiz = useCallback(() => setNotesVisible(false), [])
  const handleRereadNotes = useCallback(() => {
    maxBlockOrderRecordedRef.current = -1
    setNotesVisible(true)
    setNotesReadThrough(false)
  }, [])

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
    if (!courseId || !selectedModule || !enrolled) return
    const blocks = selectedModule.contentBlocks
    if (blocks && blocks.length > 0) return // blocks case handled by BlockWithProgressObserver
    progressMutation.mutate({ courseId, moduleId: selectedModule.id, contentBlockId: selectedModule.id })
  }, [courseId, selectedModule?.id, enrolled, progressMutation])

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
                background: 'var(--slogbaa-blue)',
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
            <img src={getAssetUrl(course.imageUrl)} alt={`Course: ${course.title}`} style={styles.courseImage} onError={(e) => { e.target.style.display = 'none' }} />
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
                      <img src={getAssetUrl(m.imageUrl)} alt={`Module: ${m.title}`} style={styles.moduleLinkThumb} loading="lazy" onError={(e) => { e.target.style.display = 'none' }} />
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
                {selectedModule.hasQuiz && notesVisible && (
                  <div
                    style={{
                      marginBottom: '1.25rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 14,
                      background: 'var(--slogbaa-glass-bg-subtle)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid var(--slogbaa-glass-border-subtle)',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
                      After reading the notes below, when you&apos;re ready, click <strong style={{ color: 'var(--slogbaa-text)' }}>Start quiz</strong> to take the module quiz.
                    </p>
                  </div>
                )}
                {notesVisible ? (
                  <>
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
                  <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', borderRadius: 14, background: 'var(--slogbaa-glass-bg-subtle)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid var(--slogbaa-glass-border-subtle)' }}>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
                      Module notes are hidden while the quiz is available. Re-read the notes anytime to refresh.
                    </p>
                    <button
                      type="button"
                      onClick={handleRereadNotes}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.55rem 0.9rem',
                        borderRadius: 10,
                        border: '1px solid var(--slogbaa-border)',
                        background: 'transparent',
                        color: 'var(--slogbaa-text)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Re-read Notes
                    </button>
                  </div>
                )}
                {(!notesVisible || notesReadThrough || blocks.length === 0) && (
                  <ModuleQuizPanel
                    token={token}
                    courseId={courseId}
                    moduleId={selectedModule.id}
                    visible={Boolean(selectedModule.hasQuiz)}
                    showPanel
                    notesReadThrough={notesReadThrough || blocks.length === 0}
                    notesVisible={notesVisible}
                    onStartQuiz={handleStartQuiz}
                    onRereadNotes={handleRereadNotes}
                  />
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
