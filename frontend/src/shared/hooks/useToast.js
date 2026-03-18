import { useUIStore } from '../../stores/ui-store.js'

/**
 * Convenience hook for toast notifications.
 * Usage:
 *   const toast = useToast()
 *   toast.success('Course published!')
 *   toast.error('Failed to save.')
 *   toast.info('Changes saved.')
 */
export function useToast() {
  const addToast = useUIStore((s) => s.addToast)
  return {
    success: (message, opts) => addToast({ message, type: 'success', ...opts }),
    error: (message, opts) => addToast({ message, type: 'error', duration: 6000, ...opts }),
    info: (message, opts) => addToast({ message, type: 'info', ...opts }),
    warning: (message, opts) => addToast({ message, type: 'warning', ...opts }),
    withUndo: (message, undoFn, opts) => addToast({
      message, type: 'success', duration: 6000,
      action: { label: 'Undo', onClick: undoFn },
      ...opts,
    }),
  }
}
