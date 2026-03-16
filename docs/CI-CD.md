# SLOGBAA CI/CD & Security Pipeline — March 2026

Complete reference for automated build, test, security scanning, and deployment.

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
  │   ├── SAST ────── Semgrep (OWASP Top 10 + JS + Java rules)
  │   ├── Secrets ─── TruffleHog (full git history deep scan)
  │   ├── Secrets ─── ggshield / GitGuardian (if enabled)
  │   ├── SCA ─────── OWASP Dependency-Check (Java CVEs)
  │   ├── SCA ─────── Frontend npm audit
  │   ├── Container ─ Trivy (filesystem + Docker image scan)
  │   ├── SBOM ────── Syft (supply chain transparency)
  │   └── sec-pass ── gate (TruffleHog failure = hard block)
  │
  ├── codeql.yml ──── SAST (GitHub native)
  │   ├── JavaScript/TypeScript analysis
  │   └── Java/Kotlin analysis
  │
  ├── deploy.yml ──── Docker build + push + deploy
  │   ├── Build Docker images (backend + frontend)
  │   ├── Push to ghcr.io
  │   └── Deploy to staging/production
  │
  └── dast.yml ────── Post-deploy scanning
      ├── OWASP ZAP baseline (frontend)
      └── OWASP ZAP API scan (backend)

Weekly scheduled:
  ├── CodeQL (Monday 6 AM)
  ├── Security scans (Monday 4 AM)
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

**Triggers**: Push to `main` (auto), `workflow_dispatch` (manual with env choice).

| Step | Tool | Cache |
|------|------|-------|
| Docker build (backend) | `docker/build-push-action@v6` | GHA layer cache |
| Docker build (frontend) | `docker/build-push-action@v6` | GHA layer cache |
| Push | `ghcr.io` | — |
| Deploy | Environment-gated | Required reviewers for production |

### 5. DAST (`dast.yml`)

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
| `.github/workflows/deploy.yml` | Docker build + deploy |
| `.github/workflows/dast.yml` | OWASP ZAP post-deploy |
| `.github/dependabot.yml` | Automated dependency updates |
| `.github/owasp-suppressions.xml` | Known false positive suppressions |
| `.github/zap-rules.tsv` | ZAP alert suppressions |
| `docs/THREAT-MODEL.md` | STRIDE threat analysis + risk register |

---

## Required Secrets

| Secret | Used By | Purpose |
|--------|---------|---------|
| `GITHUB_TOKEN` | All workflows | Auto-provided by GitHub |
| `GITGUARDIAN_API_KEY` | security.yml (ggshield) | GitGuardian API (optional) |
| `NVD_API_KEY` | security.yml (OWASP DC) | NVD database API key (optional, faster scans) |

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
