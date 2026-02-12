import { Routes, Route, Navigate } from 'react-router-dom'
import { IamRoutes } from '../iam/routes.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/*" element={<IamRoutes />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
