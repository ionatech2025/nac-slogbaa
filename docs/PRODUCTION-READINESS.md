# SLOGBAA — Production Readiness

Updated March 2026. Latest: email verification, course ratings/reviews, streaks/XP/badges,
bookmarks/notes, Q&A discussions, video player, course categories, leaderboard, cookie consent,
Sentry integration, PWA install prompt, Zod validation, skeleton loaders, CSP headers.

---

## Current State

### Database — Neon Serverless PostgreSQL

**Host:** Neon (Singapore, `aws-ap-southeast-1`)
**Project:** AgriTradeHub (`wispy-term-57694063`) | **Database:** `slogbaa` | **Branch:** `main`
**Engine:** PostgreSQL 17.8 (Neon serverless) | **SSL:** Required (`sslmode=require`)
**Migrations:** 22 Flyway scripts, auto-applied on startup.

Connection configured via environment variables (`DATASOURCE_URL`, `DATASOURCE_USERNAME`, `DATASOURCE_PASSWORD`).
Dev profile falls back to `localhost:5432` if env vars are not set.

### Backend — Production Ready

**Build:** Gradle 8.14.3 Kotlin DSL, 7-module hexagonal architecture, Spring Boot 4.0.2, Java 21.

**Security hardening implemented:**
- JWT: 256-bit minimum secret, issuer/audience binding, 30s clock skew, 1hr prod expiry
- BCrypt strength 13, rate limiting (10 req/min auth in prod), HSTS, X-Frame-Options: DENY
- File uploads: magic-byte validation, allow-listed subdirs, no error leaks
- CORS: HTTPS-only in prod, startup validator blocks misconfigured deployments
- Audit logging on dedicated AUDIT channel for login/registration/password-reset events
- RFC 9457 ProblemDetail error responses globally; no stack traces leak

**Observability:**
- Spring Boot Actuator: health, readiness, liveness, metrics, prometheus, loggers
- Micrometer + Prometheus metrics export
- Structured JSON logging (prod) with MDC traceId/userId propagation
- Request tracing via X-Request-ID header

**Performance:**
- Caching: published courses, admin courses, published library, admin library (with eviction on mutations)
- Async email/notifications via virtual threads (@Async)
- Token cleanup scheduler (every 6 hours)

**Tests:** 98 unit tests across 14 test classes, 0 failures. ArchUnit hexagonal boundary enforcement.

### Frontend — Production Ready

**Implemented:** Full LMS with IAM (email verification), Learning (categories, time estimates, search/filter/sort), Assessment (answer review, server-side enforcement), Progress (streaks, XP/badges, leaderboard), Engagement (ratings/reviews, bookmarks/notes, Q&A discussions, video player), Admin panels, Trainee dashboard, public homepage.

**Architecture:** TanStack Query v5 (60+ hooks), Zustand v5 (persisted UI store), Lucide icons, DOMPurify, Zod, @sentry/react, React.lazy code splitting.

**Design System:** 30+ shared primitives, WCAG 2.2 AA, dark mode, focus traps, keyboard navigation, skeleton loaders, CSP headers, GDPR cookie consent, PWA install prompt, skip-to-content link, idle session timeout.

---

## Backend Module Structure

```
backend/
├── build.gradle.kts              # Root: Spring Boot BOM, Java 21 toolchain, shared config
├── settings.gradle.kts           # 7 submodules declared
├── gradlew                       # Gradle 8.14.3 wrapper
│
├── shared-ports/                 # Pure interfaces — zero dependencies
│   build.gradle.kts              # (empty — no deps needed)
│
├── infrastructure/               # Email, file storage, PDF, notification adapters
│   build.gradle.kts              # Spring Mail, Lombok, OpenHTMLtoPDF
│
├── iam/                          # Identity & Access Management
│   build.gradle.kts              # Spring Security, JPA, JJWT, ArchUnit (test)
│
├── learning/                     # Courses, modules, content blocks, library
│   build.gradle.kts              # JPA, Web, Validation, Jackson
│
├── assessment/                   # Quizzes, questions, attempts, scoring
│   build.gradle.kts              # JPA, Web, Security
│
├── progress/                     # Enrollment, progress tracking, certificates
│   build.gradle.kts              # JPA, Web, Security
│
└── app/                          # Spring Boot entry point + config
    build.gradle.kts              # Boot plugin, Flyway, Actuator, Prometheus
```

### Module Dependency Graph

```
shared-ports  (no deps)
     │
infrastructure  ──→ shared-ports
     │
iam  ──→ shared-ports, infrastructure
     │
learning  ──→ shared-ports, infrastructure, iam
     │
assessment  ──→ shared-ports, iam, learning
     │
progress  ──→ shared-ports, infrastructure, iam, learning
     │
app  ──→ ALL modules (entry point, boots everything)
```

---

## What Was Hardened

### Security (completed)

| Item | Status | Details |
|------|--------|---------|
| JWT secret enforcement | Done | Rejects < 256-bit, rejects default in prod, startup validator |
| JWT claims | Done | Issuer, audience, issuedAt, 30s clock skew |
| BCrypt strength | Done | Strength 13 (was 10) |
| Rate limiting | Done | In-memory sliding window, per-IP, X-RateLimit headers |
| Auth filter hardening | Done | Rejects nested Bearer, validates dot structure |
| CORS | Done | HTTPS-only in prod, short max-age dev |
| Security headers | Done | nosniff, DENY frame, HSTS 1yr |
| File upload | Done | Magic-byte validation, allow-listed subdirs |
| Error responses | Done | RFC 9457 ProblemDetail, global catch-all |
| Password logging | Done | Removed from all logging adapters |
| Password reset policy | Done | 12-char minimum, 15-min token, email matches |
| Stub classes | Done | 4 empty classes deleted |
| Password-logging runner | Done | Removed from SlogbaaApplication |

### Observability (completed)

| Item | Status |
|------|--------|
| Actuator endpoints | Done — health, readiness, liveness, metrics, prometheus |
| Structured logging | Done — logback-spring.xml, JSON prod, colored dev |
| Request tracing | Done — MDC traceId/userId, X-Request-ID header |
| Audit logging | Done — AUDIT logger for security events |

### Performance (completed)

| Item | Status |
|------|--------|
| Caching | Done — 4 cache regions with eviction on mutations |
| Async email | Done — Virtual threads via @Async |
| Token cleanup | Done — Scheduled every 6 hours |

### Build & DevOps (completed)

| Item | Status |
|------|--------|
| Maven to Gradle migration | Done — Gradle 8.14.3 Kotlin DSL |
| Project restructure | Done — backend/ and frontend/ separation |
| Docker (backend) | Done — Multi-stage, non-root, Gradle build |
| Docker (frontend) | Done — nginx, SPA routing, API proxy |
| Docker Compose | Done — 3 services, health checks, env var enforcement |
| Duplicate migrations | Done — Removed, single canonical directory |
| .env.example | Done — Template with all env vars, placeholder secrets |
| Neon DB integration | Done — Serverless PostgreSQL, Singapore region, SSL required |
| Pre-commit secret scanning | Done — `.githooks/pre-commit`, 11 secret patterns, 10 forbidden file types |
| CodeQL workflow hardening | Done — Fork-PR safety, SARIF fallback artifacts, diagnostic steps |
| Security workflow hardening | Done — Preflight job, fork-safe SARIF uploads, graceful degradation |
| Render backend deployment | Done — Docker on Render (Singapore), Render API deploy via GitHub Actions |
| Vercel frontend deployment | Done — Auto-deploy on push, `VITE_API_BASE_URL` in `vercel.json` |
| CORS production config | Done — Vercel frontend origin allowed, HTTPS-only enforcement |
| Gmail SMTP integration | Done — Email notifications via Gmail app password |
| CI/CD Render pipeline | Done — `deploy.yml` triggers Render API, polls status, health checks |
| `render.yaml` blueprint | Done — Infrastructure-as-code for reproducible Render setup |
| Email verification | Done — V14 migration, full hexagonal stack, verify/resend endpoints |
| Quiz server-side enforcement | Done — maxAttempts + timeLimitMinutes enforced on backend |
| Course ratings/reviews | Done — V15, 5-star + text reviews, Udemy-style |
| Streak counter + daily goals | Done — V16, Duolingo-style flame + SVG progress ring |
| Module time estimates | Done — V17, "~X min" badges, LinkedIn Learning-style |
| Course categories | Done — V19, 5 seeded categories, filter chips |
| XP/badges/achievements | Done — V20, 8 badge definitions, Khan Academy-style |
| Bookmarks/notes | Done — V21, toggle + note popover on content blocks |
| Course Q&A discussions | Done — V22, threaded discussions with replies + resolve |
| Video player | Done — YouTube IFrame API, speed control (0.5x-2x), captions toggle |
| Skeleton loaders | Done — Dashboard, CourseDetail, Library pages |
| Course search/filter/sort | Done — FilterSortBar component |
| CSP headers | Done — Content-Security-Policy meta tag |
| GDPR cookie consent | Done — Banner with localStorage persistence |
| Sentry integration | Done — @sentry/react, gated on cookie consent |
| PWA install prompt | Done — beforeinstallprompt banner |
| Zod schema validation | Done — All 4 auth forms validated with Zod |
| Quiz answer review | Done — Per-question correct/incorrect after submission |
| Trainee leaderboard | Done — Top completions, privacy-safe "First L." names |
| Skip-to-content link | Done — WCAG 2.2 AA keyboard navigation |
| Idle session timeout | Done — 30-minute inactivity auto-logout |

### Tests (completed)

| Item | Status |
|------|--------|
| Total tests | 98 (was 0 meaningful) |
| Failures | 0 |
| Domain value objects | Email, FullName, PhoneNumber, PasswordResetToken, Trainee |
| Application services | Authenticate, Register, PasswordReset, CreateStaff, DeleteStaff, ChangePassword |
| Security adapters | JwtTokenAdapter, RateLimitFilter |
| Architecture | ArchUnit hexagonal boundary enforcement (5 rules) |

---

## Deployment Architecture

### Production URLs

| Service | Platform | URL |
|---------|----------|-----|
| Backend API | Render (Singapore, free plan) | `https://slogbaa-backend.onrender.com` |
| Frontend | Vercel | `https://frontend-seven-red-wsusnzc0va.vercel.app` |
| Database | Neon (Singapore) | Serverless PostgreSQL (`sslmode=require`) |

### Deployment Flow

```
Push to dev/main
  → GitHub Actions CI (ci.yml): build + test
  → GitHub Actions Deploy (deploy.yml):
      Backend: Docker build → GHCR → Render API deploy → health check
  → Vercel: auto-deploys frontend on push
```

### Render Backend Service

| Property | Value |
|----------|-------|
| Service ID | `srv-d6s383ma2pns73811a20` |
| Runtime | Docker (multi-stage, `backend/Dockerfile`) |
| Region | Singapore (matches Neon DB) |
| Health check | `/actuator/health/readiness` |
| Auto-deploy | Off (triggered by GitHub Actions via Render API) |
| Blueprint | `render.yaml` (infrastructure-as-code) |

### Vercel Frontend

| Property | Value |
|----------|-------|
| Framework | Vite |
| Build command | `bun run build` |
| Output | `dist/` |
| API base URL | Set via `vercel.json` → `VITE_API_BASE_URL=https://slogbaa-backend.onrender.com` |
| SPA routing | Rewrites all non-API paths to `/index.html` |

### CORS Configuration

Backend CORS (`app.cors.allowed-origins`) in production:
- `https://frontend-seven-red-wsusnzc0va.vercel.app` (Vercel frontend)
- `https://slogbaa-backend.onrender.com` (self, for health checks)

CORS enforces HTTPS-only origins in the `prod` profile. Credentials are allowed for JWT Bearer auth.

## Deployment Checklist

### Render Environment Variables (Production)

```bash
# Profile
SPRING_PROFILES_ACTIVE=prod
PORT=8080

# Database (Neon Serverless PostgreSQL)
DATASOURCE_URL=jdbc:postgresql://<neon-host>.ap-southeast-1.aws.neon.tech/slogbaa?sslmode=require
DATASOURCE_USERNAME=<set-in-env>
DATASOURCE_PASSWORD=<set-in-env>

# Security
JWT_SECRET=<generate: openssl rand -base64 48>
CORS_ALLOWED_ORIGINS=https://frontend-seven-red-wsusnzc0va.vercel.app,https://slogbaa-backend.onrender.com
PASSWORD_RESET_BASE_URL=https://frontend-seven-red-wsusnzc0va.vercel.app

# Mail (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=<set-in-env>
SMTP_PASSWORD=<set-in-env>
SUPPORT_EMAIL=<set-in-env>
```

### GitHub Secrets (Required for CI/CD)

| Secret | Purpose | Set On |
|--------|---------|--------|
| `RENDER_API_KEY` | Render API key for backend deploys | 2026-03-16 |
| `VERCEL_TOKEN` | Vercel API token for frontend deploys | 2026-03-16 |
| `VERCEL_ORG_ID` | Vercel organization/team ID (`team_P28KoAOd4pWgJ9U1YKfh9R07`) | 2026-03-16 |
| `VERCEL_PROJECT_ID` | Vercel project ID (`prj_6Bke5FBGJ33zWQO6YIroJh7LgZ7S`) | 2026-03-16 |
| `GITHUB_TOKEN` | Auto-provided by GitHub | auto |

### Vercel Environment Variables (Frontend)

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `VITE_API_BASE_URL` | `https://slogbaa-backend.onrender.com` | `https://slogbaa-backend.onrender.com` | `http://localhost:8080` |
| `VITE_SENTRY_DSN` | `<set-in-env>` | `<set-in-env>` | (optional) |

### Pre-Deployment Steps

1. Copy `.env.example` to `.env` and fill in all values
2. Generate JWT secret: `openssl rand -base64 48`
3. Set Neon database credentials (`DATASOURCE_URL`, `DATASOURCE_USERNAME`, `DATASOURCE_PASSWORD`)
4. Set `CORS_ALLOWED_ORIGINS` to your frontend URL (HTTPS required in prod)
5. Configure SMTP credentials for email notifications
6. Set `RENDER_API_KEY` as a GitHub repo secret
7. Push to `dev` to trigger auto-deploy via GitHub Actions
8. Verify health: `curl https://slogbaa-backend.onrender.com/actuator/health/readiness`
9. Verify frontend: `https://frontend-seven-red-wsusnzc0va.vercel.app`

### Build Commands

```bash
# Backend
cd backend
source ../.env                    # Load env vars (Neon DB credentials)
./gradlew build                   # Compile + test (98 tests)
./gradlew :app:bootJar            # Build fat JAR only
./gradlew :app:bootRun            # Run locally (connects to Neon)

# Frontend (always use bun)
cd frontend
bun install && bun run build      # Production build to dist/
bun run dev                       # Development server

# Docker
docker compose up -d --build      # Full stack
```

### Secret Leak Prevention

A pre-commit hook (`.githooks/pre-commit`) automatically scans every commit for:
- Forbidden files: `.env`, `.env.local`, `.pem`, `.key`, `.p12`, `.jks`, `credentials.json`
- Secret patterns: Neon tokens (`npg_*`), connection strings, AWS keys, JWT tokens, private keys, GitHub tokens

```bash
# Hook is auto-installed via:
git config core.hooksPath .githooks

# If hook blocks a commit, fix the issue — do NOT bypass with --no-verify
```

### Test Accounts

| Email | Password | Role |
|-------|----------|------|
| `alien@dev.com` | `alien123.com` | SUPER_ADMIN |
| `superadmin@slogbaa.nac.go.ug` | `password` | SUPER_ADMIN |
| `admin@slogbaa.nac.go.ug` | `password` | ADMIN |
| `jane.akello@example.com` | `password` | TRAINEE |
| `john.ocen@example.com` | `password` | TRAINEE |
| `mary.nabukenya@example.com` | `password` | TRAINEE |

---

## Production Readiness Scorecard

| Area | Status | Confidence |
|------|--------|------------|
| Backend security | Ready | High |
| Backend observability | Ready | High |
| Backend performance | Ready | High (single instance) |
| Backend tests | Ready | High (98 tests, 0 failures) |
| Backend build system | Ready | High (Gradle 8.14.3 Kotlin DSL) |
| Frontend code | Ready | High |
| Frontend security | Ready | High (CSP, Sentry, Zod, cookie consent) |
| Frontend accessibility | Ready | High (WCAG 2.2 AA, skip-to-content, idle timeout) |
| Frontend performance | Ready | High (skeleton loaders, lazy loading) |
| Frontend design system | Ready | High (30+ primitives) |
| Engagement features | Ready | High (reviews, streaks, badges, bookmarks, Q&A) |
| Docker/deployment | Ready | High |
| BFF API alignment | Ready | High (80+ endpoints matched) |

### Scale-Out Prerequisites

For multi-instance deployments, add before scaling horizontally:

| Item | Why |
|------|-----|
| Redis cache backend | Replace ConcurrentMapCacheManager |
| Redis rate limiting | Enforce limits across instances |
| Cloud file storage (S3/GCS) | Replace LocalFileStorageAdapter |
| Shared session/token store | Consistent auth across instances |

---

**NAC SLOGBAA** — Production-ready LMS for local governance training.
