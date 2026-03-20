import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * GET /api/admin/library/resources — list all library resources (published and draft). Admin/SuperAdmin.
 */
export async function getAdminLibraryResources(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/library/resources?size=500')
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : data?.content ?? []
}

/**
 * POST /api/admin/library/resources — create library resource (draft). SuperAdmin only.
 */
export async function createLibraryResource(token, { title, description, resourceType, fileUrl, fileType }) {
  assertToken(token)
  const res = await apiClient(token).post('/api/admin/library/resources', {
    title: title?.trim(),
    description: description?.trim() || undefined,
    resourceType: resourceType || 'DOCUMENT',
    fileUrl: fileUrl?.trim(),
    fileType: fileType?.trim() || undefined,
  })
  return parseResponse(res)
}

/**
 * PUT /api/admin/library/resources/:id — update resource metadata. SuperAdmin only.
 */
export async function updateLibraryResource(token, resourceId, { title, description, resourceType, fileUrl, fileType }) {
  assertToken(token)
  const res = await apiClient(token).put(`/api/admin/library/resources/${resourceId}`, {
    title: title?.trim(),
    description: description?.trim() || undefined,
    resourceType: resourceType || 'DOCUMENT',
    fileUrl: fileUrl?.trim(),
    fileType: fileType?.trim() || undefined,
  })
  return parseResponse(res)
}

/**
 * POST /api/admin/library/resources/:id/publish — publish resource. SuperAdmin only.
 */
export async function publishLibraryResource(token, resourceId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/library/resources/${resourceId}/publish`)
  return parseResponse(res)
}

/**
 * POST /api/admin/library/resources/:id/unpublish — unpublish resource. SuperAdmin only.
 */
export async function unpublishLibraryResource(token, resourceId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/library/resources/${resourceId}/unpublish`)
  return parseResponse(res)
}
