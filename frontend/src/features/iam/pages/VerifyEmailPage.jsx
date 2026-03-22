import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { verifyEmail, resendVerification } from '../../../api/iam/auth.js'
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
  message: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
  },
  success: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-success, #059669)',
    padding: '0.75rem',
    background: 'rgba(5, 150, 105, 0.1)',
    borderRadius: 10,
  },
  error: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error)',
  },
  loading: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  loginLink: {
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
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
  resendSuccess: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-success, #059669)',
    marginTop: '0.5rem',
  },
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [status, setStatus] = useState(token ? 'pending' : 'error')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState(null)
  const [resendError, setResendError] = useState(null)

  const handleVerify = async () => {
    if (!token) return
    setVerifyLoading(true)
    setStatus('verifying')
    try {
      const result = await verifyEmail(token)
      if (result.success) {
        navigate('/auth/login', { replace: true })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleResend = async (e) => {
    e.preventDefault()
    setResendError(null)
    setResendMessage(null)
    if (!resendEmail.trim()) {
      setResendError('Please enter your email address.')
      return
    }
    setResendLoading(true)
    try {
      const result = await resendVerification(resendEmail.trim())
      if (result.error) {
        setResendError(result.error)
      } else {
        setResendMessage(result.data.message)
      }
    } catch (err) {
      setResendError(err?.message ?? 'Network error. Is the backend running?')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div style={styles.page} className="auth-bg">
      <div style={styles.card} className="glass-card-elevated glass-enter">
        <div style={styles.logoWrap}>
          <Logo variant="full" size={40} color="blue" />
        </div>
        <h1 style={styles.title}>Email verification</h1>
        <p style={styles.subtitle}>Confirm your email address to activate your account.</p>

        {status === 'pending' && (
          <>
            <p style={styles.message}>
              Click the button below to verify your email address and activate your account.
            </p>
            <LoadingButton
              type="button"
              onClick={handleVerify}
              loading={verifyLoading}
              style={{ ...styles.submit, marginTop: '1rem' }}
            >
              <FontAwesomeIcon icon={icons.enrolled} />
              Verify Email
            </LoadingButton>
            <Link to="/auth/login" style={styles.loginLink}>
              Back to Sign in
            </Link>
          </>
        )}

        {status === 'verifying' && (
          <p style={styles.loading}>
            <FontAwesomeIcon icon={icons.loader} style={{ marginRight: '0.5rem' }} />
            Verifying your email...
          </p>
        )}

        {status === 'error' && (
          <>
            <p style={styles.message}>
              This verification link is invalid or has expired. Enter your email below to receive a new link.
            </p>
            <form style={styles.form} onSubmit={handleResend}>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="resend-email">Email address</label>
                <input
                  id="resend-email"
                  type="email"
                  autoComplete="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  style={styles.input}
                  placeholder="e.g. jane.akello@example.com"
                />
              </div>
              {resendError && <p style={styles.error}>{resendError}</p>}
              {resendMessage && <p style={styles.resendSuccess}>{resendMessage}</p>}
              <LoadingButton type="submit" loading={resendLoading} style={styles.submit}>
                <FontAwesomeIcon icon={icons.envelope} />
                Resend verification email
              </LoadingButton>
            </form>
            <Link to="/auth/login" style={styles.loginLink}>
              Back to Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
