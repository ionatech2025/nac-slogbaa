import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'
import { getHomepageContent } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

const truncateWords = (str, limit = 30) => {
  if (!str) return ''
  const words = str.split(/\s+/)
  if (words.length <= limit) return str
  return words.slice(0, limit).join(' ') + '...'
}

const STORIES_CSS = `
  .slg-stories-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  
  .slg-hero-stories {
    padding: 6rem 2rem 4rem; text-align: center; background: var(--bg-2);
    border-bottom: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .slg-hero-title { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 300; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
  .slg-hero-title em { font-style: normal; font-family: 'DM Serif Display', serif; color: var(--orange); }

  .slg-stories-container { max-width: 1200px; margin: 0 auto; padding: 5rem 2rem; }
  
  .slg-stories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 3rem; }
  
  .slg-story-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 24px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slg-story-card:hover { transform: translateY(-8px); border-color: var(--orange-glow); box-shadow: 0 40px 80px -12px rgba(0,0,0,0.12); }
  
  .slg-story-img-wrap { aspect-ratio: 4/5; position: relative; overflow: hidden; background: var(--bg-3); }
  .slg-story-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .slg-story-card:hover .slg-story-img-wrap img { transform: scale(1.05); }
  
  .slg-story-tag {
    position: absolute; bottom: 1.5rem; left: 1.5rem; padding: 0.45rem 0.875rem;
    background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,0.05);
    border-radius: 100px; font-size: 0.75rem; font-weight: 700; color: #000;
  }
  .dark-theme .slg-story-tag { background: rgba(0,0,0,0.7); color: #fff; border-color: rgba(255,255,255,0.1); }

  .slg-story-content { padding: 2.5rem; display: flex; flex-direction: column; flex-grow: 1; }
  .slg-story-meta { font-size: 0.75rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.875rem; border-bottom: 1px solid var(--border); padding-bottom: 0.875rem; }
  .slg-story-title { font-size: 1.625rem; font-weight: 500; line-height: 1.25; margin-bottom: 1rem; color: var(--text); font-family: 'DM Serif Display', serif; }
  .slg-story-preview { font-size: 0.9375rem; color: var(--text-2); line-height: 1.7; margin-bottom: 2rem; }
  
  .slg-link-more {
    display: flex; align-items: center; gap: 0.5rem; color: var(--text);
    font-size: 0.875rem; font-weight: 700; text-decoration: none; transition: color 0.2s;
  }
  .slg-link-more:hover { color: var(--orange); }
`

const ALL_STORIES = [
  {
    id: 'sarah-namuli',
    authorName: 'Sarah Namuli',
    location: 'Kampala District',
    authorRole: 'Community Leader',
    title: 'Leading Accountability from the Frontline',
    storyText: 'How one leader used digital tools to monitor local service delivery and improve community outcomes in the heart of Kampala...',
    imageUrl: '/sarah_namuli_story_1776248245640.png',
  },
  {
    id: 'james-okello',
    authorName: 'James Okello',
    location: 'Gulu City',
    authorRole: 'Civil Society Advocate',
    title: 'Digital Literacy for Local Governance',
    storyText: 'James shares his journey of transitioning from traditional advocacy to data-driven civic engagement across the Northern region...',
    imageUrl: '/james_okello_story_1776248275273.png',
  },
  {
    id: 'grace-achieng',
    authorName: 'Grace Achieng',
    location: 'Mbarara District',
    authorRole: 'Civic Trainee',
    title: 'Breaking Barriers in Civic Education',
    storyText: 'Grace explains how the SLOGBAA platform allowed her to pursue high-level certification despite local geographical constraints...',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop',
  }
]

export function ImpactStoriesPage() {
  const { theme } = useTheme()
  const { data: cms } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
  })

  const stories = cms?.stories?.length ? cms.stories : ALL_STORIES

  return (
    <div className={`slg-stories-page ${theme}-theme`}>
      <style>{STORIES_CSS}</style>
      <Navbar />

      <header className="slg-hero-stories">
        <span className="slg-eyebrow" style={{ color: 'var(--orange)' }}>Transforming Uganda</span>
        <h1 className="slg-hero-title">
          Impact<br /><em>Stories</em>
        </h1>
        <p className="slg-section-desc" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Real experiences from community leaders, civil society, and citizens who are using SLOGBAA to drive local accountability.
        </p>
      </header>

      <main className="slg-stories-container">
        <div className="slg-stories-grid">
          {stories.map(story => (
            <article key={story.id} className="slg-story-card">
              <div className="slg-story-img-wrap">
                <img src={story.imageUrl || story.image} alt={story.authorName || story.name} />
                <div className="slg-story-tag">{story.location || 'Uganda'}</div>
              </div>
              <div className="slg-story-content">
                <header>
                  <p className="slg-story-meta">{story.authorName || story.name} — {story.authorRole || story.role || 'Member'}</p>
                  <h3 className="slg-story-title">{story.title}</h3>
                </header>
                <p className="slg-story-preview">{truncateWords(story.storyText || story.preview)}</p>
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                  <Link to={`/stories/${story.id}`} className="slg-link-more">
                    Read the full story <Icon icon={icons.arrowRight} size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <CtaSection />
      <Footer />
    </div>
  )
}
