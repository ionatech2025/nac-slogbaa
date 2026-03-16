import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/me/achievements — get badges and XP for the current trainee.
 */
export async function getAchievements(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/achievements')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}
