import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2 } from 'lucide-react';
import CertificatePreviewer from '../components/CertificatePreviewer';

/**
 * CertificateViewPage
 * 
 * Fetches certificate metadata and displays it using the CertificateTemplate.
 */
export const CertificateViewPage = () => {
  const { certificateId } = useParams();

  // Mock fetching data - in a real app, this would call your API
  const { data: certificate, isLoading, error } = useQuery({
    queryKey: ['certificate', certificateId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data based on user requirements
      return {
        id: certificateId,
        courseTitle: "Strategic Leadership in Global Business",
        recipientName: "Jonathan Pacwa",
        completionDate: "May 13, 2026",
        certificateId: `SLG-${certificateId?.toUpperCase() || 'ABC-123'}`,
        modules: [
          { 
            title: "Global Market Entry", 
            description: "Advanced strategies for navigating international trade barriers and cultural nuances." 
          },
          { 
            title: "Financial Risk Management", 
            description: "Comprehensive analysis of currency volatility and global economic trends." 
          },
          { 
            title: "Digital Transformation", 
            description: "Leveraging AI and automation to scale operations in emerging markets." 
          }
        ]
      };
    }
  });

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
