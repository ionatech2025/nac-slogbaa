import { CheckCircle, BookOpen, Star, Zap, Target, Calendar, Hash } from 'lucide-react';

/** Maps optional `icon` string → Lucide component */
const ICON_MAP = {
  default: CheckCircle,
  learning: BookOpen,
  achievement: Star,
  technical: Zap,
  strategic: Target,
};

/**
 * CertificateTemplate
 *
 * Renders a certificate at A4 portrait proportions (210 × 297 mm → ratio 1:1.4142).
 * The background image fills the container absolutely; every dynamic field is
 * positioned with percentage-based `top` / `left` values matched to the actual
 * SLOGBAA/NAC certificate background image layout.
 *
 * All styles are inline (project uses vanilla CSS, no Tailwind).
 *
 * Background image layout reference & dynamic overlay positions:
 *   • SLOGBAA logo header:   0 – 10%
 *   • Partner logos:        10 – 18% (pre-printed on background)
 *   • Dynamic content container: starts at 27%
 *     - "Certificate of Completion" text: ~27 – 34%
 *     - Styled blue/orange banner pill: ~34 – 38%
 *     - Course title (orange): ~38 – 44%
 *     - White content area (certify label, name, desc, modules): ~44 – 84%
 *   • Signatures section:   84 – 96%   ← pre-printed; we overlay date + cert-id
 *   • City / date footer:   92 – 100%
 */
const CertificateTemplate = ({ data = {}, style = {}, className = '' }) => {
  const {
    courseTitle = 'Strategic Leadership in Global Business',
    recipientName = 'Jonathan Pacwa',
    completionDate = 'May 13, 2026',
    certificateId = 'CERT-SLG-2026-0001',
    modules = [],
  } = data;

  /* ── root: locked A4 portrait aspect-ratio ── */
  const root = {
    position: 'relative',
    width: '100%',
    aspectRatio: '210 / 297',
    overflow: 'hidden',
    background: '#fff',
    userSelect: 'none',
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
    ...style,
  };

  return (
    <div style={root} className={className}>

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

      {/* ══════════════════════════════════════════════════════════════
          OVERLAY — all dynamic fields
         ══════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* ── CENTRAL CONTENT CONTAINER ── 
            Using a flex column to dynamically flow text and prevent overlaps 
            if the title or recipient name wraps to multiple lines. */}
        <div style={{
          position: 'absolute',
          top: '27%',
          left: '8%',
          width: '84%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}>
          {/* Certificate of Completion Header */}
          <div style={{
            color: '#003087',
            fontSize: 'clamp(1.1rem, 3.8cqw, 2.2rem)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: "Georgia, 'Times New Roman', serif",
            textAlign: 'center',
            marginBottom: '1.5%',
          }}>
            Certificate of Completion
          </div>

          {/* Styled Banner Pill */}
          <div style={{
            background: 'linear-gradient(135deg, #003087 0%, #1a56db 100%)',
            color: '#ffffff',
            padding: '0.35em 2em',
            borderRadius: '50px',
            fontSize: 'clamp(0.4rem, 1.2cqw, 0.72rem)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: '1.5px solid #F58220',
            boxShadow: '0 3px 8px rgba(0, 48, 135, 0.15)',
            marginBottom: '3%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}>
            <Star size={10} style={{ fill: '#F58220', stroke: '#F58220' }} />
            <span>Professional Credential</span>
            <Star size={10} style={{ fill: '#F58220', stroke: '#F58220' }} />
          </div>

          {/* 1. Course title */}
          <div style={{
            color: '#F58220',
            fontSize: 'clamp(0.7rem, 2.6cqw, 1.5rem)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: 1.15,
            fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
            textAlign: 'center',
            marginBottom: '2%',
          }}>
            {courseTitle}
          </div>

          {/* 2. "This is to certify that" label */}
          <div style={{
            color: '#666',
            fontSize: 'clamp(0.5rem, 1.8cqw, 0.95rem)',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
            marginBottom: '1.5%',
          }}>
            This is to certify that
          </div>

          {/* 3. Recipient name */}
          <div style={{
            color: '#003087',
            fontSize: 'clamp(1.1rem, 4.8cqw, 3rem)',
            fontWeight: 500,
            fontFamily: "Georgia, 'Times New Roman', serif",
            lineHeight: 1.15,
            letterSpacing: '0.01em',
            textAlign: 'center',
            marginBottom: '2.5%',
          }}>
            {recipientName}
          </div>

          {/* 4. Completion description */}
          <div style={{
            color: '#555',
            fontSize: 'clamp(0.5rem, 1.8cqw, 0.95rem)',
            lineHeight: 1.45,
            textAlign: 'center',
            width: '88%',
            marginBottom: '4%',
          }}>
            has successfully completed the training program and demonstrated
            exceptional proficiency in all modules listed below.
          </div>

          {/* 5. Modules section */}
          {modules.length > 0 && (
            <div style={{
              width: '95%',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* section label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4em',
                marginBottom: '1.5%',
                borderLeft: '3px solid #1a56db',
                paddingLeft: '0.6em',
              }}>
                <span style={{
                  color: '#1a56db',
                  fontSize: 'clamp(0.42rem, 1.4cqw, 0.82rem)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  Completed Modules
                </span>
              </div>

              {/* module rows */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {modules.map((mod, i) => {
                  const Icon = ICON_MAP[mod.icon] || ICON_MAP.default;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1.5%',
                        padding: '1% 0.4% 1% 0.2%',
                        borderBottom: i < modules.length - 1
                          ? '1px solid rgba(26,86,219,0.12)'
                          : 'none',
                      }}
                    >
                      <Icon
                        style={{
                          color: '#1a56db',
                          flexShrink: 0,
                          marginTop: '0.2em',
                          width: '2.2cqw',
                          height: '2.2cqw',
                          minWidth: '12px',
                          minHeight: '12px',
                        }}
                      />
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{
                          color: '#F58220',
                          fontSize: 'clamp(0.45rem, 1.65cqw, 0.95rem)',
                          fontWeight: 700,
                          lineHeight: 1.3,
                          marginBottom: '0.2em',
                        }}>
                          {mod.title}
                        </div>
                        {mod.description && (
                          <div style={{
                            color: '#444',
                            fontSize: 'clamp(0.38rem, 1.3cqw, 0.75rem)',
                            lineHeight: 1.4,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                          }}>
                            {mod.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── 6. Footer overlays ─────────────────────────────────────────
            The pre-printed image already has:
              • Signature boxes at ~84 – 93 %
              • "Kampala, Uganda | Date for when the course is completed" at ~94 %
            We overlay:
              • Completion date replacing the placeholder at ~94.5 %
              • Certificate ID shown as a small tag at ~88 % (right side, below sig) ── */}

        {/* Completion date — replaces "Date for when the course is completed" */}
        <div style={{
          position: 'absolute',
          top: '96.2%',
          left: '55%',       /* lines up with the date placeholder on the image */
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3em',
        }}>
          <Calendar style={{ color: '#1a56db', width: '1.4cqw', height: '1.4cqw', minWidth: '8px', minHeight: '8px' }} />
          <span style={{
            color: '#1a2044',
            fontSize: 'clamp(0.3rem, 1.05cqw, 0.62rem)',
            fontWeight: 600,
          }}>
            {completionDate}
          </span>
        </div>

        {/* Certificate ID — small pill above the right signature */}
        <div style={{
          position: 'absolute',
          top: '84%',
          right: '8%',
          background: 'rgba(26,86,219,0.07)',
          border: '1px solid rgba(26,86,219,0.2)',
          borderRadius: '4px',
          padding: '0.25% 0.8%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3em',
        }}>
          <Hash style={{ color: '#1a56db', width: '1.2cqw', height: '1.2cqw', minWidth: '7px', minHeight: '7px' }} />
          <span style={{
            color: '#1a2044',
            fontSize: 'clamp(0.28rem, 0.95cqw, 0.55rem)',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}>
            {certificateId}
          </span>
        </div>

      </div>
    </div>
  );
};

export default CertificateTemplate;
