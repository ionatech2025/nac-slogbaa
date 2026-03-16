/**
 * AppShell — wrapper for full-page layouts with optional sidebar.
 * Provides a flex container that fills the viewport.
 */

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--slogbaa-bg)',
  },
  shellWithSidebar: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--slogbaa-bg)',
  },
  sidebar: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
}

export function AppShell({ sidebar, sidebarWidth = 260, children, style }) {
  if (!sidebar) {
    return <div style={{ ...styles.shell, ...style }}>{children}</div>
  }
  return (
    <div style={{ ...styles.shellWithSidebar, ...style }}>
      <div style={{ ...styles.sidebar, width: sidebarWidth }}>{sidebar}</div>
      <div style={styles.content}>{children}</div>
    </div>
  )
}
