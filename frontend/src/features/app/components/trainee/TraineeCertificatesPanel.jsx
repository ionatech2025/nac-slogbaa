import { useState, useCallback } from 'react'
import { useAuth } from '../../../iam/hooks/useAuth.js'
import { useMyCertificates } from '../../../../lib/hooks/use-certificates.js'
import { downloadCertificate, sendCertificateEmail } from '../../../../api/certificates.js'
import { CertificateCard } from './CertificateCard.jsx'
import { CardGridSkeleton } from '../../../../shared/components/ContentSkeletons.jsx'

const panelStyles = {
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
}

/**
 * Trainee certificate list with preview / download / email actions.
 * Used on the dashboard tab and on /dashboard/certificates.
 */
export function TraineeCertificatesPanel({ enabled = true }) {
  const { token } = useAuth()
  const [certificateActionId, setCertificateActionId] = useState(null)
  const [certificateError, setCertificateError] = useState(null)

  const { data: certificates = [], isLoading: certificatesLoading } = useMyCertificates({ enabled })

  const handlePreviewCertificate = useCallback(async (cert) => {
    if (!token || certificateActionId) return
    setCertificateActionId(cert.id)
    setCertificateError(null)
    try {
      const blob = await downloadCertificate(token, cert.id)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch {
      setCertificateError('Could not preview certificate. Please try downloading instead.')
    } finally {
      setCertificateActionId(null)
    }
  }, [token, certificateActionId])

  const handleDownloadCertificate = useCallback(async (cert, alsoSendEmail = false) => {
    if (!token || certificateActionId) return
    setCertificateActionId(cert.id)
    setCertificateError(null)
    try {
      const blob = await downloadCertificate(token, cert.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cert.certificateNumber || 'certificate'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      if (alsoSendEmail) {
        await sendCertificateEmail(token, cert.id)
      }
    } catch {
      setCertificateError('Could not download certificate. Please try again.')
    } finally {
      setCertificateActionId(null)
    }
  }, [token, certificateActionId])

  return (
    <>
      {certificateError && (
        <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-error)', fontSize: '0.9375rem' }}>{certificateError}</p>
      )}
      {certificatesLoading ? (
        <CardGridSkeleton count={3} />
      ) : certificates.length === 0 ? (
        <p style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
          No certificates yet. Complete courses with passing quiz scores to earn certificates.
        </p>
      ) : (
        <div style={panelStyles.cardGrid}>
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={{
                id: cert.id,
                title: cert.courseTitle || cert.certificateNumber,
                description: `Score: ${cert.finalScorePercent}%. Issued: ${cert.issuedDate}.`,
                certificateNumber: cert.certificateNumber,
                fileUrl: cert.fileUrl,
              }}
              actionLoading={certificateActionId === cert.id}
              onPreview={handlePreviewCertificate}
              onDownload={(c) => handleDownloadCertificate(c)}
              onSendEmail={(c) => handleDownloadCertificate(c, true)}
            />
          ))}
        </div>
      )}
    </>
  )
}
