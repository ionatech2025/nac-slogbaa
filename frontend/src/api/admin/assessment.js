import { apiClient } from '../client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/admin/assessment/modules/:moduleId/quiz — get quiz for module (with questions and options).
 * Returns null if 404.
 */
export async function getAdminQuiz(token, moduleId) {
  assertToken(token)
  if (!moduleId) return null
  const res = await apiClient(token).get(`/api/admin/assessment/modules/${moduleId}/quiz`)
  if (res.status === 404) return null
  if (res.status === 401) {
    throw new Error('Session expired or invalid. Please log out and log in again, then try saving the quiz.')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * PUT /api/admin/assessment/modules/:moduleId/quiz — create or update quiz (full payload).
 */
export async function saveAdminQuiz(token, moduleId, payload) {
  assertToken(token)
  if (!moduleId) throw new Error('Module ID required.')
  const res = await apiClient(token).put(`/api/admin/assessment/modules/${moduleId}/quiz`, payload)
  if (res.status === 401) {
    throw new Error('Session expired or invalid. Please log out and log in again, then try saving the quiz.')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * DELETE /api/admin/assessment/modules/:moduleId/quiz — delete quiz for module.
 */
export async function deleteAdminQuiz(token, moduleId) {
  assertToken(token)
  if (!moduleId) return
  const res = await apiClient(token).delete(`/api/admin/assessment/modules/${moduleId}/quiz`)
  if (res.status === 404) return
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
