import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'

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
  
  .slg-lib-row-stack { display: flex; flex-direction: column; gap: 1.5rem; }
  .slg-lib-item-row {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    padding: 2rem; display: flex; gap: 2.5rem; align-items: flex-start; transition: all 0.3s ease;
  }
  .slg-lib-item-row:hover { border-color: var(--orange-glow); box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
  .slg-lib-row-img { width: 160px; height: 220px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: var(--bg-3); border: 1px solid var(--border); }
  .slg-lib-row-img img { width: 100%; height: 100%; object-fit: cover; }
  .slg-lib-row-content { flex: 1; min-width: 0; }
  .slg-lib-row-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
  .slg-btn-lib-main {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.75rem 1.5rem; border-radius: 12px; font-size: 0.8125rem; font-weight: 700;
    background: var(--orange); color: #fff; text-decoration: none; border: none; cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 12px rgba(245,130,32,0.15);
  }
  .slg-btn-lib-main:hover {
    background: #FF933A; transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245,130,32,0.25);
  }
  .slg-btn-lib-outline {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.75rem 1.5rem; border-radius: 12px; font-size: 0.8125rem; font-weight: 600;
    background: var(--bg-2); color: var(--text); border: 1px solid var(--border);
    text-decoration: none; cursor: pointer; transition: all 0.2s;
  }
  .slg-btn-lib-outline:hover {
    background: var(--surface-2); border-color: var(--text-3); transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .slg-lib-item-row { flex-direction: column; gap: 1.5rem; padding: 1.5rem; }
    .slg-lib-row-img { width: 100%; height: 200px; }
  }
  
  
  /* Modal etc. Same as HomePage for consistency */
  .slg-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 2rem;
  }
  .slg-modal-box {
    background: var(--bg); border: 1px solid var(--border); border-radius: 28px;
    padding: 0; max-width: 940px; width: 95%; height: 75vh; min-height: 500px;
    position: relative; overflow: hidden;
    box-shadow: 0 32px 64px -16px rgba(0,0,0,0.5);
    display: flex; flex-direction: column;
  }
  .slg-modal-content { display: flex; align-items: stretch; flex: 1; min-height: 0; overflow: hidden; }
  .slg-modal-left { width: 360px; background: var(--bg-3); border-right: 1px solid var(--border); position: relative; flex-shrink: 0; }
  .slg-modal-cover { width: 100%; height: 100%; object-fit: cover; }
  .slg-modal-right { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; background: var(--bg); }
  .slg-modal-body { flex: 1; overflow-y: auto; padding: 3rem; min-height: 0; scrollbar-width: thin; scrollbar-color: var(--orange-dim) transparent; }
  .slg-modal-footer { padding: 1.5rem 3rem; background: var(--bg-2); border-top: 1px solid var(--border); flex-shrink: 0; }
  .slg-modal-close {
    position: absolute; top: 1rem; right: 1rem; background: var(--bg-2); 
    border: 1px solid var(--border); width: 40px; height: 40px; border-radius: 50%; 
    display: flex; align-items: center; justify-content: center; cursor: pointer; 
    color: var(--text); z-index: 100; transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .slg-modal-close:hover { background: var(--orange); color: #fff; transform: rotate(90deg); border-color: var(--orange); }

  @media (max-width: 800px) {
    .slg-modal-box { max-height: 95vh; width: 95%; }
    .slg-modal-content { flex-direction: column; overflow-y: auto; }
    .slg-modal-left { width: 100%; height: 250px; border-right: none; border-bottom: 1px solid var(--border); }
    .slg-modal-right { height: auto; overflow: visible; }
    .slg-modal-body { padding: 2rem; overflow: visible; }
    .slg-modal-footer { padding: 1.5rem 2rem; }
  }

  @media (max-width: 800px) {
    .slg-modal-content { flex-direction: column; }
    .slg-modal-left { width: 100%; height: 200px; border-right: none; border-bottom: 1px solid var(--border); }
    .slg-modal-right { padding: 2rem; }
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

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/query-keys.js'
import { getHomepageContent, recordVisit } from '../../../api/homepage.js'
import { useEffect } from 'react'

const truncateWords = (str, limit = 150) => {
  if (!str) return ''
  const words = str.split(/\s+/)
  if (words.length <= limit) return str
  return words.slice(0, limit).join(' ') + '...'
}

const CATEGORIES = ['All', 'GENERAL', 'MANUAL', 'REPORT', 'POLICY']

export function PublicLibraryPage() {
  const { theme } = useTheme()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalResource, setModalResource] = useState(null)

  const { data: homeData, isLoading } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: getHomepageContent
  })

  useEffect(() => {
    recordVisit()
  }, [])

  const libraryData = homeData?.library || []

  const filtered = useMemo(() => {
    return libraryData.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          (res.description || '').toLowerCase().includes(search.toLowerCase())
      const matchesCat = activeCategory === 'All' || res.category === activeCategory
      return matchesSearch && matchesCat
    })
  }, [search, activeCategory, libraryData])

  const handleDownload = (res) => {
    if (!res.fileUrl) return
    window.open(res.fileUrl, '_blank')
  }

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
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ color: 'var(--text-3)' }}>Loading resources...</p>
          </div>
        ) : (
          <div className="slg-lib-row-stack">
            {filtered.map(res => (
              <article key={res.id} className="slg-lib-item-row">
                <div className="slg-lib-row-img">
                  <img src={res.imageUrl || 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=600&auto=format&fit=crop'} alt={res.title} />
                </div>
                <div className="slg-lib-row-content">
                  <span className="slg-feature-tag">{res.category}</span>
                  <h3 className="slg-feature-title" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{res.title}</h3>
                  <p className="slg-feature-text" style={{ fontSize: '1rem', lineHeight: 1.7 }}>{truncateWords(res.description, 50)}</p>
                  <div className="slg-lib-row-actions">
                    <button onClick={() => setModalResource(res)} className="slg-btn-lib-outline" style={{ maxWidth: '160px' }}>View Details</button>
                    <button onClick={() => handleDownload(res)} className="slg-btn-lib-main" style={{ maxWidth: '160px' }}>Download <Icon icon={icons.download} size={14} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
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

      <CtaSection />
      <Footer />

      {/* Modal same as homepage */}
      {modalResource && (
        <div className="slg-modal-overlay" onClick={() => setModalResource(null)}>
          <div className="slg-modal-box" onClick={e => e.stopPropagation()}>
            <div className="slg-modal-content">
              <div className="slg-modal-left">
                <img 
                  src={modalResource.imageUrl || 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=600&auto=format&fit=crop'} 
                  alt="" 
                  className="slg-modal-cover" 
                />
              </div>
              <div className="slg-modal-right">
                <button className="slg-modal-close" onClick={() => setModalResource(null)}>
                  <Icon icon={icons.close} size={20} />
                </button>
                
                <div className="slg-modal-body">
                  <span className="slg-feature-tag" style={{ background: 'rgba(245,130,32,0.1)', color: 'var(--orange)', marginBottom: '1.25rem' }}>
                    {modalResource.category}
                  </span>
                  <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>
                    {modalResource.title}
                  </h2>
                  <div style={{ height: '4px', width: '50px', background: 'var(--orange)', borderRadius: '2px', marginBottom: '2rem' }} />
                  <p style={{ fontSize: '1.0625rem', color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {modalResource.description}
                  </p>
                </div>
                
                <div className="slg-modal-footer">
                  <button
                    onClick={() => handleDownload(modalResource)}
                    className="slg-btn-lib-main"
                    style={{ 
                      width: '100%', 
                      height: '56px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.75rem', 
                      fontSize: '1.0625rem',
                      borderRadius: '16px',
                      fontWeight: 700,
                      padding: 0
                    }}
                  >
                    Download Document Resource <Icon icon={icons.download} size={22} />
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
