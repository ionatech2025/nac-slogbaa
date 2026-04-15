import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon, icons } from '../../shared/icons.jsx'
import { Logo } from './Logo.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'

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

  const navLinks = [
    { label: 'News', href: isHome ? '#news' : '/#news' },
    { label: 'In-Person Training', href: '/inperson-training' },
    { label: 'Public Library', href: isHome ? '#public-library' : '/#public-library' },
    { label: 'Inquiries', href: '/inquiries' }
  ]

  return (
    <nav className={`slg-nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="slg-logo-wrap">
        <Logo variant="full" size={28} color={theme === 'dark' ? 'white' : 'dark'} />
      </Link>

      <div className="slg-nav-links">
        {navLinks.map(link => (
          link.href.startsWith('#') || link.href.startsWith('/#') ? (
            <a key={link.label} href={link.href} className="slg-nav-link">{link.label}</a>
          ) : (
            <Link key={link.label} to={link.href} className="slg-nav-link">{link.label}</Link>
          )
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={toggleTheme}
          className="slg-theme-toggle"
          title="Toggle theme"
        >
          <Icon icon={theme === 'dark' ? icons.sun : icons.moon} size={16} />
        </button>
        <Link to="/auth/login" className="slg-btn-ghost">Login</Link>
        <Link to="/auth/register" className="slg-btn-orange">Get Started</Link>
      </div>
    </nav>
  )
}
