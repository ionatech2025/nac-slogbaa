import { apiClient } from '../client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/admin/library/resources — list all library resources (published and draft). Admin/SuperAdmin.
 */
export async function getAdminLibraryResources(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/library/resources')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
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
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
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
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * POST /api/admin/library/resources/:id/publish — publish resource. SuperAdmin only.
 */
export async function publishLibraryResource(token, resourceId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/library/resources/${resourceId}/publish`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * POST /api/admin/library/resources/:id/unpublish — unpublish resource. SuperAdmin only.
 */
export async function unpublishLibraryResource(token, resourceId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/library/resources/${resourceId}/unpublish`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
