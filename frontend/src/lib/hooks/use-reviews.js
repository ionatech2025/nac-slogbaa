import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getReviews, getRating, submitReview, deleteMyReview } from '../../api/reviews.js'

export function useCourseReviews(courseId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.reviews.byCourse(courseId),
    queryFn: () => getReviews(token, courseId),
    enabled: !!token && !!courseId,
    staleTime: 2 * 60_000, // 2 min — reviews change infrequently
  })
}

export function useCourseRating(courseId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.reviews.rating(courseId),
    queryFn: () => getRating(token, courseId),
    enabled: !!token && !!courseId,
  })
}

export function useSubmitReview() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, rating, reviewText }) =>
      submitReview(token, courseId, { rating, reviewText }),
    // Optimistic update — show review immediately
    onMutate: async ({ courseId, rating, reviewText }) => {
      await qc.cancelQueries({ queryKey: queryKeys.reviews.byCourse(courseId) })
      const prev = qc.getQueryData(queryKeys.reviews.byCourse(courseId))
      if (Array.isArray(prev)) {
        const optimisticReview = {
          id: `temp-${Date.now()}`,
          rating,
          reviewText,
          traineeName: 'You',
          createdAt: new Date().toISOString(),
          _pending: true,
        }
        qc.setQueryData(queryKeys.reviews.byCourse(courseId), [optimisticReview, ...prev])
      }
      return { prev, courseId }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        qc.setQueryData(queryKeys.reviews.byCourse(context.courseId), context.prev)
      }
    },
    onSettled: (_, __, { courseId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byCourse(courseId) })
      qc.invalidateQueries({ queryKey: queryKeys.reviews.rating(courseId) })
    },
  })
}

export function useDeleteReview() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => deleteMyReview(token, courseId),
    onSuccess: (_, courseId) => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byCourse(courseId) })
      qc.invalidateQueries({ queryKey: queryKeys.reviews.rating(courseId) })
    },
  })
}
