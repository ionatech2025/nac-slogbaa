import { QueryClient } from '@tanstack/react-query'

/** Typed error for 401 responses — used by global error handler. */
export class AuthError extends Error {
  constructor(message = 'Session expired') {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Global logout handler — set by AuthProvider so the query client can
 * trigger logout on 401 without importing React context.
 */
let globalLogout = null
export function setGlobalLogout(fn) {
  globalLogout = fn
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s — data stays fresh
      gcTime: 5 * 60_000,       // 5min — garbage collect unused
      retry: (failureCount, error) => {
        if (error instanceof AuthError) return false  // never retry 401
        return failureCount < 2
      },
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        if (error instanceof AuthError && globalLogout) {
          globalLogout()
        }
      },
    },
  },
})

// Global query error handler — triggers logout on AuthError
queryClient.getQueryCache().config.onError = (error) => {
  if (error instanceof AuthError && globalLogout) {
    globalLogout()
  }
}
