import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm.jsx'
import { TestCredentialsSidebar } from '../components/TestCredentialsSidebar.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    padding: '2.5rem 2rem',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    marginBottom: '1.75rem',
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
    <div style={styles.page} className="login-page auth-bg">
      <TestCredentialsSidebar />
      <main style={styles.main}>
        <div style={styles.formCard} className="glass-card-elevated glass-enter">
          <div style={styles.logoWrap}>
            <Logo variant="full" size={44} color="blue" />
          </div>
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
