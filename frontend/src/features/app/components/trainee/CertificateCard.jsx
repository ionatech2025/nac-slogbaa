import { Award, Eye, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import certBg from '../../../../assets/images/certificates/cert1.jpg';

const styles = {
  card: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    border: '1px solid var(--slogbaa-border)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: 120,
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    padding: '0.25rem 0.6rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  headerIcon: {
    size: 48,
    color: 'rgba(255,255,255,0.95)',
  },
  body: {
    padding: '1.25rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    lineHeight: 1.3,
  },
  description: {
    margin: '0 0 1.25rem',
    fontSize: '0.85rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
  actions: {
    marginTop: 'auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.6rem',
    borderRadius: 10,
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.6rem',
    borderRadius: 10,
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'var(--slogbaa-surface-alt)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
    transition: 'background 0.2s',
  },
}

export function CertificateCard({ certificate }) {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate(`/dashboard/certificates/${certificate.id}/view`);
  };

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badge}>
          <ShieldCheck size={12} />
          Verified
        </div>
        <Award size={48} color="rgba(255,255,255,0.9)" />
      </div>
      <div style={styles.body}>
        <h3 style={styles.title}>{certificate.title}</h3>
        <p style={styles.description}>{certificate.description}</p>
        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={handleAction}>
            <Eye size={16} />
            Preview
          </button>
          <button style={styles.btnSecondary} onClick={handleAction}>
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </article>
  );
}
