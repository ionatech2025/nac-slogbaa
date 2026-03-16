import { useEffect, useRef, useId, useCallback } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(12px) saturate(150%)',
    WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  dialog: {
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    borderRadius: 20,
    boxShadow: 'var(--slogbaa-glass-shadow-lg), var(--slogbaa-glass-highlight)',
    border: '1px solid var(--slogbaa-glass-border)',
    maxWidth: 400,
    width: '100%',
    padding: '1.5rem 1.75rem',
    animation: 'glass-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
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
    padding: '0.55rem 1.1rem',
    borderRadius: 10,
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.15s, box-shadow 0.15s',
  },
  btnCancel: {
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
  },
  btnContinue: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
  },
}

/**
 * Small confirmation popup with "Cancel" and "Continue" buttons.
 * Includes focus trap, return-focus, Escape handling, and unique aria IDs.
 */
export function ConfirmModal({ message, onContinue, onCancel }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const labelId = useId()

  // Save previously focused element and restore on unmount
  useEffect(() => {
    previousFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus?.()
    }
  }, [])

  // Auto-focus the Cancel button (safe default)
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const cancelBtn = el.querySelector('button')
    if (cancelBtn) cancelBtn.focus()
    else el.focus()
  }, [])

  // Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  // Focus trap
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
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <div
        ref={dialogRef}
        style={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
      >
        <p id={labelId} style={styles.message}>{message}</p>
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
