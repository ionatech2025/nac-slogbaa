import { Icon, icons } from '../icons.jsx'

const styles = {
  wrap: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'rgba(185, 28, 28, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  title: {
    margin: '0 0 0.35rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  message: {
    margin: '0 0 1.25rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.1rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
}

/**
 * Inline error display with retry button.
 * Drop-in for query error states — replaces plain error text.
 */
export function QueryError({ error, onRetry, message }) {
  return (
    <div style={styles.wrap} role="alert">
      <div style={styles.icon}>
        <Icon icon={icons.close} size={22} style={{ color: 'var(--slogbaa-error)' }} />
      </div>
      <p style={styles.title}>{message || 'Something went wrong'}</p>
      <p style={styles.message}>{error?.message || 'Please try again.'}</p>
      {onRetry && (
        <button type="button" style={styles.btn} onClick={onRetry}>
          <Icon icon={icons.updateCourses} size={14} /> Try again
        </button>
      )}
    </div>
  )
}
