import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * Fetch the current trainee's profile (GET /api/trainee/me). Requires auth token.
 * Returns profile object or throws on error.
 */
export async function getTraineeProfile(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/trainee/me')
  return parseResponse(res)
}

/**
 * Update the current trainee's profile (PATCH /api/trainee/me). Requires auth token.
 * Payload: { firstName, lastName, gender, districtName, region, category, street, city, postalCode }
 */
export async function updateTraineeProfile(token, payload) {
  assertToken(token)
  const res = await apiClient(token).patch('/api/trainee/me', payload)
  return parseResponse(res)
}

/**
 * Change the current trainee's password (POST /api/me/password). Requires auth token.
 * Payload: { currentPassword, newPassword }
 */
export async function updateTraineePassword(token, currentPassword, newPassword) {
  assertToken(token)
  const res = await apiClient(token).post('/api/me/password', { currentPassword, newPassword })
  return parseResponse(res)
}
