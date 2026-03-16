import { apiClient } from './client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * POST /api/courses/:courseId/reviews — submit a review.
 */
export async function submitReview(token, courseId, { rating, reviewText }) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/courses/${courseId}/reviews`, { rating, reviewText })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}

/**
 * GET /api/courses/:courseId/reviews — list reviews for a course.
 */
export async function getReviews(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/courses/${courseId}/reviews`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * GET /api/courses/:courseId/rating — get rating summary.
 */
export async function getRating(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/courses/${courseId}/rating`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

/**
 * DELETE /api/courses/:courseId/reviews/mine — delete own review.
 */
export async function deleteMyReview(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/courses/${courseId}/reviews/mine`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Request failed (${res.status})`)
  }
}
