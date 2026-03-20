import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getCategories } from '../../api/categories.js'

export function useCategories() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => getCategories(token),
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes — categories rarely change
  })
}
