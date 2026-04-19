import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const CTA_CSS = `
  .slg-cta-band {
    position: relative; padding: clamp(3.5rem, 7vw, 6rem) 2rem; text-align: center;
    overflow: hidden;
    background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(245,130,32,0.1) 0%, transparent 65%);
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif;
  }
  .slg-cta-band-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
    background-image: linear-gradient(var(--border-hover) 1px, transparent 1px),
      linear-gradient(90deg, var(--border-hover) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .slg-cta-title { 
    font-size: clamp(1.75rem, 4vw, 2.75rem); 
    font-weight: 300; 
    letter-spacing: -0.025em; 
    color: var(--text); 
    margin-bottom: 1rem; 
    position: relative; 
    line-height: 1.2;
  }
  .slg-cta-title em { font-style: normal; font-family: 'DM Serif Display', Georgia, serif; color: var(--orange); }
  .slg-cta-text { font-size: 1rem; color: var(--text-2); max-width: 460px; margin: 0 auto 2.5rem; line-height: 1.7; position: relative; }
  .slg-cta-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; position: relative; }

  .slg-cta-btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.75rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600;
    color: #fff; background: var(--orange); text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(245,130,32,0.3);
  }
  .slg-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,130,32,0.4); }

  .slg-cta-btn-secondary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.75rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 500;
    color: var(--text); background: var(--surface); text-decoration: none;
    border: 1px solid var(--border); transition: border-color 0.15s, background 0.15s;
  }
  .slg-cta-btn-secondary:hover { border-color: var(--border-hover); background: var(--surface-2); }
`

export function CtaSection() {
  const { theme } = useTheme()

  return (
    <>
      <style>{CTA_CSS}</style>
      <div className={`slg-cta-band ${theme}-theme`}>
        <div className="slg-cta-band-grid" />
        <h2 className="slg-cta-title">
          Ready to start your<br /><em>learning journey?</em>
        </h2>
        <p className="slg-cta-text">
          Join thousands of citizens building the skills to make a real difference in their communities across Uganda.
        </p>
        <div className="slg-cta-actions">
          <Link to="/auth/register" className="slg-cta-btn-primary">
            Register Free
          </Link>
          <Link to="/auth/login" className="slg-cta-btn-secondary">
            Continue Learning
          </Link>
        </div>
      </div>
    </>
  )
}
