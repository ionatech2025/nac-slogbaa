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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, minHeight: 220 }}>
      {/* Sub-header (course title + progress) */}
      <div
        style={{
          padding: '1rem 0',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--slogbaa-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Skeleton height={56} width={56} style={{ borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton height={12} width={100} />
            <Skeleton height={22} width="55%" />
            <Skeleton height={12} width="85%" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton height={44} width={44} style={{ borderRadius: '50%', flexShrink: 0 }} />
          <Skeleton height={14} width={120} />
        </div>
      </div>

      {/* TOC + lesson column */}
      <div style={{ display: 'flex', gap: 0, flex: 1, minHeight: 0, alignItems: 'stretch' }}>
        <div
          style={{
            flex: '0 0 300px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingRight: '1rem',
            borderRight: '1px solid var(--slogbaa-border)',
          }}
        >
          <Skeleton height={14} width="70%" style={{ marginBottom: 4 }} />
          <Skeleton height={28} width="100%" style={{ borderRadius: 8 }} />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem', borderRadius: 10, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)' }}>
              <Skeleton height={30} width={30} style={{ borderRadius: '50%', flexShrink: 0 }} />
              <Skeleton height={14} width={i === 0 ? '75%' : `${60 + i * 5}%`} />
            </div>
          ))}
        </div>
        <div style={{ flex: '1 1 0', minWidth: 0, paddingLeft: '1.25rem', overflow: 'hidden' }}>
          <Skeleton height={28} width="50%" style={{ marginBottom: 16 }} />
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
