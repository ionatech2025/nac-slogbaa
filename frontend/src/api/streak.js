import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * GET /api/me/streak — get current streak data.
 */
export async function getStreak(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/streak')
  return parseResponse(res)
}

/**
 * POST /api/me/activity — record activity minutes.
 */
export async function recordActivity(token, minutes) {
  assertToken(token)
  const res = await apiClient(token).post('/api/me/activity', { minutesSpent: minutes })
  return parseResponse(res)
}

/**
 * PUT /api/me/daily-goal — update daily goal minutes.
 */
export async function updateDailyGoal(token, minutes) {
  assertToken(token)
  const res = await apiClient(token).put('/api/me/daily-goal', { minutes })
  return parseResponse(res)
}
