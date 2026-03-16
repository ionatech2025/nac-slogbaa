/**
 * Reusable filter and sort bar for admin list views (Learning, Library, etc.).
 *
 * Props:
 *   - searchPlaceholder: string
 *   - searchValue, onSearchChange: controlled search
 *   - filters: [{ key, label, options: [{ value, label }] }]
 *   - filterValues: { [key]: value }
 *   - onFilterChange: (key, value) => void
 *   - sortOptions: [{ value, label }]  e.g. { value: 'title:asc', label: 'Title A–Z' }
 *   - sortValue, onSortChange: controlled sort
 *   - compact: boolean – use compact layout
 */
import { FontAwesomeIcon, icons } from '../icons.jsx'

const styles = {
  bar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  searchWrap: {
    position: 'relative',
    flex: '1 1 200px',
    minWidth: 160,
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.875rem',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
  },
  select: {
    padding: '0.5rem 2rem 0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.6rem center',
  },
}

export function FilterSortBar({
  searchPlaceholder = 'Search…',
  searchValue = '',
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  sortOptions = [],
  sortValue = '',
  onSortChange,
  compact = false,
}) {
  return (
    <div style={{ ...styles.bar, ...(compact ? { marginBottom: '0.75rem', gap: '0.5rem' } : {}) }}>
      {onSearchChange && (
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon} aria-hidden>
            <FontAwesomeIcon icon={icons.search} />
          </span>
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            style={styles.input}
            aria-label="Search"
          />
        </div>
      )}
      {filters.map((f) => (
        <select
          key={f.key}
          value={filterValues[f.key] ?? 'all'}
          onChange={(e) => onFilterChange?.(f.key, e.target.value)}
          style={styles.select}
          aria-label={f.label}
        >
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      {sortOptions.length > 0 && onSortChange && (
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          style={styles.select}
          aria-label="Sort by"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
