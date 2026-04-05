import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, icons } from '../icons.jsx'
import { CommandPalette } from './CommandPalette.jsx'
import { usePublishedCourses } from '../../lib/hooks/use-courses.js'

/**
 * Static page entries for quick navigation.
 */
const PAGE_COMMANDS = [
  {
    label: 'Dashboard',
    subtitle: 'View your learning dashboard',
    icon: <Icon icon={icons.home} size={16} />,
    path: '/dashboard',
    shortcut: 'D',
    group: 'Pages',
  },
  {
    label: 'Courses',
    subtitle: 'Browse all available courses',
    icon: <Icon icon={icons.learning} size={16} />,
    path: '/dashboard/courses',
    shortcut: 'C',
    group: 'Pages',
  },
  {
    label: 'Library',
    subtitle: 'Your bookmarks, notes, and saved content',
    icon: <Icon icon={icons.library} size={16} />,
    path: '/dashboard/library',
    shortcut: 'L',
    group: 'Pages',
  },
]

/**
 * Global search / command palette.
 * Searches published courses (client-side from TanStack Query cache) and
 * provides quick-navigation links to key pages.
 *
 * Open with Ctrl+K / Cmd+K. Managed by the parent via `open` / `onClose`.
 */
export function GlobalSearchPalette({ open, onClose }) {
  const navigate = useNavigate()
  const { data: pagedData } = usePublishedCourses(0, 100)
  const courses = pagedData?.content ?? []

  // Build commands list: courses + pages
  const allCommands = useMemo(() => {
    const courseCommands = courses.map((course) => ({
      label: course.title,
      subtitle: course.description
        ? course.description.length > 80
          ? course.description.slice(0, 80) + '...'
          : course.description
        : 'Course',
      icon: <Icon icon={icons.course} size={16} />,
      group: 'Courses',
      onSelect: () => navigate(`/dashboard/courses/${course.id}`),
    }))

    const pageCommands = PAGE_COMMANDS.map((page) => ({
      ...page,
      icon: page.icon,
      onSelect: () => navigate(page.path),
    }))

    return [...pageCommands, ...courseCommands]
  }, [courses, navigate])

  if (!open) return null

  return (
    <CommandPalette
      commands={allCommands}
      onClose={onClose}
      placeholder="Type to search..."
      searchIconElement={<Icon icon={icons.search} size={18} style={{ color: 'var(--slogbaa-text-muted)' }} />}
      emptyIcon={<Icon icon={icons.search} size={28} style={{ opacity: 0.35 }} />}
      emptyText="No results found."
      debounceMs={300}
    />
  )
}

/**
 * Hook to manage global Ctrl+K / Cmd+K shortcut.
 * Returns [isOpen, setIsOpen] for the command palette.
 */
export function useCommandPaletteShortcut() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  return { open, close, toggle, setOpen }
}
