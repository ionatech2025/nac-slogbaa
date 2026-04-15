import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

/* ─── Static Data (Will be CMS-driven) ─────────────────────────────────────── */
const ALL_TRAININGS = [
  {
    id: '1',
    title: 'Three (3) Green Democratic Spaces in Yumbe, Mayuge, and Kampala',
    date: 'Monday, July 1, 2024 - 00:00',
    location: 'Yumbe, Mayuge, Kampala',
    image: '/assets/images/homepage/banner_IMG.jpg',
    excerpt: 'Collaborative spaces for environmental advocacy and democratic engagement.',
    slug: 'three-green-democratic-spaces',
    status: 'past'
  },
  {
    id: '2',
    title: 'The Parish Development Model Monitoring',
    date: 'Monday, June 10, 2024 - 00:00',
    location: 'Regional Centers',
    image: '/assets/images/homepage/banner_IMG.jpg',
    excerpt: 'Detailed monitoring and evaluation of the PDM implementation.',
    slug: 'parish-development-model-monitoring',
    status: 'past'
  },
  {
    id: '3',
    title: 'The Civil Society Strengthening Academy (CSSA)',
    date: 'Tuesday, June 4, 2024 - 00:00',
    location: 'NAC Headquarters',
    image: '/assets/images/homepage/banner_IMG.jpg',
    excerpt: 'Empowering CSOs with leadership and advocacy skills.',
    slug: 'civil-society-strengthening-academy',
    status: 'past'
  },
  {
    id: '4',
    title: 'Upcoming: Accountability & Leadership Workshop',
    date: 'Wednesday, August 15, 2024 - 09:00',
    location: 'Fort Portal City',
    image: '/assets/images/homepage/banner_IMG.jpg',
    excerpt: 'Join us for a regional workshop on accountability at the local level.',
    slug: 'accountability-leadership-workshop',
    status: 'upcoming'
  }
]

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  :root {
    --orange: #F58220;
    --orange-dim: rgba(245,130,32,0.06);
    --orange-glow: rgba(245,130,32,0.15);
    --green: #059669;
    --purple: #7c3aed;
  }

  .slg-page.light-theme {
    --bg: #ffffff;
    --bg-2: #fcfcfd;
    --bg-3: #f9fafb;
    --surface: #ffffff;
    --surface-2: #f3f4f6;
    --border: rgba(0,0,0,0.06);
    --border-hover: rgba(0,0,0,0.12);
    --text: #09090b;
    --text-2: #52525b;
    --text-3: #71717a;
    --nav-bg: rgba(255,255,255,0.85);
  }

  .slg-page.dark-theme {
    --bg: #09090b;
    --bg-2: #111115;
    --bg-3: #18181e;
    --surface: #1e1e26;
    --surface-2: #26262f;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.14);
    --text: #f4f4f5;
    --text-2: #a1a1aa;
    --text-3: #52525b;
    --nav-bg: rgba(9,9,11,0.85);
  }

  .slg-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; scroll-behavior: smooth; }
  .slg-serif { font-family: 'DM Serif Display', serif; }
  
  .slg-nav {
    position: sticky; top: 0; z-index: 200; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; background: var(--nav-bg); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }

  .slg-section { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }

  .slg-training-hero {
    position: relative; padding: 6rem 2rem 5rem; text-align: center; overflow: hidden;
    background: radial-gradient(circle at 15% 50%, var(--orange-dim) 0%, transparent 40%);
  }
  .slg-hero-grid {
    position: absolute; inset: 0; opacity: 0.03; z-index: 0;
    background-image: linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  .slg-eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem; text-transform: uppercase;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: var(--orange);
    background: var(--orange-dim); padding: 0.4rem 0.8rem; border-radius: 99px; border: 1px solid rgba(245,130,32,0.2);
  }

  .slg-section-title { font-size: 2.75rem; font-weight: 300; line-height: 1.1; margin: 1.5rem 0; letter-spacing: -0.02em; }
  .slg-section-title em { font-style: normal; color: var(--orange); font-family: 'DM Serif Display', serif; }

  .slg-training-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2.5rem; }
  
  .slg-training-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slg-training-card:hover { transform: translateY(-8px); border-color: var(--orange); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

  .slg-card-img-wrap { position: relative; aspect-ratio: 16/10; overflow: hidden; }
  .slg-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .slg-training-card:hover .slg-card-img-wrap img { transform: scale(1.08); }

  .slg-card-badge {
    position: absolute; top: 1rem; right: 1rem; padding: 0.35rem 0.75rem; border-radius: 8px;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2);
  }
  .slg-badge-upcoming { background: rgba(5, 150, 105, 0.85); color: #fff; }
  .slg-badge-past { background: rgba(82, 82, 91, 0.85); color: #fff; }

  .slg-card-body { padding: 1.75rem; flex-grow: 1; display: flex; flex-direction: column; }
  .slg-card-title { font-size: 1.125rem; font-weight: 700; line-height: 1.4; margin-bottom: 0.75rem; }
  .slg-card-title a { color: var(--text); text-decoration: none; transition: color 0.2s; }
  .slg-card-title a:hover { color: var(--orange); }

  .slg-meta-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; font-size: 0.8125rem; color: var(--text-2); }
  .slg-meta-item { display: flex; align-items: center; gap: 0.4rem; }
  
  .slg-card-excerpt { font-size: 0.875rem; color: var(--text-2); line-height: 1.6; margin-bottom: 2rem; }
  
  .slg-link-more {
    display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; font-weight: 700;
    color: var(--orange); text-decoration: none; transition: gap 0.2s;
  }
  .slg-link-more:hover { gap: 0.6rem; }

  .slg-theme-toggle {
    width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--bg-2); color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .slg-theme-toggle:hover { background: var(--surface-2); color: var(--text); border-color: var(--border-hover); }

  .slg-btn-ghost {
    padding: 0.5rem 1rem; border-radius: 10px; border: 1px solid var(--border);
    font-size: 0.8125rem; font-weight: 600; color: var(--text); text-decoration: none;
    transition: all 0.2s;
  }
  .slg-btn-ghost:hover { background: var(--surface-2); border-color: var(--border-hover); }

  .slg-footer { border-top: 1px solid var(--border); padding: 3rem 2rem; text-align: center; }
  .slg-copyright { font-size: 0.8125rem; color: var(--text-3); }

  /* Pagination */
  .slg-pagination {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 4rem;
  }
  .slg-page-btn {
    width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface); color: var(--text-2); font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
  }
  .slg-page-btn:hover:not(:disabled) { border-color: var(--orange); color: var(--orange); background: var(--orange-dim); }
  .slg-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .slg-page-btn.active { background: var(--orange); color: #fff; border-color: var(--orange); }

  /* Modal */
  .slg-modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; animation: slg-fade-in 0.2s ease;
  }
  .slg-modal {
    background: var(--bg); border: 1px solid var(--border); border-radius: 24px;
    max-width: 580px; width: 100%; position: relative;
    box-shadow: 0 40px 100px rgba(0,0,0,0.2);
    animation: slg-scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .slg-modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem;
    width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border);
    background: var(--bg-2); color: var(--text-2); cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .slg-modal-close:hover { background: var(--surface-2); color: var(--text); border-color: var(--border-hover); }
  
  .slg-modal-body { padding: 2.5rem; }
  .slg-modal-img { width: 100%; aspect-ratio: 16/9; border-radius: 16px; object-fit: cover; margin-bottom: 2rem; }
  
  @keyframes slg-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slg-scale-up { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
`

export function InPersonTrainingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('light')
  
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [pastPage, setPastPage] = useState(1)
  const [selectedTraining, setSelectedTraining] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const upcomingAll = ALL_TRAININGS.filter(t => t.status === 'upcoming')
  const pastAll = ALL_TRAININGS.filter(t => t.status === 'past')

  const upcomingTotalPages = Math.ceil(upcomingAll.length / itemsPerPage)
  const pastTotalPages = Math.ceil(pastAll.length / itemsPerPage)

  const upcoming = upcomingAll.slice((upcomingPage - 1) * itemsPerPage, upcomingPage * itemsPerPage)
  const past = pastAll.slice((pastPage - 1) * itemsPerPage, pastPage * itemsPerPage)

  return (
    <div className={`slg-page ${theme}-theme`}>
      <style>{PAGE_CSS}</style>

      {/* Modern Nav */}
      <nav className="slg-nav">
        <Link to="/" className="slg-logo-wrap" title="Back to home">
          <Logo variant="full" size={28} color={theme === 'dark' ? 'white' : 'dark'} />
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/inperson-training" className="slg-nav-link" style={{ marginLeft: '1rem' }}>Trainings</Link>
          <Link to="/inquiries" className="slg-nav-link">Inquiries</Link>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="slg-theme-toggle"
            title="Toggle theme"
          >
            <Icon icon={theme === 'dark' ? icons.sun : icons.moon} size={16} />
          </button>
          <Link to="/" className="slg-btn-ghost">Back to Home</Link>
        </div>
      </nav>

      <header className="slg-training-hero">
        <div className="slg-hero-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="slg-eyebrow">Interactive Training</span>
          <h1 className="slg-section-title slg-serif">
            In-Person <em>Workshops</em>
          </h1>
          <p className="slg-section-desc" style={{ maxWidth: 660, margin: '0 auto', fontSize: '1.125rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            Bridging the digital divide through localized, intense training sessions across all districts of Uganda.
          </p>
        </div>
      </header>

      <main className="slg-section" style={{ paddingTop: 0 }}>
        {upcoming.length > 0 && (
          <section style={{ marginBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 className="slg-section-title" style={{ fontSize: '1.75rem' }}>Upcoming <em>Sessions</em></h2>
            </div>
            <div className="slg-training-grid">
              {upcoming.map(t => (
                <TrainingCard 
                  key={t.id} 
                  training={t} 
                  isUpcoming 
                  onViewDetails={() => setSelectedTraining(t)}
                />
              ))}
            </div>
            {upcomingTotalPages > 1 && (
              <Pagination 
                current={upcomingPage} 
                total={upcomingTotalPages} 
                onChange={(p) => { setUpcomingPage(p); window.scrollTo(0, 0); }} 
              />
            )}
          </section>
        )}

        <section>
          <div style={{ marginBottom: '3rem' }}>
            <h2 className="slg-section-title" style={{ fontSize: '1.75rem' }}>Past <em>Highlights</em></h2>
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Archives of our previous regional training workshops.</p>
          </div>
          <div className="slg-training-grid">
            {past.map(t => (
              <TrainingCard key={t.id} training={t} />
            ))}
          </div>
          {pastTotalPages > 1 && (
            <Pagination 
              current={pastPage} 
              total={pastTotalPages} 
              onChange={(p) => { setPastPage(p); window.scrollTo(0, 400); }} 
            />
          )}
        </section>
      </main>

      {/* Modal */}
      {selectedTraining && (
        <div className="slg-modal-overlay" onClick={() => setSelectedTraining(null)}>
          <div className="slg-modal" onClick={e => e.stopPropagation()}>
            <button className="slg-modal-close" onClick={() => setSelectedTraining(null)}>
              <Icon icon={icons.x || icons.arrowRight} size={18} />
            </button>
            <div className="slg-modal-body">
              <img src={selectedTraining.image} alt={selectedTraining.title} className="slg-modal-img" />
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="slg-eyebrow" style={{ marginBottom: '1rem' }}>Upcoming Opportunity</span>
                <h2 className="slg-section-title" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{selectedTraining.title}</h2>
              </div>
              
              <div className="slg-meta-row" style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-2)', borderRadius: '12px' }}>
                <div className="slg-meta-item">
                  <Icon icon={icons.calendar} size={16} />
                  <span>{selectedTraining.date}</span>
                </div>
                <div className="slg-meta-item">
                  <Icon icon={icons.mapPin} size={16} />
                  <span>{selectedTraining.location}</span>
                </div>
              </div>

              <p className="slg-card-excerpt" style={{ fontSize: '1rem', marginBottom: '2.5rem' }}>
                {selectedTraining.excerpt} This intensive regional workshop focuses on localized implementation and citizen oversight strategies.
              </p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/auth/register" className="slg-btn-orange" style={{ padding: '0.75rem 2rem', fontSize: '1rem', width: '100%', textAlign: 'center' }}>
                  Register for this Slot
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Footer */}
      <footer className="slg-footer" style={{ marginTop: 'auto' }}>
        <div className="slg-footer-bottom" style={{ margin: 0, border: 'none' }}>
          <p className="slg-copyright">&copy; {new Date().getFullYear()} NAC. All rights reserved.</p>
          <Logo variant="icon" size={24} />
        </div>
      </footer>
    </div>
  )
}

function Pagination({ current, total, onChange }) {
  return (
    <div className="slg-pagination">
      <button 
        className="slg-page-btn" 
        disabled={current === 1} 
        onClick={() => onChange(current - 1)}
        aria-label="Previous page"
      >
        <Icon icon={icons.chevronLeft || icons.arrowRight} style={{ transform: 'rotate(180deg)' }} />
      </button>
      
      {[...Array(total)].map((_, i) => (
        <button 
          key={i} 
          className={`slg-page-btn ${current === i + 1 ? 'active' : ''}`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button 
        className="slg-page-btn" 
        disabled={current === total} 
        onClick={() => onChange(current + 1)}
        aria-label="Next page"
      >
        <Icon icon={icons.chevronRight || icons.arrowRight} />
      </button>
    </div>
  )
}

function TrainingCard({ training, isUpcoming, onViewDetails }) {
  return (
    <div className="slg-training-card">
      <div className="slg-card-img-wrap">
        <img src={training.image} alt={training.title} loading="lazy" />
        <span className={`slg-card-badge ${isUpcoming ? 'slg-badge-upcoming' : 'slg-badge-past'}`}>
          {isUpcoming ? 'Upcoming' : 'Past Event'}
        </span>
      </div>
      <div className="slg-card-body">
        <h3 className="slg-card-title">
          {isUpcoming ? (
            <button 
              onClick={onViewDetails}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span className="slg-card-title">{training.title}</span>
            </button>
          ) : (
            <Link to={`/inperson-training/${training.slug}`}>{training.title}</Link>
          )}
        </h3>
        
        <div className="slg-meta-row">
          <div className="slg-meta-item">
            <Icon icon={icons.calendar} size={14} />
            <span>{training.date.split(' - ')[0]}</span>
          </div>
          <div className="slg-meta-item">
            <Icon icon={icons.mapPin} size={14} />
            <span>{training.location}</span>
          </div>
        </div>

        <p className="slg-card-excerpt">{training.excerpt}</p>

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          {isUpcoming ? (
            <button 
              onClick={onViewDetails} 
              className="slg-link-more"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              View Details <Icon icon={icons.arrowRight} size={14} />
            </button>
          ) : (
            <Link to={`/inperson-training/${training.slug}`} className="slg-link-more">
              View Full Recap <Icon icon={icons.arrowRight} size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
