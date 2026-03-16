/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 *
 * Usage: cn('base', isActive && 'active', variant === 'danger' && 'text-red')
 */
export function cn(...args) {
  return args.filter(Boolean).join(' ')
}
