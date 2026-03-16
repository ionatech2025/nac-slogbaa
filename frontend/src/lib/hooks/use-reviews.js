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
    onSuccess: (_, { courseId }) => {
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
