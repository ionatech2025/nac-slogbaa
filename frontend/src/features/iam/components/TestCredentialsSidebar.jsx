import { useState } from 'react'

/**
 * Test credentials from seed data (V7__seed_sample_data.sql).
 * Glassmorphic sidebar — 2026 design with frosted glass credential cards.
 */
const TEST_ACCOUNTS = [
  {
    role: 'Trainee',
    email: 'jane.akello@example.com',
    password: 'trainee1',
    note: 'Leader, Kampala',
    colorKey: 'blue',
  },
  {
    role: 'Trainee',
    email: 'john.ocen@example.com',
    password: 'trainee2',
    note: 'Civil Society Member, Gulu',
    colorKey: 'blue',
  },
  {
    role: 'SuperAdmin',
    email: 'superadmin@slogbaa.nac.go.ug',
    password: 'superadmin123',
    note: 'Full access — content & users',
    colorKey: 'green',
  },
  {
    role: 'Admin',
    email: 'admin@slogbaa.nac.go.ug',
    password: 'admin123',
    note: 'Read-only, reports & filtering',
    colorKey: 'orange',
  },
]

/* Map role colors to design system tokens (--slogbaa-blue/green/orange) */
const ROLE_COLORS = {
  blue: {
    cardBg: 'color-mix(in srgb, var(--slogbaa-blue) 18%, transparent)',
    cardBorder: 'color-mix(in srgb, var(--slogbaa-blue) 25%, transparent)',
    badgeBg: 'color-mix(in srgb, var(--slogbaa-blue) 15%, transparent)',
    badgeBorder: 'color-mix(in srgb, var(--slogbaa-blue) 30%, transparent)',
    badgeText: 'var(--slogbaa-blue)',
  },
  green: {
    cardBg: 'color-mix(in srgb, var(--slogbaa-green) 15%, transparent)',
    cardBorder: 'color-mix(in srgb, var(--slogbaa-green) 25%, transparent)',
    badgeBg: 'color-mix(in srgb, var(--slogbaa-green) 12%, transparent)',
    badgeBorder: 'color-mix(in srgb, var(--slogbaa-green) 30%, transparent)',
    badgeText: 'var(--slogbaa-green)',
  },
  orange: {
    cardBg: 'color-mix(in srgb, var(--slogbaa-orange) 12%, transparent)',
    cardBorder: 'color-mix(in srgb, var(--slogbaa-orange) 20%, transparent)',
    badgeBg: 'color-mix(in srgb, var(--slogbaa-orange) 12%, transparent)',
    badgeBorder: 'color-mix(in srgb, var(--slogbaa-orange) 25%, transparent)',
    badgeText: 'var(--slogbaa-orange)',
  },
}

const styles = {
  sidebar: {
    width: 340,
    minHeight: '100vh',
    padding: '2rem 1.5rem',
    color: '#fff',
    fontSize: '0.875rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    marginBottom: '1.5rem',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    margin: '0 0 0.5rem',
    padding: '0.3rem 0.75rem',
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.9)',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--slogbaa-green)',
    boxShadow: '0 0 6px color-mix(in srgb, var(--slogbaa-green) 60%, transparent)',
  },
  heading: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: '#fff',
  },
  description: {
    margin: 0,
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.5,
  },
  accountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1,
  },
  block: {
    padding: '0.875rem',
    borderRadius: 14,
    border: '1px solid',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    cursor: 'default',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  blockHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  roleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  badge: {
    display: 'inline-flex',
    padding: '0.175rem 0.55rem',
    fontSize: '0.6875rem',
    fontWeight: 600,
    borderRadius: 6,
    border: '1px solid',
    letterSpacing: '0.02em',
  },
  row: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.35rem',
    marginTop: '0.3rem',
    fontSize: '0.8125rem',
    wordBreak: 'break-all',
  },
  label: {
    flexShrink: 0,
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  value: {
    color: 'rgba(255,255,255,0.95)',
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    fontSize: '0.8125rem',
  },
  note: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.4,
  },
  footer: {
    marginTop: '1.25rem',
    padding: '0.75rem',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.5,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
}

function AccountBlock({ account, index }) {
  const [hovered, setHovered] = useState(false)
  const colors = ROLE_COLORS[account.colorKey] || ROLE_COLORS.blue

  return (
    <div
      className={`glass-enter glass-enter-delay-${index + 1}`}
      style={{
        ...styles.block,
        background: colors.cardBg,
        borderColor: hovered ? 'rgba(255,255,255,0.2)' : colors.cardBorder,
        ...(hovered ? styles.blockHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.roleRow}>
        <span
          style={{
            ...styles.badge,
            background: colors.badgeBg,
            borderColor: colors.badgeBorder,
            color: colors.badgeText,
          }}
        >
          {account.role}
        </span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Email</span>
        <span style={styles.value}>{account.email}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Pass</span>
        <span style={styles.value}>{account.password}</span>
      </div>
      <div style={styles.note}>{account.note}</div>
    </div>
  )
}

export function TestCredentialsSidebar() {
  if (!import.meta.env.DEV) return null

  return (
    <aside style={styles.sidebar} className="glass-sidebar">
      <div style={styles.header} className="glass-enter">
        <p style={styles.eyebrow}>
          <span style={styles.dot} />
          Dev Mode
        </p>
        <h2 style={styles.heading}>Test Credentials</h2>
        <p style={styles.description}>
          Seed accounts for local testing. Backend must use matching passwords.
        </p>
      </div>

      <div style={styles.accountsList}>
        {TEST_ACCOUNTS.map((acc, i) => (
          <AccountBlock key={acc.email} account={acc} index={i} />
        ))}
      </div>

      <div style={styles.footer} className="glass-enter glass-enter-delay-4">
        Also available: mary.nabukenya@example.com and other seeded trainees.
      </div>
    </aside>
  )
}
