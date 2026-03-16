import { useState, useCallback, createContext, useContext } from 'react'

const LiveRegionContext = createContext(null)

/**
 * Provider that renders an aria-live region and exposes announce().
 * Place at app root. Use useAnnounce() to push messages.
 */
export function LiveRegionProvider({ children }) {
  const [message, setMessage] = useState('')

  const announce = useCallback((msg, politeness = 'polite') => {
    // Clear then set to force re-announcement of identical messages
    setMessage('')
    requestAnimationFrame(() => setMessage(msg))
  }, [])

  return (
    <LiveRegionContext.Provider value={announce}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {message}
      </div>
    </LiveRegionContext.Provider>
  )
}

/**
 * Hook to announce messages to screen readers.
 * @returns {(message: string) => void}
 */
export function useAnnounce() {
  const announce = useContext(LiveRegionContext)
  if (!announce) return () => {} // graceful fallback
  return announce
}
