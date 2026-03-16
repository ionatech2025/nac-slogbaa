# SLOGBAA — TanStack Query Hooks Reference

All hooks in `frontend/src/lib/hooks/`. Each hook uses `useAuth()` internally — consumers never pass tokens.

---

## Trainee Courses (`use-courses.js`)

| Hook | Returns | Notes |
|------|---------|-------|
| `usePublishedCourses()` | `{ data, isLoading, error, refetch }` | All published courses |
| `useEnrolledCourses()` | `{ data, isLoading, error }` | User's enrolled courses |
| `useCourseDetail(id)` | `{ data, isLoading, error }` | Course + modules + blocks |
| `useCheckEnrollment(id)` | `{ data: boolean }` | Is user enrolled? |
| `useResumePoint(id, opts?)` | `{ data: { lastModuleId } }` | Resume position |
| `useEnrollInCourse()` | Mutation | **Optimistic** — instant UI + rollback |
| `useRecordProgress()` | Mutation | Fire-and-forget |
| `useRecordModuleCompletion()` | Mutation | Invalidates enrolled + detail |

## Library (`use-library.js`)

| Hook | Returns |
|------|---------|
| `usePublishedLibrary()` | `{ data: Resource[] }` |

## Certificates (`use-certificates.js`)

| Hook | Returns |
|------|---------|
| `useMyCertificates(opts?)` | `{ data: Certificate[] }` |

## Trainee Profile (`use-trainee.js`)

| Hook | Returns |
|------|---------|
| `useTraineeProfile()` | `{ data: Profile }` |
| `useTraineeSettings()` | `{ data: Settings }` |
| `useUpdateTraineeProfile()` | Mutation → invalidates profile |
| `useUpdateTraineeSettings()` | Mutation → invalidates settings |

---

## Admin Dashboard (`use-admin.js`)

| Hook | Returns |
|------|---------|
| `useAdminOverview()` | `{ data: { data: { staff, trainees } } }` |
| `useAdminCourseCount()` | `{ data: number }` |

## Admin Courses (`use-admin.js`)

| Hook | Notes |
|------|-------|
| `useAdminCourses()` | All courses (published + draft) |
| `useAdminCourseDetail(id)` | Full course detail |
| `useAdminQuizModules()` | Derived — extracts quiz modules from all courses |
| `useCreateCourse()` | Invalidates courses + count |
| `useUpdateCourse()` | Invalidates courses + detail |
| `usePublishCourse()` | **Optimistic** — toggles published + rollback |
| `useUnpublishCourse()` | **Optimistic** — toggles published + rollback |
| `useDeleteCourse()` | Invalidates courses + count |
| `useDeleteModule()` | Invalidates detail + list |
| `useAddModule()` | Invalidates detail + list |

## Admin Library (`use-admin.js`)

| Hook | Notes |
|------|-------|
| `useAdminLibrary()` | All resources |
| `useCreateLibraryResource()` | Invalidates library |
| `useUpdateLibraryResource()` | Invalidates library |
| `usePublishLibraryResource()` | Invalidates library |
| `useUnpublishLibraryResource()` | Invalidates library |

## Admin Assessment (`use-admin.js`)

| Hook | Notes |
|------|-------|
| `useAdminQuizAttempts()` | All completed attempts |
| `useAdminCertificates()` | All certificates |
| `useRevokeCertificate()` | Invalidates certificates |

---

## Admin Users (`use-admin-users.js`)

### Queries

| Hook | Param | Returns |
|------|-------|---------|
| `useStaffProfile(staffId)` | string \| null | Staff user data |
| `useTraineeAdminProfile(traineeId)` | string \| null | Trainee + fullName |
| `useTraineeEnrolledCourses(traineeId)` | string \| null | Enrolled courses |
| `useTraineeCertificates(traineeId)` | string \| null | Filtered certs |

### Mutations

| Hook | Params | Invalidates |
|------|--------|-------------|
| `useSetStaffPassword()` | `{ staffId, newPassword }` | — |
| `useSetTraineePassword()` | `{ traineeId, newPassword }` | — |
| `useSetStaffActive()` | `{ staffId, active }` | Staff profile + overview |
| `useDeleteStaff()` | `staffId` | Overview |
| `useDeleteTrainee()` | `traineeId` | Overview |
| `useUpdateStaffProfile()` | `{ staffId, ...payload }` | Staff profile |
| `useUpdateTraineeAdminProfile()` | `{ traineeId, ...payload }` | Trainee profile |

---

## Query Client Config

| Setting | Value |
|---------|-------|
| `staleTime` | 30s |
| `gcTime` | 5min |
| `retry` | 2 (0 for 401) |
| `refetchOnWindowFocus` | true |

## 401 Flow

```
API call → 401
  → client.js throws AuthError
    → QueryClient global handler
      → logout()
        → Clear localStorage + query cache
          → BroadcastChannel → all tabs
            → Redirect /auth/login
```
