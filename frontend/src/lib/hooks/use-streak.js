import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getStreak, recordActivity, updateDailyGoal } from '../../api/streak.js'

export function useStreak() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.streak.current(),
    queryFn: () => getStreak(token),
    enabled: !!token,
    staleTime: 5 * 60_000, // 5 min — streak updates on activity, not frequently
  })
}

export function useRecordActivity() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (minutes) => recordActivity(token, minutes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.streak.current() })
    },
  })
}

export function useUpdateDailyGoal() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (minutes) => updateDailyGoal(token, minutes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.streak.current() })
    },
  })
}
