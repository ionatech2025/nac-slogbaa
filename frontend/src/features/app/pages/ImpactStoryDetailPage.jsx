import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'

const STORY_DETAIL_CSS = `
  .slg-story-detail { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; line-height: 1.8; }
  .slg-serif { font-family: 'DM Serif Display', serif; }

  /* Hero Section */
  .slg-story-hero {
    position: relative; padding: 7rem 2rem 5rem; text-align: center;
    background: var(--bg-2); border-bottom: 1px solid var(--border);
  }
  .slg-story-eyebrow {
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;
    color: var(--orange); margin-bottom: 2rem; display: block;
  }
  .slg-story-h1 {
    font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 300; line-height: 1.1;
    letter-spacing: -0.04em; color: var(--text); margin: 0 auto 3rem; max-width: 1000px;
  }
  
  .slg-story-meta-row {
    display: flex; justify-content: center; gap: 4rem;
    max-width: 1000px; margin: 0 auto; padding-top: 2.5rem; border-top: 1px solid var(--border);
  }
  .slg-story-meta-item { text-align: left; }
  .slg-meta-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: var(--text-3); margin-bottom: 0.5rem; display: block; }
  .slg-meta-value { font-size: 1rem; font-weight: 500; color: var(--text); }

  /* Layout */
  .slg-magazine-layout {
    max-width: 1100px; margin: 0 auto; padding: 6rem 2rem;
    display: grid; grid-template-columns: 2fr 1fr; gap: 6rem;
  }
  @media (max-width: 960px) { .slg-magazine-layout { grid-template-columns: 1fr; gap: 4rem; } }

  .slg-editorial-img {
    width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 4rem;
    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.2);
  }
  .slg-editorial-img img { width: 100%; height: auto; display: block; filter: contrast(1.02); }

  /* Text elements */
  .slg-dropcap::first-letter {
    float: left; font-family: 'DM Serif Display', serif; font-size: 6rem;
    line-height: 0.85; padding-top: 6px; padding-right: 15px; color: var(--orange);
  }
  
  .slg-article-lead { font-size: 1.375rem; font-weight: 300; color: var(--text); margin-bottom: 3rem; line-height: 1.6; }
  .slg-article-p { font-size: 1.125rem; color: var(--text-2); margin-bottom: 2rem; }
  .slg-article-h2 { font-size: 2.25rem; font-weight: 300; margin: 4rem 0 1.5rem; color: var(--text); letter-spacing: -0.02em; }
  
  .slg-pullquote {
    position: relative; margin: 5rem -3rem; padding: 0 3rem;
    border-left: 3px solid var(--orange);
  }
  @media (max-width: 960px) { .slg-pullquote { margin: 4rem 0; } }
  .slg-quote-text {
    font-family: 'DM Serif Display', serif; font-size: 2.25rem; font-style: italic;
    color: var(--text); line-height: 1.25; margin-bottom: 1.5rem;
  }
  .slg-quote-cite { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; color: var(--orange); letter-spacing: 0.1em; }

  /* Sidebar */
  .slg-story-sidebar { position: sticky; top: 120px; align-self: start; }
  .slg-sidebar-card {
    padding: 3rem; background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px;
    margin-bottom: 2.5rem;
  }
  .slg-sidebar-h3 { font-family: 'DM Serif Display', serif; font-size: 1.75rem; margin-bottom: 2rem; color: var(--text); }
  .slg-sidebar-fact { border-bottom: 1px solid var(--border); padding: 1.25rem 0; }
  .slg-sidebar-fact:last-child { border: none; }
  
  .slg-cta-card {
    padding: 3rem; background: var(--orange); color: #fff; border-radius: 12px;
    text-align: center; transition: transform 0.3s;
  }
  .slg-cta-card:hover { transform: translateY(-5px); }
  .slg-cta-h3 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; margin-bottom: 1rem; color: #fff; }
`

const STORIES_DATA = {
  'sarah-namuli': {
    eyebrow: 'Impact Story — Kampala',
    title: 'Leading Accountability from the Frontline',
    name: 'Sarah Namuli',
    location: 'Makindye Division, Kampala',
    role: 'Community Development Officer',
    region: 'Central Uganda',
    image: '/sarah_namuli_story_1776248245640.png',
    lead: 'In the bustling heart of Makindye, Sarah Namuli is proving that digital transparency can bridge the gap between policy and people.',
    content: [
      { type: 'p', value: 'Sarah’s journey with SLOGBAA began when she realized that traditional reporting methods were failing to capture the real needs of her community. "We were drowning in paperwork but starving for actual data," she recalls.' },
      { type: 'h2', value: 'The Power of Real-Time Monitoring' },
      { type: 'p', value: 'Through the SLOGBAA modules on Digital Compliance and Community-Led Governance, Sarah learned how to utilize mobile-first tools to track municipal service delivery. Within months, she was coordinating a team of 15 youth observers who mapped local infrastructure gaps electronically.' },
      { type: 'quote', text: 'SLOGBAA didn’t just give me a certificate; it gave me a lens through which I could see my community’s potential for radical transparency.', author: 'Sarah Namuli' },
      { type: 'p', value: 'Today, Sarah serves as a lead mentor for other women in the district, demonstrating how civic knowledge is the ultimate tool for local transformation.' }
    ],
    stats: [
      { label: 'Project Impact', value: '1,200+ Households' },
      { label: 'Courses Completed', value: '6 Modules' },
      { label: 'Certification', value: 'Elite Level' }
    ]
  },
  'james-okello': {
    eyebrow: 'Impact Story — Northern region',
    title: 'Digital Literacy for Local Governance',
    name: 'James Okello',
    location: 'Gulu City',
    role: 'Civil Society Advocate',
    region: 'Northern Uganda',
    image: '/james_okello_story_1776248275273.png',
    lead: 'James Okello is redefining what advocacy looks like in a digital age, moving from protests to data-driven policy engagement.',
    content: [
      { type: 'p', value: 'James spent years advocating for better health services in Gulu, but often hit a wall due to a lack of technical transparency. "I had the passion, but I didn’t have the platform," James explains.' },
      { type: 'h2', value: 'From Activism to Analytical Advocacy' },
      { type: 'p', value: 'By enrolling in the SLOGBAA Certificate in Civic Oversight, James mastered the art of budget tracking and social auditing. He now uses the platform’s resources to train local leaders on how to use government open-data portals.' },
      { type: 'quote', text: 'When you approach a leader with data instead of just demands, the conversation changes instantly. SLOGBAA taught me that language.', author: 'James Okello' },
      { type: 'p', value: 'His work has directly influenced the reallocation of district funds toward frontline clinic improvements in two sub-counties.' }
    ],
    stats: [
      { label: 'Districts Reached', value: '4 Districts' },
      { label: 'Workshops Led', value: '24+ Sessions' },
      { label: 'Outcome', value: 'Policy Influence' }
    ]
  }
}

export function ImpactStoryDetailPage() {
  const { id } = useParams()
  const { theme } = useTheme()
  const story = STORIES_DATA[id] || STORIES_DATA['sarah-namuli']

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className={`slg-page slg-story-detail ${theme}-theme`}>
      <style>{STORY_DETAIL_CSS}</style>
      <Navbar />

      <header className="slg-story-hero">
        <span className="slg-story-eyebrow">{story.eyebrow}</span>
        <h1 className="slg-story-h1 slg-serif">{story.title}</h1>

        <div className="slg-story-meta-row">
          <div className="slg-story-meta-item">
            <span className="slg-meta-label">Author / Subject</span>
            <span className="slg-meta-value">{story.name}</span>
          </div>
          <div className="slg-story-meta-item">
            <span className="slg-meta-label">Location</span>
            <span className="slg-meta-value">{story.location}</span>
          </div>
          <div className="slg-story-meta-item">
            <span className="slg-meta-label">District Role</span>
            <span className="slg-meta-value">{story.role}</span>
          </div>
        </div>
      </header>

      <div className="slg-magazine-layout">
        <article>
          <div className="slg-editorial-img">
            <img src={story.image} alt={story.name} />
          </div>

          <div className="slg-article-lead slg-dropcap">
            {story.lead}
          </div>

          {story.content.map((item, idx) => {
            if (item.type === 'h2') return <h2 key={idx} className="slg-article-h2 slg-serif">{item.value}</h2>
            if (item.type === 'p') return <p key={idx} className="slg-article-p">{item.value}</p>
            if (item.type === 'quote') return (
              <blockquote key={idx} className="slg-pullquote">
                <p className="slg-quote-text">{item.text}</p>
                <cite className="slg-quote-cite">/ {item.author}</cite>
              </blockquote>
            )
            return null
          })}
        </article>

        <aside className="slg-story-sidebar">
          <div className="slg-sidebar-card">
            <h3 className="slg-sidebar-h3">Story Highlights</h3>
            {story.stats.map(s => (
              <div key={s.label} className="slg-sidebar-fact">
                <span className="slg-meta-label">{s.label}</span>
                <span className="slg-meta-value">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="slg-cta-card">
            <h3 className="slg-cta-h3">Inspired?</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '2rem', opacity: 0.9 }}>
              Join Sarah, James, and thousands of others in the journey toward a more accountable Uganda.
            </p>
            <Link to="/auth/register" style={{ color: '#fff', fontWeight: 800, textDecoration: 'none', borderBottom: '2px solid #fff', paddingBottom: '4px' }}>
              Register Today
            </Link>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to="/stories" className="slg-link-more" style={{ justifyContent: 'center' }}>
              <Icon icon={icons.arrowRight} size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all stories
            </Link>
          </div>
        </aside>
      </div>

      <CtaSection />
    </div>
  )
}
