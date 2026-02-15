import { apiClient } from '../client.js'

/**
 * Delete a trainee by id (SUPER_ADMIN only). Throws on failure.
 */
export async function deleteTrainee(token, traineeId) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.delete(`/api/admin/trainees/${traineeId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    let message = body.detail ?? body.message
    if (res.status === 401) {
      message = message || 'Your session may have expired or you are not authorized. Only Super Admins can delete trainees. Please log in again.'
    } else {
      message = message || `Request failed (${res.status})`
    }
    throw new Error(message)
  }
}
