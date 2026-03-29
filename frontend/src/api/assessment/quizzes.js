import { apiClient } from '../client.js'

async function parseError(res) {
  const body = await res.json().catch(() => ({}))
  return body.detail ?? body.message ?? `Request failed (${res.status})`
}

export async function getQuizForModule(token, courseId, moduleId) {
  if (!token || !courseId || !moduleId) return null
  const client = apiClient(token)
  const res = await client.get(`/api/courses/${courseId}/modules/${moduleId}/quiz`)
  if (res.status === 404) return null
  if (res.status === 401) {
    throw new Error('Session expired or invalid. Please log out and log in again to view the quiz.')
  }
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function startQuizAttempt(token, courseId, moduleId) {
  if (!token || !courseId || !moduleId) throw new Error('Missing session or module.')
  const client = apiClient(token)
  const res = await client.post(`/api/courses/${courseId}/modules/${moduleId}/quiz/attempts`, {})
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function submitQuizAttempt(token, courseId, moduleId, attemptId, answers) {
  if (!token || !courseId || !moduleId || !attemptId) throw new Error('Missing session or attempt.')
  const client = apiClient(token)
  const res = await client.post(
    `/api/courses/${courseId}/modules/${moduleId}/quiz/attempts/${attemptId}/submit`,
    { answers: Array.isArray(answers) ? answers : [] }
  )
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

/** GET .../quiz/last-passed-result — latest passed attempt review (read-only). 404 if none. */
export async function getLastPassedQuizResult(token, courseId, moduleId) {
  if (!token || !courseId || !moduleId) return null
  const client = apiClient(token)
  const res = await client.get(`/api/courses/${courseId}/modules/${moduleId}/quiz/last-passed-result`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

