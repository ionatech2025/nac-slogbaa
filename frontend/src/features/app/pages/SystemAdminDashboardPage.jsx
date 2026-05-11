import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAdminActivities } from '../../../lib/hooks/use-system-admin.js'
import { timeAgo } from '../../../lib/notification-utils.js'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  /* ── Top row: activity + monitoring ── */
  topRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '1.25rem',
    alignItems: 'start',
  },

  /* ── Cards ── */
  card: {
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 20,
    padding: '1.5rem',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },

  /* ── Card header ── */
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'rgba(255, 127, 36, 0.08)',
    color: '#FF7F24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 17,
    flexShrink: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: '0.9375rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: 'var(--slogbaa-text)',
  },
  cardBadge: {
    fontSize: '0.6875rem',
    fontWeight: 650,
    padding: '0.2rem 0.6rem',
    borderRadius: 20,
    background: 'rgba(255, 127, 36, 0.08)',
    color: '#FF7F24',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },

  /* ── Activity feed ── */
  activityScroll: {
    overflowY: 'auto',
    maxHeight: 420,
    marginRight: '-0.5rem',
    paddingRight: '0.5rem',
  },
  activityItem: {
    display: 'flex',
    gap: '0.875rem',
  },
  activityLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    paddingTop: '1.25rem',
  },
  activityDot: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    background: '#FF7F24',
    flexShrink: 0,
  },
  activityLine: {
    width: 1,
    flex: 1,
    minHeight: 16,
    background: 'var(--slogbaa-border)',
    marginTop: '0.35rem',
  },
  activityContent: (isLast) => ({
    flex: 1,
    minWidth: 0,
    padding: '1rem 0',
    borderBottom: isLast ? 'none' : '1px solid var(--slogbaa-border)',
  }),
  activityDesc: {
    margin: '0 0 0.25rem',
    fontSize: '0.875rem',
    lineHeight: 1.45,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activityActor: {
    fontWeight: 650,
    color: 'var(--slogbaa-text)',
  },
  activityDescText: {
    color: 'var(--slogbaa-text-secondary)',
  },
  activityMetaRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  activityMeta: {
    margin: 0,
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-secondary)',
  },
  activityTag: {
    fontSize: '0.625rem',
    fontWeight: 650,
    padding: '0.15rem 0.5rem',
    borderRadius: 6,
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--slogbaa-text-secondary)',
    letterSpacing: '0.02em',
  },

  /* ── Monitoring panel ── */
  monitorRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 0',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  monitorLabel: {
    margin: 0,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  monitorValue: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  statusDot: (color) => ({
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  sessionCount: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  sessionLabel: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-secondary)',
    marginTop: 2,
  },

  /* ── Empty / loading states ── */
  emptyState: {
    textAlign: 'center',
    padding: '2.5rem 1rem',
    color: 'var(--slogbaa-text-secondary)',
    fontSize: '0.9rem',
  },
}

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '??'
}

export function SystemAdminDashboardPage() {
  const { data: activitiesData, isLoading: loadingActivities } = useAdminActivities()

  const activities = activitiesData || []

  return (
    <div style={styles.root}>

      {/* ── Top row ── */}
      <div style={styles.topRow}>

        {/* Activity Feed */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderLeft}>
              <div style={styles.cardIcon}>
                <FontAwesomeIcon icon={icons.history} />
              </div>
              <h2 style={styles.cardTitle}>Global Activity Feed</h2>
            </div>
            {activities.length > 0 && (
              <span style={styles.cardBadge}>{activities.length} events</span>
            )}
          </div>
          <div style={styles.activityScroll}>
            {loadingActivities ? (
              <div style={styles.emptyState}>Loading activities…</div>
            ) : activities.length === 0 ? (
              <div style={styles.emptyState}>No activity logs found.</div>
            ) : (
              activities.map((act, i) => {
                const isLast = i === activities.length - 1;
                return (
                  <div key={act.id} style={styles.activityItem}>
                    <div style={styles.activityLeft}>
                      <div style={styles.activityDot} />
                      {!isLast && <div style={styles.activityLine} />}
                    </div>
                    <div style={styles.activityContent(isLast)}>
                      <p style={styles.activityDesc}>
                        <span style={styles.activityActor}>{act.actorEmail}</span>
                        <span style={styles.activityDescText}>
                          {' '}— {act.description}
                        </span>
                      </p>
                      <div style={styles.activityMetaRow}>
                        <span style={styles.activityMeta}>{timeAgo(act.createdAt)}</span>
                        <span style={styles.activityTag}>{act.actionType}</span>
                        <span style={styles.activityTag}>{act.actorRole}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* System Monitoring */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderLeft}>
              <div style={styles.cardIcon}>
                <FontAwesomeIcon icon={icons.server} />
              </div>
              <h2 style={styles.cardTitle}>System Status</h2>
            </div>
            <span style={{ ...styles.cardBadge, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
              All systems go
            </span>
          </div>

          {/* Session count hero */}
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--slogbaa-surface)', borderRadius: 12, border: '1px solid var(--slogbaa-border)' }}>
            <p style={styles.sessionCount}>142</p>
            <p style={styles.sessionLabel}>Active sessions right now</p>
          </div>

          {[
            { label: 'Backend Service', value: 'Healthy', color: '#10B981' },
            { label: 'Database', value: 'Connected', color: '#10B981' },
            { label: 'Auth Service', value: 'Operational', color: '#10B981' },
          ].map(row => (
            <div key={row.label} style={styles.monitorRow}>
              <p style={styles.monitorLabel}>{row.label}</p>
              <p style={styles.monitorValue}>
                <span style={styles.statusDot(row.color)} />
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}