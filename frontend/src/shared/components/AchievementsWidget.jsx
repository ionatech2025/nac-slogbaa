import { useState } from 'react'
import { useAchievements } from '../../lib/hooks/use-achievements.js'
import {
  BookOpen, GraduationCap, Flame, Award, Trophy, Star,
  MessageSquare, Zap,
} from 'lucide-react'

/**
 * Map icon names from the backend to Lucide components.
 */
const ICON_MAP = {
  BookOpen,
  GraduationCap,
  Flame,
  Award,
  Trophy,
  Star,
  MessageSquare,
}

function BadgeIcon({ name, size = 28, style }) {
  const LucideIcon = ICON_MAP[name]
  if (!LucideIcon) return null
  return <LucideIcon size={size} strokeWidth={2} style={{ flexShrink: 0, ...style }} aria-hidden />
}

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
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  xpSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginLeft: 'auto',
  },
  xpValue: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--slogbaa-blue)',
    lineHeight: 1.2,
  },
  xpLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--slogbaa-text-muted)',
  },
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '0.75rem',
  },
  badgeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.75rem 0.5rem',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg-subtle)',
    cursor: 'default',
    position: 'relative',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  badgeItemEarned: {
    borderColor: 'rgba(59, 130, 246, 0.3)',
    background: 'rgba(59, 130, 246, 0.06)',
  },
  badgeItemUnearned: {
    opacity: 0.45,
    filter: 'grayscale(1)',
  },
  badgeName: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    textAlign: 'center',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  badgeXp: {
    fontSize: '0.625rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
  },
  tooltip: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
    minWidth: 160,
    maxWidth: 220,
    padding: '0.6rem 0.75rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    pointerEvents: 'none',
  },
  tooltipName: {
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    marginBottom: '0.2rem',
  },
  tooltipDesc: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.3,
  },
  tooltipXp: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
    marginTop: '0.25rem',
  },
  loading: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    padding: '1rem 1.25rem',
  },
}

function BadgeCard({ badge }) {
  const [hovered, setHovered] = useState(false)
  const earned = badge.earned

  return (
    <div
      style={{
        ...styles.badgeItem,
        ...(earned ? styles.badgeItemEarned : styles.badgeItemUnearned),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="listitem"
      aria-label={`${badge.name}${earned ? ' (earned)' : ' (locked)'}`}
    >
      {hovered && (
        <div style={styles.tooltip}>
          <div style={styles.tooltipName}>{badge.name}</div>
          <div style={styles.tooltipDesc}>{badge.description}</div>
          <div style={styles.tooltipXp}>+{badge.xpReward} XP</div>
          {earned && badge.awardedAt && (
            <div style={{ ...styles.tooltipDesc, marginTop: '0.2rem', fontSize: '0.6875rem' }}>
              Earned {new Date(badge.awardedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
      <BadgeIcon
        name={badge.iconName}
        size={28}
        style={{ color: earned ? 'var(--slogbaa-blue)' : 'var(--slogbaa-text-muted)' }}
      />
      <div style={styles.badgeName}>{badge.name}</div>
      <div style={styles.badgeXp}>+{badge.xpReward}</div>
    </div>
  )
}

export function AchievementsWidget() {
  const { data, isLoading } = useAchievements()

  if (isLoading) {
    return <div style={{ ...styles.card, ...styles.loading }}>Loading achievements...</div>
  }

  if (!data) return null

  const { totalXp, allBadges } = data
  const earnedCount = data.earnedBadges?.length ?? 0

  return (
    <div style={styles.card} role="region" aria-label="Achievements">
      <div style={styles.header}>
        <Zap size={22} strokeWidth={2.5} style={{ color: '#f59e0b', flexShrink: 0 }} aria-hidden />
        <h2 style={styles.title}>
          Achievements
          <span style={{ fontWeight: 400, fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', marginLeft: '0.5rem' }}>
            {earnedCount}/{allBadges?.length ?? 0}
          </span>
        </h2>
        <div style={styles.xpSection}>
          <span style={styles.xpValue}>{totalXp.toLocaleString()}</span>
          <span style={styles.xpLabel}>XP</span>
        </div>
      </div>
      <div style={styles.badgeGrid} role="list">
        {(allBadges ?? []).map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  )
}
