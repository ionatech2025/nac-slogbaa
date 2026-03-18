import { useState, useMemo, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'
import { useAdminCertificates, useAdminQuizAttempts } from '../../../lib/hooks/use-admin.js'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useDebounce } from '../../../shared/hooks/useDebounce.js'
import { Pagination, usePagination } from '../../../shared/components/Pagination.jsx'
import { TableSkeleton, KpiGridSkeleton } from '../../../shared/components/AdminTableSkeleton.jsx'
import { AnimatedCounter } from '../../../shared/components/AnimatedCounter.jsx'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { exportToCsv } from '../../../shared/utils/csvExport.js'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

// ── Chart colors (CSS vars don't work in SVG) ──
const CHART_COLORS = {
  blue: '#2563eb', green: '#059669', orange: '#d97706',
  purple: '#7c3aed', teal: '#0d9488', error: '#dc2626',
}
const PIE_PALETTE = [CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.orange, CHART_COLORS.purple, CHART_COLORS.teal]

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      padding: '0.5rem 0.75rem', borderRadius: 10,
      border: '1px solid var(--slogbaa-glass-border)',
      background: 'var(--slogbaa-glass-bg)', backdropFilter: 'blur(12px)',
      boxShadow: 'var(--slogbaa-glass-shadow)', fontSize: '0.75rem',
      color: 'var(--slogbaa-text)', lineHeight: 1.5,
    }}>
      {label && <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{label}</div>}
      {payload.map((e, i) => (
        <div key={i} style={{ color: e.color || 'var(--slogbaa-text)' }}>
          {e.name}: <strong>{e.value}</strong>
        </div>
      ))}
    </div>
  )
}

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  if (value === 0) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {value}
    </text>
  )
}

const styles = {
  pageTitle: {
    margin: '0 0 1rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--slogbaa-blue)',
    letterSpacing: '-0.02em',
  },
  section: {
    marginBottom: '2.25rem',
  },
  sectionTitle: {
    margin: '0 0 1rem',
    fontSize: '1.375rem',
    fontWeight: 700,
    color: 'var(--slogbaa-blue)',
    letterSpacing: '-0.01em',
  },
  subsectionTitle: {
    margin: '1.25rem 0 0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  subsectionTitleFirst: { margin: '0 0 0.5rem' },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  statCard: {
    padding: '1.5rem 1.5rem',
    background: 'var(--slogbaa-surface)',
    border: '2px solid var(--slogbaa-border)',
    borderRadius: 14,
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
    textAlign: 'center',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  statCardHighlight: {
    borderColor: 'rgba(37, 99, 235, 0.5)',
    background: 'rgba(37, 99, 235, 0.06)',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)',
  },
  statValue: {
    margin: 0,
    fontSize: '2.25rem',
    fontWeight: 800,
    color: 'var(--slogbaa-blue)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  statValueMuted: {
    margin: 0,
    fontSize: '2.25rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.2,
  },
  statLabel: {
    margin: '0.5rem 0 0',
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-text-muted)',
  },
  tableWrap: {
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    background: 'var(--slogbaa-surface)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
  thSortable: {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.15s',
  },
  thFirst: { borderTopLeftRadius: 11 },
  thLast: { borderTopRightRadius: 11 },
  td: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  trStriped: { background: 'rgba(37, 99, 235, 0.04)' },
  trLast: { borderBottom: 'none' },
  trSelected: { background: 'rgba(37, 99, 235, 0.10)' },
  empty: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  viewProfileBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginRight: '0.35rem',
    background: 'rgba(39, 129, 191, 0.12)',
    color: 'var(--slogbaa-blue, #2781bf)',
  },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginRight: '0.35rem',
    background: 'rgba(200, 60, 60, 0.12)',
    color: 'var(--slogbaa-error, #c0392b)',
  },
  loading: {
    padding: '1rem',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  error: {
    padding: '1rem',
    color: 'var(--slogbaa-error)',
    fontSize: '0.9375rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  sectionHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  searchInput: {
    padding: '0.5rem 0.875rem 0.5rem 2.25rem',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 10,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.875rem',
    outline: 'none',
    width: 220,
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  searchWrap: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
    pointerEvents: 'none',
    fontSize: '0.8125rem',
  },
  csvBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.875rem',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 8,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
  },
  sortArrow: {
    marginLeft: '0.35rem',
    fontSize: '0.6875rem',
    opacity: 0.85,
  },
  sortArrowInactive: {
    marginLeft: '0.35rem',
    fontSize: '0.6875rem',
    opacity: 0.3,
  },
  bulkBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 1.25rem',
    background: 'rgba(37, 99, 235, 0.08)',
    borderBottom: '1px solid var(--slogbaa-border)',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text)',
    fontWeight: 500,
  },
  bulkBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    border: '1px solid rgba(200, 60, 60, 0.3)',
    borderRadius: 6,
    background: 'rgba(200, 60, 60, 0.08)',
    color: 'var(--slogbaa-error, #c0392b)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  checkbox: {
    width: 16,
    height: 16,
    cursor: 'pointer',
    accentColor: 'var(--slogbaa-blue)',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  chartPanel: {
    padding: '1.25rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  chartTitle: {
    margin: '0 0 0.75rem',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  legendList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem 1rem',
    marginTop: '0.5rem',
    fontSize: '0.75rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: 'var(--slogbaa-text-muted)',
  },
  legendDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
}

/* ------------------------------------------------------------------ */
/*  Sorting helper                                                     */
/* ------------------------------------------------------------------ */
function sortData(data, sortKey, sortDir) {
  if (!sortKey) return data
  return [...data].sort((a, b) => {
    const aVal = (a[sortKey] ?? '').toString().toLowerCase()
    const bVal = (b[sortKey] ?? '').toString().toLowerCase()
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })
}

function SortArrow({ column, sortKey, sortDir }) {
  if (sortKey !== column) {
    return <span style={styles.sortArrowInactive}>{'▲'}</span>
  }
  return <span style={styles.sortArrow}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function AdminOverviewPage() {
  const {
    staff,
    trainees,
    courseCount = 0,
    overviewLoading,
    overviewError,
    handleDeleteStaff,
    handleDeleteTrainee,
    isSuperAdmin,
    token,
    currentUserId,
    currentUserEmail,
  } = useOutletContext()

  const { data: certificates = [], isLoading: certsLoading } = useAdminCertificates()
  const { data: attempts = [], isLoading: attemptsLoading } = useAdminQuizAttempts()
  useDocumentTitle('Overview')

  // Delete state
  const [deleteError, setDeleteError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)

  // Staff search & sort
  const [staffSearch, setStaffSearch] = useState('')
  const debouncedStaffSearch = useDebounce(staffSearch, 300)
  const [staffSortKey, setStaffSortKey] = useState(null)
  const [staffSortDir, setStaffSortDir] = useState('asc')

  // Trainee search & sort
  const [traineeSearch, setTraineeSearch] = useState('')
  const debouncedTraineeSearch = useDebounce(traineeSearch, 300)
  const [traineeSortKey, setTraineeSortKey] = useState(null)
  const [traineeSortDir, setTraineeSortDir] = useState('asc')

  // Bulk selection (trainees, SuperAdmin only)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [bulkConfirm, setBulkConfirm] = useState(false)

  // --- Filtered + sorted staff ---
  const filteredStaff = useMemo(() => {
    const q = debouncedStaffSearch.toLowerCase().trim()
    let result = staff ?? []
    if (q) {
      result = result.filter(
        (s) =>
          (s.fullName ?? '').toLowerCase().includes(q) ||
          (s.email ?? '').toLowerCase().includes(q) ||
          (s.role ?? '').toLowerCase().includes(q)
      )
    }
    return sortData(result, staffSortKey, staffSortDir)
  }, [staff, debouncedStaffSearch, staffSortKey, staffSortDir])

  // --- Filtered + sorted trainees ---
  const filteredTrainees = useMemo(() => {
    const q = debouncedTraineeSearch.toLowerCase().trim()
    let result = trainees ?? []
    if (q) {
      result = result.filter(
        (t) =>
          (t.fullName ?? '').toLowerCase().includes(q) ||
          (t.email ?? '').toLowerCase().includes(q) ||
          (t.districtName ?? t.district ?? '').toLowerCase().includes(q)
      )
    }
    return sortData(result, traineeSortKey, traineeSortDir)
  }, [trainees, debouncedTraineeSearch, traineeSortKey, traineeSortDir])

  // --- Pagination ---
  const staffPag = usePagination(filteredStaff, 10)
  const traineePag = usePagination(filteredTrainees, 10)

  // --- Sort toggle ---
  const toggleStaffSort = useCallback(
    (key) => {
      if (staffSortKey === key) {
        setStaffSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setStaffSortKey(key)
        setStaffSortDir('asc')
      }
    },
    [staffSortKey]
  )

  const toggleTraineeSort = useCallback(
    (key) => {
      if (traineeSortKey === key) {
        setTraineeSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setTraineeSortKey(key)
        setTraineeSortDir('asc')
      }
    },
    [traineeSortKey]
  )

  // --- Bulk selection helpers ---
  const currentPageTraineeIds = traineePag.paginatedItems.map((t) => t.id)
  const allOnPageSelected =
    currentPageTraineeIds.length > 0 &&
    currentPageTraineeIds.every((id) => selectedIds.has(id))

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allOnPageSelected) {
        currentPageTraineeIds.forEach((id) => next.delete(id))
      } else {
        currentPageTraineeIds.forEach((id) => next.add(id))
      }
      return next
    })
  }, [allOnPageSelected, currentPageTraineeIds])

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  // --- Delete handlers ---
  const runDeleteStaff = async (s) => {
    setConfirmTarget(null)
    setDeleteError(null)
    setDeletingId(s.id)
    try {
      await handleDeleteStaff?.(s.id)
    } catch (err) {
      setDeleteError(err?.message ?? 'Failed to delete staff.')
    } finally {
      setDeletingId(null)
    }
  }

  const runDeleteTrainee = async (t) => {
    setConfirmTarget(null)
    setDeleteError(null)
    setDeletingId(t.id)
    try {
      await handleDeleteTrainee?.(t.id)
    } catch (err) {
      setDeleteError(err?.message ?? 'Failed to delete trainee.')
    } finally {
      setDeletingId(null)
    }
  }

  const runBulkDeleteTrainees = async () => {
    setBulkConfirm(false)
    setDeleteError(null)
    const ids = [...selectedIds]
    for (const id of ids) {
      try {
        await handleDeleteTrainee?.(id)
      } catch (err) {
        setDeleteError(err?.message ?? `Failed to delete trainee ${id}.`)
        break
      }
    }
    clearSelection()
  }

  const onDeleteStaff = (s) => {
    setConfirmTarget({ type: 'staff', item: s })
  }

  const onDeleteTrainee = (t) => {
    setConfirmTarget({ type: 'trainee', item: t })
  }

  // --- Demographic breakdowns ---
  const genderData = useMemo(() => {
    const counts = {}
    ;(trainees ?? []).forEach((t) => {
      const g = (t.gender || 'Unknown').charAt(0).toUpperCase() + (t.gender || 'Unknown').slice(1).toLowerCase()
      counts[g] = (counts[g] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [trainees])

  const categoryData = useMemo(() => {
    const labels = { LEADER: 'Leader', CIVIL_SOCIETY_MEMBER: 'Civil Society', COMMUNITY_MEMBER: 'Community' }
    const counts = {}
    ;(trainees ?? []).forEach((t) => {
      const cat = labels[t.traineeCategory] || t.traineeCategory || 'Other'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [trainees])

  const districtData = useMemo(() => {
    const counts = {}
    ;(trainees ?? []).forEach((t) => {
      const d = t.districtName || t.district || 'Unknown'
      counts[d] = (counts[d] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, Trainees: value }))
  }, [trainees])

  const traineeStatusData = useMemo(() => {
    const certifiedIds = new Set(certificates.filter((c) => !c.revoked).map((c) => c.traineeId))
    // Failed = has quiz attempts where ALL failed (none passed) AND no certificate
    const attemptsByTrainee = {}
    attempts.forEach((a) => {
      if (!a.traineeId) return
      if (!attemptsByTrainee[a.traineeId]) attemptsByTrainee[a.traineeId] = { any: true, anyPassed: false }
      if (a.passed) attemptsByTrainee[a.traineeId].anyPassed = true
    })
    let graduated = 0
    let failed = 0
    ;(trainees ?? []).forEach((t) => {
      if (certifiedIds.has(t.id)) { graduated++; return }
      const record = attemptsByTrainee[t.id]
      if (record && record.any && !record.anyPassed) { failed++; return }
    })
    const inProgress = (trainees ?? []).length - graduated - failed
    return [
      { name: 'In Progress', value: inProgress },
      { name: 'Graduated', value: graduated },
      { name: 'Failed', value: failed },
    ]
  }, [trainees, certificates, attempts])

  // --- CSV export ---
  const exportStaffCsv = () => {
    exportToCsv(filteredStaff, {
      filename: 'staff-export',
      columns: ['fullName', 'email', 'role'],
      headers: { fullName: 'Name', email: 'Email', role: 'Role' },
    })
  }

  const exportTraineesCsv = () => {
    exportToCsv(
      filteredTrainees.map((t) => ({
        ...t,
        district: t.districtName ?? t.district ?? '',
      })),
      {
        filename: 'trainees-export',
        columns: ['fullName', 'email', 'district'],
        headers: { fullName: 'Name', email: 'Email', district: 'District' },
      }
    )
  }

  // --- Loading state ---
  if (overviewLoading) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Overview' }]} />
        <h2 style={styles.pageTitle}>Overview</h2>
        <KpiGridSkeleton count={4} />
        <div style={{ marginBottom: '1.5rem' }}>
          <TableSkeleton rows={5} columns={3} />
        </div>
        <TableSkeleton rows={5} columns={4} />
      </>
    )
  }

  // --- Error state ---
  if (overviewError) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Overview' }]} />
        <h2 style={styles.pageTitle}>Overview</h2>
        <p style={styles.error}>{overviewError}</p>
      </>
    )
  }

  const confirmMessage = confirmTarget
    ? confirmTarget.type === 'staff'
      ? `Delete staff "${confirmTarget.item.fullName}" (${confirmTarget.item.email})? This cannot be undone.`
      : `Delete trainee "${confirmTarget.item.fullName}" (${confirmTarget.item.email})? This cannot be undone.`
    : ''

  const staffColCount = isSuperAdmin ? 4 : 3
  const traineeColCount = isSuperAdmin ? 5 : 4

  return (
    <>
      <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Overview' }]} />
      <h2 style={styles.pageTitle}>Overview</h2>

      {/* Confirm modals */}
      {confirmTarget && (
        <ConfirmModal
          message={confirmMessage}
          onContinue={() =>
            confirmTarget.type === 'staff'
              ? runDeleteStaff(confirmTarget.item)
              : runDeleteTrainee(confirmTarget.item)
          }
          onCancel={() => setConfirmTarget(null)}
        />
      )}
      {bulkConfirm && (
        <ConfirmModal
          message={`Delete ${selectedIds.size} selected trainee${selectedIds.size === 1 ? '' : 's'}? This cannot be undone.`}
          onContinue={runBulkDeleteTrainees}
          onCancel={() => setBulkConfirm(false)}
        />
      )}

      {/* KPI cards */}
      <section style={styles.section}>
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={styles.statValue}>
              <AnimatedCounter value={(staff ?? []).length} />
            </p>
            <p style={styles.statLabel}>Staff</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={styles.statValue}>
              <AnimatedCounter value={(trainees ?? []).length} />
            </p>
            <p style={styles.statLabel}>Trainees</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={styles.statValue}>
              <AnimatedCounter value={courseCount} />
            </p>
            <p style={styles.statLabel}>Courses</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={certsLoading ? styles.statValueMuted : styles.statValue}>
              {certsLoading ? (
                '\u2014'
              ) : (
                <AnimatedCounter value={certificates.filter((c) => !c.revoked).length} />
              )}
            </p>
            <p style={styles.statLabel}>Certificates</p>
          </div>
        </div>
      </section>

      {/* Demographic Breakdowns */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Trainee Demographics</h2>
        <div style={styles.chartsRow}>
          {/* Gender breakdown */}
          <div style={styles.chartPanel}>
            <h4 style={styles.chartTitle}>Gender Distribution</h4>
            {genderData.length === 0 ? (
              <p style={styles.empty}>No trainee data yet.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={renderPieLabel}
                      stroke="none"
                    >
                      {genderData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_PALETTE[idx % PIE_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={styles.legendList}>
                  {genderData.map((d, i) => (
                    <span key={d.name} style={styles.legendItem}>
                      <span style={styles.legendDot(PIE_PALETTE[i % PIE_PALETTE.length])} />
                      {d.name} ({d.value})
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Trainee category breakdown */}
          <div style={styles.chartPanel}>
            <h4 style={styles.chartTitle}>Trainee Category</h4>
            {categoryData.length === 0 ? (
              <p style={styles.empty}>No trainee data yet.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={renderPieLabel}
                      stroke="none"
                    >
                      {categoryData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_PALETTE[idx % PIE_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={styles.legendList}>
                  {categoryData.map((d, i) => (
                    <span key={d.name} style={styles.legendItem}>
                      <span style={styles.legendDot(PIE_PALETTE[i % PIE_PALETTE.length])} />
                      {d.name} ({d.value})
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Trainee status (in-progress vs graduated) */}
          <div style={styles.chartPanel}>
            <h4 style={styles.chartTitle}>Trainee Status</h4>
            {certsLoading || attemptsLoading ? (
              <p style={styles.empty}>Loading...</p>
            ) : traineeStatusData.every((d) => d.value === 0) ? (
              <p style={styles.empty}>No trainee data yet.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={traineeStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={renderPieLabel}
                      stroke="none"
                    >
                      <Cell fill={CHART_COLORS.orange} />
                      <Cell fill={CHART_COLORS.green} />
                      <Cell fill={CHART_COLORS.error} />
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={styles.legendList}>
                  {traineeStatusData.map((d, i) => (
                    <span key={d.name} style={styles.legendItem}>
                      <span style={styles.legendDot([CHART_COLORS.orange, CHART_COLORS.green, CHART_COLORS.error][i])} />
                      {d.name} ({d.value})
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* District breakdown bar chart */}
        <div style={{ ...styles.chartPanel, marginBottom: '2rem' }}>
          <h4 style={styles.chartTitle}>Top Districts by Trainee Count</h4>
          {districtData.length === 0 ? (
            <p style={styles.empty}>No district data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, districtData.length * 38)}>
              <BarChart data={districtData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--slogbaa-border)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--slogbaa-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: 'var(--slogbaa-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
                <Bar dataKey="Trainees" fill={CHART_COLORS.blue} radius={[0, 6, 6, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* People section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>People</h2>
        {deleteError && (
          <p style={{ ...styles.error, marginBottom: '1rem' }}>{deleteError}</p>
        )}

        {/* ---------- Staff table ---------- */}
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderLeft}>
            <h3 style={{ ...styles.subsectionTitle, ...styles.subsectionTitleFirst, margin: 0 }}>
              Staff
            </h3>
            <button
              type="button"
              style={styles.csvBtn}
              onClick={exportStaffCsv}
              title="Export staff to CSV"
            >
              <FontAwesomeIcon icon={icons.download} size="0.8em" /> CSV
            </button>
          </div>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>
              <FontAwesomeIcon icon={icons.search} size="0.85em" />
            </span>
            <input
              type="text"
              placeholder="Search staff..."
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              style={styles.searchInput}
              aria-label="Search staff"
            />
          </div>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={{ ...styles.th, ...styles.thFirst, ...styles.thSortable }}
                  onClick={() => toggleStaffSort('fullName')}
                >
                  Name
                  <SortArrow column="fullName" sortKey={staffSortKey} sortDir={staffSortDir} />
                </th>
                <th
                  style={{ ...styles.th, ...styles.thSortable }}
                  onClick={() => toggleStaffSort('email')}
                >
                  Email
                  <SortArrow column="email" sortKey={staffSortKey} sortDir={staffSortDir} />
                </th>
                <th
                  style={{
                    ...styles.th,
                    ...styles.thSortable,
                    ...(isSuperAdmin ? {} : styles.thLast),
                  }}
                  onClick={() => toggleStaffSort('role')}
                >
                  Role
                  <SortArrow column="role" sortKey={staffSortKey} sortDir={staffSortDir} />
                </th>
                {isSuperAdmin && (
                  <th style={{ ...styles.th, ...styles.thLast }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {staffPag.paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={staffColCount} style={styles.empty}>
                    {debouncedStaffSearch
                      ? 'No staff matching your search.'
                      : 'No staff yet. Use Quick Actions \u2192 Create Staff to add.'}
                  </td>
                </tr>
              ) : (
                staffPag.paginatedItems.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      ...(i === staffPag.paginatedItems.length - 1 ? styles.trLast : {}),
                      ...(i % 2 === 1 ? styles.trStriped : {}),
                    }}
                  >
                    <td style={styles.td}>
                      <Link
                        to={`/admin/users/staff/${s.id}`}
                        style={{
                          color: 'var(--slogbaa-blue)',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        {s.fullName}
                      </Link>
                    </td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>
                      {String(s.role ?? '').toUpperCase() === 'SUPER_ADMIN'
                        ? 'Super Admin'
                        : 'Admin'}
                    </td>
                    {isSuperAdmin && (
                      <td style={styles.td}>
                        <Link
                          to={`/admin/users/staff/${s.id}`}
                          style={styles.viewProfileBtn}
                          title="View / manage staff"
                          aria-label={`View / manage staff: ${s.fullName}`}
                        >
                          <FontAwesomeIcon icon={icons.eye} />
                        </Link>
                        {s.id !== currentUserId && s.email !== currentUserEmail ? (
                          <button
                            type="button"
                            style={styles.deleteBtn}
                            onClick={() => onDeleteStaff(s)}
                            disabled={deletingId === s.id}
                            title="Delete staff"
                            aria-label={`Delete staff: ${s.fullName}`}
                          >
                            <FontAwesomeIcon icon={icons.delete} />
                          </button>
                        ) : null}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={staffPag.page}
          totalItems={staffPag.totalItems}
          pageSize={staffPag.pageSize}
          onPageChange={staffPag.setPage}
          onPageSizeChange={staffPag.setPageSize}
        />

        {/* ---------- Trainees table ---------- */}
        <div style={{ ...styles.sectionHeader, marginTop: '1.25rem' }}>
          <div style={styles.sectionHeaderLeft}>
            <h3 style={{ ...styles.subsectionTitle, margin: 0 }}>Trainees</h3>
            <button
              type="button"
              style={styles.csvBtn}
              onClick={exportTraineesCsv}
              title="Export trainees to CSV"
            >
              <FontAwesomeIcon icon={icons.download} size="0.8em" /> CSV
            </button>
          </div>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>
              <FontAwesomeIcon icon={icons.search} size="0.85em" />
            </span>
            <input
              type="text"
              placeholder="Search trainees..."
              value={traineeSearch}
              onChange={(e) => setTraineeSearch(e.target.value)}
              style={styles.searchInput}
              aria-label="Search trainees"
            />
          </div>
        </div>

        <div style={styles.tableWrap}>
          {/* Bulk action bar */}
          {isSuperAdmin && selectedIds.size > 0 && (
            <div style={styles.bulkBar}>
              <span>
                {selectedIds.size} trainee{selectedIds.size === 1 ? '' : 's'} selected
              </span>
              <button
                type="button"
                style={styles.bulkBtn}
                onClick={() => setBulkConfirm(true)}
              >
                <FontAwesomeIcon icon={icons.delete} size="0.8em" /> Delete selected
              </button>
              <button
                type="button"
                style={{
                  ...styles.csvBtn,
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8125rem',
                }}
                onClick={clearSelection}
              >
                Clear
              </button>
            </div>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                {isSuperAdmin && (
                  <th style={{ ...styles.th, ...styles.thFirst, width: 40, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={allOnPageSelected && currentPageTraineeIds.length > 0}
                      onChange={toggleSelectAll}
                      style={styles.checkbox}
                      aria-label="Select all trainees on this page"
                    />
                  </th>
                )}
                <th
                  style={{
                    ...styles.th,
                    ...styles.thSortable,
                    ...(!isSuperAdmin ? styles.thFirst : {}),
                  }}
                  onClick={() => toggleTraineeSort('fullName')}
                >
                  Name
                  <SortArrow
                    column="fullName"
                    sortKey={traineeSortKey}
                    sortDir={traineeSortDir}
                  />
                </th>
                <th
                  style={{ ...styles.th, ...styles.thSortable }}
                  onClick={() => toggleTraineeSort('email')}
                >
                  Email
                  <SortArrow
                    column="email"
                    sortKey={traineeSortKey}
                    sortDir={traineeSortDir}
                  />
                </th>
                <th
                  style={{ ...styles.th, ...styles.thSortable }}
                  onClick={() => toggleTraineeSort('districtName')}
                >
                  District
                  <SortArrow
                    column="districtName"
                    sortKey={traineeSortKey}
                    sortDir={traineeSortDir}
                  />
                </th>
                <th style={{ ...styles.th, ...styles.thLast }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {traineePag.paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={traineeColCount} style={styles.empty}>
                    {debouncedTraineeSearch
                      ? 'No trainees matching your search.'
                      : 'No trainees registered yet.'}
                  </td>
                </tr>
              ) : (
                traineePag.paginatedItems.map((t, i) => {
                  const isSelected = selectedIds.has(t.id)
                  return (
                    <tr
                      key={t.id}
                      style={{
                        ...(i === traineePag.paginatedItems.length - 1 ? styles.trLast : {}),
                        ...(isSelected
                          ? styles.trSelected
                          : i % 2 === 1
                            ? styles.trStriped
                            : {}),
                      }}
                    >
                      {isSuperAdmin && (
                        <td style={{ ...styles.td, textAlign: 'center', width: 40 }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(t.id)}
                            style={styles.checkbox}
                            aria-label={`Select ${t.fullName}`}
                          />
                        </td>
                      )}
                      <td style={styles.td}>
                        <Link
                          to={`/admin/users/trainee/${t.id}`}
                          style={{
                            color: 'var(--slogbaa-blue)',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          {t.fullName}
                        </Link>
                      </td>
                      <td style={styles.td}>{t.email}</td>
                      <td style={styles.td}>{t.districtName ?? t.district ?? '\u2014'}</td>
                      <td style={styles.td}>
                        <Link
                          to={`/admin/users/trainee/${t.id}`}
                          style={styles.viewProfileBtn}
                          title="View / manage trainee"
                          aria-label={`View / manage trainee: ${t.fullName}`}
                        >
                          <FontAwesomeIcon icon={icons.eye} />
                        </Link>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            style={styles.deleteBtn}
                            onClick={() => onDeleteTrainee(t)}
                            disabled={deletingId === t.id}
                            title="Delete trainee"
                            aria-label={`Delete trainee: ${t.fullName}`}
                          >
                            <FontAwesomeIcon icon={icons.delete} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={traineePag.page}
          totalItems={traineePag.totalItems}
          pageSize={traineePag.pageSize}
          onPageChange={traineePag.setPage}
          onPageSizeChange={traineePag.setPageSize}
        />
      </section>
    </>
  )
}
