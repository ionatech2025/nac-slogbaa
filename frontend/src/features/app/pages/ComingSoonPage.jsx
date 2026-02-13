import { Link } from 'react-router-dom'

const styles = {
  page: {
    padding: '3rem 2rem',
    textAlign: 'center',
    maxWidth: 400,
    margin: '0 auto',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.25rem',
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: '0 0 1.5rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  link: {
    color: 'var(--slogbaa-blue)',
    fontSize: '0.9375rem',
  },
}

export function ComingSoonPage({ title = 'Coming soon', subtitle = 'This section is not available yet.' }) {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
      <Link to="/dashboard" style={styles.link}>
        ← Back to dashboard
      </Link>
    </div>
  )
}
