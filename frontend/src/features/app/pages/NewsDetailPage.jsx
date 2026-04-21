import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'
import { getHomepageContent } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

const ARTICLE_CSS = `
  .slg-article-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  .slg-serif { font-family: 'DM Serif Display', serif; }

  /* Hero Section */
  .slg-article-hero {
    position: relative; padding: 7rem 2rem 5rem; text-align: center;
    background: var(--bg-2); border-bottom: 1px solid var(--border);
  }
  .slg-article-eyebrow {
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;
    color: var(--orange); margin-bottom: 1.5rem; display: block;
  }
  .slg-article-title {
    font-size: clamp(2.25rem, 6vw, 4rem); font-weight: 300; line-height: 1.1;
    letter-spacing: -0.03em; color: var(--text); margin: 0 auto 2.5rem; max-width: 900px;
  }
  
  .slg-article-meta {
    display: flex; justify-content: center; gap: 3rem;
    max-width: 800px; margin: 0 auto; padding-top: 2rem; border-top: 1px solid var(--border);
  }
  .slg-meta-item { text-align: left; }
  .slg-meta-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: var(--text-3); margin-bottom: 0.4rem; display: block; }
  .slg-meta-value { font-size: 0.9375rem; font-weight: 500; color: var(--text); }

  /* Magazine Layout */
  .slg-magazine-layout {
    max-width: 1100px; margin: 0 auto; padding: 5rem 2rem;
    display: grid; grid-template-columns: 2.2fr 1fr; gap: 5rem;
  }
  @media (max-width: 960px) { .slg-magazine-layout { grid-template-columns: 1fr; gap: 4rem; } }

  .slg-main-article { line-height: 1.8; }
  .slg-editorial-img {
    width: 100%; border-radius: 4px; overflow: hidden; margin-bottom: 3.5rem;
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.15);
  }
  .slg-editorial-img img { width: 100%; height: auto; display: block; filter: contrast(1.02); }

  .slg-dropcap::first-letter {
    float: left; font-family: 'DM Serif Display', serif; font-size: 5rem;
    line-height: 0.75; padding-top: 8px; padding-right: 12px; color: var(--orange);
  }
  
  .slg-article-lead { font-size: 1.25rem; font-weight: 300; color: var(--text); margin-bottom: 2.5rem; line-height: 1.6; }
  .slg-article-p { font-size: 1.0625rem; color: var(--text-2); margin-bottom: 2rem; }
  .slg-article-h2 { font-size: 1.875rem; font-weight: 300; margin: 3.5rem 0 1.25rem; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
  
  .slg-pullquote {
    margin: 4rem 0; padding: 0 2.5rem; border-left: 2px solid var(--orange);
  }
  .slg-quote-text {
    font-family: 'DM Serif Display', serif; font-size: 1.75rem; font-style: italic;
    color: var(--text); line-height: 1.3; margin-bottom: 1rem;
  }
  .slg-quote-cite { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; color: var(--orange); letter-spacing: 0.05em; }

  /* Sidebar */
  .slg-article-sidebar { position: sticky; top: 110px; align-self: start; }
  .slg-sidebar-section {
    padding: 2.25rem; background: var(--bg-2); border: 1px solid var(--border); border-radius: 4px;
    margin-bottom: 2.5rem;
  }
  .slg-sidebar-h3 { font-family: 'DM Serif Display', serif; font-size: 1.375rem; margin-bottom: 1.5rem; color: var(--text); }
  
  .slg-latest-news-item {
    display: flex; flex-direction: column; gap: 0.4rem; padding: 1rem 0;
    border-bottom: 1px solid var(--border);
  }
  .slg-latest-news-item:last-child { border: none; }
  .slg-latest-tag { font-size: 0.625rem; font-weight: 700; text-transform: uppercase; color: var(--orange); }
  .slg-latest-title { font-size: 0.875rem; font-weight: 600; color: var(--text); text-decoration: none; transition: color 0.2s; }
  .slg-latest-title:hover { color: var(--orange); }
`

const NEWS_ARTICLES = {
  'new-courses-2024': {
    eyebrow: 'Platform News',
    title: 'New Courses on Civic Engagement for 2024',
    category: 'News & Updates',
    publishedDate: 'April 15, 2024',
    author: 'SLOGBAA Editorial',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    lead: 'As part of our commitment to continuous community development, NAC is launching three new core modules designed for emerging civic leaders.',
    content: [
      { type: 'p', value: 'The intersection of digital literacy and civic responsibility has never been more critical. Our upcoming curriculum focuses on the practical application of technology in local governance, ensuring that citizens have the tools to demand accountability and drive change.' },
      { type: 'h2', value: 'Localized Governance Models' },
      { type: 'p', value: 'One of the major highlights of the new course sequence is the inclusion of "District-Level Budgeting Analysis." This module provides trainees with specific frameworks for understanding how local government funds are allocated and spent.' },
      { type: 'quote', text: 'Education is the engine of advocacy. By providing localized, technical knowledge, we are empowering a new generation of active citizens.', author: 'Dr. Joseph Mukasa, NAC Education Lead' },
      { type: 'p', value: 'Registration for these modules will open on May 1st, with early access available for current certificate holders. All new courses will feature expanded video content and downloadable toolkit resources.' }
    ]
  },
  'regional-workshops-july': {
    eyebrow: 'Event Spotlight',
    title: 'Regional Training Workshops: July Series',
    category: 'Events',
    publishedDate: 'April 10, 2024',
    eventDate: 'July 1 - July 3, 2024',
    author: 'Field Coordination Team',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop',
    lead: 'Our intensive field workshops are returning this July, bringing our best trainers directly to community halls across Uganda.',
    content: [
      { type: 'p', value: 'While digital learning provides the foundation, nothing replaces the energy of in-person collaboration. The July series will focus on "Strategic Community Mobilization," a hands-on workshop designed to build leadership skills through simulation and role-play.' },
      { type: 'h2', value: 'Expanding Regional Coverage' },
      { type: 'p', value: 'For the first time, we are expanding our workshops to include the Gulu, Mbale, Mbarara, and Fort Portal regions simultaneously. This coordinated effort aims to train over 500 new community advocates in a single week.' },
      { type: 'quote', text: 'The strength of SLOGBAA lies in our regional reach. We are committed to meeting learners where they are, in their own communities.', author: 'Hon. Sarah Namuli' },
      { type: 'p', value: 'Applications for attendance are now open. Due to high demand and limited venue capacity, we encourage all interested parties to submit their interest through the platform inquiries page by the end of May.' }
    ]
  }
}

export function NewsDetailPage() {
  const { slug } = useParams()
  const { theme } = useTheme()
  
  const { data: cms, isLoading } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (isLoading) return <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>Loading...</div>

  // Find article in CMS or fallback to a default structure
  const cmsArticle = cms?.news?.find(n => n.slug === slug || (n.title && n.title.toLowerCase().replace(/\s+/g, '-') === slug))
  
  // If not found in CMS, check the static ones (keeping them as legacy fallback)
  const legacyArticle = NEWS_ARTICLES[slug]
  
  const article = cmsArticle || legacyArticle || NEWS_ARTICLES['new-courses-2024']

  const renderContent = (text) => {
    if (!text) return null
    // Support either blocks (legacy) or raw text with markdown (CMS)
    if (Array.isArray(text)) {
      return text.map((block, i) => {
        if (block.type === 'p') return <p key={i} className="slg-article-p">{block.value}</p>
        if (block.type === 'h2') return <h2 key={i} className="slg-article-h2 slg-serif">{block.value}</h2>
        if (block.type === 'quote') return (
          <blockquote key={i} className="slg-pullquote">
            <p className="slg-quote-text">{block.text}</p>
            <cite className="slg-quote-cite">/ {block.author}</cite>
          </blockquote>
        )
        return null
      })
    }

    // Split raw text by double newlines for paragraphs/blocks
    const blocks = text.split(/\n\s*\n/)
    return blocks.map((block, i) => {
      const b = block.trim()
      if (b.startsWith('# ')) return <h2 key={i} className="slg-article-h2 slg-serif" style={{ color: 'var(--orange)', borderColor: 'var(--orange)' }}>{b.replace('# ', '')}</h2>
      if (b.startsWith('## ')) return <h2 key={i} className="slg-article-h2 slg-serif">{b.replace('## ', '')}</h2>
      if (b.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.25rem', fontWeight: 600, margin: '2rem 0 1rem', color: 'var(--text)' }}>{b.replace('### ', '')}</h3>
      if (b.startsWith('> ')) {
        return (
          <blockquote key={i} className="slg-pullquote">
            <p className="slg-quote-text">{b.replace('> ', '')}</p>
          </blockquote>
        )
      }
      return <p key={i} className="slg-article-p">{block}</p>
    })
  }

  return (
    <div className={`slg-article-page ${theme}-theme`}>
      <style>{ARTICLE_CSS}</style>
      <Navbar />

      <header className="slg-article-hero">
        <span className="slg-article-eyebrow">{article.tag || article.eyebrow || 'Update'}</span>
        <h1 className="slg-article-title slg-serif">{article.title}</h1>

        <div className="slg-article-meta">
          <div className="slg-meta-item">
            <span className="slg-meta-label">Category</span>
            <span className="slg-meta-value">{article.tag || article.category}</span>
          </div>
          <div className="slg-meta-item">
            <span className="slg-meta-label">Published</span>
            <span className="slg-meta-value">{article.publishedDate || article.date}</span>
          </div>
          <div className="slg-meta-item">
            <span className="slg-meta-label">Author</span>
            <span className="slg-meta-value">{article.author || 'SLOGBAA Editorial'}</span>
          </div>
        </div>
      </header>

      <main className="slg-magazine-layout">
        <div className="slg-main-article">
          <div className="slg-editorial-img">
            <img src={article.imageUrl || article.image} alt="" />
          </div>

          <div className="slg-article-content">
            {renderContent(article.summary || article.content || article.lead)}
          </div>
        </div>

        <aside className="slg-article-sidebar">
          <div className="slg-sidebar-section">
            <h3 className="slg-sidebar-h3">In this section</h3>
            {cms?.news?.filter(n => (n.slug || (n.title && n.title.toLowerCase().replace(/\s+/g, '-'))) !== slug).slice(0, 4).map((item) => (
              <div key={item.id} className="slg-latest-news-item">
                <span className="slg-latest-tag">{item.tag || 'News'}</span>
                <Link to={`/news-and-updates/${item.slug || (item.title && item.title.toLowerCase().replace(/\s+/g, '-'))}`} className="slg-latest-title">
                  {item.title}
                </Link>
              </div>
            ))}
            {(!cms?.news || cms.news.length <= 1) && (
              <div className="slg-latest-news-item">
                <span className="slg-latest-tag">News</span>
                <Link to="/news-and-updates" className="slg-latest-title">Back to all updates</Link>
              </div>
            )}
          </div>

          <div className="slg-sidebar-section" style={{ background: 'var(--orange)', color: '#fff', border: 'none' }}>
            <h3 className="slg-sidebar-h3" style={{ color: '#fff' }}>Stay Informed</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.9 }}>
              Get the latest news and event notifications delivered directly to your dashboard.
            </p>
            <Link to="/auth/register" style={{ color: '#fff', fontWeight: 800, textDecoration: 'none', borderBottom: '2px solid #fff' }}>
              Create Account
            </Link>
          </div>
        </aside>
      </main>

      <CtaSection />
      <Footer />
    </div>
  )
}
