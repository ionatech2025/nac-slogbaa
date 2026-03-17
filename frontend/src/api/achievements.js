import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * GET /api/me/achievements — get badges and XP for the current trainee.
 */
export async function getAchievements(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/achievements')
  return parseResponse(res)
}
