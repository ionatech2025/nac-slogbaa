/**
 * GitHub-comment-style Markdown (subset) → HTML.
 * HTML is escaped first; callers should still run the result through DOMPurify.
 */

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function applyInline(text) {
  let s = escapeHtml(text)
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2">$1</a>')
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/__(.+?)__/g, '<strong>$1</strong>')
  s = s.replace(/~~(.+?)~~/g, '<del>$1</del>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  s = s.replace(/(^|[\s(])_([^_]+)_/g, '$1<em>$2</em>')
  return s
}

function isBlockStart(line) {
  return /^(#{1,6})\s+/.test(line)
    || /^>\s?/.test(line)
    || /^\s*[-*+]\s+/.test(line)
    || /^\s*\d+\.\s+/.test(line)
    || /^---+$/.test(line.trim())
}

export function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') return ''
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      out.push(`<h${level}>${applyInline(heading[2])}</h${level}>`)
      i += 1
      continue
    }

    if (/^---+$/.test(line.trim())) {
      out.push('<hr>')
      i += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i += 1
      }
      out.push(`<blockquote><p>${quoteLines.map(applyInline).join('<br>')}</p></blockquote>`)
      continue
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(`<li>${applyInline(lines[i].replace(/^\s*[-*+]\s+/, ''))}</li>`)
        i += 1
      }
      out.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${applyInline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`)
        i += 1
      }
      out.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    const para = []
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      para.push(lines[i])
      i += 1
    }
    out.push(`<p>${para.map(applyInline).join('<br>')}</p>`)
  }

  return out.join('')
}

/** Plain-text preview for cards and truncations. */
export function stripMarkdown(md) {
  if (!md) return ''
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>+\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
