/**
 * Base URL for API requests. In dev with Vite proxy use '' so /api/* is proxied to backend.
 * In production set VITE_API_BASE_URL to the backend origin (e.g. https://api.slogbaa.org).
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Resolve an asset URL (e.g. /uploads/courses/xxx.png) to the correct origin.
 * When VITE_API_BASE_URL is set, assets are served by the backend; otherwise use path as-is (proxy).
 */
export function getAssetUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = API_BASE.replace(/\/$/, '')
  const p = url.startsWith('/') ? url : `/${url}`
  return base ? `${base}${p}` : p
}

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

/**
 * Normalize token to raw JWT so we always send exactly "Bearer <jwt>" (no double prefix).
 */
function normalizeToken(token) {
  if (!token || typeof token !== 'string') return null
  let t = token.trim()
  while (t.toLowerCase().startsWith('bearer ')) t = t.slice(7).trim()
  return t || null
}

/**
 * Optional: pass token to attach Authorization header for protected endpoints.
 * Uses credentials: 'include' when a token is present so cross-origin requests send the header.
 * Usage: apiClient(token).get('/some/protected-path')
 */
export function apiClient(token = null) {
  const rawToken = normalizeToken(token)
  const authHeaders = rawToken ? { Authorization: `Bearer ${rawToken}` } : {}
  const credentials = rawToken ? 'include' : 'same-origin'

  const request = (path, method, options = {}, body = undefined) => {
    const url = buildUrl(path)
    const headers = {
      ...(method !== 'GET' && method !== 'DELETE' ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders,
      ...(options.headers || {}),
    }
    const opts = {
      ...options,
      method,
      credentials,
      headers,
      ...(body != null && method !== 'GET' && method !== 'DELETE' ? { body: JSON.stringify(body) } : {}),
    }
    return fetch(url, opts)
  }

  return {
    get: (path, options = {}) => request(path, 'GET', options),
    post: (path, body, options = {}) => request(path, 'POST', options, body),
    put: (path, body, options = {}) => request(path, 'PUT', options, body),
    patch: (path, body, options = {}) => request(path, 'PATCH', options, body),
    delete: (path, options = {}) => request(path, 'DELETE', options),
  }
}
