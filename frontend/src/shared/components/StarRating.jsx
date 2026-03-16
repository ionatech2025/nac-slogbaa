import { useState, useCallback } from 'react'

const starStyles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
  },
  star: {
    cursor: 'pointer',
    fontSize: '1.5rem',
    lineHeight: 1,
    transition: 'transform 0.15s ease',
    background: 'none',
    border: 'none',
    padding: '2px',
    color: 'inherit',
  },
  starReadOnly: {
    fontSize: '1.25rem',
    lineHeight: 1,
    padding: '1px',
  },
  label: {
    marginLeft: '0.5rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
}

const FILLED = '#f59e0b'
const EMPTY = 'var(--slogbaa-border)'

/**
 * StarRating component.
 * - Interactive mode (readOnly=false): click to set rating, hover preview.
 * - Read-only mode (readOnly=true): displays rating with half-star support.
 *
 * Props:
 *   value       - current rating (number, can be fractional for read-only)
 *   onChange     - callback(newRating) when star is clicked
 *   readOnly    - if true, shows static stars (default false)
 *   showLabel   - if true, shows numeric label next to stars (default false)
 *   size        - 'sm' | 'md' | 'lg' (default 'md')
 */
export function StarRating({ value = 0, onChange, readOnly = false, showLabel = false, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0)

  const fontSize = size === 'sm' ? '1rem' : size === 'lg' ? '1.75rem' : readOnly ? '1.25rem' : '1.5rem'

  const handleMouseEnter = useCallback((star) => {
    if (!readOnly) setHoverRating(star)
  }, [readOnly])

  const handleMouseLeave = useCallback(() => {
    if (!readOnly) setHoverRating(0)
  }, [readOnly])

  const handleClick = useCallback((star) => {
    if (!readOnly && onChange) onChange(star)
  }, [readOnly, onChange])

  const displayValue = hoverRating || value

  if (readOnly) {
    return (
      <span style={starStyles.container} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = displayValue >= star ? 'full' : displayValue >= star - 0.5 ? 'half' : 'empty'
          return (
            <span
              key={star}
              style={{ ...starStyles.starReadOnly, fontSize, position: 'relative', display: 'inline-block', width: '1em', height: '1em' }}
            >
              {/* Empty star background */}
              <span style={{ color: EMPTY, position: 'absolute', top: 0, left: 0 }}>&#9733;</span>
              {/* Filled overlay */}
              {fill !== 'empty' && (
                <span
                  style={{
                    color: FILLED,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    width: fill === 'half' ? '0.5em' : '1em',
                  }}
                >
                  &#9733;
                </span>
              )}
            </span>
          )
        })}
        {showLabel && <span style={starStyles.label}>{value.toFixed(1)}</span>}
      </span>
    )
  }

  return (
    <span style={starStyles.container} onMouseLeave={handleMouseLeave} role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          style={{
            ...starStyles.star,
            fontSize,
            color: displayValue >= star ? FILLED : EMPTY,
            transform: hoverRating === star ? 'scale(1.2)' : 'scale(1)',
          }}
          onMouseEnter={() => handleMouseEnter(star)}
          onClick={() => handleClick(star)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          aria-checked={value === star}
          role="radio"
        >
          &#9733;
        </button>
      ))}
      {showLabel && value > 0 && <span style={starStyles.label}>{value} / 5</span>}
    </span>
  )
}
