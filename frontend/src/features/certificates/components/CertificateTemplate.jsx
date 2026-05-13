import { CheckCircle, BookOpen, Star, Zap, Target, Calendar, Hash } from 'lucide-react';

/** Maps optional `icon` string → Lucide component */
const ICON_MAP = {
  default:     CheckCircle,
  learning:    BookOpen,
  achievement: Star,
  technical:   Zap,
  strategic:   Target,
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
 * Background image layout reference:
 *   • SLOGBAA logo header:   0 – 10%
 *   • Partner logos:        10 – 18%
 *   • "CERTIFICATE OF COMPLETION" text: 18 – 40%
 *   • Blue banner pill:     40 – 44%   ← course title goes here
 *   • White content area:   44 – 84%   ← name, description, modules
 *   • Signatures section:   84 – 96%   ← pre-printed; we overlay date + cert-id
 *   • City / date footer:   92 – 100%
 */
const CertificateTemplate = ({ data = {}, style = {}, className = '' }) => {
  const {
    courseTitle    = 'Strategic Leadership in Global Business',
    recipientName  = 'Jonathan Pacwa',
    completionDate = 'May 13, 2026',
    certificateId  = 'CERT-SLG-2026-0001',
    modules        = [],
  } = data;

  /* ── root: locked A4 portrait aspect-ratio ── */
  const root = {
    position:     'relative',
    width:        '100%',
    aspectRatio:  '210 / 297',
    overflow:     'hidden',
    background:   '#fff',
    userSelect:   'none',
    fontFamily:   "'Segoe UI', system-ui, Arial, sans-serif",
    ...style,
  };

  return (
    <div style={root} className={className}>

      {/* ── Background image ── */}
      <img
        src="/certificates/background.png"
        alt=""
        role="presentation"
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          objectFit:     'cover',
          display:       'block',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════════════════════════
          OVERLAY — all dynamic fields
         ══════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* ── 1. Course title ── centred inside the blue pill banner ── */}
        {/* Banner pill sits at ~38.5 % from the top, ~3.5 % tall */}
        <div style={{
          position:   'absolute',
          top:        '38.5%',
          left:       '22%',
          width:      '56%',
          height:     '3.5%',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign:  'center',
        }}>
          <span style={{
            color:         '#ffffff',
            fontSize:      'clamp(0.45rem, 2cqw, 1.1rem)',
            fontWeight:    700,
            letterSpacing: '0.035em',
            textTransform: 'uppercase',
            lineHeight:    1.1,
            textShadow:    '0 1px 3px rgba(0,0,0,0.45)',
          }}>
            {courseTitle}
          </span>
        </div>

        {/* ── 2. "This is to certify that" label ── */}
        {/* Sits just below the banner, at ~44.5 % */}
        <div style={{
          position:  'absolute',
          top:       '44.2%',
          left:      0,
          width:     '100%',
          textAlign: 'center',
        }}>
          <span style={{
            color:         '#666',
            fontSize:      'clamp(0.4rem, 1.5cqw, 0.85rem)',
            fontStyle:     'italic',
            letterSpacing: '0.02em',
          }}>
            This is to certify that
          </span>
        </div>

        {/* ── 3. Recipient name ── large, centred, at ~47 % ── */}
        <div style={{
          position:  'absolute',
          top:       '46.8%',
          left:      '8%',
          width:     '84%',
          textAlign: 'center',
        }}>
          <span style={{
            display:       'block',
            color:         '#003087',
            fontSize:      'clamp(0.9rem, 4.5cqw, 2.8rem)',
            fontWeight:    700,
            fontFamily:    "Georgia, 'Times New Roman', serif",
            lineHeight:    1.15,
            letterSpacing: '0.01em',
          }}>
            {recipientName}
          </span>
        </div>

        {/* ── 4. Completion description ── at ~55 % ── */}
        <div style={{
          position:  'absolute',
          top:       '54.5%',
          left:      '13%',
          width:     '74%',
          textAlign: 'center',
        }}>
          <span style={{
            color:      '#555',
            fontSize:   'clamp(0.38rem, 1.45cqw, 0.8rem)',
            lineHeight: 1.65,
          }}>
            has successfully completed the training program and demonstrated
            exceptional proficiency in all modules listed below.
          </span>
        </div>

        {/* ── 5. Modules section ── at ~60 % ── */}
        {modules.length > 0 && (
          <div style={{
            position: 'absolute',
            top:      '60%',
            left:     '10%',
            width:    '80%',
          }}>
            {/* section label */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '0.4em',
              marginBottom: '0.5%',
              borderLeft:   '2.5px solid #1a56db',
              paddingLeft:  '0.5em',
            }}>
              <span style={{
                color:         '#1a56db',
                fontSize:      'clamp(0.32rem, 1.1cqw, 0.65rem)',
                fontWeight:    700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                Completed Modules
              </span>
            </div>

            {/* module rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4%' }}>
              {modules.map((mod, i) => {
                const Icon = ICON_MAP[mod.icon] || ICON_MAP.default;
                return (
                  <div
                    key={i}
                    style={{
                      display:      'flex',
                      alignItems:   'flex-start',
                      gap:          '0.6%',
                      background:   'rgba(255,255,255,0.7)',
                      border:       '1px solid rgba(26,86,219,0.1)',
                      borderRadius: '3px',
                      padding:      '0.5% 1%',
                    }}
                  >
                    <Icon
                      style={{
                        color:     '#1a56db',
                        flexShrink: 0,
                        marginTop:  '0.1em',
                        width:      '1.8cqw',
                        height:     '1.8cqw',
                        minWidth:   '10px',
                        minHeight:  '10px',
                      }}
                    />
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{
                        color:      '#1a1a2e',
                        fontSize:   'clamp(0.35rem, 1.35cqw, 0.75rem)',
                        fontWeight: 700,
                      }}>
                        {mod.title}
                      </div>
                      {mod.description && (
                        <div style={{
                          color:     '#666',
                          fontSize:  'clamp(0.3rem, 1.05cqw, 0.6rem)',
                          marginTop: '0.1em',
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

        {/* ── 6. Footer overlays ─────────────────────────────────────────
            The pre-printed image already has:
              • Signature boxes at ~84 – 93 %
              • "Kampala, Uganda | Date for when the course is completed" at ~94 %
            We overlay:
              • Completion date replacing the placeholder at ~94.5 %
              • Certificate ID shown as a small tag at ~88 % (right side, below sig) ── */}

        {/* Completion date — replaces "Date for when the course is completed" */}
        <div style={{
          position:  'absolute',
          top:       '93.5%',
          left:      '49%',       /* lines up with the date placeholder on the image */
          textAlign: 'left',
          display:   'flex',
          alignItems: 'center',
          gap:        '0.3em',
        }}>
          <Calendar style={{ color: '#1a56db', width: '1.4cqw', height: '1.4cqw', minWidth: '8px', minHeight: '8px' }} />
          <span style={{
            color:      '#1a2044',
            fontSize:   'clamp(0.3rem, 1.05cqw, 0.62rem)',
            fontWeight: 600,
          }}>
            {completionDate}
          </span>
        </div>

        {/* Certificate ID — small pill above the right signature */}
        <div style={{
          position:   'absolute',
          top:        '84%',
          right:      '8%',
          background: 'rgba(26,86,219,0.07)',
          border:     '1px solid rgba(26,86,219,0.2)',
          borderRadius: '4px',
          padding:    '0.25% 0.8%',
          display:    'flex',
          alignItems: 'center',
          gap:        '0.3em',
        }}>
          <Hash style={{ color: '#1a56db', width: '1.2cqw', height: '1.2cqw', minWidth: '7px', minHeight: '7px' }} />
          <span style={{
            color:      '#1a2044',
            fontSize:   'clamp(0.28rem, 0.95cqw, 0.55rem)',
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
