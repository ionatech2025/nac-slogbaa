import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../../shared/icons.jsx'

const truncateWords = (str, limit = 150) => {
  if (!str) return ''
  const words = str.split(/\s+/)
  if (words.length <= limit) return str
  return words.slice(0, limit).join(' ') + '...'
}

export function ImpactStoriesSection({ stories, variant = 'white' }) {
  return (
    <section className={`slg-home-section slg-section-${variant}`} id="stories">
      <div className="slg-container">
        <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span className="slg-eyebrow">Impact Stories</span>
            <h2 className="slg-section-title">
              Voices from<br /><em>the community</em>
            </h2>
            <p className="slg-section-desc" style={{ marginTop: '0.875rem' }}>
              Real citizen leaders sharing their journey of transformation through civic education.
            </p>
          </div>
          <Link to="/stories" className="slg-btn-ghost">View All Stories</Link>
        </div>

        <div className="slg-stories-grid">
          {stories.map((story) => (
            <article key={story.id || story.title} className="slg-story-card">
              <div className="slg-story-img-wrap">
                <img src={story.imageUrl || story.image || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop'} alt={story.authorName || story.name} loading="lazy" />
                <div className="slg-story-tag">{story.location || 'Uganda'}</div>
              </div>
              <div className="slg-story-content">
                <header>
                  <p className="slg-story-meta">{story.authorName || story.name} — {story.authorRole || story.role || 'Member'}</p>
                  <h3 className="slg-story-title">{story.title}</h3>
                </header>
                <p className="slg-story-preview">
                  {truncateWords(story.storyText || story.preview || '', 30)}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                  <Link to={`/stories/${story.id}`} className="slg-link-more">
                    Read the full story <Icon icon={icons.arrowRight} size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
