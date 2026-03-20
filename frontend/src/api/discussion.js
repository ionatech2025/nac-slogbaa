import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * GET /api/courses/:courseId/discussions — list threads, optionally filtered by moduleId.
 */
export async function getThreads(token, courseId, moduleId) {
  assertToken(token)
  let path = `/api/courses/${courseId}/discussions`
  if (moduleId) path += `?moduleId=${moduleId}`
  const res = await apiClient(token).get(path)
  const data = await parseResponse(res)
  return data?.content ?? data
}

/**
 * GET /api/courses/:courseId/discussions/:threadId — get thread + replies.
 */
export async function getThread(token, courseId, threadId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/courses/${courseId}/discussions/${threadId}`)
  return parseResponse(res)
}

/**
 * POST /api/courses/:courseId/discussions — create a thread.
 */
export async function createThread(token, courseId, { moduleId, title, body }) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/courses/${courseId}/discussions`, { moduleId, title, body })
  return parseResponse(res)
}

/**
 * POST /api/courses/:courseId/discussions/:threadId/replies — reply to a thread.
 */
export async function replyToThread(token, courseId, threadId, { body }) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/courses/${courseId}/discussions/${threadId}/replies`, { body })
  return parseResponse(res)
}

/**
 * PATCH /api/courses/:courseId/discussions/:threadId/resolve — mark thread resolved.
 */
export async function resolveThread(token, courseId, threadId) {
  assertToken(token)
  const res = await apiClient(token).patch(`/api/courses/${courseId}/discussions/${threadId}/resolve`, {})
  return parseResponse(res)
}
