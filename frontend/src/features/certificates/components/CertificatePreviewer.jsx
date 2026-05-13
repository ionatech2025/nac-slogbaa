import React, { useRef } from 'react';
import CertificateTemplate from './CertificateTemplate';
import { Download, Printer, RefreshCw } from 'lucide-react';

/**
 * CertificatePreviewer
 * 
 * A wrapper component that provides controls to preview, print, and refresh certificate data.
 */
const CertificatePreviewer = ({ certificateData }) => {
  const certificateRef = useRef();

  const handlePrint = () => {
    // Basic print functionality
    // In a real app, you might use 'react-to-print' or a hidden iframe
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-slate-100 min-h-screen">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-4xl bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Certificate Preview</h1>
          <p className="text-sm text-slate-500">Review the certificate before issuance</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Certificate Container with Scaling for Preview */}
      <div className="w-full max-w-[800px] transition-all duration-500 animate-in fade-in zoom-in-95">
        <div className="bg-white p-4 shadow-inner rounded-sm border border-slate-300">
             <CertificateTemplate data={certificateData} />
        </div>
      </div>

      {/* Info Alert */}
      <div className="max-w-2xl text-center text-slate-500 text-sm">
        <p>
          Tip: For best results when saving as PDF, ensure "Background Graphics" is enabled in the print settings.
          The certificate is designed at A4 proportions and will scale to fit the page.
        </p>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .relative.w-full.overflow-hidden, .relative.w-full.overflow-hidden * {
            visibility: visible;
          }
          .relative.w-full.overflow-hidden {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
};

export default CertificatePreviewer;
