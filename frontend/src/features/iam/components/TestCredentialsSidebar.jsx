/**
 * Test credentials from seed data (V7__seed_sample_data.sql).
 * Use these for manual testing until the backend auth is implemented.
 * Passwords in seed are placeholders — set a known password (e.g. "password") in backend for dev.
 */
const TEST_ACCOUNTS = [
  {
    role: 'Trainee',
    email: 'jane.akello@example.com',
    password: 'trainee1',
    note: 'Trainee (Leader, Kampala)',
  },
  {
    role: 'Trainee',
    email: 'john.ocen@example.com',
    password: 'trainee2',
    note: 'Trainee (Civil Society Member, Gulu)',
  },
  {
    role: 'SuperAdmin',
    email: 'superadmin@slogbaa.nac.go.ug',
    password: 'superadmin123',
    note: 'Full access; manages content and users',
  },
  {
    role: 'Admin',
    email: 'admin@slogbaa.nac.go.ug',
    password: 'admin123',
    note: 'Read-only, filtering and reports',
  },
]

const styles = {
  sidebar: {
    width: 320,
    minHeight: '100vh',
    padding: '1.5rem',
    background: 'var(--slogbaa-dark)',
    color: '#fff',
    fontSize: '0.875rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.7)',
  },
  heading: {
    margin: '0 0 1rem',
    fontSize: '1rem',
    fontWeight: 600,
  },
  block: {
    marginBottom: '1.25rem',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
  },
  role: {
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  row: {
    marginTop: '0.25rem',
    wordBreak: 'break-all',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    marginRight: '0.25rem',
  },
  note: {
    marginTop: '0.5rem',
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.8)',
  },
  hint: {
    marginTop: '1.5rem',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.85)',
  },
}

export function TestCredentialsSidebar() {
  // Only render in development mode — never expose credentials in production
  if (!import.meta.env.DEV) return null

  return (
    <aside style={styles.sidebar}>
      <p style={styles.title}>For testers</p>
      <h2 style={styles.heading}>Test login credentials</h2>
      <p style={{ margin: '0 0 1rem', color: 'rgba(255,255,255,0.85)' }}>
        From seed data. Backend must use matching passwords (e.g. &quot;password&quot;) in dev.
      </p>
      {TEST_ACCOUNTS.map((acc) => (
        <div key={acc.email} style={styles.block}>
          <div style={styles.role}>{acc.role}</div>
          <div style={styles.row}>
            <span style={styles.label}>Email:</span>
            <span>{acc.email}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Password:</span>
            <span>{acc.password}</span>
          </div>
          <div style={styles.note}>{acc.note}</div>
        </div>
      ))}
      <div style={styles.hint}>
        Other trainees: john.ocen@example.com, mary.nabukenya@example.com.
      </div>
    </aside>
  )
}
