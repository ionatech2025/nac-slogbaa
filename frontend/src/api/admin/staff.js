import { apiClient } from '../client.js'

/**
 * Create a new staff user (SUPER_ADMIN only). Sends credentials to their email.
 * Requires auth token. Returns created staff { id, email, fullName, role }. Throws on failure.
 */
export async function createStaff(token, { fullName, email, role, password }) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.post('/api/admin/staff', {
    fullName,
    email,
    role,
    password,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.detail ?? body.message ?? `Request failed (${res.status})`
    throw new Error(message)
  }
  return res.json()
}

/**
 * Delete a staff user by id (SUPER_ADMIN only). Throws on failure.
 */
export async function deleteStaff(token, staffId) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.delete(`/api/admin/staff/${staffId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    let message = body.detail ?? body.message
    if (res.status === 401) {
      message = message || 'Your session may have expired or you are not authorized. Only Super Admins can delete staff. Please log in again.'
    } else {
      message = message || `Request failed (${res.status})`
    }
    throw new Error(message)
  }
}
