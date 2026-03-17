import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notifications.js'

export function useNotifications(page = 0, size = 20) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.notifications.list(page),
    queryFn: () => getNotifications(token, page, size),
    enabled: !!token,
  })
}

export function useUnreadCount() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => getUnreadCount(token),
    enabled: !!token,
    refetchInterval: 60_000,
  })
}

export function useMarkAsRead() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (notificationId) => markAsRead(token, notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useMarkAllAsRead() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markAllAsRead(token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}
