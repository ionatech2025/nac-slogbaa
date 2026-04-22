import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'
import { getHomepageContent } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

const NEWS_CSS = `
  .slg-news-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  
  .slg-hero-news {
    padding: 6rem 2rem 4rem; text-align: center; background: var(--bg-2);
    border-bottom: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .slg-hero-title { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 300; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
  .slg-hero-title em { font-style: normal; font-family: 'DM Serif Display', serif; color: var(--orange); }

  .slg-news-container { max-width: 1200px; margin: 0 auto; padding: 5rem 2rem; }
  
  .slg-filter-bar {
    display: flex; gap: 1rem; margin-bottom: 4rem; justify-content: center;
  }
  .slg-filter-btn {
    padding: 0.625rem 1.50rem; border-radius: 99px; border: 1px solid var(--border);
    background: var(--bg-2); color: var(--text-2); font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .slg-filter-btn.active { background: var(--orange); color: #fff; border-color: var(--orange); }

  .slg-news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2.5rem; }
  
  .slg-news-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-news-card:hover { border-color: var(--orange-glow); transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
  
  .slg-news-img {
    aspect-ratio: 16/9; background: var(--bg-3); overflow: hidden;
  }
  .slg-news-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .slg-news-card:hover .slg-news-img img { transform: scale(1.05); }

  .slg-news-content { padding: 2rem; flex-grow: 1; display: flex; flex-direction: column; }
  .slg-news-tag {
    display: inline-block; padding: 0.25rem 0.75rem; border-radius: 6px;
    font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--orange); background: var(--orange-dim); margin-bottom: 1rem;
    align-self: flex-start;
  }
  .slg-news-title { font-size: 1.25rem; font-weight: 600; line-height: 1.4; color: var(--text); margin-bottom: 1rem; }
  .slg-news-summary { font-size: 0.9375rem; color: var(--text-2); line-height: 1.6; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  
  .slg-news-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .slg-news-date { font-size: 0.8125rem; color: var(--text-3); font-weight: 500; display: flex; align-items: center; gap: 0.4rem; }
  
  .slg-link-details {
    display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; font-weight: 700;
    color: var(--orange); text-decoration: none;
  }
  .slg-link-details:hover { gap: 0.6rem; }
`

const NEWS_DATA = [
  {
    id: 'new-courses-2024',
    title: 'New Courses on Civic Engagement for 2024',
    category: 'News & Updates',
    description: 'NAC is preparing new courses on community-led governance, accountability, and citizen participation to be launched this quarter.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    publishedDate: 'April 15, 2024',
    slug: 'new-courses-2024'
  },
  {
    id: 'regional-workshops-july',
    title: 'Regional Training Workshops: July Series',
    category: 'Events',
    description: 'Join our trainers for an intensive three-day workshop series across four major regions in Uganda.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop',
    eventDate: 'July 1 - July 3, 2024',
    publishedDate: 'April 10, 2024',
    slug: 'regional-workshops-july'
  },
  {
    id: 'platform-upgrade-v2',
    title: 'SLOGBAA Platform v2.0 is Now Live',
    category: 'News & Updates',
    description: 'We are excited to announce major improvements to our learning interface, including mobile-first responsiveness and offline viewing.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    publishedDate: 'March 28, 2024',
    slug: 'platform-upgrade-v2'
  },
  {
    id: 'accountability-summit-2024',
    title: 'Annual National Accountability Summit',
    category: 'Events',
    description: 'A gathering of civic leaders, policy makers, and active citizens to discuss the state of governance in Uganda.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
    eventDate: 'August 24, 2024',
    publishedDate: 'March 15, 2024',
    slug: 'accountability-summit-2024'
  },
  {
    id: 'citizen-reporting-guide',
    title: 'Now Available: Citizen Reporting Digital Guide',
    category: 'News & Updates',
    description: 'Download our latest guide on how to effectively use digital tools for monitoring local service delivery.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    publishedDate: 'March 05, 2024',
    slug: 'citizen-reporting-guide'
  },
  {
    id: 'community-leader-meetup',
    title: 'Eastern Uganda Community Leader Meetup',
    category: 'Events',
    description: 'Networking and knowledge-sharing session for SLOGBAA alumni in the Mbale and Jinja districts.',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    eventDate: 'June 12, 2024',
    publishedDate: 'February 20, 2024',
    slug: 'community-leader-meetup'
  }
]

export function NewsListingPage() {
  const { theme } = useTheme()
  const [activeFilter, setActiveFilter] = useState('All')

  const { data: cms, isLoading } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
  })

  const newsItems = useMemo(() => {
    return cms?.news?.length ? cms.news : NEWS_DATA
  }, [cms])

  const filteredNews = useMemo(() => {
    if (activeFilter === 'All') return newsItems
    return newsItems.filter(item => (item.tag || item.category) === activeFilter)
  }, [activeFilter, newsItems])

  const filterOptions = useMemo(() => {
    const defaultOptions = ['All', 'News', 'Update', 'Event', 'Other']
    // If we have categories in static data that don't match, we could add them, 
    // but the CMS uses these 4.
    return defaultOptions
  }, [])

  if (isLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>

  return (
    <div className={`slg-news-page ${theme}-theme`}>
      <style>{NEWS_CSS}</style>
      <Navbar />

      <header className="slg-hero-news">
        <span className="slg-eyebrow" style={{ color: 'var(--orange)' }}>News & Updates</span>
        <h1 className="slg-hero-title">
          Latest from<br /><em>SLOGBAA</em>
        </h1>
        <p className="slg-section-desc" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Stay updated with the latest news, platform improvements, and upcoming events in the SLOGBAA ecosystem.
        </p>
      </header>

      <main className="slg-news-container">
        <div className="slg-filter-bar">
          {filterOptions.map(filter => (
            <button
              key={filter}
              className={`slg-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="slg-news-grid">
          {filteredNews.map((item) => (
            <article key={item.id || item.title} className="slg-news-card">
              <div className="slg-news-img">
                <img src={item.imageUrl || item.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop'} alt={item.title} loading="lazy" />
              </div>
              <div className="slg-news-content">
                <span className="slg-news-tag">{item.tag || item.category || 'Update'}</span>
                <h2 className="slg-news-title">{item.title}</h2>
                <p className="slg-news-summary" style={{ whiteSpace: 'pre-wrap' }}>
                  {item.summary || item.description}
                </p>
                
                <div className="slg-news-footer">
                  <div className="slg-news-date">
                    <Icon icon={(item.tag === 'Event' || item.category === 'Events') ? icons.calendar : icons.fileText} size={14} />
                    {item.publishedDate || item.date || item.eventDate}
                  </div>
                  <Link to={`/news-and-updates/${item.slug || (item.title && item.title.toLowerCase().replace(/\s+/g, '-'))}`} className="slg-link-details">
                    See Details <Icon icon={icons.arrowRight} size={14} />
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
