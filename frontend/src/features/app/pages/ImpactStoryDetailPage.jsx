import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'
import { getHomepageContent } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

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
    font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 300; line-height: 1.1;
    letter-spacing: -0.04em; color: var(--text); margin: 0 auto 3rem; max-width: 1000px;
  }
  
  .slg-story-meta-row {
    display: flex; justify-content: center; gap: 4rem;
    max-width: 1000px; margin: 0 auto; padding-top: 2.5rem; border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .slg-story-meta-item { text-align: left; }
  .slg-meta-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: var(--text-3); margin-bottom: 0.5rem; display: block; }
  .slg-meta-value { font-size: 1.0625rem; font-weight: 500; color: var(--text); }

  /* Layout */
  .slg-magazine-layout {
    max-width: 1100px; margin: 0 auto; padding: 6rem 2rem;
    display: grid; grid-template-columns: 2fr 1fr; gap: 6rem;
  }
  @media (max-width: 960px) { .slg-magazine-layout { grid-template-columns: 1fr; gap: 4rem; } }

  .slg-editorial-img {
    width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 4rem;
    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.15);
    background: var(--bg-3);
  }
  .slg-editorial-img img { width: 100%; height: auto; display: block; }

  /* Text elements */
  .slg-story-body { font-size: 1.125rem; color: var(--text-2); }
  .slg-story-p { margin-bottom: 2rem; white-space: pre-wrap; }
  .slg-story-h2 { font-size: 2rem; font-weight: 300; margin: 4rem 0 1.5rem; color: var(--text); letter-spacing: -0.02em; }
  .slg-story-h3 { font-size: 1.5rem; font-weight: 500; margin: 3rem 0 1.25rem; color: var(--text); }
  
  .slg-pullquote {
    position: relative; margin: 5rem -3rem; padding: 0 3rem;
    border-left: 4px solid var(--orange);
  }
  @media (max-width: 960px) { .slg-pullquote { margin: 4rem 0; padding: 0 2rem; } }
  .slg-quote-text {
    font-family: 'DM Serif Display', serif; font-size: 2.25rem; font-style: italic;
    color: var(--text); line-height: 1.25; margin-bottom: 1.25rem;
  }
  .slg-quote-cite { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; color: var(--orange); letter-spacing: 0.1em; }

  /* Sidebar */
  .slg-story-sidebar { position: sticky; top: 120px; align-self: start; }
  .slg-sidebar-card {
    padding: 2.5rem; background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px;
    margin-bottom: 2.5rem;
  }
  .slg-sidebar-h3 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; margin-bottom: 2rem; color: var(--text); }
  .slg-sidebar-fact { border-bottom: 1px solid var(--border); padding: 1.25rem 0; }
  .slg-sidebar-fact:last-child { border: none; }
  
  .slg-cta-card {
    padding: 3rem; background: var(--orange); color: #fff; border-radius: 16px;
    text-align: center; transition: all 0.3s;
    box-shadow: 0 20px 40px -10px rgba(245,130,32,0.3);
  }
  .slg-cta-card:hover { transform: translateY(-5px); box-shadow: 0 30px 60px -12px rgba(245,130,32,0.4); }
  .slg-cta-h3 { font-family: 'DM Serif Display', serif; font-size: 1.75rem; margin-bottom: 1rem; color: #fff; }
`

const STATIC_STORIES = {
  'sarah-namuli': {
    eyebrow: 'Impact Story — Kampala',
    title: 'Leading Accountability from the Frontline',
    authorName: 'Sarah Namuli',
    location: 'Makindye Division, Kampala',
    authorRole: 'Community Development Officer',
    imageUrl: '/sarah_namuli_story_1776248245640.png',
    storyText: 'Sarah’s journey with SLOGBAA began when she realized that traditional reporting methods were failing to capture the real needs of her community.\n\n## The Power of Real-Time Monitoring\nThrough the SLOGBAA modules on Digital Compliance and Community-Led Governance, Sarah learned how to utilize mobile-first tools to track municipal service delivery.\n\n> SLOGBAA didn’t just give me a certificate; it gave me a lens through which I could see my community’s potential for radical transparency.\n\nToday, Sarah serves as a lead mentor for other women in the district, demonstrating how civic knowledge is the ultimate tool for local transformation.',
    projectImpact: '1,200+ Households',
    coursesCompleted: '6 Modules',
    certification: 'Elite Level'
  }
}

export function ImpactStoryDetailPage() {
  const { id } = useParams()
  const { theme } = useTheme()
  const { data: cms } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
  })

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  // Find story in CMS or fallback to static
  const cmsStory = cms?.stories?.find(s => s.id === id)
  const story = cmsStory || STATIC_STORIES[id] || STATIC_STORIES['sarah-namuli']

  if (!story) return <div className="slg-loader">Loading story...</div>

  // Simple Markdown-ish parser for storyText
  const renderContent = (text) => {
    if (!text) return null
    const blocks = text.split(/\n\s*\n/)
    return blocks.map((block, i) => {
      const b = block.trim()
      if (b.startsWith('# ')) return <h2 key={i} className="slg-story-h2 slg-serif" style={{ color: 'var(--orange)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>{b.replace('# ', '')}</h2>
      if (b.startsWith('## ')) return <h2 key={i} className="slg-story-h2 slg-serif">{b.replace('## ', '')}</h2>
      if (b.startsWith('### ')) return <h3 key={i} className="slg-story-h3">{b.replace('### ', '')}</h3>
      if (b.startsWith('> ')) {
        return (
          <blockquote key={i} className="slg-pullquote">
            <p className="slg-quote-text">{b.replace('> ', '')}</p>
            <cite className="slg-quote-cite">/ {story.authorName || story.name}</cite>
          </blockquote>
        )
      }
      return <p key={i} className="slg-story-p">{block}</p>
    })
  }

  return (
    <div className={`slg-page slg-story-detail ${theme}-theme`}>
      <style>{STORY_DETAIL_CSS}</style>
      <Navbar />

      <header className="slg-story-hero">
        <span className="slg-eyebrow">Impact Story — {story.location || 'Civic Leader'}</span>
        <h1 className="slg-story-h1 slg-serif">{story.title}</h1>

        <div className="slg-story-meta-row">
          <div className="slg-story-meta-item">
            <span className="slg-meta-label">Author / Subject</span>
            <span className="slg-meta-value">{story.authorName || story.name}</span>
          </div>
          <div className="slg-story-meta-item">
            <span className="slg-meta-label">Location</span>
            <span className="slg-meta-value">{story.location || 'Uganda'}</span>
          </div>
          <div className="slg-story-meta-item">
            <span className="slg-meta-label">District Role</span>
            <span className="slg-meta-value">{story.authorRole || story.role}</span>
          </div>
        </div>
      </header>

      <div className="slg-magazine-layout">
        <article>
          <div className="slg-editorial-img">
            <img src={story.imageUrl || story.image} alt={story.authorName || story.name} />
          </div>

          <div className="slg-story-body">
            {renderContent(story.storyText || story.preview)}
          </div>
        </article>

        <aside className="slg-story-sidebar">
          {(story.projectImpact || story.coursesCompleted || story.certification) && (
            <div className="slg-sidebar-card">
              <h3 className="slg-sidebar-h3">Story Highlights</h3>
              {story.projectImpact && (
                <div className="slg-sidebar-fact">
                  <span className="slg-meta-label">Project Impact</span>
                  <span className="slg-meta-value">{story.projectImpact}</span>
                </div>
              )}
              {story.coursesCompleted && (
                <div className="slg-sidebar-fact">
                  <span className="slg-meta-label">Courses Completed</span>
                  <span className="slg-meta-value">{story.coursesCompleted}</span>
                </div>
              )}
              {story.certification && (
                <div className="slg-sidebar-fact">
                  <span className="slg-meta-label">Certification</span>
                  <span className="slg-meta-value">{story.certification}</span>
                </div>
              )}
            </div>
          )}

          <div className="slg-cta-card">
            <h3 className="slg-cta-h3">Inspired?</h3>
            <p style={{ fontSize: '0.9375rem', marginBottom: '2rem', opacity: 0.9 }}>
              Join {story.authorName?.split(' ')[0] || 'our leaders'} and thousands of others in the journey toward a more accountable Uganda.
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
      <Footer />
    </div>
  )
}
