import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/certificates — list trainee's certificates.
 */
export async function getMyCertificates(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/certificates')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * GET /api/certificates/:id/download — download certificate PDF (returns blob).
 */
export async function downloadCertificate(token, certificateId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/certificates/${certificateId}/download`, { responseType: 'blob' })
  if (!res.ok) throw new Error('Failed to download certificate.')
  return res.blob()
}

/**
 * POST /api/certificates/:id/send-email — send certificate to trainee's email.
 */
export async function sendCertificateEmail(token, certificateId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/certificates/${certificateId}/send-email`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
