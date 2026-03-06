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
 * Fetch enrolled courses (GET /api/courses/enrolled). Requires auth token.
 * Returns array of { id, title, description, moduleCount, completionPercentage }. Returns [] if 404 or error.
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
 * Record progress when trainee views course content (POST /api/courses/:courseId/progress).
 * Body: { moduleId, contentBlockId }. No-op if not enrolled. Fire-and-forget.
 */
export async function recordProgress(token, courseId, moduleId, contentBlockId) {
  if (!token || !courseId || !moduleId || !contentBlockId) return
  const client = apiClient(token)
  const res = await client.post(`/api/courses/${courseId}/progress`, { moduleId, contentBlockId })
  if (!res.ok) {
    // fire-and-forget, don't throw
    return
  }
}

/**
 * Get trainee's resume point for a course (GET /api/courses/:courseId/resume).
 * Returns { lastModuleId, lastContentBlockId } or { lastModuleId: null, lastContentBlockId: null }.
 */
export async function getResumePoint(token, courseId) {
  if (!token || !courseId) return { lastModuleId: null, lastContentBlockId: null }
  const client = apiClient(token)
  const res = await client.get(`/api/courses/${courseId}/resume`)
  if (!res.ok) return { lastModuleId: null, lastContentBlockId: null }
  const data = await res.json().catch(() => ({}))
  return {
    lastModuleId: data.lastModuleId ?? null,
    lastContentBlockId: data.lastContentBlockId ?? null,
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
