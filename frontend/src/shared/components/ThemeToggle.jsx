import { FontAwesomeIcon, icons } from '../icons.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const styles = {
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    padding: 0,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
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
