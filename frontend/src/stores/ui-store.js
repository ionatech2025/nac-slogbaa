import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Zustand UI store — single source of truth for all client-side UI state.
 * Persisted to localStorage. Cross-tab sync via storage event listener.
 */
export const useUIStore = create(
  persist(
    (set, get) => ({
      // === Theme ===
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
        document.documentElement.dataset.theme = theme
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        document.documentElement.dataset.theme = next
      },

      // === Admin sidebar ===
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      // === Command palette ===
      paletteOpen: false,
      setPaletteOpen: (v) => set({ paletteOpen: v }),
      togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),

      // === Toast notifications ===
      toasts: [],
      addToast: (toast) => {
        const id = Date.now() + Math.random()
        const t = { id, duration: 4000, type: 'info', ...toast }
        set((s) => ({ toasts: [...s.toasts, t] }))
        if (t.duration > 0) {
          setTimeout(() => get().removeToast(id), t.duration)
        }
        return id
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'slogbaa-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state?.theme) {
          document.documentElement.dataset.theme = state.theme
        }
      },
    }
  )
)

/** Initialize theme from system preference if no stored value. */
export function initTheme() {
  const { theme } = useUIStore.getState()
  // If persisted, apply it
  if (theme) {
    document.documentElement.dataset.theme = theme
    return
  }
  // Otherwise detect system preference
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  const initial = prefersDark ? 'dark' : 'light'
  useUIStore.getState().setTheme(initial)
}
