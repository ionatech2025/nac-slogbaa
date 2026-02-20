import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { requestPasswordReset } from '../../../api/iam/auth.js'

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
    borderRadius: 6,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
  },
  submit: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    marginTop: '0.25rem',
    padding: '0.625rem 1rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  submitDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
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
    borderRadius: 6,
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
    <div style={styles.page}>
      <div style={styles.card}>
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
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="e.g. jane.akello@example.com"
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button
              type="submit"
              style={{ ...styles.submit, ...(loading ? styles.submitDisabled : {}) }}
              disabled={loading}
            >
              <FontAwesomeIcon icon={icons.changePassword} />
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
            <div style={styles.links}>
              <Link to="/auth/login">Back to Sign in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
