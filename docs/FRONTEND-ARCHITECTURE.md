# SLOGBAA Frontend Architecture — March 2026

Complete technical reference for the SLOGBAA Online Learning Platform frontend.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 18.3.1 | UI rendering |
| Routing | React Router | 6.28+ | Client-side routing with lazy loading |
| Server State | TanStack Query | 5.90+ | Caching, deduplication, background refetch, optimistic mutations |
| Client State | Zustand | 5.0+ | UI preferences with localStorage persist |
| Icons | Lucide React | 0.575+ | Tree-shakeable SVG icons (21 KB) |
| Sanitization | DOMPurify | 3.3+ | XSS prevention on all rendered HTML |
| Build | Vite | 6.0+ | Dev server, HMR, production bundling |
| Package Manager | Bun | 1.3+ | Fast dependency resolution |
| Content Editor | Editor.js | 2.31+ | Rich content editing (admin only, lazy-loaded) |

---

## Complete Folder Structure

```
frontend/
├── public/
│   └── manifest.json                    # PWA web app manifest
├── index.html                           # Entry HTML + meta tags + PWA config
├── package.json                         # Dependencies + scripts
├── vite.config.js                       # Vite: proxy, chunk splitting
├── bun.lock                             # Bun lockfile
└── src/
    ├── App.jsx                          # Root: ErrorBoundary → Providers → Routes
    ├── main.jsx                         # Entry point: React.StrictMode → App
    ├── index.css                        # Design tokens, global styles, animations
    │
    ├── api/                             # HTTP client + domain API functions
    │   ├── client.js                    # apiClient factory + 401 AuthError interceptor
    │   ├── files.js                     # File upload (multipart/form-data)
    │   ├── certificates.js              # Trainee certificates
    │   ├── trainee.js                   # Trainee profile
    │   ├── traineeSettings.js           # Trainee settings
    │   ├── admin/
    │   │   ├── assessment.js            # Admin quiz management
    │   │   ├── certificates.js          # Admin certificates + revoke
    │   │   ├── courseManagement.js       # Enrollments, can-delete checks
    │   │   ├── courses.js               # Admin course/module CRUD
    │   │   ├── dashboard.js             # Overview + course count
    │   │   ├── library.js               # Library resource CRUD
    │   │   ├── me.js                    # Admin password change
    │   │   ├── staff.js                 # Staff CRUD + password
    │   │   └── trainees.js              # Trainee admin management
    │   ├── assessment/
    │   │   └── quizzes.js               # Quiz attempt + submit
    │   ├── iam/
    │   │   ├── auth.js                  # Login, register, password reset
    │   │   └── index.js                 # Re-exports
    │   └── learning/
    │       ├── courses.js               # Published courses, enrollment, progress
    │       ├── library.js               # Published library resources
    │       └── index.js                 # Re-exports
    │
    ├── contexts/
    │   └── ThemeContext.jsx              # React context wrapping Zustand theme
    │
    ├── stores/
    │   └── ui-store.js                  # Zustand: theme, sidebar, palette, toasts
    │
    ├── lib/
    │   ├── query-client.js              # TanStack QueryClient + AuthError + 401 handler
    │   ├── query-keys.js                # Centralized query key factory
    │   └── hooks/
    │       ├── use-admin.js             # 20+ admin hooks (dashboard, courses, library, assessment)
    │       ├── use-admin-users.js       # 12 staff/trainee CRUD hooks
    │       ├── use-certificates.js      # useMyCertificates
    │       ├── use-courses.js           # 8 trainee course hooks (optimistic enrollment)
    │       ├── use-library.js           # usePublishedLibrary
    │       └── use-trainee.js           # Profile + settings hooks
    │
    ├── shared/
    │   ├── icons.jsx                    # Lucide icon exports (48 icons) + Icon component
    │   ├── countryCodes.js              # Phone country code data
    │   ├── components/                  # 23 design system primitives
    │   │   ├── Avatar.jsx               # User image + initials fallback (5 sizes)
    │   │   ├── Badge.jsx                # Status label (6 variants)
    │   │   ├── Button.jsx               # CTA button (6 variants, 3 sizes)
    │   │   ├── Card.jsx                 # Container (CardHeader, CardTitle)
    │   │   ├── CommandPalette.jsx       # Ctrl+K command search (Linear-style)
    │   │   ├── ConfirmModal.jsx         # Confirmation dialog (alertdialog)
    │   │   ├── ContentSkeletons.jsx     # CardGrid/Table/Stats shaped loaders
    │   │   ├── EmptyState.jsx           # No-data visual with icon
    │   │   ├── ErrorBoundary.jsx        # Global React error catch + recovery UI
    │   │   ├── FilterSortBar.jsx        # Search + filter dropdowns + sort
    │   │   ├── Input.jsx                # Form input (error state, aria)
    │   │   ├── LiveRegion.jsx           # aria-live announcements
    │   │   ├── LoadingButton.jsx        # Async button with spinner + shimmer
    │   │   ├── Modal.jsx                # Dialog (focus trap, blur overlay)
    │   │   ├── NotFoundPage.jsx         # 404 page
    │   │   ├── PageSkeleton.jsx         # Route Suspense fallback spinner
    │   │   ├── QueryError.jsx           # Error + retry button
    │   │   ├── SafeHtml.jsx             # DOMPurify HTML renderer
    │   │   ├── ScrollToTop.jsx          # Route scroll restoration
    │   │   ├── Skeleton.jsx             # Pulse animation placeholder
    │   │   ├── Tabs.jsx                 # WAI-ARIA tabs (arrow key nav)
    │   │   ├── ThemeToggle.jsx          # Dark/light toggle button
    │   │   └── Toast.jsx                # Notification system (4 types)
    │   ├── hooks/
    │   │   ├── useDebounce.js           # Input debouncing (250ms)
    │   │   ├── useLocalStorage.js       # JSON localStorage state
    │   │   └── useToast.js              # Convenience toast API
    │   └── utils/
    │       ├── cn.js                    # Class name merger
    │       └── filterSort.js            # Generic filter/sort/search
    │
    ├── layouts/
    │   └── AppLayout.jsx                # Global layout (ThemeToggle)
    │
    └── features/
        ├── app/                         # Main application
        │   ├── routes.jsx               # All route definitions (16 lazy + 3 eager)
        │   ├── layouts/
        │   │   └── TraineeLayout.jsx    # Trainee shell (nav + profile + outlet)
        │   ├── components/
        │   │   ├── AppShell.jsx         # Layout wrapper with sidebar option
        │   │   ├── RequireTrainee.jsx   # Auth guard for trainee routes
        │   │   ├── admin/
        │   │   │   ├── AddBlockModal.jsx
        │   │   │   ├── AddModuleModal.jsx
        │   │   │   ├── AdminNav.jsx     # Top navigation bar
        │   │   │   ├── BlockOptionsMenu.jsx
        │   │   │   ├── BlockTypePickerModal.jsx
        │   │   │   ├── ChangePasswordModal.jsx
        │   │   │   ├── CreateCourseModal.jsx
        │   │   │   ├── CreateStaffModal.jsx
        │   │   │   ├── EditBlockModal.jsx
        │   │   │   ├── EditCourseModal.jsx
        │   │   │   ├── EditorJsReadOnly.jsx  # Sanitized Editor.js renderer
        │   │   │   ├── ModuleEditorJs.jsx     # Editor.js wrapper (admin)
        │   │   │   ├── TextBlockInlineEditor.jsx
        │   │   │   └── UpdateCoursesModal.jsx
        │   │   └── trainee/
        │   │       ├── CertificateCard.jsx
        │   │       ├── CourseCard.jsx    # Progress ring + enrollment
        │   │       ├── EditProfileModal.jsx
        │   │       ├── ProfileViewModal.jsx
        │   │       └── TraineeNav.jsx   # Avatar + dropdown menu
        │   └── pages/
        │       ├── HomePage.jsx         # Public landing (hero, features, CTA)
        │       ├── AdminLayout.jsx      # Admin shell (sidebar, cmd palette, hamburger)
        │       ├── AdminOverviewPage.jsx
        │       ├── AdminLearningPage.jsx
        │       ├── AdminCoursePage.jsx
        │       ├── AdminCourseEditorPage.jsx
        │       ├── AdminCourseManagementPage.jsx
        │       ├── AdminModuleEditorPage.jsx
        │       ├── AdminLibraryPage.jsx
        │       ├── AdminAssessmentPage.jsx
        │       ├── AdminUserDetailPage.jsx
        │       ├── AdminPlaceholderPage.jsx
        │       ├── AdminDashboardPage.jsx
        │       ├── TraineeDashboardPage.jsx  # Stats + continue rail + courses/certs tabs
        │       ├── ComingSoonPage.jsx
        │       └── DashboardPage.jsx
        ├── assessment/
        │   └── components/
        │       ├── AdminQuizEditor.jsx
        │       ├── AdminQuizReadOnly.jsx
        │       └── ModuleQuizPanel.jsx
        ├── iam/
        │   ├── routes.jsx               # Auth routes (login, register, forgot, reset)
        │   ├── context/
        │   │   └── AuthContext.jsx       # Auth state + BroadcastChannel sync
        │   ├── hooks/
        │   │   └── useAuth.js
        │   ├── components/
        │   │   ├── LoginForm.jsx
        │   │   ├── RegisterForm.jsx
        │   │   └── TestCredentialsSidebar.jsx  # DEV-only
        │   └── pages/
        │       ├── LoginPage.jsx        # Calm card + logo mark
        │       ├── RegisterPage.jsx
        │       ├── ForgotPasswordPage.jsx
        │       └── ResetPasswordPage.jsx
        └── learning/
            ├── components/
            │   └── CoursePreviewModal.jsx
            └── pages/
                ├── CourseListPage.jsx    # Card grid + skeleton + retry
                ├── CourseDetailPage.jsx  # Module sidebar + progress tracking
                └── LibraryPage.jsx
```

**Total: 111 source files** (83 JSX components + 20 JS modules + 1 CSS + 7 config files)

---

## 2026 Design System — Unified Color Palette

### Light Mode

| Token | Value | Contrast on White | Role |
|-------|-------|-------------------|------|
| `--slogbaa-blue` | `#2563eb` | 4.6:1 | Primary (trust, CTAs) |
| `--slogbaa-green` | `#059669` | 4.6:1 | Success (completion, streaks) |
| `--slogbaa-orange` | `#d97706` | 4.5:1 | Warning toasts only |
| `--slogbaa-error` | `#dc2626` | 4.6:1 | Errors, danger |
| `--slogbaa-dark` | `#0f172a` | — | Chrome (nav, sidebar) |
| `--slogbaa-surface` | `#ffffff` | — | Cards, modals |
| `--slogbaa-bg` | `#f8fafc` | — | Page background |
| `--slogbaa-text` | `#1e293b` | 14.5:1 | Primary text |
| `--slogbaa-text-muted` | `#64748b` | 4.6:1 | Secondary text |
| `--slogbaa-border` | `#e2e8f0` | — | Borders, dividers |

### Dark Mode

| Token | Value | Role |
|-------|-------|------|
| `--slogbaa-blue` | `#60a5fa` | Primary on dark |
| `--slogbaa-green` | `#34d399` | Success on dark |
| `--slogbaa-orange` | `#fbbf24` | Warning on dark |
| `--slogbaa-error` | `#f87171` | Error on dark |
| `--slogbaa-surface` | `#1e293b` | Cards on dark |
| `--slogbaa-bg` | `#0f172a` | Page background dark |
| `--slogbaa-text` | `#f1f5f9` | Text on dark |
| `--slogbaa-text-muted` | `#94a3b8` | Secondary text dark |
| `--slogbaa-border` | `#334155` | Borders dark |

### Visual Consistency Rules

| Element | borderRadius | Shadow | Background |
|---------|-------------|--------|------------|
| Buttons | 10px | — | `--slogbaa-blue` (primary) |
| Inputs | 10px | Blue glow on focus | `--slogbaa-bg` |
| Cards | 14px | 1px+2px subtle | `--slogbaa-surface` |
| Modals | 16px | 20px+4px layered + frosted blur | `--slogbaa-surface` |
| Badges | 6px | — | Semantic 8% tint |
| Command Palette | 16px | Same as modal | `--slogbaa-surface` |

---

## Provider Hierarchy

```
ErrorBoundary
  └── QueryClientProvider (TanStack)
       └── BrowserRouter
            ├── ScrollToTop
            └── ThemeProvider (Zustand-backed)
                 └── AuthProvider (BroadcastChannel sync)
                      └── LiveRegionProvider
                           ├── AppLayout (ThemeToggle)
                           │    └── AppRoutes (16 lazy + 3 eager)
                           └── ToastContainer
            └── ReactQueryDevtools (DEV-only, lazy)
```

---

## State Management

### Server State — TanStack Query v5

6 hook files, 50+ hooks total. All API data flows through query hooks — zero `useState`+`useEffect` fetch patterns.

**Query defaults**: 30s stale, 5min GC, 2 retries (never on 401), refetch on window focus.

**Optimistic mutations**: `useEnrollInCourse()`, `usePublishCourse()`, `useUnpublishCourse()` — instant UI with rollback on error.

**401 flow**: `api/client.js` throws `AuthError` → global handler → `logout()` → `queryClient.clear()` → BroadcastChannel → all tabs redirect.

### Client State — Zustand v5

Single store (`ui-store.js`) with persist middleware:
- `theme` (persisted) — 'light' / 'dark'
- `sidebarCollapsed` (persisted) — admin sidebar preference
- `paletteOpen` — command palette visibility
- `toasts` — active notifications (auto-dismiss)

`useShallow` used on array selectors (Toast) to prevent unnecessary re-renders.

---

## Performance

| Metric | Value |
|--------|-------|
| Initial JS (entry) | 64 KB |
| Initial JS (gzipped) | 77 KB |
| Vendor: React + Router | 166 KB |
| Vendor: Icons (Lucide) | 21 KB |
| Vendor: TanStack Query | 42 KB |
| Vendor: DOMPurify | 23 KB |
| Vendor: Editor.js (lazy) | 404 KB |
| CSS (single file) | 11 KB / 2.2 KB gzip |
| Total chunks | 35 |
| Lazy routes | 16 |
| Build time | ~5–9s |

**Optimizations**: `useDebounce(250ms)` on search, `useMemo` on filtered lists, `useCallback` on handlers, content-shaped skeletons, `loading="lazy"` on images, system font stack.

---

## Accessibility (WCAG 2.2 AA)

- All text tokens ≥4.5:1 contrast
- `:focus-visible` global ring (blue glow) + dark-chrome variant
- Input focus: blue border + 3px glow
- Modal focus traps + return-focus
- WAI-ARIA Tabs with arrow key navigation
- `aria-label` on all icon-only buttons
- All images have meaningful `alt` text
- `prefers-reduced-motion` kills animations + backdrop-filter
- `LiveRegionProvider` for screen reader announcements
- Text selection: calm blue tint
- Font smoothing: antialiased

---

## Security

- DOMPurify strict allow-list on all rendered HTML
- Dev credentials gated behind `import.meta.env.DEV`
- 401 interceptor → auto-logout → cross-tab sync
- Safe anchor defaults (`rel="noopener noreferrer"`)
- Token in localStorage (documented httpOnly cookie migration path)

---

## PWA & Mobile

- `manifest.json`: standalone display, theme color, icons
- Apple mobile meta: capable, status-bar-style, title
- Viewport: `viewport-fit=cover` for notched devices
- Mobile hamburger menu with slide-out sidebar (<768px)
- Responsive breakpoints: 768px, 640px
- ScrollToTop on route change
- Touch targets ≥44px

---

## User Feedback

- 41 toast notifications across all mutations
- Content-shaped skeletons (cards, tables, stats)
- QueryError with retry button
- EmptyState with icon + context
- Optimistic UI on enrollment + publish
- Button press micro-interaction (scale 0.98)
- Frosted glass modal overlays
- Smooth theme transitions (200ms)

---

## Build & Dev Commands

```bash
bun install          # Install dependencies
bun run dev          # Dev server (localhost:5173)
bun run build        # Production build → dist/
bun run preview      # Preview production build
```

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API origin | `''` (Vite proxy) |
