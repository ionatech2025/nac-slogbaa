import { apiClient } from './client.js'

/**
 * Fetch all course categories (GET /api/courses/categories). Requires auth token.
 * Returns array of { id, name, slug }.
 */
export async function getCategories(token) {
  if (!token) return []
  const client = apiClient(token)
  const res = await client.get('/api/courses/categories')
  if (!res.ok) return []
  return res.json().catch(() => [])
}
