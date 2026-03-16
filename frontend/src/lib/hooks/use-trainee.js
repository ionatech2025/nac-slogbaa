import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getTraineeProfile, updateTraineeProfile } from '../../api/trainee.js'
import { getTraineeSettings, updateTraineeSettings } from '../../api/traineeSettings.js'

export function useTraineeProfile() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.trainee.profile(),
    queryFn: () => getTraineeProfile(token),
    enabled: !!token,
  })
}

export function useTraineeSettings() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.trainee.settings(),
    queryFn: () => getTraineeSettings(token).catch(() => ({ certificateEmailOptIn: false })),
    enabled: !!token,
  })
}

export function useUpdateTraineeProfile() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => updateTraineeProfile(token, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.trainee.profile() })
    },
  })
}

export function useUpdateTraineeSettings() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => updateTraineeSettings(token, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.trainee.settings() })
    },
  })
}
