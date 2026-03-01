/**
 * Renders Editor.js JSON output as read-only HTML. Use for trainee/public view.
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
    <div className={className} style={{ ...style, fontSize: '0.9375rem', lineHeight: 1.6 }}>
      {blocks.map((block, i) => (
        <EditorJsBlockView key={i} block={block} />
      ))}
    </div>
  )
}

function EditorJsBlockView({ block }) {
  if (!block || !block.type) return null
  const { type, data } = block

  if (type === 'paragraph' && data?.text) {
    return <p style={{ margin: '0 0 0.75rem' }} dangerouslySetInnerHTML={{ __html: data.text }} />
  }
  if (type === 'header' && data?.text) {
    const Level = `h${Math.min(6, Math.max(1, data.level ?? 2))}`
    return <Level style={{ margin: '1rem 0 0.5rem', fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: data.text }} />
  }
  if (type === 'list' && Array.isArray(data?.items)) {
    const style = data.style === 'ordered' ? 'decimal' : 'disc'
    return (
      <ul style={{ margin: '0 0 0.75rem', paddingLeft: '1.5rem', listStyleType: style }}>
        {data.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    )
  }
  if (type === 'image') {
    const url = data?.file?.url ?? data?.url
    const caption = data?.caption ?? data?.file?.caption ?? ''
    if (url || caption) {
      return (
        <figure style={{ margin: '1rem 0' }}>
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
        <div style={{ margin: '1rem 0', aspectRatio: '16/9', maxWidth: 560 }}>
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
