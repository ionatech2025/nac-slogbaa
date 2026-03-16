import { useState, useCallback, useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { createCourse, updateCourse } from '../../../api/admin/courses.js'
import { useAdminCourses, usePublishCourse, useUnpublishCourse } from '../../../lib/hooks/use-admin.js'
import { getAssetUrl } from '../../../api/client.js'
import { CreateCourseModal } from '../components/admin/CreateCourseModal.jsx'
import { EditCourseModal } from '../components/admin/EditCourseModal.jsx'
import { Badge } from '../../../shared/components/Badge.jsx'
import { FilterSortBar } from '../../../shared/components/FilterSortBar.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'
import { useDebounce } from '../../../shared/hooks/useDebounce.js'
import { filterAndSortItems } from '../../../shared/utils/filterSort.js'

const COURSE_FILTERS = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All' },
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
    ],
  },
]

const COURSE_SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Date created (newest first)' },
  { value: 'createdAt:asc', label: 'Date created (oldest first)' },
  { value: 'title:asc', label: 'Title A–Z' },
  { value: 'title:desc', label: 'Title Z–A' },
  { value: 'moduleCount:desc', label: 'Modules (high first)' },
  { value: 'moduleCount:asc', label: 'Modules (low first)' },
  { value: 'published:desc', label: 'Published first' },
  { value: 'published:asc', label: 'Draft first' },
]

const COURSE_FILTER_CONFIG = {
  status: {
    getValue: (item) => (item.published ? 'published' : 'draft'),
  },
}

const COURSE_SORT_CONFIG = {
  getValue: (item, field) => {
    if (field === 'published') return item.published
    return item[field]
  },
}

const styles = {
  pageTitle: {
    margin: '0 0 1rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--slogbaa-blue)',
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
    borderBottom: '3px solid var(--slogbaa-blue)',
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
    background: 'rgba(37, 99, 235, 0.08)',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
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
    background: 'var(--slogbaa-blue)',
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
  actionIconBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    background: 'rgba(39, 129, 191, 0.12)',
    color: 'var(--slogbaa-blue)',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginRight: '0.35rem',
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
  thumbWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    objectFit: 'cover',
    flexShrink: 0,
    background: 'var(--slogbaa-border)',
  },
}

export function AdminLearningPage() {
  const { token, isSuperAdmin } = useOutletContext()
  const navigate = useNavigate()
  const { data: courses = [], isLoading: loading, error: queryError, refetch: refreshCourses } = useAdminCourses()
  const publishMutation = usePublishCourse()
  const unpublishMutation = useUnpublishCourse()
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [modalContext, setModalContext] = useState(null)
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState({ status: 'all' })
  const [sortBy, setSortBy] = useState('createdAt:desc')

  const debouncedSearch = useDebounce(search, 250)

  const filteredCourses = useMemo(
    () =>
      filterAndSortItems(courses, {
        search: debouncedSearch,
        searchFields: ['title', 'description'],
        filters: filterValues,
        filterConfig: COURSE_FILTER_CONFIG,
        sortBy,
        sortConfig: COURSE_SORT_CONFIG,
      }),
    [courses, debouncedSearch, filterValues, sortBy]
  )

  const handleFilterChange = useCallback((key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
  }, [])

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

  const toast = useToast()

  const handlePublish = async (e, courseId) => {
    e.stopPropagation()
    try {
      await publishMutation.mutateAsync(courseId)
      toast.success('Course published.')
    } catch (err) {
      toast.error(err?.message ?? 'Failed to publish course.')
    }
  }

  const handleUnpublish = async (e, courseId) => {
    e.stopPropagation()
    try {
      await unpublishMutation.mutateAsync(courseId)
      toast.info('Course unpublished.')
    } catch (err) {
      toast.error(err?.message ?? 'Failed to unpublish course.')
    }
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
      {(error || queryError) && <p style={styles.error}>{error || queryError?.message || 'Failed to load courses.'}</p>}

      <div style={styles.toolbar}>
        <p style={{ margin: 0, color: 'var(--slogbaa-text-muted)' }}>
          {filteredCourses.length} of {courses.length} course{courses.length !== 1 ? 's' : ''}
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

      <FilterSortBar
        searchPlaceholder="Search courses…"
        searchValue={search}
        onSearchChange={setSearch}
        filters={COURSE_FILTERS}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        sortOptions={COURSE_SORT_OPTIONS}
        sortValue={sortBy}
        onSortChange={setSortBy}
      />

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
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 4 : 3} style={styles.empty}>
                  No courses match your filters. Try different search or filter options.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  style={styles.trClickable}
                  onClick={() => handleRowClick(course)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(course) } }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View course: ${course.title}`}
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
                    <div style={styles.thumbWrap}>
                      {course.imageUrl ? (
                        <img src={getAssetUrl(course.imageUrl)} alt={`Course: ${course.title}`} style={styles.thumb} onError={(e) => { e.target.style.display = 'none' }} />
                      ) : (
                        <div style={{ ...styles.thumb, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--slogbaa-text-muted)' }}>📚</div>
                      )}
                      <div>
                        <strong>{course.title}</strong>
                        {course.description && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', marginTop: 2 }}>
                            {course.description.slice(0, 80)}
                            {course.description.length > 80 ? '…' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <Badge variant={course.published ? 'success' : 'default'}>
                      {course.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td style={styles.td}>{course.moduleCount}</td>
                  {isSuperAdmin && (
                    <td style={styles.td} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        style={styles.actionIconBtn}
                        onClick={() => {
                          setModalContext({ course })
                          setModal('editCourse')
                        }}
                        title="Edit course"
                        aria-label="Edit course"
                      >
                        <FontAwesomeIcon icon={icons.edit} />
                      </button>
                      {!course.published ? (
                        <button
                          type="button"
                          style={styles.actionIconBtn}
                          onClick={(e) => handlePublish(e, course.id)}
                          title="Publish"
                          aria-label="Publish course"
                        >
                          <FontAwesomeIcon icon={icons.publish} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          style={styles.actionIconBtn}
                          onClick={(e) => handleUnpublish(e, course.id)}
                          title="Unpublish"
                          aria-label="Unpublish course"
                        >
                          <FontAwesomeIcon icon={icons.unpublish} />
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
          token={token}
          onClose={() => setModal(null)}
          onSubmit={handleCreateCourse}
        />
      )}
      {modal === 'editCourse' && modalContext?.course && (
        <EditCourseModal
          token={token}
          course={modalContext.course}
          onClose={() => { setModal(null); setModalContext(null) }}
          onSubmit={(data) => handleEditCourse(modalContext.course.id, data)}
        />
      )}
    </>
  )
}
