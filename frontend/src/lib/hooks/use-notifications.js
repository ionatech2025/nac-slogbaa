import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notifications.js'

export function useNotifications(page = 0, size = 20) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.notifications.list(page),
    queryFn: () => getNotifications(token, page, size),
    enabled: !!token,
    staleTime: 30_000, // 30s — notifications change frequently
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
    // Optimistic update — mark as read immediately in UI
    onMutate: async (notificationId) => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications.all })
      const prevCount = qc.getQueryData(queryKeys.notifications.unreadCount())
      if (typeof prevCount === 'number' && prevCount > 0) {
        qc.setQueryData(queryKeys.notifications.unreadCount(), prevCount - 1)
      }
      return { prevCount }
    },
    onError: (_err, _id, context) => {
      if (context?.prevCount != null) {
        qc.setQueryData(queryKeys.notifications.unreadCount(), context.prevCount)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useMarkAllAsRead() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markAllAsRead(token),
    // Optimistic update — set unread count to 0 immediately
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications.all })
      const prevCount = qc.getQueryData(queryKeys.notifications.unreadCount())
      qc.setQueryData(queryKeys.notifications.unreadCount(), 0)
      return { prevCount }
    },
    onError: (_err, _vars, context) => {
      if (context?.prevCount != null) {
        qc.setQueryData(queryKeys.notifications.unreadCount(), context.prevCount)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useInfiniteNotifications(size = 20) {
  const { token } = useAuth()
  return useInfiniteQuery({
    queryKey: [...queryKeys.notifications.all, 'infinite'],
    queryFn: ({ pageParam = 0 }) => getNotifications(token, pageParam, size),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined
      return lastPage.number + 1
    },
    initialPageParam: 0,
    enabled: !!token,
  })
}
