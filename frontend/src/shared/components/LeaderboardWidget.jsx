import { Icon, icons } from '../icons.jsx'
import { useLeaderboard } from '../../lib/hooks/use-courses.js'

const styles = {
  card: {
    padding: '1.25rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.75rem',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--slogbaa-border)',
  },
  rankBadge: (rank) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    fontSize: '0.8125rem',
    fontWeight: 700,
    flexShrink: 0,
    background: rank === 1 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
      : rank === 2 ? 'linear-gradient(135deg, #d1d5db, #9ca3af)'
      : rank === 3 ? 'linear-gradient(135deg, #d97706, #b45309)'
      : 'var(--slogbaa-border)',
    color: rank <= 3 ? '#fff' : 'var(--slogbaa-text-muted)',
  }),
  name: {
    flex: 1,
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  count: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
    whiteSpace: 'nowrap',
  },
  empty: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    margin: 0,
  },
  loading: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    margin: 0,
  },
}

export function LeaderboardWidget({ limit = 10 }) {
  const { data: entries = [], isLoading } = useLeaderboard(limit)

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <Icon icon={icons.certificate} size="1.25em" style={{ color: 'var(--slogbaa-blue)' }} />
        <h3 style={styles.title}>Leaderboard</h3>
      </div>

      {isLoading && <p style={styles.loading}>Loading leaderboard...</p>}

      {!isLoading && entries.length === 0 && (
        <p style={styles.empty}>No completions yet. Be the first to finish a course!</p>
      )}

      {!isLoading && entries.length > 0 && (
        <ol style={styles.list}>
          {entries.map((entry) => (
            <li key={entry.rank} style={styles.row}>
              <span style={styles.rankBadge(entry.rank)}>{entry.rank}</span>
              <span style={styles.name}>{entry.displayName}</span>
              <span style={styles.count}>
                {entry.completedCourses} course{entry.completedCourses !== 1 ? 's' : ''}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
