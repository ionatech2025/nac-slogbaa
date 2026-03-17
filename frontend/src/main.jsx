import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './index.css'

const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn && localStorage.getItem('slogbaa-cookie-consent') === 'accepted') {
  Sentry.init({
    dsn,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  })
}

// Register service worker — auto-updates on new content
if ('serviceWorker' in navigator) {
  registerSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        // Check for updates every hour
        setInterval(() => registration.update(), 60 * 60 * 1000)
      }
    },
    onOfflineReady() {
      console.log('[SW] App ready for offline use')
    },
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
