import { useState, memo, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'
import { useAdminCourses, useCourseExpandedDetail, useDeleteCourse, useDeleteModule } from '../../../lib/hooks/use-admin.js'
import { getAssetUrl } from '../../../api/client.js'
import defaultCourseImg from '../../../assets/images/courses/course1.jpg'
import { useToast } from '../../../shared/hooks/useToast.js'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { AdminNavigatePills } from '../components/admin/AdminNavigatePills.jsx'
import { Skeleton } from '../../../shared/components/Skeleton.jsx'
import { Pagination } from '../../../shared/components/Pagination.jsx'

const styles = {
  page: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  header: {
    marginBottom: '1.75rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  card: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
    marginBottom: '1rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  courseRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1rem 1.25rem',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  courseRowHover: {
    background: 'rgba(37, 99, 235, 0.06)',
  },
  courseLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
    minWidth: 0,
  },
  courseThumb: {
    width: 56,
    height: 40,
    borderRadius: 8,
    objectFit: 'cover',
    background: 'var(--slogbaa-border)',
    flexShrink: 0,
  },
  courseTitle: {
    margin: 0,
    fontSize: '1.0625rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  courseMeta: {
    margin: '0.25rem 0 0',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  badge: {
    display: 'inline-flex',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'rgba(52, 211, 153, 0.15)',
    color: 'var(--slogbaa-green)',
  },
  badgeDraft: {
    background: 'rgba(148, 163, 184, 0.2)',
    color: 'var(--slogbaa-text-muted)',
  },
  expandIcon: {
    transition: 'transform 0.2s ease',
    color: 'var(--slogbaa-text-muted)',
  },
  expandIconOpen: {
    transform: 'rotate(180deg)',
  },
  expandContent: {
    padding: '0 1.25rem 1.25rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  sectionTitle: {
    margin: '1rem 0 0.5rem',
    fontSize: '0.8125rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-blue)',
  },
  moduleList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  moduleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0.75rem',
    borderRadius: 8,
    background: 'var(--slogbaa-bg)',
    marginBottom: '0.35rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
  },
  moduleQuiz: {
    marginLeft: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },
  enrollmentsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  enrollTh: {
    textAlign: 'left',
    padding: '0.5rem 0.75rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  enrollTd: {
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  btn: (variant = 'secondary') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.75rem',
    borderRadius: 8,
    fontSize: '0.8125rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.15s, background 0.15s',
  }),
  btnDanger: {
    background: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--slogbaa-error)',
  },
  btnDangerDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  btnPrimary: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
  },
  iconLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 8,
    color: 'var(--slogbaa-blue)',
    background: 'rgba(59, 130, 246, 0.1)',
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
  },
  iconLinkModule: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    padding: '0.4rem 0.6rem',
    borderRadius: 8,
    color: 'var(--slogbaa-blue)',
    background: 'rgba(59, 130, 246, 0.1)',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    fontWeight: 600,
    transition: 'background 0.15s, color 0.15s',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
  },
  error: {
    padding: '1rem 1.25rem',
    background: 'rgba(239, 68, 68, 0.08)',
    color: 'var(--slogbaa-error)',
    borderRadius: 8,
    marginBottom: '1rem',
    fontSize: '0.9375rem',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
    width: 80,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    background: 'var(--slogbaa-blue)',
    transition: 'width 0.3s ease',
  },
  confirmActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  confirmBtn: (danger = false) => ({
    padding: '0.5rem 1.25rem',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 600,
    border: '1px solid transparent',
    cursor: 'pointer',
    background: danger ? 'rgba(239, 68, 68, 0.9)' : 'var(--slogbaa-border)',
    color: danger ? '#fff' : 'var(--slogbaa-text)',
  }),
  confirmBody: {
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
  },
  confirmImplications: {
    marginTop: '1rem',
    padding: '1rem',
    borderRadius: 8,
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
  },
}

/** Skeleton for expanded course detail loading state */
function ExpandedSkeleton() {
  return (
    <div style={{ padding: '0.5rem 0' }}>
      <Skeleton height={12} width={80} style={{ marginBottom: 12 }} />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: 8, background: 'var(--slogbaa-bg)', marginBottom: 4 }}>
          <Skeleton height={14} width={`${40 + i * 10}%`} />
          <Skeleton height={28} width={60} style={{ borderRadius: 6 }} />
        </div>
      ))}
      <Skeleton height={12} width={160} style={{ marginTop: 16, marginBottom: 8 }} />
      <Skeleton height={100} width="100%" style={{ borderRadius: 8 }} />
    </div>
  )
}

/** Memoized expanded detail panel — uses React Query for caching + dedup */
const ExpandedCourseDetail = memo(function ExpandedCourseDetail({ courseId, courses, isSuperAdmin, deleting, onConfirmCourse, onConfirmModule }) {
  const { data, isLoading, isError, refetch } = useCourseExpandedDetail(courseId)

  if (isLoading) return <ExpandedSkeleton />
  if (isError) {
    return (
      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-error)' }}>
        Failed to load course details.{' '}
        <button type="button" onClick={() => refetch()} style={{ background: 'none', border: 'none', color: 'var(--slogbaa-blue)', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', padding: 0 }}>
          Retry
        </button>
      </p>
    )
  }

  const { detail, enrollments, canDeleteCourse: canDelCourse, canDeleteModules } = data
  const course = courses.find((c) => c.id === courseId)

  return (
    <>
      {detail?.modules?.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}>Modules</h3>
          <ul style={styles.moduleList}>
            {detail.modules.map((m) => (
              <li key={m.id} style={styles.moduleItem}>
                <span>
                  {m.title}
                  {m.hasQuiz && <span style={styles.moduleQuiz}> · Quiz</span>}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to={`/admin/learning/${courseId}/modules/${m.id}`} style={styles.iconLinkModule} title="View / edit module" aria-label={`View / edit module: ${m.title}`}>
                    <FontAwesomeIcon icon={icons.eye} />
                  </Link>
                  <button
                    type="button"
                    style={{ ...styles.btn(), ...styles.btnDanger, ...(!canDeleteModules[m.id] || deleting === m.id ? styles.btnDangerDisabled : {}) }}
                    disabled={!canDeleteModules[m.id] || deleting === m.id}
                    onClick={(e) => onConfirmModule(e, courseId, m)}
                    title={!canDeleteModules[m.id] ? 'Cannot delete: at least one trainee completed this module' : 'Delete module'}
                    aria-label={`Delete module: ${m.title}`}
                  >
                    <FontAwesomeIcon icon={icons.delete} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 style={styles.sectionTitle}>Trainees enrolled & progress</h3>
      {enrollments.length === 0 ? (
        <p style={{ margin: '0.5rem 0', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>No trainees enrolled.</p>
      ) : (
        <table style={styles.enrollmentsTable}>
          <thead>
            <tr>
              <th style={styles.enrollTh}>Trainee</th>
              <th style={styles.enrollTh}>Enrolled</th>
              <th style={styles.enrollTh}>Progress</th>
              <th style={styles.enrollTh}>Completed modules</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((en) => (
              <tr key={en.traineeId}>
                <td style={styles.enrollTd}>{en.traineeName}</td>
                <td style={styles.enrollTd}>{en.enrollmentDate ?? '—'}</td>
                <td style={styles.enrollTd}>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${en.completionPercentage ?? 0}%` }} />
                  </div>
                  <span style={{ marginLeft: 8, fontSize: '0.8125rem' }}>{en.completionPercentage ?? 0}%</span>
                </td>
                <td style={styles.enrollTd}>
                  {(en.completedModuleIds?.length ?? 0)} of {detail?.modules?.length ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
})

export function AdminCourseManagementPage() {
  useDocumentTitle('Course Management')
  const { token, isSuperAdmin } = useOutletContext()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data: pagedData, isLoading: loading, error: queryError } = useAdminCourses(page - 1, pageSize)
  const courses = pagedData?.content ?? []
  const totalItems = pagedData?.totalElements ?? 0

  const deleteCourseMutation = useDeleteCourse()
  const deleteModuleMutation = useDeleteModule()
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)
  const toast = useToast()

  const toggleExpand = useCallback((courseId) => {
    setExpandedId((prev) => prev === courseId ? null : courseId)
  }, [])

  const openConfirmCourse = (e, course) => {
    e.stopPropagation()
    if (!isSuperAdmin || deleting) return
    setConfirmModal({ type: 'course', courseId: course.id, courseTitle: course.title })
  }

  const openConfirmModule = (e, courseId, module) => {
    e.stopPropagation()
    if (!isSuperAdmin || deleting) return
    const course = courses.find((c) => c.id === courseId)
    setConfirmModal({
      type: 'module',
      courseId,
      moduleId: module.id,
      moduleTitle: module.title,
      courseTitle: course?.title ?? '',
    })
  }

  const closeConfirmModal = () => setConfirmModal(null)

  const performConfirmDelete = async () => {
    if (!token || !confirmModal) return
    const { type, courseId, moduleId } = confirmModal
    setDeleting(type === 'course' ? courseId : moduleId)
    setError(null)
    setConfirmModal(null)
    try {
      if (type === 'course') {
        await deleteCourseMutation.mutateAsync(courseId)
        setExpandedId((prev) => (prev === courseId ? null : prev))
        toast.success('Course deleted.')
      } else {
        await deleteModuleMutation.mutateAsync({ courseId, moduleId })
        toast.success('Module deleted.')
      }
    } catch (e) {
      toast.error(e?.message ?? `Failed to delete ${type}.`)
    } finally {
      setDeleting(null)
    }
  }

  if (!isSuperAdmin) {
    return (
      <div style={styles.page}>
        <p style={styles.error}>Course Management is available only to Super Admins.</p>
        <AdminNavigatePills isSuperAdmin={false} />
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Breadcrumbs items={[
        { label: 'Admin', to: '/admin' },
        { label: 'Course Management' },
      ]} />

      {confirmModal && (
        <Modal
          title={confirmModal.type === 'course' ? 'Delete course?' : 'Delete module?'}
          onClose={closeConfirmModal}
          maxWidth={520}
        >
          <div style={styles.confirmBody}>
            {confirmModal.type === 'course' ? (
              <>
                <p style={{ margin: 0 }}>
                  You are about to delete <strong>“{confirmModal.courseTitle}”</strong>.
                </p>
                <div style={styles.confirmImplications}>
                  <strong>What will happen:</strong>
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                    <li>The course and all its modules will be permanently removed.</li>
                    <li>All content (blocks, quizzes, images) in every module will be deleted.</li>
                    <li>This action cannot be undone.</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: 0 }}>
                  You are about to delete the module <strong>“{confirmModal.moduleTitle}”</strong>
                  {confirmModal.courseTitle && (
                    <> from the course “{confirmModal.courseTitle}”</>
                  )}.
                </p>
                <div style={styles.confirmImplications}>
                  <strong>What will happen:</strong>
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                    <li>This module and all its content (blocks, quiz if any) will be permanently removed.</li>
                    <li>The rest of the course and other modules will stay. Trainee progress in other modules is unchanged.</li>
                    <li>This action cannot be undone.</li>
                  </ul>
                </div>
              </>
            )}
          </div>
          <div style={styles.confirmActions}>
            <button type="button" style={styles.confirmBtn(false)} onClick={closeConfirmModal}>
              Cancel
            </button>
            <button type="button" style={styles.confirmBtn(true)} onClick={performConfirmDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}

      <header style={styles.header}>
        <h1 style={styles.title}>Course Management</h1>
        <p style={styles.subtitle}>
          View courses and modules, see trainees and their progress, and delete courses or modules when allowed.
        </p>
      </header>

      {error && (
        <div style={styles.error} role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p style={styles.loading}>Loading courses…</p>
      ) : courses.length === 0 ? (
        <div style={styles.empty}>No courses yet. Create courses from Learning.</div>
      ) : (
        courses.map((course) => {
          const isOpen = expandedId === course.id

          return (
            <div key={course.id} style={styles.card}>
              <div
                style={{ ...styles.courseRow, ...(isOpen ? styles.courseRowHover : {}) }}
                onClick={() => toggleExpand(course.id)}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpand(course.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div style={styles.courseLeft}>
                  <img
                    src={course.imageUrl ? getAssetUrl(course.imageUrl) : defaultCourseImg}
                    alt={`Course: ${course.title}`}
                    width={56}
                    height={40}
                    style={styles.courseThumb}
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultCourseImg }}
                  />
                  <div>
                    <h2 style={styles.courseTitle}>{course.title}</h2>
                    <p style={styles.courseMeta}>
                      {course.moduleCount ?? 0} module{(course.moduleCount ?? 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span style={{ ...styles.badge, ...(course.published ? {} : styles.badgeDraft) }}>
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link
                    to={`/admin/learning/${course.id}`}
                    style={styles.iconLink}
                    title="View / edit course"
                    aria-label={`View / edit course: ${course.title}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FontAwesomeIcon icon={icons.eye} />
                  </Link>
                  <button
                    type="button"
                    style={{
                      ...styles.btn('secondary'),
                      ...styles.btnDanger,
                      ...(deleting === course.id ? styles.btnDangerDisabled : {}),
                    }}
                    disabled={deleting === course.id}
                    onClick={(e) => openConfirmCourse(e, course)}
                    title="Delete course"
                    aria-label={`Delete course: ${course.title}`}
                  >
                    <FontAwesomeIcon icon={icons.delete} />
                  </button>
                  <FontAwesomeIcon
                    icon={icons.viewList}
                    style={{ ...styles.expandIcon, ...(isOpen ? styles.expandIconOpen : {}) }}
                  />
                </div>
              </div>

              {isOpen && (
                <div style={styles.expandContent}>
                  <ExpandedCourseDetail
                    courseId={course.id}
                    courses={courses}
                    isSuperAdmin={isSuperAdmin}
                    deleting={deleting}
                    onConfirmCourse={openConfirmCourse}
                    onConfirmModule={openConfirmModule}
                  />
                </div>
              )}
            </div>
          )
        })
      )}

      {totalItems > pageSize && (
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      <AdminNavigatePills />
    </div>
  )
}
