import { apiClient, assertToken, parseResponse } from './client.js'

/**
 * POST /api/courses/:courseId/reviews — submit a review.
 */
export async function submitReview(token, courseId, { rating, reviewText }) {
  assertToken(token)
  const res = await apiClient(token).post(`/api/courses/${courseId}/reviews`, { rating, reviewText })
  return parseResponse(res)
}

/**
 * GET /api/courses/:courseId/reviews — list reviews for a course.
 */
export async function getReviews(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/courses/${courseId}/reviews`)
  const data = await parseResponse(res)
  return data?.content ?? data
}

/**
 * GET /api/courses/:courseId/rating — get rating summary.
 */
export async function getRating(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).get(`/api/courses/${courseId}/rating`)
  return parseResponse(res)
}

/**
 * DELETE /api/courses/:courseId/reviews/mine — delete own review.
 */
export async function deleteMyReview(token, courseId) {
  assertToken(token)
  const res = await apiClient(token).delete(`/api/courses/${courseId}/reviews/mine`)
  return parseResponse(res)
}
