import { Routes, Route, Navigate } from 'react-router-dom'
import { IamRoutes } from '../iam/routes.jsx'
import { ResetPasswordPage } from '../iam/pages/ResetPasswordPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { RequireTrainee } from './components/RequireTrainee.jsx'
import { TraineeLayout } from './layouts/TraineeLayout.jsx'
import { TraineeDashboardPage } from './pages/TraineeDashboardPage.jsx'
import { CourseListPage } from '../learning/pages/CourseListPage.jsx'
import { CourseDetailPage } from '../learning/pages/CourseDetailPage.jsx'
import { LibraryPage } from '../learning/pages/LibraryPage.jsx'
import { AdminLayout } from './pages/AdminLayout.jsx'
import { AdminOverviewPage } from './pages/AdminOverviewPage.jsx'
import { AdminPlaceholderPage } from './pages/AdminPlaceholderPage.jsx'
import { AdminAssessmentPage } from './pages/AdminAssessmentPage.jsx'
import { AdminLearningPage } from './pages/AdminLearningPage.jsx'
import { AdminCoursePage } from './pages/AdminCoursePage.jsx'
import { AdminModuleEditorPage } from './pages/AdminModuleEditorPage.jsx'
import { AdminLibraryPage } from './pages/AdminLibraryPage.jsx'

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
          <Route path="library" element={<LibraryPage />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="homepage" element={<AdminPlaceholderPage title="Homepage" />} />
        <Route path="learning" element={<AdminLearningPage />} />
        <Route path="learning/:courseId" element={<AdminCoursePage />} />
        <Route path="learning/:courseId/modules/:moduleId" element={<AdminModuleEditorPage />} />
        <Route path="library" element={<AdminLibraryPage />} />
        <Route path="assessment" element={<AdminAssessmentPage />} />
        <Route path="reports" element={<AdminPlaceholderPage title="Reports & Analytics" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
