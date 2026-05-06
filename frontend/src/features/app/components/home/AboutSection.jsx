import { Link } from 'react-router-dom'

export function AboutSection() {
  return (
    <section className="slg-section" id="about">
      <div className="slg-about-grid">
        <div>
          <span className="slg-eyebrow">About SLOGBAA</span>
          <h2 className="slg-section-title">
            Putting Communities<br /><em>Before Self</em>
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1.25rem' }}>
            The <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Network for Active Citizens (NAC)</strong> is a civic engagement initiative dedicated to building community capacity across Uganda. We empower citizens with the knowledge, skills, and tools to actively participate in governance and community development.
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1rem' }}>
            <strong style={{ color: 'var(--text)', fontWeight: 600 }}>SLOGBAA</strong> extends this mission into the digital space — structured courses, rigorous assessments, and recognised certification for civic leaders, civil society members, and engaged citizens at every level.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link to="/auth/register" className="slg-btn-hero-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
              Start learning
            </Link>
            <Link to="/auth/login" className="slg-btn-hero-secondary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
              Continue Learning
            </Link>
          </div>
        </div>

        <div className="slg-about-visual">
          <img
            src="/assets/images/homepage/community2.jpg"
            alt="Putting communities first"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  )
}
