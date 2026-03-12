import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { getStaffProfile, setStaffPassword, setStaffActive, deleteStaff, updateStaffProfile } from '../../../api/admin/staff.js'
import {
  getTraineeProfile,
  getTraineeEnrolledCourses,
  setTraineePassword,
  deleteTrainee,
  updateTraineeProfile,
} from '../../../api/admin/trainees.js'
import { getAdminCertificates } from '../../../api/admin/certificates.js'
import { getAssetUrl } from '../../../api/client.js'
import { Modal } from '../../../shared/components/Modal.jsx'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'

const styles = {
  page: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '0 1rem 2rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.75rem',
    padding: '1.5rem 1.75rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 14,
    border: '1px solid var(--slogbaa-border)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    objectFit: 'cover',
    background: 'linear-gradient(135deg, var(--slogbaa-teal, #0d9488) 0%, var(--slogbaa-blue) 100%)',
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #0d9488 0%, var(--slogbaa-blue) 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  nameBlock: {
    minWidth: 0,
  },
  userName: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.02em',
  },
  roleStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.35rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--slogbaa-green)',
  },
  statusDotInactive: {
    background: 'var(--slogbaa-text-muted)',
  },
  statusText: {
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.85rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
  },
  actionBtnEdit: {
    background: 'rgba(148, 163, 184, 0.12)',
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  actionBtnDeactivate: {
    background: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    color: '#a16207',
  },
  actionBtnActivate: {
    background: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    color: '#15803d',
  },
  actionBtnEmail: {
    background: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    color: 'var(--slogbaa-blue)',
  },
  actionBtnDanger: {
    background: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    color: 'var(--slogbaa-error, #dc2626)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '1.5rem',
  },
  card: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 14,
    border: '1px solid var(--slogbaa-border)',
    padding: '1.5rem 1.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    margin: '0 0 1.25rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  label: {
    display: 'block',
    marginBottom: '0.25rem',
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--slogbaa-text-muted)',
  },
  value: {
    margin: '0 0 1rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
  },
  valueLast: { marginBottom: 0 },
  roleBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'rgba(34, 197, 94, 0.15)',
    color: 'var(--slogbaa-green)',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    marginBottom: '0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    background: 'var(--slogbaa-bg)',
  },
  inputWrap: {
    position: 'relative',
  },
  toggleVisibility: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'none',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    padding: 4,
  },
  hint: {
    margin: '-0.5rem 0 0.75rem',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.25rem',
    border: 'none',
    borderRadius: 8,
    background: 'linear-gradient(135deg, #0d9488 0%, #0e7490 100%)',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  btnPrimaryDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  accountActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    width: '100%',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s, border-color 0.15s',
  },
  accountActionBtnDanger: {
    borderColor: 'rgba(239, 68, 68, 0.35)',
    color: 'var(--slogbaa-error)',
    background: 'rgba(239, 68, 68, 0.06)',
  },
  accountActionBtnWarn: {
    borderColor: 'rgba(234, 179, 8, 0.4)',
    color: '#a16207',
    background: 'rgba(234, 179, 8, 0.08)',
  },
  error: { marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--slogbaa-error)' },
  success: { marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--slogbaa-green)' },
  loading: { padding: '2rem', textAlign: 'center', color: 'var(--slogbaa-text-muted)' },
  // Trainee learning stats & sections
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '1.75rem',
  },
  statCard: {
    padding: '1.25rem 1.5rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  statCardHighlight: {
    borderColor: 'rgba(39, 129, 191, 0.25)',
    background: 'linear-gradient(135deg, rgba(39, 129, 191, 0.06) 0%, rgba(14, 116, 144, 0.04) 100%)',
    boxShadow: '0 2px 8px rgba(39, 129, 191, 0.12)',
  },
  statValue: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--slogbaa-blue)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  statLabel: {
    margin: '0.35rem 0 0',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-text-muted)',
  },
  sectionTitle: {
    margin: '0 0 1rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tableCard: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 14,
    border: '1px solid var(--slogbaa-border)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9375rem',
  },
  tableTh: {
    textAlign: 'left',
    padding: '0.75rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.6875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-text-muted)',
    background: 'rgba(0,0,0,0.03)',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  tableTd: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  tableTrLast: { borderBottom: 'none' },
  progressBarWrap: {
    width: 120,
    height: 8,
    borderRadius: 4,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    background: 'linear-gradient(90deg, var(--slogbaa-teal, #0d9488), var(--slogbaa-blue))',
    transition: 'width 0.2s',
  },
  certBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.6rem',
    borderRadius: 8,
    fontSize: '0.8125rem',
    fontWeight: 600,
    background: 'rgba(34, 197, 94, 0.12)',
    color: 'var(--slogbaa-green)',
  },
  emptyState: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
}

function formatPhone(cc, nn) {
  if (!cc && !nn) return '—'
  return [cc, nn].filter(Boolean).join(' ').trim() || '—'
}

function roleLabel(role) {
  if (role === 'SUPER_ADMIN') return 'Super Admin'
  if (role === 'ADMIN') return 'Admin'
  if (role === 'TRAINEE') return 'Trainee'
  return role ?? '—'
}

export function AdminUserDetailPage() {
  const { userType, userId } = useParams()
  const navigate = useNavigate()
  const { token, isSuperAdmin, currentUserId, refreshOverview } = useOutletContext() || {}
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStaffEditModal, setShowStaffEditModal] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [certificates, setCertificates] = useState([])
  const [traineeDataLoading, setTraineeDataLoading] = useState(false)

  const isStaff = userType === 'staff'
  const isTrainee = userType === 'trainee'

  const loadUser = useCallback(async () => {
    if (!token || !userId) return
    setLoading(true)
    setError(null)
    try {
      if (isStaff) {
        const data = await getStaffProfile(token, userId)
        setUser({ ...data, userType: 'staff' })
      } else if (isTrainee) {
        const data = await getTraineeProfile(token, userId)
        const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.email
        setUser({ ...data, fullName, userType: 'trainee' })
      } else {
        setError('Invalid user type.')
      }
    } catch (e) {
      setError(e?.message ?? 'Failed to load user.')
    } finally {
      setLoading(false)
    }
  }, [token, userId, isStaff, isTrainee])

  useEffect(() => {
    if (!isTrainee || !token || !userId) return
    let cancelled = false
    setTraineeDataLoading(true)
    Promise.all([
      getTraineeEnrolledCourses(token, userId),
      getAdminCertificates(token).catch(() => []),
    ])
      .then(([courses, allCerts]) => {
        if (cancelled) return
        setEnrolledCourses(Array.isArray(courses) ? courses : [])
        const traineeCerts = Array.isArray(allCerts)
          ? allCerts.filter((c) => c.traineeId === userId && !c.revoked)
          : []
        setCertificates(traineeCerts)
      })
      .finally(() => {
        if (!cancelled) setTraineeDataLoading(false)
      })
    return () => { cancelled = true }
  }, [isTrainee, token, userId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)
    if (newPassword.length < 8) {
      setPasswordError('Minimum 8 characters required.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    setActionLoading(true)
    try {
      if (isStaff) await setStaffPassword(token, userId, newPassword)
      else await setTraineePassword(token, userId, newPassword)
      setPasswordSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
    } catch (e) {
      setPasswordError(e?.message ?? 'Failed to update password.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSetActive = async (active) => {
    if (!isStaff) return
    setActionLoading(true)
    try {
      await setStaffActive(token, userId, active)
      setUser((prev) => (prev ? { ...prev, active } : null))
    } catch (e) {
      setError(e?.message ?? 'Failed to update status.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    setActionLoading(true)
    try {
      if (isStaff) {
        await deleteStaff(token, userId)
        await refreshOverview?.()
      } else {
        await deleteTrainee(token, userId)
        await refreshOverview?.()
      }
      navigate('/admin/overview')
    } catch (e) {
      setError(e?.message ?? 'Failed to delete user.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditSave = async (payload) => {
    if (!isTrainee) return
    setActionLoading(true)
    try {
      await updateTraineeProfile(token, userId, payload)
      setUser((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          firstName: payload.firstName ?? prev.firstName,
          lastName: payload.lastName ?? prev.lastName,
          gender: payload.gender ?? prev.gender,
          districtName: payload.districtName ?? prev.districtName,
          region: payload.region ?? prev.region,
          category: payload.category ?? prev.category,
          street: payload.street ?? prev.street,
          city: payload.city ?? prev.city,
          postalCode: payload.postalCode ?? prev.postalCode,
          phoneCountryCode: payload.phoneCountryCode ?? prev.phoneCountryCode,
          phoneNationalNumber: payload.phoneNationalNumber ?? prev.phoneNationalNumber,
          fullName: [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim() || prev.fullName,
        }
      })
      setShowEditModal(false)
    } catch (e) {
      setError(e?.message ?? 'Failed to update profile.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStaffEditSave = async (payload) => {
    if (!isStaff) return
    setActionLoading(true)
    try {
      await updateStaffProfile(token, userId, payload)
      setUser((prev) => (prev ? { ...prev, fullName: payload.fullName, email: payload.email } : null))
      setShowStaffEditModal(false)
    } catch (e) {
      setError(e?.message ?? 'Failed to update profile.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <Link to="/admin/overview" style={styles.backLink}>
          <FontAwesomeIcon icon={icons.viewList} /> Back to Overview
        </Link>
        <p style={styles.loading}>Loading user…</p>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div style={styles.page}>
        <Link to="/admin/overview" style={styles.backLink}>
          <FontAwesomeIcon icon={icons.viewList} /> Back to Overview
        </Link>
        <p style={styles.error}>{error}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={styles.page}>
        <Link to="/admin/overview" style={styles.backLink}>
          <FontAwesomeIcon icon={icons.viewList} /> Back to Overview
        </Link>
        <p style={styles.error}>User not found.</p>
      </div>
    )
  }

  const displayName = user.fullName ?? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ?? user.email ?? '—'
  const roleDisplay = isStaff ? roleLabel(user.role) : 'Trainee'
  const active = isStaff ? user.active : true
  const canDelete = isSuperAdmin && (isStaff ? user.id !== currentUserId : true)
  const canEdit = isTrainee || (isStaff && isSuperAdmin)
  const canChangePassword = isSuperAdmin
  const canToggleActive = isStaff && isSuperAdmin && user.id !== currentUserId

  const pageStyle = isTrainee ? { ...styles.page, maxWidth: 1100 } : styles.page

  return (
    <div style={pageStyle}>
      <Link to="/admin/overview" style={styles.backLink}>
        <FontAwesomeIcon icon={icons.viewList} /> Back to Overview
      </Link>

      {error && (
        <p style={{ ...styles.error, marginBottom: '1rem' }}>{error}</p>
      )}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {user.profileImageUrl ? (
            <img src={getAssetUrl(user.profileImageUrl)} alt="" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              <FontAwesomeIcon icon={icons.users} />
            </div>
          )}
          <div style={styles.nameBlock}>
            <h1 style={styles.userName}>{displayName}</h1>
            <div style={styles.roleStatus}>
              <span>{roleDisplay}</span>
              <span style={{ margin: '0 0.25rem' }}>·</span>
              <span style={{ ...styles.statusDot, ...(active ? {} : styles.statusDotInactive) }} />
              <span style={styles.statusText}>{active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        <div style={styles.headerActions}>
          {canEdit && (
            <button
              type="button"
              style={{ ...styles.actionBtn, ...styles.actionBtnEdit }}
              onClick={() => (isTrainee ? setShowEditModal(true) : setShowStaffEditModal(true))}
              disabled={actionLoading}
            >
              <FontAwesomeIcon icon={icons.edit} /> Edit
            </button>
          )}
          {canToggleActive && (
            active ? (
              <button
                type="button"
                style={{ ...styles.actionBtn, ...styles.actionBtnDeactivate }}
                onClick={() => handleSetActive(false)}
                disabled={actionLoading}
              >
                <FontAwesomeIcon icon={icons.userSlash} /> Deactivate
              </button>
            ) : (
              <button
                type="button"
                style={{ ...styles.actionBtn, ...styles.actionBtnActivate }}
                onClick={() => handleSetActive(true)}
                disabled={actionLoading}
              >
                <FontAwesomeIcon icon={icons.edit} /> Activate
              </button>
            )
          )}
          <button
            type="button"
            style={{ ...styles.actionBtn, ...styles.actionBtnEmail }}
            onClick={() => {}}
            title="Coming soon"
          >
            <FontAwesomeIcon icon={icons.envelope} /> Send Welcome Email
          </button>
          {canDelete && (
            <button
              type="button"
              style={{ ...styles.actionBtn, ...styles.actionBtnDanger }}
              onClick={() => setShowDeleteConfirm(true)}
              disabled={actionLoading}
            >
              <FontAwesomeIcon icon={icons.delete} /> Delete
            </button>
          )}
        </div>
      </header>

      {isTrainee && (
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={styles.statValue}>{traineeDataLoading ? '—' : enrolledCourses.length}</p>
            <p style={styles.statLabel}>Courses enrolled</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>
              {traineeDataLoading ? '—' : enrolledCourses.filter((c) => (c.completionPercentage ?? 0) >= 100).length}
            </p>
            <p style={styles.statLabel}>Courses completed</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{traineeDataLoading ? '—' : certificates.length}</p>
            <p style={styles.statLabel}>Certificates</p>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Profile Information</h2>
            {isTrainee ? (
              <>
                <label style={styles.label}>First Name</label>
                <p style={styles.value}>{user.firstName ?? '—'}</p>
                <label style={styles.label}>Last Name</label>
                <p style={styles.value}>{user.lastName ?? '—'}</p>
                <label style={styles.label}>Email</label>
                <p style={styles.value}>{user.email ?? '—'}</p>
                <label style={styles.label}>Phone</label>
                <p style={styles.value}>{formatPhone(user.phoneCountryCode, user.phoneNationalNumber)}</p>
                <label style={styles.label}>Gender</label>
                <p style={styles.value}>{user.gender ?? '—'}</p>
                {(user.districtName || user.region) && (
                  <>
                    <label style={styles.label}>District / Region</label>
                    <p style={styles.value}>
                      {[user.districtName, user.region].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </>
                )}
                {(user.street || user.city) && (
                  <>
                    <label style={styles.label}>Address</label>
                    <p style={styles.value}>
                      {[user.street, user.city, user.postalCode].filter(Boolean).join(', ') || '—'}
                    </p>
                  </>
                )}
                {user.category && (
                  <>
                    <label style={styles.label}>Category</label>
                    <p style={styles.value}>{user.category}</p>
                  </>
                )}
                <label style={styles.label}>Role</label>
                <p style={styles.value}>
                  <span style={styles.roleBadge}>Trainee</span>
                </p>
              </>
            ) : (
              <>
                <label style={styles.label}>Full Name</label>
                <p style={styles.value}>{user.fullName ?? '—'}</p>
                <label style={styles.label}>Email</label>
                <p style={styles.value}>{user.email ?? '—'}</p>
                <label style={styles.label}>Phone</label>
                <p style={styles.value}>—</p>
                <label style={styles.label}>Biological Sex</label>
                <p style={styles.value}>—</p>
                <label style={styles.label}>Joined</label>
                <p style={styles.value}>—</p>
                <label style={styles.label}>Last Login</label>
                <p style={styles.value}>—</p>
                <label style={styles.label}>Roles</label>
                <p style={styles.value}>
                  <span style={styles.roleBadge}>{roleDisplay}</span>
                </p>
              </>
            )}
          </div>

          {canChangePassword && (
            <div style={{ ...styles.card, marginTop: '1.5rem' }}>
              <h2 style={styles.cardTitle}>Reset Password</h2>
              <form onSubmit={handleUpdatePassword}>
                <label style={styles.label}>New Password *</label>
                <div style={styles.inputWrap}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.input}
                    placeholder="New password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    style={styles.toggleVisibility}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle visibility"
                  >
                    <FontAwesomeIcon icon={showPassword ? icons.eyeSlash : icons.eye} />
                  </button>
                </div>
                <p style={styles.hint}>Minimum 8 characters</p>
                <label style={styles.label}>Confirm Password *</label>
                <div style={styles.inputWrap}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    style={styles.toggleVisibility}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle visibility"
                  >
                    <FontAwesomeIcon icon={showPassword ? icons.eyeSlash : icons.eye} />
                  </button>
                </div>
                <button
                  type="submit"
                  style={{
                    ...styles.btnPrimary,
                    ...(actionLoading ? styles.btnPrimaryDisabled : {}),
                  }}
                  disabled={actionLoading}
                >
                  <FontAwesomeIcon icon={icons.changePassword} /> Update Password
                </button>
                {passwordError && <p style={styles.error}>{passwordError}</p>}
                {passwordSuccess && <p style={styles.success}>Password updated.</p>}
              </form>
            </div>
          )}
        </div>

        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Actions</h2>
            {canEdit && (
              <button
                type="button"
                style={styles.accountActionBtn}
                onClick={() => (isTrainee ? setShowEditModal(true) : setShowStaffEditModal(true))}
                disabled={actionLoading}
              >
                <FontAwesomeIcon icon={icons.editProfile} /> Edit Profile
              </button>
            )}
            {canToggleActive && (
              <button
                type="button"
                style={{ ...styles.accountActionBtn, ...styles.accountActionBtnWarn }}
                onClick={() => handleSetActive(!active)}
                disabled={actionLoading}
              >
                <FontAwesomeIcon icon={icons.userSlash} />
                {active ? 'Deactivate Account' : 'Activate Account'}
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                style={{ ...styles.accountActionBtn, ...styles.accountActionBtnDanger }}
                onClick={() => setShowDeleteConfirm(true)}
                disabled={actionLoading}
              >
                <FontAwesomeIcon icon={icons.delete} /> Delete User
              </button>
            )}
            {!canEdit && !canToggleActive && !canDelete && (
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
                No actions available for this user.
              </p>
            )}
          </div>
        </div>
      </div>

      {isTrainee && (
        <>
          <section style={{ marginTop: '0.5rem' }}>
            <h2 style={styles.sectionTitle}>
              <FontAwesomeIcon icon={icons.course} style={{ color: 'var(--slogbaa-blue)' }} />
              Courses
            </h2>
            <div style={styles.tableCard}>
              {traineeDataLoading ? (
                <p style={styles.emptyState}>Loading courses…</p>
              ) : enrolledCourses.length === 0 ? (
                <p style={styles.emptyState}>No courses enrolled yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>Course</th>
                      <th style={styles.tableTh}>Modules</th>
                      <th style={styles.tableTh}>Progress</th>
                      <th style={styles.tableTh}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledCourses.map((c, i) => {
                      const completed = (c.completionPercentage ?? 0) >= 100
                      return (
                        <tr
                          key={c.id}
                          style={i === enrolledCourses.length - 1 ? styles.tableTrLast : undefined}
                        >
                          <td style={styles.tableTd}>
                            <span style={{ fontWeight: 600, color: 'var(--slogbaa-text)' }}>
                              {c.title ?? 'Untitled'}
                            </span>
                          </td>
                          <td style={styles.tableTd}>{c.moduleCount ?? 0}</td>
                          <td style={styles.tableTd}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={styles.progressBarWrap}>
                                <div
                                  style={{
                                    ...styles.progressBarFill,
                                    width: `${Math.min(100, c.completionPercentage ?? 0)}%`,
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)', minWidth: '2.5rem' }}>
                                {c.completionPercentage ?? 0}%
                              </span>
                            </div>
                          </td>
                          <td style={styles.tableTd}>
                            {completed ? (
                              <span style={styles.certBadge}>
                                <FontAwesomeIcon icon={icons.enrolled} /> Completed
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
                                In progress
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section>
            <h2 style={styles.sectionTitle}>
              <FontAwesomeIcon icon={icons.certificate} style={{ color: 'var(--slogbaa-orange)' }} />
              Certifications
            </h2>
            <div style={styles.tableCard}>
              {traineeDataLoading ? (
                <p style={styles.emptyState}>Loading certificates…</p>
              ) : certificates.length === 0 ? (
                <p style={styles.emptyState}>No certificates earned yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>Course</th>
                      <th style={styles.tableTh}>Certificate number</th>
                      <th style={styles.tableTh}>Issued</th>
                      <th style={styles.tableTh}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert, i) => (
                      <tr
                        key={cert.id}
                        style={i === certificates.length - 1 ? styles.tableTrLast : undefined}
                      >
                        <td style={styles.tableTd}>{cert.courseTitle ?? '—'}</td>
                        <td style={styles.tableTd}>
                          <code style={{ fontSize: '0.8125rem', background: 'rgba(0,0,0,0.06)', padding: '0.2rem 0.5rem', borderRadius: 6 }}>
                            {cert.certificateNumber ?? '—'}
                          </code>
                        </td>
                        <td style={styles.tableTd}>{cert.issuedDate ?? '—'}</td>
                        <td style={styles.tableTd}>{cert.finalScorePercent != null ? `${cert.finalScorePercent}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </>
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          message={
            isStaff
              ? `Delete staff "${user.fullName}" (${user.email})? This cannot be undone.`
              : `Delete trainee "${displayName}" (${user.email})? This cannot be undone.`
          }
          onContinue={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showEditModal && isTrainee && (
        <EditTraineeProfileModal
          profile={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          disabled={actionLoading}
        />
      )}

      {showStaffEditModal && isStaff && (
        <EditStaffProfileModal
          profile={user}
          onClose={() => setShowStaffEditModal(false)}
          onSave={handleStaffEditSave}
          disabled={actionLoading}
        />
      )}
    </div>
  )
}

function EditTraineeProfileModal({ profile, onClose, onSave, disabled }) {
  const [form, setForm] = useState({
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    gender: profile?.gender ?? '',
    districtName: profile?.districtName ?? '',
    region: profile?.region ?? '',
    category: profile?.category ?? '',
    street: profile?.street ?? '',
    city: profile?.city ?? '',
    postalCode: profile?.postalCode ?? '',
    phoneCountryCode: profile?.phoneCountryCode ?? '',
    phoneNationalNumber: profile?.phoneNationalNumber ?? '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Modal onClose={onClose} title="Edit profile">
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>First Name</label>
        <input
          type="text"
          value={form.firstName}
          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          style={styles.input}
          required
        />
        <label style={styles.label}>Last Name</label>
        <input
          type="text"
          value={form.lastName}
          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          style={styles.input}
          required
        />
        <label style={styles.label}>Gender</label>
        <input
          type="text"
          value={form.gender}
          onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
          style={styles.input}
          required
        />
        <label style={styles.label}>District</label>
        <input
          type="text"
          value={form.districtName}
          onChange={(e) => setForm((f) => ({ ...f, districtName: e.target.value }))}
          style={styles.input}
          required
        />
        <label style={styles.label}>Region</label>
        <input type="text" value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} style={styles.input} />
        <label style={styles.label}>Category</label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          style={styles.input}
          required
        />
        <label style={styles.label}>Street</label>
        <input type="text" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} style={styles.input} />
        <label style={styles.label}>City</label>
        <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} style={styles.input} />
        <label style={styles.label}>Postal Code</label>
        <input type="text" value={form.postalCode} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} style={styles.input} />
        <label style={styles.label}>Phone (country code)</label>
        <input type="text" value={form.phoneCountryCode} onChange={(e) => setForm((f) => ({ ...f, phoneCountryCode: e.target.value }))} style={styles.input} />
        <label style={styles.label}>Phone (national number)</label>
        <input type="text" value={form.phoneNationalNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNationalNumber: e.target.value }))} style={styles.input} />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" style={styles.actionBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" style={styles.btnPrimary} disabled={disabled}>
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  )
}

function EditStaffProfileModal({ profile, onClose, onSave, disabled }) {
  const [form, setForm] = useState({
    fullName: profile?.fullName ?? '',
    email: profile?.email ?? '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Modal onClose={onClose} title="Edit staff profile">
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          style={styles.input}
          required
        />
        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          style={styles.input}
          required
        />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" style={styles.actionBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" style={styles.btnPrimary} disabled={disabled}>
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  )
}
