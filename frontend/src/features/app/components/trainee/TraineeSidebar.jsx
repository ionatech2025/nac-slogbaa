import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'

const baseStyles = {
  sidebarSection: { padding: '0 0 1rem' },
  sidebarSectionInner: { padding: '0 1rem' },
  navLinkIcon: { width: '1.1em', opacity: 0.9 },
}

const darkSidebarStyles = {
  sidebarLabel: { margin: '0 1rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slogbaa-text-muted)', borderBottom: '1px solid var(--slogbaa-border)', paddingBottom: '0.5rem' },
  navLink: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', minHeight: 44, marginBottom: 2, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderRadius: 8, transition: 'background 0.15s, color 0.15s' },
  navLinkActive: { background: 'var(--primary-orange, #F58220)', color: '#fff', fontWeight: 600 },
}

const lightSidebarStyles = {
  sidebarLabel: { ...darkSidebarStyles.sidebarLabel, color: 'var(--slogbaa-text-muted)' },
  navLink: { ...darkSidebarStyles.navLink, color: 'var(--slogbaa-text)' },
  navLinkActive: { ...darkSidebarStyles.navLinkActive },
}

/** Primary trainee destinations — order matches sidebar + Navigate pills. */
const LEARN_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: icons.home, end: true },
  { to: '/dashboard/courses', label: 'Courses', icon: icons.learning },
  { to: '/dashboard/library', label: 'Library', icon: icons.library },
  { to: '/dashboard/bookmarks', label: 'Bookmarks', icon: icons.bookmark },
  { to: '/dashboard/certificates', label: 'Certificates', icon: icons.certificate },
]

const MORE_LINKS = [
  { to: '/dashboard/live-sessions', label: 'Live sessions', icon: icons.blockVideo },
  { to: '/dashboard/notifications', label: 'Notifications', icon: icons.bell },
  { to: '/dashboard/settings', label: 'Settings', icon: icons.settings },
  { to: '/dashboard/help', label: 'Help', icon: icons.helpCircle },
]

/**
 * Left rail for the trainee app (desktop). Hidden &lt;768px; use mobile drawer from layout.
 */
export function TraineeSidebar({ theme = 'dark', onNavigate }) {
  const sidebarStyles = theme === 'light' ? lightSidebarStyles : darkSidebarStyles
  const close = () => onNavigate?.()

  const renderNavItem = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end ?? false}
      onClick={close}
      style={({ isActive }) => ({
        ...sidebarStyles.navLink,
        ...(isActive ? sidebarStyles.navLinkActive : {}),
      })}
    >
      <FontAwesomeIcon icon={item.icon} style={baseStyles.navLinkIcon} />
      {item.label}
    </NavLink>
  )

  return (
    <>
      <div style={baseStyles.sidebarSection}>
        <p style={sidebarStyles.sidebarLabel}>Your learning</p>
        <div style={baseStyles.sidebarSectionInner}>
          {LEARN_LINKS.map(renderNavItem)}
        </div>
      </div>
      <div style={{ ...baseStyles.sidebarSection, paddingBottom: 0 }}>
        <p style={sidebarStyles.sidebarLabel}>More</p>
        <div style={baseStyles.sidebarSectionInner}>
          {MORE_LINKS.map(renderNavItem)}
        </div>
      </div>
    </>
  )
}
