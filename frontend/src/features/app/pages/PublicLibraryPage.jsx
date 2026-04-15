import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'

const LIB_CSS = `
  .slg-lib-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  
  .slg-hero-lib {
    padding: 6rem 2rem 4rem; text-align: center; background: var(--bg-2);
    border-bottom: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .slg-lib-filters {
    max-width: 1120px; margin: -2rem auto 0; padding: 1.5rem 2rem;
    background: var(--bg); border: 1px solid var(--border); border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
    position: relative; z-index: 10;
  }
  .slg-search-wrap { position: relative; flex: 1; min-width: 300px; }
  .slg-search-input {
    width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border-radius: 10px;
    border: 1px solid var(--border); background: var(--bg-2); color: var(--text);
    font-size: 0.9375rem; transition: border-color 0.2s;
  }
  .slg-search-input:focus { outline: none; border-color: var(--orange); }
  .slg-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-3); }

  .slg-filter-group { display: flex; gap: 0.5rem; }
  .slg-filter-btn {
    padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg-2); color: var(--text-2); font-size: 0.8125rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .slg-filter-btn.active { background: var(--orange); color: #fff; border-color: var(--orange); }

  .slg-lib-main { max-width: 1120px; margin: 4rem auto; padding: 0 2rem; }
  
  .slg-lib-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
  
  .slg-lib-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px;
    padding: 1.5rem; display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-lib-card:hover { transform: translateY(-5px); border-color: var(--orange-glow); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
  
  .slg-lib-img-box {
    aspect-ratio: 1; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem;
    background: var(--bg-3); border: 1px solid var(--border);
  }
  .slg-lib-img-box img { width: 100%; height: 100%; object-fit: cover; }
  
  .slg-lib-actions { display: flex; gap: 0.75rem; margin-top: auto; padding-top: 1.5rem; }
  .slg-btn-lib-main {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.625rem; border-radius: 8px; font-size: 0.8125rem; font-weight: 700;
    background: var(--orange); color: #fff; text-decoration: none; border: none; cursor: pointer;
  }
  .slg-btn-lib-outline {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.625rem; border-radius: 8px; font-size: 0.8125rem; font-weight: 600;
    background: transparent; color: var(--text); border: 1px solid var(--border);
    text-decoration: none; cursor: pointer; transition: all 0.2s;
  }
  .slg-btn-lib-outline:hover { background: var(--bg-2); border-color: var(--text-3); }
  
  /* Modal etc. Same as HomePage for consistency */
  .slg-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 2rem;
  }
  .slg-modal-box {
    background: var(--bg); border-radius: 24px; padding: 3rem; max-width: 600px; width: 100%;
    position: relative; border: 1px solid var(--border); border-radius: 12px;
  }
  .slg-modal-close {
    position: absolute; top: 1.5rem; right: 1.5rem; background: var(--bg-2); border: 1px solid var(--border);
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-2);
  }

  .slg-pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 4rem; }
  .slg-page-btn {
    width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    background: var(--bg); color: var(--text-2); transition: all 0.2s;
  }
  .slg-page-btn.active { background: var(--orange); color: #fff; border-color: var(--orange); }
  .slg-page-btn:hover:not(.active) { border-color: var(--text-3); color: var(--text); }
`

const CATEGORIES = ['All', 'Report', 'Manual', 'Policy', 'Research']

const PUBLIC_LIBRARY_DATA = [
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
  },
  {
    id: 'res-audit',
    title: 'Social Audit Research',
    tag: 'Research',
    desc: 'Analysis of community-led audits and their impact on local service efficiency.',
    fullDesc: 'A multi-district research paper exploring how social auditing transforms public healthcare delivery in rural Uganda. Includes case studies from Northern and Western regions.',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'manual-transparency',
    title: 'Transparency Toolkit',
    tag: 'Manual',
    desc: 'Essential resources for activists monitoring local government spending.',
    fullDesc: 'A practical toolkit for civic activists. Contains budget tracking worksheets, freedom of information request templates, and digital safety guides for advocates.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop'
  }
]

export function PublicLibraryPage() {
  const { theme } = useTheme()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalResource, setModalResource] = useState(null)

  const filtered = useMemo(() => {
    return PUBLIC_LIBRARY_DATA.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.desc.toLowerCase().includes(search.toLowerCase())
      const matchesCat = activeCategory === 'All' || res.tag === activeCategory
      return matchesSearch && matchesCat
    })
  }, [search, activeCategory])

  return (
    <div className={`slg-lib-page ${theme}-theme`}>
      <style>{LIB_CSS}</style>
      <Navbar />

      <header className="slg-hero-lib">
        <span className="slg-eyebrow">Public Access</span>
        <h1 className="slg-section-title" style={{ fontSize: '3.5rem' }}>Resource <em>Library</em></h1>
        <p className="slg-section-desc" style={{ margin: '0 auto' }}>
          Explore our collection of shared knowledge, policies, and tools for civic leadership across Uganda.
        </p>
      </header>

      <div className="slg-lib-filters">
        <div className="slg-search-wrap">
          <div className="slg-search-icon"><Icon icon={icons.search} size={18} /></div>
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="slg-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="slg-filter-group">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`slg-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="slg-lib-main">
        <div className="slg-lib-grid">
          {filtered.map(res => (
            <article key={res.id} className="slg-lib-card">
              <div className="slg-lib-img-box">
                <img src={res.image} alt={res.title} />
              </div>
              <span className="slg-feature-tag">{res.tag}</span>
              <h3 className="slg-feature-title">{res.title}</h3>
              <p className="slg-feature-text">{res.desc}</p>
              <div className="slg-lib-actions">
                <button onClick={() => setModalResource(res)} className="slg-btn-lib-outline">View Details</button>
                <button className="slg-btn-lib-main">Download</button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ color: 'var(--text-3)' }}>No resources found matching your search.</p>
          </div>
        )}

        <div className="slg-pagination">
          <button className="slg-page-btn active">1</button>
          <button className="slg-page-btn">2</button>
          <button className="slg-page-btn"><Icon icon={icons.chevronRight} size={16} /></button>
        </div>
      </main>

      {/* Modal same as homepage */}
      {modalResource && (
        <div className="slg-modal-overlay" onClick={() => setModalResource(null)}>
          <div className="slg-modal-box" onClick={e => e.stopPropagation()}>
            <button className="slg-modal-close" onClick={() => setModalResource(null)}>
              <Icon icon={icons.close} size={16} />
            </button>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ width: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={modalResource.image} alt="" style={{ width: '100%', height: 'auto' }} />
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <span className="slg-feature-tag">{modalResource.tag}</span>
                <h2 className="slg-section-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{modalResource.title}</h2>
                <p className="slg-article-p" style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {modalResource.fullDesc}
                </p>
                <div style={{ marginTop: '2.5rem' }}>
                  <button className="slg-btn-hero-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Download Metadata & PDF <Icon icon={icons.download} size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
