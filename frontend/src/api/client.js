/**
 * Base URL for API requests. In dev with Vite proxy use '' so /api/* is proxied to backend.
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

    put: (path, body, options = {}) =>
      fetch(buildUrl(path), {
        ...options,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        body: body != null ? JSON.stringify(body) : undefined,
      }),

    patch: (path, body, options = {}) =>
      fetch(buildUrl(path), {
        ...options,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        body: body != null ? JSON.stringify(body) : undefined,
      }),

    delete: (path, options = {}) =>
      fetch(buildUrl(path), {
        ...options,
        method: 'DELETE',
        headers: { ...authHeaders, ...options.headers },
      }),
  }
}
