import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import {
  getPublishedCourses,
  getEnrolledCourses,
  getCourseDetails,
  checkEnrollment,
  getResumePoint,
  getCompletedModuleIds,
  enrollInCourse,
  unenrollFromCourse,
  recordProgress,
  recordModuleCompletion,
} from '../../api/learning/courses.js'
import { getLeaderboard } from '../../api/leaderboard.js'

export function usePublishedCourses(page = 0, size = 10) {
  const { token } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.courses.published(), { page, size }],
    queryFn: () => getPublishedCourses(token, page, size),
    enabled: !!token,
    staleTime: 5 * 60_000, // 5 min — course catalog changes infrequently
  })
}

export function useEnrolledCourses() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.courses.enrolled(),
    queryFn: () => getEnrolledCourses(token),
    enabled: !!token,
    staleTime: 2 * 60_000, // 2 min — enrollment status changes on user action
  })
}

export function useCourseDetail(courseId) {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => getCourseDetails(token, courseId),
    enabled: !!token && !!courseId,
    staleTime: 5 * 60_000, // 5 min — course content changes infrequently
    // Use cached course summary from list as placeholder while detail loads
    placeholderData: () => {
      const courses = qc.getQueryData(queryKeys.courses.published())
      return courses?.find?.((c) => c.id === courseId)
    },
  })
}

/**
 * Prefetch course detail on hover — call this when user hovers a course card.
 * Silently fetches and caches the detail data for instant navigation.
 */
export function usePrefetchCourseDetail() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return (courseId) => {
    if (!token || !courseId) return
    qc.prefetchQuery({
      queryKey: queryKeys.courses.detail(courseId),
      queryFn: () => getCourseDetails(token, courseId),
      staleTime: 5 * 60_000,
    })
  }
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

export function useCompletedModuleIds(courseId, options = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.courses.completedModules(courseId),
    queryFn: () => getCompletedModuleIds(token, courseId),
    enabled: !!token && !!courseId && (options.enabled !== false),
    staleTime: 60_000,
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
