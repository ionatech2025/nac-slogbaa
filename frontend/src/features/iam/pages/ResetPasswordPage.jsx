import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { verifyResetToken, confirmPasswordReset } from '../../../api/iam/auth.js'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'

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
  passwordWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
  },
  passwordInput: {
    flex: 1,
    paddingRight: '2.5rem',
  },
  toggleVisibility: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.75rem',
    border: 'none',
    background: 'none',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
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
  loginLink: {
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
  loading: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [status, setStatus] = useState('idle') // idle | verifying | valid | invalid | success | error
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }
    let cancelled = false
    setStatus('verifying')
    verifyResetToken(token).then((result) => {
      if (cancelled) return
      setStatus(result.valid ? 'valid' : 'invalid')
    })
    return () => { cancelled = true }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const result = await confirmPasswordReset(token, newPassword)
      if (result.error) {
        setError(result.error)
        return
      }
      setStatus('success')
      setTimeout(() => navigate('/auth/login', { replace: true }), 2000)
    } catch (err) {
      setError(err?.message ?? 'Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset password</h1>
        <p style={styles.subtitle}>Set a new password for your SLOGBAA account.</p>

        {status === 'verifying' && (
          <p style={styles.loading}>Verifying reset link…</p>
        )}

        {status === 'invalid' && (
          <>
            <p style={styles.message}>
              This link appears to be invalid or has expired. Please request a new password reset.
            </p>
            <Link to="/auth/forgot-password" style={styles.loginLink}>
              Request new reset link
            </Link>
            <Link to="/auth/login" style={styles.loginLink}>
              Back to Sign in
            </Link>
          </>
        )}

        {status === 'valid' && (
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="reset-new-password">
                New password
              </label>
              <div style={styles.passwordWrap}>
                <input
                  id="reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ ...styles.input, ...styles.passwordInput }}
                  placeholder="At least 6 characters"
                  minLength={6}
                />
                <button
                  type="button"
                  style={styles.toggleVisibility}
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword ? icons.eyeSlash : icons.eye} />
                </button>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="reset-confirm-password">
                Confirm password
              </label>
              <input
                id="reset-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                placeholder="Repeat new password"
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <LoadingButton type="submit" loading={loading} style={styles.submit}>
              <FontAwesomeIcon icon={icons.changePassword} />
              Reset password
            </LoadingButton>
          </form>
        )}

        {status === 'success' && (
          <>
            <p style={styles.success}>Password has been reset successfully. Redirecting to sign in…</p>
            <Link to="/auth/login" style={styles.loginLink}>
              Sign in now
            </Link>
          </>
        )}

        {status === 'valid' && (
          <Link to="/auth/login" style={styles.loginLink}>
            Back to Sign in
          </Link>
        )}
      </div>
    </div>
  )
}
