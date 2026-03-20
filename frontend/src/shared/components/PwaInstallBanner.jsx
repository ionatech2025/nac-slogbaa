import { useState, useEffect, useCallback } from 'react'
import { Icon, icons } from '../icons.jsx'

const DISMISSED_KEY = 'slogbaa-pwa-dismissed'

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div style={styles.banner} role="region" aria-label="Install app">
      <div style={styles.content}>
        <Icon icon={icons.download} size={20} style={{ color: 'var(--slogbaa-blue)', flexShrink: 0 }} />
        <span style={styles.text}>Install SLOGBAA for a faster, offline-ready experience.</span>
      </div>
      <div style={styles.actions}>
        <button type="button" style={styles.installBtn} onClick={handleInstall}>
          Install SLOGBAA
        </button>
        <button
          type="button"
          style={styles.dismissBtn}
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
        >
          <Icon icon={icons.close} size={18} />
        </button>
      </div>
    </div>
  )
}

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '0.875rem 1.5rem',
    background: 'var(--slogbaa-glass-bg)',
    border: 'var(--slogbaa-glass-border)',
    borderBottom: 'none',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    flexWrap: 'wrap',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  text: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  installBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: 8,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  dismissBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    padding: 0,
  },
}
