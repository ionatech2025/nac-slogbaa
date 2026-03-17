import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * GET /api/me/settings — get trainee settings.
 */
export async function getTraineeSettings(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/settings')
  return parseResponse(res)
}

/**
 * PUT /api/me/settings — update trainee settings.
 */
export async function updateTraineeSettings(token, { certificateEmailOptIn }) {
  assertToken(token)
  const res = await apiClient(token).put('/api/me/settings', { certificateEmailOptIn })
  return parseResponse(res)
}
