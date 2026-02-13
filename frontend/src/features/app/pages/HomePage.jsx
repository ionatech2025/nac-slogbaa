import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'var(--slogbaa-bg)',
  },
  title: {
    margin: 0,
    fontSize: '1.75rem',
    color: 'var(--slogbaa-text)',
  },
  links: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '1rem',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    borderRadius: 6,
    textDecoration: 'none',
    fontWeight: 500,
  },
}

export function HomePage() {
  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>SLOGBAA Online Learning</h1>
      <div style={styles.links}>
        <Link to="/auth/login" style={styles.link}>
          <FontAwesomeIcon icon={icons.signIn} />
          Sign in
        </Link>
        <Link to="/auth/register" style={styles.link}>
          <FontAwesomeIcon icon={icons.register} />
          Register
        </Link>
      </div>
    </div>
  )
}
