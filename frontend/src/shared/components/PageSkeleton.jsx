const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh',
    padding: '2rem',
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid var(--slogbaa-border)',
    borderTopColor: 'var(--slogbaa-blue)',
    borderRadius: '50%',
    animation: 'loading-button-spin 0.7s linear infinite',
  },
}

export function PageSkeleton() {
  return (
    <div style={styles.wrap} role="status" aria-label="Loading page">
      <div style={styles.spinner} />
    </div>
  )
}
