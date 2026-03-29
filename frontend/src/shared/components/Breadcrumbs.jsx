import { Link } from 'react-router-dom'

const s = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.35rem',
    marginBottom: '1.25rem',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  link: {
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'opacity 0.15s',
  },
  current: {
    color: 'var(--slogbaa-text)',
    fontWeight: 600,
  },
  separator: {
    color: 'var(--slogbaa-border)',
    fontSize: '0.75rem',
    userSelect: 'none',
    margin: '0 0.1rem',
  },
}

/**
 * Breadcrumbs — auto-generated from route handles or manual items.
 *
 * Usage A (manual items):
 *   <Breadcrumbs items={[{ label: 'Learning', to: '/admin/learning' }, { label: 'Course Name' }]} />
 *
 * Usage B (auto from route handles):
 *   In route definition: handle: { crumb: 'Learning' }
 *   <Breadcrumbs />
 */
export function Breadcrumbs({ items }) {
  const crumbs = Array.isArray(items) ? items : []

  if (crumbs.length === 0) return null

  return (
    <nav style={s.nav} aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.label + i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            {i > 0 && <span style={s.separator} aria-hidden="true">/</span>}
            {isLast || !crumb.to ? (
              <span style={s.current} aria-current="page">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} style={s.link}>{crumb.label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
