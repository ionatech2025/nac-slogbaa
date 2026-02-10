import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm.jsx'

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
    padding: '2rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    color: 'var(--slogbaa-blue)',
  },
  subtitle: {
    margin: '0 0 1.5rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  loginLink: {
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
}

export function RegisterPage() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register as trainee</h1>
        <p style={styles.subtitle}>Create an account to access SLOGBAA courses and certification.</p>
        <RegisterForm />
        <Link to="/auth/login" style={styles.loginLink}>
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  )
}
