import { useState, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'
import { ProfileViewModal } from '../components/trainee/ProfileViewModal.jsx'
import { getTraineeProfile as getTraineeProfileApi, getTraineeEnrolledCourses } from '../../../api/admin/trainees.js'

const styles = {
  pageTitle: {
    margin: '0 0 1rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--slogbaa-orange)',
    letterSpacing: '-0.02em',
  },
  section: {
    marginBottom: '2.25rem',
  },
  sectionTitle: {
    margin: '0 0 1rem',
    fontSize: '1.375rem',
    fontWeight: 700,
    color: 'var(--slogbaa-orange)',
    letterSpacing: '-0.01em',
  },
  subsectionTitle: {
    margin: '1.25rem 0 0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  subsectionTitleFirst: { margin: '0 0 0.5rem' },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  statCard: {
    padding: '1.5rem 1.5rem',
    background: 'var(--slogbaa-surface)',
    border: '2px solid var(--slogbaa-border)',
    borderRadius: 14,
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
    textAlign: 'center',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  statCardHighlight: {
    borderColor: 'rgba(241, 134, 37, 0.5)',
    background: 'rgba(241, 134, 37, 0.06)',
    boxShadow: '0 4px 14px rgba(241, 134, 37, 0.15)',
  },
  statValue: {
    margin: 0,
    fontSize: '2.25rem',
    fontWeight: 800,
    color: 'var(--slogbaa-blue)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  statValueMuted: {
    margin: 0,
    fontSize: '2.25rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.2,
  },
  statLabel: {
    margin: '0.5rem 0 0',
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-text-muted)',
  },
  tableWrap: {
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    background: 'var(--slogbaa-surface)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9375rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.875rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.8125rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#fff',
    background: 'var(--slogbaa-dark)',
    borderBottom: '3px solid var(--slogbaa-orange)',
  },
  thFirst: { borderTopLeftRadius: 11 },
  thLast: { borderTopRightRadius: 11 },
  td: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  trStriped: { background: 'rgba(241, 134, 37, 0.04)' },
  trLast: { borderBottom: 'none' },
  empty: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  viewProfileBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginRight: '0.35rem',
    background: 'rgba(39, 129, 191, 0.12)',
    color: 'var(--slogbaa-blue, #2781bf)',
  },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginRight: '0.35rem',
    background: 'rgba(200, 60, 60, 0.12)',
    color: 'var(--slogbaa-error, #c0392b)',
  },
  loading: {
    padding: '1rem',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  error: {
    padding: '1rem',
    color: 'var(--slogbaa-error)',
    fontSize: '0.9375rem',
  },
}

export function AdminOverviewPage() {
  const { staff, trainees, courseCount = 0, overviewLoading, overviewError, handleDeleteStaff, handleDeleteTrainee, isSuperAdmin, token, currentUserId, currentUserEmail } = useOutletContext()
  const [deleteError, setDeleteError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null) // { type: 'staff', item } | { type: 'trainee', item }
  const [profileViewTrainee, setProfileViewTrainee] = useState(null)
  const [profileViewEnrolledCourses, setProfileViewEnrolledCourses] = useState([])
  const [profileViewLoading, setProfileViewLoading] = useState(false)
  const [profileViewError, setProfileViewError] = useState(null)

  const runDeleteStaff = async (s) => {
    setConfirmTarget(null)
    setDeleteError(null)
    setDeletingId(s.id)
    try {
      await handleDeleteStaff?.(s.id)
    } catch (err) {
      setDeleteError(err?.message ?? 'Failed to delete staff.')
    } finally {
      setDeletingId(null)
    }
  }

  const runDeleteTrainee = async (t) => {
    setConfirmTarget(null)
    setDeleteError(null)
    setDeletingId(t.id)
    try {
      await handleDeleteTrainee?.(t.id)
    } catch (err) {
      setDeleteError(err?.message ?? 'Failed to delete trainee.')
    } finally {
      setDeletingId(null)
    }
  }

  const onDeleteStaff = (s) => {
    setConfirmTarget({ type: 'staff', item: s })
  }

  const onDeleteTrainee = (t) => {
    setConfirmTarget({ type: 'trainee', item: t })
  }

  const onViewTraineeProfile = useCallback((t) => {
    setProfileViewTrainee(null)
    setProfileViewEnrolledCourses([])
    setProfileViewError(null)
    if (!token) return
    setProfileViewLoading(true)
    getTraineeProfileApi(token, t.id)
      .then((profile) => {
        setProfileViewTrainee(profile)
        setProfileViewLoading(false)
        const traineeId = profile?.id ?? t.id
        return getTraineeEnrolledCourses(token, traineeId)
      })
      .then((enrolled) => {
        if (enrolled !== undefined) {
          setProfileViewEnrolledCourses(Array.isArray(enrolled) ? enrolled : [])
        }
      })
      .catch((err) => {
        setProfileViewError(err?.message ?? 'Failed to load trainee profile.')
        setProfileViewLoading(false)
      })
  }, [token])

  const closeProfileView = useCallback(() => {
    setProfileViewTrainee(null)
    setProfileViewEnrolledCourses([])
    setProfileViewError(null)
  }, [])

  if (overviewLoading) {
    return (
      <>
        <h2 style={styles.pageTitle}>Overview</h2>
        <p style={styles.loading}>Loading dashboard…</p>
      </>
    )
  }

  if (overviewError) {
    return (
      <>
        <h2 style={styles.pageTitle}>Overview</h2>
        <p style={styles.error}>{overviewError}</p>
      </>
    )
  }

  const confirmMessage = confirmTarget
    ? confirmTarget.type === 'staff'
      ? `Delete staff "${confirmTarget.item.fullName}" (${confirmTarget.item.email})? This cannot be undone.`
      : `Delete trainee "${confirmTarget.item.fullName}" (${confirmTarget.item.email})? This cannot be undone.`
    : ''

  return (
    <>
      <h2 style={styles.pageTitle}>Overview</h2>

      {confirmTarget && (
        <ConfirmModal
          message={confirmMessage}
          onContinue={() =>
            confirmTarget.type === 'staff'
              ? runDeleteStaff(confirmTarget.item)
              : runDeleteTrainee(confirmTarget.item)
          }
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      {profileViewTrainee && (
        <ProfileViewModal
          profile={profileViewTrainee}
          enrolledCourses={Array.isArray(profileViewEnrolledCourses) ? profileViewEnrolledCourses : []}
          onClose={closeProfileView}
          showEditButton={false}
          title="Trainee profile"
        />
      )}
      {profileViewLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          fontSize: '0.9375rem',
          color: 'var(--slogbaa-text)',
        }}>
          Loading profile…
        </div>
      )}
      {profileViewError && !profileViewTrainee && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '1.5rem',
        }}>
          <div style={{
            background: 'var(--slogbaa-surface)',
            padding: '1.5rem',
            borderRadius: 12,
            maxWidth: 400,
            border: '1px solid var(--slogbaa-border)',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slogbaa-text)' }}>
              Couldn't load trainee profile
            </p>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-error)' }}>{profileViewError}</p>
            <button type="button" onClick={closeProfileView} style={{ marginTop: '1.25rem', padding: '0.5rem 1rem', border: '1px solid var(--slogbaa-border)', borderRadius: 8, background: 'var(--slogbaa-surface)', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      <section style={styles.section}>
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={styles.statValue}>{staff.length}</p>
            <p style={styles.statLabel}>Staff</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={styles.statValue}>{trainees.length}</p>
            <p style={styles.statLabel}>Trainees</p>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardHighlight }}>
            <p style={styles.statValue}>{courseCount}</p>
            <p style={styles.statLabel}>Courses</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValueMuted}>0</p>
            <p style={styles.statLabel}>Certificates</p>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>People</h2>
        {deleteError && (
          <p style={{ ...styles.error, marginBottom: '1rem' }}>{deleteError}</p>
        )}

        <h3 style={{ ...styles.subsectionTitle, ...styles.subsectionTitleFirst }}>Staff</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.thFirst }}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={isSuperAdmin ? styles.th : { ...styles.th, ...styles.thLast }}>Role</th>
                {isSuperAdmin && <th style={{ ...styles.th, ...styles.thLast }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 4 : 3} style={styles.empty}>
                    No staff yet. Use Quick Actions → Create Staff to add.
                  </td>
                </tr>
              ) : (
                staff.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      ...(i === staff.length - 1 ? styles.trLast : {}),
                      ...(i % 2 === 1 ? styles.trStriped : {}),
                    }}
                  >
                    <td style={styles.td}>
                      <Link to={`/admin/users/staff/${s.id}`} style={{ color: 'var(--slogbaa-blue)', fontWeight: 600, textDecoration: 'none' }}>
                        {s.fullName}
                      </Link>
                    </td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</td>
                    {isSuperAdmin && (
                      <td style={styles.td}>
                        <Link
                          to={`/admin/users/staff/${s.id}`}
                          style={styles.viewProfileBtn}
                          title="View / manage staff"
                        >
                          <FontAwesomeIcon icon={icons.eye} />
                        </Link>
                        {(s.id !== currentUserId && s.email !== currentUserEmail) ? (
                          <button
                            type="button"
                            style={styles.deleteBtn}
                            onClick={() => onDeleteStaff(s)}
                            disabled={deletingId === s.id}
                            title="Delete staff"
                          >
                            <FontAwesomeIcon icon={icons.delete} />
                          </button>
                        ) : null}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 style={styles.subsectionTitle}>Trainees</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.thFirst }}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>District</th>
                <th style={{ ...styles.th, ...styles.thLast }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainees.length === 0 ? (
                <tr>
                  <td colSpan={4} style={styles.empty}>
                    No trainees registered yet.
                  </td>
                </tr>
              ) : (
                trainees.map((t, i) => (
                  <tr
                    key={t.id}
                    style={{
                      ...(i === trainees.length - 1 ? styles.trLast : {}),
                      ...(i % 2 === 1 ? styles.trStriped : {}),
                    }}
                  >
                    <td style={styles.td}>
                      <Link to={`/admin/users/trainee/${t.id}`} style={{ color: 'var(--slogbaa-blue)', fontWeight: 600, textDecoration: 'none' }}>
                        {t.fullName}
                      </Link>
                    </td>
                    <td style={styles.td}>{t.email}</td>
                    <td style={styles.td}>{t.districtName ?? t.district ?? '—'}</td>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/users/trainee/${t.id}`}
                        style={styles.viewProfileBtn}
                        title="View / manage trainee"
                      >
                        <FontAwesomeIcon icon={icons.eye} />
                      </Link>
                      <button
                        type="button"
                        style={styles.viewProfileBtn}
                        onClick={() => onViewTraineeProfile(t)}
                        disabled={profileViewLoading}
                        title="View profile (quick view)"
                      >
                        <FontAwesomeIcon icon={icons.viewProfile} />
                      </button>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          style={styles.deleteBtn}
                          onClick={() => onDeleteTrainee(t)}
                          disabled={deletingId === t.id}
                          title="Delete trainee"
                        >
                          <FontAwesomeIcon icon={icons.delete} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
