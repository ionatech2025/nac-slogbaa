import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { login as loginApi, resendVerification } from '../../../api/iam/auth.js'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    letterSpacing: '0.01em',
  },
  input: {
    padding: '0.625rem 0.875rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-bg)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
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
    marginTop: '0.5rem',
    padding: '0.7rem 1.25rem',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s, box-shadow 0.15s',
  },
  submitDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  error: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error)',
  },
  forgotLink: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    alignSelf: 'flex-end',
  },
  verifyWrap: {
    padding: '0.75rem',
    background: 'rgba(234, 88, 12, 0.08)',
    borderRadius: 10,
    fontSize: '0.875rem',
  },
  verifyText: {
    margin: '0 0 0.5rem',
    color: 'var(--slogbaa-text)',
  },
  resendBtn: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-blue)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  resendMsg: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-success, #059669)',
    marginTop: '0.375rem',
  },
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [resendMsg, setResendMsg] = useState(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const handleResendVerification = async () => {
    setResendMsg(null)
    setResendLoading(true)
    try {
      const result = await resendVerification(email.trim())
      setResendMsg(result.error ?? result.data?.message ?? 'Verification email sent.')
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setEmailNotVerified(false)
    setResendMsg(null)
    if (!email.trim() || !password) {
      setError('Please enter email and password.')
      return
    }
    setLoading(true)
    try {
      const result = await loginApi(email.trim(), password)
      if (result.error) {
        if (result.error.toLowerCase().includes('verify your email')) {
          setEmailNotVerified(true)
        } else {
          setError(result.error)
        }
        return
      }
      const { token, userId, email: userEmail, role, fullName } = result.data
      setAuth(token, { userId, email: userEmail, role, fullName })
      const isStaff = Boolean(role && (String(role).toUpperCase() === 'SUPER_ADMIN' || String(role).toUpperCase() === 'ADMIN'))
      const target = isStaff ? '/admin' : '/dashboard'
      // Defer navigation so auth context state is committed before the new page reads it
      setTimeout(() => navigate(target, { replace: true }), 0)
    } catch (err) {
      setError(err?.message ?? 'Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.field}>
        <label style={styles.label} htmlFor="login-email">
          Email
        </label>
        <div style={styles.iconWrap}>
          <FontAwesomeIcon icon={icons.envelope} style={styles.leadingIcon} />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...styles.input, paddingLeft: '2.5rem' }}
            placeholder="e.g. jane.akello@example.com"
          />
        </div>
      </div>
      <div style={styles.field}>
        <label style={styles.label} htmlFor="login-password">
          Password
        </label>
        <div style={styles.passwordWrap}>
          <FontAwesomeIcon icon={icons.lock} style={styles.leadingIcon} />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, ...styles.passwordInput, paddingLeft: '2.5rem' }}
            placeholder="••••••••"
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
        <Link to="/auth/forgot-password" style={styles.forgotLink}>
          Forgot password?
        </Link>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {emailNotVerified && (
        <div style={styles.verifyWrap}>
          <p style={styles.verifyText}>
            Please verify your email address before signing in. Check your inbox for a verification link.
          </p>
          <button
            type="button"
            style={styles.resendBtn}
            onClick={handleResendVerification}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend verification email'}
          </button>
          {resendMsg && <p style={styles.resendMsg}>{resendMsg}</p>}
        </div>
      )}
      <LoadingButton type="submit" loading={loading} style={styles.submit}>
        <FontAwesomeIcon icon={icons.signIn} />
        Sign in
      </LoadingButton>
    </form>
  )
}
