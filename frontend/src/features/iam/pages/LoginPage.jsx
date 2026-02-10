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
    maxWidth: 400,
    padding: '2rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: '0 0 1.5rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  registerLink: {
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
}

export function LoginPage() {
  return (
    <div style={styles.page}>
      <TestCredentialsSidebar />
      <main style={styles.main}>
        <div style={styles.formCard}>
          <h1 style={styles.title}>Sign in</h1>
          <p style={styles.subtitle}>SLOGBAA Online Learning Platform</p>
          <LoginForm />
          <Link to="/auth/register" style={styles.registerLink}>
            Don’t have an account? Register as trainee
          </Link>
        </div>
      </main>
    </div>
  )
}
