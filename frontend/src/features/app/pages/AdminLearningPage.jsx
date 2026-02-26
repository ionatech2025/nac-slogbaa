import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { getAdminCourses, createCourse, updateCourse, publishCourse } from '../../../api/admin/courses.js'
import { CreateCourseModal } from '../components/admin/CreateCourseModal.jsx'
import { EditCourseModal } from '../components/admin/EditCourseModal.jsx'

const styles = {
  pageTitle: {
    margin: '0 0 1rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--slogbaa-orange)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  tableWrap: {
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    background: 'var(--slogbaa-surface)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9375rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.875rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.8125rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#fff',
    background: 'var(--slogbaa-dark)',
    borderBottom: '3px solid var(--slogbaa-orange)',
  },
  td: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  trClickable: {
    cursor: 'pointer',
    transition: 'background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
  },
  trHover: {
    background: 'rgba(241, 134, 37, 0.08)',
    boxShadow: '0 2px 8px rgba(241, 134, 37, 0.15)',
    position: 'relative',
    zIndex: 1,
    transform: 'scale(1.002)',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
  },
  btnPrimary: {
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
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.6rem',
    background: 'rgba(39, 129, 191, 0.12)',
    color: 'var(--slogbaa-blue)',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  badge: {
    display: 'inline-block',
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
  loading: { padding: '1rem', color: 'var(--slogbaa-text-muted)' },
  error: { padding: '1rem', color: 'var(--slogbaa-error)' },
}

export function AdminLearningPage() {
  const { token, isSuperAdmin } = useOutletContext()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [modalContext, setModalContext] = useState(null)

  const refreshCourses = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const list = await getAdminCourses(token)
      setCourses(list)
    } catch (err) {
      setError(err?.message ?? 'Failed to load courses.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    refreshCourses()
  }, [refreshCourses])

  const handleRowClick = (course) => {
    navigate(`/admin/learning/${course.id}`)
  }

  const handleCreateCourse = async (data) => {
    const { id } = await createCourse(token, data)
    setModal(null)
    await refreshCourses()
    navigate(`/admin/learning/${id}`)
  }

  const handleEditCourse = async (courseId, data) => {
    await updateCourse(token, courseId, data)
    setModal(null)
    setModalContext(null)
    await refreshCourses()
  }

  const handlePublish = async (e, courseId) => {
    e.stopPropagation()
    await publishCourse(token, courseId)
    await refreshCourses()
  }

  if (loading && courses.length === 0) {
    return (
      <>
        <h2 style={styles.pageTitle}>Learning</h2>
        <p style={styles.loading}>Loading courses…</p>
      </>
    )
  }

  return (
    <>
      <h2 style={styles.pageTitle}>Learning</h2>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.toolbar}>
        <p style={{ margin: 0, color: 'var(--slogbaa-text-muted)' }}>
          {courses.length} course{courses.length !== 1 ? 's' : ''}
        </p>
        {isSuperAdmin && (
          <button
            type="button"
            style={styles.btnPrimary}
            onClick={() => setModal('createCourse')}
          >
            <FontAwesomeIcon icon={icons.enroll} />
            Create course
          </button>
        )}
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Modules</th>
              {isSuperAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 4 : 3} style={styles.empty}>
                  No courses yet. {isSuperAdmin && 'Click Create course to add one.'}
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course.id}
                  style={styles.trClickable}
                  onClick={() => handleRowClick(course)}
                  onMouseEnter={(e) => {
                    if (isSuperAdmin) {
                      e.currentTarget.style.background = styles.trHover.background
                      e.currentTarget.style.boxShadow = styles.trHover.boxShadow
                      e.currentTarget.style.position = styles.trHover.position
                      e.currentTarget.style.zIndex = styles.trHover.zIndex
                      e.currentTarget.style.transform = styles.trHover.transform
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = ''
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.position = ''
                    e.currentTarget.style.zIndex = ''
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <td style={styles.td}>
                    <strong>{course.title}</strong>
                    {course.description && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', marginTop: 2 }}>
                        {course.description.slice(0, 80)}
                        {course.description.length > 80 ? '…' : ''}
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(course.published ? {} : styles.badgeDraft),
                      }}
                    >
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={styles.td}>{course.moduleCount}</td>
                  {isSuperAdmin && (
                    <td style={styles.td} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        style={styles.btnSecondary}
                        onClick={() => {
                          setModalContext({ course })
                          setModal('editCourse')
                        }}
                        title="Edit course"
                      >
                        <FontAwesomeIcon icon={icons.edit} /> Edit
                      </button>
                      {!course.published && (
                        <button
                          type="button"
                          style={styles.btnSecondary}
                          onClick={(e) => handlePublish(e, course.id)}
                          title="Publish"
                        >
                          <FontAwesomeIcon icon={icons.publish} /> Publish
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal === 'createCourse' && (
        <CreateCourseModal
          onClose={() => setModal(null)}
          onSubmit={handleCreateCourse}
        />
      )}
      {modal === 'editCourse' && modalContext?.course && (
        <EditCourseModal
          course={modalContext.course}
          onClose={() => { setModal(null); setModalContext(null) }}
          onSubmit={(data) => handleEditCourse(modalContext.course.id, data)}
        />
      )}
    </>
  )
}
