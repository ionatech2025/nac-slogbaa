import { useState, useEffect } from 'react'
import { Icon, icons } from '../icons.jsx'

/**
 * Offline indicator banner.
 * Listens to navigator.onLine + online/offline window events and shows a
 * subtle top banner when the browser loses connectivity. Slides in/out with
 * a CSS transition and auto-hides when the connection is restored.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  // Controls whether the DOM node is mounted (delayed removal for exit animation)
  const [mounted, setMounted] = useState(!navigator.onLine)
  // Controls the CSS translate for slide-in / slide-out
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const goOffline = () => {
      setIsOffline(true)
      setMounted(true)
      // Allow the DOM node to mount before triggering the slide-in transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    }

    const goOnline = () => {
      setIsOffline(false)
      setVisible(false)
      // Wait for slide-out transition to finish, then unmount
    }

    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)

    // If we started offline, trigger the slide-in
    if (!navigator.onLine) {
      requestAnimationFrame(() => setVisible(true))
    }

    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  // When offline flips to false and slide-out finishes, unmount the node
  useEffect(() => {
    if (!isOffline && !visible) {
      const timer = setTimeout(() => setMounted(false), 350)
      return () => clearTimeout(timer)
    }
  }, [isOffline, visible])

  if (!mounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        ...styles.banner,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: visible ? 1 : 0,
      }}
    >
      <Icon icon={icons.wifiOff} size={16} style={{ flexShrink: 0 }} />
      <span style={styles.text}>
        You&rsquo;re offline. Some features may be limited.
      </span>
    </div>
  )
}

const styles = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-warning-bg, #fef3cd)',
    color: 'var(--slogbaa-warning-text, #856404)',
    borderBottom: '1px solid var(--slogbaa-warning-border, #ffc107)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    lineHeight: 1.5,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    willChange: 'transform, opacity',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
