import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * GET /api/certificates — list trainee's certificates.
 */
export async function getMyCertificates(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/certificates')
  return parseResponse(res)
}

/**
 * GET /api/certificates/:id/download — download certificate PDF (returns blob).
 */
export async function downloadCertificate(token, certificateId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/certificates/${certificateId}/download`, { timeout: 60_000 })
  if (!res.ok) throw new Error('Failed to download certificate.')
  return res.blob()
}

/**
 * POST /api/certificates/:id/send-email — send certificate to trainee's email.
 */
export async function sendCertificateEmail(token, certificateId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/certificates/${certificateId}/send-email`)
  return parseResponse(res)
}
