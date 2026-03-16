import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getStaffProfile, setStaffPassword, setStaffActive, deleteStaff, updateStaffProfile } from '../../api/admin/staff.js'
import { getTraineeProfile, getTraineeEnrolledCourses, setTraineePassword, deleteTrainee, updateTraineeProfile } from '../../api/admin/trainees.js'
import { getAdminCertificates } from '../../api/admin/certificates.js'

export function useStaffProfile(staffId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.users.staff(staffId),
    queryFn: async () => {
      const data = await getStaffProfile(token, staffId)
      return { ...data, userType: 'staff' }
    },
    enabled: !!token && !!staffId,
  })
}

export function useTraineeAdminProfile(traineeId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.users.trainee(traineeId),
    queryFn: async () => {
      const data = await getTraineeProfile(token, traineeId)
      const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.email
      return { ...data, fullName, userType: 'trainee' }
    },
    enabled: !!token && !!traineeId,
  })
}

export function useTraineeEnrolledCourses(traineeId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.users.traineeEnrolled(traineeId),
    queryFn: () => getTraineeEnrolledCourses(token, traineeId),
    enabled: !!token && !!traineeId,
  })
}

export function useTraineeCertificates(traineeId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.admin.assessment.certificates(), 'trainee', traineeId],
    queryFn: async () => {
      const allCerts = await getAdminCertificates(token).catch(() => [])
      return Array.isArray(allCerts) ? allCerts.filter((c) => c.traineeId === traineeId && !c.revoked) : []
    },
    enabled: !!token && !!traineeId,
  })
}

export function useSetStaffPassword() {
  const { token } = useAuth()
  return useMutation({
    mutationFn: ({ staffId, newPassword }) => setStaffPassword(token, staffId, newPassword),
  })
}

export function useSetTraineePassword() {
  const { token } = useAuth()
  return useMutation({
    mutationFn: ({ traineeId, newPassword }) => setTraineePassword(token, traineeId, newPassword),
  })
}

export function useSetStaffActive() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ staffId, active }) => setStaffActive(token, staffId, active),
    onSuccess: (_, { staffId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.users.staff(staffId) })
      qc.invalidateQueries({ queryKey: queryKeys.admin.overview() })
    },
  })
}

export function useDeleteStaff() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (staffId) => deleteStaff(token, staffId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.overview() })
    },
  })
}

export function useDeleteTrainee() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (traineeId) => deleteTrainee(token, traineeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.overview() })
    },
  })
}

export function useUpdateStaffProfile() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ staffId, ...payload }) => updateStaffProfile(token, staffId, payload),
    onSuccess: (_, { staffId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.users.staff(staffId) })
    },
  })
}

export function useUpdateTraineeAdminProfile() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ traineeId, ...payload }) => updateTraineeProfile(token, traineeId, payload),
    onSuccess: (_, { traineeId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.users.trainee(traineeId) })
    },
  })
}
