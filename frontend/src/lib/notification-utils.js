import { icons } from '../shared/icons.jsx'

export function timeAgo(dateStr) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export function notificationIcon(type) {
  switch (type) {
    case 'BADGE_AWARDED':
      return icons.certificate
    case 'COURSE_COMPLETED':
      return icons.checkCircle
    case 'DISCUSSION_REPLY':
      return icons.messageSquare
    case 'LIVE_SESSION_UPCOMING':
      return icons.blockVideo
    default:
      return icons.bell
  }
}
