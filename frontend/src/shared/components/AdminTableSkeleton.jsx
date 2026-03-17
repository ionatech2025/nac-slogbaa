import { Skeleton } from './Skeleton.jsx'

const s = {
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
    gap: '0.875rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    padding: '1.125rem 1rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
  },
  tableWrap: {
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    background: 'var(--slogbaa-surface)',
  },
  headerRow: {
    display: 'flex',
    gap: '1rem',
    padding: '0.875rem 1.25rem',
    background: 'var(--slogbaa-dark)',
    borderBottom: '3px solid var(--slogbaa-blue)',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    alignItems: 'center',
  },
  searchBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
    alignItems: 'center',
  },
}

/** Skeleton for KPI stat cards (AdminHomePage / AdminOverviewPage) */
export function KpiGridSkeleton({ count = 4 }) {
  return (
    <div style={s.kpiGrid}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={s.kpiCard}>
          <Skeleton style={{ width: 38, height: 38, borderRadius: 10, marginBottom: 10 }} />
          <Skeleton style={{ width: 55, height: 24, borderRadius: 6, marginBottom: 6 }} />
          <Skeleton style={{ width: 75, height: 10, borderRadius: 4 }} />
        </div>
      ))}
    </div>
  )
}

/** Skeleton for a data table with columns */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  const colWidths = ['30%', '25%', '20%', '15%', '10%']
  return (
    <div style={s.tableWrap}>
      <div style={s.headerRow}>
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton
            key={i}
            style={{
              width: colWidths[i % colWidths.length],
              height: 12,
              borderRadius: 4,
              opacity: 0.4,
            }}
          />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} style={{ ...s.row, ...(r % 2 === 1 ? { background: 'rgba(37, 99, 235, 0.02)' } : {}) }}>
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton
              key={c}
              style={{
                width: colWidths[c % colWidths.length],
                height: 14,
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Skeleton for search bar + filter area */
export function SearchBarSkeleton() {
  return (
    <div style={s.searchBar}>
      <Skeleton style={{ width: 260, height: 36, borderRadius: 8 }} />
      <Skeleton style={{ width: 120, height: 36, borderRadius: 8 }} />
      <Skeleton style={{ width: 140, height: 36, borderRadius: 8 }} />
    </div>
  )
}

/** Full admin page skeleton: title + stats + search + table */
export function AdminPageSkeleton({ title, showStats = true, statsCount = 4, rows = 8, columns = 4 }) {
  return (
    <div>
      {title && (
        <Skeleton style={{ width: 180, height: 28, borderRadius: 6, marginBottom: '1.5rem' }} />
      )}
      {showStats && <KpiGridSkeleton count={statsCount} />}
      <SearchBarSkeleton />
      <TableSkeleton rows={rows} columns={columns} />
    </div>
  )
}
