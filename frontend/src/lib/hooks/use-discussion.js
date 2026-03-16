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
    onSuccess: (_, { courseId, threadId }) => {
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
