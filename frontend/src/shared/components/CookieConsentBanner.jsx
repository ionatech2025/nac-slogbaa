import { useState, useEffect } from 'react'

const STORAGE_KEY = 'slogbaa-cookie-consent'

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  return (
    <div style={styles.banner} role="region" aria-label="Cookie consent">
      <p style={styles.text}>
        We use cookies and local storage to improve your experience. By continuing to use
        SLOGBAA, you accept our use of cookies.{' '}
        <a
          href="https://www.cookiesandyou.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Learn more
        </a>
      </p>
      <button type="button" style={styles.button} onClick={handleAccept}>
        Accept
      </button>
    </div>
  )
}

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    background: 'var(--slogbaa-glass-bg)',
    border: 'var(--slogbaa-glass-border)',
    borderBottom: 'none',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    flexWrap: 'wrap',
  },
  text: {
    margin: 0,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
    maxWidth: 600,
  },
  link: {
    color: 'var(--slogbaa-blue)',
    textDecoration: 'underline',
    fontWeight: 500,
  },
  button: {
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
}
