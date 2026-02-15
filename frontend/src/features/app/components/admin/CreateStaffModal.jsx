import { useState } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.js'
import { Modal } from '../../../../shared/components/Modal.jsx'

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
  },
  select: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  btnSecondary: {
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnPrimaryDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  error: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error)',
  },
  success: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-success, #0a7c42)',
  },
}

const ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
]

export function CreateStaffModal({ onClose, onSubmit }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('ADMIN')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const trimmedEmail = email.trim()
    if (!fullName.trim()) {
      setError('Full name is required.')
      return
    }
    if (!trimmedEmail) {
      setError('Email is required.')
      return
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await onSubmit?.({ fullName: fullName.trim(), email: trimmedEmail, role, password })
      setSuccess(true)
      setTimeout(() => onClose?.(), 2000)
    } catch (err) {
      setError(err?.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Create Staff" onClose={onClose}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="staff-fullName">Full name</label>
          <input
            id="staff-fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
            placeholder="e.g. Jane Doe"
            autoComplete="name"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="staff-email">Email</label>
          <input
            id="staff-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="staff@example.org"
            autoComplete="email"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="staff-role">Role</label>
          <select
            id="staff-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="staff-password">Initial password</label>
          <input
            id="staff-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <p style={styles.success}>
            Staff created. Credentials have been sent to their email.
          </p>
        )}
        <div style={styles.actions}>
          <button type="button" style={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            style={{ ...styles.btnPrimary, ...(loading || success ? styles.btnPrimaryDisabled : {}) }}
            disabled={loading || success}
          >
            <FontAwesomeIcon icon={icons.createStaff} />
            {loading ? 'Creating…' : success ? 'Created' : 'Create Staff'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
