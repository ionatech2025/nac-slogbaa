/**
 * Badge primitive — small label for status, counts, tags.
 */
const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: '0.2rem 0.55rem',
  borderRadius: 6,
  fontSize: '0.75rem',
  fontWeight: 600,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
}

const variants = {
  default: {
    background: 'var(--slogbaa-bg-secondary)',
    color: 'var(--slogbaa-text-muted)',
  },
  primary: {
    background: 'rgba(37, 99, 235, 0.08)',
    color: 'var(--slogbaa-blue)',
  },
  success: {
    background: 'rgba(5, 150, 105, 0.08)',
    color: 'var(--slogbaa-green)',
  },
  danger: {
    background: 'rgba(220, 38, 38, 0.08)',
    color: 'var(--slogbaa-error)',
  },
  info: {
    background: 'rgba(37, 99, 235, 0.08)',
    color: 'var(--slogbaa-blue)',
  },
  warm: {
    background: 'rgba(217, 119, 6, 0.08)',
    color: 'var(--slogbaa-blue)',
  },
}

export function Badge({ variant = 'default', style, children, ...rest }) {
  return (
    <span style={{ ...baseStyle, ...variants[variant], ...style }} {...rest}>
      {children}
    </span>
  )
}
