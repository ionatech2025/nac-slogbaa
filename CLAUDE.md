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

## Key Paths
- Backend: `backend/` (Spring Boot, Gradle, Java 21)
- Frontend: `frontend/` (React 18, Vite, bun)
- Migrations: `backend/app/src/main/resources/db/migration/`
- CI/CD: `.github/workflows/`
