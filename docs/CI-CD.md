# SLOGBAA CI/CD & Security Pipeline — March 2026

Complete reference for automated build, test, security scanning, and deployment.

### Code scanning pause (Mar 2026)

**CodeQL** (`codeql.yml`) — only **`workflow_dispatch`** (no push/PR/schedule). Run manually from the Actions tab when you want a scan, or uncomment triggers in the workflow file to re-enable gating.

**Semgrep** (`security.yml`) — job is **`if: false`**. Restore by removing that line and adding `semgrep` back to `security-pass` → `needs: [preflight, semgrep, trufflehog, trivy]`.

**Deploy** (`deploy.yml` → Railway) is **not** dependent on CodeQL or Semgrep; pushes to `main`/`dev` still build and run `deploy-backend` the same as before (except pushes that change *only* `docs/**` or root `*.md` are still ignored).

---

## Pipeline Overview

```
Pull Request / Push to main
  │
  ├── ci.yml ─────── Build + Test (parallel)
  │   ├── frontend ── bun install → build → bundle size check
  │   ├── backend ─── gradle compile → test (Postgres) → bootJar
  │   └── ci-pass ─── gate (blocks merge on failure)
  │
  ├── security.yml ── DevSecOps (parallel)
  │   ├── SAST ────── Semgrep (paused — see “Code scanning pause” above)
  │   ├── Secrets ─── TruffleHog (full git history deep scan)
  │   ├── Secrets ─── ggshield / GitGuardian (if enabled)
  │   ├── SCA ─────── OWASP Dependency-Check (Java CVEs)
  │   ├── SCA ─────── Frontend npm audit
  │   ├── Container ─ Trivy (filesystem + Docker image scan)
  │   ├── SBOM ────── Syft (supply chain transparency)
  │   └── sec-pass ── gate (TruffleHog failure = hard block)
  │
  ├── codeql.yml ──── SAST (GitHub native; manual dispatch only — see pause note)
  │   ├── JavaScript/TypeScript analysis (build-mode: none)
  │   ├── Java/Kotlin analysis (build-mode: manual)
  │   ├── Fork PR detection (skips SARIF upload on forks)
  │   └── SARIF artifact fallback when code scanning not enabled
  │
  ├── deploy.yml ──── Backend: Docker build + push + Render deploy
  │   ├── Build Docker images → ghcr.io
  │   ├── Deploy backend to Render (push to main/dev)
  │   └── PR build check (no deploy)
  │
  ├── vercel.yml ──── Frontend: Vercel deployment
  │   ├── Build & validate (bun, bundle size check)
  │   ├── Preview deploy (PRs + dev branch, comment URL on PR)
  │   ├── Production deploy (main branch only)
  │   └── Post-deploy health check (200, or 401/403 when Vercel Deployment Protection is on)
  │
  └── dast.yml ────── Post-deploy scanning
      ├── OWASP ZAP baseline (frontend)
      └── OWASP ZAP API scan (backend)

Weekly scheduled:
  ├── CodeQL — disabled while workflow is manual-only
  ├── Security scans (Monday 4 AM) — Semgrep step skipped; other jobs run
  └── Dependabot PRs (Monday, grouped)
```

---

## Security Layers (Defense in Depth)

| Layer | Tool | What It Catches | When |
|-------|------|----------------|------|
| **SAST** | CodeQL | Code-level vulnerabilities (injection, XSS, auth bypass) | Every PR + push |
| **SAST** | Semgrep | OWASP Top 10 patterns, JS/Java anti-patterns | Every PR + push |
| **SCA** | OWASP Dep-Check | Known CVEs in Java/Gradle dependencies (NVD database) | Every PR + push |
| **SCA** | npm audit | Known CVEs in JavaScript/npm dependencies | Every PR + push |
| **Secrets** | TruffleHog | Leaked API keys, tokens, passwords in git history | Every PR + push (**hard block**) |
| **Secrets** | ggshield | GitGuardian real-time secret detection | Every PR (when enabled) |
| **Container** | Trivy (filesystem) | Vulnerabilities in source dependencies | Every PR + push |
| **Container** | Trivy (image) | OS-level CVEs in Docker images | Every PR + push |
| **SBOM** | Syft | Software Bill of Materials for supply chain | Every PR (90-day retention) |
| **DAST** | OWASP ZAP baseline | Runtime XSS, CSRF, headers, cookies | After staging deploy |
| **DAST** | OWASP ZAP API | API endpoint security (auth, injection) | After staging deploy |
| **Dependencies** | Dependabot | Automated version update PRs | Weekly (grouped) |
| **Pre-commit** | `.githooks/pre-commit` | Leaked secrets in staged files (11 patterns + 10 file types) | Every local commit |

### Pre-commit Hook (Local)

The `.githooks/pre-commit` hook provides local defense before code reaches CI:

- **Forbidden files:** `.env`, `.env.local`, `.pem`, `.key`, `.p12`, `.jks`, `credentials.json`
- **Secret patterns:** `npg_*` (Neon), `AKIA*` (AWS), `eyJ*` (JWT), `sk-*`/`sk_live_*` (API keys), `gh[pousr]_*` (GitHub), connection strings with passwords, private keys
- **Install:** `git config core.hooksPath .githooks` (auto-configured)
- **Bypass:** `git commit --no-verify` (emergencies only, NOT recommended)

### CodeQL Workflow Hardening

- `build-mode: none` for JS/TS, `build-mode: manual` for Java/Kotlin
- Fork PR detection — SARIF upload skipped (no `security-events: write` on forks)
- `continue-on-error: true` — graceful degradation when code scanning not enabled
- SARIF artifact fallback — results saved as build artifacts for manual review
- Diagnostic step with setup instructions when upload fails

### Security Workflow Hardening

- `preflight` job checks SARIF upload eligibility (fork detection)
- All 5 SARIF upload steps gated on `needs.preflight.outputs.can-upload-sarif`
- Each upload has artifact fallback on failure
- Security gate includes diagnostic guidance

---

## Workflow Details

### 1. CI Pipeline (`ci.yml`)

**Triggers**: Push to `main`, all PRs.

| Job | Steps | Duration |
|-----|-------|----------|
| Frontend | Bun install → build → bundle verify → artifact upload | ~30s |
| Backend | Java 21 setup → Gradle compile → test (Postgres 16) → bootJar | ~2 min |
| CI Pass | Gate job (required status check) | instant |

### 2. Security Pipeline (`security.yml`)

**Triggers**: Push to `main`, all PRs, weekly schedule.

| Job | Tool | Output | Blocks Merge? |
|-----|------|--------|---------------|
| Semgrep | `semgrep/semgrep` container | SARIF → GitHub Security tab | No (findings visible) |
| TruffleHog | `trufflesecurity/trufflehog` | Pass/fail | **Yes (hard fail)** |
| ggshield | `GitGuardian/ggshield-action` | Pass/fail | Yes (when enabled) |
| OWASP Dep-Check | Standalone CLI v10 | SARIF + HTML report | No (report uploaded) |
| Frontend Audit | `npx audit-ci` | Console output | No |
| Trivy (filesystem) | `aquasecurity/trivy-action` | SARIF → Security tab | No |
| Trivy (image) | `aquasecurity/trivy-action` | SARIF → Security tab | No |
| SBOM | `anchore/sbom-action` | SPDX JSON (90-day artifact) | No |
| Security Pass | Gate job | Checks TruffleHog result | **Yes** |

### 3. CodeQL (`codeql.yml`)

**Triggers**: Push to `main`, PRs, weekly Monday 6 AM.

| Language | Build Required | Analysis |
|----------|---------------|----------|
| JavaScript/TypeScript | No (interpreted) | Auto-detected patterns |
| Java/Kotlin | Yes (`./gradlew classes`) | Compiled code analysis |

### 4. Deploy (`deploy.yml`)

**Triggers**: Push to `dev`/`main` (auto), PRs to `dev`/`main` (build check only), `workflow_dispatch` (manual with env choice).

| Trigger | Action |
|---------|--------|
| Push to `dev` | Build images → push to GHCR → deploy backend to Render (staging) |
| Push to `main` | Build images → push to GHCR → deploy backend to Render (production) |
| PR to `dev`/`main` | Build Docker images only (validates build, no push/deploy) |
| Manual dispatch | Choose staging or production environment |

| Step | Tool | Details |
|------|------|---------|
| Docker build (backend) | `docker/build-push-action@v6` | GHA layer cache |
| Docker build (frontend) | `docker/build-push-action@v6` | GHA layer cache |
| Push images | `ghcr.io` | Skipped on PRs |
| Deploy backend | Render API | `POST /v1/services/{id}/deploys` |
| Health check | curl | `GET /actuator/health/readiness` |

#### Render Deployment Flow

```
Push to dev/main
  → build-images job
    → Build + push Docker images to ghcr.io
  → deploy-backend job (only on push, not PRs)
    → Trigger deploy via Render API
    → Poll status every 15s (up to 15 min timeout)
    → Health check: GET /actuator/health/readiness (6 attempts)
    → Fail workflow if deploy or health check fails
  → pr-check job (only on PRs)
    → Verify Docker build succeeds without deploying
```

### 5. Frontend Deploy (`vercel.yml`)

**Triggers**: Push to `main`/`dev` (frontend changes), PRs (frontend changes), `workflow_dispatch`.

| Environment | Trigger | Vercel Mode | URL |
|-------------|---------|-------------|-----|
| **Preview** | PRs, dev push, manual | `vercel deploy --prebuilt` | Unique per commit |
| **Production** | main push, manual | `vercel deploy --prebuilt --prod` | Production domain |

| Step | Details |
|------|---------|
| Build & Validate | Bun install, `bun run build`, bundle size check (warn > 120 KB) |
| Deploy Preview | Vercel CLI deploy, PR comment with preview URL (updates existing comment) |
| Deploy Production | Vercel CLI deploy with `--prod` flag |
| Health Check | HTTP 200 on root + SPA routing verification (`/auth/login`) |

**Required GitHub Secrets:**
- `VERCEL_TOKEN` — Account token from Vercel Settings > Tokens
- `VERCEL_ORG_ID` — From `.vercel/project.json` after `vercel link`
- `VERCEL_PROJECT_ID` — From `.vercel/project.json` after `vercel link`

### 6. DAST (`dast.yml`)

**Triggers**: After Deploy workflow completes, or manual `workflow_dispatch`.

| Scan | Tool | Target |
|------|------|--------|
| ZAP Baseline | `zaproxy/action-baseline` | Frontend URL (passive + spider) |
| ZAP API | `zaproxy/action-api-scan` | Backend /api/ (OpenAPI format) |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Build + test pipeline |
| `.github/workflows/security.yml` | SAST + SCA + secrets + container + SBOM |
| `.github/workflows/codeql.yml` | GitHub CodeQL SAST |
| `.github/workflows/deploy.yml` | Backend: Docker build + Render deploy |
| `.github/workflows/vercel.yml` | Frontend: Vercel deploy (preview + production) |
| `render.yaml` | Render infrastructure blueprint |
| `frontend/vercel.json` | Vercel build config, SPA rewrites, API base URL |
| `.github/workflows/dast.yml` | OWASP ZAP post-deploy |
| `.github/dependabot.yml` | Automated dependency updates |
| `.githooks/pre-commit` | Local secret leak prevention hook |
| `.github/owasp-suppressions.xml` | Known false positive suppressions |
| `.github/zap-rules.tsv` | ZAP alert suppressions |
| `docs/THREAT-MODEL.md` | STRIDE threat analysis + risk register |

---

## Required Secrets

| Secret | Used By | Purpose |
|--------|---------|---------|
| `GITHUB_TOKEN` | All workflows | Auto-provided by GitHub |
| `RENDER_API_KEY` | deploy.yml | Render API key for triggering deploys |
| `GITGUARDIAN_API_KEY` | security.yml (ggshield) | GitGuardian API (optional) |
| `NVD_API_KEY` | security.yml (OWASP DC) | NVD database API key (optional, faster scans) |
| `VITE_SENTRY_DSN` | vercel.yml | Sentry DSN for frontend error tracking (optional) |

### Repository Variables

| Variable | Used By | Purpose |
|----------|---------|---------|
| `GITGUARDIAN_ENABLED` | security.yml | Set to `true` to enable ggshield |
| `STAGING_URL` | dast.yml | Frontend staging URL for ZAP |
| `STAGING_API_URL` | dast.yml | Backend staging URL for ZAP |

---

## Branch Protection (Recommended)

| Setting | Value |
|---------|-------|
| Required status checks | `CI Pass`, `Security Pass` |
| Require PR reviews | 1 approval |
| Require up-to-date branches | Yes |
| Include administrators | Yes |

---

## Compliance Coverage

| Standard | Controls | Workflows |
|----------|----------|-----------|
| OWASP Top 10 | A01–A10 | CodeQL + Semgrep + ZAP + DOMPurify |
| OWASP SAMM | Secure Build, Security Testing | ci.yml + security.yml + dast.yml |
| NIST 800-53 SA-11 | Developer Security Testing | SAST + SCA + DAST + Container |
| Supply Chain (SLSA) | SBOM + lockfiles + signed builds | Syft + bun.lock + Gradle lockfiles |

---

## Local Development

```bash
# Frontend
cd frontend && bun install && bun run dev

# Backend
cd backend && ./gradlew :app:bootRun

# Full stack
cp .env.example .env && docker compose up -d
```
