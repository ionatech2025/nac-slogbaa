import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * Get dynamic system status.
 * Requires auth token (SYSTEM_ADMIN). Returns { activeSessions, database, backend, authService }.
 */
export async function getSystemStatus(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/system/status')
  return parseResponse(res)
}
