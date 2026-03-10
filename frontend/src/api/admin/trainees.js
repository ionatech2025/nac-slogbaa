import { apiClient } from '../client.js'

/**
 * Get a trainee's profile by id (ADMIN and SUPER_ADMIN). Returns profile object or throws on error.
 */
export async function getTraineeProfile(token, traineeId) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.get(`/api/admin/trainees/${traineeId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    let message = body.detail ?? body.message
    if (res.status === 401) {
      message = message || 'Your session may have expired. Please log in again.'
    } else if (res.status === 404) {
      message = message || 'Trainee not found.'
    } else {
      message = message || `Request failed (${res.status})`
    }
    throw new Error(message)
  }
  return res.json()
}

/**
 * Get enrolled courses for a trainee by id (ADMIN and SUPER_ADMIN).
 * Returns array of { id, title, description, imageUrl, moduleCount, completionPercentage }. Returns [] on error.
 */
export async function getTraineeEnrolledCourses(token, traineeId) {
  if (!token || !traineeId) return []
  const client = apiClient(token)
  const res = await client.get(`/api/admin/progress/trainees/${traineeId}/enrolled-courses`)
  if (!res.ok) return []
  return res.json().catch(() => [])
}

/**
 * Update trainee profile by admin (ADMIN and SUPER_ADMIN). Same shape as trainee self-update.
 */
export async function updateTraineeProfile(token, traineeId, payload) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.patch(`/api/admin/trainees/${traineeId}`, payload)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * Set a trainee's password (SUPER_ADMIN only). newPassword min 8 chars.
 */
export async function setTraineePassword(token, traineeId, newPassword) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.post(`/api/admin/trainees/${traineeId}/password`, { newPassword })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

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
