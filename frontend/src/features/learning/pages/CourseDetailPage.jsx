import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, List, Menu, PlayCircle, X, Download } from 'lucide-react'
import { getAssetUrl } from '../../../api/client.js'
import { getEnrolledCourses, recordModuleCompletion } from '../../../api/learning/courses.js'
import defaultCourseImg from '../../../assets/images/courses/course1.jpg'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCourseDetail,
  useCheckEnrollment,
  useResumePoint,
  useRecordProgress,
  useUnenroll,
  useEnrolledCourses,
  useCompletedModuleIds,
} from '../../../lib/hooks/use-courses.js'
import { queryKeys } from '../../../lib/query-keys.js'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'
import { EditorJsReadOnly } from '../../app/components/admin/EditorJsReadOnly.jsx'
import { ModuleQuizPanel } from '../../assessment/components/ModuleQuizPanel.jsx'
import { SafeHtml } from '../../../shared/components/SafeHtml.jsx'
import { CourseDetailSkeleton } from '../../../shared/components/ContentSkeletons.jsx'
import { CompletionCelebration } from '../components/CompletionCelebration.jsx'
import { DiscussionPanel } from '../components/DiscussionPanel.jsx'
import { CourseReviewModal } from '../components/CourseReviewModal.jsx'
import { BookmarkButton } from '../../../shared/components/BookmarkButton.jsx'
import { useBookmarks } from '../../../lib/hooks/use-bookmarks.js'
import { usePublishedLibrary } from '../../../lib/hooks/use-library.js'
import { Icon, icons } from '../../../shared/icons.jsx'

const TOC_BREAKPOINT = '(max-width: 900px)'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const m = window.matchMedia(query)
    const handler = () => setMatches(m.matches)
    handler()
    m.addEventListener('change', handler)
    return () => m.removeEventListener('change', handler)
  }, [query])
  return matches
}

/** Circular progress (OpenClassrooms-style) for course completion. */
function CourseProgressIndicator({ percent }) {
  const p = Math.min(100, Math.max(0, Number(percent) || 0))
  const size = 52
  const stroke = 4
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (p / 100) * c
  const label = `${Math.round(p)}% completed`
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.5rem 0.875rem',
        borderRadius: 14,
        background: 'var(--orange-surface)',
        border: '1px solid var(--orange-border-subtle)',
        width: 'fit-content'
      }}
      role="img"
      aria-label={label}
    >
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden style={{ position: 'absolute' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--slogbaa-border)"
            strokeWidth={stroke}
            opacity="0.3"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--slogbaa-blue)"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--slogbaa-text)', zIndex: 1 }}>{Math.round(p)}%</span>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--slogbaa-text)' }}>Course Progress</p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)' }}>{p >= 100 ? 'Course completed!' : 'Keep going!'}</p>
      </div>
    </div>
  )
}

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
    margin: '0 auto',
    width: '100%',
    maxWidth: 1320,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  /** Sub-header: back + course title + progress (OpenClassrooms-style). */
  courseSubHeader: {
    flexShrink: 0,
    padding: '1.25rem clamp(1rem, 3vw, 2rem)',
    borderBottom: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  courseSubHeaderTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  courseSubHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    minWidth: 0,
    flex: '1 1 300px',
  },
  courseThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    objectFit: 'cover',
    flexShrink: 0,
    background: 'var(--slogbaa-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  courseThumbPh: {
    width: 64,
    height: 64,
    borderRadius: 14,
    background: 'var(--slogbaa-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  backToCourses: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    marginBottom: '0.5rem',
    transition: 'transform 0.2s ease',
  },
  courseTitleLms: {
    margin: 0,
    fontSize: 'clamp(1.25rem, 3vw, 1.625rem)',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  courseDescLms: {
    margin: '0.35rem 0 0',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
    maxWidth: 600,
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  courseSubHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
  },
  iconBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    padding: 0,
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  leaveLink: {
    padding: '0.6rem 1rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  rateBtn: {
    padding: '0.6rem 1.125rem',
    borderRadius: 10,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(245, 130, 32, 0.25)',
  },
  rateBtnDisabled: {
    background: 'var(--slogbaa-border)',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'not-allowed',
    opacity: 0.6,
    boxShadow: 'none',
  },
  /** Row: TOC + scrollable lesson (flex chain + article overflow = full module content visible). */
  content: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  /** Desktop TOC rail when collapsed */
  tocRail: {
    flex: '0 0 52px',
    minHeight: 0,
    borderRight: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '0.75rem',
  },
  sidebar: {
    flex: '0 0 320px',
    width: 320,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    zIndex: 5,
  },
  tocHeader: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    fontSize: '0.8125rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--slogbaa-text-muted)',
  },
  tocSectionBanner: {
    margin: '1.25rem 1.25rem 0.75rem',
    padding: '0.625rem 1rem',
    borderRadius: 10,
    fontSize: '0.75rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--slogbaa-blue)',
    background: 'var(--orange-surface)',
    border: '1px solid var(--orange-border-subtle)',
  },
  tocScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '0 0.75rem 1.25rem',
  },
  moduleList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  moduleItem: {
    marginBottom: '0.5rem',
  },
  moduleLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.75rem 1rem',
    minHeight: 56,
    borderRadius: 12,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    textDecoration: 'none',
    border: '1px solid transparent',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  moduleLinkThumb: {
    width: 36,
    height: 36,
    borderRadius: 10,
    objectFit: 'cover',
    flexShrink: 0,
    background: 'var(--slogbaa-border)',
  },
  moduleIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 800,
    border: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text-muted)',
    background: 'var(--slogbaa-bg)',
  },
  moduleLinkActive: {
    background: 'var(--orange-surface)',
    borderColor: 'var(--orange-border-subtle)',
    color: 'var(--slogbaa-text)',
    boxShadow: '0 2px 8px rgba(245, 130, 32, 0.08)',
  },
  moduleTitle: {
    fontWeight: 700,
    lineHeight: 1.3,
  },
  moduleMeta: {
    display: 'block',
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
    fontWeight: 500,
  },
  sidebarBackLinks: {
    flexShrink: 0,
    marginTop: 'auto',
    padding: '0.75rem 0.75rem 1rem',
    borderTop: '1px solid var(--slogbaa-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  sidebarBackLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
  // Article scrolls as a whole; notes live in a nested scroll pane (max-height) so quiz stays reachable below.
  article: {
    flex: '1 1 0',
    minWidth: 0,
    minHeight: 0,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    background: 'var(--slogbaa-bg)',
    scrollBehavior: 'smooth',
  },
  articleInner: {
    maxWidth: 820,
    margin: '0 auto',
    width: '100%',
    padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 3rem) 6rem',
    boxSizing: 'border-box',
  },
  /** OpenClassrooms style: no constrained scroll box for main content text. */
  notesContentRegion: {
    marginTop: '1.5rem',
    marginBottom: '2.5rem',
    boxSizing: 'border-box',
  },
  scrollHint: {
    marginTop: '2rem',
    padding: '1.25rem',
    borderRadius: 14,
    background: 'var(--orange-surface)',
    border: '1px solid var(--orange-border-subtle)',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    fontWeight: 600,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  lessonTitle: {
    margin: '0 0 1.25rem',
    fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
  },
  lessonDescription: {
    margin: '0 0 2.5rem',
    fontSize: '1.125rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text-muted)',
    fontWeight: 500,
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
  block: {
    marginBottom: '1.5rem',
  },
  blockWrapper: {
    marginBottom: '1.25rem',
    borderRadius: 8,
    padding: 0,
    transition: 'background 0.2s, box-shadow 0.2s, border-color 0.2s',
  },
  blockWrapperFocused: {
    padding: '0.35rem 0.5rem 0.35rem 0.75rem',
    background: 'rgba(37, 99, 235, 0.06)',
    borderLeft: '4px solid var(--slogbaa-blue)',
    boxShadow: '0 1px 8px rgba(37, 99, 235, 0.1)',
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
    padding: '1.75rem 2rem',
    background: 'var(--orange-surface)',
    border: '1px solid var(--orange-border-subtle)',
    borderRadius: 18,
    borderLeft: '5px solid var(--slogbaa-blue)',
  },
  nextStepCard: {
    marginTop: '4rem',
    padding: '2.5rem',
    borderRadius: 20,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    textAlign: 'center',
    boxShadow: 'var(--slogbaa-glass-shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
  },
  nextStepTitle: {
    margin: 0,
    fontSize: '1.375rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.02em',
  },
  nextStepBtn: {
    padding: '0.875rem 2rem',
    borderRadius: 12,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 24px rgba(245, 130, 32, 0.3)',
    textDecoration: 'none',
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

function BlockWithProgressObserver({
  block,
  moduleId,
  blockOrder,
  onViewed,
  onFocusChange,
  isFocused,
  scrollRoot,
  courseId,
  bookmarks,
  skipProgress = false,
}) {
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
        if (!skipProgress && ratio >= 0.25 && onViewed && blockOrder != null) {
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
  }, [block?.id, blockOrder, moduleId, onViewed, onFocusChange, scrollRoot, skipProgress])

  return (
    <div
      ref={ref}
      style={{
        ...styles.blockWrapper,
        ...(isFocused ? styles.blockWrapperFocused : {}),
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ContentBlockRenderer block={block} />
        </div>
        <BookmarkButton
          courseId={courseId}
          moduleId={moduleId}
          contentBlockId={block.id}
          bookmarks={bookmarks}
        />
      </div>
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
          <img
            src={getAssetUrl(imageUrl)}
            alt={imageAltText || ''}
            style={styles.blockImage}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
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

function CourseResources({ courseId }) {
  const { data: resources = [], isLoading } = usePublishedLibrary()
  const courseResources = resources.filter(r => r.courseId === courseId)

  if (isLoading || courseResources.length === 0) return null

  return (
    <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: 20, background: 'var(--slogbaa-surface)', border: '1px solid var(--slogbaa-border)' }}>
      <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--slogbaa-text)' }}>
        Library Resources for this Course
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {courseResources.map(r => (
          <li key={r.id} style={{ padding: '1rem', borderRadius: 12, background: 'var(--slogbaa-bg)', border: '1px solid var(--slogbaa-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--slogbaa-text)' }}>{r.title}</div>
              {r.description && <div style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', marginTop: '0.25rem' }}>{r.description}</div>}
            </div>
            <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slogbaa-blue)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}>
              <Download size={16} /> Open
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CourseDetailPage() {
  const { courseId, moduleId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const resumeCheckedRef = useRef(false)

  // TanStack Query — cached, deduplicated, auto-retry
  const { data: course = null, isLoading: courseLoading, error: courseError } = useCourseDetail(courseId)
  const { data: enrolled = false, isLoading: enrolledLoading } = useCheckEnrollment(courseId)
  const { data: resumePoint } = useResumePoint(courseId, { enabled: enrolled && !moduleId && !resumeCheckedRef.current })
  const { data: enrolledCourses = [] } = useEnrolledCourses()
  const { data: completedModulesData } = useCompletedModuleIds(courseId, { enabled: enrolled })
  const completedModuleIdSet = useMemo(
    () => new Set((completedModulesData?.completedModuleIds ?? []).map(String)),
    [completedModulesData]
  )

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
  const modules = course?.modules ?? []
  const selectedModuleCompleted =
    Boolean(selectedModule?.id) && completedModuleIdSet.has(String(selectedModule.id))
  const selectedModuleHasQuiz = Boolean(
    selectedModule?.hasQuiz === true || selectedModule?.has_quiz === true
  )
  const maxBlockOrderRecordedRef = useRef(-1)
  const maxBlockOrderRef = useRef(0)
  const blockRatiosRef = useRef({})
  const notesScrollRef = useRef(null)
  const [notesScrollRoot, setNotesScrollRoot] = useState(null)
  const notesScrollRefCallback = useCallback((el) => {
    notesScrollRef.current = el
    setNotesScrollRoot(el)
  }, [])
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
    setNotesReadThrough(Boolean(selectedModuleCompleted))
  }, [selectedModule?.id, selectedModuleCompleted])

  const [showCelebration, setShowCelebration] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const isNarrow = useMediaQuery(TOC_BREAKPOINT)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const unenrollMutation = useUnenroll()
  const completionPct = useMemo(
    () =>
      enrolledCourses.find((c) => String(c.id) === String(courseId))?.completionPercentage ?? 0,
    [enrolledCourses, courseId]
  )

  const closeMobileToc = useCallback(() => {
    if (isNarrow) setMobileTocOpen(false)
  }, [isNarrow])

  useEffect(() => {
    if (!isNarrow) setMobileTocOpen(false)
  }, [isNarrow])

  useEffect(() => {
    if (!isNarrow || !mobileTocOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileTocOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isNarrow, mobileTocOpen])

  useEffect(() => {
    if (!isNarrow || !mobileTocOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isNarrow, mobileTocOpen])

  const handleLeaveCourse = useCallback(() => {
    unenrollMutation.mutate(courseId, {
      onSuccess: () => {
        navigate('/dashboard/courses')
      },
    })
    setShowLeaveConfirm(false)
  }, [courseId, unenrollMutation, navigate])

  const progressMutation = useRecordProgress()
  const { data: bookmarks = [] } = useBookmarks(courseId)

  // Record progress when blocks enter view (scroll root = notes pane). Quiz unlock uses notes scroll bottom only.
  const handleBlockViewed = useCallback(
    (modId, blockId, blockOrder) => {
      if (!courseId || !modId || !blockId || blockOrder == null) return
      if (blockOrder <= maxBlockOrderRecordedRef.current) return
      maxBlockOrderRecordedRef.current = blockOrder
      progressMutation.mutate({ courseId, moduleId: modId, contentBlockId: blockId })
    },
    [courseId, progressMutation]
  )

  const evaluateNotesScrollReadThrough = useCallback(() => {
    if (selectedModuleCompleted) {
      setNotesReadThrough(true)
      return
    }
    if (!selectedModuleHasQuiz) {
      setNotesReadThrough(true)
      return
    }
    if (blocks.length === 0) {
      setNotesReadThrough(true)
      return
    }
    if (!notesVisible) return
    
    // In OpenClassrooms-style, we use the main article scroll
    const el = articleRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const threshold = 100 // larger threshold for whole page scroll
    if (scrollHeight <= clientHeight + threshold) {
      setNotesReadThrough(true)
      return
    }
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setNotesReadThrough(true)
    }
  }, [blocks.length, notesVisible, selectedModuleHasQuiz, selectedModuleCompleted])

  useEffect(() => {
    evaluateNotesScrollReadThrough()
  }, [selectedModule?.id, blocks.length, notesVisible, selectedModuleHasQuiz, evaluateNotesScrollReadThrough])

  const articleRef = useRef(null)
  useEffect(() => {
    const el = articleRef.current
    if (!el || !selectedModule) return
    const onScroll = () => evaluateNotesScrollReadThrough()
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScroll) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro?.disconnect()
    }
  }, [selectedModule?.id, evaluateNotesScrollReadThrough, selectedModule])

  const handleStartQuiz = useCallback(() => {
    setNotesVisible(false)
    // Scroll to top of quiz
    articleRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  const handleRereadNotes = useCallback(() => {
    maxBlockOrderRecordedRef.current = -1
    if (articleRef.current) articleRef.current.scrollTop = 0
    setNotesReadThrough(false)
    setNotesVisible(true)
  }, [])

  const currentIndex = modules.findIndex((m) => String(m.id) === String(selectedModule?.id))
  const nextModule = modules[currentIndex + 1]

  // Sequential Access: A module is locked if any preceding module in the array is not completed.
  const isModuleLocked = useMemo(() => {
    if (!modules.length || currentIndex <= 0) return false
    for (let i = 0; i < currentIndex; i++) {
      if (!completedModuleIdSet.has(String(modules[i].id))) return true
    }
    return false
  }, [modules, currentIndex, completedModuleIdSet])

  const handleNextModule = useCallback(async () => {
    if (!selectedModule) return
    
    // Explicitly record completion of current module when "Next" is clicked
    try {
      await recordModuleCompletion(token, courseId, selectedModule.id)
      // Await invalidations to ensure the next module is "unlocked" before we navigate/redirect
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.courses.completedModules(courseId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.courses.enrolled() })
      ])
    } catch (err) {
      console.error('Failed to record module completion:', err)
    }

    if (nextModule) {
      navigate(`/dashboard/courses/${courseId}/modules/${nextModule.id}`)
      // Scroll article to top for the new module
      setTimeout(() => {
        if (articleRef.current) articleRef.current.scrollTop = 0
      }, 0)
    } else {
      setShowCelebration(true)
    }
  }, [nextModule, navigate, courseId, selectedModule, token, queryClient])

  // Guard: If current module is locked, redirect to the first uncompleted module
  useEffect(() => {
    if (!loading && enrolled && isModuleLocked && modules.length > 0) {
      const firstIncomplete = modules.find(m => !completedModuleIdSet.has(String(m.id))) || modules[0]
      if (firstIncomplete.id !== selectedModule?.id) {
        navigate(`/dashboard/courses/${courseId}/modules/${firstIncomplete.id}`, { replace: true })
      }
    }
  }, [isModuleLocked, loading, enrolled, modules, completedModuleIdSet, selectedModule?.id, courseId, navigate])

  useEffect(() => {
    if (!notesScrollRoot) return
    evaluateNotesScrollReadThrough()
  }, [notesScrollRoot, evaluateNotesScrollReadThrough])

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

  // After a module quiz is passed and completion recorded, refresh progress + check course completion
  const handleModuleCompleted = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.courses.enrolled() })
    queryClient.invalidateQueries({ queryKey: queryKeys.courses.completedModules(courseId) })
    try {
      const list = await getEnrolledCourses(token)
      const thisCourse = list.find((c) => String(c.id) === String(courseId))
      if (thisCourse && thisCourse.completionPercentage >= 100) {
        setShowCelebration(true)
      }
    } catch {
      // Non-critical — silently ignore if enrolled courses fetch fails
    }
  }, [token, courseId, queryClient])

  // Record progress for modules with no content blocks
  useEffect(() => {
    if (!courseId || !selectedModule || !enrolled || selectedModuleCompleted) return
    const blocks = selectedModule.contentBlocks
    if (blocks && blocks.length > 0) return // blocks case handled by BlockWithProgressObserver
    progressMutation.mutate({ courseId, moduleId: selectedModule.id })
  }, [courseId, selectedModule?.id, enrolled, progressMutation, selectedModuleCompleted])

  if (loading) {
    return (
      <div style={styles.layout}>
        <main style={{ ...styles.main, padding: '1rem clamp(1rem, 3vw, 1.75rem)' }}>
          <CourseDetailSkeleton />
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


  const tocInner = (
    <>
      <div style={styles.tocHeader}>
        <span>Table of contents</span>
        {isNarrow ? (
          <button
            type="button"
            style={{ ...styles.iconBtn, width: 36, height: 36, border: 'none', background: 'transparent' }}
            onClick={() => setMobileTocOpen(false)}
            aria-label="Close table of contents"
          >
            <X size={20} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            style={{ ...styles.iconBtn, width: 36, height: 36, border: 'none', background: 'transparent' }}
            onClick={() => setTocCollapsed(true)}
            aria-label="Collapse table of contents"
          >
            <X size={20} aria-hidden />
          </button>
        )}
      </div>
      <div style={styles.tocSectionBanner}>Modules in this course</div>
      <div style={styles.tocScroll}>
        <ul style={styles.moduleList}>
          {modules.map((m, idx) => {
            const active = selectedModule?.id === m.id
            const modDone = completedModuleIdSet.has(String(m.id))
            
            // Check if this module is locked (not the first module and previous one isn't done)
            let isLocked = false
            if (idx > 0) {
              for (let j = 0; j < idx; j++) {
                if (!completedModuleIdSet.has(String(modules[j].id))) {
                  isLocked = true
                  break
                }
              }
            }

            return (
              <li key={m.id} style={styles.moduleItem}>
                <Link
                  to={isLocked ? '#' : `/dashboard/courses/${courseId}/modules/${m.id}`}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault()
                      return
                    }
                    closeMobileToc()
                  }}
                  style={{
                    ...styles.moduleLink,
                    ...(active ? styles.moduleLinkActive : {}),
                    ...(isLocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                  }}
                >
                  {isLocked ? (
                    <Icon icon={icons.lock} size={20} style={{ flexShrink: 0, color: 'var(--slogbaa-text-muted)', marginTop: 3 }} />
                  ) : active ? (
                    <PlayCircle size={22} strokeWidth={2} style={{ flexShrink: 0, color: 'var(--slogbaa-blue)', marginTop: 3 }} aria-hidden />
                  ) : modDone ? (
                    <CheckCircle size={22} strokeWidth={2} style={{ flexShrink: 0, color: 'var(--slogbaa-green)', marginTop: 3 }} aria-hidden title="Completed" />
                  ) : m.imageUrl ? (
                    <img src={getAssetUrl(m.imageUrl)} alt="" style={styles.moduleLinkThumb} loading="lazy" onError={(e) => { e.target.style.display = 'none' }} />
                  ) : (
                    <span style={styles.moduleIndexBadge}>{idx + 1}</span>
                  )}
                  <span style={{ minWidth: 0 }}>
                    <span style={{ ...styles.moduleTitle, ...(active ? { fontWeight: 700 } : {}) }}>{m.title}</span>
                    <span style={styles.moduleMeta}>
                      {modDone && <span style={{ color: 'var(--slogbaa-green)', fontWeight: 600 }}>Completed · </span>}
                      {m.estimatedMinutes != null && <>~{m.estimatedMinutes} min</>}
                      {m.estimatedMinutes != null && (m.hasQuiz === true || m.has_quiz === true) && <> · </>}
                      {(m.hasQuiz === true || m.has_quiz === true) && <>Quiz</>}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div style={styles.sidebarBackLinks}>
        <Link to="/dashboard/courses" style={styles.sidebarBackLink} onClick={closeMobileToc}>
          ← All courses
        </Link>
        <Link to="/dashboard" style={styles.sidebarBackLink} onClick={closeMobileToc}>
          ← Dashboard
        </Link>
      </div>
    </>
  )

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <div style={styles.courseSubHeader}>
          <div style={styles.courseSubHeaderTop}>
            <div style={styles.courseSubHeaderLeft}>
              <img
                src={course.imageUrl ? getAssetUrl(course.imageUrl) : defaultCourseImg}
                alt=""
                style={styles.courseThumb}
                onError={(e) => { e.target.onerror = null; e.target.src = defaultCourseImg }}
              />
              <div style={{ minWidth: 0 }}>
                <Link to="/dashboard/courses" style={styles.backToCourses}>
                  <ArrowLeft size={14} aria-hidden /> Back to courses
                </Link>
                <h1 style={styles.courseTitleLms}>{course.title}</h1>
                {course.description ? <p style={styles.courseDescLms}>{course.description}</p> : null}
              </div>
            </div>
            <div style={styles.courseSubHeaderActions}>
              {isNarrow && (
                <button
                  type="button"
                  style={styles.iconBtn}
                  onClick={() => setMobileTocOpen(true)}
                  aria-label="Open table of contents"
                >
                  <List size={20} aria-hidden />
                </button>
              )}
              <button
                type="button"
                className={completionPct >= 100 ? 'rate-review-pulse' : ''}
                style={{
                  ...styles.rateBtn,
                  ...(completionPct < 100 ? styles.rateBtnDisabled : {}),
                }}
                disabled={completionPct < 100}
                onClick={() => setShowReviewModal(true)}
                title={completionPct < 100 ? 'Complete the course to leave a review.' : 'Rate & Review'}
              >
                <Icon icon={icons.star} size={15} />
                Rate & Review
              </button>
              <button
                type="button"
                style={styles.leaveLink}
                onClick={() => setShowLeaveConfirm(true)}
                disabled={unenrollMutation.isPending}
              >
                {unenrollMutation.isPending ? 'Leaving…' : 'Leave course'}
              </button>
            </div>
          </div>
          <CourseProgressIndicator percent={completionPct} />
        </div>

        <div style={styles.content}>
          {!isNarrow && tocCollapsed && (
            <div style={styles.tocRail}>
              <button
                type="button"
                style={styles.iconBtn}
                onClick={() => setTocCollapsed(false)}
                aria-label="Open table of contents"
              >
                <Menu size={20} aria-hidden />
              </button>
            </div>
          )}
          {!isNarrow && !tocCollapsed && <aside style={styles.sidebar}>{tocInner}</aside>}

          {isNarrow && mobileTocOpen && (
            <>
              <button
                type="button"
                aria-label="Close table of contents"
                onClick={() => setMobileTocOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 200,
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  background: 'rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                }}
              />
              <aside
                style={{
                  ...styles.sidebar,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 'min(320px, 92vw)',
                  zIndex: 201,
                  boxShadow: '8px 0 32px rgba(0,0,0,0.25)',
                }}
              >
                {tocInner}
              </aside>
            </>
          )}

          <article ref={articleRef} style={styles.article}>
            <div style={styles.articleInner}>
              {selectedModule ? (
                <>
                  <div>
                    <h2 style={styles.lessonTitle}>{selectedModule.title}</h2>
                    {selectedModule.description && (
                      <p style={styles.lessonDescription}>{selectedModule.description}</p>
                    )}
                    {selectedModuleCompleted && (
                      <div
                        style={{
                          marginBottom: '1rem',
                          padding: '0.65rem 1rem',
                          borderRadius: 10,
                          background: 'rgba(52, 211, 153, 0.08)',
                          border: '1px solid rgba(52, 211, 153, 0.35)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--slogbaa-green)',
                        }}
                      >
                        Module completed — notes and quiz are view only.
                      </div>
                    )}
                    {selectedModuleHasQuiz && notesVisible && !selectedModuleCompleted && (
                      <div
                        style={{
                          marginBottom: '1rem',
                          padding: '1rem 1.25rem',
                          borderRadius: 14,
                          background: 'var(--slogbaa-glass-bg-subtle)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1px solid var(--slogbaa-glass-border-subtle)',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.55 }}>
                          Read the notes in the <strong style={{ color: 'var(--slogbaa-text)' }}>scrollable section below</strong>
                          {' '}and scroll to the very bottom. Then <strong style={{ color: 'var(--slogbaa-text)' }}>Start quiz</strong> will unlock.
                        </p>
                      </div>
                    )}
                  </div>
                  <div style={styles.notesContentRegion}>
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
                            scrollRoot={notesScrollRoot}
                            courseId={courseId}
                            bookmarks={bookmarks}
                            skipProgress={selectedModuleCompleted}
                          />
                        ))}
                        {(!selectedModule.contentBlocks || selectedModule.contentBlocks.length === 0) && (
                          <p style={{ color: 'var(--slogbaa-text-muted)' }}>No content in this module yet.</p>
                        )}
                        {selectedModuleHasQuiz && !selectedModuleCompleted && !notesReadThrough && blocks.length > 0 && (
                          <div style={styles.scrollHint}>
                            <Icon icon={icons.enrolled} size={24} style={{ color: 'var(--slogbaa-blue)' }} />
                            <span>Continue reading to unlock the quiz</span>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--slogbaa-text-muted)' }}>Scroll to the very bottom</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ padding: '0.5rem 0' }}>
                        {!selectedModuleCompleted && (
                          <>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
                              Module notes are hidden while the quiz is open. Re-read the notes anytime to refresh.
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
                          </>
                        )}
                        {selectedModuleCompleted && (
                          <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
                            Notes are view only for this completed module.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedModuleHasQuiz && (
                    <ModuleQuizPanel
                      token={token}
                      courseId={courseId}
                      moduleId={selectedModule.id}
                      visible={selectedModuleHasQuiz}
                      showPanel
                      notesReadThrough={notesReadThrough || blocks.length === 0 || selectedModuleCompleted}
                      notesVisible={notesVisible}
                      moduleCompleted={selectedModuleCompleted}
                      onStartQuiz={handleStartQuiz}
                      onRereadNotes={handleRereadNotes}
                      onModuleCompleted={handleModuleCompleted}
                    />
                  )}

                  {/* NEXT MODULE CTA */}
                  {notesReadThrough && (
                    <div style={styles.nextStepCard}>
                      <Icon 
                        icon={selectedModuleCompleted ? icons.enrolled : icons.loader} 
                        size={48} 
                        style={{ color: selectedModuleCompleted ? 'var(--slogbaa-green)' : 'var(--slogbaa-blue)', opacity: 0.8 }} 
                      />
                      <h3 style={styles.nextStepTitle}>
                        {selectedModuleCompleted 
                          ? (nextModule ? 'Ready for the next one?' : 'You\'ve completed the course!')
                          : (selectedModuleHasQuiz ? 'Almost there! Pass the quiz to continue.' : 'Great job reading through!')}
                      </h3>
                      
                      {(!selectedModuleHasQuiz || selectedModuleCompleted) ? (
                        <button
                          type="button"
                          onClick={handleNextModule}
                          style={styles.nextStepBtn}
                        >
                          {nextModule ? (
                            <>Next Module: {nextModule.title} <Icon icon={icons.arrowRight} size={18} /></>
                          ) : (
                            <>Complete Course <Icon icon={icons.partyPopper} size={18} /></>
                          )}
                        </button>
                      ) : (
                        <p style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
                          Please complete the quiz above to unlock the next module.
                        </p>
                      )}
                    </div>
                  )}

                  <CourseResources courseId={courseId} />
                  <DiscussionPanel courseId={courseId} moduleId={selectedModule?.id} />
                </>
              ) : (
                <p style={{ color: 'var(--slogbaa-text-muted)' }}>Select a module from the table of contents.</p>
              )}
            </div>
          </article>
        </div>
      </main>
      {showCelebration && (
        <CompletionCelebration
          courseTitle={course.title}
          onClose={() => setShowCelebration(false)}
        />
      )}
      {showLeaveConfirm && (
        <ConfirmModal
          message="Are you sure you want to leave this course? Your progress will be preserved."
          onContinue={handleLeaveCourse}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}
      {showReviewModal && (
        <CourseReviewModal
          courseId={courseId}
          courseTitle={course.title}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  )
}
