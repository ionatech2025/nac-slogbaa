import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { getAdminActivities } from '../../api/admin/activities.js'
import { getAllStaff } from '../../api/admin/staff.js'
import { getSystemStatus } from '../../api/admin/system.js'

export const queryKeys = {
  systemAdmin: {
    activities: () => ['system-admin', 'activities'],
    staffList: () => ['system-admin', 'staff-list'],
    status: () => ['system-admin', 'status'],
  },
}

export function useAdminActivities() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.systemAdmin.activities(),
    queryFn: () => getAdminActivities(token),
    enabled: !!token,
  })
}

export function useAllStaff() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.systemAdmin.staffList(),
    queryFn: () => getAllStaff(token),
    enabled: !!token,
  })
}

export function useSystemStatus(opts = {}) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.systemAdmin.status(),
    queryFn: () => getSystemStatus(token),
    enabled: !!token,
    refetchInterval: 30000, // Refetch every 30s to stay dynamic
    ...opts,
  })
}
