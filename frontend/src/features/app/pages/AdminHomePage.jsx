import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { AdminNavigatePills } from '../components/admin/AdminNavigatePills.jsx'

const s = {
  wrap: { maxWidth: 640 },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.375rem',
    fontWeight: 700,
    color: 'var(--slogbaa-blue)',
  },
  lead: {
    margin: '0 0 1.25rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.55,
  },
  card: {
    padding: '1.25rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  cardTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  cardText: {
    margin: '0 0 1rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
  linkReports: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginTop: '1rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text-muted)',
    textDecoration: 'none',
  },
}

/**
 * Super Admin landing page shell — reserved for future public landing page setup.
 * Analytics live under Reports & Analytics; homepage sections are in Homepage CMS.
 */
export function AdminHomePage() {
  useDocumentTitle('Landing page')

  return (
    <div style={s.wrap}>
      <Breadcrumbs items={[{ label: 'Landing page' }]} />
      <h2 style={s.title}>Landing page</h2>
      <p style={s.lead}>
        This space will be used to configure the public site landing experience. A dedicated editor
        and previews will be added here later.
      </p>
      <div style={s.card} className="glass-enter">
        <h3 style={s.cardTitle}>Homepage content (today)</h3>
        <p style={s.cardText}>
          Banners, stories, videos, partners, and news are managed in Homepage CMS. Changes apply to
          the public homepage immediately.
        </p>
        <Link to="/admin/cms" style={s.link}>
          <Icon icon={icons.home} size={16} aria-hidden />
          Open Homepage CMS
        </Link>
        <div>
          <Link to="/admin/reports" style={s.linkReports}>
            <Icon icon={icons.reports} size={14} aria-hidden />
            View Reports &amp; Analytics
          </Link>
        </div>
      </div>
      <AdminNavigatePills />
    </div>
  )
}
