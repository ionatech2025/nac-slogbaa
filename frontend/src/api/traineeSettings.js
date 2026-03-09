import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/me/settings — get trainee settings.
 */
export async function getTraineeSettings(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/settings')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * PUT /api/me/settings — update trainee settings.
 */
export async function updateTraineeSettings(token, { certificateEmailOptIn }) {
  assertToken(token)
  const res = await apiClient(token).put('/api/me/settings', { certificateEmailOptIn })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}
