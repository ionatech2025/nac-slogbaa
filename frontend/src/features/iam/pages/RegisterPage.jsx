import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'var(--slogbaa-bg)',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    padding: '2.5rem 2rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-border)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
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
    <div style={styles.page}>
      <div style={styles.card}>
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
