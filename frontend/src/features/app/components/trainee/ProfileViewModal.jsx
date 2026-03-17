import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'
import { Modal } from '../../../../shared/components/Modal.jsx'
import { getAssetUrl } from '../../../../api/client.js'

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
    background: 'var(--slogbaa-blue)',
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
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  courseRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  courseRowLast: { borderBottom: 'none' },
  courseThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    objectFit: 'cover',
    background: 'var(--slogbaa-border)',
    flexShrink: 0,
  },
  courseThumbPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    background: 'var(--slogbaa-border)',
    flexShrink: 0,
  },
  courseInfo: { flex: 1, minWidth: 0 },
  courseTitle: { margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slogbaa-text)' },
  courseProgress: { margin: '0.15rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' },
  learningStats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
  },
  learningSectionWrap: {
    marginBottom: '1.25rem',
    padding: '1rem 1.25rem',
    background: 'rgba(37, 99, 235, 0.08)',
    border: '1px solid rgba(37, 99, 235, 0.35)',
    borderRadius: 12,
  },
  learningStatCard: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0.6rem 1rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    minWidth: 140,
  },
  learningStatValue: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-blue)',
    lineHeight: 1.2,
  },
  learningStatLabel: {
    margin: '0.2rem 0 0',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--slogbaa-text-muted)',
  },
  learningListTitle: {
    margin: '0.75rem 0 0.4rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
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

export function ProfileViewModal({ profile, onClose, onEdit, showEditButton = true, title = 'My Profile', enrolledCourses }) {
  if (!profile) return null

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || '—'
  const hasImage = profile.profileImageUrl && profile.profileImageUrl.trim()
  const courses = Array.isArray(enrolledCourses) ? enrolledCourses : []
  const completedCount = courses.filter((c) => (c.completionPercentage ?? 0) >= 100).length
  // Always show Learning for admin "Trainee profile" view; otherwise when enrolled data was provided
  const showLearning = title === 'Trainee profile' || enrolledCourses !== undefined

  return (
    <Modal title={title} onClose={onClose}>
      <div style={styles.profileHeader}>
        {hasImage ? (
          <img
            src={getAssetUrl(profile.profileImageUrl)}
            alt={`Profile photo: ${profile.firstName ?? ''} ${profile.lastName ?? ''}`}
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
          {(profile.phoneCountryCode && profile.phoneNationalNumber) ? (
            <div style={styles.field}>
              <p style={styles.value}><strong>Phone</strong> {profile.phoneCountryCode} {profile.phoneNationalNumber}</p>
            </div>
          ) : null}
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

      {showLearning && (
        <div style={styles.learningSectionWrap}>
          <p style={{ ...styles.sectionTitle, marginBottom: '0.75rem' }}>Learning</p>
          <div style={styles.learningStats}>
            <div style={styles.learningStatCard}>
              <span style={styles.learningStatValue}>{courses.length}</span>
              <span style={styles.learningStatLabel}>Courses enrolled</span>
            </div>
            <div style={styles.learningStatCard}>
              <span style={styles.learningStatValue}>{completedCount}</span>
              <span style={styles.learningStatLabel}>Courses completed</span>
            </div>
          </div>
          {courses.length > 0 ? (
            <>
              <p style={styles.learningListTitle}>Enrolled courses</p>
              <div>
              {courses.map((course, idx) => (
                <div
                  key={course.id || idx}
                  style={{
                    ...styles.courseRow,
                    ...(idx === courses.length - 1 ? styles.courseRowLast : {}),
                  }}
                >
                  {course.imageUrl ? (
                    <img
                      src={getAssetUrl(course.imageUrl)}
                      alt={`Course: ${course.title ?? ''}`}
                      style={styles.courseThumb}
                    />
                  ) : (
                    <div style={styles.courseThumbPlaceholder} />
                  )}
                  <div style={styles.courseInfo}>
                    <p style={styles.courseTitle}>{course.title || 'Untitled course'}</p>
                    <p style={styles.courseProgress}>
                      Progress: {course.completionPercentage ?? 0}%
                      {(course.completionPercentage ?? 0) >= 100 ? ' · Completed' : ''}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            </>
          ) : (
            <p style={{ ...styles.value, margin: '0.5rem 0 0' }}>No courses enrolled yet.</p>
          )}
        </div>
      )}

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
