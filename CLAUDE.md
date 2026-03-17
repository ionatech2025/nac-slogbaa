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
- **IAM:** Email verification (V14), Zod auth form validation, idle session timeout (30 min)
- **Learning:** Course categories (V19), module time estimates (V17), search/filter/sort, video player (YouTube IFrame API)
- **Assessment:** Server-side quiz enforcement (maxAttempts + timeLimitMinutes), answer review
- **Progress:** Streaks + daily goals (V16), XP/badges/achievements (V20), leaderboard
- **Engagement:** Course ratings/reviews (V15), bookmarks/notes (V21), Q&A discussions (V22)
- **Frontend:** Skeleton loaders, CSP headers, GDPR cookie consent, Sentry (@sentry/react), PWA install prompt, skip-to-content (WCAG 2.2 AA)
- **Migrations:** V14–V22 (9 new): email_verification_tokens, course_review, daily_activity, trainee_streak, module.estimated_minutes, course_category, badge_definition, trainee_badge, trainee_xp, trainee_bookmark, discussion_thread, discussion_reply

## Key Paths
- Backend: `backend/` (Spring Boot, Gradle, Java 21)
- Frontend: `frontend/` (React 18, Vite, bun)
- Migrations: `backend/app/src/main/resources/db/migration/`
- CI/CD: `.github/workflows/`
- Render blueprint: `render.yaml`
- Pre-commit hook: `.githooks/pre-commit`
- Environment: `.env` (secrets), `.env.example` (template)
