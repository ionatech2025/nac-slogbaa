import { useRef } from 'react';
import { Printer, RefreshCw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CertificateTemplate from './CertificateTemplate';

/** Inlined print styles injected once at the top of the component */
const PRINT_CSS = `
  @media print {
    @page { size: A4 portrait; margin: 0; }

    /* Hide everything… */
    body > * { visibility: hidden !important; }

    /* …except the certificate wrapper and its children */
    #cert-print-root,
    #cert-print-root * { visibility: visible !important; }

    #cert-print-root {
      position: fixed !important;
      inset: 0 !important;
      width: 210mm !important;
      height: 297mm !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
    }
  }
`;

/**
 * CertificatePreviewer
 *
 * Full-page wrapper that:
 *  - Scales the certificate preview responsively inside a max-width container
 *  - Provides Print / Save-as-PDF and Back controls
 *  - Injects print-only CSS so the certificate fills an A4 page cleanly
 */
const CertificatePreviewer = ({ certificateData }) => {
  const certRef = useRef(null);

  const handlePrint = () => window.print();

  /* ── shell styles ── */
  const shell = {
    minHeight:      '100vh',
    background:     'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    padding:        '2rem 1rem 4rem',
    gap:            '1.5rem',
  };

  const toolbar = {
    width:          '100%',
    maxWidth:       '860px',
    background:     '#ffffff',
    borderRadius:   '12px',
    border:         '1px solid #e2e8f0',
    boxShadow:      '0 2px 8px rgba(0,0,0,0.06)',
    padding:        '1rem 1.5rem',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    flexWrap:       'wrap',
    gap:            '0.75rem',
  };

  const titleBlock = { display: 'flex', flexDirection: 'column', gap: '0.2rem' };

  const titleStyle = {
    margin:     0,
    fontSize:   '1.2rem',
    fontWeight: 700,
    color:      '#1a1a2e',
  };

  const subtitleStyle = {
    margin:    0,
    fontSize:  '0.85rem',
    color:     '#64748b',
  };

  const btnRow = { display: 'flex', gap: '0.6rem', alignItems: 'center' };

  const btnBack = {
    display:     'inline-flex',
    alignItems:  'center',
    gap:         '0.3rem',
    padding:     '0.45rem 0.9rem',
    fontSize:    '0.85rem',
    fontWeight:  500,
    color:       '#475569',
    background:  'transparent',
    border:      '1px solid #cbd5e1',
    borderRadius:'8px',
    cursor:      'pointer',
    textDecoration: 'none',
    transition:  'background 0.15s',
  };

  const btnRefresh = {
    ...btnBack,
    color:      '#1a56db',
    border:     '1px solid #bfdbfe',
    background: '#eff6ff',
  };

  const btnPrint = {
    display:       'inline-flex',
    alignItems:    'center',
    gap:           '0.4rem',
    padding:       '0.5rem 1.1rem',
    fontSize:      '0.875rem',
    fontWeight:    600,
    color:         '#fff',
    background:    'linear-gradient(135deg, #1a56db 0%, #1e40af 100%)',
    border:        'none',
    borderRadius:  '8px',
    cursor:        'pointer',
    boxShadow:     '0 2px 6px rgba(26,86,219,0.35)',
    transition:    'transform 0.12s, box-shadow 0.12s',
  };

  /* certificate card wrapper */
  const certCard = {
    width:        '100%',
    maxWidth:     '860px',
    background:   '#ffffff',
    borderRadius: '12px',
    padding:      '12px',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
    border:       '1px solid #e2e8f0',
  };

  const hint = {
    maxWidth:  '600px',
    textAlign: 'center',
    color:     '#94a3b8',
    fontSize:  '0.8rem',
    lineHeight: 1.6,
  };

  return (
    <div style={shell}>
      {/* Injected print styles */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Toolbar */}
      <div style={toolbar}>
        <div style={titleBlock}>
          <h1 style={titleStyle}>Certificate Preview</h1>
          <p style={subtitleStyle}>Review before issuing or printing</p>
        </div>

        <div style={btnRow}>
          <Link to="/dashboard/certificates" style={btnBack}>
            <ChevronLeft size={15} /> Back
          </Link>
          <button
            style={btnRefresh}
            onClick={() => window.location.reload()}
            title="Regenerate"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
          <button style={btnPrint} onClick={handlePrint}>
            <Printer size={15} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div style={certCard}>
        <div id="cert-print-root" ref={certRef}>
          <CertificateTemplate data={certificateData} />
        </div>
      </div>

      {/* Hint */}
      <p style={hint}>
        Tip: Click <strong>Print / Save as PDF</strong> and ensure
        {' '}<em>Background graphics</em> is checked in the print dialog for best results.
      </p>
    </div>
  );
};

export default CertificatePreviewer;
