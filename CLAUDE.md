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

## Running Locally
```bash
# Backend (loads .env for Neon DB connection)
cd backend && source ../.env && export DATASOURCE_URL DATASOURCE_USERNAME DATASOURCE_PASSWORD JWT_SECRET CORS_ALLOWED_ORIGINS PASSWORD_RESET_BASE_URL SPRING_PROFILES_ACTIVE && ./gradlew :app:bootRun

# Frontend
cd frontend && bun run dev
```

## Deployment
- **Backend:** Render (Singapore, Docker) — `https://slogbaa-backend.onrender.com`
  - Service ID: `srv-d6s383ma2pns73811a20`
  - Deployed via GitHub Actions (`deploy.yml`) using Render API
  - Blueprint: `render.yaml`
- **Frontend:** Vercel — `https://frontend-seven-red-wsusnzc0va.vercel.app`
  - `VITE_API_BASE_URL` set in `frontend/vercel.json` build env
- **CORS:** Backend allows the Vercel frontend origin in prod
- **SMTP:** Gmail SMTP configured on Render (env vars: `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`)

## Key Paths
- Backend: `backend/` (Spring Boot, Gradle, Java 21)
- Frontend: `frontend/` (React 18, Vite, bun)
- Migrations: `backend/app/src/main/resources/db/migration/`
- CI/CD: `.github/workflows/`
- Render blueprint: `render.yaml`
- Pre-commit hook: `.githooks/pre-commit`
- Environment: `.env` (secrets), `.env.example` (template)
