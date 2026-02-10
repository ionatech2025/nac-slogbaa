import { BrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout.jsx'
import { AppRoutes } from './features/app/routes.jsx'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
