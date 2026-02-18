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

/**
 * Register a trainee. Returns { data: { traineeId, email } } on success or { error } on failure.
 * Backend: POST /auth/register -> 201 or 403 (staff email) / 409 (duplicate) with problem detail.
 */
export async function register(payload) {
  const res = await client.post('/auth/register', {
    email: payload.email?.trim(),
    password: payload.password,
    firstName: payload.firstName?.trim(),
    lastName: payload.lastName?.trim(),
    gender: payload.gender,
    traineeCategory: payload.traineeCategory,
    districtName: payload.districtName?.trim(),
    region: payload.region?.trim() || undefined,
    phoneCountryCode: payload.phoneCountryCode?.trim() || undefined,
    phoneNationalNumber: payload.phoneNationalNumber?.trim() || undefined,
    street: payload.street?.trim() || undefined,
    city: payload.city?.trim() || undefined,
    postalCode: payload.postalCode?.trim() || undefined,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.title ?? `Request failed (${res.status}).`
    return { error: message, status: res.status }
  }
  return { data: { traineeId: body.traineeId, email: body.email } }
}
