/**
 * Base URL for API requests. In dev with Vite proxy use '' so /auth/* is proxied to backend.
 * In production set VITE_API_BASE_URL to the backend origin (e.g. https://api.slogbaa.org).
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

/**
 * Optional: pass token to attach Authorization header for protected endpoints.
 * Usage: apiClient(token).get('/some/protected-path')
 */
export function apiClient(token = null) {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
  return {
    get: (path, options = {}) =>
      fetch(buildUrl(path), {
        ...options,
        method: 'GET',
        headers: { ...authHeaders, ...options.headers },
      }),

    post: (path, body, options = {}) =>
      fetch(buildUrl(path), {
        ...options,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        body: body != null ? JSON.stringify(body) : undefined,
      }),
  }
}
