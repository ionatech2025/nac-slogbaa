import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * POST /api/me/bookmarks — toggle a bookmark (create or delete).
 */
export async function toggleBookmark(token, { courseId, moduleId, contentBlockId, note }) {
  assertToken(token)
  const res = await apiClient(token).post('/api/me/bookmarks', { courseId, moduleId, contentBlockId, note })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * GET /api/me/bookmarks — list bookmarks, optionally filtered by courseId.
 */
export async function getBookmarks(token, courseId) {
  assertToken(token)
  const path = courseId ? `/api/me/bookmarks?courseId=${courseId}` : '/api/me/bookmarks'
  const res = await apiClient(token).get(path)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * PUT /api/me/bookmarks/:id — update bookmark note.
 */
export async function updateBookmarkNote(token, bookmarkId, note) {
  assertToken(token)
  const res = await apiClient(token).put(`/api/me/bookmarks/${bookmarkId}`, { note })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * DELETE /api/me/bookmarks/:id — delete a bookmark.
 */
export async function deleteBookmark(token, bookmarkId) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/me/bookmarks/${bookmarkId}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
