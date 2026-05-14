import { apiClient, assertToken, parseResponse } from '../client.js'

/**
 * Generate a platform report.
 * Sends the HTML template and metadata to the backend for processing/PDF generation.
 * 
 * @param {string} token - Auth token
 * @param {object} payload - { html, title, generatedBy }
 */
export async function generateReport(token, { html, title, generatedBy }) {
  assertToken(token)
  
  const res = await apiClient(token).post('/api/admin/reports/generate', {
    html,
    title,
    generatedBy,
    generatedAt: new Date().toISOString()
  })
  
  return parseResponse(res)
}
