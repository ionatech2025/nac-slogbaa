import { AuthError } from '../../lib/query-client.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

/**
 * Upload a trainee avatar image.
 * POST /api/me/avatar with multipart/form-data.
 * Returns { url: string } on success.
 */
export async function uploadAvatar(token, file) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }

  const formData = new FormData()
  formData.append('file', file)

  // Normalize token — strip any "Bearer " prefix
  let rawToken = token.trim()
  while (rawToken.toLowerCase().startsWith('bearer ')) rawToken = rawToken.slice(7).trim()

  const res = await fetch(buildUrl('/api/me/avatar'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${rawToken}`,
    },
    body: formData,
  })

  if (res.status === 401) throw new AuthError()

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(body.error ?? `Upload failed (${res.status})`)
  }

  return body
}
