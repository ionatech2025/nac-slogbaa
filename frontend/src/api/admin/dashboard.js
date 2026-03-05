import { apiClient } from '../client.js'

/**
 * Fetch admin dashboard overview (counts and lists of staff and trainees).
 * Requires auth token. Returns { data } or { error }.
 */
export async function getDashboardOverview(token) {
  const client = apiClient(token)
  const res = await client.get('/api/admin/dashboard/overview')
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.message ?? `Request failed (${res.status})`
    return { error: message, status: res.status }
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
 * Fetch course count for admin dashboard. Returns number or 0 on error.
 */
export async function getCourseCount(token) {
  if (!token) return 0
  const client = apiClient(token)
  const res = await client.get('/api/admin/courses/count')
  if (!res.ok) return 0
  const body = await res.json().catch(() => ({}))
  return typeof body?.count === 'number' ? body.count : 0
}
