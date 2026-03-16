import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/iam/hooks/useAuth.js'
import { queryKeys } from '../query-keys.js'
import { getDashboardOverview, getCourseCount } from '../../api/admin/dashboard.js'
import { getAdminCourses, getAdminCourseDetails, createCourse, updateCourse, publishCourse, unpublishCourse, deleteCourse, deleteModule, addModule } from '../../api/admin/courses.js'
import { getAdminLibraryResources, createLibraryResource, updateLibraryResource, publishLibraryResource, unpublishLibraryResource } from '../../api/admin/library.js'
import { getAdminCertificates, revokeCertificate } from '../../api/admin/certificates.js'
import { getAdminQuizAttempts } from '../../api/admin/assessment.js'

// === Dashboard ===
export function useAdminOverview() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.overview(),
    queryFn: () => getDashboardOverview(token),
    enabled: !!token,
  })
}

export function useAdminCourseCount() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.courseCount(),
    queryFn: () => getCourseCount(token),
    enabled: !!token,
  })
}

// === Admin courses ===
export function useAdminCourses() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.courses.list(),
    queryFn: () => getAdminCourses(token),
    enabled: !!token,
  })
}

export function useAdminCourseDetail(courseId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.courses.detail(courseId),
    queryFn: () => getAdminCourseDetails(token, courseId),
    enabled: !!token && !!courseId,
  })
}

export function useCreateCourse() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createCourse(token, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.all() })
      qc.invalidateQueries({ queryKey: queryKeys.admin.courseCount() })
    },
  })
}

export function useUpdateCourse() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, ...payload }) => updateCourse(token, courseId, payload),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.all() })
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.detail(courseId) })
    },
  })
}

export function usePublishCourse() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => publishCourse(token, courseId),
    onMutate: async (courseId) => {
      await qc.cancelQueries({ queryKey: queryKeys.admin.courses.list() })
      const prev = qc.getQueryData(queryKeys.admin.courses.list())
      if (prev) {
        qc.setQueryData(queryKeys.admin.courses.list(), prev.map((c) => c.id === courseId ? { ...c, published: true } : c))
      }
      return { prev }
    },
    onError: (_err, _id, ctx) => { if (ctx?.prev) qc.setQueryData(queryKeys.admin.courses.list(), ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.courses.all() }) },
  })
}

export function useUnpublishCourse() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => unpublishCourse(token, courseId),
    onMutate: async (courseId) => {
      await qc.cancelQueries({ queryKey: queryKeys.admin.courses.list() })
      const prev = qc.getQueryData(queryKeys.admin.courses.list())
      if (prev) {
        qc.setQueryData(queryKeys.admin.courses.list(), prev.map((c) => c.id === courseId ? { ...c, published: false } : c))
      }
      return { prev }
    },
    onError: (_err, _id, ctx) => { if (ctx?.prev) qc.setQueryData(queryKeys.admin.courses.list(), ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.courses.all() }) },
  })
}

export function useDeleteCourse() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => deleteCourse(token, courseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.all() })
      qc.invalidateQueries({ queryKey: queryKeys.admin.courseCount() })
    },
  })
}

export function useDeleteModule() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, moduleId }) => deleteModule(token, courseId, moduleId),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.detail(courseId) })
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.list() })
    },
  })
}

export function useAddModule() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, ...payload }) => addModule(token, courseId, payload),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.detail(courseId) })
      qc.invalidateQueries({ queryKey: queryKeys.admin.courses.list() })
    },
  })
}

// === Admin library ===
export function useAdminLibrary() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.library.list(),
    queryFn: () => getAdminLibraryResources(token),
    enabled: !!token,
  })
}

export function useCreateLibraryResource() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createLibraryResource(token, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.library.all() })
    },
  })
}

export function useUpdateLibraryResource() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, ...payload }) => updateLibraryResource(token, resourceId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.library.all() })
    },
  })
}

export function usePublishLibraryResource() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (resourceId) => publishLibraryResource(token, resourceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.library.all() })
    },
  })
}

export function useUnpublishLibraryResource() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (resourceId) => unpublishLibraryResource(token, resourceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.library.all() })
    },
  })
}

// === Admin assessment ===
export function useAdminQuizAttempts() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.assessment.attempts(),
    queryFn: () => getAdminQuizAttempts(token),
    enabled: !!token,
  })
}

export function useAdminCertificates() {
  const { token } = useAuth()
  return useQuery({
    queryKey: queryKeys.admin.assessment.certificates(),
    queryFn: () => getAdminCertificates(token),
    enabled: !!token,
  })
}

/** Derived hook: fetches all courses then extracts modules with quizzes. */
export function useAdminQuizModules() {
  const { token } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.admin.courses.all(), 'quizModules'],
    queryFn: async () => {
      const courses = await getAdminCourses(token)
      const details = await Promise.all(
        (courses || []).map((c) => getAdminCourseDetails(token, c.id).catch(() => null))
      )
      const modules = []
      ;(courses || []).forEach((course, i) => {
        const detail = details[i]
        if (!detail?.modules) return
        detail.modules
          .filter((m) => m.hasQuiz === true || m.has_quiz === true)
          .forEach((m) => {
            modules.push({
              courseId: course.id,
              courseTitle: course.title || detail.title,
              moduleId: m.id,
              moduleTitle: m.title,
            })
          })
      })
      return modules
    },
    enabled: !!token,
  })
}

export function useRevokeCertificate() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (certificateId) => revokeCertificate(token, certificateId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.assessment.certificates() })
    },
  })
}
