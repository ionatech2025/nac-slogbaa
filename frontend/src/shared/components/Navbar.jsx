import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon, icons } from '../../shared/icons.jsx'
import { Logo } from './Logo.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const NAV_CSS = `
  .slg-nav {
    position: sticky; top: 0; z-index: 10000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 4rem; height: 80px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slg-nav.transparent:not(.scrolled) {
    background: transparent;
    border-bottom-color: transparent;
  }
  .slg-nav.scrolled {
    height: 64px;
    background: var(--bg) !important;
    backdrop-filter: blur(20px);
    box-shadow: 0 4px 30px rgba(0,0,0,0.1);
    border-bottom-color: var(--border);
  }
  @media (max-width: 1200px) { .slg-nav { padding: 0 2rem; } }

  .slg-nav-links { 
    display: flex; align-items: center; gap: 0.5rem;
    position: absolute; left: 50%; transform: translateX(-50%);
  }
  @media (max-width: 1200px) { 
    .slg-nav-links { position: static; transform: none; margin: 0 1rem; flex: 1; justify-content: center; } 
  }
  @media (max-width: 900px) { .slg-nav-links { display: none; } }

  .slg-nav-group { position: relative; }
  .slg-nav-trigger {
    display: flex; align-items: center; gap: 0.35rem; cursor: pointer;
    padding: 0.5rem 0.875rem; border-radius: 8px; font-size: 0.8125rem; font-weight: 500;
    color: var(--text-2); transition: all 0.2s; background: none; border: none; font-family: inherit;
  }
  .slg-nav-trigger:hover, .slg-nav-group:hover .slg-nav-trigger { color: var(--text); background: var(--orange-dim); }
  .slg-nav-chevron { color: var(--text-3); transition: transform 0.2s; }
  .slg-nav-group:hover .slg-nav-chevron { transform: rotate(180deg); color: var(--orange); }

  .slg-nav-dropdown {
    position: absolute; top: 100%; left: 0; min-width: 300px;
    padding: 1rem; background: var(--bg) !important; border: 1px solid var(--border);
    border-radius: 12px; box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    opacity: 0; visibility: hidden; transform: translateY(0);
    transition: all 0.25s ease-in-out;
    z-index: 20000 !important;
  }
  .slg-nav-group::after {
    content: ''; position: absolute; top: 100%; left: 0; right: 0; height: 20px;
  }
  .slg-nav-group:hover .slg-nav-dropdown { opacity: 1 !important; visibility: visible !important; transform: translateY(10px); }

  .slg-dropdown-link {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem;
    border-radius: 8px; color: var(--text-2); text-decoration: none; transition: all 0.2s;
  }
  .slg-dropdown-link:hover { background: var(--orange-dim); color: var(--orange); }
  .slg-dropdown-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--bg-3); display: flex; align-items: center; justify-content: center; color: var(--text-3); transition: all 0.2s; }
  .slg-dropdown-link:hover .slg-dropdown-icon { background: var(--orange-dim); color: var(--orange); }
  
  .slg-dropdown-content { display: flex; flex-direction: column; }
  .slg-dropdown-label { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.125rem; }
  .slg-dropdown-desc { font-size: 0.75rem; color: var(--text-3); line-height: 1.4; }

  .slg-nav-link {
    padding: 0.5rem 0.875rem; border-radius: 8px; font-size: 0.8125rem; font-weight: 500;
    color: var(--text-2); text-decoration: none; transition: all 0.2s;
  }
  .slg-nav-link:hover { color: var(--text); background: var(--orange-dim); }

  .slg-nav-actions { display: flex; align-items: center; gap: 0.75rem; }
  
  .slg-theme-toggle {
    width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--bg); color: var(--text-3); display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .slg-theme-toggle:hover { color: var(--orange); border-color: var(--orange); background: var(--orange-dim); }

  .slg-btn-signin {
    padding: 0.45rem 1.25rem; border-radius: 10px; font-size: 0.8125rem; font-weight: 600;
    color: var(--text); text-decoration: none; border: 1px solid var(--border); transition: all 0.2s;
  }
  .slg-btn-signin:hover { background: var(--bg-2); border-color: var(--text-3); }

  .slg-btn-register {
    padding: 0.45rem 1.25rem; border-radius: 10px; font-size: 0.8125rem; font-weight: 700;
    color: #fff; text-decoration: none; background: var(--orange);
    transition: all 0.2s; box-shadow: 0 4px 12px rgba(245,130,32,0.2);
  }
  .slg-btn-register:hover { background: #ff933a; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(245,130,32,0.3); }
`

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const groups = [
    {
      label: 'Explore',
      items: [
        { label: 'About', desc: 'Our mission and impact', icon: icons.users, href: isHome ? '#about' : '/#about' },
        { label: 'Features', desc: 'Tools for leadership', icon: icons.layers || icons.grid, href: isHome ? '#features' : '/#features' },
        { label: 'How it works', desc: 'Your learning journey', icon: icons.refreshCw || icons.sync, href: isHome ? '#how' : '/#how' },
        { label: 'Impact Stories', desc: 'Voices from citizens', icon: icons.award || icons.star, href: isHome ? '#stories' : '/stories' }
      ]
    },
    {
      label: 'Resources',
      items: [
        { label: 'In-Person Training', desc: 'Workshops in your region', icon: icons.graduationCap, href: isHome ? '#inperson' : '/#inperson' },
        { label: 'Public Library', desc: 'Policy and research guides', icon: icons.library, href: isHome ? '#public-library' : '/#public-library' },
        { label: 'News & Updates', desc: 'Latest from SLOGBAA', icon: icons.fileText, href: isHome ? '#news' : '/#news' },
        { label: 'Video Gallery', desc: 'Learn through digital media', icon: icons.blockVideo, href: isHome ? '#videos' : '/#videos' }
      ]
    }
  ]

  const LinkOrAnchor = ({ item, isDropdown }) => {
    const isHash = item.href.startsWith('#') || item.href.startsWith('/#')
    const className = isDropdown ? 'slg-dropdown-link' : 'slg-nav-link'

    const content = isDropdown ? (
      <>
        <div className="slg-dropdown-icon">
          <Icon icon={item.icon} size={16} />
        </div>
        <div className="slg-dropdown-content">
          <span className="slg-dropdown-label">{item.label}</span>
          <span className="slg-dropdown-desc">{item.desc}</span>
        </div>
      </>
    ) : item.label

    if (isHash) return <a href={item.href} className={className}>{content}</a>
    return <Link to={item.href} className={`${className} ${location.pathname === item.href ? 'active' : ''}`}>{content}</Link>
  }

  return (
    <>
      <style>{NAV_CSS}</style>
      <nav className={`slg-nav ${scrolled ? 'scrolled' : ''} ${isHome ? 'transparent' : ''}`}>
        <Link to="/" className="slg-logo-wrap">
          <Logo variant="full" size={28} color={theme === 'dark' ? 'white' : 'dark'} />
        </Link>

        <div className="slg-nav-links">
          {groups.map(group => (
            <div key={group.label} className="slg-nav-group">
              <button className="slg-nav-trigger">
                {group.label}
                <Icon icon={icons.chevronDown || icons.arrowRight} size={12} className="slg-nav-chevron" />
              </button>
              <div className="slg-nav-dropdown">
                {group.items.map(item => (
                  <LinkOrAnchor key={item.label} item={item} isDropdown />
                ))}
              </div>
            </div>
          ))}
          <LinkOrAnchor item={{ label: 'Support', href: '/inquiries' }} isDropdown={false} />
        </div>

        <div className="slg-nav-actions">
          <button
            onClick={toggleTheme}
            className="slg-theme-toggle"
            title="Toggle theme"
          >
            <Icon icon={theme === 'dark' ? icons.sun : icons.moon} size={16} />
          </button>
          <Link to="/auth/login" className="slg-btn-signin">Sign in</Link>
          <Link to="/auth/register" className="slg-btn-register">Register Free</Link>
        </div>
      </nav>
    </>
  )
}
