import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PageSkeleton } from '../../shared/components/PageSkeleton.jsx'
import { NotFoundPage } from '../../shared/components/NotFoundPage.jsx'

// Eager: critical path (homepage, auth shell, trainee guard/layout)
import { HomePage } from './pages/HomePage.jsx'
import { RequireTrainee } from './components/RequireTrainee.jsx'
import { RequireAdmin } from './components/RequireAdmin.jsx'
import { TraineeLayout } from './layouts/TraineeLayout.jsx'

// Lazy: IAM pages
const IamRoutes = lazy(() => import('../iam/routes.jsx').then((m) => ({ default: m.IamRoutes })))
const ResetPasswordPage = lazy(() => import('../iam/pages/ResetPasswordPage.jsx').then((m) => ({ default: m.ResetPasswordPage })))

// Lazy: Trainee pages
const TraineeDashboardPage = lazy(() => import('./pages/TraineeDashboardPage.jsx').then((m) => ({ default: m.TraineeDashboardPage })))
const CourseListPage = lazy(() => import('../learning/pages/CourseListPage.jsx').then((m) => ({ default: m.CourseListPage })))
const CourseDetailPage = lazy(() => import('../learning/pages/CourseDetailPage.jsx').then((m) => ({ default: m.CourseDetailPage })))
const LibraryPage = lazy(() => import('../learning/pages/LibraryPage.jsx').then((m) => ({ default: m.LibraryPage })))
const BookmarksPage = lazy(() => import('../learning/pages/BookmarksPage.jsx').then((m) => ({ default: m.BookmarksPage })))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.jsx').then((m) => ({ default: m.NotificationsPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx').then((m) => ({ default: m.SettingsPage })))
const HelpPage = lazy(() => import('./pages/HelpPage.jsx').then((m) => ({ default: m.HelpPage })))

// Lazy: Admin pages
const AdminLayout = lazy(() => import('./pages/AdminLayout.jsx').then((m) => ({ default: m.AdminLayout })))
const AdminOverviewPage = lazy(() => import('./pages/AdminOverviewPage.jsx').then((m) => ({ default: m.AdminOverviewPage })))
const AdminAssessmentPage = lazy(() => import('./pages/AdminAssessmentPage.jsx').then((m) => ({ default: m.AdminAssessmentPage })))
const AdminLearningPage = lazy(() => import('./pages/AdminLearningPage.jsx').then((m) => ({ default: m.AdminLearningPage })))
const AdminCoursePage = lazy(() => import('./pages/AdminCoursePage.jsx').then((m) => ({ default: m.AdminCoursePage })))
const AdminModuleEditorPage = lazy(() => import('./pages/AdminModuleEditorPage.jsx').then((m) => ({ default: m.AdminModuleEditorPage })))
const AdminLibraryPage = lazy(() => import('./pages/AdminLibraryPage.jsx').then((m) => ({ default: m.AdminLibraryPage })))
const AdminCourseManagementPage = lazy(() => import('./pages/AdminCourseManagementPage.jsx').then((m) => ({ default: m.AdminCourseManagementPage })))
const AdminUserDetailPage = lazy(() => import('./pages/AdminUserDetailPage.jsx').then((m) => ({ default: m.AdminUserDetailPage })))
const AdminHomePage = lazy(() => import('./pages/AdminHomePage.jsx').then((m) => ({ default: m.AdminHomePage })))
const AdminReportsAnalyticsPage = lazy(() =>
  import('./pages/AdminReportsAnalyticsPage.jsx').then((m) => ({ default: m.AdminReportsAnalyticsPage })))
const AdminCmsPage = lazy(() => import('./pages/AdminCmsPage.jsx').then((m) => ({ default: m.AdminCmsPage })))
const AdminLiveSessionsPage = lazy(() => import('./pages/AdminLiveSessionsPage.jsx').then((m) => ({ default: m.AdminLiveSessionsPage })))
const LiveSessionsPage = lazy(() => import('./pages/LiveSessionsPage.jsx').then((m) => ({ default: m.LiveSessionsPage })))
const TraineeCertificatesPage = lazy(() =>
  import('./pages/TraineeCertificatesPage.jsx').then((m) => ({ default: m.TraineeCertificatesPage })))
const InPersonTrainingPage = lazy(() => import('./pages/InPersonTrainingPage.jsx').then((m) => ({ default: m.InPersonTrainingPage })))

function Lazy({ children }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/inperson-training" element={<Lazy><InPersonTrainingPage /></Lazy>} />
      <Route path="/inperson-training/:slug" element={<Lazy><InPersonTrainingPage /></Lazy>} />
      <Route path="/reset-password" element={<Lazy><ResetPasswordPage /></Lazy>} />
      <Route path="/auth/*" element={<Lazy><IamRoutes /></Lazy>} />
      <Route path="/dashboard" element={<RequireTrainee />}>
        <Route element={<TraineeLayout />}>
          <Route index element={<Lazy><TraineeDashboardPage /></Lazy>} />
          <Route path="courses" element={<Lazy><CourseListPage /></Lazy>} />
          <Route path="courses/:courseId" element={<Lazy><CourseDetailPage /></Lazy>} />
          <Route path="courses/:courseId/modules/:moduleId" element={<Lazy><CourseDetailPage /></Lazy>} />
          <Route path="library" element={<Lazy><LibraryPage /></Lazy>} />
          <Route path="bookmarks" element={<Lazy><BookmarksPage /></Lazy>} />
          <Route path="certificates" element={<Lazy><TraineeCertificatesPage /></Lazy>} />
          <Route path="notifications" element={<Lazy><NotificationsPage /></Lazy>} />
          <Route path="settings" element={<Lazy><SettingsPage /></Lazy>} />
          <Route path="live-sessions" element={<Lazy><LiveSessionsPage /></Lazy>} />
          <Route path="help" element={<Lazy><HelpPage /></Lazy>} />
        </Route>
      </Route>
      <Route path="/admin" element={<RequireAdmin />}>
        <Route element={<Lazy><AdminLayout /></Lazy>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Lazy><AdminOverviewPage /></Lazy>} />
          <Route path="users/:userType/:userId" element={<Lazy><AdminUserDetailPage /></Lazy>} />
          <Route path="homepage" element={<Lazy><AdminHomePage /></Lazy>} />
          <Route path="learning" element={<Lazy><AdminLearningPage /></Lazy>} />
          <Route path="learning/:courseId" element={<Lazy><AdminCoursePage /></Lazy>} />
          <Route path="coursemanagement" element={<Lazy><AdminCourseManagementPage /></Lazy>} />
          <Route path="learning/:courseId/modules/:moduleId" element={<Lazy><AdminModuleEditorPage /></Lazy>} />
          <Route path="library" element={<Lazy><AdminLibraryPage /></Lazy>} />
          <Route path="assessment" element={<Lazy><AdminAssessmentPage /></Lazy>} />
          <Route path="cms" element={<Lazy><AdminCmsPage /></Lazy>} />
          <Route path="live-sessions" element={<Lazy><AdminLiveSessionsPage /></Lazy>} />
          <Route path="reports" element={<Lazy><AdminReportsAnalyticsPage /></Lazy>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
