import { FontAwesomeIcon, icons } from '../../../../shared/icons.js'
import { Modal } from '../../../../shared/components/Modal.jsx'

const styles = {
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    background: 'var(--slogbaa-border)',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
  },
  fullName: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  email: {
    margin: '0.25rem 0 0',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  section: {
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-text-muted)',
  },
  value: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  field: {
    flex: '1 1 140px',
    minWidth: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
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
}

function getInitials(profile) {
  if (profile?.firstName && profile?.lastName) {
    return (profile.firstName[0] + profile.lastName[0]).toUpperCase()
  }
  if (profile?.firstName) return profile.firstName.slice(0, 2).toUpperCase()
  if (profile?.email) return profile.email.slice(0, 2).toUpperCase()
  return '?'
}

function formatCategory(cat) {
  if (!cat) return '—'
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function ProfileViewModal({ profile, onClose, onEdit, showEditButton = true, title = 'My Profile' }) {
  if (!profile) return null

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || '—'
  const hasImage = profile.profileImageUrl && profile.profileImageUrl.trim()

  return (
    <Modal title={title} onClose={onClose}>
      <div style={styles.profileHeader}>
        {hasImage ? (
          <img
            src={profile.profileImageUrl}
            alt=""
            style={styles.avatar}
          />
        ) : (
          <div style={styles.avatarPlaceholder}>{getInitials(profile)}</div>
        )}
        <div style={styles.nameBlock}>
          <h3 style={styles.fullName}>{fullName}</h3>
          <p style={styles.email}>{profile.email}</p>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>Personal</p>
        <div style={styles.row}>
          <div style={styles.field}>
            <p style={styles.value}><strong>Gender</strong> {profile.gender ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase() : '—'}</p>
          </div>
          <div style={styles.field}>
            <p style={styles.value}><strong>Category</strong> {formatCategory(profile.category)}</p>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>Location</p>
        <div style={styles.row}>
          <div style={styles.field}>
            <p style={styles.value}><strong>District</strong> {profile.districtName || '—'}</p>
          </div>
          <div style={styles.field}>
            <p style={styles.value}><strong>Region</strong> {profile.region || '—'}</p>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>Address</p>
        <p style={styles.value}>
          {[profile.street, profile.city, profile.postalCode].filter(Boolean).join(', ') || '—'}
        </p>
      </div>

      <div style={styles.actions}>
        <button type="button" style={styles.btnSecondary} onClick={onClose}>
          Close
        </button>
        {showEditButton && onEdit && (
          <button type="button" style={styles.btnPrimary} onClick={onEdit}>
            <FontAwesomeIcon icon={icons.editProfile} />
            Edit Profile
          </button>
        )}
      </div>
    </Modal>
  )
}
