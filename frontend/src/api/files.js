/**
 * File upload API. Uses multipart/form-data to POST to /api/files/upload.
 * Returns { url, size, contentType } on success.
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

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
  const base = API_BASE.replace(/\/$/, '')
  const path = '/api/files/upload'
  const url = base ? `${base}${path}` : path

  const formData = new FormData()
  formData.append('file', file)
  formData.append('subdir', subdir.trim())

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error ?? data.detail ?? data.message ?? `Upload failed (${res.status})`)
  }
  return { url: data.url, size: data.size, contentType: data.contentType }
}
