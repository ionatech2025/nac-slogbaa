# SLOGBAA — Production Readiness Checklist

This document lists what is **not yet done** and a **step-by-step plan** to get the application production-ready. It is based on a full codebase review.

---

## Current state summary

- **Done:** IAM (registration, login, roles, profile, password reset), Learning (courses, modules, content, enrollment), Progress (enrollment, completion, certificates), Assessment (quizzes, attempts), Admin (overview, people, course management, trainee detail, password-change emails), Trainee dashboard (courses, certificates, profile). Frontend theme (light/dark), loading buttons, and admin chrome follow theme.
- **Partial / placeholder:** Admin Homepage and Reports pages; “Send Welcome Email” and “Grades” in UI (coming soon); seed data with known dev password.
- **Needs hardening:** Config, secrets, security, tests, CI/CD.

---

## Step-by-step: What to do until production-ready

### Phase 1 — Config and environment (do first)

| Step | Action | Why |
|------|--------|-----|
| 1.1 | **Set production profile** | Ensure prod config is used. |
| | In deployment, set `SPRING_PROFILES_ACTIVE=prod` (or `spring.profiles.active=prod`). | Default is `dev`; prod uses env-based DB, JWT, SMTP. |
| 1.2 | **Set JWT secret** | Default secret is unsafe. |
| | Set `JWT_SECRET` to a long, random value (e.g. 256+ bits for HS256). Never use the default in production. | Documented in main `application.properties` and deployment docs. |
| 1.3 | **Set database URL and credentials** | Prod must not use dev defaults. |
| | Set `DATASOURCE_URL`, `DATASOURCE_USERNAME`, `DATASOURCE_PASSWORD`. | Prod profile has no defaults for these. |
| 1.4 | **Set CORS** | Avoid open CORS in prod. |
| | Set `CORS_ALLOWED_ORIGINS` to the real frontend origin(s) (e.g. `https://app.slogbaa.org`). | Default includes localhost only. |
| 1.5 | **Configure SMTP or make it optional** | Prevent startup or mail failures. |
| | Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` in prod, **or** ensure the app can start and send mail gracefully when they are missing (e.g. logging adapters only). | Prod profile expects these; missing values can cause issues. |

**Done in codebase:** Stray `git` on line 1 of `application-prod.properties` has been removed.

---

### Phase 2 — Docker and deployment

| Step | Action | Why |
|------|--------|-----|
| 2.1 | **Docker Compose (if used for prod)** | Compose currently does not set prod profile or JWT. |
| | Add to app service: `JWT_SECRET`, `SPRING_PROFILES_ACTIVE=prod`, and any SMTP/CORS vars. Or document that `docker-compose.yml` is for **dev only** and prod uses a different deployment. | Avoid accidentally running prod with dev defaults. |
| 2.2 | **Dockerfile** | Already multi-stage; ensure secrets are not baked in. |
| | Keep using env vars at runtime for `JWT_SECRET`, `DATASOURCE_*`, etc. Do not hardcode secrets in the image. | Good practice. |

---

### Phase 3 — Security hardening

| Step | Action | Why |
|------|--------|-----|
| 3.1 | **TestController (`/secure/*`)** | Role-check pings are useful for dev; optional in prod. |
| | Disable in prod: e.g. `@Profile("dev")` on `TestController`, or remove the controller and use integration tests for role checks. | Reduces surface and avoids leaking role layout. |
| 3.2 | **Seed data and default passwords** | V8 migration sets seed accounts to a known password. |
| | For production: (a) do not run seed migrations that set known passwords, or (b) run them but require password change on first login and/or delete or change seed accounts after first real admin is created. | Avoid well-known credentials in prod. |
| 3.3 | **Security headers (optional but recommended)** | Add headers for production. |
| | Consider adding X-Frame-Options, Content-Security-Policy, X-Content-Type-Options (e.g. via Spring Security or a filter). | Hardens against clickjacking and content-sniffing. |
| 3.4 | **Rate limiting (optional)** | Protect auth and public endpoints. |
| | Consider rate limiting on `/api/auth/*`, `/api/auth/password-reset/*`, and any other public or sensitive endpoints. | Mitigates brute-force and abuse. |

---

### Phase 4 — Code and docs cleanup

| Step | Action | Why |
|------|--------|-----|
| 4.1 | **Duplicate migration folder** | Only one path is used by Flyway. |
| | Flyway uses `classpath:db/migration` (i.e. `app/src/main/resources/db/migration/`). The folder `app/src/main/resources/migration/` is a duplicate. Remove or archive it and document that all migrations live under `db/migration`. | Avoid confusion and accidental edits in the wrong place. |
| 4.2 | **Stale TODO in AdminDashboardPage** | TODO says “call API when backend is ready” but backend and AdminLayout already use the API. |
| | Either switch AdminDashboardPage create-staff flow to use the real API (like AdminLayout) and remove the TODO, or remove the duplicate flow and rely on AdminLayout only. | Keeps behavior and docs consistent. |
| 4.3 | **IAM PasswordEncoder TODO** | Comment says “TODO: remove this later - using it to get seeds”. |
| | Remove or reword the comment; the bean is required for login and seeds. E.g. “Used for password hashing (login and seed data).” | Avoids misleading future changes. |
| 4.4 | **README and roadmap docs** | README still lists learning, assessment, progress as “planned”. |
| | Update README and any roadmap/client docs to state that IAM, Learning, Progress, Assessment, and Admin (overview, people, course management, trainee detail) are implemented; call out remaining placeholders (Homepage, Reports, Send Welcome Email, Grades). | Accurate for stakeholders and operators. |

---

### Phase 5 — Tests and CI/CD

| Step | Action | Why |
|------|--------|-----|
| 5.1 | **Frontend test script** | `package.json` has no test (or lint) script. |
| | Add e.g. `"test": "vitest"` (or similar) and optionally `"lint": "eslint ."`. Run at least a smoke or build check. | Enables CI and prevents regressions. |
| 5.2 | **CI pipeline** | No GitHub Actions (or other CI) found. |
| | Add a pipeline that: (1) builds backend (`mvn compile` or `mvn verify`), (2) runs backend tests, (3) builds frontend (`npm ci && npm run build`), (4) optionally runs frontend tests. Run on push/PR to main. | Automated quality gate before deploy. |
| 5.3 | **Backend test coverage** | IAM has tests; learning, progress, assessment have little or no automated tests. |
| | Add unit or integration tests for critical paths in learning, progress, and assessment (e.g. enrollment, completion, certificate issuance, quiz submit). | Reduces risk of regressions in prod. |

---

### Phase 6 — Feature completeness (when product is ready)

| Step | Action | Why |
|------|--------|-----|
| 6.1 | **Admin Homepage** | Currently `AdminPlaceholderPage`. |
| | Replace with real homepage content management when backend and product spec are ready. | Removes placeholder. |
| 6.2 | **Admin Reports & Analytics** | Currently `AdminPlaceholderPage`. |
| | Replace with real reports/analytics when backend (e.g. progress/analytics APIs) and product spec are ready. | Removes placeholder. |
| 6.3 | **Send Welcome Email** | Button exists but is no-op (“Coming soon”). |
| | Implement when you want staff to receive a welcome email (e.g. resend credentials or “welcome” without password). Backend may already support staff notification; wire the button to it. | Improves onboarding. |
| 6.4 | **Trainee “Grades”** | Nav action shows “Coming soon”. |
| | Implement when you have a grades view (e.g. quiz attempts and scores per trainee). Backend assessment data may already support it. | Completes trainee experience. |

---

## Quick reference: production env vars

Set these (or equivalent) in production:

- `SPRING_PROFILES_ACTIVE=prod`
- `JWT_SECRET=<long-random-secret>`
- `DATASOURCE_URL`, `DATASOURCE_USERNAME`, `DATASOURCE_PASSWORD`
- `CORS_ALLOWED_ORIGINS=<frontend-origin(s)>`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` (if mail is required)
- `PORT` (optional; default 8080)

---

## Summary order of work

1. **Phase 1** — Config and env (profile, JWT, DB, CORS, SMTP).
2. **Phase 2** — Docker/Compose and deployment (env in compose or “dev only” doc).
3. **Phase 3** — Security (TestController, seeds/passwords, headers, rate limiting).
4. **Phase 4** — Cleanup (migrations folder, TODOs, README/roadmap).
5. **Phase 5** — Tests and CI (frontend test script, CI pipeline, more backend tests).
6. **Phase 6** — Placeholder features (Homepage, Reports, Welcome Email, Grades) when product is ready.

After Phases 1–5, the application is in a good state for production deployment from a security, config, and quality perspective. Phase 6 can be scheduled with product and backend capability.
