import { apiClient } from '../client.js'

export function authApi() {
  const client = apiClient()
  return {
    login: (email, password) => client.post('/auth/login', { email, password }),
    register: (data) => client.post('/auth/register', data),
  }
}
