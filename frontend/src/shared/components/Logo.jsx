import { useId } from 'react'

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

function LogoIcon({ size = 32, standalone = false }) {
  const uid = useId()
  const bgId = `slogbaa-bg-${uid}`
  const accentId = `slogbaa-accent-${uid}`

  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={standalone ? 'img' : undefined}
      aria-label={standalone ? 'SLOGBAA' : undefined}
      aria-hidden={standalone ? undefined : true}
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--slogbaa-orange, #F58220)" />
          <stop offset="100%" stopColor="var(--slogbaa-orange-hover, #e07318)" />
        </linearGradient>
        <linearGradient id={accentId} x1="180" y1="160" x2="332" y2="352" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffe8d4" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill={`url(#${bgId})`} />
      <path
        d="M256 148c-40 0-80 13-108 37v7c28-20 68-30 108-30s80 10 108 30v-7c-28-24-68-37-108-37z"
        fill="rgba(255,255,255,0.25)"
      />
      <path
        d="M300 192c-36-14-78-7-100 21s-14 64 14 85 64 25 85 7"
        stroke={`url(#${accentId})`}
        strokeWidth="34"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M212 320c36 14 78 7 100-21s14-64-14-85"
        stroke={`url(#${accentId})`}
        strokeWidth="34"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M300 192l-3-28 24 17"
        stroke="#ffffff"
        strokeWidth="22"
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
        <LogoIcon size={size} standalone />
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
