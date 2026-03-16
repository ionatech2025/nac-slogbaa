/**
 * Card primitive — consistent container with surface, border, shadow.
 * Inspired by Shadcn/Radix card pattern.
 */
const baseStyle = {
  background: 'var(--slogbaa-glass-bg)',
  backdropFilter: 'var(--slogbaa-glass-blur)',
  WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
  borderRadius: 18,
  border: '1px solid var(--slogbaa-glass-border)',
  boxShadow: 'var(--slogbaa-glass-shadow)',
  overflow: 'hidden',
  transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
}

const paddings = {
  none: {},
  sm: { padding: '1rem' },
  md: { padding: '1.5rem 1.75rem' },
  lg: { padding: '2rem 2.25rem' },
}

export function Card({ padding = 'md', style, children, ...rest }) {
  return (
    <div style={{ ...baseStyle, ...paddings[padding], ...style }} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ style, children }) {
  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      {children}
    </div>
  )
}

export function CardTitle({ as: Tag = 'h3', style, children }) {
  return (
    <Tag style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--slogbaa-text)', ...style }}>
      {children}
    </Tag>
  )
}
