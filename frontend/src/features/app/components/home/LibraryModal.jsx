import { Icon, icons } from '../../../../shared/icons.jsx'
import { MarkdownContent } from '../../../../shared/components/MarkdownContent.jsx'

export function LibraryModal({ resource, onClose }) {
  if (!resource) return null

  return (
    <div className="slg-modal-overlay" onClick={onClose}>
      <div className="slg-modal-box" onClick={e => e.stopPropagation()}>
        <div className="slg-modal-content">
          <div className="slg-modal-left">
            <img
              src={resource.imageUrl || resource.image || 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=600&auto=format&fit=crop'}
              alt=""
              className="slg-modal-cover"
            />
          </div>
          <div className="slg-modal-right">
            <button className="slg-modal-close" onClick={onClose}>
              <Icon icon={icons.close} size={20} />
            </button>

            <div className="slg-modal-body">
              <span className="slg-feature-tag" style={{ background: 'var(--orange-dim)', color: 'var(--orange)', marginBottom: '1.25rem' }}>
                {resource.category || resource.tag}
              </span>
              <h2 className="slg-serif" style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text)' }}>
                {resource.title}
              </h2>
              <div style={{ height: '4px', width: '50px', background: 'var(--orange)', borderRadius: '2px', marginBottom: '2rem' }} />
              <MarkdownContent
                markdown={resource.description || resource.fullDesc}
                style={{ fontSize: '1.0625rem', color: 'var(--text-2)', lineHeight: 1.8 }}
              />
            </div>

            <div className="slg-modal-footer">
              <button
                onClick={() => { if (resource.fileUrl) window.open(resource.fileUrl, '_blank') }}
                className="slg-btn-orange"
                style={{
                  width: '100%',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  fontSize: '1.0625rem',
                  borderRadius: '16px',
                  fontWeight: 700
                }}
              >
                Download Document Resource <Icon icon={icons.download} size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
