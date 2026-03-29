import { apiClient, assertToken, parseResponse } from './client.js'

export async function getStaffNotifications(token, page = 0, size = 20) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/me/staff-notifications?page=${page}&size=${size}`)
  return parseResponse(res)
}

export async function getStaffUnreadCount(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/staff-notifications/unread-count')
  return parseResponse(res)
}

export async function markStaffNotificationRead(token, notificationId) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/me/staff-notifications/${notificationId}/read`)
  return parseResponse(res)
}

export async function markAllStaffNotificationsRead(token) {
  assertToken(token)
  const res = await apiClient(token).patch('/api/me/staff-notifications/read-all')
  return parseResponse(res)
}
