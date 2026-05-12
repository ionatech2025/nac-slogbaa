import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notifications.js'
import {
  getStaffNotifications,
  getStaffUnreadCount,
  markStaffNotificationRead,
  markAllStaffNotificationsRead,
} from '../../api/staff-notifications.js'

export function useNotifications(page = 0, size = 20) {
  const { token, user } = useAuth()
  const isStaff = user?.role && user.role !== 'TRAINEE'
  return useQuery({
    queryKey: isStaff ? queryKeys.staffNotifications.list(page) : queryKeys.notifications.list(page),
    queryFn: () => isStaff ? getStaffNotifications(token, page, size) : getNotifications(token, page, size),
    enabled: !!token,
    staleTime: 30_000, // 30s — notifications change frequently
  })
}

export function useUnreadCount() {
  const { token, user } = useAuth()
  const isStaff = user?.role && user.role !== 'TRAINEE'
  return useQuery({
    queryKey: isStaff ? queryKeys.staffNotifications.unreadCount() : queryKeys.notifications.unreadCount(),
    queryFn: () => isStaff ? getStaffUnreadCount(token) : getUnreadCount(token),
    enabled: !!token,
    refetchInterval: 60_000,
  })
}

export function useMarkAsRead() {
  const { token, user } = useAuth()
  const isStaff = user?.role && user.role !== 'TRAINEE'
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (notificationId) => isStaff ? markStaffNotificationRead(token, notificationId) : markAsRead(token, notificationId),
    // Optimistic update — mark as read immediately in UI
    onMutate: async (notificationId) => {
      const qkAll = isStaff ? queryKeys.staffNotifications.all : queryKeys.notifications.all;
      const qkUnread = isStaff ? queryKeys.staffNotifications.unreadCount() : queryKeys.notifications.unreadCount();
      await qc.cancelQueries({ queryKey: qkAll })
      const prevCount = qc.getQueryData(qkUnread)
      if (typeof prevCount === 'number' && prevCount > 0) {
        qc.setQueryData(qkUnread, prevCount - 1)
      }
      return { prevCount, qkUnread }
    },
    onError: (_err, _id, context) => {
      if (context?.prevCount != null) {
        qc.setQueryData(context.qkUnread, context.prevCount)
      }
    },
    onSettled: () => {
      const qkAll = isStaff ? queryKeys.staffNotifications.all : queryKeys.notifications.all;
      qc.invalidateQueries({ queryKey: qkAll })
    },
  })
}

export function useMarkAllAsRead() {
  const { token, user } = useAuth()
  const isStaff = user?.role && user.role !== 'TRAINEE'
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => isStaff ? markAllStaffNotificationsRead(token) : markAllAsRead(token),
    // Optimistic update — set unread count to 0 immediately
    onMutate: async () => {
      const qkAll = isStaff ? queryKeys.staffNotifications.all : queryKeys.notifications.all;
      const qkUnread = isStaff ? queryKeys.staffNotifications.unreadCount() : queryKeys.notifications.unreadCount();
      await qc.cancelQueries({ queryKey: qkAll })
      const prevCount = qc.getQueryData(qkUnread)
      qc.setQueryData(qkUnread, 0)
      return { prevCount, qkUnread }
    },
    onError: (_err, _vars, context) => {
      if (context?.prevCount != null) {
        qc.setQueryData(context.qkUnread, context.prevCount)
      }
    },
    onSettled: () => {
      const qkAll = isStaff ? queryKeys.staffNotifications.all : queryKeys.notifications.all;
      qc.invalidateQueries({ queryKey: qkAll })
    },
  })
}

// === Staff (admin) notifications ===

export function useStaffNotifications(page = 0, size = 20) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.staffNotifications.list(page),
    queryFn: () => getStaffNotifications(token, page, size),
    enabled: !!token,
    staleTime: 30_000,
  })
}

export function useStaffUnreadCount() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.staffNotifications.unreadCount(),
    queryFn: () => getStaffUnreadCount(token),
    enabled: !!token,
    refetchInterval: 60_000,
  })
}

export function useStaffMarkAsRead() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (notificationId) => markStaffNotificationRead(token, notificationId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.staffNotifications.all })
    },
  })
}

export function useStaffMarkAllAsRead() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markAllStaffNotificationsRead(token),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.staffNotifications.all })
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
