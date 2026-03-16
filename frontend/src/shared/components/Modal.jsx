import { useEffect, useRef, useId, useCallback } from 'react'
import { FontAwesomeIcon, icons } from '../icons.jsx'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1.5rem',
  },
  dialog: (maxWidth = 480) => ({
    background: 'var(--slogbaa-surface)',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
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
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const titleId = useId()

  // Save previously focused element and restore on unmount
  useEffect(() => {
    previousFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus?.()
    }
  }, [])

  // Auto-focus first focusable element inside dialog
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const first = el.querySelector(FOCUSABLE)
    if (first) first.focus()
    else el.focus()
  }, [])

  // Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Focus trap — Tab / Shift+Tab cycle within dialog
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Tab') return
    const el = dialogRef.current
    if (!el) return
    const focusable = [...el.querySelectorAll(FOCUSABLE)]
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={dialogRef}
        style={typeof styles.dialog === 'function' ? styles.dialog(maxWidth) : styles.dialog}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        <div style={styles.header}>
          {title ? <h2 id={titleId} style={styles.title}>{title}</h2> : <span style={{ flex: 1 }} />}
          {showClose && (
            <button
              type="button"
              style={styles.closeBtn}
              onClick={onClose}
              aria-label="Close dialog"
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
