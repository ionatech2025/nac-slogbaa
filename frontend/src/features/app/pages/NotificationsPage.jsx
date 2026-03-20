import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useInfiniteNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../../../lib/hooks/use-notifications.js'
import { timeAgo, notificationIcon } from '../../../lib/notification-utils.js'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
]

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--slogbaa-bg)',
  },
  main: {
    flex: 1,
    padding: '1.5rem 2rem',
    maxWidth: 720,
    margin: '0 auto',
    width: '100%',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '0.25rem',
  },
  heading: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: '0.25rem 0 1.25rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  tabRow: {
    display: 'flex',
    gap: '0.25rem',
    marginBottom: '1.25rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    padding: 3,
  },
  tab: (active) => ({
    flex: 1,
    padding: '0.5rem 1rem',
    minHeight: 40,
    fontSize: '0.9375rem',
    fontWeight: active ? 600 : 400,
    color: active ? '#fff' : 'var(--slogbaa-text)',
    background: active ? 'var(--slogbaa-blue)' : 'transparent',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  }),
  markAllBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.4rem 0.875rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--slogbaa-blue)',
    background: 'transparent',
    border: '1px solid var(--slogbaa-blue)',
    borderRadius: 8,
    cursor: 'pointer',
    minHeight: 36,
    transition: 'background 0.15s',
  },
  card: (unread) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
    padding: '1rem 1.25rem',
    borderRadius: 14,
    border: '1px solid var(--slogbaa-glass-border)',
    background: unread ? 'var(--slogbaa-glass-bg)' : 'var(--slogbaa-surface)',
    backdropFilter: unread ? 'var(--slogbaa-glass-blur)' : 'none',
    WebkitBackdropFilter: unread ? 'var(--slogbaa-glass-blur)' : 'none',
    boxShadow: unread ? 'var(--slogbaa-glass-shadow)' : 'none',
    marginBottom: '0.625rem',
    cursor: 'pointer',
    transition: 'background 0.15s, box-shadow 0.15s',
  }),
  iconWrap: {
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-blue)',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    lineHeight: 1.3,
  },
  message: {
    margin: '0.15rem 0 0',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.4,
  },
  time: {
    margin: '0.25rem 0 0',
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
    opacity: 0.7,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--slogbaa-blue)',
    flexShrink: 0,
    marginTop: 8,
  },
  empty: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: 'var(--slogbaa-text-muted)',
  },
  loadMore: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem 0',
  },
  loadMoreBtn: {
    padding: '0.5rem 1.5rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-blue)',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    cursor: 'pointer',
    minHeight: 44,
    transition: 'background 0.15s',
  },
}

export function NotificationsPage() {
  useDocumentTitle('Notifications')
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotifications()

  const { data: unreadData } = useUnreadCount()
  const markRead = useMarkAsRead()
  const markAllRead = useMarkAllAsRead()
  const unreadCount = unreadData?.count ?? 0

  const allNotifications = data?.pages?.flatMap((p) => p.content ?? []) ?? []
  const filtered = filter === 'unread'
    ? allNotifications.filter((n) => !n.read)
    : allNotifications

  const handleClick = useCallback(
    (notification) => {
      if (!notification.read) {
        markRead.mutate(notification.id)
      }
      if (notification.link) {
        navigate(notification.link)
      }
    },
    [markRead, navigate]
  )

  const handleMarkAllRead = useCallback(() => {
    markAllRead.mutate()
  }, [markAllRead])

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <div style={styles.headerRow}>
          <h1 style={styles.heading}>Notifications</h1>
          {unreadCount > 0 && (
            <button
              type="button"
              style={styles.markAllBtn}
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
            >
              <Icon icon={icons.checkCircle} size={14} />
              Mark all as read
            </button>
          )}
        </div>
        <p style={styles.subtitle}>
          {unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.`
            : 'You\u2019re all caught up.'}
        </p>

        <div style={styles.tabRow} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={filter === t.key}
              style={styles.tab(filter === t.key)}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
              {t.key === 'unread' && unreadCount > 0 && (
                <span style={{
                  marginLeft: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 20,
                  height: 20,
                  padding: '0 5px',
                  borderRadius: 10,
                  background: filter === 'unread' ? 'rgba(255,255,255,0.25)' : 'var(--slogbaa-blue)',
                  color: '#fff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  lineHeight: 1,
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading && (
          <div style={styles.empty}>
            <LoadingButton loading style={{ background: 'transparent', border: 'none', color: 'var(--slogbaa-text-muted)' }}>
              Loading notifications...
            </LoadingButton>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div style={styles.empty}>
            <Icon icon={icons.bell} size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', color: 'var(--slogbaa-text)' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h2>
            <p style={{ margin: 0 }}>
              {filter === 'unread'
                ? 'You\u2019re all caught up! Switch to "All" to see your history.'
                : 'Notifications for badges, completions, and replies will appear here.'}
            </p>
          </div>
        )}

        {filtered.map((n) => (
          <div
            key={n.id}
            style={styles.card(!n.read)}
            onClick={() => handleClick(n)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick(n)
              }
            }}
          >
            <div style={styles.iconWrap}>
              <Icon icon={notificationIcon(n.type)} size={18} />
            </div>
            <div style={styles.content}>
              <p style={styles.title}>{n.title}</p>
              <p style={styles.message}>{n.message}</p>
              <p style={styles.time}>{timeAgo(n.createdAt)}</p>
            </div>
            {!n.read && <div style={styles.unreadDot} aria-label="Unread" />}
          </div>
        ))}

        {hasNextPage && (
          <div style={styles.loadMore}>
            <button
              type="button"
              style={styles.loadMoreBtn}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
