import { apiClient } from '../client.js'

/**
 * Fetch published library resources (GET /api/library/resources). Requires auth (TRAINEE or STAFF).
 * Returns array of { id, title, description, resourceType, fileUrl, fileType }.
 */
export async function getPublishedLibraryResources(token) {
  if (!token) {
    throw new Error('Your session is missing. Please log in again.')
  }
  const client = apiClient(token)
  const res = await client.get('/api/library/resources')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.detail ?? body.message ?? `Request failed (${res.status})`
    throw new Error(message)
  }
  return res.json()
}
