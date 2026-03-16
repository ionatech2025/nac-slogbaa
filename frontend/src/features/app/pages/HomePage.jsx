import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slogbaa-bg)' },

  // Nav
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'var(--slogbaa-dark)', color: '#fff' },
  logo: { margin: 0, fontSize: '1.25rem', fontWeight: 700 },
  navLinks: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  navLink: { padding: '0.45rem 1rem', borderRadius: 8, fontSize: '0.9375rem', fontWeight: 500, textDecoration: 'none' },

  // Hero
  hero: { padding: '5rem 2rem 4rem', textAlign: 'center', background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', color: '#fff' },
  heroTitle: { margin: '0 0 1rem', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
  heroHighlight: { color: '#60a5fa' },
  heroSub: { margin: '0 auto 2rem', maxWidth: 640, fontSize: '1.125rem', lineHeight: 1.6, opacity: 0.85 },
  heroCta: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', borderRadius: 10, fontSize: '1.0625rem', fontWeight: 600, textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s' },
  heroCtaPrimary: { background: 'var(--slogbaa-blue)', color: '#fff' },
  heroCtaSecondary: { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' },
  heroActions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  heroStats: { display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  statNumber: { display: 'block', fontSize: '2rem', fontWeight: 800, color: '#60a5fa' },
  statLabel: { fontSize: '0.875rem', opacity: 0.8 },

  // Features
  features: { padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto', width: '100%' },
  sectionTag: { display: 'block', margin: '0 0 0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slogbaa-blue)' },
  sectionTitle: { margin: '0 0 2.5rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--slogbaa-text)', textAlign: 'center' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  featureCard: { padding: '2rem 1.75rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', transition: 'box-shadow 0.2s, transform 0.2s' },
  featureIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, marginBottom: '1rem', fontSize: '1.25rem', color: '#fff' },
  featureTitle: { margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  featureText: { margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.6 },

  // How it works
  howSection: { padding: '4rem 2rem', background: 'var(--slogbaa-bg-secondary)' },
  howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: 900, margin: '0 auto' },
  howStep: { textAlign: 'center', padding: '1.5rem 1rem' },
  howNumber: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--slogbaa-blue)', color: '#fff', fontWeight: 800, fontSize: '1.125rem', marginBottom: '1rem' },
  howTitle: { margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  howText: { margin: 0, fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.6 },

  // Testimonials
  testimonials: { padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto', width: '100%' },
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  testimonialCard: { padding: '1.5rem 1.75rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)' },
  testimonialQuote: { margin: '0 0 1rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text)', lineHeight: 1.6, fontStyle: 'italic' },
  testimonialAuthor: { margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' },

  // CTA
  ctaSection: { padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', color: '#fff' },
  ctaTitle: { margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: 700 },
  ctaText: { margin: '0 auto 2rem', maxWidth: 500, fontSize: '1rem', opacity: 0.9, lineHeight: 1.6 },

  // Footer
  footer: { padding: '2rem', textAlign: 'center', background: 'var(--slogbaa-dark)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem' },
}

const FEATURES = [
  {
    icon: icons.course,
    bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    title: 'Structured Learning Paths',
    text: 'Courses with sequential modules, rich content blocks, and embedded quizzes that guide trainees from basics to mastery.',
  },
  {
    icon: icons.blockActivity,
    bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    title: 'Assessments & Certificates',
    text: 'Validated quizzes at every milestone. Earn certificates on completion to showcase your civic leadership skills.',
  },
  {
    icon: icons.viewList,
    bg: 'linear-gradient(135deg, #0d9488 0%, #0e7490 100%)',
    title: 'Progress Tracking',
    text: 'Track your learning journey with real-time progress bars, resume-where-you-left-off, and completion dashboards.',
  },
  {
    icon: icons.download,
    bg: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    title: 'Resource Library',
    text: 'Access policy documents, reading materials, and reference guides — all organized and searchable.',
  },
]

const STEPS = [
  { title: 'Register', text: 'Create your free trainee account with your name, email, and district.' },
  { title: 'Enroll', text: 'Browse available courses and enroll in the ones relevant to your civic role.' },
  { title: 'Learn', text: 'Study rich module content at your own pace with progress saved automatically.' },
  { title: 'Earn', text: 'Pass the module quizzes and earn certificates of completion.' },
]

const TESTIMONIALS = [
  {
    quote: '"SLOGBAA gave me the knowledge and confidence to lead accountability initiatives in my community. The structured courses made complex governance topics accessible."',
    author: 'Community Leader, Kampala',
  },
  {
    quote: '"As a civil society member, the certificates I earned through SLOGBAA opened doors for me in governance advocacy. The platform is intuitive and well-organized."',
    author: 'Civil Society Member, Gulu',
  },
  {
    quote: '"The progress tracking kept me motivated. I could see exactly how far I had come and what remained. Completing my first course felt like a real achievement."',
    author: 'Trainee, Mbarara',
  },
]

export function HomePage() {
  return (
    <div style={s.page}>
      {/* Navigation */}
      <nav style={s.nav}>
        <Logo variant="full" size={34} color="white" />
        <div style={s.navLinks}>
          <Link to="/auth/login" style={{ ...s.navLink, color: 'rgba(255,255,255,0.85)' }}>
            Sign in
          </Link>
          <Link to="/auth/register" style={{ ...s.navLink, background: 'var(--slogbaa-blue)', color: '#fff' }}>
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <h2 style={s.heroTitle}>
          Empowering <span style={s.heroHighlight}>Active Citizens</span> Through Online Learning
        </h2>
        <p style={s.heroSub}>
          SLOGBAA is the Network for Active Citizens' online learning platform. Build your civic leadership skills with structured courses, assessments, and certificates — all at your own pace.
        </p>
        <div style={s.heroActions}>
          <Link to="/auth/register" style={{ ...s.heroCta, ...s.heroCtaPrimary }}>
            <FontAwesomeIcon icon={icons.register} />
            Get Started Free
          </Link>
          <Link to="/auth/login" style={{ ...s.heroCta, ...s.heroCtaSecondary }}>
            <FontAwesomeIcon icon={icons.signIn} />
            Sign In
          </Link>
        </div>
        <div style={s.heroStats}>
          <div style={s.stat}>
            <span style={s.statNumber}>100+</span>
            <span style={s.statLabel}>Active Trainees</span>
          </div>
          <div style={s.stat}>
            <span style={s.statNumber}>12+</span>
            <span style={s.statLabel}>Courses</span>
          </div>
          <div style={s.stat}>
            <span style={s.statNumber}>50+</span>
            <span style={s.statLabel}>Certificates Issued</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={s.features}>
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>Platform Features</span>
          <h2 style={s.sectionTitle}>Everything You Need to Learn and Grow</h2>
        </div>
        <div style={s.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={s.featureCard}>
              <div style={{ ...s.featureIcon, background: f.bg }}>
                <FontAwesomeIcon icon={f.icon} />
              </div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={s.howSection}>
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>How It Works</span>
          <h2 style={{ ...s.sectionTitle, marginBottom: '2rem' }}>Four Steps to Civic Leadership</h2>
        </div>
        <div style={s.howGrid}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={s.howStep}>
              <div style={s.howNumber}>{i + 1}</div>
              <h3 style={s.howTitle}>{step.title}</h3>
              <p style={s.howText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={s.testimonials}>
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>What Trainees Say</span>
          <h2 style={s.sectionTitle}>Impact Stories from the Community</h2>
        </div>
        <div style={s.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={s.testimonialCard}>
              <p style={s.testimonialQuote}>{t.quote}</p>
              <p style={s.testimonialAuthor}>— {t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Ready to Start Your Learning Journey?</h2>
        <p style={s.ctaText}>
          Join the Network for Active Citizens and gain the skills you need to make a difference in your community.
        </p>
        <div style={s.heroActions}>
          <Link to="/auth/register" style={{ ...s.heroCta, ...s.heroCtaPrimary }}>
            Register Now
          </Link>
          <Link to="/auth/login" style={{ ...s.heroCta, ...s.heroCtaSecondary }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <p style={{ margin: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Logo variant="icon" size={20} />
            <span>Putting Communities Before Self &middot; Network for Active Citizens (NAC) &middot; SLOGBAA Online Learning Platform</span>
          </span>
        </p>
      </footer>
    </div>
  )
}
