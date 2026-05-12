import { useState, useMemo } from 'react'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAdminActivities, useSystemStatus } from '../../../lib/hooks/use-system-admin.js'
import { timeAgo } from '../../../lib/notification-utils.js'

/* ─── Action-type colour mapping ─────────────────────────────────────── */
const ACTION_COLORS = {
  CREATE: { bg: 'rgba(255,127,36,0.08)', border: 'rgba(255,127,36,0.2)', text: '#FF7F24', dot: '#FF7F24' },
  UPDATE: { bg: 'rgba(99,179,237,0.08)', border: 'rgba(99,179,237,0.2)', text: '#63b3ed', dot: '#63b3ed' },
  APPROVE: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10B981', dot: '#10B981' },
  EXPORT: { bg: 'rgba(99,179,237,0.08)', border: 'rgba(99,179,237,0.2)', text: '#63b3ed', dot: '#63b3ed' },
  RESET: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', text: '#fbbf24', dot: '#fbbf24' },
  SUSPEND: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#f87171', dot: '#EF4444' },
  DELETE: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#f87171', dot: '#EF4444' },
  ENROLL: { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', text: '#34d399', dot: '#10B981' },
  COMPLETE: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa', dot: '#3B82F6' },
}
const DEFAULT_ACTION_COLOR = { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#8a9099', dot: '#FF7F24' }

/* ─── Role colour mapping ────────────────────────────────────────────── */
const ROLE_COLORS = {
  ADMIN: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa' },
  SUPER_ADMIN: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#ef4444' },
  STAFF: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', text: '#c084fc' },
  TRAINEE: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
  SYSTEM: { bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', text: '#9ca3af' },
}
const DEFAULT_ROLE_COLOR = { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#8a9099' }

const ALL_FILTERS = ['ALL', 'CREATE', 'UPDATE', 'APPROVE', 'SUSPEND', 'RESET', 'EXPORT', 'DELETE', 'ENROLL', 'COMPLETE']

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  topRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '1.25rem',
    alignItems: 'start',
  },
  card: {
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 20,
    padding: '1.5rem',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
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
  badge: (bg, color) => ({
    fontSize: '0.6875rem',
    fontWeight: 650,
    padding: '0.2rem 0.6rem',
    borderRadius: 20,
    background: bg,
    color,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  }),

  /* ── Filter bar ── */
  filterBar: {
    display: 'flex',
    gap: '0.375rem',
    flexWrap: 'wrap',
    marginBottom: '0.875rem',
  },
  filterBtn: (active) => ({
    fontSize: '0.625rem',
    fontWeight: 650,
    padding: '0.25rem 0.625rem',
    borderRadius: 20,
    border: active ? '1px solid rgba(255,127,36,0.35)' : '1px solid rgba(255,255,255,0.08)',
    background: active ? 'rgba(255,127,36,0.1)' : 'transparent',
    color: active ? '#FF7F24' : 'var(--slogbaa-text-secondary)',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    transition: 'all 0.15s',
  }),

  /* ── Activity feed ── */
  activityScroll: {
    overflowY: 'auto',
    maxHeight: 440,
    marginRight: '-0.5rem',
    paddingRight: '0.5rem',
  },
  activityRow: {
    display: 'flex',
    gap: '0.75rem',
  },
  activityLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '1rem',
    flexShrink: 0,
  },
  activityDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  activityLine: {
    width: 1,
    flex: 1,
    minHeight: 12,
    background: 'var(--slogbaa-border)',
    marginTop: '0.3rem',
  },
  activityBody: (isLast) => ({
    flex: 1,
    minWidth: 0,
    padding: '0.75rem 0',
    borderBottom: isLast ? 'none' : '1px solid var(--slogbaa-border)',
  }),
  activityTopRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.5rem',
    marginBottom: '0.3rem',
  },
  activityActor: {
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '55%',
  },
  activityTime: {
    fontSize: '0.6875rem',
    color: 'var(--slogbaa-text-secondary)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  activityDesc: {
    margin: '0 0 0.45rem',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-secondary)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  activityTagRow: {
    display: 'flex',
    gap: '0.35rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: (bg, border, color) => ({
    fontSize: '0.5625rem',
    fontWeight: 700,
    padding: '0.175rem 0.5rem',
    borderRadius: 5,
    background: bg,
    border: `1px solid ${border}`,
    color,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }),

  /* ── System monitoring ── */
  sessionHero: {
    marginBottom: '1rem',
    padding: '0.875rem 1rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
  },
  sessionCount: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
  sessionLabel: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-secondary)',
    marginTop: 3,
  },
  monitorRow: (last) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.7rem 0',
    borderBottom: last ? 'none' : '1px solid var(--slogbaa-border)',
  }),
  monitorLabel: {
    margin: 0,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-secondary)',
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
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: 'var(--slogbaa-text-secondary)',
    fontSize: '0.9rem',
  },
}

function statusColor(value, expected) {
  if (!value || value === '...') return '#8a9099'
  return value === expected ? '#10B981' : '#EF4444'
}

export function SystemAdminDashboardPage() {
  const { data: activitiesData, isLoading: loadingActivities } = useAdminActivities()
  const { data: systemStatus, isLoading: loadingStatus } = useSystemStatus()
  const [activeFilter, setActiveFilter] = useState('ALL')

  const activities = activitiesData || []

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'ALL') return activities
    return activities.filter(a => (a.actionType || '').toUpperCase() === activeFilter)
  }, [activities, activeFilter])

  const presentFilters = ALL_FILTERS

  return (
    <div style={styles.root}>
      <div style={styles.topRow}>

        {/* ── Activity Feed ── */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderLeft}>
              <div style={styles.cardIcon}>
                <FontAwesomeIcon icon={icons.history} />
              </div>
              <h2 style={styles.cardTitle}>Global Activity Feed</h2>
            </div>
            {activities.length > 0 && (
              <span style={styles.badge('rgba(255,127,36,0.08)', '#FF7F24')}>
                {filteredActivities.length} / {activities.length} events
              </span>
            )}
          </div>

          {!loadingActivities && presentFilters.length > 1 && (
            <div style={styles.filterBar}>
              {presentFilters.map(f => (
                <button
                  key={f}
                  style={styles.filterBtn(activeFilter === f)}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <div style={styles.activityScroll}>
            {loadingActivities ? (
              <div style={styles.emptyState}>Loading activities…</div>
            ) : filteredActivities.length === 0 ? (
              <div style={styles.emptyState}>No events match this filter.</div>
            ) : (
              <div>
                {filteredActivities.map((act, i) => {
                  const isLast = i === filteredActivities.length - 1
                  const actionKey = (act.actionType || '').toUpperCase()
                  const roleKey = (act.actorRole || '').toUpperCase()
                  const aC = ACTION_COLORS[actionKey] || DEFAULT_ACTION_COLOR
                  const rC = ROLE_COLORS[roleKey] || DEFAULT_ROLE_COLOR

                  return (
                    <div key={act.id} style={styles.activityRow}>
                      <div style={styles.activityLeft}>
                        <div style={styles.activityDot(aC.dot)} />
                        {!isLast && <div style={styles.activityLine} />}
                      </div>
                      <div style={styles.activityBody(isLast)}>
                        <div style={styles.activityTopRow}>
                          <span style={styles.activityActor}>{act.actorEmail}</span>
                          <span style={styles.activityTime}>{timeAgo(act.createdAt)}</span>
                        </div>
                        <p style={styles.activityDesc}>{act.description}</p>
                        <div style={styles.activityTagRow}>
                          <span style={styles.tag(aC.bg, aC.border, aC.text)}>
                            {act.actionType}
                          </span>
                          <span style={styles.tag(rC.bg, rC.border, rC.text)}>
                            {act.actorRole}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── System Monitoring ── */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderLeft}>
              <div style={styles.cardIcon}>
                <FontAwesomeIcon icon={icons.server} />
              </div>
              <h2 style={styles.cardTitle}>System Status</h2>
            </div>
            <span style={styles.badge('rgba(16,185,129,0.1)', '#10B981')}>
              All systems go
            </span>
          </div>

          <div style={styles.sessionHero}>
            <p style={styles.sessionCount}>
              {loadingStatus ? '—' : (systemStatus?.activeSessions ?? 0)}
            </p>
            <p style={styles.sessionLabel}>Active user accounts</p>
          </div>

          {[
            { label: 'Backend Service', key: 'backend', expected: 'Healthy' },
            { label: 'Database', key: 'database', expected: 'Connected' },
            { label: 'Auth Service', key: 'authService', expected: 'Operational' },
          ].map(({ label, key, expected }, i, arr) => {
            const value = loadingStatus ? '...' : (systemStatus?.[key] || 'Unknown')
            return (
              <div key={label} style={styles.monitorRow(i === arr.length - 1)}>
                <p style={styles.monitorLabel}>{label}</p>
                <p style={styles.monitorValue}>
                  <span style={styles.statusDot(statusColor(value, expected))} />
                  {value}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}