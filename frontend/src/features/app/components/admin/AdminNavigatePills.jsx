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

/** Order matches admin sidebar; super-only entries hidden for regular admins. */
const NAV_CONFIG = [
  { to: '/admin/homepage', icon: icons.home, label: 'Landing', end: true, superOnly: true },
  { to: '/admin/overview', icon: icons.overview, label: 'Overview', end: true },
  { to: '/admin/learning', icon: icons.learning, label: 'Learning' },
  { to: '/admin/coursemanagement', icon: icons.course, label: 'Course Mgmt', superOnly: true },
  { to: '/admin/library', icon: icons.library, label: 'Library' },
  { to: '/admin/assessment', icon: icons.assessment, label: 'Assessment' },
  { to: '/admin/cms', icon: icons.viewCards, label: 'CMS', superOnly: true },
  { to: '/admin/live-sessions', icon: icons.blockVideo, label: 'Live', superOnly: true },
  { to: '/admin/reports', icon: icons.reports, label: 'Analytics' },
]

/**
 * Horizontal pill links to main admin sections (same set as the primary sidebar).
 * Place at the bottom of admin page content for quick cross-navigation.
 */
export function AdminNavigatePills({ isSuperAdmin: isSuperAdminProp }) {
  const ctx = useOutletContext()
  const isSuperAdmin = isSuperAdminProp ?? ctx?.isSuperAdmin ?? false
  const links = NAV_CONFIG.filter((l) => !l.superOnly || isSuperAdmin)

  return (
    <nav style={{ marginTop: '2rem' }} aria-label="Section navigation">
      <p style={sectionLabel}>Navigate</p>
      <div style={navPills}>
        {links.map((link) => (
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
