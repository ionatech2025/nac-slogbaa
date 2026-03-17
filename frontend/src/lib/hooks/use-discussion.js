import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getThreads, getThread, createThread, replyToThread, resolveThread } from '../../api/discussion.js'

export function useDiscussionThreads(courseId, moduleId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: moduleId
      ? queryKeys.discussions.byCourseAndModule(courseId, moduleId)
      : queryKeys.discussions.byCourse(courseId),
    queryFn: () => getThreads(token, courseId, moduleId),
    enabled: !!token && !!courseId,
    staleTime: 60_000, // 1 min — discussions are moderately active
  })
}

export function useDiscussionThread(courseId, threadId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.discussions.thread(courseId, threadId),
    queryFn: () => getThread(token, courseId, threadId),
    enabled: !!token && !!courseId && !!threadId,
  })
}

export function useCreateThread() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, moduleId, title, body }) =>
      createThread(token, courseId, { moduleId, title, body }),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.discussions.byCourse(courseId) })
    },
  })
}

export function useReplyToThread() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, threadId, body }) =>
      replyToThread(token, courseId, threadId, { body }),
    // Optimistic update — append reply immediately
    onMutate: async ({ courseId, threadId, body }) => {
      await qc.cancelQueries({ queryKey: queryKeys.discussions.thread(courseId, threadId) })
      const prev = qc.getQueryData(queryKeys.discussions.thread(courseId, threadId))
      if (prev) {
        const optimisticReply = {
          id: `temp-${Date.now()}`,
          body,
          authorName: 'You',
          createdAt: new Date().toISOString(),
          _pending: true,
        }
        qc.setQueryData(queryKeys.discussions.thread(courseId, threadId), {
          ...prev,
          replies: [...(prev.replies ?? []), optimisticReply],
        })
      }
      return { prev, courseId, threadId }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        qc.setQueryData(
          queryKeys.discussions.thread(context.courseId, context.threadId),
          context.prev,
        )
      }
    },
    onSettled: (_, __, { courseId, threadId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.discussions.thread(courseId, threadId) })
      qc.invalidateQueries({ queryKey: queryKeys.discussions.byCourse(courseId) })
    },
  })
}

export function useResolveThread() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, threadId }) =>
      resolveThread(token, courseId, threadId),
    onSuccess: (_, { courseId, threadId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.discussions.thread(courseId, threadId) })
      qc.invalidateQueries({ queryKey: queryKeys.discussions.byCourse(courseId) })
    },
  })
}
