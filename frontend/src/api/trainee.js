import { apiClient } from './client.js'

/**
 * Fetch the current trainee's profile (GET /api/trainee/me). Requires auth token.
 * Returns profile object or throws on error.
 */
export async function getTraineeProfile(token) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.get('/api/trainee/me')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    let message = body.detail ?? body.message
    if (res.status === 401) {
      message = message || 'Your session may have expired. Please log in again to view your profile.'
    } else {
      message = message || `Request failed (${res.status})`
    }
    throw new Error(message)
  }
  return res.json()
}
