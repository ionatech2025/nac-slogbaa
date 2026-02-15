import { useEffect } from 'react'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  dialog: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 12,
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    border: '1px solid var(--slogbaa-border)',
    maxWidth: 400,
    width: '100%',
    padding: '1.25rem 1.5rem',
  },
  message: {
    margin: '0 0 1.25rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.45,
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  btn: {
    padding: '0.5rem 1rem',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
  },
  btnCancel: {
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
  },
  btnContinue: {
    background: 'var(--slogbaa-orange)',
    color: '#fff',
  },
}

/**
 * Small confirmation popup with "Cancel" and "Continue" buttons.
 * @param {string} message - Text to show
 * @param {() => void} onContinue - Called when user clicks Continue
 * @param {() => void} onCancel - Called when user clicks Cancel or clicks overlay
 */
export function ConfirmModal({ message, onContinue, onCancel }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onCancel])

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
      role="dialog"
      aria-modal="true"
      aria-label="Confirmation"
    >
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button type="button" style={{ ...styles.btn, ...styles.btnCancel }} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" style={{ ...styles.btn, ...styles.btnContinue }} onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
