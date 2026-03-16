import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getPublishedLibraryResources } from '../../api/learning/library.js'

export function usePublishedLibrary() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.library.published(),
    queryFn: () => getPublishedLibraryResources(token),
    enabled: !!token,
  })
}
