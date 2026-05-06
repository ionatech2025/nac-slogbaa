import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../../shared/icons.jsx'

const PUBLIC_LIBRARY_RESOURCES = [
  {
    id: 'gov-guide',
    title: 'District Governance Guide',
    tag: 'Report',
    desc: 'Guidelines for effective local administration and community-led district planning.',
    fullDesc: 'The District Governance Guide is a comprehensive manual designed for local council members and administrative staff. It outlines best practices for fiscal transparency, public consultation, and resource allocation to ensure that community needs are prioritized in every policy decision.',
    image: '/governance_guide_cover_1776252013759.png'
  },
  {
    id: 'leadership-101',
    title: 'Civic Leadership 101',
    tag: 'Manual',
    desc: 'Foundation principles for emerging community leaders and grassroots advocates.',
    fullDesc: 'Leadership 101 focuses on the core competencies required to organize and mobilize communities. From conflict resolution to public speaking and strategic planning, this manual serves as a roadmap for anyone looking to make a tangible impact at the local level.',
    image: '/leadership_manual_cover_1776252040723.png'
  },
  {
    id: 'acc-framework',
    title: 'Accountability Framework',
    tag: 'Policy',
    desc: 'Standardized procedures for monitoring and evaluating public service delivery.',
    fullDesc: 'This policy framework provides the technical tools needed to audit local service delivery. It includes standardized reporting templates, data verification protocols, and community monitoring checklists designed to hold local service providers accountable to the citizens.',
    image: '/accountability_framework_cover_1776252057156.png'
  }
]

const truncateWords = (str, limit = 150) => {
  if (!str) return ''
  const words = str.split(/\s+/)
  if (words.length <= limit) return str
  return words.slice(0, limit).join(' ') + '...'
}

export function LibrarySection({ library, onOpenDetails }) {
  const resources = library?.length ? library : PUBLIC_LIBRARY_RESOURCES

  return (
    <section id="public-library" className="slg-section slg-bg-3">
      <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span className="slg-eyebrow">Resource Center</span>
          <h2 className="slg-section-title">Public <em>Library</em></h2>
          <p className="slg-section-desc">
            Fully open-access policy guides, administrative manuals, and governance research for all citizens.
          </p>
        </div>
        <Link to="/public-library" className="slg-btn-ghost">Enter Public Library</Link>
      </div>

      <div className="slg-lib-row-stack">
        {resources.slice(0, 3).map(res => (
          <article key={res.id} className="slg-lib-item-row">
            <div className="slg-lib-row-img">
              <img src={res.imageUrl || res.image || 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=600&auto=format&fit=crop'} alt={res.title} />
            </div>
            <div className="slg-lib-row-content">
              <span className="slg-feature-tag">{res.category || res.tag}</span>
              <h3 className="slg-feature-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{res.title}</h3>
              <p className="slg-feature-text" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {truncateWords(res.description || res.desc, 50)}
              </p>
              <div className="slg-lib-row-actions">
                <button onClick={() => onOpenDetails(res)} className="slg-btn-lib-outline" style={{ maxWidth: '140px' }}>View Details</button>
                <button onClick={() => { if (res.fileUrl) window.open(res.fileUrl, '_blank') }} className="slg-btn-lib-main" style={{ maxWidth: '140px' }}>
                  Download <Icon icon={icons.download} size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
