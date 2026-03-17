import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * POST /api/me/bookmarks — toggle a bookmark (create or delete).
 */
export async function toggleBookmark(token, { courseId, moduleId, contentBlockId, note }) {
  assertToken(token)
  const res = await apiClient(token).post('/api/me/bookmarks', { courseId, moduleId, contentBlockId, note })
  return parseResponse(res)
}

/**
 * GET /api/me/bookmarks — list bookmarks, optionally filtered by courseId.
 */
export async function getBookmarks(token, courseId) {
  assertToken(token)
  const path = courseId ? `/api/me/bookmarks?courseId=${courseId}` : '/api/me/bookmarks'
  const res = await apiClient(token).get(path)
  const data = await parseResponse(res)
  return data?.content ?? data
}

/**
 * PUT /api/me/bookmarks/:id — update bookmark note.
 */
export async function updateBookmarkNote(token, bookmarkId, note) {
  assertToken(token)
  const res = await apiClient(token).put(`/api/me/bookmarks/${bookmarkId}`, { note })
  return parseResponse(res)
}

/**
 * DELETE /api/me/bookmarks/:id — delete a bookmark.
 */
export async function deleteBookmark(token, bookmarkId) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/me/bookmarks/${bookmarkId}`)
  return parseResponse(res)
}
