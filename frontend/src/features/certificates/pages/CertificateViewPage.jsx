import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import CertificatePreviewer from '../components/CertificatePreviewer';
import { useCertificateDetail } from '../../../lib/hooks/use-certificates';

/**
 * CertificateViewPage
 * 
 * Fetches certificate metadata and displays it using the CertificateTemplate.
 */
export const CertificateViewPage = () => {
  const { certificateId } = useParams();

  const { data: certificate, isLoading, error } = useCertificateDetail(certificateId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Preparing your certificate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
          <p className="text-slate-600 mb-6">We couldn't load this certificate. It might have been moved or doesn't exist.</p>
          <Link to="/dashboard/certificates" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
            <ChevronLeft className="w-4 h-4" /> Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  return <CertificatePreviewer certificateData={certificate} />;
};
