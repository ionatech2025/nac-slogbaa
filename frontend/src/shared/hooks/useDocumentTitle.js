import { useEffect } from 'react'

const BASE_TITLE = 'SLOGBAA — Online Learning Platform'

/**
 * Updates document.title on mount and restores it on unmount.
 * Screen readers announce page title changes on navigation.
 *
 * @param {string} title - Page-specific title (e.g. "My Courses")
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | SLOGBAA`
    } else {
      document.title = BASE_TITLE
    }
    return () => {
      document.title = BASE_TITLE
    }
  }, [title])
}
