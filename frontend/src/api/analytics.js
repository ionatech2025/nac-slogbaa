import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * GET /api/admin/analytics/engagement — reviews, ratings, and (super admin) discussion metrics.
 */
export async function getEngagementAnalytics(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/analytics/engagement')
  return parseResponse(res)
}
