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
  /* Primary: solid orange, white text (Sign In, Update Password) */
  primary: {
    background: 'var(--primary-orange, #F58220)',
    color: 'var(--primary-white, #FFFFFF)',
  },
  /* Secondary: white background, orange text and border (Edit Profile) */
  secondary: {
    background: 'var(--primary-white, #FFFFFF)',
    color: 'var(--primary-orange, #F58220)',
    border: '1px solid var(--primary-orange, #F58220)',
  },
  danger: {
    background: 'rgba(237, 28, 36, 0.08)',
    color: 'var(--slogbaa-error)',
    border: '1px solid var(--slogbaa-error)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--slogbaa-text)',
  },
  accent: {
    background: 'var(--success-green, #00A651)',
    color: '#fff',
  },
  warm: {
    background: 'var(--primary-orange, #F58220)',
    color: 'var(--primary-white, #FFFFFF)',
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
