import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * GET /api/admin/course-management/courses/:courseId/enrollments
 */
export async function getCourseEnrollments(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/course-management/courses/${courseId}/enrollments?size=500`)
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.content ?? []
}

/**
 * GET /api/admin/course-management/courses/:courseId/can-delete
 */
export async function canDeleteCourse(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/course-management/courses/${courseId}/can-delete`)
  return parseResponse(res)
}

/**
 * GET /api/admin/course-management/courses/:courseId/modules/:moduleId/can-delete
 */
export async function canDeleteModule(token, courseId, moduleId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/course-management/courses/${courseId}/modules/${moduleId}/can-delete`)
  return parseResponse(res)
}
