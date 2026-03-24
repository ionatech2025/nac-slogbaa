import { NavLink, useOutletContext } from 'react-router-dom'
import { Icon, icons } from '../../../../shared/icons.jsx'

const sectionLabel = {
  margin: '2rem 0 0.875rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--slogbaa-blue)',
}

const navPills = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.625rem',
}

const pillBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.45rem 0.875rem',
  borderRadius: 999,
  textDecoration: 'none',
  fontSize: '0.8125rem',
  fontWeight: 500,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  border: '1px solid var(--slogbaa-glass-border-subtle)',
}

const pillInactive = {
  background: 'var(--slogbaa-glass-bg-subtle)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: 'var(--slogbaa-text)',
}

const pillActive = {
  background: 'var(--primary-orange, #F58220)',
  color: '#fff',
  borderColor: 'rgba(255, 255, 255, 0.25)',
  fontWeight: 600,
}

/** Same destinations as {@link TraineeSidebar} — quick cross-navigation at page bottom. */
const NAV_CONFIG = [
  { to: '/dashboard', icon: icons.home, label: 'Dashboard', end: true },
  { to: '/dashboard/courses', icon: icons.learning, label: 'Courses' },
  { to: '/dashboard/library', icon: icons.library, label: 'Library' },
  { to: '/dashboard/bookmarks', icon: icons.bookmark, label: 'Bookmarks' },
  { to: '/dashboard/certificates', icon: icons.certificate, label: 'Certificates' },
  { to: '/dashboard/live-sessions', icon: icons.blockVideo, label: 'Live sessions' },
  { to: '/dashboard/notifications', icon: icons.bell, label: 'Notifications' },
  { to: '/dashboard/settings', icon: icons.settings, label: 'Settings' },
  { to: '/dashboard/help', icon: icons.helpCircle, label: 'Help' },
]

/**
 * Horizontal pills mirroring the trainee sidebar (like admin Navigate).
 */
export function TraineeNavigatePills() {
  const ctx = useOutletContext()
  const hint = ctx?.profileData?.fullName || ctx?.profileData?.email

  return (
    <nav style={{ marginTop: '2rem', paddingBottom: '1.5rem' }} aria-label="Section navigation">
      <p style={sectionLabel}>Navigate</p>
      {hint && (
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>
          Signed in as <strong style={{ color: 'var(--slogbaa-text)', fontWeight: 600 }}>{hint}</strong>
        </p>
      )}
      <div style={navPills}>
        {NAV_CONFIG.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end ?? false}
            className="glass-hover"
            style={({ isActive }) => ({
              ...pillBase,
              ...(isActive ? pillActive : pillInactive),
            })}
          >
            <Icon icon={link.icon} size={14} aria-hidden />
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
