import { ThemeToggle } from '../shared/components/ThemeToggle.jsx'

const globalToggleStyles = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 9999,
}

export function AppLayout({ children }) {
  return (
    <div>
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
