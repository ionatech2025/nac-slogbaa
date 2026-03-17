import { AuthError } from '../lib/query-client.js'

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

/**
 * Rewrite /api/ paths to /api/v1/ for API versioning.
 * Non-API paths (e.g. /uploads/) pass through unchanged.
 */
function versionedPath(path) {
  if (path.startsWith('/api/') && !path.startsWith('/api/v1/')) {
    return '/api/v1/' + path.slice('/api/'.length)
  }
  if (path.startsWith('api/') && !path.startsWith('api/v1/')) {
    return 'api/v1/' + path.slice('api/'.length)
  }
  return path
}

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = versionedPath(path.startsWith('/') ? path : `/${path}`)
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
/** Default request timeout (30 seconds). */
const DEFAULT_TIMEOUT_MS = 30_000

export function apiClient(token = null) {
  const rawToken = normalizeToken(token)
  const authHeaders = rawToken ? { Authorization: `Bearer ${rawToken}` } : {}
  const credentials = rawToken ? 'include' : 'same-origin'

  const request = (path, method, options = {}, body = undefined) => {
    const url = buildUrl(path)
    const timeoutMs = options.timeout ?? DEFAULT_TIMEOUT_MS
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    // Allow caller to pass their own signal (e.g. from TanStack Query) by chaining
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort())
    }

    const headers = {
      ...(method !== 'GET' && method !== 'DELETE' ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders,
      ...(options.headers || {}),
    }
    const opts = {
      method,
      credentials,
      headers,
      signal: controller.signal,
      ...(body != null && method !== 'GET' && method !== 'DELETE' ? { body: JSON.stringify(body) } : {}),
    }
    return fetch(url, opts)
      .then((res) => {
        clearTimeout(timeoutId)
        if (res.status === 401) throw new AuthError()
        return res
      })
      .catch((err) => {
        clearTimeout(timeoutId)
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.')
        }
        throw err
      })
  }

  return {
    get: (path, options = {}) => request(path, 'GET', options),
    post: (path, body, options = {}) => request(path, 'POST', options, body),
    put: (path, body, options = {}) => request(path, 'PUT', options, body),
    patch: (path, body, options = {}) => request(path, 'PATCH', options, body),
    delete: (path, options = {}) => request(path, 'DELETE', options),
  }
}
