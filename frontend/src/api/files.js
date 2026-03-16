import { AuthError } from '../lib/query-client.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * File upload API. Uses multipart/form-data to POST to /api/files/upload.
 * Includes timeout (2 min), abort support, and consistent auth/error handling
 * matching the main apiClient pattern.
 *
 * @param {string} token - JWT token
 * @param {File} file - File to upload
 * @param {string} subdir - Storage subdirectory (e.g. 'courses', 'library')
 * @returns {Promise<{url: string, size: number, contentType: string}>}
 */
export async function uploadFile(token, file, subdir) {
  if (!token) throw new Error('Authentication required to upload files.')
  if (!file) throw new Error('No file provided.')
  if (!subdir?.trim()) throw new Error('Subdirectory is required (e.g. courses, library).')

  const base = API_BASE.replace(/\/$/, '')
  const url = base ? `${base}/api/files/upload` : '/api/files/upload'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('subdir', subdir.trim())

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 120_000) // 2 min for uploads

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
      body: formData,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('Upload timed out. Please try a smaller file or check your connection.')
    }
    throw err
  }

  clearTimeout(timeoutId)

  if (res.status === 401) throw new AuthError()

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error ?? data.detail ?? data.message ?? `Upload failed (${res.status})`)
  }
  return { url: data.url, size: data.size, contentType: data.contentType }
}
