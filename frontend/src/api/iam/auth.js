import { apiClient } from '../client.js'

const client = apiClient()

/**
 * Login with email and password. Returns { data } on success or { error } on failure.
 * Backend: POST /auth/login -> 200 { token, userId, email, role, fullName } or 401/409 with problem detail.
 */
export async function login(email, password) {
  const res = await client.post('/auth/login', { email, password })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.title ?? (res.status === 401 ? 'Invalid email or password.' : `Request failed (${res.status}).`)
    return { error: message }
  }
  return {
    data: {
      token: body.token,
      userId: body.userId,
      email: body.email,
      role: body.role,
      fullName: body.fullName ?? null,
    },
  }
}
