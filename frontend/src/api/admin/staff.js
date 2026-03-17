import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * Create a new staff user (SUPER_ADMIN only). Sends credentials to their email.
 * Requires auth token. Returns created staff { id, email, fullName, role }. Throws on failure.
 */
export async function createStaff(token, { fullName, email, role, password }) {
  assertToken(token)
  const res = await apiClient(token).post('/api/admin/staff', { fullName, email, role, password })
  return parseResponse(res)
}

/**
 * Get staff profile by id (ADMIN and SUPER_ADMIN). Returns { id, fullName, email, role, active } or throws.
 */
export async function getStaffProfile(token, staffId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/staff/${staffId}`)
  return parseResponse(res)
}

/**
 * Set a staff user's password (SUPER_ADMIN only). newPassword min 8 chars.
 */
export async function setStaffPassword(token, staffId, newPassword) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/staff/${staffId}/password`, { newPassword })
  return parseResponse(res)
}

/**
 * Update staff profile by SuperAdmin (fullName, email).
 */
export async function updateStaffProfile(token, staffId, { fullName, email }) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/admin/staff/${staffId}`, { fullName, email })
  return parseResponse(res)
}

/**
 * Set staff active status (SUPER_ADMIN only). active: true | false.
 */
export async function setStaffActive(token, staffId, active) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/admin/staff/${staffId}/active`, { active })
  return parseResponse(res)
}

/**
 * Delete a staff user by id (SUPER_ADMIN only). Throws on failure.
 */
export async function deleteStaff(token, staffId) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/admin/staff/${staffId}`)
  return parseResponse(res)
}
