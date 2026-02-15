import { apiClient } from '../client.js'

/**
 * Change the current staff user's password.
 * Requires auth token. Throws on failure with message from API (e.g. "Current password is incorrect").
 */
export async function changePassword(token, { currentPassword, newPassword }) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.post('/api/admin/me/password', {
    currentPassword,
    newPassword,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    let message = body.detail ?? body.message
    if (res.status === 401) {
      message = message || 'Your session may have expired. Please log in again.'
    } else {
      message = message || `Request failed (${res.status})`
    }
    throw new Error(message)
  }
}
