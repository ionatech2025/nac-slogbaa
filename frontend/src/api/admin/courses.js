import { apiClient } from '../client.js'

/**
 * Admin learning API — SuperAdmin create/edit/publish; Admin view-only.
 */

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/admin/courses — list all courses (including unpublished).
 */
export async function getAdminCourses(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/admin/courses')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * GET /api/admin/courses/:id — get course details for admin (including unpublished).
 */
export async function getAdminCourseDetails(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/admin/courses/${courseId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? (res.status === 404 ? 'Course not found.' : `Request failed (${res.status})`))
  }
  return res.json()
}

/**
 * POST /api/admin/courses — create course. SuperAdmin only.
 */
export async function createCourse(token, { title, description }) {
  assertToken(token)
  const res = await apiClient(token).post('/api/admin/courses', { title, description })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  const data = await res.json()
  return { id: data.id }
}

/**
 * PUT /api/admin/courses/:id — update course.
 */
export async function updateCourse(token, courseId, { title, description }) {
  assertToken(token)
  const res = await apiClient(token).put(`/api/admin/courses/${courseId}`, { title, description })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * POST /api/admin/courses/:id/modules — add module.
 */
export async function addModule(token, courseId, { title, description, moduleOrder, hasQuiz }) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/courses/${courseId}/modules`, {
    title,
    description: description ?? '',
    moduleOrder: moduleOrder ?? 0,
    hasQuiz: hasQuiz ?? false,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  const data = await res.json()
  return { id: data.id }
}

/**
 * PUT /api/admin/courses/:courseId/modules/:moduleId — update module (title, description).
 */
export async function updateModule(token, courseId, moduleId, { title, description }) {
  assertToken(token)
  const res = await apiClient(token).put(
    `/api/admin/courses/${courseId}/modules/${moduleId}`,
    { title: title ?? '', description: description ?? '' }
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * POST /api/admin/courses/:courseId/modules/:moduleId/blocks — add content block.
 */
export async function addContentBlock(token, courseId, moduleId, block) {
  assertToken(token)
  const res = await apiClient(token).post(
    `/api/admin/courses/${courseId}/modules/${moduleId}/blocks`,
    block
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  const data = await res.json()
  return { id: data.id }
}

/**
 * PUT /api/admin/courses/:courseId/modules/:moduleId/blocks/:blockId — update content block.
 */
export async function updateContentBlock(token, courseId, moduleId, blockId, block) {
  assertToken(token)
  const res = await apiClient(token).put(
    `/api/admin/courses/${courseId}/modules/${moduleId}/blocks/${blockId}`,
    block
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * DELETE /api/admin/courses/:courseId/modules/:moduleId/blocks/:blockId — delete content block.
 */
export async function deleteContentBlock(token, courseId, moduleId, blockId) {
  assertToken(token)
  const res = await apiClient(token).delete(
    `/api/admin/courses/${courseId}/modules/${moduleId}/blocks/${blockId}`
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * POST /api/admin/courses/:id/publish — publish course.
 */
export async function publishCourse(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/admin/courses/${courseId}/publish`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
