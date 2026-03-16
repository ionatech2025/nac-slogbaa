import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { requestPasswordReset } from '../../../api/iam/auth.js'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: '2.5rem 2rem',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    marginBottom: '1.75rem',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '1rem',
    background: 'var(--slogbaa-bg)',
  },
  iconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
  },
  leadingIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--slogbaa-text-muted)',
    pointerEvents: 'none',
    fontSize: '0.9375rem',
  },
  submit: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    marginTop: '0.25rem',
    padding: '0.625rem 1rem',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error)',
  },
  success: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-success, #059669)',
    padding: '0.75rem',
    background: 'rgba(5, 150, 105, 0.1)',
    borderRadius: 10,
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    try {
      const result = await requestPasswordReset(email)
      if (result.error) {
        setError(result.error)
        return
      }
      setSuccess(result.data.message)
    } catch (err) {
      setError(err?.message ?? 'Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page} className="auth-bg">
      <div style={styles.card} className="glass-card-elevated glass-enter">
        <div style={styles.logoWrap}>
          <Logo variant="full" size={40} color="blue" />
        </div>
        <h1 style={styles.title}>Forgot password?</h1>
        <p style={styles.subtitle}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        {success ? (
          <>
            <p style={styles.success}>{success}</p>
            <div style={styles.links}>
              <Link to="/auth/login">Back to Sign in</Link>
            </div>
          </>
        ) : (
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="forgot-email">
                Email
              </label>
              <div style={styles.iconWrap}>
                <FontAwesomeIcon icon={icons.envelope} style={styles.leadingIcon} />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ ...styles.input, paddingLeft: '2.5rem', width: '100%' }}
                  placeholder="e.g. jane.akello@example.com"
                />
              </div>
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <LoadingButton type="submit" loading={loading} style={styles.submit}>
              <FontAwesomeIcon icon={icons.changePassword} />
              Send reset link
            </LoadingButton>
            <div style={styles.links}>
              <Link to="/auth/login">Back to Sign in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
