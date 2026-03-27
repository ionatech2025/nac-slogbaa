import { useState, useCallback } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useTraineeSettings, useUpdateTraineeSettings } from '../../../lib/hooks/use-trainee.js'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useToast } from '../../../shared/hooks/useToast.js'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'
import { exportMyData, deleteMyAccount } from '../../../api/iam/account.js'

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--slogbaa-bg)',
  },
  main: {
    flex: 1,
    padding: '1.5rem 2rem',
    maxWidth: 800,
    margin: '0 auto',
    width: '100%',
  },
  heading: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: '0 0 1.75rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  card: {
    padding: '1.5rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    margin: '0 0 0.25rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  cardDescription: {
    margin: '0 0 1rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  rowLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    flex: '1 1 auto',
  },
  rowTitle: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  rowHint: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  toggle: {
    position: 'relative',
    display: 'inline-block',
    width: 48,
    height: 26,
    flexShrink: 0,
  },
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0,
    position: 'absolute',
  },
  toggleSlider: (checked) => ({
    position: 'absolute',
    cursor: 'pointer',
    inset: 0,
    background: checked ? 'var(--slogbaa-blue)' : 'var(--slogbaa-border)',
    borderRadius: 26,
    transition: 'background 0.2s',
  }),
  toggleKnob: (checked) => ({
    position: 'absolute',
    content: '""',
    height: 20,
    width: 20,
    left: checked ? 24 : 4,
    bottom: 3,
    background: '#fff',
    borderRadius: '50%',
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  }),
  themeRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  themeOption: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    borderRadius: 12,
    border: active ? '2px solid var(--slogbaa-blue)' : '1px solid var(--slogbaa-border)',
    background: active ? 'rgba(59, 130, 246, 0.06)' : 'var(--slogbaa-surface)',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: active ? 'var(--slogbaa-blue)' : 'var(--slogbaa-text)',
    transition: 'border-color 0.15s, background 0.15s',
    minHeight: 44,
  }),
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: 44,
    transition: 'background 0.15s',
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-error)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: 44,
    transition: 'opacity 0.15s',
  },
  btnPrimary: {
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: 44,
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
    minHeight: 44,
  },
  profileLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: 44,
    textDecoration: 'none',
    transition: 'opacity 0.15s',
  },
  divider: {
    height: 0,
    border: 'none',
    borderBottom: '1px solid var(--slogbaa-border)',
    margin: '1rem 0',
  },
  deleteWarning: {
    margin: '0 0 1rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.6,
  },
  deleteWarningStrong: {
    color: 'var(--slogbaa-error)',
    fontWeight: 600,
  },
  deleteInput: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 6,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    marginBottom: '0.5rem',
    boxSizing: 'border-box',
  },
  deleteActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  textArea: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 6,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    minHeight: 80,
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
    marginBottom: '0.35rem',
  },
}

function Toggle({ checked, onChange, id, label }) {
  return (
    <label style={styles.toggle} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={styles.toggleInput}
        aria-label={label}
      />
      <span style={styles.toggleSlider(checked)}>
        <span style={styles.toggleKnob(checked)} />
      </span>
    </label>
  )
}

const DELETE_CONFIRMATION_TEXT = 'DELETE MY ACCOUNT'

export function SettingsPage() {
  useDocumentTitle('Settings')
  const navigate = useNavigate()
  const { token, logout, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const toast = useToast()

  // Notification settings
  const { data: traineeSettings, isLoading: settingsLoading } = useTraineeSettings()
  const updateSettings = useUpdateTraineeSettings()
  const certificateEmailOptIn = traineeSettings?.certificateEmailOptIn ?? false

  // Export state
  const [exporting, setExporting] = useState(false)

  // Delete account state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const { onEditProfile } = useOutletContext() || {}

  const handleToggleCertificateEmail = useCallback(
    (checked) => {
      updateSettings.mutate(
        { certificateEmailOptIn: checked },
        {
          onSuccess: () => toast.success(checked ? 'Certificate emails enabled.' : 'Certificate emails disabled.'),
          onError: (err) => toast.error(err?.message ?? 'Failed to update setting.'),
        }
      )
    },
    [updateSettings, toast]
  )

  const handleExportData = useCallback(async () => {
    if (!token || exporting) return
    setExporting(true)
    try {
      await exportMyData(token)
      toast.success('Your data has been downloaded.')
    } catch (err) {
      toast.error(err?.message ?? 'Failed to export data.')
    } finally {
      setExporting(false)
    }
  }, [token, exporting, toast])

  const handleOpenDeleteModal = useCallback(() => {
    setDeleteConfirmation('')
    setDeleteReason('')
    setDeleteError(null)
    setDeleteModalOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setDeleteConfirmation('')
    setDeleteReason('')
    setDeleteError(null)
  }, [])

  const handleDeleteAccount = useCallback(async () => {
    if (!token || deleting) return
    if (deleteConfirmation !== DELETE_CONFIRMATION_TEXT) {
      setDeleteError(`Please type "${DELETE_CONFIRMATION_TEXT}" to confirm.`)
      return
    }
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteMyAccount(token, deleteReason.trim() || undefined)
      toast.info('Your account has been deleted. Goodbye.')
      handleCloseDeleteModal()
      logout()
    } catch (err) {
      setDeleteError(err?.message ?? 'Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
    }
  }, [token, deleting, deleteConfirmation, deleteReason, toast, handleCloseDeleteModal, logout])

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <h1 style={styles.heading}>Settings</h1>
        <p style={styles.subtitle}>Manage your account preferences and privacy.</p>

        {/* Appearance */}
        <section style={styles.card} aria-labelledby="settings-appearance">
          <h2 id="settings-appearance" style={styles.cardTitle}>
            <Icon icon={icons.sun} size="1.125rem" />
            Appearance
          </h2>
          <p style={styles.cardDescription}>Choose your preferred theme for the platform.</p>
          <div style={styles.themeRow}>
            <button
              type="button"
              style={styles.themeOption(theme === 'light')}
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
            >
              <Icon icon={icons.sun} size="1.125rem" />
              Light
            </button>
            <button
              type="button"
              style={styles.themeOption(theme === 'dark')}
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
            >
              <Icon icon={icons.moon} size="1.125rem" />
              Dark
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section style={styles.card} aria-labelledby="settings-notifications">
          <h2 id="settings-notifications" style={styles.cardTitle}>
            <Icon icon={icons.bell} size="1.125rem" />
            Notifications
          </h2>
          <p style={styles.cardDescription}>Control how and when you receive notifications.</p>
          <div style={styles.row}>
            <div style={styles.rowLabel}>
              <span style={styles.rowTitle}>Certificate email notifications</span>
              <span style={styles.rowHint}>
                Receive an email when you earn a new certificate.
              </span>
            </div>
            {settingsLoading ? (
              <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>Loading...</span>
            ) : (
              <Toggle
                id="certificate-email-opt-in"
                checked={certificateEmailOptIn}
                onChange={handleToggleCertificateEmail}
                label="Toggle certificate email notifications"
              />
            )}
          </div>
        </section>

        {/* Profile */}
        <section style={styles.card} aria-labelledby="settings-profile">
          <h2 id="settings-profile" style={styles.cardTitle}>
            <Icon icon={icons.viewProfile} size="1.125rem" />
            Profile
          </h2>
          <p style={styles.cardDescription}>
            Update your personal information, avatar, and contact details.
          </p>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            Signed in as <strong style={{ color: 'var(--slogbaa-text)' }}>{user?.email ?? 'unknown'}</strong>
          </p>
          <button
            type="button"
            style={styles.profileLink}
            onClick={onEditProfile}
          >
            <Icon icon={icons.editProfile} size="1rem" />
            Edit Profile
          </button>
        </section>

        {/* Privacy & Data */}
        <section style={styles.card} aria-labelledby="settings-privacy">
          <h2 id="settings-privacy" style={styles.cardTitle}>
            <Icon icon={icons.shield} size="1.125rem" />
            Privacy &amp; Data
          </h2>
          <p style={styles.cardDescription}>
            Export your data or delete your account. These actions comply with data protection regulations.
          </p>

          {/* Export */}
          <div style={{ ...styles.row, marginBottom: '1rem' }}>
            <div style={styles.rowLabel}>
              <span style={styles.rowTitle}>Export my data</span>
              <span style={styles.rowHint}>
                Download all your personal data, progress, and activity as a JSON file.
              </span>
            </div>
            <LoadingButton
              loading={exporting}
              style={styles.btnOutline}
              onClick={handleExportData}
            >
              <Icon icon={icons.download} size="1rem" />
              Export Data
            </LoadingButton>
          </div>

          <hr style={styles.divider} aria-hidden />

          {/* Delete Account */}
          <div style={styles.row}>
            <div style={styles.rowLabel}>
              <span style={{ ...styles.rowTitle, color: 'var(--slogbaa-error)' }}>Delete my account</span>
              <span style={styles.rowHint}>
                Permanently delete your account and all associated data. This cannot be undone.
              </span>
            </div>
            <button
              type="button"
              style={styles.btnDanger}
              onClick={handleOpenDeleteModal}
            >
              <Icon icon={icons.trash} size="1rem" />
              Delete Account
            </button>
          </div>
        </section>

        {/* Delete Account Confirmation Modal */}
        {deleteModalOpen && (
          <Modal title="Delete Your Account" onClose={handleCloseDeleteModal} maxWidth={520}>
            <p style={styles.deleteWarning}>
              <span style={styles.deleteWarningStrong}>Warning:</span> This action is permanent and cannot be reversed.
              All your data, including course progress, certificates, bookmarks, and notes will be permanently deleted.
            </p>
            <p style={styles.deleteWarning}>
              We recommend <button
                type="button"
                onClick={() => { handleCloseDeleteModal(); handleExportData(); }}
                style={{ background: 'none', border: 'none', color: 'var(--slogbaa-blue)', cursor: 'pointer', fontSize: 'inherit', fontWeight: 500, padding: 0, textDecoration: 'underline' }}
              >exporting your data</button> before deleting your account.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.fieldLabel} htmlFor="delete-reason">
                Reason for leaving (optional)
              </label>
              <textarea
                id="delete-reason"
                style={styles.textArea}
                placeholder="Help us improve by telling us why you're leaving..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                maxLength={500}
              />
            </div>

            <div>
              <label style={styles.fieldLabel} htmlFor="delete-confirm">
                Type <strong>{DELETE_CONFIRMATION_TEXT}</strong> to confirm
              </label>
              <input
                id="delete-confirm"
                type="text"
                style={styles.deleteInput}
                value={deleteConfirmation}
                onChange={(e) => {
                  setDeleteConfirmation(e.target.value)
                  setDeleteError(null)
                }}
                placeholder={DELETE_CONFIRMATION_TEXT}
                autoComplete="off"
              />
            </div>

            {deleteError && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-error)' }}>
                {deleteError}
              </p>
            )}

            <div style={styles.deleteActions}>
              <button
                type="button"
                style={styles.btnSecondary}
                onClick={handleCloseDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <LoadingButton
                loading={deleting}
                disabled={deleteConfirmation !== DELETE_CONFIRMATION_TEXT}
                style={{
                  ...styles.btnDanger,
                  opacity: deleteConfirmation !== DELETE_CONFIRMATION_TEXT ? 0.5 : 1,
                }}
                onClick={handleDeleteAccount}
              >
                Permanently Delete
              </LoadingButton>
            </div>
          </Modal>
        )}
      </main>
    </div>
  )
}
