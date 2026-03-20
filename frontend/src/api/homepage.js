import { apiClient } from './client.js'

/** Public: fetch all active homepage content (no auth required) */
export async function getHomepageContent() {
  return apiClient(null).get('/api/v1/public/homepage')
}

/** Public: record a page visit (fire-and-forget) */
export async function recordVisit() {
  try {
    await apiClient(null).post('/api/v1/public/homepage/visit', {})
  } catch {
    // fire-and-forget, ignore errors
  }
}

/** Admin: get visitor count */
export async function getVisitorCount(token) {
  return apiClient(token).get('/api/v1/admin/homepage/visitors')
}

// ── Admin CMS CRUD ──

export async function getAdminBanners(token) { return apiClient(token).get('/api/v1/admin/homepage/banners') }
export async function createBanner(token, data) { return apiClient(token).post('/api/v1/admin/homepage/banners', data) }
export async function updateBanner(token, id, data) { return apiClient(token).put(`/api/v1/admin/homepage/banners/${id}`, data) }
export async function deleteBanner(token, id) { return apiClient(token).delete(`/api/v1/admin/homepage/banners/${id}`) }

export async function getAdminStories(token) { return apiClient(token).get('/api/v1/admin/homepage/stories') }
export async function createStory(token, data) { return apiClient(token).post('/api/v1/admin/homepage/stories', data) }
export async function updateStory(token, id, data) { return apiClient(token).put(`/api/v1/admin/homepage/stories/${id}`, data) }
export async function deleteStory(token, id) { return apiClient(token).delete(`/api/v1/admin/homepage/stories/${id}`) }

export async function getAdminVideos(token) { return apiClient(token).get('/api/v1/admin/homepage/videos') }
export async function createVideo(token, data) { return apiClient(token).post('/api/v1/admin/homepage/videos', data) }
export async function updateVideo(token, id, data) { return apiClient(token).put(`/api/v1/admin/homepage/videos/${id}`, data) }
export async function deleteVideo(token, id) { return apiClient(token).delete(`/api/v1/admin/homepage/videos/${id}`) }

export async function getAdminPartners(token) { return apiClient(token).get('/api/v1/admin/homepage/partners') }
export async function createPartner(token, data) { return apiClient(token).post('/api/v1/admin/homepage/partners', data) }
export async function updatePartner(token, id, data) { return apiClient(token).put(`/api/v1/admin/homepage/partners/${id}`, data) }
export async function deletePartner(token, id) { return apiClient(token).delete(`/api/v1/admin/homepage/partners/${id}`) }

export async function getAdminNews(token) { return apiClient(token).get('/api/v1/admin/homepage/news') }
export async function createNewsItem(token, data) { return apiClient(token).post('/api/v1/admin/homepage/news', data) }
export async function updateNewsItem(token, id, data) { return apiClient(token).put(`/api/v1/admin/homepage/news/${id}`, data) }
export async function deleteNewsItem(token, id) { return apiClient(token).delete(`/api/v1/admin/homepage/news/${id}`) }
