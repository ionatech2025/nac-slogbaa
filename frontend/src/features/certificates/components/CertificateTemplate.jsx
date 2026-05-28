/**
 * CertificateTemplate
 *
 * Renders an A4-portrait certificate (210×297 mm → aspect-ratio 210/297).
 * A background image fills the container; all dynamic content is overlaid
 * using percentage/container-query-based positioning matched to the SLOGBAA/NAC background.
 *
 * Add to your HTML <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
 *
 * Props:
 *   data      – { courseTitle, recipientName, completionDate, certificateId, modules[] }
 *   style     – optional extra styles on the root element
 *   className – optional class name on the root element
 *
 * modules[] items: { title: string, description?: string }
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

  // Dynamic layout parameters based on number of modules
  const numModules = modules.length;
  let layoutConfig = {
    top: '24%',
    titleFs: '4.1cqw',
    titleMb: '3.2%',
    bannerMb: '2.8%',
    bannerFs: '1.3cqw',
    bannerStarFs: '1.5cqw',
    courseFs: '2.7cqw',
    courseMb: '2.2%',
    certifyFs: '1.9cqw',
    certifyMb: '1.1%',
    nameFs: '4.8cqw',
    nameMb: '0.7%',
    dividerMb: '2%',
    descFs: '1.8cqw',
    descMb: '3.2%',
    moduleHeaderFs: '1.4cqw',
    moduleHeaderMb: '1.8%',
    modulePadding: '1.4% 0',
    moduleGap: '2.5%',
    moduleTitleFs: '1.7cqw',
    moduleDescFs: '1.5cqw',
    checkIconSize: '2.8cqw',
    columns: 1,
    columnGap: '0%',
    rowGap: '0%',
    descLineHeight: 1.45,
    titleLineHeight: 1.25,
  };

  if (numModules > 3) {
    // 4 to 6 modules: 2-column grid, tighter margins and slightly smaller typography
    layoutConfig = {
      top: '21.5%',
      titleFs: '3.8cqw',
      titleMb: '2.2%',
      bannerMb: '1.8%',
      bannerFs: '1.2cqw',
      bannerStarFs: '1.4cqw',
      courseFs: '2.4cqw',
      courseMb: '1.6%',
      certifyFs: '1.7cqw',
      certifyMb: '0.8%',
      nameFs: '4.4cqw',
      nameMb: '0.5%',
      dividerMb: '1.2%',
      descFs: '1.6cqw',
      descMb: '2.2%',
      moduleHeaderFs: '1.3cqw',
      moduleHeaderMb: '1.2%',
      modulePadding: '0.8% 0',
      moduleGap: '2.0%',
      moduleTitleFs: '1.4cqw',
      moduleDescFs: '1.15cqw',
      checkIconSize: '2.2cqw',
      columns: 2,
      columnGap: '6%',
      rowGap: '0.5%',
      descLineHeight: 1.35,
      titleLineHeight: 1.2,
    };
  }

  if (numModules > 6) {
    // 7 or more modules: 2-column grid, compact spacing, smallest typography
    layoutConfig = {
      top: '19.5%',
      titleFs: '3.5cqw',
      titleMb: '1.5%',
      bannerMb: '1.2%',
      bannerFs: '1.1cqw',
      bannerStarFs: '1.3cqw',
      courseFs: '2.1cqw',
      courseMb: '1.2%',
      certifyFs: '1.5cqw',
      certifyMb: '0.5%',
      nameFs: '4.0cqw',
      nameMb: '0.3%',
      dividerMb: '0.8%',
      descFs: '1.4cqw',
      descMb: '1.5%',
      moduleHeaderFs: '1.2cqw',
      moduleHeaderMb: '0.8%',
      modulePadding: '0.5% 0',
      moduleGap: '1.5%',
      moduleTitleFs: '1.2cqw',
      moduleDescFs: '1.0cqw',
      checkIconSize: '1.8cqw',
      columns: 2,
      columnGap: '8%',
      rowGap: '0.3%',
      descLineHeight: 1.3,
      titleLineHeight: 1.15,
    };
  }

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
        src="/certificates/certificate_background3.jpeg"
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
            top: dynamically positioned to allocate vertical space  */}
        <div style={{
          position: 'absolute',
          top: layoutConfig.top,
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
            fontSize: layoutConfig.titleFs,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.05,
            marginBottom: layoutConfig.titleMb,
          }}>
            Certificate of Completion
          </div>

          {/* 2. Banner with flanking hairlines */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginBottom: layoutConfig.bannerMb,
          }}>
            <div style={{ flex: 1, height: '0.1cqw', background: '#c8c0b0' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7cqw',
              background: navy,
              padding: '0.26em 1.5em',
              borderTop: `0.2cqw solid ${orange}`,
              borderBottom: `0.2cqw solid ${orange}`,
              flexShrink: 0,
            }}>
              <span style={{ color: orange, fontSize: layoutConfig.bannerStarFs, lineHeight: 1 }}>★</span>
              <span style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: layoutConfig.bannerFs,
                color: white,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Fellowship Programme
              </span>
              <span style={{ color: orange, fontSize: layoutConfig.bannerStarFs, lineHeight: 1 }}>★</span>
            </div>
            <div style={{ flex: 1, height: '0.1cqw', background: '#c8c0b0' }} />
          </div>

          {/* 3. Course title */}
          <div style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: layoutConfig.courseFs,
            color: orange,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: layoutConfig.courseMb,
            wordBreak: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
          }}>
            {courseTitle}
          </div>

          {/* 4. "This is to certify that" */}
          <div style={{
            fontFamily: sans,
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: layoutConfig.certifyFs,
            color: '#888',
            letterSpacing: '0.05em',
            marginBottom: layoutConfig.certifyMb,
          }}>
            This is to certify that
          </div>

          {/* 5. Recipient name */}
          <div style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: layoutConfig.nameFs,
            color: navy,
            lineHeight: 1.05,
            textAlign: 'center',
            marginBottom: layoutConfig.nameMb,
            letterSpacing: '0.01em',
          }}>
            {recipientName}
          </div>

          {/* 6. Orange dot-rule under name */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '50%',
            gap: '0.7cqw',
            marginBottom: layoutConfig.dividerMb,
          }}>
            <div style={{ flex: 1, height: '0.12cqw', background: orange, opacity: 0.5 }} />
            <div style={{ width: '0.6cqw', height: '0.6cqw', borderRadius: '50%', background: orange, flexShrink: 0 }} />
            <div style={{ flex: 1, height: '0.12cqw', background: orange, opacity: 0.5 }} />
            <div style={{ width: '0.6cqw', height: '0.6cqw', borderRadius: '50%', background: orange, flexShrink: 0 }} />
            <div style={{ flex: 1, height: '0.12cqw', background: orange, opacity: 0.5 }} />
          </div>

          {/* 7. Completion description */}
          <div style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: layoutConfig.descFs,
            color: '#5a5a5a',
            lineHeight: 1.6,
            textAlign: 'center',
            width: '90%',
            marginBottom: layoutConfig.descMb,
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
                gap: '1cqw',
                marginBottom: layoutConfig.moduleHeaderMb,
              }}>
                <div style={{
                  width: '0.35cqw',
                  background: navy,
                  borderRadius: '0.2cqw',
                  alignSelf: 'stretch',
                  minHeight: '1.4cqw',
                }} />
                <span style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: layoutConfig.moduleHeaderFs,
                  color: navy,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}>
                  Completed Modules
                </span>
                <div style={{ flex: 1, height: '0.1cqw', background: 'rgba(0,43,127,0.15)' }} />
              </div>

              {/* Module grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: layoutConfig.columns === 2 ? '1fr 1fr' : '1fr',
                columnGap: layoutConfig.columnGap,
                rowGap: layoutConfig.rowGap,
                width: '100%',
              }}>
                {modules.map((mod, i) => {
                  const isLastRow = layoutConfig.columns === 2
                    ? i >= modules.length - (modules.length % 2 === 0 ? 2 : 1)
                    : i === modules.length - 1;

                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: layoutConfig.moduleGap,
                        padding: layoutConfig.modulePadding,
                        width: '100%',
                        borderBottom: isLastRow ? 'none' : '0.1cqw solid rgba(0,43,127,0.08)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <CheckIcon size={layoutConfig.checkIconSize} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: sans,
                          fontWeight: 700,
                          fontSize: layoutConfig.moduleTitleFs,
                          color: orange,
                          lineHeight: layoutConfig.titleLineHeight,
                          marginBottom: '0.2em',
                          wordBreak: 'break-word',
                        }}>
                          {mod.title}
                        </div>
                        {mod.description && (
                          <div style={{
                            fontFamily: sans,
                            fontWeight: 300,
                            fontSize: layoutConfig.moduleDescFs,
                            color: '#555',
                            lineHeight: layoutConfig.descLineHeight,
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

        {/* ── FOOTER: Completion date
            Positioned relative to the bottom of the certificate, aligned with
            the date placeholder on the pre-printed background (~bottom 3%).    */}
        <div style={{
          position: 'absolute',
          bottom: '2.0%',
          left: '55%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6cqw',
        }}>
          <CalendarIcon size="2cqw" />
          <span style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: '1.6cqw',
            color: '#1a2044',
            letterSpacing: '0.04em',
          }}>
            {completionDate}
          </span>
        </div>

        {/* ── FOOTER: Certificate ID
            Larger badge, sits at ~80% top aligned with the right signature block. */}
        <div style={{
          position: 'absolute',
          top: '80%',
          right: '4%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5cqw',
          background: 'rgba(0,43,127,0.07)',
          border: '0.12cqw solid rgba(0,43,127,0.25)',
          borderRadius: '0.5cqw',
          padding: '0.5% 1.2%',
        }}>
          <HashIcon size="1.6cqw" />
          <span style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: '1.35cqw',
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