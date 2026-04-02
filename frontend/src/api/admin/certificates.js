import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * GET /api/admin/certificates — list all certificates (Admin and SuperAdmin).
 */
export async function getAdminCertificates(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/certificates?size=500')
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.content ?? []
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

/**
 * POST /api/admin/certificates/upload — manually upload a certificate (SuperAdmin only).
 */
export async function uploadManualCertificate(token, { traineeId, courseId, certificateNumber, file }) {
  assertToken(token)
  const formData = new FormData()
  formData.append('traineeId', traineeId)
  formData.append('courseId', courseId)
  formData.append('certificateNumber', certificateNumber)
  formData.append('file', file)

  const res = await apiClient(token).post('/api/admin/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to upload certificate.')
  }
}
