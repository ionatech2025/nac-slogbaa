import { useState, useMemo, useEffect } from 'react'

const s = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    padding: '0.875rem 0',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    height: 32,
    padding: '0 0.5rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  btnActive: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    borderColor: 'var(--slogbaa-blue)',
    fontWeight: 600,
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'default',
    pointerEvents: 'none',
  },
  ellipsis: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    height: 32,
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.875rem',
    userSelect: 'none',
  },
  sizeSelect: {
    padding: '0.3rem 0.5rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 6,
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    cursor: 'pointer',
  },
}

/**
 * Build page number array with ellipsis.
 * Always shows first, last, and pages around current.
 */
function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (currentPage > 3) pages.push('...')
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage < totalPages - 2) pages.push('...')
  if (totalPages > 1) pages.push(totalPages)
  return pages
}

/**
 * Pagination — page controls with size selector.
 *
 * @param {number} currentPage - 1-indexed current page
 * @param {number} totalItems - Total number of items
 * @param {number} pageSize - Items per page
 * @param {(page: number) => void} onPageChange
 * @param {(size: number) => void} [onPageSizeChange]
 * @param {number[]} [pageSizeOptions] - e.g. [10, 20, 50]
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalItems)

  const pages = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages])

  if (totalItems <= pageSizeOptions[0] && totalPages <= 1) return null

  return (
    <div style={s.wrap}>
      <div style={s.info}>
        <span>
          Showing <strong>{from}</strong>–<strong>{to}</strong> of <strong>{totalItems}</strong>
        </span>
        {onPageSizeChange && (
          <>
            <span style={{ color: 'var(--slogbaa-border)' }}>|</span>
            <select
              style={s.sizeSelect}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>{sz} / page</option>
              ))}
            </select>
          </>
        )}
      </div>

      <nav style={s.controls} aria-label="Pagination">
        <button
          style={{ ...s.btn, ...(currentPage <= 1 ? s.btnDisabled : {}) }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          &#8249;
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} style={s.ellipsis}>...</span>
          ) : (
            <button
              key={p}
              style={{ ...s.btn, ...(p === currentPage ? s.btnActive : {}) }}
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          )
        )}

        <button
          style={{ ...s.btn, ...(currentPage >= totalPages ? s.btnDisabled : {}) }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          &#8250;
        </button>
      </nav>
    </div>
  )
}

/**
 * Hook to manage pagination state with client-side slicing.
 */
export function usePagination(items, initialPageSize = 20) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const list = Array.isArray(items) ? items : []
  const totalItems = list.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(page, totalPages)

  // Reset page when filtered results shrink below current page
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return list.slice(start, start + pageSize)
  }, [list, safePage, pageSize])

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setPage(1)
  }

  return {
    page: safePage,
    pageSize,
    totalItems,
    paginatedItems,
    setPage,
    setPageSize: handlePageSizeChange,
  }
}
