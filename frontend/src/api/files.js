import { AuthError } from '../lib/query-client.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

/** Matches backend `app.file.max-size-bytes` / multipart max (30 MB). */
export const MAX_UPLOAD_BYTES = 30 * 1024 * 1024

function uploadUrl() {
  const base = API_BASE.replace(/\/$/, '')
  return base ? `${base}/api/files/upload` : '/api/files/upload'
}

function parseUploadBody(status, text) {
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }
  if (status === 401) throw new AuthError()
  if (status === 413) {
    throw new Error('This file is too large. Maximum size is 30 MB.')
  }
  if (status < 200 || status >= 300) {
    throw new Error(data.detail ?? data.message ?? data.error ?? `Request failed (${status})`)
  }
  if (!data.url) {
    throw new Error('Upload did not reach the file API. Refresh to load a new app version, then try again.')
  }
  return { url: data.url, size: data.size, contentType: data.contentType }
}

/**
 * File upload API. Uses multipart/form-data to POST to /api/files/upload.
 * Uses XHR so upload progress is visible and the request is not left pending
 * when a static host (Vercel) returns HTML instead of JSON.
 *
 * @param {string} token
 * @param {File} file
 * @param {string} subdir
 * @param {{ onProgress?: (percent: number) => void }} [options]
 */
export async function uploadFile(token, file, subdir, options = {}) {
  if (!token) throw new Error('Authentication required to upload files.')
  if (!file) throw new Error('No file provided.')
  if (!subdir?.trim()) throw new Error('Subdirectory is required (e.g. courses, library).')
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    throw new Error(`This file is ${mb} MB. Maximum size is 30 MB.`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('subdir', subdir.trim())

  const url = uploadUrl()
  const { onProgress } = options

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.timeout = 120_000
    xhr.withCredentials = true
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        resolve(parseUploadBody(xhr.status, xhr.responseText))
      } catch (err) {
        reject(err)
      }
    }
    xhr.onerror = () => reject(new Error('Network error during upload. Please try again.'))
    xhr.ontimeout = () => reject(new Error('Upload timed out. Please try a smaller file or check your connection.'))
    xhr.onabort = () => reject(new Error('Upload was cancelled.'))
    xhr.send(formData)
  })
}
