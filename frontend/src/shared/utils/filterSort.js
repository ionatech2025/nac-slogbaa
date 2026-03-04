/**
 * Reusable filter and sort utilities for admin list views.
 * Use with FilterSortBar component for a consistent UX across Learning, Library, etc.
 */

/**
 * Filter items by search text across specified string fields.
 * @param {Array} items - Array of objects to filter
 * @param {string} search - Search query (case-insensitive)
 * @param {string[]} searchFields - Object keys to search (e.g. ['title', 'description'])
 * @returns {Array}
 */
export function filterBySearch(items, search, searchFields = ['title']) {
  if (!search || !search.trim()) return items
  const q = search.trim().toLowerCase()
  return items.filter((item) =>
    searchFields.some((field) => {
      const val = item[field]
      return typeof val === 'string' && val.toLowerCase().includes(q)
    })
  )
}

/**
 * Filter items by a named filter (e.g. status: 'all' | 'published' | 'draft').
 * @param {Array} items - Array of objects to filter
 * @param {Object} filters - Map of filterKey -> selectedValue
 * @param {Object} filterConfig - Map of filterKey -> { getValue: (item) => value, options: [{value, label}] }
 * @returns {Array}
 */
export function filterByFilters(items, filters, filterConfig = {}) {
  let result = items
  for (const [key, selectedValue] of Object.entries(filters)) {
    if (!selectedValue || selectedValue === 'all') continue
    const config = filterConfig[key]
    if (!config?.getValue) continue
    result = result.filter((item) => {
      const itemValue = config.getValue(item)
      return String(itemValue) === String(selectedValue)
    })
  }
  return result
}

/**
 * Sort items by field and direction.
 * @param {Array} items - Array of objects to sort
 * @param {string} sortBy - Field name or 'field:dir' e.g. 'title:asc', 'moduleCount:desc'
 * @param {Object} sortConfig - Optional { getValue: (item, field) => comparableValue }
 * @returns {Array}
 */
export function sortItems(items, sortBy, sortConfig = {}) {
  if (!sortBy) return [...items]
  const [field, dir = 'asc'] = sortBy.split(':')
  const asc = dir !== 'desc'
  const getVal = sortConfig.getValue ?? ((item, f) => item[f])

  return [...items].sort((a, b) => {
    const va = getVal(a, field)
    const vb = getVal(b, field)
    // Handle booleans: false < true for asc
    if (typeof va === 'boolean' && typeof vb === 'boolean') {
      return asc ? (va === vb ? 0 : va ? 1 : -1) : (va === vb ? 0 : va ? -1 : 1)
    }
    if (typeof va === 'number' && typeof vb === 'number') {
      return asc ? va - vb : vb - va
    }
    // ISO date strings sort correctly with localeCompare
    if (typeof va === 'string' && typeof vb === 'string' && /^\d{4}-\d{2}-\d{2}/.test(va) && /^\d{4}-\d{2}-\d{2}/.test(vb)) {
      const cmp = va.localeCompare(vb)
      return asc ? cmp : -cmp
    }
    const sa = String(va ?? '').toLowerCase()
    const sb = String(vb ?? '').toLowerCase()
    const cmp = sa.localeCompare(sb)
    return asc ? cmp : -cmp
  })
}

/**
 * Apply search, filters, and sort in one call.
 * @param {Array} items
 * @param {Object} options - { search, searchFields, filters, filterConfig, sortBy, sortConfig }
 * @returns {Array}
 */
export function filterAndSortItems(items, options = {}) {
  const {
    search = '',
    searchFields = ['title'],
    filters = {},
    filterConfig = {},
    sortBy = '',
    sortConfig = {},
  } = options

  let result = filterBySearch(items, search, searchFields)
  result = filterByFilters(result, filters, filterConfig)
  result = sortItems(result, sortBy, sortConfig)
  return result
}
