import { useEffect } from 'react'
import { FontAwesomeIcon, icons } from '../icons.js'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1.5rem',
  },
  dialog: (maxWidth = 480) => ({
    background: 'var(--slogbaa-surface)',
    borderRadius: 12,
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    border: '1px solid var(--slogbaa-border)',
    maxWidth,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  closeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.35rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '1.25rem',
    borderRadius: 4,
  },
  body: {
    padding: '1.5rem',
  },
}

export function Modal({ title, onClose, children, showClose = true, maxWidth = 480 }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div style={typeof styles.dialog === 'function' ? styles.dialog(maxWidth) : styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          {title ? <h2 id="modal-title" style={styles.title}>{title}</h2> : <span style={{ flex: 1 }} />}
          {showClose && (
            <button
              type="button"
              style={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              <FontAwesomeIcon icon={icons.close} />
            </button>
          )}
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  )
}
