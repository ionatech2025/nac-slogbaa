import { Routes, Route, Navigate } from 'react-router-dom'
import { IamRoutes } from '../iam/routes.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { AdminLayout } from './pages/AdminLayout.jsx'
import { AdminOverviewPage } from './pages/AdminOverviewPage.jsx'
import { AdminPlaceholderPage } from './pages/AdminPlaceholderPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/*" element={<IamRoutes />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="homepage" element={<AdminPlaceholderPage title="Homepage" />} />
        <Route path="learning" element={<AdminPlaceholderPage title="Learning" />} />
        <Route path="assessment" element={<AdminPlaceholderPage title="Assessment" />} />
        <Route path="reports" element={<AdminPlaceholderPage title="Reports & Analytics" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
