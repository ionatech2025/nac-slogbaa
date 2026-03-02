import { FontAwesomeIcon, icons } from '../icons.js'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const styles = {
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    padding: 0,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={styles.button}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <FontAwesomeIcon icon={theme === 'dark' ? icons.sun : icons.moon} style={{ fontSize: '1.25rem' }} />
    </button>
  )
}
