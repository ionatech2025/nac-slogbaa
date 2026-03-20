import { ThemeToggle } from '../shared/components/ThemeToggle.jsx'
import { OfflineBanner } from '../shared/components/OfflineBanner.jsx'

const globalToggleStyles = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 900,
}

export function AppLayout({ children }) {
  return (
    <div>
      <OfflineBanner />
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div style={globalToggleStyles}>
        <ThemeToggle />
      </div>
      <main id="main-content">{children}</main>
    </div>
  )
}
