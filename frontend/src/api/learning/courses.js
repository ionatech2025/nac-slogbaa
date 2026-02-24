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
