import { Hash, Calendar } from 'lucide-react';

/**
 * CertificateTemplate
 *
 * Renders an A4-portrait certificate (210×297 mm → aspect-ratio 210/297).
 * A background image fills the container; all dynamic content is overlaid
 * using percentage-based positioning matched to the SLOGBAA/NAC background.
 *
 * Add to your HTML <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
 *
 * Props:
 *   data      – { courseTitle, recipientName, completionDate, certificateId, modules[] }
 *   style     – optional extra styles on the root element
 *   className – optional class name on the root element
 *
 * modules[] items: { title: string, description?: string, icon?: string }
 */
const CertificateTemplate = ({ data = {}, style = {}, className = '' }) => {
  const {
    courseTitle = 'Strategic Leadership in Global Business',
    recipientName = 'Jonathan Pacwa',
    completionDate = 'May 13, 2026',
    certificateId = 'CERT-SLG-2026-0001',
    modules = [],
  } = data;

  const navy = '#002b7f';
  const orange = '#E07318';
  const white = '#ffffff';
  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const sans = "'Nunito Sans', 'Segoe UI', system-ui, Arial, sans-serif";
  const mono = "'Courier New', 'Lucida Console', monospace";

  /* Shorthand for clamp() — keeps JSX tidy */
  const cl = (min, mid, max) => `clamp(${min}, ${mid}, ${max})`;

  /* Circled checkmark icon for module rows */
  const CheckIcon = ({ size }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={navy}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0, marginTop: '0.1em' }}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11.5 14.5 15.5 9.5" />
    </svg>
  );

  const CalendarIcon = ({ size }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={navy}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const HashIcon = ({ size }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={navy}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '210 / 297',
        overflow: 'hidden',
        background: '#f5f5f0',
        userSelect: 'none',
        fontFamily: sans,
        containerType: 'size',
        ...style,
      }}
    >
      {/* ── Background image ── */}
      <img
        src="/certificates/certificate_background2.png"
        alt=""
        role="presentation"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════════════════
          OVERLAY
         ══════════════════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* ── CENTRAL CONTENT COLUMN ──
            top: 24% gives clear breathing room below the logo row (~0–20%)  */}
        <div style={{
          position: 'absolute',
          top: '24%',
          left: '9%',
          width: '82%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>

          {/* 1. "Certificate of Completion" */}
          <div style={{
            fontFamily: serif,
            fontWeight: 700,
            color: navy,
            fontSize: cl('1.1rem', '4.1cqw', '2.4rem'),
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.05,
            marginBottom: '3.2%',
          }}>
            Certificate of Completion
          </div>

          {/* 2. Banner with flanking hairlines */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginBottom: '2.8%',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#c8c0b0' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: navy,
              padding: '0.26em 1.5em',
              borderTop: `2px solid ${orange}`,
              borderBottom: `2px solid ${orange}`,
              flexShrink: 0,
            }}>
              <span style={{ color: orange, fontSize: cl('0.55rem', '1.5cqw', '0.85rem'), lineHeight: 1 }}>★</span>
              <span style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: cl('0.42rem', '1.3cqw', '0.74rem'),
                color: white,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Deserved Achievement
              </span>
              <span style={{ color: orange, fontSize: cl('0.55rem', '1.5cqw', '0.85rem'), lineHeight: 1 }}>★</span>
            </div>
            <div style={{ flex: 1, height: '1px', background: '#c8c0b0' }} />
          </div>

          {/* 3. Course title */}
          <div style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: cl('0.8rem', '2.7cqw', '1.55rem'),
            color: orange,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '2.2%',
            wordBreak: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
          }}>
            {courseTitle}
          </div>

          {/* 4. "This is to certify that" — intentionally larger than before */}
          <div style={{
            fontFamily: sans,
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: cl('0.58rem', '1.9cqw', '1.08rem'),
            color: '#888',
            letterSpacing: '0.05em',
            marginBottom: '1.1%',
          }}>
            This is to certify that
          </div>

          {/* 5. Recipient name */}
          <div style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: cl('1.2rem', '4.8cqw', '2.8rem'),
            color: navy,
            lineHeight: 1.05,
            textAlign: 'center',
            marginBottom: '0.7%',
            letterSpacing: '0.01em',
          }}>
            {recipientName}
          </div>

          {/* 6. Orange dot-rule under name */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '50%',
            gap: '6px',
            marginBottom: '2%',
          }}>
            <div style={{ flex: 1, height: '1px', background: orange, opacity: 0.5 }} />
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: orange, flexShrink: 0 }} />
            <div style={{ flex: 1, height: '1px', background: orange, opacity: 0.5 }} />
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: orange, flexShrink: 0 }} />
            <div style={{ flex: 1, height: '1px', background: orange, opacity: 0.5 }} />
          </div>

          {/* 7. Completion description — larger than before */}
          <div style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: cl('0.55rem', '1.8cqw', '1.02rem'),
            color: '#5a5a5a',
            lineHeight: 1.6,
            textAlign: 'center',
            width: '90%',
            marginBottom: '3.2%',
          }}>
            has successfully completed the training program and demonstrated
            exceptional proficiency in all modules listed below.
          </div>

          {/* 8. Modules section */}
          {modules.length > 0 && (
            <div style={{ width: '100%' }}>

              {/* Section header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.8%',
              }}>
                <div style={{
                  width: '3px',
                  background: navy,
                  borderRadius: '2px',
                  alignSelf: 'stretch',
                  minHeight: '12px',
                }} />
                <span style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: cl('0.44rem', '1.4cqw', '0.8rem'),
                  color: navy,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}>
                  Completed Modules
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,43,127,0.15)' }} />
              </div>

              {/* Module rows */}
              {modules.map((mod, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '2.5%',
                    padding: '1.4% 0',
                    width: '100%',
                    borderTop: i > 0 ? '0.5px solid rgba(0,43,127,0.1)' : 'none',
                  }}
                >
                  <CheckIcon size={cl('13px', '2.8cqw', '22px')} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: sans,
                      fontWeight: 700,
                      fontSize: cl('0.52rem', '1.7cqw', '0.96rem'),
                      color: orange,
                      lineHeight: 1.25,
                      marginBottom: '0.25em',
                      wordBreak: 'break-word',
                    }}>
                      {mod.title}
                    </div>
                    {mod.description && (
                      <div style={{
                        fontFamily: sans,
                        fontWeight: 300,
                        fontSize: cl('0.46rem', '1.5cqw', '0.84rem'),
                        color: '#555',
                        lineHeight: 1.45,
                        wordBreak: 'break-word',
                      }}>
                        {mod.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* ── FOOTER: Completion date
            Positioned relative to the bottom of the certificate, aligned with
            the date placeholder on the pre-printed background (~bottom 3%).    */}
        <div style={{
          position: 'absolute',
          bottom: '2.0%',
          left: '55%',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}>
          <CalendarIcon size={cl('11px', '2cqw', '16px')} />
          <span style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: cl('0.5rem', '1.6cqw', '0.9rem'),
            color: '#1a2044',
            letterSpacing: '0.04em',
          }}>
            {completionDate}
          </span>
        </div>

        {/* ── FOOTER: Certificate ID
            Larger badge, sits at ~83% top aligned with the right signature block. */}
        <div style={{
          position: 'absolute',
          top: '80%',
          right: '4%',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(0,43,127,0.07)',
          border: '1px solid rgba(0,43,127,0.25)',
          borderRadius: '4px',
          padding: '0.5% 1.2%',
        }}>
          <HashIcon size={cl('9px', '1.6cqw', '14px')} />
          <span style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: cl('0.42rem', '1.35cqw', '0.76rem'),
            color: '#1a2044',
            letterSpacing: '0.05em',
          }}>
            {certificateId}
          </span>
        </div>

      </div>
    </div>
  );
};

export default CertificateTemplate;