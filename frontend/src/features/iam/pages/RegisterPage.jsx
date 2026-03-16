import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem)',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  logoWrap: {
    marginBottom: '1.75rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    margin: '0 0 1.5rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  loginLink: {
    display: 'block',
    marginTop: '1.25rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  loginLinkAccent: {
    color: 'var(--slogbaa-blue)',
    fontWeight: 500,
  },
}

export function RegisterPage() {
  return (
    <div style={styles.page} className="auth-bg">
      <div style={styles.card} className="glass-card-elevated glass-enter">
        <div style={styles.logoWrap}>
          <Logo variant="full" size={44} color="blue" />
        </div>
        <h1 style={styles.title}>Register as trainee</h1>
        <p style={styles.subtitle}>Create an account to access SLOGBAA courses and certification.</p>
        <RegisterForm />
        <p style={styles.loginLink}>
          Already have an account?{' '}
          <Link to="/auth/login" style={styles.loginLinkAccent}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
