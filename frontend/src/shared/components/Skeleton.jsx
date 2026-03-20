/**
 * Skeleton primitive — animated shimmer placeholder for loading states.
 * Uses gradient sweep animation inspired by Facebook/Notion skeleton loaders.
 */
const baseStyle = {
  background: 'linear-gradient(90deg, var(--slogbaa-border) 25%, var(--slogbaa-bg-secondary) 50%, var(--slogbaa-border) 75%)',
  backgroundSize: '200% 100%',
  borderRadius: 10,
  animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
}

export function Skeleton({ width, height = 16, rounded, style, ...rest }) {
  return (
    <div
      style={{
        ...baseStyle,
        width: width ?? '100%',
        height,
        borderRadius: rounded ? '50%' : 8,
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    />
  )
}

export function SkeletonText({ lines = 3, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height={12}
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}
