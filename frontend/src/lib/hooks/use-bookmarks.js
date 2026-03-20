import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getBookmarks, toggleBookmark, updateBookmarkNote, deleteBookmark } from '../../api/bookmarks.js'

export function useBookmarks(courseId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.bookmarks.list(courseId),
    queryFn: () => getBookmarks(token, courseId),
    enabled: !!token,
  })
}

export function useAllBookmarks() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.bookmarks.all,
    queryFn: () => getBookmarks(token),
    enabled: !!token,
  })
}

export function useToggleBookmark() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, moduleId, contentBlockId, note }) =>
      toggleBookmark(token, { courseId, moduleId, contentBlockId, note }),
    // Optimistic update — toggle bookmark state immediately
    onMutate: async ({ courseId, contentBlockId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.bookmarks.list(courseId) })
      const prev = qc.getQueryData(queryKeys.bookmarks.list(courseId))
      if (prev) {
        const exists = prev.some((b) => b.contentBlockId === contentBlockId)
        qc.setQueryData(
          queryKeys.bookmarks.list(courseId),
          exists
            ? prev.filter((b) => b.contentBlockId !== contentBlockId)
            : [...prev, { contentBlockId, courseId, createdAt: new Date().toISOString() }],
        )
      }
      return { prev, courseId }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) qc.setQueryData(queryKeys.bookmarks.list(context.courseId), context.prev)
    },
    onSettled: (_, __, { courseId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.list(courseId) })
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.all })
    },
  })
}

export function useUpdateNote() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookmarkId, note }) =>
      updateBookmarkNote(token, bookmarkId, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.all })
    },
  })
}

export function useDeleteBookmark() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bookmarkId) => deleteBookmark(token, bookmarkId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.all })
    },
  })
}
