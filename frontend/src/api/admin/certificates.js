import { apiClient } from '../client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/admin/certificates — list all certificates (Admin and SuperAdmin).
 */
export async function getAdminCertificates(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/certificates')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
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
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
