import { apiClient, parseResponseOrDefault } from './client.js'

/**
 * Fetch all course categories (GET /api/courses/categories). Requires auth token.
 * Returns array of { id, name, slug }.
 */
export async function getCategories(token) {
  if (!token) return []
  const res = await apiClient(token).get('/api/courses/categories')
  return parseResponseOrDefault(res, [])
}
