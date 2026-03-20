import { apiClient } from './client.js'

/** Trainee: get active live sessions */
export async function getLiveSessions(token) {
  return apiClient(token).get('/api/v1/live-sessions')
}

/** Admin: get all live sessions */
export async function getAdminLiveSessions(token) {
  return apiClient(token).get('/api/v1/admin/live-sessions')
}

export async function createLiveSession(token, data) {
  return apiClient(token).post('/api/v1/admin/live-sessions', data)
}

export async function updateLiveSession(token, id, data) {
  return apiClient(token).put(`/api/v1/admin/live-sessions/${id}`, data)
}

export async function deleteLiveSession(token, id) {
  return apiClient(token).delete(`/api/v1/admin/live-sessions/${id}`)
}
