import { Link } from 'react-router-dom'

export function AboutSection({ variant = 'white' }) {
  return (
    <section className={`slg-home-section slg-section-${variant}`} id="about">
      <div className="slg-container">
        <div className="slg-about-grid">
          <div>
            <span className="slg-eyebrow">About SLOGBAA</span>
            <h2 className="slg-section-title">
              Putting Communities<br /><em>Before Self</em>
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1.25rem' }}>
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Strengthening Local Governance, Budget Advocacy, and Accountability (SLOGBAA)</strong> is a leadership fellowship designed to deepen young people’s understanding of Uganda’s democratic governance system. The programme empowers youth to learn how the country is governed—from the central government down to the local level.
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1rem' }}>
              We believe that when young people truly understand how governance works, they are inspired to take part in shaping it. Through SLOGBAA, fellows are encouraged to engage with existing governance structures and policy provisions and to see themselves as equipped leaders within Uganda’s governing bodies.
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1rem' }}>
              To make this possible, the SLOGBAA online learning dashboard offers a flexible, self-paced learning experience. Regardless of their location, education level, or other barriers, young people can access the platform anytime, anywhere.
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1rem' }}>
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Beyond self-learning,</strong> the platform also serves as a public knowledge shop—curating policies, programmes, and key governance documents that are often difficult for the majority of Ugandans to access.

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
      </div>
    </section>
  )
}
