import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/me/notifications?page=N&size=N — paginated notification list.
 */
export async function getNotifications(token, page = 0, size = 20) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/me/notifications?page=${page}&size=${size}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * GET /api/me/notifications/unread-count — returns { count: N }.
 */
export async function getUnreadCount(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/notifications/unread-count')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * PATCH /api/me/notifications/:id/read — mark a single notification as read.
 */
export async function markAsRead(token, notificationId) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/me/notifications/${notificationId}/read`)
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * PATCH /api/me/notifications/read-all — mark all notifications as read.
 */
export async function markAllAsRead(token) {
  assertToken(token)
  const res = await apiClient(token).patch('/api/me/notifications/read-all')
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
