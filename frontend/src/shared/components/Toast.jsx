import { useCallback, useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useUIStore } from '../../stores/ui-store.js'
import { Icon, icons } from '../icons.jsx'

const typeStyles = {
  success: { borderColor: 'var(--slogbaa-green)', icon: icons.enrolled, iconColor: 'var(--slogbaa-green)' },
  error: { borderColor: 'var(--slogbaa-error)', icon: icons.close, iconColor: 'var(--slogbaa-error)' },
  info: { borderColor: 'var(--slogbaa-blue)', icon: icons.eye, iconColor: 'var(--slogbaa-blue)' },
  warning: { borderColor: 'var(--slogbaa-orange)', icon: icons.blockActivity, iconColor: 'var(--slogbaa-orange)' },
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 2500,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxWidth: 380,
    width: 'calc(100% - 2.5rem)',
    pointerEvents: 'none',
  },
  toast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.875rem 1.25rem',
    borderRadius: 14,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow-lg)',
    borderLeft: '4px solid',
    pointerEvents: 'auto',
    animation: 'toast-slide-in 0.25s ease-out',
  },
  message: {
    flex: 1,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.45,
    margin: 0,
  },
  dismissBtn: {
    flexShrink: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'var(--slogbaa-text-muted)',
    padding: '0.5rem',
    minWidth: 44,
    minHeight: 44,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  actionBtn: {
    padding: '0.25rem 0.6rem',
    border: '1px solid var(--slogbaa-blue)',
    borderRadius: 6,
    background: 'transparent',
    color: 'var(--slogbaa-blue)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
}

function ToastItem({ toast, onRemove }) {
  const timerRef = useRef(null)
  const remainingRef = useRef(toast.duration > 0 ? toast.duration : 0)
  const startRef = useRef(Date.now())

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback((ms) => {
    if (ms <= 0) return
    clearTimer()
    startRef.current = Date.now()
    remainingRef.current = ms
    timerRef.current = setTimeout(() => onRemove(toast.id), ms)
  }, [clearTimer, onRemove, toast.id])

  useEffect(() => {
    if (toast.duration > 0) startTimer(toast.duration)
    return clearTimer
  }, [toast.duration, startTimer, clearTimer])

  const handleMouseEnter = () => {
    if (remainingRef.current <= 0) return
    const elapsed = Date.now() - startRef.current
    remainingRef.current = Math.max(remainingRef.current - elapsed, 0)
    clearTimer()
  }

  const handleMouseLeave = () => {
    if (remainingRef.current > 0) startTimer(remainingRef.current)
  }

  const ts = typeStyles[toast.type] || typeStyles.info

  return (
    <div
      style={{ ...styles.toast, borderLeftColor: ts.borderColor }}
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <Icon icon={ts.icon} size={18} style={{ color: ts.iconColor, marginTop: 1, flexShrink: 0 }} />
      <p style={styles.message}>{toast.message}</p>
      {toast.action && (
        <button
          type="button"
          style={styles.actionBtn}
          onClick={() => {
            toast.action.onClick?.()
            onRemove(toast.id)
          }}
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        style={styles.dismissBtn}
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
      >
        <Icon icon={icons.close} size={14} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useUIStore(useShallow((s) => s.toasts))
  const removeToast = useUIStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div style={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}
