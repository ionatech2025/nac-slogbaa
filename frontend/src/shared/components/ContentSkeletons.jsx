import { Skeleton, SkeletonText } from './Skeleton.jsx'

/**
 * Content-shaped skeletons matching actual page layouts.
 * 2026 standard: users see layout shape, not just a spinner.
 */

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ borderRadius: 12, border: '1px solid var(--slogbaa-border)', overflow: 'hidden', background: 'var(--slogbaa-surface)' }}>
          <Skeleton height={160} style={{ borderRadius: 0 }} />
          <div style={{ padding: '1rem 1.25rem' }}>
            <Skeleton height={18} width="70%" style={{ marginBottom: 10 }} />
            <Skeleton height={12} width="90%" style={{ marginBottom: 6 }} />
            <Skeleton height={12} width="50%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div style={{ borderRadius: 12, border: '1px solid var(--slogbaa-border)', overflow: 'hidden', background: 'var(--slogbaa-surface)' }}>
      <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--slogbaa-border)', display: 'flex', gap: '2rem' }}>
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} height={12} width={i === 0 ? '25%' : '15%'} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ padding: '0.875rem 1.25rem', borderBottom: i < rows - 1 ? '1px solid var(--slogbaa-border)' : 'none', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {Array.from({ length: cols }, (_, j) => (
            <Skeleton key={j} height={14} width={j === 0 ? '30%' : '18%'} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ flex: '1 1 140px', padding: '1rem 1.25rem', borderRadius: 12, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', textAlign: 'center' }}>
          <Skeleton height={28} width={48} style={{ margin: '0 auto 8px' }} />
          <Skeleton height={10} width={64} style={{ margin: '0 auto' }} />
        </div>
      ))}
    </div>
  )
}
