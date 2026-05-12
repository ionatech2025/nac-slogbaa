import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAllStaff } from '../../../lib/hooks/use-system-admin.js'
import { useSetStaffActive, useSetStaffPassword, useCreateStaff, useUpdateStaffProfile, useDeleteStaff } from '../../../lib/hooks/use-admin-users.js'
import { useToast } from '../../../shared/hooks/useToast.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { Modal } from '../../../shared/components/Modal.jsx'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 20,
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'rgba(255, 127, 36, 0.08)',
    color: '#FF7F24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  createBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1rem',
    background: 'var(--slogbaa-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },

  /* ── Staff grid ── */
  staffScroll: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  staffCard: {
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 16,
    padding: '1.25rem',
    background: 'var(--slogbaa-surface)',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  staffCardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
  },
  staffAvatar: (active) => ({
    width: 42,
    height: 42,
    borderRadius: 12,
    background: active ? 'rgba(255,127,36,0.12)' : 'var(--slogbaa-border)',
    color: active ? '#FF7F24' : 'var(--slogbaa-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1rem',
    flexShrink: 0,
  }),
  staffInfo: {
    flex: 1,
    minWidth: 0,
  },
  staffNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  staffName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    wordWrap: 'break-word',
  },
  staffEmail: {
    margin: 0,
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-secondary)',
    wordBreak: 'break-all',
  },
  roleBadge: {
    fontSize: '0.625rem',
    fontWeight: 700,
    padding: '0.2rem 0.55rem',
    borderRadius: 20,
    background: 'rgba(255,127,36,0.1)',
    color: '#FF7F24',
    textTransform: 'uppercase',
  },
  staffStatus: (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: active ? '#10B981' : '#EF4444',
    background: active ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
    padding: '0.25rem 0.6rem',
    borderRadius: 20,
  }),
  staffDivider: {
    height: 1,
    background: 'var(--slogbaa-border)',
  },
  staffActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  actionBtn: (variant) => ({
    padding: '0.5rem 0',
    border: `1px solid ${variant === 'danger' ? 'rgba(239,68,68,0.3)' : 'var(--slogbaa-border)'}`,
    background: variant === 'danger' ? 'rgba(239,68,68,0.06)' : 'transparent',
    borderRadius: 8,
    color: variant === 'danger' ? '#EF4444' : 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.18s',
  }),
  actionBtnFull: (variant) => ({
    gridColumn: '1 / -1',
    padding: '0.5rem 0',
    border: `1px solid ${variant === 'danger' ? 'rgba(239,68,68,0.3)' : 'var(--slogbaa-border)'}`,
    background: variant === 'danger' ? 'rgba(239,68,68,0.06)' : 'transparent',
    borderRadius: 8,
    color: variant === 'danger' ? '#EF4444' : 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.18s',
  }),
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--slogbaa-text-secondary)',
    background: 'var(--slogbaa-glass-bg)',
    borderRadius: 20,
    border: '1px solid var(--slogbaa-border)',
  },

  /* ── Modal elements ── */
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  modalInput: {
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    boxSizing: 'border-box',
  },
  modalSelect: {
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    boxSizing: 'border-box',
    appearance: 'none',
  },
  modalLabel: {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    marginBottom: '0.35rem',
  },
  modalSubmit: {
    width: '100%',
    padding: '0.625rem 0.875rem',
    background: 'var(--slogbaa-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44,
    marginTop: '0.5rem',
  },
}

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '??'
}

export function SystemAdminStaffPage() {
  const { user, updateUser } = useAuth()
  const { data: staffData, isLoading: loadingStaff } = useAllStaff()
  const toast = useToast()
  
  const setStaffActive = useSetStaffActive()
  const setStaffPassword = useSetStaffPassword()
  const createStaff = useCreateStaff()
  const updateStaffProfile = useUpdateStaffProfile()
  const deleteStaff = useDeleteStaff()

  const staffList = staffData || []

  // Modal states
  const [resetStaff, setResetStaff] = useState(null)
  const [newPassword, setNewPassword] = useState('')

  const [editStaff, setEditStaff] = useState(null)
  const [editForm, setEditForm] = useState({ fullName: '', email: '' })

  const [isCreating, setIsCreating] = useState(false)
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', role: 'ADMIN', password: '' })

  const [deleteStaffConfirm, setDeleteStaffConfirm] = useState(null)

  const toggleStaffStatus = async (staffId, currentStatus) => {
    try {
      await setStaffActive.mutateAsync({ staffId, active: !currentStatus })
      toast.success(`Staff account ${!currentStatus ? 'activated' : 'deactivated'}.`)
    } catch {
      toast.error('Failed to update staff status.')
    }
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || !resetStaff) return
    try {
      await setStaffPassword.mutateAsync({ staffId: resetStaff.id, newPassword })
      toast.success(`Password reset for ${resetStaff.fullName}.`)
      setResetStaff(null)
      setNewPassword('')
    } catch {
      toast.error('Failed to reset password.')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editStaff) return
    try {
      await updateStaffProfile.mutateAsync({ staffId: editStaff.id, ...editForm })
      
      if (editStaff.id === user?.userId || editStaff.email === user?.email) {
        updateUser({ fullName: editForm.fullName, email: editForm.email })
      }
      
      toast.success(`Profile updated for ${editForm.fullName}.`)
      setEditStaff(null)
    } catch {
      toast.error('Failed to update staff profile.')
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    try {
      await createStaff.mutateAsync(createForm)
      toast.success(`Staff ${createForm.email} created successfully.`)
      setIsCreating(false)
      setCreateForm({ fullName: '', email: '', role: 'ADMIN', password: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to create staff.')
    }
  }

  const handleDeleteStaff = async () => {
    if (!deleteStaffConfirm) return
    try {
      await deleteStaff.mutateAsync(deleteStaffConfirm.id)
      toast.success(`Staff account deleted.`)
      setDeleteStaffConfirm(null)
    } catch {
      toast.error('Failed to delete staff account.')
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <div style={styles.titleIcon}>
            <FontAwesomeIcon icon={icons.users} />
          </div>
          <h1 style={styles.title}>Staff Directory</h1>
        </div>
        <button type="button" style={styles.createBtn} onClick={() => setIsCreating(true)}>
          <FontAwesomeIcon icon={icons.plus} /> Create Staff
        </button>
      </div>

      <div style={styles.staffScroll}>
        {loadingStaff ? (
          <div style={styles.emptyState}>Loading staff…</div>
        ) : staffList.length === 0 ? (
          <div style={styles.emptyState}>No staff found.</div>
        ) : (
          staffList.map(staff => (
            <div key={staff.id} style={styles.staffCard}>
              <div style={styles.staffCardTop}>
                <div style={styles.staffAvatar(staff.active)}>
                  {initials(staff.fullName)}
                </div>
                <div style={styles.staffInfo}>
                  <div style={styles.staffNameRow}>
                    <h3 style={styles.staffName} title={staff.fullName}>
                      <Link to={`/system-admin/users/staff/${staff.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {staff.fullName}
                      </Link>
                    </h3>
                    <span style={styles.roleBadge}>{staff.role}</span>
                  </div>
                  <p style={styles.staffEmail} title={staff.email}>{staff.email}</p>
                </div>
              </div>

              <div>
                <span style={styles.staffStatus(staff.active)}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                  {staff.active ? 'Active' : 'Suspended'}
                </span>
              </div>

              <div style={styles.staffDivider} />

              <div style={styles.staffActions}>
                <button
                  style={styles.actionBtn('default')}
                  onClick={() => {
                    setEditStaff(staff)
                    setEditForm({ fullName: staff.fullName, email: staff.email })
                  }}
                >
                  Edit Profile
                </button>
                <button
                  style={styles.actionBtn('default')}
                  onClick={() => {
                    setResetStaff(staff)
                    setNewPassword('')
                  }}
                >
                  Reset Pass
                </button>
                <button
                  style={styles.actionBtn(staff.active ? 'danger' : 'default')}
                  onClick={() => toggleStaffStatus(staff.id, staff.active)}
                  disabled={setStaffActive.isPending}
                >
                  {staff.active ? 'Suspend' : 'Activate'}
                </button>
                <button
                  style={styles.actionBtn('danger')}
                  onClick={() => setDeleteStaffConfirm(staff)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reset Password Modal */}
      {resetStaff && (
        <Modal
          title="Reset Password"
          onClose={() => setResetStaff(null)}
          maxWidth={400}
        >
          <form onSubmit={handleResetPasswordSubmit} style={styles.modalForm}>
            <p style={{ margin: '0', fontSize: '0.875rem', color: 'var(--slogbaa-text-secondary)' }}>
              Set a new password for <strong>{resetStaff.fullName}</strong> ({resetStaff.email}).
            </p>
            <div>
              <label style={styles.modalLabel} htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="text"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.modalInput}
                placeholder="Enter new password"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={setStaffPassword.isPending}
              style={styles.modalSubmit}
            >
              Update Password
            </LoadingButton>
          </form>
        </Modal>
      )}

      {/* Edit Profile Modal */}
      {editStaff && (
        <Modal
          title="Edit Staff Profile"
          onClose={() => setEditStaff(null)}
          maxWidth={400}
        >
          <form onSubmit={handleEditSubmit} style={styles.modalForm}>
            <div>
              <label style={styles.modalLabel} htmlFor="edit-name">Full Name</label>
              <input
                id="edit-name"
                type="text"
                required
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                style={styles.modalInput}
              />
            </div>
            <div>
              <label style={styles.modalLabel} htmlFor="edit-email">Email Address</label>
              <input
                id="edit-email"
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={styles.modalInput}
              />
            </div>
            <LoadingButton
              type="submit"
              loading={updateStaffProfile.isPending}
              style={styles.modalSubmit}
            >
              Save Changes
            </LoadingButton>
          </form>
        </Modal>
      )}

      {/* Create Staff Modal */}
      {isCreating && (
        <Modal
          title="Create New Staff"
          onClose={() => setIsCreating(false)}
          maxWidth={420}
        >
          <form onSubmit={handleCreateSubmit} style={styles.modalForm}>
            <div>
              <label style={styles.modalLabel} htmlFor="create-name">Full Name</label>
              <input
                id="create-name"
                type="text"
                required
                value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                style={styles.modalInput}
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label style={styles.modalLabel} htmlFor="create-email">Email Address</label>
              <input
                id="create-email"
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                style={styles.modalInput}
                placeholder="e.g. john@slogbaa.nac.ug"
              />
            </div>
            <div>
              <label style={styles.modalLabel} htmlFor="create-role">Role</label>
              <select
                id="create-role"
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                style={styles.modalSelect}
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <div>
              <label style={styles.modalLabel} htmlFor="create-password">Initial Password</label>
              <input
                id="create-password"
                type="password"
                required
                minLength={6}
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                style={styles.modalInput}
                placeholder="Must be at least 6 characters"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={createStaff.isPending}
              style={styles.modalSubmit}
            >
              Create Staff
            </LoadingButton>
          </form>
        </Modal>
      )}

      {/* Delete Staff Confirmation Modal */}
      {deleteStaffConfirm && (
        <Modal
          title="Delete Staff Member"
          onClose={() => setDeleteStaffConfirm(null)}
          maxWidth={400}
        >
          <div style={styles.modalForm}>
            <p style={{ margin: '0', fontSize: '0.9375rem', color: 'var(--slogbaa-text)' }}>
              Are you sure you want to permanently delete <strong>{deleteStaffConfirm.fullName}</strong>?
            </p>
            <p style={{ margin: '0', fontSize: '0.875rem', color: 'var(--slogbaa-error)' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                style={{ ...styles.modalSubmit, background: 'var(--slogbaa-surface)', color: 'var(--slogbaa-text)', border: '1px solid var(--slogbaa-border)' }}
                onClick={() => setDeleteStaffConfirm(null)}
                disabled={deleteStaff.isPending}
              >
                Cancel
              </button>
              <LoadingButton
                type="button"
                loading={deleteStaff.isPending}
                style={{ ...styles.modalSubmit, background: 'var(--slogbaa-error)', marginTop: 0 }}
                onClick={handleDeleteStaff}
              >
                Yes, Delete
              </LoadingButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
