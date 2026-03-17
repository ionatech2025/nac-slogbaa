import { useState, useEffect } from 'react'
import { icons } from '../icons.jsx'

const SHIMMER_DELAY_MS = 500

const loadingOverrides = {
  opacity: 0.8,
  cursor: 'not-allowed',
}

/**
 * Reusable button that shows a loading state for async actions.
 * - When loading: disabled, 0.8 opacity, Loader2 icon with spin animation.
 * - After 500ms loading: subtle shimmer (skeleton wave) across the button.
 * - Smooth transition (300ms) on width and background.
 */
export function LoadingButton({
  loading = false,
  disabled = false,
  children,
  type = 'button',
  onClick,
  style = {},
  className = '',
  ...rest
}) {
  const [showShimmer, setShowShimmer] = useState(false)

  useEffect(() => {
    if (!loading) {
      setShowShimmer(false)
      return
    }
    const t = setTimeout(() => setShowShimmer(true), SHIMMER_DELAY_MS)
    return () => clearTimeout(t)
  }, [loading])

  const isDisabled = disabled || loading
  const mergedStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    ...style,
    ...(isDisabled ? loadingOverrides : {}),
    ...(showShimmer ? { position: 'relative', zIndex: 1 } : {}),
  }

  const wrapperStyle = {
    display: 'inline-flex',
    position: 'relative',
  }

  return (
    <span
      className={showShimmer ? 'loading-button-shimmer-wrap' : ''}
      style={wrapperStyle}
    >
      <button
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        style={mergedStyle}
        className={className}
        aria-busy={loading}
        aria-disabled={isDisabled}
        aria-label={loading ? 'Processing…' : undefined}
        {...rest}
      >
        {loading ? (
          <>
            <icons.loader size={20} className="loading-button-spin" style={{ flexShrink: 0 }} />
            <span className="sr-only">Processing, please wait…</span>
          </>
        ) : (
          children
        )}
      </button>
    </span>
  )
}
