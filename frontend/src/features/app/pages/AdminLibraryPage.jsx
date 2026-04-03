import { useState, useCallback, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAdminLibrary, useCreateLibraryResource, useUpdateLibraryResource, usePublishLibraryResource, useUnpublishLibraryResource, useAdminCourses } from '../../../lib/hooks/use-admin.js'
import { uploadFile } from '../../../api/files.js'
import { Modal } from '../../../shared/components/Modal.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useDebounce } from '../../../shared/hooks/useDebounce.js'
import { Pagination, usePagination } from '../../../shared/components/Pagination.jsx'
import { TableSkeleton, SearchBarSkeleton } from '../../../shared/components/AdminTableSkeleton.jsx'
import { exportToCsv } from '../../../shared/utils/csvExport.js'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { AdminNavigatePills } from '../components/admin/AdminNavigatePills.jsx'

const RESOURCE_TYPES = [
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'POLICY_DOCUMENT', label: 'Policy document' },
  { value: 'READING_MATERIAL', label: 'Reading material' },
]

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
]

const BREADCRUMB_ITEMS = [
  { label: 'Admin', to: '/admin' },
  { label: 'Library' },
]

const CSV_COLUMNS = ['title', 'description', 'resourceType', 'courseTitle', 'published', 'fileType', 'fileUrl']
const CSV_HEADERS = {
  title: 'Title',
  description: 'Description',
  resourceType: 'Type',
  courseTitle: 'Course',
  published: 'Status',
  fileType: 'File Type',
  fileUrl: 'File URL',
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
  toolbarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  resultCount: {
    margin: 0,
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.875rem',
  },
  searchRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1 1 220px',
    maxWidth: 320,
    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
  },
  searchWrap: {
    position: 'relative',
    flex: '1 1 220px',
    maxWidth: 320,
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--slogbaa-text-muted)',
    pointerEvents: 'none',
    fontSize: '0.875rem',
  },
  filterSelect: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
  },
  tableWrap: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
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
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  thNotSortable: {
    cursor: 'default',
  },
  sortArrow: {
    marginLeft: '0.35rem',
    fontSize: '0.75rem',
    opacity: 0.6,
  },
  sortArrowActive: {
    opacity: 1,
  },
  td: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  link: {
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  badgePublished: {
    background: 'rgba(81, 175, 56, 0.15)',
    color: 'var(--slogbaa-green, #0a7c42)',
  },
  badgeDraft: {
    background: 'rgba(128,128,128,0.15)',
    color: 'var(--slogbaa-text-muted)',
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
  btnExport: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'rgba(39, 129, 191, 0.12)',
    color: 'var(--slogbaa-blue)',
    border: '1px solid rgba(39, 129, 191, 0.25)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 6,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  actionCell: { display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'nowrap' },
  actionIconBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    minWidth: 44,
    minHeight: 44,
    padding: 0,
    background: 'rgba(39, 129, 191, 0.12)',
    color: 'var(--slogbaa-blue)',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    flexShrink: 0,
  },
  label: { fontSize: '0.875rem', fontWeight: 500, color: 'var(--slogbaa-text)', marginBottom: '0.25rem' },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
  },
  formRow: { marginBottom: '1rem' },
  formActions: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' },
  error: { padding: '0.5rem 0', color: 'var(--slogbaa-error)', fontSize: '0.9375rem' },
}

const SORTABLE_COLUMNS = {
  title: { key: 'title', label: 'Title' },
  resourceType: { key: 'resourceType', label: 'Type' },
  published: { key: 'published', label: 'Status' },
}

function getSortIndicator(sortKey, sortDir, columnKey) {
  if (sortKey !== columnKey) return <span style={styles.sortArrow}>&#9650;&#9660;</span>
  return (
    <span style={{ ...styles.sortArrow, ...styles.sortArrowActive }}>
      {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
    </span>
  )
}

export function AdminLibraryPage() {
  useDocumentTitle('Library')
  const { token, isSuperAdmin } = useOutletContext()
  const { data: resources = [], isLoading: loading, error: queryError } = useAdminLibrary()
  const { data: pagedCourses } = useAdminCourses(0, 1000)
  const courses = pagedCourses?.content ?? []

  const createMutation = useCreateLibraryResource()
  const updateMutation = useUpdateLibraryResource()
  const publishMutation = usePublishLibraryResource()
  const unpublishMutation = useUnpublishLibraryResource()
  const [error, setError] = useState(queryError?.message ?? null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editResource, setEditResource] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', resourceType: 'DOCUMENT', fileUrl: '', fileType: '', courseId: '' })
  const [savingEditId, setSavingEditId] = useState(null)

  // Search, filter, sort state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState('title')
  const [sortDir, setSortDir] = useState('asc')

  const debouncedSearch = useDebounce(search, 250)

  const toast = useToast()

  // Filter, search, sort logic
  const filteredResources = useMemo(() => {
    let items = [...resources]

    // Status filter
    if (statusFilter === 'published') {
      items = items.filter((r) => r.published)
    } else if (statusFilter === 'draft') {
      items = items.filter((r) => !r.published)
    }

    // Search by title, description, resourceType
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim()
      items = items.filter((r) => {
        const title = (r.title || '').toLowerCase()
        const desc = (r.description || '').toLowerCase()
        const type = (r.resourceType || '').replace(/_/g, ' ').toLowerCase()
        return title.includes(q) || desc.includes(q) || type.includes(q)
      })
    }

    // Sort
    items.sort((a, b) => {
      let aVal, bVal
      if (sortKey === 'published') {
        aVal = a.published ? 1 : 0
        bVal = b.published ? 1 : 0
      } else {
        aVal = (a[sortKey] || '').toString().toLowerCase()
        bVal = (b[sortKey] || '').toString().toLowerCase()
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return items
  }, [resources, debouncedSearch, statusFilter, sortKey, sortDir])

  // Pagination
  const {
    page,
    pageSize,
    totalItems,
    paginatedItems,
    setPage,
    setPageSize,
  } = usePagination(filteredResources, 10)

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  // Sort handler
  const handleSort = useCallback((columnKey) => {
    setSortKey((prev) => {
      if (prev === columnKey) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        return prev
      }
      setSortDir('asc')
      return columnKey
    })
  }, [])

  // CSV export
  const handleExportCsv = useCallback(() => {
    const exportData = filteredResources.map((r) => {
      const course = courses.find((c) => c.id === r.courseId)
      return {
        title: r.title || '',
        description: r.description || '',
        resourceType: (r.resourceType || '').replace(/_/g, ' '),
        courseTitle: course ? course.title : 'General',
        published: r.published ? 'Published' : 'Draft',
        fileType: r.fileType || '',
        fileUrl: r.fileUrl || '',
      }
    })
    exportToCsv(exportData, {
      filename: 'library-resources',
      columns: CSV_COLUMNS,
      headers: CSV_HEADERS,
    })
  }, [filteredResources])

  // Create resource
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title?.trim() || !form.fileUrl?.trim()) return
    try {
      await createMutation.mutateAsync({
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        resourceType: form.resourceType,
        fileUrl: form.fileUrl.trim(),
        fileType: form.fileType?.trim() || undefined,
        courseId: form.courseId || null,
      })
      setModalOpen(false)
      setForm({ title: '', description: '', resourceType: 'DOCUMENT', fileUrl: '', fileType: '', courseId: '' })
      toast.success('Resource created.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to create resource.')
    }
  }

  const handlePublish = async (id) => {
    try {
      await publishMutation.mutateAsync(id)
      toast.success('Resource published.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to publish.')
    }
  }

  const handleUnpublish = async (id) => {
    try {
      await unpublishMutation.mutateAsync(id)
      toast.info('Resource unpublished.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to unpublish.')
    }
  }

  const openEditModal = (r) => {
    setEditResource(r)
    setForm({
      title: r.title ?? '',
      description: r.description ?? '',
      resourceType: r.resourceType ?? 'DOCUMENT',
      fileUrl: r.fileUrl ?? '',
      fileType: r.fileType ?? '',
      courseId: r.courseId ?? '',
    })
  }

  const closeEditModal = () => {
    setEditResource(null)
    setForm({ title: '', description: '', resourceType: 'DOCUMENT', fileUrl: '', fileType: '', courseId: '' })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editResource || !form.title?.trim() || !form.fileUrl?.trim()) return
    setSavingEditId(editResource.id)
    try {
      await updateMutation.mutateAsync({
        resourceId: editResource.id,
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        resourceType: form.resourceType,
        fileUrl: form.fileUrl.trim(),
        fileType: form.fileType?.trim() || undefined,
        courseId: form.courseId || null,
      })
      closeEditModal()
      toast.success('Resource updated.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to update.')
    } finally {
      setSavingEditId(null)
    }
  }

  // Skeleton loading state
  if (loading && resources.length === 0) {
    return (
      <>
        <Breadcrumbs items={BREADCRUMB_ITEMS} />
        <h1 style={styles.pageTitle}>Library resources</h1>
        <SearchBarSkeleton />
        <TableSkeleton rows={6} columns={isSuperAdmin ? 5 : 4} />
        <AdminNavigatePills />
      </>
    )
  }

  return (
    <>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <h1 style={styles.pageTitle}>Library resources</h1>

      {(error || queryError) && (
        <p style={styles.error}>{error || queryError?.message || 'Failed to load resources.'}</p>
      )}

      {/* Toolbar: result count + actions */}
      <div style={styles.toolbar}>
        <p style={styles.resultCount}>
          Showing <strong>{from}</strong>&ndash;<strong>{to}</strong> of <strong>{totalItems}</strong> resource{totalItems !== 1 ? 's' : ''}
        </p>
        <div style={styles.toolbarActions}>
          <button
            type="button"
            style={styles.btnExport}
            onClick={handleExportCsv}
            disabled={filteredResources.length === 0}
            title="Export library resources to CSV"
          >
            <FontAwesomeIcon icon={icons.download} />
            Export CSV
          </button>
          {isSuperAdmin && (
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={() => setModalOpen(true)}
            >
              <FontAwesomeIcon icon={icons.addBlock} />
              Add resource
            </button>
          )}
        </div>
      </div>

      {/* Search + status filter */}
      <div style={styles.searchRow}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>
            <FontAwesomeIcon icon={icons.search} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, type..."
            style={styles.searchInput}
            aria-label="Search library resources"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
          aria-label="Filter by status"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <caption style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
            Library resources list
          </caption>
          <thead>
            <tr>
              <th
                style={styles.th}
                onClick={() => handleSort('title')}
                aria-sort={sortKey === 'title' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Title {getSortIndicator(sortKey, sortDir, 'title')}
              </th>
              <th
                style={styles.th}
                onClick={() => handleSort('resourceType')}
                aria-sort={sortKey === 'resourceType' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Type {getSortIndicator(sortKey, sortDir, 'resourceType')}
              </th>
              <th
                style={styles.th}
                onClick={() => handleSort('published')}
                aria-sort={sortKey === 'published' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Status {getSortIndicator(sortKey, sortDir, 'published')}
              </th>
              <th style={{ ...styles.th, ...styles.thNotSortable }}>Course</th>
              <th style={{ ...styles.th, ...styles.thNotSortable }}>Link</th>
              {isSuperAdmin && <th style={{ ...styles.th, ...styles.thNotSortable }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} style={styles.empty}>
                  No library resources yet. {isSuperAdmin && 'Click "Add resource" to create one.'}
                </td>
              </tr>
            ) : filteredResources.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} style={styles.empty}>
                  No resources match your search or filters. Try different criteria.
                </td>
              </tr>
            ) : (
              paginatedItems.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>
                    <strong>{r.title}</strong>
                    {r.description && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', marginTop: 2 }}>
                        {r.description.slice(0, 80)}{r.description.length > 80 ? '...' : ''}
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>{r.resourceType?.replace(/_/g, ' ') ?? '\u2014'}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...(r.published ? styles.badgePublished : styles.badgeDraft) }}>
                      {r.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {r.courseId ? (
                      <span style={{ fontSize: '0.875rem' }}>
                        {courses.find(c => c.id === r.courseId)?.title || 'Assigned Course'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem' }}>General</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      Open
                    </a>
                  </td>
                  {isSuperAdmin && (
                    <td style={styles.td}>
                      <div style={styles.actionCell}>
                        <button
                          type="button"
                          style={styles.actionIconBtn}
                          title="View / Edit"
                          aria-label="Edit resource"
                          onClick={() => openEditModal(r)}
                        >
                          <FontAwesomeIcon icon={icons.eye} />
                        </button>
                        {r.published ? (
                          <button
                            type="button"
                            style={styles.actionIconBtn}
                            title="Unpublish"
                            aria-label="Unpublish resource"
                            disabled={unpublishMutation.isPending}
                            onClick={() => handleUnpublish(r.id)}
                          >
                            <FontAwesomeIcon icon={icons.unpublish} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            style={styles.actionIconBtn}
                            title="Publish"
                            aria-label="Publish resource"
                            disabled={publishMutation.isPending}
                            onClick={() => handlePublish(r.id)}
                          >
                            <FontAwesomeIcon icon={icons.publish} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 20, 50]}
      />

      {/* Edit resource modal */}
      {editResource && (
        <Modal title="View / Edit library resource" onClose={closeEditModal} maxWidth={480}>
          <form onSubmit={handleEditSubmit}>
            <div style={styles.formRow}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                style={styles.input}
                placeholder="Resource title"
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                style={{ ...styles.input, minHeight: 80 }}
                placeholder="Optional description"
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Type</label>
              <select
                value={form.resourceType}
                onChange={(e) => setForm((f) => ({ ...f, resourceType: e.target.value }))}
                style={styles.input}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Replace file</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    setForm((f) => ({ ...f, fileType: file.name.split('.').pop()?.toUpperCase() || '' }))
                    const result = await uploadFile(token, file, 'library')
                    setForm((f) => ({ ...f, fileUrl: result.url, fileType: result.contentType?.split('/')?.pop()?.toUpperCase() || f.fileType }))
                  } catch (err) {
                    setError(err?.message ?? 'Upload failed.')
                  }
                }}
                style={styles.input}
              />
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)' }}>
                Upload a new file to replace the current one, or edit the URL below.
              </p>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Associated course</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
                style={styles.input}
              >
                <option value="">General resource (no course)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File URL *</label>
              <input
                type="text"
                value={form.fileUrl}
                onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                style={styles.input}
                placeholder="https://..."
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File type (e.g. PDF)</label>
              <input
                type="text"
                value={form.fileType}
                onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                style={styles.input}
                placeholder="PDF, DOCX, etc."
              />
            </div>
            <div style={styles.formActions}>
              <button type="button" style={styles.btnSecondary} onClick={closeEditModal}>
                Cancel
              </button>
              <button type="submit" style={styles.btnPrimary} disabled={savingEditId !== null}>
                {savingEditId === editResource?.id ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create resource modal */}
      {modalOpen && (
        <Modal title="Add library resource" onClose={() => setModalOpen(false)} maxWidth={480}>
          <form onSubmit={handleCreate}>
            <div style={styles.formRow}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                style={styles.input}
                placeholder="Resource title"
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                style={{ ...styles.input, minHeight: 80 }}
                placeholder="Optional description"
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Type</label>
              <select
                value={form.resourceType}
                onChange={(e) => setForm((f) => ({ ...f, resourceType: e.target.value }))}
                style={styles.input}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Upload file</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    setForm((f) => ({ ...f, fileType: file.name.split('.').pop()?.toUpperCase() || '' }))
                    const result = await uploadFile(token, file, 'library')
                    setForm((f) => ({ ...f, fileUrl: result.url, fileType: result.contentType?.split('/')?.pop()?.toUpperCase() || f.fileType }))
                  } catch (err) {
                    setError(err?.message ?? 'Upload failed.')
                  }
                }}
                style={styles.input}
              />
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)' }}>
                Or enter a URL manually below.
              </p>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Associated course</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
                style={styles.input}
              >
                <option value="">General resource (no course)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File URL {form.fileUrl ? '' : '*'}</label>
              <input
                type="text"
                value={form.fileUrl}
                onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                style={styles.input}
                placeholder="https://... (auto-filled after upload)"
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File type (e.g. PDF)</label>
              <input
                type="text"
                value={form.fileType}
                onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                style={styles.input}
                placeholder="PDF, DOCX, etc."
              />
            </div>
            <div style={styles.formActions}>
              <button type="button" style={styles.btnSecondary} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" style={styles.btnPrimary} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Adding...' : 'Add resource'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      <AdminNavigatePills />
    </>
  )
}
