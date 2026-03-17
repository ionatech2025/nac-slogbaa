import { apiClient } from '../client.js'
import { AuthError } from '../../lib/query-client.js'

const client = apiClient()

/**
 * Login with email and password. Returns { data } on success or { error } on failure.
 * Backend: POST /api/auth/login -> 200 { token, userId, email, role, fullName } or 401/403/409 with problem detail.
 *
 * Note: apiClient throws AuthError on any 401 (designed for session-expired handling).
 * For the login endpoint a 401 means invalid credentials, not an expired session,
 * so we catch it here and return a user-friendly error instead.
 */
export async function login(email, password) {
  let res
  try {
    // Longer timeout to survive Render free-tier cold starts (~60s)
    res = await client.post('/api/auth/login', { email, password }, { timeout: 90_000 })
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    throw err
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.title ?? `Request failed (${res.status}).`
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
 * Backend: POST /api/auth/register -> 201 or 403 (staff email) / 409 (duplicate) with problem detail.
 */
export async function register(payload) {
  // Longer timeout to survive Render free-tier cold starts (~60s)
  const res = await client.post('/api/auth/register', {
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
  }, { timeout: 90_000 })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.title ?? `Request failed (${res.status}).`
    return { error: message, status: res.status }
  }
  return { data: { traineeId: body.traineeId, email: body.email } }
}

/**
 * Request a password reset email. Returns { data: { message } } on success or { error } on failure.
 * Backend: POST /api/auth/password-reset/request -> 200 { message } (generic message for security).
 */
export async function requestPasswordReset(email) {
  const res = await client.post('/api/auth/password-reset/request', { email: email?.trim().toLowerCase() })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.title ?? `Request failed (${res.status}).`
    return { error: message }
  }
  return { data: { message: body.message ?? 'If an account exists for this email, you will receive a reset link shortly.' } }
}

/**
 * Verify a password reset token. Returns { valid: true } or { valid: false, error }.
 * Backend: GET /api/auth/password-reset/verify?token=... -> 200 or 400.
 */
export async function verifyResetToken(token) {
  if (!token) return { valid: false, error: 'Token is required.' }
  const res = await client.get(`/api/auth/password-reset/verify?token=${encodeURIComponent(token)}`)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { valid: false, error: body.message ?? body.detail ?? body.title ?? 'Invalid or expired reset link.' }
  }
  return { valid: true }
}

/**
 * Complete password reset with token and new password. Returns { data: { message } } or { error }.
 * Backend: POST /api/auth/password-reset/confirm -> 200 { message }.
 */
export async function confirmPasswordReset(token, newPassword) {
  const res = await client.post('/api/auth/password-reset/confirm', { token, newPassword })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.title ?? `Request failed (${res.status}).`
    return { error: message }
  }
  return { data: { message: body.message ?? 'Password has been reset successfully.' } }
}

/**
 * Verify email with token. Returns { success: true } or { success: false, error }.
 * Backend: GET /api/auth/verify-email?token=... -> 200 or 400.
 */
export async function verifyEmail(token) {
  if (!token) return { success: false, error: 'Token is required.' }
  const res = await client.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { success: false, error: body.message ?? body.detail ?? body.title ?? 'Invalid or expired verification link.' }
  }
  return { success: true }
}

/**
 * Resend verification email. Returns { data: { message } } or { error }.
 * Backend: POST /api/auth/resend-verification -> 200 { message } (generic message for security).
 */
export async function resendVerification(email) {
  const res = await client.post('/api/auth/resend-verification', { email: email?.trim().toLowerCase() })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body.detail ?? body.title ?? `Request failed (${res.status}).`
    return { error: message }
  }
  return { data: { message: body.message ?? 'If an account exists for this email, a verification link will be sent shortly.' } }
}
