import { useEffect, useRef, useCallback } from 'react'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const THROTTLE_MS = 60_000 // only reset timer once per minute to avoid perf overhead

/**
 * Logs the user out after a period of inactivity.
 *
 * @param {() => void} onIdle   — called once when the timeout fires
 * @param {number}     timeout  — idle duration in ms (default 30 min)
 */
export function useIdleTimeout(onIdle, timeout = DEFAULT_TIMEOUT_MS) {
  const timerRef = useRef(null)
  const lastResetRef = useRef(Date.now())
  const firedRef = useRef(false)

  const resetTimer = useCallback(() => {
    // Throttle: ignore rapid resets
    const now = Date.now()
    if (now - lastResetRef.current < THROTTLE_MS) return
    lastResetRef.current = now

    if (timerRef.current) clearTimeout(timerRef.current)
    firedRef.current = false
    timerRef.current = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true
        onIdle()
      }
    }, timeout)
  }, [onIdle, timeout])

  useEffect(() => {
    // Start the initial timer
    timerRef.current = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true
        onIdle()
      }
    }, timeout)

    // Attach activity listeners
    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, resetTimer, { passive: true })
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, resetTimer)
      }
    }
  }, [resetTimer, onIdle, timeout])
}
