import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getStaffProfile, setStaffPassword, setStaffActive, deleteStaff, updateStaffProfile, createStaff } from '../../api/admin/staff.js'
import { getTraineeProfile, getTraineeEnrolledCourses, setTraineePassword, deleteTrainee, updateTraineeProfile } from '../../api/admin/trainees.js'
import { getAdminCertificates, uploadManualCertificate } from '../../api/admin/certificates.js'

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
    onMutate: async ({ staffId, active }) => {
      const systemAdminStaffListKey = ['system-admin', 'staff-list']
      const staffProfileKey = queryKeys.admin.users.staff(staffId)

      await qc.cancelQueries({ queryKey: systemAdminStaffListKey })
      await qc.cancelQueries({ queryKey: staffProfileKey })

      const previousStaffList = qc.getQueryData(systemAdminStaffListKey)
      const previousProfile = qc.getQueryData(staffProfileKey)

      if (previousStaffList) {
        qc.setQueryData(systemAdminStaffListKey, (old) =>
          old?.map((staff) => (staff.id === staffId ? { ...staff, active } : staff))
        )
      }
      if (previousProfile) {
        qc.setQueryData(staffProfileKey, (old) => ({ ...old, active }))
      }

      return { previousStaffList, previousProfile, systemAdminStaffListKey, staffProfileKey }
    },
    onError: (err, variables, context) => {
      if (context?.previousStaffList) {
        qc.setQueryData(context.systemAdminStaffListKey, context.previousStaffList)
      }
      if (context?.previousProfile) {
        qc.setQueryData(context.staffProfileKey, context.previousProfile)
      }
    },
    onSettled: (_, __, { staffId }) => {
      qc.invalidateQueries({ queryKey: ['system-admin', 'staff-list'] })
      qc.invalidateQueries({ queryKey: ['system-admin', 'activities'] })
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
    onMutate: async (staffId) => {
      const listKey = ['system-admin', 'staff-list']
      await qc.cancelQueries({ queryKey: listKey })
      const previous = qc.getQueryData(listKey)
      if (previous) {
        qc.setQueryData(listKey, old => old?.filter(s => s.id !== staffId))
      }
      return { previous, listKey }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        qc.setQueryData(context.listKey, context.previous)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.overview() })
      qc.invalidateQueries({ queryKey: ['system-admin', 'staff-list'] })
      qc.invalidateQueries({ queryKey: ['system-admin', 'activities'] })
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
    onMutate: async ({ staffId, ...payload }) => {
      const listKey = ['system-admin', 'staff-list']
      await qc.cancelQueries({ queryKey: listKey })
      const previous = qc.getQueryData(listKey)
      if (previous) {
        qc.setQueryData(listKey, old => old?.map(s => s.id === staffId ? { ...s, ...payload } : s))
      }
      return { previous, listKey }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        qc.setQueryData(context.listKey, context.previous)
      }
    },
    onSettled: (_, __, { staffId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.users.staff(staffId) })
      qc.invalidateQueries({ queryKey: ['system-admin', 'staff-list'] })
      qc.invalidateQueries({ queryKey: ['system-admin', 'activities'] })
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

export function useUploadManualCertificate() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => uploadManualCertificate(token, payload),
    onSuccess: (_, { traineeId }) => {
      qc.invalidateQueries({ queryKey: [...queryKeys.admin.assessment.certificates(), 'trainee', traineeId] })
      qc.invalidateQueries({ queryKey: queryKeys.admin.users.traineeEnrolled(traineeId) })
      qc.invalidateQueries({ queryKey: queryKeys.admin.overview() })
    },
  })
}

export function useCreateStaff() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createStaff(token, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['system-admin', 'staff-list'] })
      qc.invalidateQueries({ queryKey: ['system-admin', 'activities'] })
      qc.invalidateQueries({ queryKey: queryKeys.admin.overview() })
    },
  })
}
