import { useMyCertificates } from '../../../../lib/hooks/use-certificates.js'
import { CertificateCard } from './CertificateCard.jsx'
import { CardGridSkeleton } from '../../../../shared/components/ContentSkeletons.jsx'

const panelStyles = {
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  empty: {
    padding: '3rem 1rem',
    textAlign: 'center',
    background: 'var(--slogbaa-surface-alt)',
    borderRadius: 16,
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
}

/**
 * Trainee certificate list.
 * Navigates to the view page for preview/download.
 */
export function TraineeCertificatesPanel({ enabled = true }) {
  const { data: certificates = [], isLoading: certificatesLoading } = useMyCertificates({ enabled })

  if (certificatesLoading) {
    return <CardGridSkeleton count={3} />
  }

  if (certificates.length === 0) {
    return (
      <div style={panelStyles.empty}>
        No certificates yet. Complete courses with passing quiz scores to earn certificates.
      </div>
    )
  }

  return (
    <div style={panelStyles.cardGrid}>
      {certificates.map((cert) => (
        <CertificateCard
          key={cert.id}
          certificate={{
            id: cert.id,
            title: cert.courseTitle || cert.certificateNumber,
            description: `Achieved on ${cert.issuedDate} with a score of ${cert.finalScorePercent}%`,
            certificateNumber: cert.certificateNumber,
            fileUrl: cert.fileUrl,
          }}
        />
      ))}
    </div>
  )
}
