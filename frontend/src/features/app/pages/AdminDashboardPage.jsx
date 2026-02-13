import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { AdminNav } from '../components/admin/AdminNav.jsx'
import { CreateStaffModal } from '../components/admin/CreateStaffModal.jsx'
import { UpdateCoursesModal } from '../components/admin/UpdateCoursesModal.jsx'

// Mock data until backend APIs exist
const MOCK_STAFF = [
  { id: 's1', fullName: 'Admin User', email: 'admin@slogbaa.org', role: 'ADMIN' },
  { id: 's2', fullName: 'Super Admin', email: 'superadmin@slogbaa.org', role: 'SUPER_ADMIN' },
]
const MOCK_TRAINEES = [
  { id: 't1', fullName: 'Samuel Okello', email: 'samuel@example.org', district: 'Kampala' },
  { id: 't2', fullName: 'Grace Akello', email: 'grace@example.org', district: 'Gulu' },
]

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--slogbaa-bg)',
  },
  body: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: 'var(--slogbaa-surface)',
    borderRight: '1px solid var(--slogbaa-border)',
    padding: '1.25rem 0',
  },
  sidebarTitle: {
    margin: '0 1rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-text-muted)',
  },
  sidebarBtn: {
    display: 'block',
    width: '100%',
    padding: '0.6rem 1rem',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  sidebarBtnHover: {
    background: 'rgba(39, 129, 191, 0.08)',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem 2rem',
    maxWidth: 1000,
    margin: '0 auto',
    width: '100%',
  },
  pageTitle: {
    margin: '0 0 1.5rem',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    margin: '0 0 1rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    padding: '1rem 1.25rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  statValue: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-blue)',
  },
  statLabel: {
    margin: '0.25rem 0 0',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  tableWrap: {
    overflow: 'auto',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    background: 'var(--slogbaa-surface)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9375rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    background: 'rgba(0,0,0,0.03)',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  td: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  trLast: {
    borderBottom: 'none',
  },
  empty: {
    padding: '1.5rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
}

export function AdminDashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const [staff, setStaff] = useState(MOCK_STAFF)
  const [modal, setModal] = useState(null) // 'createStaff' | 'updateCourses' | null

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  const roleUpper = user.role && String(user.role).toUpperCase()
  const isSuperAdmin = roleUpper === 'SUPER_ADMIN'
  const isAdmin = roleUpper === 'ADMIN' || isSuperAdmin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  const handleCreateStaff = async (data) => {
    // TODO: call API when backend is ready
    setStaff((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      },
    ])
  }

  return (
    <div style={styles.layout}>
      <AdminNav />
      <div style={styles.body}>
        {isSuperAdmin && (
          <aside style={styles.sidebar}>
            <p style={styles.sidebarTitle}>Quick Actions</p>
            <button
              type="button"
              style={styles.sidebarBtn}
              onClick={() => setModal('updateCourses')}
            >
              Update Courses
            </button>
            <button
              type="button"
              style={styles.sidebarBtn}
              onClick={() => setModal('createStaff')}
            >
              Create Staff
            </button>
          </aside>
        )}
        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Overview</h1>

          <section style={styles.section}>
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <p style={styles.statValue}>{staff.length}</p>
                <p style={styles.statLabel}>Staff</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statValue}>{MOCK_TRAINEES.length}</p>
                <p style={styles.statLabel}>Trainees</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statValue}>—</p>
                <p style={styles.statLabel}>Courses</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statValue}>—</p>
                <p style={styles.statLabel}>Certificates</p>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>People</h2>

            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' }}>
              Staff
            </h3>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={styles.empty}>
                        No staff yet. Use Quick Actions → Create Staff to add.
                      </td>
                    </tr>
                  ) : (
                    staff.map((s, i) => (
                      <tr key={s.id} style={i === staff.length - 1 ? styles.trLast : {}}>
                        <td style={styles.td}>{s.fullName}</td>
                        <td style={styles.td}>{s.email}</td>
                        <td style={styles.td}>{s.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <h3 style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' }}>
              Trainees
            </h3>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>District</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TRAINEES.map((t, i) => (
                    <tr key={t.id} style={i === MOCK_TRAINEES.length - 1 ? styles.trLast : {}}>
                      <td style={styles.td}>{t.fullName}</td>
                      <td style={styles.td}>{t.email}</td>
                      <td style={styles.td}>{t.district}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {modal === 'createStaff' && (
        <CreateStaffModal
          onClose={() => setModal(null)}
          onSubmit={handleCreateStaff}
        />
      )}
      {modal === 'updateCourses' && (
        <UpdateCoursesModal onClose={() => setModal(null)} />
      )}
    </div>
  )
}
