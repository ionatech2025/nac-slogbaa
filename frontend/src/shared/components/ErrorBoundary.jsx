import { Component } from 'react'
import { Icon, icons } from '../icons.jsx'

/**
 * React Error Boundary — catches unhandled errors in child components.
 * Prevents full app crash. Shows a recovery UI instead.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
    if (!import.meta.env.DEV) {
      import('@sentry/react').then(Sentry => {
        Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } })
      }).catch(() => {})
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // If user is logged out, this error was likely caused by the logout transition
      // (components losing cache data mid-render). Redirect to login instead of
      // showing the error page — the route guards would do this anyway.
      try {
        if (!localStorage.getItem('slogbaa_auth')) {
          const path = window.location.pathname
          if (
            path !== '/auth/login' && 
            path !== '/auth/register' && 
            path !== '/' &&
            !path.startsWith('/news-and-updates') &&
            !path.startsWith('/inperson-training') &&
            !path.startsWith('/stories') &&
            !path.startsWith('/public-library') &&
            !path.startsWith('/videos') &&
            !path.startsWith('/inquiries')
          ) {
            window.location.replace('/auth/login')
            return null
          }
        }
      } catch { /* localStorage unavailable — fall through to error UI */ }

      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, reset: this.handleReset })
      }
      return (
        <div style={styles.wrap} role="alert">
          <div style={styles.card}>
            <div style={styles.iconWrap}>
              <Icon icon={icons.close} size={28} style={{ color: 'var(--slogbaa-error)' }} />
            </div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.text}>
              An unexpected error occurred. Please try again or refresh the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre style={styles.detail}>{this.state.error.message}</pre>
            )}
            <div style={styles.actions}>
              <button type="button" style={styles.btnPrimary} onClick={this.handleReset}>
                Try again
              </button>
              <button type="button" style={styles.btnSecondary} onClick={() => window.location.reload()}>
                Reload page
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: '2rem',
  },
  card: {
    maxWidth: 440,
    width: '100%',
    padding: '2.5rem 2rem',
    borderRadius: 16,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'rgba(185, 28, 28, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  text: {
    margin: '0 0 1.5rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.6,
  },
  detail: {
    margin: '0 0 1.5rem',
    padding: '0.75rem 1rem',
    borderRadius: 10,
    background: 'var(--slogbaa-bg-secondary)',
    fontSize: '0.75rem',
    color: 'var(--slogbaa-error)',
    textAlign: 'left',
    overflow: 'auto',
    maxHeight: 120,
    fontFamily: 'ui-monospace, monospace',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  btnPrimary: {
    padding: '0.6rem 1.25rem',
    borderRadius: 10,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '0.6rem 1.25rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
}
