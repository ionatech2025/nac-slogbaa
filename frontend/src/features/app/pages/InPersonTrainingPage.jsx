import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'
import { getHomepageContent } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

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
  
  .slg-section { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }

  .slg-training-hero {
    position: relative; padding: 3rem 2rem 5rem; text-align: center; overflow: hidden;
    background: var(--bg-2); border-bottom: 1px solid var(--border);
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
    margin-bottom: 1.5rem;
  }

  .slg-section-title { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 300; line-height: 1.1; margin: 0 0 1.5rem; letter-spacing: -0.02em; }
  .slg-section-title em { font-style: normal; color: var(--orange); font-family: 'DM Serif Display', serif; }

  .slg-training-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2.5rem; }
  
  .slg-training-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-training-card:hover { border-color: var(--orange-glow); transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }

  .slg-card-img-wrap { position: relative; aspect-ratio: 16/9; overflow: hidden; background: var(--bg-3); }
  .slg-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .slg-training-card:hover .slg-card-img-wrap img { transform: scale(1.05); }

  .slg-card-badge {
    position: absolute; top: 1rem; right: 1rem; padding: 0.35rem 0.75rem; border-radius: 8px;
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); z-index: 2;
  }
  .slg-badge-upcoming { background: rgba(5, 150, 105, 0.85); color: #fff; }
  .slg-badge-past { background: rgba(82, 82, 91, 0.85); color: #fff; }

  .slg-card-body { padding: 2rem; flex-grow: 1; display: flex; flex-direction: column; }
  .slg-card-tag {
    display: inline-block; padding: 0.25rem 0.75rem; border-radius: 6px;
    font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--orange); background: var(--orange-dim); margin-bottom: 1rem;
    align-self: flex-start;
  }
  .slg-card-title { font-size: 1.25rem; font-weight: 600; line-height: 1.4; color: var(--text); margin-bottom: 1rem; }
  .slg-card-title a { color: inherit; text-decoration: none; }
  .slg-card-title a:hover { color: var(--orange); }

  .slg-card-excerpt { font-size: 0.9375rem; color: var(--text-2); line-height: 1.6; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  
  .slg-card-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .slg-card-date { font-size: 0.8125rem; color: var(--text-3); font-weight: 500; display: flex; align-items: center; gap: 0.4rem; }

  .slg-link-more {
    display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; font-weight: 700;
    color: var(--orange); text-decoration: none; transition: gap 0.2s;
  }
  .slg-link-more:hover { gap: 0.6rem; }
`

export function InPersonTrainingPage() {
  const { theme } = useTheme()
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [pastPage, setPastPage] = useState(1)
  const [selectedTraining, setSelectedTraining] = useState(null)
  const itemsPerPage = 6

  const { data: cms, isLoading } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: getHomepageContent,
    staleTime: 60_000,
  })

  // Set up scrolled state if needed, though not used in simplified design
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const allTrainings = useMemo(() => {
    if (cms?.trainings?.length) return cms.trainings
    return ALL_TRAININGS
  }, [cms])

  const upcomingAll = useMemo(() => {
    return allTrainings.filter(t => {
      if (t.status) return t.status === 'upcoming'
      return new Date(t.eventDate) > new Date()
    })
  }, [allTrainings])

  const pastAll = useMemo(() => {
    return allTrainings.filter(t => {
      if (t.status) return t.status === 'past'
      return new Date(t.eventDate) <= new Date()
    })
  }, [allTrainings])

  if (isLoading) return <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>Loading training data...</div>

  const upcomingTotalPages = Math.ceil(upcomingAll.length / itemsPerPage)
  const pastTotalPages = Math.ceil(pastAll.length / itemsPerPage)

  const upcoming = upcomingAll.slice((upcomingPage - 1) * itemsPerPage, upcomingPage * itemsPerPage)
  const past = pastAll.slice((pastPage - 1) * itemsPerPage, pastPage * itemsPerPage)

  return (
    <div className={`slg-page ${theme}-theme`}>
      <style>{PAGE_CSS}</style>
      <Navbar />

      <header className="slg-training-hero">
        <div className="slg-hero-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="slg-eyebrow">Interactive Workshops</span>
          <h1 className="slg-section-title">
            In-Person <em>Learning</em>
          </h1>
          <p className="slg-section-desc" style={{ maxWidth: 600, margin: '0 auto' }}>
            Bridging the digital divide through localized, intense training sessions across all districts of Uganda.
          </p>
        </div>
      </header>

      <main className="slg-section">
        {upcoming.length > 0 && (
          <section style={{ marginBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 className="slg-section-title" style={{ fontSize: '2rem' }}>Upcoming <em>Sessions</em></h2>
            </div>
            <div className="slg-training-grid">
              {upcoming.map(t => (
                <TrainingCard
                  key={t.id}
                  training={t}
                  isUpcoming
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
            <h2 className="slg-section-title" style={{ fontSize: '2rem' }}>Past <em>Highlights</em></h2>
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
              <img src={selectedTraining.imageUrl || selectedTraining.image} alt={selectedTraining.title} className="slg-modal-img" />
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="slg-eyebrow" style={{ marginBottom: '1rem' }}>Upcoming Opportunity</span>
                <h2 className="slg-section-title" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{selectedTraining.title}</h2>
              </div>

              <div className="slg-meta-row" style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-2)', borderRadius: '12px', display: 'flex', gap: '1.5rem' }}>
                <div className="slg-card-date">
                  <Icon icon={icons.calendar} size={16} />
                  <span>{selectedTraining.date || new Date(selectedTraining.eventDate).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="slg-card-excerpt" style={{ fontSize: '1rem', marginBottom: '2.5rem', display: 'block' }}>
                {selectedTraining.summary || selectedTraining.excerpt}
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

      <CtaSection />
      <Footer />
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

function TrainingCard({ training, isUpcoming }) {
  const displayDate = typeof training.date === 'string' ? training.date.split(' - ')[0] : new Date(training.eventDate).toLocaleDateString()
  const slug = training.slug || (training.title && training.title.toLowerCase().replace(/\s+/g, '-'))

  return (
    <article className="slg-training-card">
      <div className="slg-card-img-wrap">
        <img src={training.imageUrl || training.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop'} alt={training.title} loading="lazy" />
        <span className={`slg-card-badge ${isUpcoming ? 'slg-badge-upcoming' : 'slg-badge-past'}`}>
          {isUpcoming ? 'Upcoming' : 'Past Event'}
        </span>
      </div>
      <div className="slg-card-body">
        <span className="slg-card-tag">{training.tag || training.eyebrow || (isUpcoming ? 'Workshop' : 'Recap')}</span>
        <h3 className="slg-card-title">
          <Link to={`/inperson-training/${slug}`}>{training.title}</Link>
        </h3>

        <p className="slg-card-excerpt">{training.summary || training.excerpt}</p>

        <div className="slg-card-footer">
          <div className="slg-card-date">
            <Icon icon={icons.calendar} size={14} />
            {displayDate}
          </div>
          <Link to={`/inperson-training/${slug}`} className="slg-link-more">
            See Details <Icon icon={icons.arrowRight} size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}
