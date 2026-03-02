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
      <div style={globalToggleStyles}>
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}
