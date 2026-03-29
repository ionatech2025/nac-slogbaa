import { SafeHtml } from '../../../../shared/components/SafeHtml.jsx'
import { getAssetUrl } from '../../../../api/client.js'

/**
 * Editor.js image URLs: server paths use getAssetUrl(); legacy content used base64 data:image/…
 * (old ModuleEditorJs uploader) which getAssetUrl intentionally drops — allow those for display only.
 */
function resolveEditorImageSrc(rawUrl) {
  if (rawUrl == null) return ''
  const s = String(rawUrl).trim()
  if (!s) return ''
  if (/^data:image\//i.test(s)) return s
  return getAssetUrl(s)
}

/** Vertical rhythm between Editor.js blocks — no per-block “cards” (trainee view matches admin editor flow). */
const BLOCK_GAP = '1.125rem'

function blockOuterStyle(type) {
  if (type === 'delimiter') return { margin: '1.5rem 0' }
  return { marginBottom: BLOCK_GAP }
}

/**
 * Renders Editor.js JSON as one continuous reading surface (like the admin editor canvas).
 * Callouts (warning), code, tables, and media stay visually distinct without boxing every paragraph.
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

  return (
    <div
      className={className}
      style={{
        ...style,
        fontSize: '1rem',
        lineHeight: 1.65,
        color: 'var(--slogbaa-text)',
      }}
    >
      {blocks.map((block, i) => (
        <div key={i} style={blockOuterStyle(block?.type)}>
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
    const level = Math.min(6, Math.max(1, data.level ?? 2))
    const Tag = `h${level}`
    const size =
      level <= 1 ? '1.75rem' : level === 2 ? '1.4rem' : level === 3 ? '1.2rem' : '1.05rem'
    return (
      <SafeHtml
        html={data.text}
        as={Tag}
        style={{ margin: 0, fontWeight: 700, fontSize: size, lineHeight: 1.3 }}
      />
    )
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
      return (
        <li key={i}>
          <SafeHtml html={text} as="span" />
        </li>
      )
    }
    const ListTag = isOrdered ? 'ol' : 'ul'
    return (
      <ListTag style={{ margin: 0, paddingLeft: '1.5rem' }}>
        {data.items.map(renderItem)}
      </ListTag>
    )
  }
  if (type === 'image') {
    const rawUrl = data?.file?.url ?? data?.url
    const safeUrl = rawUrl ? resolveEditorImageSrc(rawUrl) : ''
    const caption = data?.caption ?? data?.file?.caption ?? ''
    if (safeUrl || caption) {
      return (
        <figure style={{ margin: 0 }}>
          {safeUrl && (
            <img
              src={safeUrl}
              alt={caption || 'Module image'}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
          {caption && (
            <figcaption
              style={{
                marginTop: '0.35rem',
                fontSize: '0.8125rem',
                color: 'var(--slogbaa-text-muted)',
                fontStyle: 'italic',
              }}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }
    return null
  }
  if (type === 'embed') {
    const rawEmbed = data?.embed ?? data?.url
    const safeEmbed = rawEmbed && /^https:\/\//i.test(String(rawEmbed).trim()) ? rawEmbed : ''
    if (safeEmbed) {
      return (
        <div style={{ margin: 0, aspectRatio: '16/9', maxWidth: 720 }}>
          <iframe
            src={safeEmbed}
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
      <blockquote
        style={{
          margin: 0,
          padding: '0.75rem 0 0.75rem 1rem',
          borderLeft: '4px solid var(--slogbaa-border)',
          color: 'var(--slogbaa-text-muted)',
          fontStyle: 'italic',
          background: 'rgba(148, 163, 184, 0.08)',
          borderRadius: '0 8px 8px 0',
        }}
      >
        {data.text && <SafeHtml html={data.text} as="p" style={{ margin: 0 }} />}
        {data.caption && (
          <SafeHtml
            html={data.caption}
            as="cite"
            style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.875rem', fontStyle: 'normal' }}
          />
        )}
      </blockquote>
    )
  }
  if (type === 'delimiter') {
    return (
      <hr
        style={{
          margin: 0,
          border: 'none',
          borderTop: '1px solid var(--slogbaa-border)',
          opacity: 0.85,
        }}
      />
    )
  }
  if (type === 'warning' && (data?.title || data?.message)) {
    return (
      <div
        style={{
          margin: 0,
          padding: '1rem 1.1rem',
          background: 'rgba(37, 99, 235, 0.08)',
          borderLeft: '4px solid var(--slogbaa-blue)',
          borderRadius: 8,
        }}
      >
        {data.title && <SafeHtml html={data.title} as="strong" style={{ display: 'block', marginBottom: '0.35rem' }} />}
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
                  <th
                    key={j}
                    style={{
                      border: '1px solid var(--slogbaa-border)',
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    <SafeHtml html={cell} as="span" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {(withHeadings ? rows.slice(1) : rows).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ border: '1px solid var(--slogbaa-border)', padding: '0.5rem 0.75rem' }}>
                    <SafeHtml html={cell} as="span" />
                  </td>
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
      <pre
        style={{
          margin: 0,
          padding: '1rem',
          background: 'var(--slogbaa-bg-secondary, rgba(0,0,0,0.2))',
          borderRadius: 8,
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          border: '1px solid var(--slogbaa-border)',
        }}
      >
        <code style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>{code}</code>
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
