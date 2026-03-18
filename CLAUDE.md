# SLOGBAA — Project Instructions for Claude

## Project Overview
SLOGBAA is the Network for Active Citizens (NAC) online learning platform. It consists of a Spring Boot backend (Gradle, hexagonal architecture) and a React frontend (Vite, bun).

## Secrets & Credentials — ABSOLUTE RULES
- NEVER echo, print, log, or display API keys, passwords, tokens, or secrets in tool output or responses.
- NEVER write secrets to any file that could be committed (source code, CLAUDE.md, memory files, markdown, YAML, JSON configs in the repo).
- ONLY write secrets to `.env` or `.env.local` — both are gitignored. Verify `.gitignore` BEFORE writing.
- When referencing credentials in responses, use placeholders like `<set-in-env>` — never the actual value.
- The `.env.example` file is committed and must ONLY contain placeholder values.

## Environment Files
- `.env` — Primary secrets file (gitignored, loaded by docker-compose and Spring Boot)
- `.env.local` — Local overrides (gitignored, same structure)
- `.env.example` — Template with placeholders (committed, safe)

## Database
- **Neon Serverless PostgreSQL** (Singapore, `aws-ap-southeast-1`)
- Project: `AgriTradeHub` (`wispy-term-57694063`)
- Database: `slogbaa` on `main` branch
- Connection requires `sslmode=require`
- Flyway manages all schema migrations (`backend/app/src/main/resources/db/migration/`)

## Package Managers
- **Frontend:** Always use `bun` (never npm/yarn/pnpm)
- **Backend:** Gradle (`./gradlew` in `backend/`)

## Pre-commit Hooks
- A git pre-commit hook scans for leaked secrets before every commit.
- If the hook blocks a commit, investigate and remove the secret — do NOT bypass with `--no-verify`.

## Test Accounts (Neon DB)
- **SUPER_ADMIN:** `alien@dev.com` / `alien123.com`
- **SUPER_ADMIN:** `superadmin@slogbaa.nac.go.ug` / `password`
- **ADMIN:** `admin@slogbaa.nac.go.ug` / `password`
- **TRAINEE:** `jane.akello@example.com` / `password`
- **TRAINEE:** `john.ocen@example.com` / `password`
- **TRAINEE:** `mary.nabukenya@example.com` / `password`

## Prerequisites
- **Java 21** (OpenJDK) — backend runtime
- **Gradle 8.x** — bundled via `./gradlew` wrapper, no separate install needed
- **Bun 1.x** — frontend package manager and runtime (never npm/yarn/pnpm)
- **Docker & Docker Compose** — optional, for containerised local stack
- **PostgreSQL 16** — either Neon (cloud) or local via Docker

## Running Locally

### Option A: Direct (recommended for development)

**1. Set up environment variables**
```bash
cp .env.example .env
# Edit .env and fill in your Neon DB credentials, JWT secret, etc.
```

Required variables in `.env`:
| Variable | Purpose | Example |
|---|---|---|
| `DATASOURCE_URL` | JDBC connection string | `jdbc:postgresql://<host>.neon.tech/slogbaa?sslmode=require` |
| `DATASOURCE_USERNAME` | DB user | `<set-in-env>` |
| `DATASOURCE_PASSWORD` | DB password | `<set-in-env>` |
| `JWT_SECRET` | Signing key (min 32 chars) | `<set-in-env>` |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `dev` |
| `CORS_ALLOWED_ORIGINS` | Frontend origins | `http://localhost:5173,http://localhost:3000` |
| `PASSWORD_RESET_BASE_URL` | Frontend URL for email links | `http://localhost:5173` |

Optional variables:
| Variable | Purpose | Default |
|---|---|---|
| `SMTP_HOST` / `SMTP_USERNAME` / `SMTP_PASSWORD` | Email sending (Gmail SMTP) | Logs to console if unset |
| `FILE_UPLOAD_DIR` | Local file upload path | `uploads` |
| `VITE_API_BASE_URL` | Frontend API target (prod only) | Vite proxy handles this in dev |
| `VITE_SENTRY_DSN` | Frontend error tracking | Disabled if unset |

**2. Start the backend** (port 8080)
```bash
cd backend && source ../.env && \
  export DATASOURCE_URL DATASOURCE_USERNAME DATASOURCE_PASSWORD \
         JWT_SECRET CORS_ALLOWED_ORIGINS PASSWORD_RESET_BASE_URL \
         SPRING_PROFILES_ACTIVE && \
  ./gradlew :app:bootRun
```
- First run downloads Gradle + dependencies (~2 min), subsequent starts ~25–30s
- Flyway auto-runs all pending migrations on startup
- Health check: `curl http://localhost:8080/actuator/health`
- Dev profile enables SQL logging and DEBUG-level Spring Security logs

**3. Start the frontend** (port 5173)
```bash
cd frontend && bun install && bun run dev
```
- Vite proxies `/api/*` and `/uploads/*` to `http://localhost:8080` automatically
- No `VITE_API_BASE_URL` needed in dev — the proxy config in `vite.config.js` handles it
- Hot module replacement (HMR) is enabled by default

**4. Open the app**
- Frontend: http://localhost:5173
- Login with any test account (see Test Accounts section)

### Option B: Docker Compose (full containerised stack)
```bash
cp .env.example .env
# Edit .env — set at minimum: POSTGRES_PASSWORD, JWT_SECRET

docker compose up -d
```
- **Database:** PostgreSQL 16 on port 5432 (with healthcheck)
- **Backend:** Spring Boot on port 8080 (waits for healthy DB)
- **Frontend:** Nginx serving static build on port 3000

### Build Commands
```bash
# Backend — compile and run tests
cd backend && ./gradlew build

# Frontend — production build (outputs to frontend/dist/)
cd frontend && bun run build

# Frontend — install dependencies only
cd frontend && bun install
```

### Verifying the Setup
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Test trainee login
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.akello@example.com","password":"password"}'

# Test admin login
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@slogbaa.nac.go.ug","password":"password"}'
```

### Troubleshooting
- **500 on login after idle:** Neon suspends idle connections. Restart the backend to refresh HikariCP pool.
- **Flyway checksum mismatch:** Dev profile has `repair-on-migrate=true`, so it self-heals. If not, run `./gradlew flywayRepair`.
- **Port conflicts:** Backend defaults to 8080, frontend to 5173, Docker DB to 5432. Adjust in `application-dev.properties` or `vite.config.js` if needed.
- **CORS errors in browser:** Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL (e.g. `http://localhost:5173`).
- **Email not sending locally:** Without `SMTP_USERNAME`/`SMTP_PASSWORD`, the app logs emails to console instead. Check backend logs for verification links.

## Deployment
- **Backend:** Render (Singapore, Docker) — `https://slogbaa-backend.onrender.com`
  - Service ID: `srv-d6s383ma2pns73811a20`
  - Deployed via GitHub Actions (`deploy.yml`) using Render API
  - Blueprint: `render.yaml`
- **Frontend:** Vercel — `https://frontend-seven-red-wsusnzc0va.vercel.app`
  - `VITE_API_BASE_URL` set in `frontend/vercel.json` build env
- **CORS:** Backend allows the Vercel frontend origin in prod
- **SMTP:** Gmail SMTP configured on Render (env vars: `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`)

## Feature Summary (March 2026)
- **IAM:** Email verification (V14), Zod auth form validation, idle session timeout (30 min), GDPR self-service account deletion + data export (V23), trainee avatar upload (V24)
- **Learning:** Course categories (V19), module time estimates (V17), search/filter/sort, video player (YouTube IFrame API), course prerequisites with enrollment validation (V26)
- **Assessment:** Server-side quiz enforcement (maxAttempts + timeLimitMinutes), answer review, course completion celebration modal with confetti
- **Progress:** Streaks + daily goals (V16), XP/badges/achievements (V20), leaderboard, trainee unenrollment (WITHDRAWN status with re-enrollment support)
- **Engagement:** Course ratings/reviews (V15, wired into course pages), bookmarks/notes (V21, wired into content blocks), Q&A discussions (V22), in-app notification center (V25) with badge/completion/reply notifications
- **Homepage (Public Website):** Hero image carousel (3 slides, auto-rotate, pause-on-hover, WCAG carousel ARIA), About SLOGBA section, Impact Stories (image + text + "Read more"), YouTube video embeds (sandbox-hardened iframes), News & Updates, Partners & logos (auto-wrap grid), social media links (Facebook, Twitter/X, WhatsApp, YouTube) in footer, dynamic CMS-backed content with static fallback
- **Homepage CMS (Admin):** Full CRUD for banners, impact stories, videos (YouTube URL), partner logos, news/updates via `AdminCmsPage`. Super Admin only for create/update/delete. Content served via public unauthenticated API (`/api/public/homepage`)
- **Site Visitor Tracking:** Automatic page-visit recording on homepage load (once per session via sessionStorage), site visitor count displayed in admin dashboard KPI
- **Live Sessions:** Zoom / Google Meet integration. Admin creates sessions with title, provider, meeting URL, scheduled datetime, duration. Trainees view upcoming/past sessions with "Join Session" button. Routes: `/dashboard/live-sessions` (trainee), `/admin/live-sessions` (admin)
- **Frontend:** Skeleton loaders, CSP headers (including frame-src for YouTube), GDPR cookie consent, Sentry (@sentry/react), PWA install prompt + offline content caching (NetworkFirst API, CacheFirst assets, offline banner), skip-to-content (WCAG 2.2 AA), global search command palette (Ctrl+K), onboarding checklist, dedicated settings page, help center/FAQ
- **Admin Dashboard (March 2026):** Recharts analytics (PieChart, BarChart, AreaChart), animated KPI counters (including site visitors), client-side pagination on all admin tables, debounced search on Overview/Assessment/Library, sortable column headers, bulk trainee selection + delete, CSV export on all admin data tables, breadcrumb navigation on all admin pages, date range filtering on quiz attempts, status filter pills on certificates, skeleton loading states, demographic breakdowns (gender PieChart, category PieChart, trainee status PieChart with In Progress/Graduated/Failed segments, district BarChart top 8)
- **Admin Shared Components:** `Pagination.jsx` (+ `usePagination` hook), `Breadcrumbs.jsx`, `AnimatedCounter.jsx` (IntersectionObserver + rAF), `AdminTableSkeleton.jsx` (KPI/table/search skeletons), `csvExport.js` (RFC 4180)
- **Backend (2026 Standards):** Java 21 virtual threads (Project Loom) enabled, Spring Boot 4.0.2 / Spring Framework 7, hexagonal architecture enforced by ArchUnit, RFC 9457 ProblemDetail error responses on all modules, SpringDoc OpenAPI 3.1 (Swagger UI at `/swagger-ui.html` in dev, disabled in prod), bean validation (`@Valid` + `@NotBlank`), `@JsonProperty(access = READ_ONLY)` on timestamps, HikariCP tuned for Neon serverless (14-min max-lifetime), Caffeine caching, Prometheus metrics, structured logging with MDC correlation IDs, distroless Docker runtime
- **API:** Versioned at `/api/v1/` with backward-compatible forwarding filter; pagination on courses, reviews, discussions, bookmarks endpoints; public endpoints at `/api/public/**`
- **Migrations:** V14–V30 (29 total): includes email_verification_tokens, course_review, daily_activity, trainee_streak, module.estimated_minutes, course_category, badge_definition, trainee_badge, trainee_xp, trainee_bookmark, discussion_thread, discussion_reply, account_deletion_support, profile_image_url, notification, course_prerequisite, seed data, performance indexes, enrollment indexes, homepage CMS tables + site visitor counter + live sessions

## Trainee Workflow Routes
| Route | Page | Description |
|---|---|---|
| `/dashboard` | TraineeDashboardPage | Greeting, stats, streaks, achievements, continue learning, leaderboard, certificates |
| `/dashboard/courses` | CourseListPage | Browse, search, filter, sort courses with prerequisite indicators |
| `/dashboard/courses/:id` | CourseDetailPage | Module content, quizzes, bookmarks, reviews, discussions, unenroll |
| `/dashboard/library` | LibraryPage | Downloadable resources and documents |
| `/dashboard/live-sessions` | LiveSessionsPage | Upcoming/past live training sessions (Zoom/Google Meet) with join button |
| `/dashboard/settings` | SettingsPage | Theme, notifications, privacy/data export, account deletion |
| `/dashboard/help` | HelpPage | FAQ accordions (12 items) + contact support |

## Admin Routes
| Route | Page | Description |
|---|---|---|
| `/admin/overview` | AdminOverviewPage | KPI cards, demographic breakdown charts, people tables |
| `/admin/homepage` | AdminHomePage | Admin dashboard with analytics, KPIs (including site visitors), charts |
| `/admin/cms` | AdminCmsPage | Homepage CMS — manage banners, stories, videos, partners, news |
| `/admin/learning` | AdminLearningPage | Course list with pagination, search, bulk operations |
| `/admin/learning/:id` | AdminCoursePage | Module list editor for a course |
| `/admin/learning/:id/modules/:mid` | AdminModuleEditorPage | Content block editor (Editor.js) |
| `/admin/coursemanagement` | AdminCourseManagementPage | Course cloning, enrollment management |
| `/admin/library` | AdminLibraryPage | Resource library management with upload |
| `/admin/assessment` | AdminAssessmentPage | Quiz attempts, certificates, date range filters |
| `/admin/live-sessions` | AdminLiveSessionsPage | Create/manage live training sessions (Zoom/Meet) |

## API Versioning
- All frontend requests go to `/api/v1/...`
- Backend `ApiVersionForwardFilter` rewrites `/api/v1/...` to `/api/...` transparently at `HIGHEST_PRECEDENCE` (before Spring Security)
- Existing `/api/...` URLs continue to work (backward-compatible)
- Controllers unchanged — versioning handled at filter layer
- Public endpoints: `/api/public/**` (permitted without auth)
- OpenAPI docs: `/swagger-ui.html` (dev only, disabled in prod)

## Key Paths
- Backend: `backend/` (Spring Boot 4.0.2, Gradle, Java 21)
- Frontend: `frontend/` (React 18, Vite 6, bun)
- Migrations: `backend/app/src/main/resources/db/migration/` (V1–V30)
- CI/CD: `.github/workflows/` (ci.yml, deploy.yml)
- Render blueprint: `render.yaml`
- Pre-commit hook: `.githooks/pre-commit`
- Environment: `.env` (secrets), `.env.example` (template)
- Homepage CMS: `backend/app/.../cms/` (entity, repository, controller)
- Homepage API (public): `backend/app/.../cms/controller/PublicHomepageController.java`
- Homepage API (admin): `backend/app/.../cms/controller/AdminHomepageCmsController.java`
- Live sessions: `backend/app/.../cms/controller/LiveSessionController.java`
- OpenAPI config: `backend/app/.../config/OpenApiConfig.java`
- Notification system: `backend/progress/.../notification/` (entity, repo, port, adapter, controller)
- GDPR endpoints: `backend/iam/.../controller/TraineeAccountController.java`
- API versioning filter: `backend/app/.../config/ApiVersionForwardFilter.java`
- Admin CMS page: `frontend/src/features/app/pages/AdminCmsPage.jsx`
- Admin live sessions: `frontend/src/features/app/pages/AdminLiveSessionsPage.jsx`
- Trainee live sessions: `frontend/src/features/app/pages/LiveSessionsPage.jsx`
- Homepage (public): `frontend/src/features/app/pages/HomePage.jsx`
- CMS API client: `frontend/src/api/homepage.js`
- Live sessions API: `frontend/src/api/liveSessions.js`
- Admin shared components: `frontend/src/shared/components/{Pagination,Breadcrumbs,AnimatedCounter,AdminTableSkeleton}.jsx`
- Admin CSV export: `frontend/src/shared/utils/csvExport.js`
- Admin dashboard analytics: `frontend/src/features/app/pages/AdminHomePage.jsx` (recharts)
- Admin demographics: `frontend/src/features/app/pages/AdminOverviewPage.jsx` (gender/district/category/status charts)
- CSS design system: `frontend/src/styles/` (tokens, animations, glass, accessibility, responsive)
