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
