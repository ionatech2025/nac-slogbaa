import { useState, useMemo } from 'react'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.js'
import { Modal } from '../../../../shared/components/Modal.jsx'

const BLOCK_TYPES = [
  { value: 'TEXT', label: 'Text', icon: icons.blockText, category: 'Media' },
  { value: 'IMAGE', label: 'Image', icon: icons.blockImage, category: 'Media' },
  { value: 'VIDEO', label: 'Video', icon: icons.blockVideo, category: 'Media' },
  { value: 'ACTIVITY', label: 'Activity', icon: icons.blockActivity, category: 'Media' },
]

const styles = {
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    marginBottom: '1rem',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'none',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    outline: 'none',
  },
  searchInputPlaceholder: { color: 'var(--slogbaa-text-muted)' },
  categoryLabel: {
    margin: '0.75rem 0 0.5rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--slogbaa-text-muted)',
    paddingBottom: '0.35rem',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  optionList: {
    listStyle: 'none',
    margin: 0,
    padding: '0.5rem 0',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem 0.75rem',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.15s ease',
  },
  optionItemHover: {
    background: 'rgba(241, 134, 37, 0.12)',
    color: 'var(--slogbaa-orange)',
  },
  optionIcon: {
    width: '1.25em',
    color: 'inherit',
    opacity: 0.9,
  },
}

export function BlockTypePickerModal({ onClose, onSelect }) {
  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return BLOCK_TYPES
    const q = search.trim().toLowerCase()
    return BLOCK_TYPES.filter((t) => t.label.toLowerCase().includes(q))
  }, [search])

  return (
    <Modal title="Add block" onClose={onClose} maxWidth={340} showClose={true}>
      <div style={styles.searchWrap}>
        <FontAwesomeIcon icon={icons.search} style={{ color: 'var(--slogbaa-text-muted)', width: '1em' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search block types"
          style={styles.searchInput}
          autoFocus
        />
      </div>
      <p style={styles.categoryLabel}>Media</p>
      <ul style={styles.optionList}>
        {filtered.map((t) => (
          <li key={t.value}>
            <button
              type="button"
              style={{
                ...styles.optionItem,
                ...(hovered === t.value ? styles.optionItemHover : {}),
              }}
              onMouseEnter={() => setHovered(t.value)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(t.value)}
            >
              <FontAwesomeIcon icon={t.icon} style={styles.optionIcon} />
              {t.label}
            </button>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p style={{ margin: '1rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
          No matching block types.
        </p>
      )}
    </Modal>
  )
}
