import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'

/* ─── Social Icons (Moved from HomePage for reuse) ─────────────────────────── */
function FacebookSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}
function TwitterSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function WhatsAppSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
function YoutubeSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

const FOOTER_CSS = `
  .slg-footer { background: var(--bg-2); border-top: 1px solid var(--border); padding: 4rem 2rem 2rem; font-family: 'DM Sans', sans-serif; }
  .slg-footer-inner { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 3.5rem; }
  @media (max-width: 768px) { .slg-footer-inner { grid-template-columns: 1fr 1fr; gap: 2.5rem; } }
  @media (max-width: 480px) { .slg-footer-inner { grid-template-columns: 1fr; } }

  .slg-footer-title { font-size: 0.8125rem; font-weight: 700; color: var(--text); margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .slg-footer-text { font-size: 0.875rem; color: var(--text-2); line-height: 1.6; }
  .slg-footer-link { display: block; font-size: 0.875rem; color: var(--text-2); text-decoration: none; padding: 0.35rem 0; transition: all 0.2s; }
  .slg-footer-link:hover { color: var(--orange); transform: translateX(4px); }
  
  .slg-social-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 9px; border: 1px solid var(--border);
    background: var(--surface); color: var(--text-2); text-decoration: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slg-social-btn:hover { border-color: var(--orange); color: var(--orange); background: var(--orange-dim); transform: translateY(-3px) rotate(4deg); }
  .slg-footer-socials { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem; }
  
  .slg-footer-bottom {
    max-width: 1120px; margin: 3.5rem auto 0; padding-top: 2rem;
    border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  }
  .slg-copyright { font-size: 0.8125rem; color: var(--text-3); font-weight: 500; }
`

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/networkforactivecitizens/', SvgIcon: FacebookSvg },
  { label: 'WhatsApp', href: 'https://wa.me/256784315251', SvgIcon: WhatsAppSvg },
]

export function Footer() {
  const { theme } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const LinkOrAnchor = ({ href, children, ...props }) => {
    const isExternal = href.startsWith('http')
    const isHash = href.startsWith('#')

    if (isExternal) return <a href={href} target="_blank" rel="noopener noreferrer" className="slg-footer-link" {...props}>{children}</a>
    if (isHash && isHome) return <a href={href} className="slg-footer-link" {...props}>{children}</a>
    if (isHash && !isHome) return <Link to={`/${href}`} className="slg-footer-link" {...props}>{children}</Link>
    return <Link to={href} className="slg-footer-link" {...props}>{children}</Link>
  }

  return (
    <>
      <style>{FOOTER_CSS}</style>
      <footer className={`slg-footer ${theme}-theme`}>
        <div className="slg-footer-inner">
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Logo variant="full" size={28} color={theme === 'dark' ? 'white' : 'dark'} />
            </div>
            <p className="slg-footer-text" style={{ maxWidth: 240 }}>
              NAC&rsquo;s inclusive online platform for civic leadership, advocacy, and community-led development across Uganda.
            </p>
            <div className="slg-footer-socials">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="slg-social-btn"
                  aria-label={link.label}
                >
                  <link.SvgIcon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="slg-footer-title">Platform</h4>
            <LinkOrAnchor href="/auth/login">Login</LinkOrAnchor>
            <LinkOrAnchor href="/auth/register">Become a Trainee</LinkOrAnchor>
            <LinkOrAnchor href="#features">Key Features</LinkOrAnchor>
            <LinkOrAnchor href="#how">How it Works</LinkOrAnchor>
          </div>

          <div>
            <h4 className="slg-footer-title">Explore</h4>
            <LinkOrAnchor href="/stories">Impact Stories</LinkOrAnchor>
            <LinkOrAnchor href="/news-and-updates">News & Updates</LinkOrAnchor>
            <LinkOrAnchor href="/videos">Video Gallery</LinkOrAnchor>
            <LinkOrAnchor href="/public-library">Public Library</LinkOrAnchor>
            <LinkOrAnchor href="/inperson-training">Workshops</LinkOrAnchor>
          </div>

          <div>
            <h4 className="slg-footer-title">Connect</h4>
            <p className="slg-footer-text" style={{ marginBottom: '0.5rem' }}>Network for Active Citizens</p>
            <p className="slg-footer-text" style={{ marginBottom: '0.5rem' }}>support@nac.go.ug</p>
            <p className="slg-footer-text" style={{ fontStyle: 'italic' }}>Kampala, Uganda</p>
            <div style={{ marginTop: '1.5rem' }}>
              <LinkOrAnchor href="/inquiries" style={{ fontWeight: 700, color: 'var(--orange)' }}>Send Inquiry &rarr;</LinkOrAnchor>
            </div>
          </div>
        </div>

        <div className="slg-footer-bottom">
          <p className="slg-copyright">
            &copy; {new Date().getFullYear()} School of Local Governance Budget Advocacy and Acountability (SLOGBAA). All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <LinkOrAnchor href="/privacy" style={{ fontSize: '0.75rem' }}>Privacy Policy</LinkOrAnchor>
            <LinkOrAnchor href="/terms" style={{ fontSize: '0.75rem' }}>Terms of Service</LinkOrAnchor>
          </div>
        </div>
      </footer>
    </>
  )
}
