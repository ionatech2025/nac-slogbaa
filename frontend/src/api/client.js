const API_BASE = '/api'

export function apiClient() {
  return {
    get: (path) => fetch(`${API_BASE}${path}`),
    post: (path, body) =>
      fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
  }
}
