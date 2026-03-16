import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { setGlobalLogout, queryClient } from '../../../lib/query-client.js'
import { useIdleTimeout } from '../../../shared/hooks/useIdleTimeout.js'

const STORAGE_KEY = 'slogbaa_auth'
const AUTH_CHANNEL = 'slogbaa_auth_sync'

/**
 * Token storage strategy:
 * - Stores ONLY user metadata (userId, email, role, fullName) in localStorage.
 * - Token is stored in localStorage as fallback ONLY because the backend does not
 *   yet set httpOnly cookies. When the backend is configured to return tokens via
 *   Set-Cookie with httpOnly + Secure + SameSite=Strict, the frontend should:
 *   1. Stop storing `token` in localStorage entirely.
 *   2. Let the browser send the cookie automatically with credentials: 'include'.
 *   3. Remove `token` from the auth state (use only `user` + `isAuthenticated`).
 *
 * Current XSS mitigation: all HTML rendering is sanitized with DOMPurify (SafeHtml).
 */

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.token && data?.user?.userId) return data
  } catch {
    // Corrupted or missing — start fresh
  }
  return null
}

function writeStorage(token, user) {
  try {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Quota exceeded — degrade silently
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => readStored())

  const login = useCallback((token, user) => {
    const auth = { token, user }
    setState(auth)
    writeStorage(token, user)
    try {
      const bc = new BroadcastChannel(AUTH_CHANNEL)
      bc.postMessage({ type: 'login', token, user })
      bc.close()
    } catch {
      // BroadcastChannel not supported (very old browsers)
    }
  }, [])

  const logout = useCallback(() => {
    setState(null)
    writeStorage(null, null)
    queryClient.clear()
    try {
      const bc = new BroadcastChannel(AUTH_CHANNEL)
      bc.postMessage({ type: 'logout' })
      bc.close()
    } catch {
      // BroadcastChannel not supported
    }
  }, [])

  // Register global logout for the query client 401 handler
  useEffect(() => {
    setGlobalLogout(logout)
    return () => setGlobalLogout(null)
  }, [logout])

  // Cross-tab sync via BroadcastChannel
  useEffect(() => {
    let bc
    try {
      bc = new BroadcastChannel(AUTH_CHANNEL)
      bc.onmessage = (event) => {
        const msg = event.data
        if (msg?.type === 'logout') {
          setState(null)
          writeStorage(null, null)
          queryClient.clear()
        } else if (msg?.type === 'login' && msg.token && msg.user) {
          setState({ token: msg.token, user: msg.user })
          writeStorage(msg.token, msg.user)
          queryClient.clear()
        }
      }
    } catch {
      // Fallback: no cross-tab sync
    }
    return () => {
      try { bc?.close() } catch { /* cleanup */ }
    }
  }, [])

  // Auto-logout after 30 minutes of inactivity (only when authenticated)
  const idleLogout = useCallback(() => {
    if (state?.token) logout()
  }, [state?.token, logout])
  useIdleTimeout(idleLogout, 30 * 60 * 1000)

  const value = {
    token: state?.token ?? null,
    user: state?.user ?? null,
    isAuthenticated: Boolean(state?.token),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
