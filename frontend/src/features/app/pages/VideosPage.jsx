import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { useQuery } from '@tanstack/react-query'
import { getHomepageContent } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

const VIDEOS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  :root {
    --orange: #F58220;
    --orange-dim: rgba(245,130,32,0.06);
    --orange-glow: rgba(245,130,32,0.15);
  }

  .slg-videos-page.light-theme {
    --bg: #ffffff;
    --bg-2: #fcfcfd;
    --bg-3: #f9fafb;
    --border: rgba(0,0,0,0.06);
    --border-hover: rgba(0,0,0,0.12);
    --text: #09090b;
    --text-2: #52525b;
    --text-3: #71717a;
  }

  .slg-videos-page.dark-theme {
    --bg: #09090b;
    --bg-2: #111115;
    --bg-3: #18181e;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.14);
    --text: #f4f4f5;
    --text-2: #a1a1aa;
    --text-3: #52525b;
  }

  .slg-videos-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  
  .slg-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--orange); margin-bottom: 0.875rem;
  }
  .slg-eyebrow::before { content: ''; display: block; width: 18px; height: 1.5px; background: var(--orange); border-radius: 99px; }

  .slg-btn-orange {
    position: relative; overflow: hidden;
    padding: 0.625rem 1.75rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600;
    color: #fff; text-decoration: none; background: var(--orange);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(245,130,32,0.2);
  }
  .slg-btn-orange:hover {
    background: #FF933A; transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(245,130,32,0.3);
  }

  .slg-hero-videos {
    padding: 6rem 2rem 4rem; text-align: center; background: var(--bg-2);
    border-bottom: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .slg-hero-title { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 300; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
  .slg-hero-title em { font-style: normal; font-family: 'DM Serif Display', serif; color: var(--orange); }

  .slg-videos-container { max-width: 1200px; margin: 0 auto; padding: 5rem 2rem; }
  
  .slg-videos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
  
  .slg-video-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-video-card:hover { border-color: var(--orange-glow); transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
  
  .slg-video-thumb {
    aspect-ratio: 16/9; position: relative; background: #000;
  }
  .slg-video-thumb iframe {
    position: absolute; inset: 0; width: 100%; height: 100%; border: none;
  }
  
  .slg-video-content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
  .slg-video-title { font-size: 1.125rem; font-weight: 600; line-height: 1.4; color: var(--text); margin-bottom: 0.75rem; }
  .slg-video-desc { font-size: 0.875rem; color: var(--text-2); line-height: 1.6; margin-bottom: 1.5rem; }
`

const DEFAULT_VIDEOS = [
  { title: 'Introduction to Civic Leadership', youtubeUrl: 'https://www.youtube.com/watch?v=avrQXoBConA' },
  { title: 'Community Governance Basics', youtubeUrl: 'https://www.youtube.com/watch?v=fWUANWrSHSw' },
  { title: 'Accountability & Transparency', youtubeUrl: 'https://www.youtube.com/watch?v=9Xk3H0JdUTY' },
  { title: 'Public Policy Overview', youtubeUrl: 'https://www.youtube.com/watch?v=avrQXoBConA' }, // Mock extra
  { title: 'Effective Advocacy', youtubeUrl: 'https://www.youtube.com/watch?v=fWUANWrSHSw' }, // Mock extra
  { title: 'Resource Management', youtubeUrl: 'https://www.youtube.com/watch?v=9Xk3H0JdUTY' }, // Mock extra
]

function extractYoutubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/)
  return m ? m[1] : url
}

export function VideosPage() {
  const { theme } = useTheme()
  const { data: cms } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
  })

  const videos = cms?.videos?.length ? cms.videos : DEFAULT_VIDEOS

  return (
    <div className={`slg-videos-page ${theme}-theme`}>
      <style>{VIDEOS_CSS}</style>
      <Navbar />

      <header className="slg-hero-videos">
        <span className="slg-eyebrow" style={{ color: 'var(--orange)' }}>Learning Resources</span>
        <h1 className="slg-hero-title">
          Video<br /><em>Gallery</em>
        </h1>
        <p className="slg-section-desc" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Explore our collection of educational videos covering governance, civic engagement, and community leadership.
        </p>
      </header>

      <main className="slg-videos-container">
        <div className="slg-videos-grid">
          {videos.map((v, i) => {
            const vid = extractYoutubeId(v.youtubeUrl)
            return (
              <article key={i} className="slg-video-card">
                <div className="slg-video-thumb">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${vid}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="slg-video-content">
                  <h3 className="slg-video-title">{v.title}</h3>
                </div>
              </article>
            )
          })}
        </div>
      </main>

      <footer className="slg-footer" style={{ background: 'var(--bg-2)', padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 className="slg-hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Want deeper learning?</h2>
        <p className="slg-section-desc" style={{ marginBottom: '2.5rem', margin: '0 auto' }}>Enroll in our structured courses to earn certificates and build your civic leadership credentials.</p>
        <Link to="/auth/register" className="slg-btn-orange" style={{ display: 'inline-flex', marginTop: '2rem' }}>Get Started Free</Link>
      </footer>
    </div>
  )
}
