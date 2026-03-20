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

export function CourseDetailSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Back link placeholder */}
      <Skeleton height={14} width={120} />

      {/* Header: image + title area */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <Skeleton height={80} width={120} style={{ borderRadius: 8, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={22} width="60%" />
          <Skeleton height={14} width="80%" />
        </div>
      </div>

      {/* Content: sidebar + article */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Sidebar — module list */}
        <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)' }}>
              <Skeleton height={36} width={36} style={{ borderRadius: 6, flexShrink: 0 }} />
              <Skeleton height={14} width={i === 0 ? '70%' : `${55 + i * 5}%`} />
            </div>
          ))}
        </div>

        {/* Article area — text lines */}
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <Skeleton height={20} width="45%" style={{ marginBottom: 12 }} />
          <SkeletonText lines={4} style={{ marginBottom: 20 }} />
          <SkeletonText lines={3} style={{ marginBottom: 20 }} />
          <SkeletonText lines={5} />
        </div>
      </div>
    </div>
  )
}

export function LibraryListSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ padding: '1rem 1.25rem', borderRadius: 16, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)' }}>
          <Skeleton height={16} width={i === 0 ? '40%' : `${30 + i * 5}%`} style={{ marginBottom: 8 }} />
          <Skeleton height={11} width={100} style={{ marginBottom: 10 }} />
          <Skeleton height={12} width="85%" style={{ marginBottom: 6 }} />
          <Skeleton height={12} width="60%" style={{ marginBottom: 12 }} />
          <Skeleton height={14} width={130} />
        </div>
      ))}
    </div>
  )
}
