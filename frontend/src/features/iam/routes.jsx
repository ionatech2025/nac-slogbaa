import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'

export function IamRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Routes>
  )
}
