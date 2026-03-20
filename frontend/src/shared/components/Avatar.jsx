/**
 * Avatar primitive — circular image with initials fallback.
 * Inspired by Linear/Notion avatar patterns.
 */
function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

const sizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
}

export function Avatar({ src, name, size = 'md', style, ...rest }) {
  const px = sizes[size] || size
  const fontSize = px * 0.38

  const base = {
    width: px,
    height: px,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style,
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        style={{ ...base, objectFit: 'cover' }}
        {...rest}
      />
    )
  }

  return (
    <div
      style={{
        ...base,
        background: 'linear-gradient(135deg, var(--slogbaa-primary) 0%, var(--slogbaa-success) 100%)',
        color: '#fff',
        fontWeight: 700,
        fontSize,
        letterSpacing: '-0.02em',
      }}
      aria-label={name || 'User avatar'}
      {...rest}
    >
      {getInitials(name)}
    </div>
  )
}
