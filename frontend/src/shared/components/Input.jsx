import { forwardRef } from 'react'

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

/**
 * Design system Input primitive.
 *
 * @param {boolean} hasError - show error border
 * @param {string} errorMessage - optional error text below input
 */
export const Input = forwardRef(function Input(
  { hasError, errorMessage, style, ...rest },
  ref
) {
  return (
    <div>
      <input
        ref={ref}
        style={{
          ...baseStyle,
          ...(hasError ? errorBorder : {}),
          ...style,
        }}
        aria-invalid={hasError || undefined}
        aria-describedby={errorMessage ? `${rest.id || rest.name}-error` : undefined}
        {...rest}
      />
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
