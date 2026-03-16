import DOMPurify from 'dompurify'

const ALLOW_LIST = {
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'a',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'cite', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'figure', 'figcaption',
    'span', 'div', 'mark', 'sub', 'sup',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
    'class', 'style', 'id', 'colspan', 'rowspan',
  ],
  ALLOW_DATA_ATTR: false,
}

/**
 * Sanitize an HTML string using DOMPurify with a strict allow-list.
 * Force all links to open safely.
 */
export function sanitizeHtml(dirty) {
  if (!dirty) return ''
  const clean = DOMPurify.sanitize(dirty, ALLOW_LIST)
  return clean
}

// Ensure all anchor tags produced by DOMPurify get safe defaults
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('rel', 'noopener noreferrer')
    if (!node.getAttribute('target')) {
      node.setAttribute('target', '_blank')
    }
  }
})

/**
 * Renders sanitized HTML. Drop-in replacement for dangerouslySetInnerHTML.
 *
 * Usage: <SafeHtml html={untrustedString} as="div" style={...} className={...} />
 */
export function SafeHtml({ html, as: Tag = 'div', ...rest }) {
  if (!html) return null
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
}
