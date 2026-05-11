import { apiClient, assertToken, parseResponse } from '../client.js'

export async function getAdminActivities(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/activities')
  return parseResponse(res)
}
