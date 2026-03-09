import { FontAwesomeIcon, icons } from '../../../../shared/icons.js'

const styles = {
  card: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid var(--slogbaa-border)',
  },
  header: {
    height: 140,
    background: 'linear-gradient(135deg, var(--slogbaa-blue) 0%, #1a4d7a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: '3.5rem',
    color: 'rgba(255,255,255,0.9)',
  },
  body: {
    padding: '1.25rem 1.5rem',
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    borderRadius: 6,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
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

export function CertificateCard({ certificate, actionLoading = false, onPreview, onDownload, onSendEmail }) {
  const disabled = actionLoading

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <FontAwesomeIcon icon={icons.certificate} style={styles.headerIcon} />
      </div>
      <div style={styles.body}>
        <h3 style={styles.title}>{certificate.title}</h3>
        <p style={styles.description}>{certificate.description}</p>
        <div style={styles.actions}>
          <button
            type="button"
            style={{ ...styles.button, ...styles.primary, ...(disabled ? styles.buttonDisabled : {}) }}
            onClick={() => onPreview?.(certificate)}
            disabled={disabled}
          >
            <FontAwesomeIcon icon={icons.previewPdf} />
            Preview PDF
          </button>
          <button
            type="button"
            style={{ ...styles.button, ...styles.secondary, ...(disabled ? styles.buttonDisabled : {}) }}
            onClick={() => onDownload?.(certificate)}
            disabled={disabled}
          >
            <FontAwesomeIcon icon={icons.download} />
            Download
          </button>
          {onSendEmail && (
            <button
              type="button"
              style={{ ...styles.button, ...styles.secondary, ...(disabled ? styles.buttonDisabled : {}) }}
              onClick={() => onSendEmail(certificate)}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={icons.download} />
              Download &amp; email me
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
