import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import {
  useStaffNotifications,
  useStaffUnreadCount,
  useStaffMarkAsRead,
  useStaffMarkAllAsRead,
} from '../../../lib/hooks/use-notifications.js'
import { timeAgo, notificationIcon } from '../../../lib/notification-utils.js'

const styles = {
  bellButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    minHeight: 44,
    minWidth: 44,
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 10,
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    padding: '0 5px',
    borderRadius: 9,
    background: '#ef4444',
    color: '#fff',
    fontSize: '0.6875rem',
    fontWeight: 700,
    lineHeight: '18px',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 360,
    maxHeight: 440,
    overflowY: 'auto',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    borderRadius: 14,
    boxShadow: 'var(--slogbaa-glass-shadow-lg)',
    border: '1px solid var(--slogbaa-glass-border)',
    zIndex: 200,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    margin: 0,
  },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--slogbaa-blue)',
    fontSize: '0.8125rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: 6,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid var(--slogbaa-border)',
    transition: 'background 0.12s',
  },
  itemUnread: {
    background: 'var(--slogbaa-glass-bg-subtle)',
  },
  itemIcon: {
    flexShrink: 0,
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-blue)',
  },
  itemContent: { flex: 1, minWidth: 0 },
  itemTitle: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  itemMessage: {
    margin: '0.2rem 0 0',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.45,
  },
  itemTime: {
    margin: '0.35rem 0 0',
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--slogbaa-blue)',
    flexShrink: 0,
    marginTop: 6,
  },
  empty: {
    padding: '2rem 1rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-secondary)',
    fontSize: '0.875rem',
  },
}

/**
 * In-app notifications for admin / super-admin (staff_user_id recipients).
 */
export function StaffNotificationBell({ buttonStyle = {} }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  const { data: unreadData } = useStaffUnreadCount()
  const { data: notifData, isLoading } = useStaffNotifications(0, 20)
  const markRead = useStaffMarkAsRead()
  const markAllRead = useStaffMarkAllAsRead()

  const unreadCount = unreadData?.count ?? 0
  const notifications = notifData?.content ?? []

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

  const handleNotificationClick = useCallback(
    (notification) => {
      if (!notification.read) {
        markRead.mutate(notification.id)
      }
      setOpen(false)
      if (notification.link) {
        navigate(notification.link)
      }
    },
    [markRead, navigate]
  )

  const BellIcon = unreadCount > 0 ? icons.bellDot : icons.bell

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        style={{ ...styles.bellButton, ...buttonStyle }}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Icon icon={BellIcon} size={20} />
        {unreadCount > 0 && (
          <span style={styles.badge} aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown} role="menu">
          <div style={styles.header}>
            <p style={styles.headerTitle}>Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                style={styles.markAllBtn}
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading && <div style={styles.empty}>Loading...</div>}

          {!isLoading && notifications.length === 0 && (
            <div style={styles.empty}>
              <Icon icon={icons.bell} size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
              <p style={{ margin: 0 }}>No notifications yet</p>
            </div>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              style={{
                display: 'block',
                width: '100%',
                padding: '0.625rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--slogbaa-border)',
                color: 'var(--slogbaa-blue)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => {
                setOpen(false)
                navigate('/admin/reports')
              }}
            >
              Open reports & analytics
            </button>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                ...styles.item,
                ...(!n.read ? styles.itemUnread : {}),
              }}
              onClick={() => handleNotificationClick(n)}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleNotificationClick(n)
                }
              }}
            >
              <div style={styles.itemIcon}>
                <Icon icon={notificationIcon(n.type)} size={16} />
              </div>
              <div style={styles.itemContent}>
                <p style={styles.itemTitle}>{n.title}</p>
                <p style={styles.itemMessage}>{n.message}</p>
                <p style={styles.itemTime}>{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && <div style={styles.unreadDot} aria-label="Unread" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
