import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slogbaa-bg)' },

  // Nav — glass morphism
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 2rem',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLinks: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  navLink: { padding: '0.45rem 1rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s ease, transform 0.15s ease' },

  // Hero — layered generative background with enhanced depth
  hero: {
    position: 'relative',
    padding: 'clamp(3.5rem, 8vw, 6rem) 2rem clamp(3rem, 7vw, 5rem)',
    textAlign: 'center',
    color: '#fff',
    overflow: 'hidden',
    background: [
      'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(37,99,235,0.18) 0%, transparent 70%)',
      'radial-gradient(ellipse 40% 30% at 20% 60%, rgba(13,148,136,0.08) 0%, transparent 50%)',
      'radial-gradient(ellipse 35% 25% at 80% 30%, rgba(79,70,229,0.06) 0%, transparent 50%)',
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E")`,
      'linear-gradient(160deg, #050a15 0%, #0a1628 20%, #0f1d3a 40%, #1e3a5f 55%, #0f1d3a 75%, #0a1628 90%, #050a15 100%)',
    ].join(', '),
  },
  heroInner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 860,
    margin: '0 auto',
  },
  heroTitle: { margin: '0 0 1.25rem', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
  heroHighlight: { color: '#60a5fa' },
  heroSub: { margin: '0 auto 2.25rem', maxWidth: 640, fontSize: '1.125rem', lineHeight: 1.7, opacity: 0.88 },
  heroCta: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', borderRadius: 14, fontSize: '1.0625rem', fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
  heroCtaPrimary: { background: '#2563eb', color: '#fff', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' },
  heroCtaSecondary: {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  heroActions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  heroStats: { display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' },
  statCard: {
    textAlign: 'center',
    padding: '1rem 1.75rem',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
  },
  statNumber: { display: 'block', fontSize: '2rem', fontWeight: 800, color: '#60a5fa' },
  statLabel: { fontSize: '0.875rem', opacity: 0.8 },

  // Features — glass cards
  features: { padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto', width: '100%' },
  sectionTag: { display: 'block', margin: '0 0 0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slogbaa-blue)' },
  sectionTitle: { margin: '0 0 2.5rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--slogbaa-text)', textAlign: 'center' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  featureCard: {
    padding: '2rem 1.75rem',
    borderRadius: 18,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
  },
  featureIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 14, marginBottom: '1rem', fontSize: '1.25rem', color: '#fff' },
  featureTitle: { margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  featureText: { margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.6 },

  // How it works — glass steps
  howSection: { padding: '4rem 2rem', background: 'var(--slogbaa-bg-secondary)' },
  howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: 900, margin: '0 auto' },
  howStep: {
    textAlign: 'center',
    padding: '1.75rem 1.25rem',
    borderRadius: 18,
    background: 'var(--slogbaa-glass-bg-subtle)',
    backdropFilter: 'blur(12px) saturate(150%)',
    WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    border: '1px solid var(--slogbaa-glass-border-subtle)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  howNumber: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--slogbaa-blue)', color: '#fff', fontWeight: 800, fontSize: '1.125rem', marginBottom: '1rem' },
  howTitle: { margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  howText: { margin: 0, fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.6 },

  // Testimonials — glass cards
  testimonials: { padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto', width: '100%' },
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  testimonialCard: {
    padding: '1.75rem',
    borderRadius: 18,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  testimonialQuote: { margin: '0 0 1rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text)', lineHeight: 1.6, fontStyle: 'italic' },
  testimonialAuthor: { margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' },

  // CTA — enhanced gradient
  ctaSection: {
    position: 'relative',
    padding: '4.5rem 2rem',
    textAlign: 'center',
    color: '#fff',
    overflow: 'hidden',
    background: [
      'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.15) 0%, transparent 70%)',
      'linear-gradient(145deg, #050a15 0%, #0f1d3a 35%, #1e3a5f 50%, #0f1d3a 65%, #050a15 100%)',
    ].join(', '),
  },
  ctaTitle: { margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: 700, position: 'relative', zIndex: 1 },
  ctaText: { margin: '0 auto 2rem', maxWidth: 500, fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, position: 'relative', zIndex: 1 },

  // Footer — glass
  footer: { padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem' },
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

function HeroBackground() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-50 380 C150 280, 350 420, 550 340 S850 220, 1050 320 L1250 280"
        stroke="rgba(96,165,250,0.07)"
        strokeWidth="1.5"
      />
      <path
        d="M-50 420 C200 320, 400 480, 600 380 S900 260, 1100 360 L1250 320"
        stroke="rgba(96,165,250,0.05)"
        strokeWidth="1"
      />
      <path
        d="M-50 300 C100 200, 300 340, 500 260 S800 180, 1000 260 L1250 220"
        stroke="rgba(96,165,250,0.06)"
        strokeWidth="1.5"
      />
      <circle cx="200" cy="320" r="2.5" fill="rgba(96,165,250,0.12)" />
      <circle cx="450" cy="360" r="2" fill="rgba(96,165,250,0.10)" />
      <circle cx="700" cy="290" r="3" fill="rgba(96,165,250,0.08)" />
      <circle cx="950" cy="330" r="2" fill="rgba(96,165,250,0.10)" />
      <circle cx="350" cy="240" r="1.5" fill="rgba(96,165,250,0.09)" />
      <circle cx="600" cy="200" r="2" fill="rgba(96,165,250,0.07)" />
      <circle cx="850" cy="250" r="2.5" fill="rgba(96,165,250,0.08)" />
      <circle cx="1050" cy="280" r="1.5" fill="rgba(96,165,250,0.09)" />
      <circle cx="150" cy="450" r="2" fill="rgba(96,165,250,0.06)" />
      <circle cx="500" cy="480" r="1.5" fill="rgba(96,165,250,0.07)" />
      <circle cx="800" cy="440" r="2" fill="rgba(96,165,250,0.06)" />
      <circle cx="1100" cy="420" r="1.5" fill="rgba(96,165,250,0.07)" />
      <line x1="200" y1="320" x2="350" y2="240" stroke="rgba(96,165,250,0.04)" strokeWidth="0.5" />
      <line x1="350" y1="240" x2="600" y2="200" stroke="rgba(96,165,250,0.04)" strokeWidth="0.5" />
      <line x1="600" y1="200" x2="700" y2="290" stroke="rgba(96,165,250,0.04)" strokeWidth="0.5" />
      <line x1="700" y1="290" x2="850" y2="250" stroke="rgba(96,165,250,0.04)" strokeWidth="0.5" />
      <line x1="850" y1="250" x2="950" y2="330" stroke="rgba(96,165,250,0.04)" strokeWidth="0.5" />
      <line x1="450" y1="360" x2="700" y2="290" stroke="rgba(96,165,250,0.03)" strokeWidth="0.5" />
      <line x1="950" y1="330" x2="1050" y2="280" stroke="rgba(96,165,250,0.04)" strokeWidth="0.5" />
    </svg>
  )
}

export function HomePage() {
  return (
    <div style={s.page}>
      {/* Navigation — glass */}
      <nav style={s.nav} className="glass-nav">
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
        <HeroBackground />
        <div style={s.heroInner}>
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
            <div style={s.statCard}>
              <span style={s.statNumber}>100+</span>
              <span style={s.statLabel}>Active Trainees</span>
            </div>
            <div style={s.statCard}>
              <span style={s.statNumber}>12+</span>
              <span style={s.statLabel}>Courses</span>
            </div>
            <div style={s.statCard}>
              <span style={s.statNumber}>50+</span>
              <span style={s.statLabel}>Certificates Issued</span>
            </div>
          </div>
          <p style={{ margin: '1.5rem auto 0', fontSize: '0.6875rem', opacity: 0.5, maxWidth: 400 }}>
            * Platform growth targets. Figures updated periodically.
          </p>
        </div>
      </section>

      {/* Features — glass cards */}
      <section style={s.features}>
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>Platform Features</span>
          <h2 style={s.sectionTitle}>Everything You Need to Learn and Grow</h2>
        </div>
        <div style={s.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={s.featureCard} className="glass-hover">
              <div style={{ ...s.featureIcon, background: f.bg }}>
                <FontAwesomeIcon icon={f.icon} />
              </div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works — glass steps */}
      <section style={s.howSection}>
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>How It Works</span>
          <h2 style={{ ...s.sectionTitle, marginBottom: '2rem' }}>Four Steps to Civic Leadership</h2>
        </div>
        <div style={s.howGrid}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={s.howStep} className="glass-hover">
              <div style={s.howNumber}>{i + 1}</div>
              <h3 style={s.howTitle}>{step.title}</h3>
              <p style={s.howText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials — glass cards */}
      <section style={s.testimonials}>
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>What Trainees Say</span>
          <h2 style={s.sectionTitle}>Impact Stories from the Community</h2>
        </div>
        <div style={s.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={s.testimonialCard} className="glass-hover">
              <p style={s.testimonialQuote}>{t.quote}</p>
              <p style={s.testimonialAuthor}>{t.author}</p>
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
        <div style={{ ...s.heroActions, position: 'relative', zIndex: 1 }}>
          <Link to="/auth/register" style={{ ...s.heroCta, ...s.heroCtaPrimary }}>
            Register Now
          </Link>
          <Link to="/auth/login" style={{ ...s.heroCta, ...s.heroCtaSecondary }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer — glass */}
      <footer style={s.footer} className="glass-nav">
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
