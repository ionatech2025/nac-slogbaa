import { useState, useCallback, createContext, useContext } from 'react'

const LiveRegionContext = createContext(null)

const srOnlyStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

/**
 * Provider that renders aria-live regions (polite + assertive) and exposes announce().
 * Place at app root. Use useAnnounce() to push messages.
 */
export function LiveRegionProvider({ children }) {
  const [politeMessage, setPoliteMessage] = useState('')
  const [assertiveMessage, setAssertiveMessage] = useState('')

  const announce = useCallback((msg, politeness = 'polite') => {
    // Clear then set to force re-announcement of identical messages
    const setter = politeness === 'assertive' ? setAssertiveMessage : setPoliteMessage
    setter('')
    requestAnimationFrame(() => setter(msg))
  }, [])

  return (
    <LiveRegionContext.Provider value={announce}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" style={srOnlyStyle}>
        {politeMessage}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" style={srOnlyStyle}>
        {assertiveMessage}
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
