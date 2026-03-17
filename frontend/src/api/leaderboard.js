import { apiClient, parseResponseOrDefault } from './client.js'

export async function getLeaderboard(token, limit = 10) {
  if (!token) return []
  const res = await apiClient(token).get(`/api/leaderboard?limit=${limit}`)
  return parseResponseOrDefault(res, [])
}
