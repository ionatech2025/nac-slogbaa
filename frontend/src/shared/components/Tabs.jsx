/**
 * Tabs primitive — accessible tab bar with keyboard navigation.
 * Follows WAI-ARIA tabs pattern.
 */
import { useId, useCallback } from 'react'

const styles = {
  list: {
    display: 'flex',
    gap: 0,
    borderBottom: '2px solid var(--slogbaa-border)',
    marginBottom: '1.5rem',
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.75rem 1.25rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text-muted)',
    position: 'relative',
    marginBottom: -2,
    borderBottom: '3px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
  },
  tabActive: {
    color: 'var(--slogbaa-blue)',
    borderBottomColor: 'var(--slogbaa-blue)',
    fontWeight: 600,
  },
}

/**
 * @param {{ value: string, label: string, icon?: React.ReactNode }[]} tabs
 * @param {string} activeTab
 * @param {(value: string) => void} onChange
 */
export function Tabs({ tabs, activeTab, onChange, style }) {
  const id = useId()

  const handleKeyDown = useCallback((e, index) => {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return

    e.preventDefault()
    onChange(tabs[next].value)
    // Focus the newly selected tab
    document.getElementById(`${id}-tab-${next}`)?.focus()
  }, [tabs, onChange, id])

  return (
    <div role="tablist" style={{ ...styles.list, ...style }}>
      {tabs.map((tab, i) => {
        const isActive = tab.value === activeTab
        return (
          <button
            key={tab.value}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${id}-panel-${tab.value}`}
            tabIndex={isActive ? 0 : -1}
            style={{ ...styles.tab, ...(isActive ? styles.tabActive : {}) }}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({ id, value, activeTab, children }) {
  if (value !== activeTab) return null
  return (
    <div role="tabpanel" id={`${id}-panel-${value}`} tabIndex={0}>
      {children}
    </div>
  )
}
