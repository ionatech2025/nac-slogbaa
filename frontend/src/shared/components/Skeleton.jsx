/**
 * Skeleton primitive — animated placeholder for loading states.
 * Inspired by Shadcn skeleton pattern.
 */
const baseStyle = {
  background: 'var(--slogbaa-border)',
  borderRadius: 10,
  animation: 'skeleton-pulse 1.5s ease-in-out infinite',
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
