import { Icon, icons } from '../icons.jsx'

const styles = {
  wrap: {
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'var(--slogbaa-bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  title: {
    margin: '0 0 0.35rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  text: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.6,
    maxWidth: 360,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}

/**
 * Empty state with icon, title, and description.
 * 2026 standard: every empty list has a visual placeholder with context.
 */
export function EmptyState({ icon = icons.search, title, description, children }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.iconWrap}>
        <Icon icon={icon} size={28} style={{ color: 'var(--slogbaa-text-muted)' }} />
      </div>
      {title && <p style={styles.title}>{title}</p>}
      {description && <p style={styles.text}>{description}</p>}
      {children && <div style={{ marginTop: '1.25rem' }}>{children}</div>}
    </div>
  )
}
