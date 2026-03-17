import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * Get a trainee's profile by id (ADMIN and SUPER_ADMIN). Returns profile object or throws on error.
 */
export async function getTraineeProfile(token, traineeId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/trainees/${traineeId}`)
  return parseResponse(res)
}

/**
 * Get enrolled courses for a trainee by id (ADMIN and SUPER_ADMIN).
 * Returns array of { id, title, description, imageUrl, moduleCount, completionPercentage }. Throws on error.
 */
export async function getTraineeEnrolledCourses(token, traineeId) {
  assertToken(token)
  if (!traineeId) throw new Error('Trainee ID is required.')
  const res = await apiClient(token).get(`/api/admin/progress/trainees/${traineeId}/enrolled-courses`)
  return parseResponse(res)
}

/**
 * Update trainee profile by admin (ADMIN and SUPER_ADMIN). Same shape as trainee self-update.
 */
export async function updateTraineeProfile(token, traineeId, payload) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/admin/trainees/${traineeId}`, payload)
  return parseResponse(res)
}

/**
 * Set a trainee's password (SUPER_ADMIN only). newPassword min 8 chars.
 */
export async function setTraineePassword(token, traineeId, newPassword) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/trainees/${traineeId}/password`, { newPassword })
  return parseResponse(res)
}

/**
 * Delete a trainee by id (SUPER_ADMIN only). Throws on failure.
 */
export async function deleteTrainee(token, traineeId) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/admin/trainees/${traineeId}`)
  return parseResponse(res)
}
