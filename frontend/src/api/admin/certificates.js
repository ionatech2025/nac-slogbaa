import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * GET /api/admin/certificates — list all certificates (Admin and SuperAdmin).
 */
export async function getAdminCertificates(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/certificates')
  return parseResponse(res)
}

/**
 * POST /api/admin/certificates/:id/revoke — revoke certificate (SuperAdmin only).
 */
export async function revokeCertificate(token, certificateId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/certificates/${certificateId}/revoke`)
  if (res.status === 404) {
    throw new Error('Certificate not found or already revoked.')
  }
  return parseResponse(res)
}
