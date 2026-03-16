import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getMyCertificates } from '../../api/certificates.js'

export function useMyCertificates(options = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.certificates.mine(),
    queryFn: () => getMyCertificates(token),
    enabled: !!token && (options.enabled !== false),
  })
}
