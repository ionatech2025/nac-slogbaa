import { useOutletContext } from 'react-router-dom'

const MOCK_TRAINEES = [
  { id: 't1', fullName: 'Samuel Okello', email: 'samuel@example.org', district: 'Kampala' },
  { id: 't2', fullName: 'Grace Akello', email: 'grace@example.org', district: 'Gulu' },
]

const styles = {
  greeting: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  greetingDivider: {
    height: 0,
    border: 'none',
    borderBottom: '2px solid var(--slogbaa-orange)',
    margin: '0 0 1.5rem',
  },
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
}

export function AdminOverviewPage() {
  const { staff, displayName } = useOutletContext()

  return (
    <>
      <h1 style={styles.greeting}>Welcome back, {displayName}! 👋</h1>
      <hr style={styles.greetingDivider} aria-hidden />
      <h2 style={styles.pageTitle}>Overview</h2>

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

        <h3 style={{ ...styles.subsectionTitle, ...styles.subsectionTitleFirst }}>Staff</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.thFirst }}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={{ ...styles.th, ...styles.thLast }}>Role</th>
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
                  <tr
                    key={s.id}
                    style={{
                      ...(i === staff.length - 1 ? styles.trLast : {}),
                      ...(i % 2 === 1 ? styles.trStriped : {}),
                    }}
                  >
                    <td style={styles.td}>{s.fullName}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</td>
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
                <th style={{ ...styles.th, ...styles.thLast }}>District</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRAINEES.map((t, i) => (
                <tr
                  key={t.id}
                  style={{
                    ...(i === MOCK_TRAINEES.length - 1 ? styles.trLast : {}),
                    ...(i % 2 === 1 ? styles.trStriped : {}),
                  }}
                >
                  <td style={styles.td}>{t.fullName}</td>
                  <td style={styles.td}>{t.email}</td>
                  <td style={styles.td}>{t.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
