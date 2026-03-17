import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * GET /api/me/notifications?page=N&size=N — paginated notification list.
 */
export async function getNotifications(token, page = 0, size = 20) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/me/notifications?page=${page}&size=${size}`)
  return parseResponse(res)
}

/**
 * GET /api/me/notifications/unread-count — returns { count: N }.
 */
export async function getUnreadCount(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/notifications/unread-count')
  return parseResponse(res)
}

/**
 * PATCH /api/me/notifications/:id/read — mark a single notification as read.
 */
export async function markAsRead(token, notificationId) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/me/notifications/${notificationId}/read`)
  return parseResponse(res)
}

/**
 * PATCH /api/me/notifications/read-all — mark all notifications as read.
 */
export async function markAllAsRead(token) {
  assertToken(token)
  const res = await apiClient(token).patch('/api/me/notifications/read-all')
  return parseResponse(res)
}
