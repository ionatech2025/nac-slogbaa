import { useState, useCallback } from 'react'

/**
 * React hook for localStorage-backed state with JSON serialization.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if nothing stored
 * @returns {[value, setValue]} — same API as useState
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // quota exceeded — degrade silently
        }
        return next
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
