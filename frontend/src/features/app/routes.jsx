import { Routes, Route, Navigate } from 'react-router-dom'
import { IamRoutes } from '../iam/routes.jsx'
import { HomePage } from './pages/HomePage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/*" element={<IamRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
