import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/me/streak — get current streak data.
 */
export async function getStreak(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/streak')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * POST /api/me/activity — record activity minutes.
 */
export async function recordActivity(token, minutes) {
  assertToken(token)
  const res = await apiClient(token).post('/api/me/activity', { minutesSpent: minutes })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * PUT /api/me/daily-goal — update daily goal minutes.
 */
export async function updateDailyGoal(token, minutes) {
  assertToken(token)
  const res = await apiClient(token).put('/api/me/daily-goal', { minutes })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
