import { apiClient, assertToken } from '../client.js'

/**
 * Fetch admin dashboard overview (counts and lists of staff and trainees).
 * Requires auth token. Returns { data }. Throws on failure.
 */
export async function getDashboardOverview(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/dashboard/overview')
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return {
    data: {
      staffCount: body.staffCount ?? 0,
      traineeCount: body.traineeCount ?? 0,
      staff: Array.isArray(body.staff) ? body.staff : [],
      trainees: Array.isArray(body.trainees) ? body.trainees : [],
    },
  }
}

/**
 * Fetch course count for admin dashboard. Returns number. Throws on failure.
 */
export async function getCourseCount(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/courses/count')
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return typeof body?.count === 'number' ? body.count : 0
}
