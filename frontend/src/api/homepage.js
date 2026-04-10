import { apiClient, assertToken, parseResponse } from './client.js'

/** Public: fetch all active homepage content (no auth required) */
export async function getHomepageContent() {
  const res = await apiClient(null).get('/api/public/homepage')
  return parseResponse(res)
}

/** Public: record a page visit (fire-and-forget) */
export async function recordVisit() {
  try {
    const res = await apiClient(null).post('/api/public/homepage/visit', {})
    if (res.ok) await res.json().catch(() => {})
  } catch {
    // fire-and-forget, ignore errors
  }
}

/** Admin: get visitor count */
export async function getVisitorCount(token) {
  assertToken(token)
  const res = await apiClient(token).get('/api/v1/admin/homepage/visitors')
  const data = await parseResponse(res)
  return { total: Number(data?.total) || 0 }
}

async function parseListResponse(res) {
  const data = await parseResponse(res)
  return Array.isArray(data) ? data : []
}

// ── Admin CMS CRUD ──

export async function getAdminBanners(token) {
  assertToken(token)
  return parseListResponse(await apiClient(token).get('/api/v1/admin/homepage/banners'))
}
export async function createBanner(token, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).post('/api/v1/admin/homepage/banners', data))
}
export async function updateBanner(token, id, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).put(`/api/v1/admin/homepage/banners/${id}`, data))
}
export async function deleteBanner(token, id) {
  assertToken(token)
  return parseResponse(await apiClient(token).delete(`/api/v1/admin/homepage/banners/${id}`))
}

export async function getAdminStories(token) {
  assertToken(token)
  return parseListResponse(await apiClient(token).get('/api/v1/admin/homepage/stories'))
}
export async function createStory(token, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).post('/api/v1/admin/homepage/stories', data))
}
export async function updateStory(token, id, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).put(`/api/v1/admin/homepage/stories/${id}`, data))
}
export async function deleteStory(token, id) {
  assertToken(token)
  return parseResponse(await apiClient(token).delete(`/api/v1/admin/homepage/stories/${id}`))
}

export async function getAdminVideos(token) {
  assertToken(token)
  return parseListResponse(await apiClient(token).get('/api/v1/admin/homepage/videos'))
}
export async function createVideo(token, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).post('/api/v1/admin/homepage/videos', data))
}
export async function updateVideo(token, id, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).put(`/api/v1/admin/homepage/videos/${id}`, data))
}
export async function deleteVideo(token, id) {
  assertToken(token)
  return parseResponse(await apiClient(token).delete(`/api/v1/admin/homepage/videos/${id}`))
}

export async function getAdminPartners(token) {
  assertToken(token)
  return parseListResponse(await apiClient(token).get('/api/v1/admin/homepage/partners'))
}
export async function createPartner(token, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).post('/api/v1/admin/homepage/partners', data))
}
export async function updatePartner(token, id, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).put(`/api/v1/admin/homepage/partners/${id}`, data))
}
export async function deletePartner(token, id) {
  assertToken(token)
  return parseResponse(await apiClient(token).delete(`/api/v1/admin/homepage/partners/${id}`))
}

export async function getAdminNews(token) {
  assertToken(token)
  return parseListResponse(await apiClient(token).get('/api/v1/admin/homepage/news'))
}
export async function createNewsItem(token, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).post('/api/v1/admin/homepage/news', data))
}
export async function updateNewsItem(token, id, data) {
  assertToken(token)
  return parseResponse(await apiClient(token).put(`/api/v1/admin/homepage/news/${id}`, data))
}
export async function deleteNewsItem(token, id) {
  assertToken(token)
  return parseResponse(await apiClient(token).delete(`/api/v1/admin/homepage/news/${id}`))
}
