import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { useAuth } from '../hooks/useAuth.js'
import { login as loginApi } from '../../../api/iam/auth.js'

const styles = {
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
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Please enter email and password.')
      return
    }
    setLoading(true)
    try {
      const result = await loginApi(email.trim(), password)
      if (result.error) {
        setError(result.error)
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
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="e.g. jane.akello@example.com"
        />
      </div>
      <div style={styles.field}>
        <label style={styles.label} htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          placeholder="••••••••"
        />
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <button
        type="submit"
        style={{ ...styles.submit, ...(loading ? styles.submitDisabled : {}) }}
        disabled={loading}
      >
        <FontAwesomeIcon icon={icons.signIn} />
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
