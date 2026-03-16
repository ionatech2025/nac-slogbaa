import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'
import { useAuth } from '../../../iam/hooks/useAuth.js'
import { Avatar } from '../../../../shared/components/Avatar.jsx'

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    background: 'var(--slogbaa-dark)',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  logo: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#fff',
  },
  userTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.375rem 0.75rem',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9375rem',
  },
  initials: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--slogbaa-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    minWidth: 200,
    background: 'var(--slogbaa-surface)',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    border: '1px solid var(--slogbaa-border)',
    padding: '0.25rem 0',
    zIndex: 200,
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.625rem 1rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    textAlign: 'left',
  },
  dropdownItemIcon: {
    width: '1em',
    opacity: 0.85,
  },
  dropdownItemHover: {
    background: 'var(--slogbaa-bg)',
  },
  dropdownItemDanger: {
    color: 'var(--slogbaa-error)',
    borderTop: '1px solid var(--slogbaa-border)',
    marginTop: '0.25rem',
    paddingTop: '0.5rem',
  },
}

function getInitials(user) {
  if (user?.fullName) {
    const parts = user.fullName.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    if (parts[0].length) return parts[0].slice(0, 2).toUpperCase()
  }
  if (user?.email?.length) return user.email.slice(0, 2).toUpperCase()
  return '?'
}

export function TraineeNav({ onOpenProfile }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  const displayName = user?.fullName || user?.email || 'Trainee'
  const initials = getInitials(user)

  const handleAction = (action) => {
    setOpen(false)
    if (action === 'profile') {
      onOpenProfile?.()
    } else if (action === 'grades') {
      alert('Coming soon.')
    } else if (action === 'sign-out') {
      logout()
    }
  }

  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>SLOGBAA Learning</h1>
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          type="button"
          style={styles.userTrigger}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Avatar name={displayName} size="sm" />
          <span>{displayName}</span>
          <span style={{ marginLeft: 4 }}>{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div style={styles.dropdown} role="menu">
            <button
              type="button"
              style={styles.dropdownItem}
              onClick={() => handleAction('profile')}
              role="menuitem"
            >
              <FontAwesomeIcon icon={icons.editProfile} style={styles.dropdownItemIcon} />
              Profile
            </button>
            <button
              type="button"
              style={{ ...styles.dropdownItem, opacity: 0.5, cursor: 'not-allowed' }}
              disabled
              role="menuitem"
              title="Grades will be available soon"
            >
              <FontAwesomeIcon icon={icons.grades} style={styles.dropdownItemIcon} />
              Grades (coming soon)
            </button>
            <button
              type="button"
              style={{ ...styles.dropdownItem, ...styles.dropdownItemDanger }}
              onClick={() => handleAction('sign-out')}
              role="menuitem"
            >
              <FontAwesomeIcon icon={icons.signOut} style={styles.dropdownItemIcon} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
