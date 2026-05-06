const PARTNER_LOGOS = [
  { name: 'Civil Connections', logoUrl: '/assets/images/logos/CivilConnectionsLogo.png', websiteUrl: 'https://civilconnections.org/' },
  { name: 'UYONET', logoUrl: '/assets/images/logos/uyonet-logo.png', websiteUrl: 'https://uyonet.wordpress.com/' },
  { name: 'ActionAid', logoUrl: '/assets/images/logos/Actionaid_logo.png', websiteUrl: 'https://uganda.actionaid.org/' },
  { name: 'Oxfam', logoUrl: '/assets/images/logos/nac_logo.png', websiteUrl: 'https://nacuganda.org/' },
]

export function PartnersSection({ partners: cmsPartners, variant = 'white' }) {
  const partners = cmsPartners?.length ? cmsPartners : PARTNER_LOGOS

  return (
    <section className={`slg-home-section slg-section-${variant}`} id="partners">
      <div className="slg-container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="slg-eyebrow" style={{ justifyContent: 'center' }}>Our Partners</span>
          <h2 className="slg-section-title" style={{ textAlign: 'center' }}>
            Working together<br /><em>for change</em>
          </h2>
          <p className="slg-section-desc" style={{ margin: '0.875rem auto 0', textAlign: 'center' }}>
            Collaborating with government, civil society, and development partners to deliver impactful civic education.
          </p>
        </div>
        <div className="slg-partners-container" style={{ marginTop: '1rem' }}>
          <div className="slg-partners-track">
            {[...partners, ...partners, ...partners].map((p, idx) => {
              const name = p.name || 'Partner'
              const logo = p.logoUrl || null
              const color = p.color || 'var(--orange)'
              const initials = p.initials || name.split(' ').map((w) => w[0]).join('').slice(0, 4)

              if (logo) {
                return (
                  <a key={`${name}-${idx}`} href={p.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" className="slg-partner-link" title={name}>
                    <img src={logo} alt={name} className="slg-partner-img" loading="lazy" />
                  </a>
                )
              }

              return (
                <div key={`${name}-${idx}`} className="slg-partner-tile" title={name}>
                  <span className="slg-partner-initials" style={{ color }}>{initials}</span>
                  <span className="slg-partner-name">{name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
