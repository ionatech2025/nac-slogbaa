import { useState, useEffect } from 'react'

/**
 * Debounce a value — returns the value after `delay` ms of inactivity.
 * 2026 standard for search inputs to avoid excessive filtering/queries.
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Debounce delay in ms (default 300)
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
