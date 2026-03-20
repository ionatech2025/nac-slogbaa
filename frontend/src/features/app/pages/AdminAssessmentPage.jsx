import { useState, useMemo, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, Icon, icons } from '../../../shared/icons.jsx'
import { useAdminCertificates, useAdminQuizAttempts, useAdminQuizModules, useRevokeCertificate } from '../../../lib/hooks/use-admin.js'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'
import { Tabs } from '../../../shared/components/Tabs.jsx'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Pagination, usePagination } from '../../../shared/components/Pagination.jsx'
import { TableSkeleton } from '../../../shared/components/AdminTableSkeleton.jsx'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useDebounce } from '../../../shared/hooks/useDebounce.js'
import { exportToCsv } from '../../../shared/utils/csvExport.js'

const TAB_QUIZZES = 'quizzes'
const TAB_CERTIFICATES = 'certificates'
const TAB_ATTEMPTS = 'attempts'

const STATUS_ALL = 'all'
const STATUS_ACTIVE = 'active'
const STATUS_REVOKED = 'revoked'

const styles = {
  pageTitle: {
    margin: '0 0 1rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--slogbaa-blue)',
    letterSpacing: '-0.02em',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  searchWrap: {
    position: 'relative',
    flex: '1 1 260px',
    maxWidth: 360,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--slogbaa-text-muted)',
    pointerEvents: 'none',
    fontSize: '0.875rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.55rem 0.75rem 0.55rem 2.25rem',
    border: '1px solid var(--slogbaa-glass-border, var(--slogbaa-border))',
    borderRadius: 10,
    background: 'var(--slogbaa-glass-bg, var(--slogbaa-surface))',
    backdropFilter: 'var(--slogbaa-glass-blur, none)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur, none)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  dateInput: {
    padding: '0.5rem 0.65rem',
    border: '1px solid var(--slogbaa-glass-border, var(--slogbaa-border))',
    borderRadius: 10,
    background: 'var(--slogbaa-glass-bg, var(--slogbaa-surface))',
    backdropFilter: 'var(--slogbaa-glass-blur, none)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur, none)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  dateLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    marginRight: 4,
  },
  dateGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  pillGroup: {
    display: 'flex',
    gap: 0,
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-glass-border, var(--slogbaa-border))',
  },
  pill: {
    padding: '0.45rem 0.85rem',
    border: 'none',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    borderRight: '1px solid var(--slogbaa-glass-border, var(--slogbaa-border))',
  },
  pillActive: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontWeight: 600,
  },
  pillLast: {
    borderRight: 'none',
  },
  csvBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    padding: 0,
    border: '1px solid var(--slogbaa-glass-border, var(--slogbaa-border))',
    borderRadius: 10,
    background: 'var(--slogbaa-glass-bg, var(--slogbaa-surface))',
    backdropFilter: 'var(--slogbaa-glass-blur, none)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur, none)',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
    flexShrink: 0,
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
    color: 'var(--slogbaa-text-muted)',
    background: 'rgba(0,0,0,0.03)',
    borderBottom: '1px solid var(--slogbaa-border)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  thSortable: {
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  thSortActive: {
    color: 'var(--slogbaa-blue)',
  },
  sortArrow: {
    marginLeft: 4,
    fontSize: '0.6875rem',
    opacity: 0.5,
  },
  sortArrowActive: {
    opacity: 1,
    color: 'var(--slogbaa-blue)',
  },
  td: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  trLast: {
    borderBottom: 'none',
  },
  link: {
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  emptyState: {
    padding: '2.5rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  btnRevoke: {
    padding: '0.35rem 0.6rem',
    fontSize: '0.8125rem',
    border: '1px solid var(--slogbaa-error)',
    background: 'transparent',
    color: 'var(--slogbaa-error)',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 500,
  },
}

/** Sortable column header */
function SortTh({ children, sortKey, sortState, onSort, style: extraStyle }) {
  const active = sortState.key === sortKey
  const arrow = active ? (sortState.dir === 'asc' ? ' \u25B2' : ' \u25BC') : ' \u25B2\u25BC'
  return (
    <th
      style={{
        ...styles.th,
        ...styles.thSortable,
        ...(active ? styles.thSortActive : {}),
        ...extraStyle,
      }}
      onClick={() => onSort(sortKey)}
      role="columnheader"
      aria-sort={active ? (sortState.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {children}
      <span style={{ ...styles.sortArrow, ...(active ? styles.sortArrowActive : {}) }}>{arrow}</span>
    </th>
  )
}

/** Generic sort hook */
function useSort(defaultKey = '', defaultDir = 'asc') {
  const [sortState, setSortState] = useState({ key: defaultKey, dir: defaultDir })

  const onSort = useCallback((key) => {
    setSortState((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const sortItems = useCallback((items) => {
    if (!sortState.key) return items
    return [...items].sort((a, b) => {
      let aVal = a[sortState.key]
      let bVal = b[sortState.key]
      // Handle nullish
      if (aVal == null) aVal = ''
      if (bVal == null) bVal = ''
      // Number comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortState.dir === 'asc' ? aVal - bVal : bVal - aVal
      }
      // Boolean comparison
      if (typeof aVal === 'boolean') {
        return sortState.dir === 'asc' ? (aVal === bVal ? 0 : aVal ? 1 : -1) : (aVal === bVal ? 0 : aVal ? -1 : 1)
      }
      // String comparison
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' })
      return sortState.dir === 'asc' ? cmp : -cmp
    })
  }, [sortState])

  return { sortState, onSort, sortItems }
}

export function AdminAssessmentPage() {
  useDocumentTitle('Assessment')
  const { isSuperAdmin } = useOutletContext()
  const [activeTab, setActiveTab] = useState(TAB_QUIZZES)
  const [revokeModal, setRevokeModal] = useState(null)

  // Search state
  const [certSearch, setCertSearch] = useState('')
  const [attemptSearch, setAttemptSearch] = useState('')
  const debouncedCertSearch = useDebounce(certSearch, 300)
  const debouncedAttemptSearch = useDebounce(attemptSearch, 300)

  // Status filter (certificates)
  const [certStatusFilter, setCertStatusFilter] = useState(STATUS_ALL)

  // Date range filter (attempts)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Sort state
  const certSort = useSort('issuedDate', 'desc')
  const attemptSort = useSort('completedAt', 'desc')

  // TanStack Query
  const { data: quizModules = [], isLoading: loading, error: quizError } = useAdminQuizModules()
  const { data: certificates = [], isLoading: certLoading, error: certQueryError } = useAdminCertificates()
  const { data: attempts = [], isLoading: attemptsLoading, error: attemptsQueryError } = useAdminQuizAttempts()
  const revokeMutation = useRevokeCertificate()

  const error = quizError?.message ?? null
  const certError = certQueryError?.message ?? revokeMutation.error?.message ?? null
  const attemptsError = attemptsQueryError?.message ?? null

  const toast = useToast()

  const handleRevoke = async (cert) => {
    if (!isSuperAdmin) return
    try {
      await revokeMutation.mutateAsync(cert.id)
      setRevokeModal(null)
      toast.success('Certificate revoked.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to revoke certificate.')
    }
  }

  // --- Filtered + sorted certificates ---
  const filteredCerts = useMemo(() => {
    let list = certificates
    // Status filter
    if (certStatusFilter === STATUS_ACTIVE) list = list.filter((c) => !c.revoked)
    else if (certStatusFilter === STATUS_REVOKED) list = list.filter((c) => c.revoked)
    // Search filter
    if (debouncedCertSearch) {
      const q = debouncedCertSearch.toLowerCase()
      list = list.filter(
        (c) =>
          (c.traineeName || '').toLowerCase().includes(q) ||
          (c.courseTitle || '').toLowerCase().includes(q) ||
          (c.certificateNumber || '').toLowerCase().includes(q)
      )
    }
    return certSort.sortItems(list)
  }, [certificates, certStatusFilter, debouncedCertSearch, certSort.sortItems])

  // --- Filtered + sorted attempts ---
  const filteredAttempts = useMemo(() => {
    let list = attempts
    // Search filter
    if (debouncedAttemptSearch) {
      const q = debouncedAttemptSearch.toLowerCase()
      list = list.filter(
        (a) =>
          (a.traineeName || '').toLowerCase().includes(q) ||
          (a.courseTitle || '').toLowerCase().includes(q)
      )
    }
    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom)
      list = list.filter((a) => a.completedAt && new Date(a.completedAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      list = list.filter((a) => a.completedAt && new Date(a.completedAt) <= to)
    }
    return attemptSort.sortItems(list)
  }, [attempts, debouncedAttemptSearch, dateFrom, dateTo, attemptSort.sortItems])

  // --- Pagination ---
  const certPagination = usePagination(filteredCerts, 20)
  const attemptPagination = usePagination(filteredAttempts, 20)

  // --- CSV export ---
  const handleExportCerts = () => {
    exportToCsv(filteredCerts, {
      filename: 'certificates',
      columns: ['certificateNumber', 'traineeName', 'courseTitle', 'finalScorePercent', 'issuedDate', 'revoked'],
      headers: {
        certificateNumber: 'Certificate #',
        traineeName: 'Trainee',
        courseTitle: 'Course',
        finalScorePercent: 'Score %',
        issuedDate: 'Issued Date',
        revoked: 'Revoked',
      },
    })
  }

  const handleExportAttempts = () => {
    exportToCsv(filteredAttempts, {
      filename: 'quiz-attempts',
      columns: ['traineeName', 'courseTitle', 'moduleTitle', 'quizTitle', 'attemptNumber', 'pointsEarned', 'totalPoints', 'scorePercent', 'passed', 'completedAt'],
      headers: {
        traineeName: 'Trainee',
        courseTitle: 'Course',
        moduleTitle: 'Module',
        quizTitle: 'Quiz',
        attemptNumber: 'Attempt #',
        pointsEarned: 'Points Earned',
        totalPoints: 'Total Points',
        scorePercent: 'Score %',
        passed: 'Passed',
        completedAt: 'Completed At',
      },
    })
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Assessment' }]} />

      <h1 style={styles.pageTitle}>Assessment</h1>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
        Manage quizzes and certificates. {!isSuperAdmin && 'You have view-only access.'}
      </p>

      <Tabs
        tabs={[
          { value: TAB_QUIZZES, label: 'Quizzes', icon: <Icon icon={icons.blockActivity} size="1em" /> },
          { value: TAB_CERTIFICATES, label: 'Certificates', icon: <Icon icon={icons.certificate} size="1em" /> },
          { value: TAB_ATTEMPTS, label: 'Attempts', icon: <Icon icon={icons.viewList} size="1em" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ---- QUIZZES TAB ---- */}
      {activeTab === TAB_QUIZZES && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Module quizzes</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            Quizzes are managed per module. Click a row to {isSuperAdmin ? 'edit' : 'view'} the quiz in the module editor.
          </p>
          {loading && <TableSkeleton rows={5} columns={3} />}
          {error && (
            <p style={{ ...styles.emptyState, color: 'var(--slogbaa-error)' }}>{error}</p>
          )}
          {!loading && !error && quizModules.length === 0 && (
            <div style={styles.tableWrap}>
              <div style={styles.emptyState}>
                No modules with quizzes yet. Add a quiz when editing a module in Learning → Course → Module.
              </div>
            </div>
          )}
          {!loading && !error && quizModules.length > 0 && (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Module</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizModules.map((row, i) => (
                    <tr key={`${row.courseId}-${row.moduleId}`} style={i === quizModules.length - 1 ? styles.trLast : {}}>
                      <td style={styles.td}>{row.courseTitle}</td>
                      <td style={styles.td}>{row.moduleTitle}</td>
                      <td style={styles.td}>
                        <Link
                          to={`/admin/learning/${row.courseId}/modules/${row.moduleId}#quiz`}
                          style={styles.link}
                          title={isSuperAdmin ? 'Edit quiz' : 'View quiz'}
                          aria-label={`${isSuperAdmin ? 'Edit' : 'View'} quiz: ${row.moduleTitle}`}
                        >
                          {isSuperAdmin ? (
                            <FontAwesomeIcon icon={icons.edit} />
                          ) : (
                            <FontAwesomeIcon icon={icons.eye} />
                          )}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---- CERTIFICATES TAB ---- */}
      {activeTab === TAB_CERTIFICATES && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Certificates</h2>
            <button
              type="button"
              style={styles.csvBtn}
              onClick={handleExportCerts}
              title="Export certificates to CSV"
              aria-label="Export certificates to CSV"
              disabled={filteredCerts.length === 0}
            >
              <Icon icon={icons.download} size="1em" />
            </button>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            Certificates are issued when trainees complete a course with a passing quiz score.
            {isSuperAdmin && ' As SuperAdmin, you can revoke certificates if needed.'}
          </p>

          {/* Toolbar: search + status pills */}
          <div style={styles.toolbar}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>
                <Icon icon={icons.search} size="0.9em" />
              </span>
              <input
                type="text"
                placeholder="Search trainee, course, certificate #..."
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                style={styles.searchInput}
                aria-label="Search certificates"
              />
            </div>
            <div style={styles.pillGroup}>
              {[
                { key: STATUS_ALL, label: 'All' },
                { key: STATUS_ACTIVE, label: 'Active' },
                { key: STATUS_REVOKED, label: 'Revoked' },
              ].map((item, i, arr) => (
                <button
                  key={item.key}
                  type="button"
                  style={{
                    ...styles.pill,
                    ...(certStatusFilter === item.key ? styles.pillActive : {}),
                    ...(i === arr.length - 1 ? styles.pillLast : {}),
                  }}
                  onClick={() => setCertStatusFilter(item.key)}
                  aria-pressed={certStatusFilter === item.key}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {certLoading && <TableSkeleton rows={6} columns={isSuperAdmin ? 7 : 6} />}
          {certError && (
            <p style={{ ...styles.emptyState, color: 'var(--slogbaa-error)' }}>{certError}</p>
          )}
          {!certLoading && !certError && filteredCerts.length === 0 && (
            <div style={styles.tableWrap}>
              <div style={styles.emptyState}>
                {certificates.length === 0
                  ? 'No certificates issued yet.'
                  : 'No certificates match your filters.'}
              </div>
            </div>
          )}
          {!certLoading && !certError && filteredCerts.length > 0 && (
            <>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <SortTh sortKey="certificateNumber" sortState={certSort.sortState} onSort={certSort.onSort}>Certificate</SortTh>
                      <SortTh sortKey="traineeName" sortState={certSort.sortState} onSort={certSort.onSort}>Trainee</SortTh>
                      <SortTh sortKey="courseTitle" sortState={certSort.sortState} onSort={certSort.onSort}>Course</SortTh>
                      <SortTh sortKey="finalScorePercent" sortState={certSort.sortState} onSort={certSort.onSort}>Score</SortTh>
                      <SortTh sortKey="issuedDate" sortState={certSort.sortState} onSort={certSort.onSort}>Date</SortTh>
                      <SortTh sortKey="revoked" sortState={certSort.sortState} onSort={certSort.onSort}>Status</SortTh>
                      {isSuperAdmin && <th style={styles.th}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {certPagination.paginatedItems.map((cert, i) => (
                      <tr key={cert.id} style={i === certPagination.paginatedItems.length - 1 ? styles.trLast : {}}>
                        <td style={styles.td}>{cert.certificateNumber}</td>
                        <td style={styles.td}>{cert.traineeName}</td>
                        <td style={styles.td}>{cert.courseTitle}</td>
                        <td style={styles.td}>{cert.finalScorePercent}%</td>
                        <td style={styles.td}>{cert.issuedDate}</td>
                        <td style={styles.td}>
                          {cert.revoked ? (
                            <Badge variant="danger">Revoked</Badge>
                          ) : (
                            <Badge variant="primary">Active</Badge>
                          )}
                        </td>
                        {isSuperAdmin && (
                          <td style={styles.td}>
                            {!cert.revoked && (
                              <button
                                type="button"
                                style={styles.btnRevoke}
                                onClick={() => setRevokeModal(cert)}
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={certPagination.page}
                totalItems={certPagination.totalItems}
                pageSize={certPagination.pageSize}
                onPageChange={certPagination.setPage}
                onPageSizeChange={certPagination.setPageSize}
              />
            </>
          )}
          {revokeModal && (
            <ConfirmModal
              message={`Revoke certificate ${revokeModal.certificateNumber} for ${revokeModal.traineeName}? This action cannot be undone.`}
              onContinue={() => handleRevoke(revokeModal)}
              onCancel={() => setRevokeModal(null)}
            />
          )}
        </div>
      )}

      {/* ---- ATTEMPTS TAB ---- */}
      {activeTab === TAB_ATTEMPTS && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Quiz attempts</h2>
            <button
              type="button"
              style={styles.csvBtn}
              onClick={handleExportAttempts}
              title="Export attempts to CSV"
              aria-label="Export attempts to CSV"
              disabled={filteredAttempts.length === 0}
            >
              <Icon icon={icons.download} size="1em" />
            </button>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            Completed quiz attempts by trainees. Shows the most recent 500.
          </p>

          {/* Toolbar: search + date range */}
          <div style={styles.toolbar}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>
                <Icon icon={icons.search} size="0.9em" />
              </span>
              <input
                type="text"
                placeholder="Search trainee, course..."
                value={attemptSearch}
                onChange={(e) => setAttemptSearch(e.target.value)}
                style={styles.searchInput}
                aria-label="Search attempts"
              />
            </div>
            <div style={styles.dateGroup}>
              <span style={styles.dateLabel}>From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={styles.dateInput}
                aria-label="Filter from date"
              />
            </div>
            <div style={styles.dateGroup}>
              <span style={styles.dateLabel}>To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={styles.dateInput}
                aria-label="Filter to date"
              />
            </div>
          </div>

          {attemptsLoading && <TableSkeleton rows={6} columns={7} />}
          {attemptsError && (
            <p style={{ ...styles.emptyState, color: 'var(--slogbaa-error)' }}>{attemptsError}</p>
          )}
          {!attemptsLoading && !attemptsError && filteredAttempts.length === 0 && (
            <div style={styles.tableWrap}>
              <div style={styles.emptyState}>
                {attempts.length === 0
                  ? 'No completed quiz attempts yet.'
                  : 'No attempts match your filters.'}
              </div>
            </div>
          )}
          {!attemptsLoading && !attemptsError && filteredAttempts.length > 0 && (
            <>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <SortTh sortKey="traineeName" sortState={attemptSort.sortState} onSort={attemptSort.onSort}>Trainee</SortTh>
                      <SortTh sortKey="courseTitle" sortState={attemptSort.sortState} onSort={attemptSort.onSort}>Course</SortTh>
                      <SortTh sortKey="moduleTitle" sortState={attemptSort.sortState} onSort={attemptSort.onSort}>Module / Quiz</SortTh>
                      <SortTh sortKey="attemptNumber" sortState={attemptSort.sortState} onSort={attemptSort.onSort}>Attempt</SortTh>
                      <SortTh sortKey="scorePercent" sortState={attemptSort.sortState} onSort={attemptSort.onSort}>Score</SortTh>
                      <SortTh sortKey="passed" sortState={attemptSort.sortState} onSort={attemptSort.onSort}>Result</SortTh>
                      <SortTh sortKey="completedAt" sortState={attemptSort.sortState} onSort={attemptSort.onSort}>Completed</SortTh>
                    </tr>
                  </thead>
                  <tbody>
                    {attemptPagination.paginatedItems.map((a, i) => (
                      <tr key={a.id} style={i === attemptPagination.paginatedItems.length - 1 ? styles.trLast : {}}>
                        <td style={styles.td}>{a.traineeName}</td>
                        <td style={styles.td}>{a.courseTitle}</td>
                        <td style={styles.td}>{a.moduleTitle} / {a.quizTitle}</td>
                        <td style={styles.td}>#{a.attemptNumber}</td>
                        <td style={styles.td}>{a.pointsEarned}/{a.totalPoints} ({a.scorePercent}%)</td>
                        <td style={styles.td}>
                          {a.passed ? (
                            <Badge variant="success">Passed</Badge>
                          ) : (
                            <Badge variant="danger">Failed</Badge>
                          )}
                        </td>
                        <td style={styles.td}>
                          {a.completedAt ? new Date(a.completedAt).toLocaleString() : '\u2014'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={attemptPagination.page}
                totalItems={attemptPagination.totalItems}
                pageSize={attemptPagination.pageSize}
                onPageChange={attemptPagination.setPage}
                onPageSizeChange={attemptPagination.setPageSize}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
