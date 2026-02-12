import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'slogbaa_auth'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.token && data?.user?.userId) return data
  } catch (_) {}
  return null
}

function writeStorage(token, user) {
  try {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (_) {}
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => readStored())

  const login = useCallback((token, user) => {
    const auth = { token, user }
    setState(auth)
    writeStorage(token, user)
  }, [])

  const logout = useCallback(() => {
    setState(null)
    writeStorage(null, null)
  }, [])

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
