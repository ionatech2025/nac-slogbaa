import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'
import { useAuth } from '../../../iam/hooks/useAuth.js'
import { Avatar } from '../../../../shared/components/Avatar.jsx'
import { Logo } from '../../../../shared/components/Logo.jsx'

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px) saturate(170%)',
    WebkitBackdropFilter: 'blur(16px) saturate(170%)',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  userTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    minHeight: 44,
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
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    borderRadius: 14,
    boxShadow: 'var(--slogbaa-glass-shadow-lg)',
    border: '1px solid var(--slogbaa-glass-border)',
    padding: '0.25rem 0',
    zIndex: 200,
    animation: 'glass-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    minHeight: 44,
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
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const displayName = user?.fullName || user?.email || 'Trainee'
  const initials = getInitials(user)

  const handleAction = (action) => {
    setOpen(false)
    if (action === 'profile') {
      onOpenProfile?.()
    } else if (action === 'sign-out') {
      logout()
    }
  }

  return (
    <nav style={styles.nav}>
      <Logo variant="full" size={30} color="white" subtitle="Learning" />
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
          <span style={{ marginLeft: 4 }}>{open ? '\u25B2' : '\u25BC'}</span>
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
