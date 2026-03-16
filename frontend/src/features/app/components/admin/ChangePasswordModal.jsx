import { useState } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'
import { Modal } from '../../../../shared/components/Modal.jsx'
import { LoadingButton } from '../../../../shared/components/LoadingButton.jsx'

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
    background: 'var(--slogbaa-blue)',
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
}

export function ChangePasswordModal({ onClose, onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }
    setLoading(true)
    try {
      await onSubmit?.({ currentPassword, newPassword })
      setSuccess(true)
      setTimeout(() => onClose?.(), 1200)
    } catch (err) {
      setError(err?.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Change Password" onClose={onClose}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="current-password">Current password</label>
          <div style={styles.passwordWrap}>
            <input
              id="current-password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ ...styles.input, ...styles.passwordInput }}
              autoComplete="current-password"
            />
            <button
              type="button"
              style={styles.toggleVisibility}
              onClick={() => setShowCurrent((v) => !v)}
              title={showCurrent ? 'Hide password' : 'Show password'}
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showCurrent ? icons.eyeSlash : icons.eye} />
            </button>
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="new-password">New password</label>
          <div style={styles.passwordWrap}>
            <input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ ...styles.input, ...styles.passwordInput }}
              autoComplete="new-password"
            />
            <button
              type="button"
              style={styles.toggleVisibility}
              onClick={() => setShowNew((v) => !v)}
              title={showNew ? 'Hide password' : 'Show password'}
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showNew ? icons.eyeSlash : icons.eye} />
            </button>
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="confirm-password">Confirm new password</label>
          <div style={styles.passwordWrap}>
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ ...styles.input, ...styles.passwordInput }}
              autoComplete="new-password"
            />
            <button
              type="button"
              style={styles.toggleVisibility}
              onClick={() => setShowConfirm((v) => !v)}
              title={showConfirm ? 'Hide password' : 'Show password'}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showConfirm ? icons.eyeSlash : icons.eye} />
            </button>
          </div>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>Password updated successfully.</p>}
        <div style={styles.actions}>
          <button type="button" style={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <LoadingButton
            type="submit"
            loading={loading}
            disabled={success}
            style={styles.btnPrimary}
          >
            <FontAwesomeIcon icon={icons.changePassword} />
            {success ? 'Updated' : 'Update Password'}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  )
}
