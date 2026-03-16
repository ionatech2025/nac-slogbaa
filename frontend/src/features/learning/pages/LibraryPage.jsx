import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { usePublishedLibrary } from '../../../lib/hooks/use-library.js'

const RESOURCE_TYPE_LABELS = {
  DOCUMENT: 'Document',
  POLICY_DOCUMENT: 'Policy document',
  READING_MATERIAL: 'Reading material',
}

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--slogbaa-bg)',
  },
  main: {
    flex: 1,
    padding: '1.5rem 2rem',
    maxWidth: 900,
    margin: '0 auto',
    width: '100%',
  },
  header: {
    marginBottom: '1.5rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    padding: '1rem 1.25rem',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 16,
    boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  },
  cardTitle: {
    margin: '0 0 0.35rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  cardMeta: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    marginBottom: '0.5rem',
  },
  cardDescription: {
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    margin: '0 0 0.75rem',
    lineHeight: 1.5,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  error: {
    padding: '1rem',
    color: 'var(--slogbaa-error)',
    fontSize: '0.9375rem',
  },
  loading: {
    padding: '2rem',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
}

export function LibraryPage() {
  const { data: resources = [], isLoading, error } = usePublishedLibrary()

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Library</h1>
          <p style={styles.subtitle}>
            Published documents and reading materials you can open or download.
          </p>
        </header>

        {error && <p style={styles.error}>{error.message || 'Failed to load library.'}</p>}
        {isLoading && <p style={styles.loading}>Loading…</p>}
        {!isLoading && !error && resources.length === 0 && (
          <p style={styles.empty}>No library resources published yet.</p>
        )}
        {!isLoading && !error && resources.length > 0 && (
          <ul style={styles.list}>
            {resources.map((r) => (
              <li key={r.id} style={styles.card}>
                <h2 style={styles.cardTitle}>{r.title}</h2>
                <div style={styles.cardMeta}>
                  {RESOURCE_TYPE_LABELS[r.resourceType] ?? r.resourceType}
                  {r.fileType && ` · ${r.fileType}`}
                </div>
                {r.description && (
                  <p style={styles.cardDescription}>{r.description}</p>
                )}
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  <FontAwesomeIcon icon={icons.download} />
                  Open / download
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
