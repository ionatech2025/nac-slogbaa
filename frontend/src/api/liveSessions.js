import { apiClient, assertToken, parseResponse } from './client.js'

async function parseListResponse(res) {
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : []
}

/** Trainee: active live sessions (authenticated). */
export async function getLiveSessions(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/v1/live-sessions')
  return parseListResponse(res)
}

/** Admin: all live sessions */
export async function getAdminLiveSessions(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/v1/admin/live-sessions')
  return parseListResponse(res)
}

export async function createLiveSession(token, data) {
  assertToken(token)
  const res = await apiClient(token).post('/api/v1/admin/live-sessions', data)
  return parseResponse(res)
}

export async function updateLiveSession(token, id, data) {
  assertToken(token)
  const res = await apiClient(token).put(`/api/v1/admin/live-sessions/${id}`, data)
  return parseResponse(res)
}

export async function deleteLiveSession(token, id) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/v1/admin/live-sessions/${id}`)
  return parseResponse(res)
}

/** Trainee: register for a session (204). */
export async function registerForLiveSession(token, sessionId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/v1/live-sessions/${sessionId}/register`)
  return parseResponse(res)
}

/** Trainee: cancel registration (204). */
export async function unregisterFromLiveSession(token, sessionId) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/v1/live-sessions/${sessionId}/register`)
  return parseResponse(res)
}
