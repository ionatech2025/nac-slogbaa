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

/**
 * Update the current trainee's profile (PATCH /api/trainee/me). Requires auth token.
 * Payload: { firstName, lastName, gender, districtName, region, category, street, city, postalCode }
 */
export async function updateTraineeProfile(token, payload) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.patch('/api/trainee/me', payload)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.detail ?? body.message ?? (res.status === 400 && body.errors ? 'Please check the form and try again.' : null) ?? `Request failed (${res.status})`
    throw new Error(message)
  }
  return res.status === 204 ? null : res.json()
}
