import { forwardRef } from 'react'
import { Icon } from '../icons.jsx'

const baseStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1px solid var(--slogbaa-border)',
  borderRadius: 10,
  fontSize: '0.9375rem',
  color: 'var(--slogbaa-text)',
  background: 'var(--slogbaa-bg)',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  lineHeight: 1.5,
}

const errorBorder = {
  borderColor: 'var(--slogbaa-error)',
}

const wrapStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
}

const iconStyle = {
  position: 'absolute',
  left: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--slogbaa-text-muted)',
  pointerEvents: 'none',
  flexShrink: 0,
}

/**
 * Design system Input primitive.
 *
 * @param {object}  icon         - Lucide icon component (leading icon inside input)
 * @param {boolean} hasError     - show error border
 * @param {string}  errorMessage - optional error text below input
 */
export const Input = forwardRef(function Input(
  { icon, hasError, errorMessage, style, ...rest },
  ref
) {
  const inputPadding = icon ? { paddingLeft: '2.5rem' } : {}

  return (
    <div>
      <div style={icon ? wrapStyle : undefined}>
        {icon && <Icon icon={icon} size={16} style={iconStyle} aria-hidden="true" />}
        <input
          ref={ref}
          style={{
            ...baseStyle,
            ...inputPadding,
            ...(hasError ? errorBorder : {}),
            ...style,
          }}
          aria-invalid={hasError || undefined}
          aria-describedby={errorMessage ? `${rest.id || rest.name}-error` : undefined}
          {...rest}
        />
      </div>
      {errorMessage && (
        <p
          id={`${rest.id || rest.name}-error`}
          role="alert"
          style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-error)' }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
})
