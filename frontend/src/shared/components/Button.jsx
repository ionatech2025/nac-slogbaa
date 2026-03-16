import { forwardRef } from 'react'

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  padding: '0.55rem 1.1rem',
  border: 'none',
  borderRadius: 10,
  fontSize: '0.9375rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'background 0.15s, opacity 0.15s, box-shadow 0.15s',
  lineHeight: 1.4,
}

const variants = {
  primary: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
  },
  secondary: {
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
  },
  danger: {
    background: 'rgba(220, 38, 38, 0.06)',
    color: 'var(--slogbaa-error)',
    border: '1px solid var(--slogbaa-error)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--slogbaa-text)',
  },
  accent: {
    background: 'var(--slogbaa-green)',
    color: '#fff',
  },
  warm: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
  },
}

const sizes = {
  sm: { padding: '0.5rem 0.75rem', fontSize: '0.8125rem', minHeight: 36 },
  md: { minHeight: 44 },
  lg: { padding: '0.75rem 1.5rem', fontSize: '1rem', minHeight: 48 },
}

/**
 * Design system Button primitive.
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'|'accent'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', disabled, style, children, ...rest },
  ref
) {
  const combined = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : {}),
    ...style,
  }
  return (
    <button ref={ref} type="button" disabled={disabled} style={combined} {...rest}>
      {children}
    </button>
  )
})
