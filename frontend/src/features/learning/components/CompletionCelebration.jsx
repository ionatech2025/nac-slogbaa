import { useEffect, useRef, useCallback, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
const AUTO_DISMISS_MS = 30_000
const CONFETTI_COUNT = 40
const CONFETTI_COLORS = [
  '#F58220', '#fb923c', '#00A651', '#4ade80',
  '#d97706', '#fbbf24', '#dc2626', '#f87171',
  '#8b5cf6', '#a78bfa', '#ec4899', '#f472b6',
]

/* ------------------------------------------------------------------ */
/*  Confetti CSS keyframes (injected once)                            */
/* ------------------------------------------------------------------ */
let styleInjected = false
function injectConfettiStyles() {
  if (styleInjected) return
  styleInjected = true
  const css = `
@keyframes celebration-confetti {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--confetti-x), var(--confetti-y)) rotate(var(--confetti-rot)) scale(0.3);
    opacity: 0;
  }
}
@keyframes celebration-overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes celebration-card-in {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes celebration-badge-pop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
`
  const el = document.createElement('style')
  el.textContent = css
  document.head.appendChild(el)
}

/* ------------------------------------------------------------------ */
/*  Confetti pieces (deterministic random for SSR-safety)             */
/* ------------------------------------------------------------------ */
function buildConfetti() {
  const pieces = []
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const angle = (i / CONFETTI_COUNT) * 360
    const rad = (angle * Math.PI) / 180
    const dist = 120 + (i % 7) * 30
    const x = Math.cos(rad) * dist
    const y = Math.sin(rad) * dist - 60
    const rot = (i % 2 === 0 ? 1 : -1) * (180 + (i % 5) * 72)
    const size = 6 + (i % 4) * 2
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    const delay = (i % 8) * 0.06
    const duration = 2 + (i % 3) * 0.4
    pieces.push({ x, y, rot, size, color, delay, duration })
  }
  return pieces
}

const confettiPieces = buildConfetti()

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(16px) saturate(150%)',
    WebkitBackdropFilter: 'blur(16px) saturate(150%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: '1.5rem',
    animation: 'celebration-overlay-in 0.3s ease both',
  },
  dialog: {
    position: 'relative',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    borderRadius: 24,
    boxShadow: 'var(--slogbaa-glass-shadow-lg), var(--slogbaa-glass-highlight)',
    border: '1px solid var(--slogbaa-glass-border)',
    maxWidth: 460,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'celebration-card-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
    textAlign: 'center',
    padding: '2.5rem 2rem 2rem',
  },
  confettiContainer: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    width: 0,
    height: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  confettiPiece: (piece) => ({
    position: 'absolute',
    width: piece.size,
    height: piece.size,
    borderRadius: piece.size > 8 ? 2 : 1,
    background: piece.color,
    animation: `celebration-confetti ${piece.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${piece.delay}s both`,
    '--confetti-x': `${piece.x}px`,
    '--confetti-y': `${piece.y}px`,
    '--confetti-rot': `${piece.rot}deg`,
  }),
  iconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'rgba(52, 211, 153, 0.12)',
    border: '2px solid rgba(52, 211, 153, 0.35)',
    marginBottom: '1rem',
    animation: 'celebration-badge-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    position: 'relative',
    zIndex: 1,
  },
  courseTitle: {
    margin: '0 0 1rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
    position: 'relative',
    zIndex: 1,
  },
  message: {
    margin: '0 0 1.25rem',
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text-muted)',
    position: 'relative',
    zIndex: 1,
  },
  badgeNotification: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: 999,
    background: 'rgba(217, 119, 6, 0.1)',
    border: '1px solid rgba(217, 119, 6, 0.3)',
    color: 'var(--slogbaa-orange)',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    position: 'relative',
    zIndex: 1,
    animation: 'celebration-badge-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 1,
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    borderRadius: 12,
    border: '1px solid transparent',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    minWidth: 44,
    minHeight: 44,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'var(--slogbaa-text-muted)',
    borderRadius: 8,
    zIndex: 2,
  },
}

export function CompletionCelebration({ courseTitle, onClose }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const titleId = useId()
  const navigate = useNavigate()

  // Inject keyframe styles once
  useEffect(() => { injectConfettiStyles() }, [])

  // Save focus, lock scroll, restore on unmount
  useEffect(() => {
    previousFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus?.()
    }
  }, [])

  // Auto-focus first focusable inside dialog
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const first = el.querySelector(FOCUSABLE)
    if (first) first.focus()
    else el.focus()
  }, [])

  // Escape to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Auto-dismiss after 30s
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [onClose])

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

  const handleViewCertificate = () => {
    onClose?.()
    navigate('/dashboard')
  }

  const handleContinueLearning = () => {
    onClose?.()
    navigate('/dashboard/courses')
  }

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={dialogRef}
        style={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          type="button"
          style={styles.closeBtn}
          onClick={onClose}
          aria-label="Close celebration dialog"
        >
          <Icon icon={icons.close} size="1.25em" />
        </button>

        {/* Confetti burst */}
        <div style={styles.confettiContainer} aria-hidden="true">
          {confettiPieces.map((piece, i) => (
            <div key={i} style={styles.confettiPiece(piece)} />
          ))}
        </div>

        {/* Icon */}
        <div style={styles.iconWrap}>
          <Icon icon={icons.partyPopper} size="1.75em" style={{ color: 'var(--slogbaa-green)' }} />
        </div>

        {/* Copy */}
        <h2 id={titleId} style={styles.title}>
          Congratulations!
        </h2>
        <p style={styles.courseTitle}>{courseTitle}</p>
        <p style={styles.message}>
          You have successfully completed all modules in this course. Your dedication and hard work have paid off!
        </p>

        {/* Badge / XP notification */}
        <div style={styles.badgeNotification}>
          <Icon icon={icons.certificate} size="1em" />
          <span>Course completion badge earned!</span>
        </div>

        {/* Actions */}
        <div style={styles.buttons}>
          <button
            type="button"
            style={styles.btnPrimary}
            onClick={handleViewCertificate}
          >
            <Icon icon={icons.certificate} size="1em" />
            View Certificate
          </button>
          <button
            type="button"
            style={styles.btnGhost}
            onClick={handleContinueLearning}
          >
            Continue Learning
            <Icon icon={icons.arrowRight} size="1em" />
          </button>
        </div>
      </div>
    </div>
  )
}
