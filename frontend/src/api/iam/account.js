import { apiClient } from '../client.js'

function assertToken(token) {
  if (!token) throw new Error('Your session is missing. Please log in again.')
}

/**
 * GET /api/me/data-export — export all trainee data as JSON.
 * Triggers a file download in the browser.
 */
export async function exportMyData(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/me/data-export')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Export failed (${res.status})`)
  }
  const data = await res.json()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `slogbaa-my-data-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * DELETE /api/me/account — permanently delete trainee account.
 * @param {string} token - auth JWT
 * @param {string} reason - optional reason for deletion
 */
export async function deleteMyAccount(token, reason) {
  assertToken(token)
  const client = apiClient(token)
  const path = reason
    ? `/api/me/account?reason=${encodeURIComponent(reason)}`
    : '/api/me/account'
  const res = await client.delete(path)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? body.message ?? `Account deletion failed (${res.status})`)
  }
}
