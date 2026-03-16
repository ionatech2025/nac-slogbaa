import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm.jsx'
import { TestCredentialsSidebar } from '../components/TestCredentialsSidebar.jsx'

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'var(--slogbaa-bg)',
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    padding: '2.5rem 2rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-border)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'var(--slogbaa-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 800,
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  },
  title: {
    margin: '0 0 0.35rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    margin: '0 0 1.75rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
  registerLink: {
    display: 'block',
    marginTop: '1.25rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  registerLinkAccent: {
    color: 'var(--slogbaa-blue)',
    fontWeight: 500,
  },
}

export function LoginPage() {
  return (
    <div style={styles.page} className="login-page">
      <TestCredentialsSidebar />
      <main style={styles.main}>
        <div style={styles.formCard}>
          <div style={styles.logoMark}>S</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your SLOGBAA learning account</p>
          <LoginForm />
          <p style={styles.registerLink}>
            Don't have an account?{' '}
            <Link to="/auth/register" style={styles.registerLinkAccent}>
              Register as trainee
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
