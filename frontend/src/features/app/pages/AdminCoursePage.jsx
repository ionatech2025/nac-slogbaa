import { useState, memo } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAdminCourseDetail, useAddModule, usePublishCourse } from '../../../lib/hooks/use-admin.js'
import { getAssetUrl } from '../../../api/client.js'
import { AddModuleModal } from '../components/admin/AddModuleModal.jsx'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { AdminNavigatePills } from '../components/admin/AdminNavigatePills.jsx'
import { DiscussionPanel } from '../../learning/components/DiscussionPanel.jsx'
import { ReviewSection } from '../../learning/components/ReviewSection.jsx'
import { CardGridSkeleton } from '../../../shared/components/ContentSkeletons.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'

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
    borderColor: 'var(--slogbaa-blue)',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
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
  publishBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-blue)',
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
  moduleCardImageWrap: {
    width: 'calc(100% + 3rem)',
    height: 100,
    margin: '-1.25rem -1.5rem 1rem -1.5rem',
    background: 'var(--slogbaa-border)',
    borderRadius: '8px 8px 0 0',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '2rem',
  },
  moduleCardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}

const ModuleCard = memo(function ModuleCard({ module, courseId, onMouseEnter, onMouseLeave, hover }) {
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
      <div style={styles.moduleCardImageWrap}>
        {module.imageUrl ? (
          <img src={getAssetUrl(module.imageUrl)} alt={`Module: ${module.title}`} style={styles.moduleCardImage} loading="lazy" onError={(e) => { e.target.style.display = 'none' }} />
        ) : (
          <span aria-hidden="true">&#128230;</span>
        )}
      </div>
      <h3 style={styles.moduleCardTitle}>{module.title}</h3>
      <p style={styles.moduleCardMeta}>
        Order: {module.moduleOrder ?? 0} &middot; {blockCount} block{blockCount !== 1 ? 's' : ''}
      </p>
      {module.description && (
        <p style={styles.moduleCardDescription}>{module.description}</p>
      )}
      {module.hasQuiz && <Badge variant="success" style={{ marginTop: '0.5rem' }}>Has quiz</Badge>}
    </Link>
  )
})

export function AdminCoursePage() {
  const { courseId } = useParams()
  const { token, isSuperAdmin } = useOutletContext()
  const { data: course, isLoading: loading, error: queryError, refetch } = useAdminCourseDetail(courseId)
  const addModuleMutation = useAddModule()
  const publishMutation = usePublishCourse()
  const toast = useToast()
  const [modal, setModal] = useState(null)
  const [hoveredModuleId, setHoveredModuleId] = useState(null)

  const error = queryError?.message ?? null

  const handleAddModule = async (data) => {
    try {
      await addModuleMutation.mutateAsync({ courseId, ...data })
      setModal(null)
      toast.success('Module added.')
    } catch (e) {
      toast.error(e?.message && e.message !== '[object Object]' ? e.message : 'Failed to add module.');
    }
  }

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(courseId)
      toast.success('Course published.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to publish.')
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <CardGridSkeleton count={4} />
        <AdminNavigatePills />
      </div>
    )
  }
  if (error || !course) {
    return (
      <div style={styles.page}>
        <p style={styles.error}>{error || 'Course not found.'}</p>
        <AdminNavigatePills />
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Breadcrumbs items={[
        { label: 'Admin', to: '/admin' },
        { label: 'Learning', to: '/admin/learning' },
        { label: course.title || '...' },
      ]} />

      <header style={styles.header}>
        {course.imageUrl ? (
          <img src={getAssetUrl(course.imageUrl)} alt={`Course: ${course.title}`} style={styles.courseImage} onError={(e) => { e.target.style.display = 'none' }} />
        ) : (
          <div style={styles.courseImagePlaceholder} aria-hidden="true">&#128218;</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={styles.title}>{course.title}</h1>
          {course.description && <p style={styles.description}>{course.description}</p>}
          <Badge variant={course.published ? 'success' : 'default'} style={{ marginTop: '0.5rem' }}>
            {course.published ? 'Published' : 'Draft'}
          </Badge>
          {isSuperAdmin && !course.published && (
            <button type="button" style={styles.publishBtn} onClick={handlePublish}>
              <FontAwesomeIcon icon={icons.publish} /> Publish
            </button>
          )}
        </div>
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

      <div style={{ maxWidth: 880, marginTop: '2.5rem' }}>
        {course.published && <ReviewSection courseId={courseId} />}
        <DiscussionPanel courseId={courseId} moduleId={null} />
      </div>

      {modal === 'addModule' && (
        <AddModuleModal
          token={token}
          course={course}
          onClose={() => setModal(null)}
          onSubmit={handleAddModule}
        />
      )}
      <AdminNavigatePills />
    </div>
  )
}
