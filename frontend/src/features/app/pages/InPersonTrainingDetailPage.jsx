import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'

/* ─── Page Specific CSS ──────────────────────────────────────────────────── */
const DETAIL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  .slg-detail { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; line-height: 1.6; }
  .slg-serif { font-family: 'DM Serif Display', serif; }

  /* Hero Section - Magazine Style */
  .slg-detail-hero {
    position: relative; padding: 6rem 2rem 4rem; text-align: center;
    background: var(--bg-2); border-bottom: 1px solid var(--border);
  }
  .slg-detail-eyebrow {
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;
    color: var(--orange); margin-bottom: 1.5rem; display: block;
  }
  .slg-detail-title {
    font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 300; line-height: 1;
    letter-spacing: -0.04em; color: var(--text); margin: 0 auto 2.5rem; max-width: 900px;
  }
  
  .slg-detail-meta-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;
    max-width: 1000px; margin: 3rem auto 0; padding-top: 2rem; border-top: 1px solid var(--border);
  }
  .slg-meta-box { text-align: left; }
  .slg-meta-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: var(--text-3); margin-bottom: 0.5rem; display: block; }
  .slg-meta-value { font-size: 0.9375rem; font-weight: 500; color: var(--text); }

  /* Magazine Content Layout */
  .slg-magazine-layout {
    max-width: 1100px; margin: 0 auto; padding: 5rem 2rem;
    display: grid; grid-template-columns: 1.8fr 1fr; gap: 5rem;
  }
  @media (max-width: 900px) { .slg-magazine-layout { grid-template-columns: 1fr; gap: 3rem; } }

  /* Visual Element */
  .slg-editorial-image {
    width: 100%; border-radius: 4px; overflow: hidden; margin-bottom: 3rem;
    box-shadow: 0 30px 60px -12px rgba(0,0,0,0.15);
  }
  .slg-editorial-image img { width: 100%; height: auto; display: block; filter: contrast(1.05); }

  /* Text Styling */
  .slg-drop-cap::first-letter {
    float: left; font-family: 'DM Serif Display', serif; font-size: 5.5rem;
    line-height: 0.8; padding-top: 4px; padding-right: 12px; color: var(--orange);
  }
  
  .slg-article-p { font-size: 1.125rem; color: var(--text-2); margin-bottom: 2rem; line-height: 1.8; }
  .slg-article-h2 { font-size: 2rem; font-weight: 300; margin: 3.5rem 0 1.5rem; color: var(--text); letter-spacing: -0.02em; }
  
  .slg-pull-quote {
    position: relative; margin: 4rem 0; padding: 0 3rem;
    border-left: 2px solid var(--orange);
  }
  .slg-quote-text {
    font-family: 'DM Serif Display', serif; font-size: 1.875rem; font-style: italic;
    color: var(--text); line-height: 1.3; margin-bottom: 1rem;
  }
  .slg-quote-author { font-size: 0.875rem; font-weight: 700; text-transform: uppercase; color: var(--orange); letter-spacing: 0.05em; }

  /* Sidebar Editorial */
  .slg-editorial-sidebar { position: sticky; top: 100px; align-self: start; }
  .slg-sidebar-card {
    padding: 2.5rem; background: var(--bg-2); border: 1px solid var(--border); border-radius: 4px;
    margin-bottom: 2rem;
  }
  .slg-sidebar-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--text); }
  .slg-sidebar-list { list-style: none; padding: 0; }
  .slg-sidebar-item { border-bottom: 1px solid var(--border); padding: 1rem 0; font-size: 0.875rem; }
  .slg-sidebar-item:last-child { border: none; }
  
`

/* ─── Mock Data ───────────────────────────────────────────────────────────── */
const TRAINING_DATA = {
  'parish-development-model-monitoring': {
    eyebrow: 'Specialized Workshop',
    title: 'The Parish Development Model Monitoring',
    date: 'Monday, June 10, 2024',
    location: 'Regional Centers (Central & Eastern)',
    facilitators: ['Dr. Okello Samuel', 'Hon. Jane Namuli'],
    tags: ['Governance', 'Accountability', 'Grassroots'],
    image: '/assets/images/homepage/banner_IMG.jpg',
    intro: 'The Parish Development Model (PDM) stands as the cornerstone of Uganda’s current community development strategy. This intensive monitoring workshop was designed to equip local leaders and civil society members with the analytical tools needed to track progress and ensure transparency.',
    content: [
      {
        type: 'h2',
        value: 'Understanding the Seven Pillars'
      },
      {
        type: 'p',
        value: 'The workshop began with a deep dive into the seven pillars of the PDM. Participants engaged in rigorous discussions regarding production, storage, processing, and marketing — ensuring that the grassroots levels understand the economic drivers behind the initiative.'
      },
      {
        type: 'quote',
        text: 'Transparency isn’t just a policy requirement; it is the fundamental bridge that connects community trust to national development.',
        author: 'Dr. Okello Samuel'
      },
      {
        type: 'p',
        value: 'A significant portion of the session was dedicated to the "Accountability Framework." We introduced a standardized reporting tool that allows community observers to log progress in real-time, bridging the gap between national policy and local execution.'
      },
      {
        type: 'h2',
        value: 'Measuring Success at the Parish Level'
      },
      {
        type: 'p',
        value: 'By focusing on data-driven monitoring, the workshop empowered attendees to look beyond anecdotal evidence. We analyzed actual allocation metrics and discussed how to mitigate local bottlenecks that often hinder large-scale government programs.'
      }
    ]
  }
}

export function InPersonTrainingDetailPage() {
  const { slug } = useParams()
  const { theme } = useTheme()
  const data = TRAINING_DATA[slug] || TRAINING_DATA['parish-development-model-monitoring']

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`slg-page slg-detail ${theme}-theme`}>
      <style>{DETAIL_CSS}</style>

      {/* Shared Nav */}
      <Navbar />

      <header className="slg-detail-hero">
        <span className="slg-detail-eyebrow">{data.eyebrow}</span>
        <h1 className="slg-detail-title slg-serif">{data.title}</h1>

        <div className="slg-detail-meta-grid">
          <div className="slg-meta-box">
            <span className="slg-meta-label">Date & Time</span>
            <span className="slg-meta-value">{data.date}</span>
          </div>
          <div className="slg-meta-box">
            <span className="slg-meta-label">Location</span>
            <span className="slg-meta-value">{data.location}</span>
          </div>
          <div className="slg-meta-box">
            <span className="slg-meta-label">Lead Facilitators</span>
            <span className="slg-meta-value">{data.facilitators.join(', ')}</span>
          </div>
          <div className="slg-meta-box">
            <span className="slg-meta-label">Focus Areas</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              {data.tags.map(t => (
                <span key={t} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', border: '1px solid var(--border)', borderRadius: '4px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="slg-magazine-layout">
        <article>
          <div className="slg-editorial-image">
            <img src={data.image} alt={data.title} />
          </div>

          <p className="slg-article-p slg-drop-cap">
            {data.intro}
          </p>

          {data.content.map((item, idx) => {
            if (item.type === 'h2') return <h2 key={idx} className="slg-article-h2 slg-serif">{item.value}</h2>
            if (item.type === 'p') return <p key={idx} className="slg-article-p">{item.value}</p>
            if (item.type === 'quote') return (
              <blockquote key={idx} className="slg-pull-quote">
                <p className="slg-quote-text">{item.text}</p>
                <cite className="slg-quote-author">/ {item.author}</cite>
              </blockquote>
            )
            return null
          })}
        </article>

        <aside className="slg-editorial-sidebar">
          <div className="slg-sidebar-card">
            <h3 className="slg-sidebar-title">Workshop Logistics</h3>
            <ul className="slg-sidebar-list">
              <li className="slg-sidebar-item">
                <span className="slg-meta-label">Duration</span>
                <span className="slg-meta-value">6 Hours (Intensive)</span>
              </li>
              <li className="slg-sidebar-item">
                <span className="slg-meta-label">Materials Provided</span>
                <span className="slg-meta-value">Digital Toolkit, Printed Syllabus</span>
              </li>
            </ul>
          </div>

          <div className="slg-sidebar-card" style={{ border: 'none', background: 'var(--orange)', color: '#fff' }}>
            <h3 className="slg-sidebar-title" style={{ color: '#fff' }}>Get in Touch</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.9 }}>
              Interested in organizing a similar workshop for your district? Contact our field coordination team.
            </p>
            <Link to="/inquiries" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #fff' }}>
              Inquire Now
            </Link>
          </div>
        </aside>
      </div>



      <CtaSection />
    </div>
  )
}
