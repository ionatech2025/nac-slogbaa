const styles = {
  card: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid var(--slogbaa-border)',
  },
  imageWrap: {
    height: 180,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    padding: '1rem 1.25rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  description: {
    margin: '0 0 1rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.45,
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: 6,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
  },
  primary: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
  },
  secondary: {
    background: 'var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
}

export function CertificateCard({ certificate, onPreview, onDownload }) {
  const imgSrc = certificate.imageUrl || '/assets/images/certificates/placeholder.jpg'

  return (
    <article style={styles.card}>
      <div style={styles.imageWrap}>
        <img
          src={imgSrc}
          alt=""
          style={styles.image}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://placehold.co/400x220/e0e0e0/6b6b6b?text=Certificate'
          }}
        />
      </div>
      <div style={styles.body}>
        <h3 style={styles.title}>{certificate.title}</h3>
        <p style={styles.description}>{certificate.description}</p>
        <div style={styles.actions}>
          <button
            type="button"
            style={{ ...styles.button, ...styles.primary }}
            onClick={() => onPreview?.(certificate)}
          >
            Preview PDF
          </button>
          <button
            type="button"
            style={{ ...styles.button, ...styles.secondary }}
            onClick={() => onDownload?.(certificate)}
          >
            Download
          </button>
        </div>
      </div>
    </article>
  )
}
