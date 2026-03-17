import { useState, useEffect, useRef } from 'react'

/**
 * AnimatedCounter — counts up from 0 to `value` with easing.
 * Uses requestAnimationFrame for smooth 60fps animation.
 * Animates only once when the element enters the viewport.
 *
 * @param {number} value - Target value
 * @param {number} [duration=800] - Animation duration in ms
 * @param {string} [suffix=''] - Suffix to append (e.g. '%')
 * @param {string} [prefix=''] - Prefix to prepend (e.g. '$')
 * @param {object} [style] - Inline styles
 */
export function AnimatedCounter({ value, duration = 800, suffix = '', prefix = '', style, ...rest }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)
  const numValue = typeof value === 'number' ? value : Number(value) || 0

  useEffect(() => {
    if (hasAnimated.current) {
      setDisplay(numValue)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          observer.disconnect()
          animate()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)

    function animate() {
      const start = performance.now()
      const from = 0
      const to = numValue

      function tick(now) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(from + (to - from) * eased)
        setDisplay(current)
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }

    return () => observer.disconnect()
  }, [numValue, duration])

  return (
    <span ref={ref} style={style} {...rest}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}
