import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * GET /api/admin/assessment/modules/:moduleId/quiz — get quiz for module (with questions and options).
 * Returns null if 404.
 */
export async function getAdminQuiz(token, moduleId) {
  assertToken(token)
  if (!moduleId) return null
  const res = await apiClient(token).get(`/api/admin/assessment/modules/${moduleId}/quiz`)
  if (res.status === 404) return null
  return parseResponse(res)
}

/**
 * PUT /api/admin/assessment/modules/:moduleId/quiz — create or update quiz (full payload).
 */
export async function saveAdminQuiz(token, moduleId, payload) {
  assertToken(token)
  if (!moduleId) throw new Error('Module ID required.')
  const res = await apiClient(token).put(`/api/admin/assessment/modules/${moduleId}/quiz`, payload)
  return parseResponse(res)
}

/**
 * GET /api/admin/assessment/attempts — list all completed quiz attempts (Admin and SuperAdmin).
 */
export async function getAdminQuizAttempts(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/assessment/attempts')
  return parseResponse(res)
}

/**
 * DELETE /api/admin/assessment/modules/:moduleId/quiz — delete quiz for module.
 */
export async function deleteAdminQuiz(token, moduleId) {
  assertToken(token)
  if (!moduleId) return
  const res = await apiClient(token).delete(`/api/admin/assessment/modules/${moduleId}/quiz`)
  if (res.status === 404) return
  return parseResponse(res)
}
