import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PageSkeleton } from '../../shared/components/PageSkeleton.jsx'
import { NotFoundPage } from '../../shared/components/NotFoundPage.jsx'

// Eager: critical path (homepage, auth shell, trainee guard/layout)
import { HomePage } from './pages/HomePage.jsx'
import { RequireTrainee } from './components/RequireTrainee.jsx'
import { TraineeLayout } from './layouts/TraineeLayout.jsx'

// Lazy: IAM pages
const IamRoutes = lazy(() => import('../iam/routes.jsx').then((m) => ({ default: m.IamRoutes })))
const ResetPasswordPage = lazy(() => import('../iam/pages/ResetPasswordPage.jsx').then((m) => ({ default: m.ResetPasswordPage })))

// Lazy: Trainee pages
const TraineeDashboardPage = lazy(() => import('./pages/TraineeDashboardPage.jsx').then((m) => ({ default: m.TraineeDashboardPage })))
const CourseListPage = lazy(() => import('../learning/pages/CourseListPage.jsx').then((m) => ({ default: m.CourseListPage })))
const CourseDetailPage = lazy(() => import('../learning/pages/CourseDetailPage.jsx').then((m) => ({ default: m.CourseDetailPage })))
const LibraryPage = lazy(() => import('../learning/pages/LibraryPage.jsx').then((m) => ({ default: m.LibraryPage })))

// Lazy: Admin pages
const AdminLayout = lazy(() => import('./pages/AdminLayout.jsx').then((m) => ({ default: m.AdminLayout })))
const AdminOverviewPage = lazy(() => import('./pages/AdminOverviewPage.jsx').then((m) => ({ default: m.AdminOverviewPage })))
const AdminPlaceholderPage = lazy(() => import('./pages/AdminPlaceholderPage.jsx').then((m) => ({ default: m.AdminPlaceholderPage })))
const AdminAssessmentPage = lazy(() => import('./pages/AdminAssessmentPage.jsx').then((m) => ({ default: m.AdminAssessmentPage })))
const AdminLearningPage = lazy(() => import('./pages/AdminLearningPage.jsx').then((m) => ({ default: m.AdminLearningPage })))
const AdminCoursePage = lazy(() => import('./pages/AdminCoursePage.jsx').then((m) => ({ default: m.AdminCoursePage })))
const AdminModuleEditorPage = lazy(() => import('./pages/AdminModuleEditorPage.jsx').then((m) => ({ default: m.AdminModuleEditorPage })))
const AdminLibraryPage = lazy(() => import('./pages/AdminLibraryPage.jsx').then((m) => ({ default: m.AdminLibraryPage })))
const AdminCourseManagementPage = lazy(() => import('./pages/AdminCourseManagementPage.jsx').then((m) => ({ default: m.AdminCourseManagementPage })))
const AdminUserDetailPage = lazy(() => import('./pages/AdminUserDetailPage.jsx').then((m) => ({ default: m.AdminUserDetailPage })))

function Lazy({ children }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reset-password" element={<Lazy><ResetPasswordPage /></Lazy>} />
      <Route path="/auth/*" element={<Lazy><IamRoutes /></Lazy>} />
      <Route path="/dashboard" element={<RequireTrainee />}>
        <Route element={<TraineeLayout />}>
          <Route index element={<Lazy><TraineeDashboardPage /></Lazy>} />
          <Route path="courses" element={<Lazy><CourseListPage /></Lazy>} />
          <Route path="courses/:courseId" element={<Lazy><CourseDetailPage /></Lazy>} />
          <Route path="courses/:courseId/modules/:moduleId" element={<Lazy><CourseDetailPage /></Lazy>} />
          <Route path="library" element={<Lazy><LibraryPage /></Lazy>} />
        </Route>
      </Route>
      <Route path="/admin" element={<Lazy><AdminLayout /></Lazy>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Lazy><AdminOverviewPage /></Lazy>} />
        <Route path="users/:userType/:userId" element={<Lazy><AdminUserDetailPage /></Lazy>} />
        <Route path="homepage" element={<Lazy><AdminPlaceholderPage title="Homepage" /></Lazy>} />
        <Route path="learning" element={<Lazy><AdminLearningPage /></Lazy>} />
        <Route path="learning/:courseId" element={<Lazy><AdminCoursePage /></Lazy>} />
        <Route path="coursemanagement" element={<Lazy><AdminCourseManagementPage /></Lazy>} />
        <Route path="learning/:courseId/modules/:moduleId" element={<Lazy><AdminModuleEditorPage /></Lazy>} />
        <Route path="library" element={<Lazy><AdminLibraryPage /></Lazy>} />
        <Route path="assessment" element={<Lazy><AdminAssessmentPage /></Lazy>} />
        <Route path="reports" element={<Lazy><AdminPlaceholderPage title="Reports & Analytics" /></Lazy>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
