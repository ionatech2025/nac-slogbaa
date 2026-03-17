import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import {
  getPublishedCourses,
  getEnrolledCourses,
  getCourseDetails,
  checkEnrollment,
  getResumePoint,
  enrollInCourse,
  unenrollFromCourse,
  recordProgress,
  recordModuleCompletion,
} from '../../api/learning/courses.js'
import { getLeaderboard } from '../../api/leaderboard.js'

export function usePublishedCourses() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.courses.published(),
    queryFn: () => getPublishedCourses(token),
    enabled: !!token,
  })
}

export function useEnrolledCourses() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.courses.enrolled(),
    queryFn: () => getEnrolledCourses(token),
    enabled: !!token,
  })
}

export function useCourseDetail(courseId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => getCourseDetails(token, courseId),
    enabled: !!token && !!courseId,
  })
}

export function useCheckEnrollment(courseId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.courses.enrollment(courseId),
    queryFn: () => checkEnrollment(token, courseId),
    enabled: !!token && !!courseId,
  })
}

export function useResumePoint(courseId, options = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.courses.resume(courseId),
    queryFn: () => getResumePoint(token, courseId),
    enabled: !!token && !!courseId && (options.enabled !== false),
    staleTime: 0,
  })
}

export function useEnrollInCourse() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => enrollInCourse(token, courseId),
    // Optimistic update — show enrollment immediately
    onMutate: async (courseId) => {
      await qc.cancelQueries({ queryKey: queryKeys.courses.enrolled() })
      const prev = qc.getQueryData(queryKeys.courses.enrolled())
      const published = qc.getQueryData(queryKeys.courses.published()) ?? []
      const course = published.find((c) => c.id === courseId)
      if (course && prev) {
        qc.setQueryData(queryKeys.courses.enrolled(), [...prev, { ...course, completionPercentage: 0 }])
      }
      return { prev }
    },
    onError: (_err, _courseId, context) => {
      // Rollback on failure
      if (context?.prev) qc.setQueryData(queryKeys.courses.enrolled(), context.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.courses.enrolled() })
      qc.invalidateQueries({ queryKey: queryKeys.courses.published() })
    },
  })
}

export function useUnenroll() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => unenrollFromCourse(token, courseId),
    onSuccess: (_data, courseId) => {
      qc.invalidateQueries({ queryKey: queryKeys.courses.enrolled() })
      qc.invalidateQueries({ queryKey: queryKeys.courses.published() })
      qc.invalidateQueries({ queryKey: queryKeys.courses.enrollment(courseId) })
    },
  })
}

export function useRecordProgress() {
  const { token } = useAuth()
  return useMutation({
    mutationFn: ({ courseId, moduleId, contentBlockId }) =>
      recordProgress(token, courseId, moduleId, contentBlockId),
    // Fire-and-forget — don't invalidate anything
  })
}

export function useRecordModuleCompletion() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, moduleId, quizPassed }) =>
      recordModuleCompletion(token, courseId, moduleId, quizPassed),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.courses.enrolled() })
      qc.invalidateQueries({ queryKey: queryKeys.courses.detail(courseId) })
    },
  })
}

export function useLeaderboard(limit = 10) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.leaderboard.top(limit),
    queryFn: () => getLeaderboard(token, limit),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
