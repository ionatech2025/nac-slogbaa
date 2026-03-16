import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/courses/:courseId/discussions — list threads, optionally filtered by moduleId.
 */
export async function getThreads(token, courseId, moduleId) {
  assertToken(token)
  let path = `/api/courses/${courseId}/discussions`
  if (moduleId) path += `?moduleId=${moduleId}`
  const res = await apiClient(token).get(path)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * GET /api/courses/:courseId/discussions/:threadId — get thread + replies.
 */
export async function getThread(token, courseId, threadId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/courses/${courseId}/discussions/${threadId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * POST /api/courses/:courseId/discussions — create a thread.
 */
export async function createThread(token, courseId, { moduleId, title, body }) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/courses/${courseId}/discussions`, { moduleId, title, body })
  if (!res.ok) {
    const body2 = await res.json().catch(() => ({}))
    throw new Error(body2.detail ?? body2.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * POST /api/courses/:courseId/discussions/:threadId/replies — reply to a thread.
 */
export async function replyToThread(token, courseId, threadId, { body }) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/courses/${courseId}/discussions/${threadId}/replies`, { body })
  if (!res.ok) {
    const body2 = await res.json().catch(() => ({}))
    throw new Error(body2.detail ?? body2.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * PATCH /api/courses/:courseId/discussions/:threadId/resolve — mark thread resolved.
 */
export async function resolveThread(token, courseId, threadId) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/courses/${courseId}/discussions/${threadId}/resolve`, {})
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
