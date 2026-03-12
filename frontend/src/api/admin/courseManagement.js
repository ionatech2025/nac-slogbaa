import { apiClient } from '../client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/admin/course-management/courses/:courseId/enrollments
 */
export async function getCourseEnrollments(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/course-management/courses/${courseId}/enrollments`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * GET /api/admin/course-management/courses/:courseId/can-delete
 */
export async function canDeleteCourse(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/course-management/courses/${courseId}/can-delete`)
  if (!res.ok) throw new Error('Failed to check course deletion.')
  return res.json()
}

/**
 * GET /api/admin/course-management/courses/:courseId/modules/:moduleId/can-delete
 */
export async function canDeleteModule(token, courseId, moduleId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/course-management/courses/${courseId}/modules/${moduleId}/can-delete`)
  if (!res.ok) throw new Error('Failed to check module deletion.')
  return res.json()
}
