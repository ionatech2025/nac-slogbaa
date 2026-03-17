import { useState, useRef, useEffect } from 'react'
import { Icon, icons } from '../icons.jsx'
import { useStreak, useUpdateDailyGoal } from '../../lib/hooks/use-streak.js'

const GOAL_OPTIONS = [1, 3, 5, 10, 15, 20, 30]

const styles = {
  card: {
    padding: '1.25rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    flexWrap: 'wrap',
  },
  flameSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    flexShrink: 0,
  },
  flameIcon: {
    color: '#f59e0b',
    filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))',
  },
  flameIconInactive: {
    color: 'var(--slogbaa-text-muted)',
    opacity: 0.5,
  },
  streakCount: {
    fontSize: '1.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    color: 'var(--slogbaa-text)',
  },
  streakLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--slogbaa-text-muted)',
  },
  progressSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
    minWidth: 140,
  },
  ringWrap: {
    position: 'relative',
    width: 56,
    height: 56,
    flexShrink: 0,
  },
  ringCenter: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  progressInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  progressLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  progressSub: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },
  goalBtn: {
    marginLeft: 'auto',
    position: 'relative',
    flexShrink: 0,
  },
  goalButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.4rem 0.75rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg-subtle)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text-muted)',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    right: 0,
    zIndex: 20,
    minWidth: 140,
    borderRadius: 12,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: '0.35rem 0',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '0.45rem 1rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
    textAlign: 'left',
  },
  dropdownItemActive: {
    color: 'var(--slogbaa-blue)',
    fontWeight: 700,
  },
  loading: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    padding: '1rem 1.25rem',
  },
}

function ProgressRing({ value, max, size = 56, stroke = 5 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = max > 0 ? Math.min(value / max, 1) : 0
  const offset = circumference * (1 - progress)
  const color = progress >= 1 ? 'var(--slogbaa-green)' : 'var(--slogbaa-blue)'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--slogbaa-border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}

export function StreakWidget() {
  const { data: streak, isLoading } = useStreak()
  const updateGoal = useUpdateDailyGoal()
  const [showGoalMenu, setShowGoalMenu] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!showGoalMenu) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowGoalMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showGoalMenu])

  if (isLoading) {
    return <div style={{ ...styles.card, ...styles.loading }}>Loading streak...</div>
  }

  const currentStreak = streak?.currentStreak ?? 0
  const longestStreak = streak?.longestStreak ?? 0
  const dailyGoal = streak?.dailyGoalMinutes ?? 5
  const todayMinutes = streak?.todayMinutes ?? 0
  const goalMet = streak?.goalMet ?? false
  const hasStreak = currentStreak > 0

  const handleGoalChange = (minutes) => {
    setShowGoalMenu(false)
    updateGoal.mutate(minutes)
  }

  return (
    <div style={styles.card} role="region" aria-label="Learning streak">
      {/* Flame + streak count */}
      <div style={styles.flameSection}>
        <Icon
          icon={icons.flame}
          size="2rem"
          style={hasStreak ? styles.flameIcon : styles.flameIconInactive}
          aria-hidden
        />
        <div>
          <div style={styles.streakCount}>{currentStreak}</div>
          <div style={styles.streakLabel}>
            {hasStreak
              ? `day streak${currentStreak !== 1 ? '' : ''}!`
              : 'Start your streak!'}
          </div>
          {longestStreak > currentStreak && (
            <div style={{ ...styles.streakLabel, fontSize: '0.6875rem', marginTop: 2 }}>
              Best: {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Daily goal progress ring */}
      <div style={styles.progressSection}>
        <div style={styles.ringWrap}>
          <ProgressRing value={todayMinutes} max={dailyGoal} />
          <div style={styles.ringCenter}>
            {goalMet ? (
              <Icon icon={icons.enrolled} size="1.1rem" style={{ color: 'var(--slogbaa-green)' }} />
            ) : (
              <span>{todayMinutes}/{dailyGoal}</span>
            )}
          </div>
        </div>
        <div style={styles.progressInfo}>
          <div style={styles.progressLabel}>
            {goalMet ? 'Goal met!' : `${todayMinutes}/${dailyGoal} min`}
          </div>
          <div style={styles.progressSub}>Daily learning goal</div>
        </div>
      </div>

      {/* Set goal button */}
      <div style={styles.goalBtn} ref={menuRef}>
        <button
          type="button"
          style={styles.goalButton}
          onClick={() => setShowGoalMenu((v) => !v)}
          aria-expanded={showGoalMenu}
          aria-haspopup="listbox"
        >
          <Icon icon={icons.target} size="0.9em" />
          Set goal
        </button>
        {showGoalMenu && (
          <div style={styles.dropdown} role="listbox" aria-label="Daily goal options">
            {GOAL_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                role="option"
                aria-selected={m === dailyGoal}
                style={{
                  ...styles.dropdownItem,
                  ...(m === dailyGoal ? styles.dropdownItemActive : {}),
                }}
                onClick={() => handleGoalChange(m)}
              >
                {m} min / day
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
