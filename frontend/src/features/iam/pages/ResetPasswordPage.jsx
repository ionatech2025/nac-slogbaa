import { useSearchParams, Link } from 'react-router-dom'

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
  message: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
  },
  loginLink: {
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset password</h1>
        <p style={styles.subtitle}>Set a new password for your SLOGBAA account.</p>
        {token ? (
          <p style={styles.message}>
            Enter your new password below. This form will be wired to the reset API.
          </p>
        ) : (
          <p style={styles.message}>
            This link appears to be invalid or has expired. Please request a new password reset.
          </p>
        )}
        <Link to="/auth/login" style={styles.loginLink}>
          Back to Sign in
        </Link>
      </div>
    </div>
  )
}
