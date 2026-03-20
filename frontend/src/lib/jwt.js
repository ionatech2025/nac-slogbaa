/**
 * Decode JWT payload without verification (client-side expiry check only).
 * Returns the payload object or null if the token is malformed.
 */
export function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.')
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Check if a JWT is expired. Returns true if expired or unparseable.
 * Includes a 60-second buffer to account for clock skew.
 */
export function isTokenExpired(token, bufferSeconds = 60) {
  if (!token) return true
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return true
  return Date.now() >= (payload.exp - bufferSeconds) * 1000
}
