import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getMyCertificates, getCertificateDetail } from '../../api/certificates.js'

export function useMyCertificates(options = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.certificates.mine(),
    queryFn: () => getMyCertificates(token),
    enabled: !!token && (options.enabled !== false),
  })
}

export function useCertificateDetail(id, options = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.certificates.detail(id),
    queryFn: () => getCertificateDetail(token, id),
    enabled: !!token && !!id && (options.enabled !== false),
  })
}
