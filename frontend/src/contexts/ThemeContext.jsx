import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'slogbaa-theme'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch (_) {}
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
    return 'dark'
  }
  return 'light'
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const setTheme = useCallback((next) => {
    const value = next === 'dark' || next === 'light' ? next : (prev) => (prev === 'dark' ? 'light' : 'dark')
    setThemeState((prev) => {
      const resolved = typeof value === 'function' ? value(prev) : value
      try {
        localStorage.setItem(STORAGE_KEY, resolved)
      } catch (_) {}
      return resolved
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch (_) {}
      return next
    })
  }, [])

  const value = {
    theme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
