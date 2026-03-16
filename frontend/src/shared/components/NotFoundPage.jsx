import { Link } from 'react-router-dom'

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '2rem',
    textAlign: 'center',
  },
  code: {
    margin: 0,
    fontSize: '4rem',
    fontWeight: 800,
    color: 'var(--slogbaa-blue)',
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
  title: {
    margin: '0.5rem 0',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  text: {
    margin: '0 0 1.5rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.6,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.6rem 1.25rem',
    borderRadius: 10,
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
}

export function NotFoundPage() {
  return (
    <div style={styles.wrap}>
      <div>
        <p style={styles.code}>404</p>
        <h1 style={styles.title}>Page not found</h1>
        <p style={styles.text}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" style={styles.link}>Go to homepage</Link>
      </div>
    </div>
  )
}
