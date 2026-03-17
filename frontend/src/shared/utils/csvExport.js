/**
 * CSV Export utility — converts array of objects to CSV and triggers browser download.
 * Properly escapes commas, quotes, and newlines per RFC 4180.
 */

function escapeCell(value) {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Export an array of objects as a CSV file download.
 *
 * @param {Object[]} data - Array of objects
 * @param {Object} options
 * @param {string} options.filename - Filename without extension
 * @param {string[]} [options.columns] - Column keys to include (default: all keys from first row)
 * @param {Object} [options.headers] - Map of column key to display header (default: key as-is)
 */
export function exportToCsv(data, { filename = 'export', columns, headers = {} } = {}) {
  if (!data || data.length === 0) return

  const cols = columns || Object.keys(data[0])
  const headerRow = cols.map((col) => escapeCell(headers[col] || col))
  const rows = data.map((row) =>
    cols.map((col) => escapeCell(row[col])).join(',')
  )

  const csv = [headerRow.join(','), ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()

  // Cleanup
  setTimeout(() => {
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, 100)
}
