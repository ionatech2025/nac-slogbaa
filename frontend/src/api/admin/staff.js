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
