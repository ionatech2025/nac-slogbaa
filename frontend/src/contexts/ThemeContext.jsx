/**
 * ThemeContext — thin React context wrapper around the Zustand UI store.
 * Keeps backward compatibility with useTheme() while Zustand is the source of truth.
 */
import { createContext, useContext, useEffect } from 'react'
import { useUIStore } from '../stores/ui-store.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  // Sync system preference changes
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = (e) => {
      // Only auto-switch if user hasn't explicitly set a preference in Zustand
      const persisted = useUIStore.persist?.getOptions?.()?.name
      const stored = persisted ? localStorage.getItem(persisted) : null
      const hasExplicitChoice = stored && JSON.parse(stored)?.state?.theme
      if (!hasExplicitChoice) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [setTheme])

  // Keep data-theme in sync
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = { theme, setTheme, toggleTheme }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
