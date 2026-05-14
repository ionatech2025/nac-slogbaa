
/**
 * SLOGBAA Logo System — 2026 Design
 * 
 * Updated to use official branding from /logo.svg and /favicon.svg
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
 *   color     — "auto" (theme-aware) | "white" | "blue" | "dark" (Note: images may ignore this)
 *   subtitle  — optional sub-text after wordmark (e.g. "Admin", "Learning")
 */

const COLORS = {
  white: { text: '#ffffff', subtitleText: 'rgba(255,255,255,0.7)' },
  blue: { text: 'var(--slogbaa-blue)', subtitleText: 'var(--slogbaa-text-muted)' },
  dark: { text: 'var(--slogbaa-text)', subtitleText: 'var(--slogbaa-text-muted)' },
  auto: { text: 'currentColor', subtitleText: 'currentColor' },
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
      <img 
        src="/favicon.svg" 
        alt="SLOGBAA Icon"
        height={size}
        width={size}
        className={className}
        style={{ display: 'block', flexShrink: 0, ...style }}
      />
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

  // variant === 'full' — using logo.svg
  // Since logo.svg includes "SLOGBAA" text, we just render the image.
  // If a subtitle is provided, we render it next to the logo image.
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.35,
        ...style,
      }}
    >
      <img 
        src="/logo.svg" 
        alt="SLOGBAA Logo"
        height={size}
        style={{ display: 'block', width: 'auto' }}
      />
      {subtitle && (
        <span 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            borderLeft: `1px solid ${palette.subtitleText}`,
            paddingLeft: size * 0.35,
            marginLeft: size * 0.1,
            height: size * 0.8
          }}
        >
          <span
            style={{
              fontSize: size * 0.45,
              fontWeight: 600,
              color: palette.text,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif",
            }}
          >
            {subtitle}
          </span>
        </span>
      )}
    </span>
  )
}
