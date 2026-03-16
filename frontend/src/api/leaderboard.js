import { apiClient } from './client.js'

export async function getLeaderboard(token, limit = 10) {
  if (!token) return []
  const client = apiClient(token)
  const res = await client.get(`/api/leaderboard?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to load leaderboard')
  return res.json()
}
