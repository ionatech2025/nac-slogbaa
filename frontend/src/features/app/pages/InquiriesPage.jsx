import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'

const INQUIRIES_CSS = `
  .slg-inquiries { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  
  .slg-inquiries-hero {
    padding: 6rem 2rem 4rem; text-align: center; background: var(--bg-2);
    border-bottom: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .slg-hero-glow {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 600px; height: 300px; background: radial-gradient(circle, var(--orange-glow) 0%, transparent 70%);
    pointer-events: none; opacity: 0.5;
  }

  .slg-inquiries-grid {
    max-width: 1100px; margin: 0 auto; padding: 5rem 2rem;
    display: grid; grid-template-columns: 1.2fr 1fr; gap: 6rem;
  }
  @media (max-width: 900px) { .slg-inquiries-grid { grid-template-columns: 1fr; gap: 4rem; } }

  /* Form Styling */
  .slg-contact-form { display: flex; flex-direction: column; gap: 1.5rem; }
  .slg-form-group { display: flex; flex-direction: column; gap: 0.5rem; }
  .slg-form-label { font-size: 0.8125rem; font-weight: 700; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.05em; }
  .slg-input {
    padding: 0.875rem 1.125rem; border-radius: 12px; border: 1px solid var(--border);
    background: var(--bg); color: var(--text); font-family: inherit; font-size: 1rem;
    transition: all 0.2s;
  }
  .slg-input:focus { outline: none; border-color: var(--orange); box-shadow: 0 0 0 4px var(--orange-glow); }
  
  .slg-btn-submit {
    padding: 1rem; border-radius: 12px; border: none; background: var(--orange);
    color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .slg-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(245,130,32,0.3); }

  /* FAQ Accordion */
  .slg-faq-item { border-bottom: 1px solid var(--border); }
  .slg-faq-trigger {
    width: 100%; padding: 1.5rem 0; display: flex; align-items: center; justify-content: space-between;
    background: none; border: none; cursor: pointer; text-align: left;
    color: var(--text); font-size: 1.0625rem; font-weight: 600; transition: color 0.2s;
  }
  .slg-faq-trigger:hover { color: var(--orange); }
  .slg-faq-content {
    max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-2); font-size: 0.9375rem; line-height: 1.7;
  }
  .slg-faq-item.active .slg-faq-content { max-height: 200px; padding-bottom: 1.5rem; }
  .slg-faq-icon { transition: transform 0.3s; color: var(--text-3); }
  .slg-faq-item.active .slg-faq-icon { transform: rotate(45deg); color: var(--orange); }

  .slg-contact-info { margin-top: 3rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .slg-info-item { display: flex; align-items: center; gap: 1rem; color: var(--text-2); font-size: 0.9375rem; }
  .slg-info-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--bg-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--orange); }
`

const FAQS = [
  { q: 'How do I register for an in-person workshop?', a: 'Registration is simple! Visit our In-Person Training page, find an upcoming workshop, and click "View Details". You can then register directly through the modal.' },
  { q: 'Can I request a custom training for my district?', a: 'Absolutely. We regularly coordinate with local government and civil society leaders to bring SLOGBAA trainers to specific regions. Use the form to submit your request.' },
  { q: 'Are there costs associated with these workshops?', a: 'Most of our basic civic leadership workshops are supported by partners and free for participants. Advanced or specialized certification tracks may involve a material fee.' },
  { q: 'What happens after I submit an inquiry?', a: 'Our field coordination team will review your message and respond via email within 48 business hours. For urgent training requests, please include your phone number.' }
]

export function InquiriesPage() {
  const [theme, setTheme] = useState('light')
  const [activeFaq, setActiveFaq] = useState(0)

  return (
    <div className={`slg-page slg-inquiries ${theme}-theme`}>
      <style>{INQUIRIES_CSS}</style>

      {/* Nav */}
      <nav className="slg-nav">
        <Link to="/" className="slg-logo-wrap">
          <Logo variant="full" size={28} color={theme === 'dark' ? 'white' : 'dark'} />
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/inperson-training" className="slg-nav-link">Trainings</Link>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="slg-theme-toggle"
          >
            <Icon icon={theme === 'dark' ? icons.sun : icons.moon} size={16} />
          </button>
          <Link to="/" className="slg-btn-ghost">Back home</Link>
        </div>
      </nav>

      <header className="slg-inquiries-hero">
        <div className="slg-hero-glow" />
        <span className="slg-eyebrow">Contact Support</span>
        <h1 className="slg-section-title slg-serif" style={{ fontSize: '3.5rem' }}>
          Get in <em>Touch</em>
        </h1>
        <p className="slg-section-desc" style={{ maxWidth: 600, margin: '1.5rem auto 0', color: 'var(--text-2)' }}>
          Have questions about our training programs or want to bring SLOGBAA to your community? Our team is here to help.
        </p>
      </header>

      <main className="slg-inquiries-grid">
        <section>
          <h2 className="slg-section-title" style={{ fontSize: '1.75rem', marginBottom: '2.5rem' }}>
            Send us a <em>Message</em>
          </h2>
          <form className="slg-contact-form" onSubmit={e => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="slg-form-group">
                <label className="slg-form-label">Full Name</label>
                <input type="text" className="slg-input" placeholder="e.g. Jane Doe" required />
              </div>
              <div className="slg-form-group">
                <label className="slg-form-label">Email Address</label>
                <input type="email" className="slg-input" placeholder="jane@example.com" required />
              </div>
            </div>
            <div className="slg-form-group">
              <label className="slg-form-label">Subject</label>
              <select className="slg-input">
                <option>General Inquiry</option>
                <option>Training Request</option>
                <option>Partnership Proposal</option>
                <option>Technical Support</option>
              </select>
            </div>
            <div className="slg-form-group">
              <label className="slg-form-label">Message</label>
              <textarea className="slg-input" rows={5} placeholder="How can we help you?" required />
            </div>
            <button type="submit" className="slg-btn-submit">
              Send Message <Icon icon={icons.arrowRight} size={18} />
            </button>
          </form>

          <div className="slg-contact-info">
            <div className="slg-info-item">
              <div className="slg-info-icon"><Icon icon={icons.mail} size={18} /></div>
              <span>support@nac.go.ug</span>
            </div>
            <div className="slg-info-item">
              <div className="slg-info-icon"><Icon icon={icons.mapPin} size={18} /></div>
              <span>Kampala, Uganda — NAC Headquarters</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="slg-section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
            Common <em>Questions</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FAQS.map((faq, idx) => (
              <div key={idx} className={`slg-faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <button className="slg-faq-trigger" onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}>
                  <span>{faq.q}</span>
                  <div className="slg-faq-icon">
                    <Icon icon={icons.plus || icons.arrowRight} size={20} />
                  </div>
                </button>
                <div className="slg-faq-content">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="slg-footer">
        <Logo variant="full" size={24} color={theme === 'dark' ? 'white' : 'dark'} style={{ opacity: 0.5 }} />
        <p className="slg-copyright" style={{ marginTop: '1rem' }}>&copy; {new Date().getFullYear()} NAC. Empowering Citizens.</p>
      </footer>
    </div>
  )
}
