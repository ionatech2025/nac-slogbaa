const styles = {
  wrap: {
    padding: '2rem',
    maxWidth: 600,
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
  },
  text: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
}

export function AdminPlaceholderPage({ title = 'Module' }) {
  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.text}>
        This section will be available when the {title} module is connected. You can manage content and settings here.
      </p>
    </div>
  )
}
