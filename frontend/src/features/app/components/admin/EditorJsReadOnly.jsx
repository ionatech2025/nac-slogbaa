import { SafeHtml, sanitizeHtml } from '../../../../shared/components/SafeHtml.jsx'

const blockWrapperStyle = {
  marginBottom: '1.25rem',
  padding: '1rem 1.25rem',
  background: 'var(--slogbaa-surface)',
  border: '1px solid var(--slogbaa-border)',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
}

// Variants for distinct block types (left border only on focused block via parent; quote gets right blue border)
const listBlockStyle = { ...blockWrapperStyle }
const tableBlockStyle = { ...blockWrapperStyle }
const quoteBlockStyle = { ...blockWrapperStyle, background: 'rgba(39, 129, 191, 0.04)', borderRight: '4px solid var(--slogbaa-blue)' }
const embedBlockStyle = { ...blockWrapperStyle }
const imageBlockStyle = { ...blockWrapperStyle }

/**
 * Renders Editor.js JSON output as read-only HTML. Use for trainee/public view.
 * Each internal block (paragraph, list, table, quote, etc.) is wrapped in a distinct container.
 */
export function EditorJsReadOnly({ data, className, style = {} }) {
  if (!data) return null
  let blocks = []
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      blocks = parsed?.blocks ?? []
    } catch {
      return null
    }
  } else if (Array.isArray(data?.blocks)) {
    blocks = data.blocks
  }

  if (!blocks.length) return null

  const getWrapperStyle = (block) => {
    const t = block?.type
    if (t === 'list') return listBlockStyle
    if (t === 'table') return tableBlockStyle
    if (t === 'quote') return quoteBlockStyle
    if (t === 'embed') return embedBlockStyle
    if (t === 'image') return imageBlockStyle
    return blockWrapperStyle
  }

  return (
    <div className={className} style={{ ...style, fontSize: '0.9375rem', lineHeight: 1.6 }}>
      {blocks.map((block, i) => (
        <div key={i} style={getWrapperStyle(block)}>
          <EditorJsBlockView block={block} />
        </div>
      ))}
    </div>
  )
}

function EditorJsBlockView({ block }) {
  if (!block || !block.type) return null
  const { type, data } = block

  if (type === 'paragraph' && data?.text) {
    return <SafeHtml html={data.text} as="p" style={{ margin: 0 }} />
  }
  if (type === 'header' && data?.text) {
    const level = `h${Math.min(6, Math.max(1, data.level ?? 2))}`
    return <SafeHtml html={data.text} as={level} style={{ margin: 0, fontWeight: 700 }} />
  }
  if (type === 'list' && Array.isArray(data?.items)) {
    const isOrdered = data.style === 'ordered'
    const itemText = (item) => (typeof item === 'string' ? item : item?.content ?? '')
    const hasNested = (item) => Array.isArray(item?.items) && item.items.length > 0
    const renderItem = (item, i) => {
      const text = itemText(item)
      if (hasNested(item)) {
        const nestedOrdered = data.style === 'ordered'
        const ListTag = nestedOrdered ? 'ol' : 'ul'
        return (
          <li key={i}>
            {text && <SafeHtml html={text} as="span" />}
            <ListTag style={{ margin: '0.25rem 0 0', paddingLeft: '1.5rem' }}>
              {item.items.map((nested, j) => renderItem(nested, j))}
            </ListTag>
          </li>
        )
      }
      return <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />
    }
    const ListTag = isOrdered ? 'ol' : 'ul'
    return (
      <ListTag style={{ margin: 0, paddingLeft: '1.5rem' }}>
        {data.items.map(renderItem)}
      </ListTag>
    )
  }
  if (type === 'image') {
    const url = data?.file?.url ?? data?.url
    const caption = data?.caption ?? data?.file?.caption ?? ''
    if (url || caption) {
      return (
        <figure style={{ margin: 0 }}>
          {url && (
            <img
              src={url}
              alt={caption || 'Module image'}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
              loading="lazy"
            />
          )}
          {caption && (
            <figcaption style={{ marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', fontStyle: 'italic' }}>
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }
    return null
  }
  if (type === 'embed') {
    const embedUrl = data?.embed ?? data?.url
    if (embedUrl) {
      return (
        <div style={{ margin: 0, aspectRatio: '16/9', maxWidth: 560 }}>
          <iframe
            src={embedUrl}
            title="Embedded content"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
            allowFullScreen
          />
        </div>
      )
    }
    if (data?.caption) {
      return <p style={{ margin: '0.5rem 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>{data.caption}</p>
    }
    return null
  }
  if (type === 'quote' && (data?.text || data?.caption)) {
    return (
      <blockquote style={{ margin: 0, paddingLeft: '1rem', color: 'var(--slogbaa-text-muted)', fontStyle: 'italic' }}>
        {data.text && <SafeHtml html={data.text} as="p" style={{ margin: 0 }} />}
        {data.caption && <SafeHtml html={data.caption} as="cite" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.875rem' }} />}
      </blockquote>
    )
  }
  if (type === 'delimiter') {
    return (
      <div style={{ margin: 0, textAlign: 'center', color: 'var(--slogbaa-text-muted)' }}>
        * * *
      </div>
    )
  }
  if (type === 'warning' && (data?.title || data?.message)) {
    return (
      <div style={{ margin: 0, padding: '1rem', background: 'rgba(37, 99, 235, 0.08)', borderLeft: '4px solid var(--slogbaa-blue)', borderRadius: 6 }}>
        {data.title && <SafeHtml html={data.title} as="strong" style={{ display: 'block', marginBottom: '0.25rem' }} />}
        {data.message && <SafeHtml html={data.message} />}
      </div>
    )
  }
  if (type === 'table' && Array.isArray(data?.content)) {
    const rows = data.content
    const withHeadings = data.withHeadings === true
    return (
      <div style={{ margin: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
          {withHeadings && rows.length > 0 && (
            <thead>
              <tr>
                {rows[0].map((cell, j) => (
                  <th key={j} style={{ border: '1px solid var(--slogbaa-border)', padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(cell) }} />
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {(withHeadings ? rows.slice(1) : rows).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ border: '1px solid var(--slogbaa-border)', padding: '0.5rem 0.75rem' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if (type === 'code' && data?.code != null) {
    const code = String(data.code)
    return (
      <pre style={{ margin: 0, padding: '1rem', background: 'var(--slogbaa-bg-secondary)', borderRadius: 8, overflow: 'auto', fontSize: '0.875rem', lineHeight: 1.5 }}>
        <code style={{ fontFamily: 'ui-monospace, monospace' }}>{code}</code>
      </pre>
    )
  }
  return null
}

/** True if string looks like Editor.js output. */
export function isEditorJsJson(str) {
  if (!str || typeof str !== 'string') return false
  const t = str.trim()
  if (!t.startsWith('{')) return false
  try {
    const o = JSON.parse(t)
    return o != null && typeof o === 'object' && 'blocks' in o
  } catch {
    return false
  }
}
