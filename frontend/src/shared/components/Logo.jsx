/**
 * SLOGBAA Logo System — 2026 Design
 *
 * Variants:
 *   "icon"       — Square icon mark only (navbars, favicons, small contexts)
 *   "full"       — Icon + "SLOGBAA" wordmark horizontal (login, hero)
 *   "wordmark"   — Text-only "SLOGBAA" (ultra-compact spaces)
 *
 * Props:
 *   variant   — "icon" | "full" | "wordmark"  (default "full")
 *   size      — height in px (default 32)
 *   className — optional CSS class
 *   style     — optional inline styles
 *   color     — "auto" (theme-aware) | "white" | "blue" | "dark"
 *   subtitle  — optional sub-text after wordmark (e.g. "Admin", "Learning")
 */

const COLORS = {
  white: { text: '#ffffff', subtitleText: 'rgba(255,255,255,0.7)' },
  blue: { text: 'var(--slogbaa-blue)', subtitleText: 'var(--slogbaa-text-muted)' },
  dark: { text: 'var(--slogbaa-text)', subtitleText: 'var(--slogbaa-text-muted)' },
  auto: { text: 'currentColor', subtitleText: 'currentColor' },
}

function LogoIcon({ size = 32 }) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id="slogbaa-bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="slogbaa-accent" x1="160" y1="128" x2="352" y2="384" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#slogbaa-bg)" />
      <path
        d="M256 120c-48 0-96 16-128 44v8c32-24 80-36 128-36s96 12 128 36v-8c-32-28-80-44-128-44z"
        fill="rgba(255,255,255,0.25)"
      />
      <path
        d="M310 168c-40-16-88-8-112 24s-16 72 16 96 72 28 96 8"
        stroke="url(#slogbaa-accent)"
        strokeWidth="36"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M202 344c40 16 88 8 112-24s16-72-16-96"
        stroke="url(#slogbaa-accent)"
        strokeWidth="36"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M310 168l-4-32 28 20"
        stroke="#ffffff"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function Logo({
  variant = 'full',
  size = 32,
  className,
  style,
  color = 'auto',
  subtitle,
}) {
  const palette = COLORS[color] || COLORS.auto

  if (variant === 'icon') {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
        <LogoIcon size={size} />
      </span>
    )
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: size * 0.2,
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif",
          ...style,
        }}
      >
        <span
          style={{
            fontSize: size * 0.75,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: palette.text,
            lineHeight: 1,
          }}
        >
          SLOGBAA
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: size * 0.4,
              fontWeight: 500,
              color: palette.subtitleText,
              opacity: 0.7,
              lineHeight: 1,
            }}
          >
            {subtitle}
          </span>
        )}
      </span>
    )
  }

  // variant === 'full' — icon + wordmark
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.35,
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif",
        textDecoration: 'none',
        ...style,
      }}
    >
      <LogoIcon size={size} />
      <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          style={{
            fontSize: size * 0.6,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: palette.text,
            lineHeight: 1.1,
          }}
        >
          SLOGBAA
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: size * 0.3,
              fontWeight: 500,
              color: palette.subtitleText,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              marginTop: size * 0.04,
            }}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  )
}
