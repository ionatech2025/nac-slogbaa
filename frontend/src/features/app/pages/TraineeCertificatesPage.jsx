import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { TraineeCertificatesPanel } from '../components/trainee/TraineeCertificatesPanel.jsx'

const styles = {
  wrap: { width: '100%', maxWidth: 960 },
  title: { margin: '0 0 0.35rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  subtitle: { margin: '0 0 1.25rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.5 },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--slogbaa-text)' },
}

export function TraineeCertificatesPage() {
  useDocumentTitle('Certificates')

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>Certificates</h1>
      <p style={styles.subtitle}>
        Download or email your certificates of completion. The same list appears on your{' '}
        <Link to="/dashboard" style={{ color: 'var(--slogbaa-blue)', fontWeight: 500 }}>dashboard</Link>
        {' '}under the Certificates tab.
      </p>
      <h2 style={styles.sectionTitle}>Achieved certificates</h2>
      <TraineeCertificatesPanel enabled />
    </div>
  )
}
