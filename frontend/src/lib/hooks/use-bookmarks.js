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

export function useToggleBookmark() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, moduleId, contentBlockId, note }) =>
      toggleBookmark(token, { courseId, moduleId, contentBlockId, note }),
    onSuccess: (_, { courseId }) => {
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
