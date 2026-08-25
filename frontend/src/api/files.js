import { AuthError } from '../lib/query-client.js'
import { parseResponse } from './client.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

/** Matches backend `app.file.max-size-bytes` / multipart max (30 MB). */
export const MAX_UPLOAD_BYTES = 30 * 1024 * 1024

/**
 * File upload API. Uses multipart/form-data to POST to /api/files/upload.
 * Includes timeout (2 min), abort support, and consistent auth/error handling
 * matching the main apiClient pattern.
 *
 * Production must use VITE_API_BASE_URL so the file is sent to the backend,
 * not the Vercel frontend origin (which returns 413 above ~4.5 MB).
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
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    throw new Error(`This file is ${mb} MB. Maximum size is 30 MB.`)
  }

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
  if (res.status === 413) {
    throw new Error('This file is too large. Maximum size is 30 MB.')
  }

  const data = await parseResponse(res)
  return { url: data.url, size: data.size, contentType: data.contentType }
}
