import { apiClient } from '../client.js'

/**
 * Fetch published courses (GET /api/courses). Requires auth token (TRAINEE or STAFF).
 * Returns array of course summaries.
 */
export async function getPublishedCourses(token) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.get('/api/courses')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.detail ?? body.message ?? `Request failed (${res.status})`
    throw new Error(message)
  }
  return res.json()
}

/**
 * Fetch enrolled courses (GET /api/courses/enrolled or equivalent). Requires auth token.
 * Returns array of course summaries. Returns [] if endpoint not yet implemented (404).
 */
export async function getEnrolledCourses(token) {
  if (!token) return []
  const client = apiClient(token)
  const res = await client.get('/api/courses/enrolled')
  if (res.status === 404 || !res.ok) return []
  return res.json().catch(() => [])
}

/**
 * Check if trainee is enrolled in course (GET /api/courses/:id/enrollment or equivalent).
 * Returns true if enrolled, false otherwise.
 */
export async function checkEnrollment(token, courseId) {
  if (!token || !courseId) return false
  const client = apiClient(token)
  const res = await client.get(`/api/courses/${courseId}/enrollment`)
  if (!res.ok) return false
  const data = await res.json().catch(() => ({}))
  return data?.enrolled === true
}

/**
 * Enroll trainee in course (POST /api/courses/:id/enroll or equivalent). Requires auth token.
 * Throws on error. No-op/404 until Phase 5 enrollment is implemented.
 */
export async function enrollInCourse(token, courseId) {
  if (!token || !courseId) throw new Error('Session or course missing.')
  const client = apiClient(token)
  const res = await client.post(`/api/courses/${courseId}/enroll`, {})
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.detail ?? body.message ?? (res.status === 404 ? 'Enrollment not available yet.' : `Request failed (${res.status})`)
    throw new Error(message)
  }
}

/**
 * Fetch course details with modules and content blocks (GET /api/courses/:id). Requires auth token.
 * Returns full course object or throws on 404/error.
 */
export async function getCourseDetails(token, courseId) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.get(`/api/courses/${courseId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.detail ?? body.message ?? (res.status === 404 ? 'Course not found.' : `Request failed (${res.status})`)
    throw new Error(message)
  }
  return res.json()
}
