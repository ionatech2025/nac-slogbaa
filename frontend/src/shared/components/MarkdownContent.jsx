import { SafeHtml } from './SafeHtml.jsx'
import { markdownToHtml } from '../utils/markdown.js'

/**
 * Renders GitHub-style markdown as sanitized HTML.
 */
export function MarkdownContent({ markdown, className = '', ...rest }) {
  if (!markdown) return null
  const html = markdownToHtml(markdown)
  if (!html) return null
  return (
    <SafeHtml
      html={html}
      className={`md-content ${className}`.trim()}
      {...rest}
    />
  )
}
