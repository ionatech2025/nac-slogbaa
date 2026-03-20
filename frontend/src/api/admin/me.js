import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * Change the current staff user's password.
 * Requires auth token. Throws on failure with message from API (e.g. "Current password is incorrect").
 */
export async function changePassword(token, { currentPassword, newPassword }) {
  assertToken(token)
  const res = await apiClient(token).post('/api/admin/me/password', {
    currentPassword,
    newPassword,
  })
  return parseResponse(res)
}
