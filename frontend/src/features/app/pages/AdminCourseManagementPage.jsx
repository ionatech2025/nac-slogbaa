import { useState, useEffect, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { Modal } from '../../../shared/components/Modal.jsx'
import { getAdminCourses, getAdminCourseDetails, deleteCourse, deleteModule } from '../../../api/admin/courses.js'
import { getCourseEnrollments, canDeleteCourse, canDeleteModule } from '../../../api/admin/courseManagement.js'
import { getAssetUrl } from '../../../api/client.js'

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
    background: 'rgba(241, 134, 37, 0.06)',
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
    color: 'var(--slogbaa-orange)',
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
    background: 'var(--slogbaa-orange)',
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
    background: 'var(--slogbaa-orange)',
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

export function AdminCourseManagementPage() {
  const { token, isSuperAdmin } = useOutletContext()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [details, setDetails] = useState({})
  const [enrollments, setEnrollments] = useState({})
  const [canDeleteCourseMap, setCanDeleteCourseMap] = useState({})
  const [canDeleteModuleMap, setCanDeleteModuleMap] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)

  const loadCourses = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminCourses(token)
      setCourses(data ?? [])
    } catch (e) {
      setError(e?.message ?? 'Failed to load courses.')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const loadExpanded = useCallback(async (courseId) => {
    if (!token || !courseId) return
    try {
      const [detailRes, enrollRes, canCourse] = await Promise.all([
        getAdminCourseDetails(token, courseId),
        getCourseEnrollments(token, courseId).catch(() => []),
        canDeleteCourse(token, courseId),
      ])
      setDetails((prev) => ({ ...prev, [courseId]: detailRes }))
      setEnrollments((prev) => ({ ...prev, [courseId]: enrollRes }))
      setCanDeleteCourseMap((prev) => ({ ...prev, [courseId]: canCourse.canDelete }))
      const modules = detailRes?.modules ?? []
      const canModule = {}
      await Promise.all(
        modules.map(async (m) => {
          const r = await canDeleteModule(token, courseId, m.id)
          canModule[m.id] = r.canDelete
        })
      )
      setCanDeleteModuleMap((prev) => ({ ...prev, [courseId]: canModule }))
    } catch {
      setDetails((prev) => ({ ...prev, [courseId]: null }))
      setEnrollments((prev) => ({ ...prev, [courseId]: [] }))
    }
  }, [token])

  useEffect(() => {
    if (expandedId) loadExpanded(expandedId)
  }, [expandedId, loadExpanded])

  const toggleExpand = (courseId) => {
    setExpandedId((prev) => (prev === courseId ? null : courseId))
  }

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
    if (confirmModal.type === 'course') {
      setDeleting(confirmModal.courseId)
      setError(null)
      setConfirmModal(null)
      try {
        await deleteCourse(token, confirmModal.courseId)
        setCourses((prev) => prev.filter((c) => c.id !== confirmModal.courseId))
        setExpandedId((prev) => (prev === confirmModal.courseId ? null : prev))
      } catch (e) {
        setError(e?.message ?? 'Failed to delete course.')
      } finally {
        setDeleting(null)
      }
    } else {
      setDeleting(confirmModal.moduleId)
      setError(null)
      setConfirmModal(null)
      try {
        await deleteModule(token, confirmModal.courseId, confirmModal.moduleId)
        const detail = details[confirmModal.courseId]
        if (detail?.modules) {
          setDetails((prev) => ({
            ...prev,
            [confirmModal.courseId]: {
              ...detail,
              modules: detail.modules.filter((m) => m.id !== confirmModal.moduleId),
            },
          }))
        }
        setCanDeleteModuleMap((prev) => {
          const next = { ...(prev[confirmModal.courseId] || {}) }
          delete next[confirmModal.moduleId]
          return { ...prev, [confirmModal.courseId]: next }
        })
      } catch (e) {
        setError(e?.message ?? 'Failed to delete module.')
      } finally {
        setDeleting(null)
      }
    }
  }

  if (!isSuperAdmin) {
    return (
      <div style={styles.page}>
        <p style={styles.error}>Course Management is available only to Super Admins.</p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
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
          const detail = details[course.id]
          const enrollList = enrollments[course.id] ?? []
          const canDelCourse = canDeleteCourseMap[course.id]
          const canDelModules = canDeleteModuleMap[course.id] || {}

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
                  {course.imageUrl ? (
                    <img src={getAssetUrl(course.imageUrl)} alt="" style={styles.courseThumb} />
                  ) : (
                    <div style={{ ...styles.courseThumb, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📚</div>
                  )}
                  <div>
                    <h2 style={styles.courseTitle}>{course.title}</h2>
                    <p style={styles.courseMeta}>
                      {course.moduleCount ?? 0} module{(course.moduleCount ?? 0) !== 1 ? 's' : ''}
                      {enrollList.length > 0 && ` · ${enrollList.length} enrolled`}
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
                    disabled={!canDelCourse || deleting === course.id}
                    onClick={(e) => openConfirmCourse(e, course)}
                    title={!canDelCourse ? 'Cannot delete: course has enrolled trainees' : 'Delete course'}
                  >
                    <FontAwesomeIcon icon={icons.delete} />
                    Delete course
                  </button>
                  <FontAwesomeIcon
                    icon={icons.viewList}
                    style={{ ...styles.expandIcon, ...(isOpen ? styles.expandIconOpen : {}) }}
                  />
                </div>
              </div>

              {isOpen && (
                <div style={styles.expandContent}>
                  {detail == null ? (
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>Loading…</p>
                  ) : (
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
                                  <Link
                                    to={`/admin/learning/${course.id}/modules/${m.id}`}
                                    style={styles.iconLinkModule}
                                    title="View / edit module"
                                  >
                                    <FontAwesomeIcon icon={icons.eye} />
                                    View
                                  </Link>
                                  <button
                                    type="button"
                                    style={{
                                      ...styles.btn(),
                                      ...styles.btnDanger,
                                      ...(!canDelModules[m.id] || deleting === m.id ? styles.btnDangerDisabled : {}),
                                    }}
                                    disabled={!canDelModules[m.id] || deleting === m.id}
                                    onClick={(e) => openConfirmModule(e, course.id, m)}
                                    title={!canDelModules[m.id] ? 'Cannot delete: at least one trainee completed this module' : 'Delete module'}
                                  >
                                    <FontAwesomeIcon icon={icons.delete} />
                                    Delete
                                  </button>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      <h3 style={styles.sectionTitle}>Trainees enrolled & progress</h3>
                      {enrollList.length === 0 ? (
                        <p style={{ margin: '0.5rem 0', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
                          No trainees enrolled.
                        </p>
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
                            {enrollList.map((en) => (
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
                  )}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
