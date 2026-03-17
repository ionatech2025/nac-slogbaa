import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getAchievements } from '../../api/achievements.js'

export function useAchievements() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.achievements.all(),
    queryFn: () => getAchievements(token),
    enabled: !!token,
  })
}
