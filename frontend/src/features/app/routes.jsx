import { Routes, Route, Navigate } from 'react-router-dom'
import { IamRoutes } from '../iam/routes.jsx'
import { ResetPasswordPage } from '../iam/pages/ResetPasswordPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { RequireTrainee } from './components/RequireTrainee.jsx'
import { TraineeLayout } from './layouts/TraineeLayout.jsx'
import { TraineeDashboardPage } from './pages/TraineeDashboardPage.jsx'
import { CourseListPage } from '../learning/pages/CourseListPage.jsx'
import { CourseDetailPage } from '../learning/pages/CourseDetailPage.jsx'
import { AdminLayout } from './pages/AdminLayout.jsx'
import { AdminOverviewPage } from './pages/AdminOverviewPage.jsx'
import { AdminPlaceholderPage } from './pages/AdminPlaceholderPage.jsx'
import { AdminLearningPage } from './pages/AdminLearningPage.jsx'
import { AdminCourseEditorPage } from './pages/AdminCourseEditorPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/*" element={<IamRoutes />} />
      <Route path="/dashboard" element={<RequireTrainee />}>
        <Route element={<TraineeLayout />}>
          <Route index element={<TraineeDashboardPage />} />
          <Route path="courses" element={<CourseListPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />
          <Route path="courses/:courseId/modules/:moduleId" element={<CourseDetailPage />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="homepage" element={<AdminPlaceholderPage title="Homepage" />} />
        <Route path="learning" element={<AdminLearningPage />} />
        <Route path="learning/:courseId" element={<AdminCourseEditorPage />} />
        <Route path="assessment" element={<AdminPlaceholderPage title="Assessment" />} />
        <Route path="reports" element={<AdminPlaceholderPage title="Reports & Analytics" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
