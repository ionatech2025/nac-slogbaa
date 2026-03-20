import { AuthError } from '../lib/query-client.js'
import { isTokenExpired } from '../lib/jwt.js'

/**
 * Base URL for API requests. In dev with Vite proxy use '' so /api/* is proxied to backend.
 * In production set VITE_API_BASE_URL to the backend origin (e.g. https://api.slogbaa.org).
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

/** URL schemes that are unsafe for img src (XSS vectors). */
const UNSAFE_SCHEMES = /^(javascript|data|vbscript|file):/i

/**
 * Resolve an asset URL (e.g. /uploads/courses/xxx.png) to the correct origin.
 * When VITE_API_BASE_URL is set, assets are served by the backend; otherwise use path as-is (proxy).
 * Rejects javascript:, data:, and similar schemes to prevent XSS from user-provided URLs.
 *
 * This acts as a URL sanitizer for use in attributes like <img src>, and will return
 * either a safe, normalized URL string or the empty string ('') if the input is unsafe.
 */
export function getAssetUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  // Allow local in-memory object URLs for file previews.
  if (trimmed.startsWith('blob:')) return trimmed
  // Reject known-unsafe schemes such as javascript:, data:, vbscript:, file:, etc.
  if (UNSAFE_SCHEMES.test(trimmed)) return ''
  // Allow fully-qualified HTTP(S) asset URLs.
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  // Fallback: treat as path relative to API_BASE or current origin.
  const base = API_BASE.replace(/\/$/, '')
  const p = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
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
/** Default request timeout (30 seconds). */
const DEFAULT_TIMEOUT_MS = 30_000

export function apiClient(token = null) {
  const rawToken = normalizeToken(token)
  const authHeaders = rawToken ? { Authorization: `Bearer ${rawToken}` } : {}
  const credentials = rawToken ? 'include' : 'same-origin'

  const request = (path, method, options = {}, body = undefined) => {
    if (rawToken && isTokenExpired(rawToken)) {
      return Promise.reject(new AuthError('Session expired'))
    }

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

export function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

export async function parseResponse(res) {
  if (res.status === 204) return null
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function parseResponseOrDefault(res, defaultValue) {
  if (!res.ok) return defaultValue
  return res.json().catch(() => defaultValue)
}
