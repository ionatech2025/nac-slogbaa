# SLOGBAA Threat Model — March 2026

STRIDE-based threat analysis for the SLOGBAA Online Learning Platform.

---

## System Overview

```
[Public Internet]
     │
     ├── Browser (Trainee / Admin)
     │     ├── React SPA (frontend)
     │     │     ├── Auth tokens (localStorage)
     │     │     ├── DOMPurify sanitization
     │     │     └── CSP headers (from CDN/backend)
     │     │
     │     └── HTTPS ──→ [CDN / Reverse Proxy]
     │                        │
     │                        ├── /api/* ──→ Spring Boot API (backend)
     │                        │                 ├── JWT validation
     │                        │                 ├── Role-based access (SUPER_ADMIN, ADMIN, TRAINEE)
     │                        │                 ├── Flyway migrations
     │                        │                 └── PostgreSQL 16
     │                        │
     │                        └── /* ──→ Static files (dist/)
     │
     └── CI/CD (GitHub Actions)
           ├── SAST (CodeQL + Semgrep)
           ├── SCA (OWASP Dep-Check + npm audit)
           ├── Secrets (TruffleHog + ggshield)
           ├── Container (Trivy)
           ├── DAST (OWASP ZAP)
           └── SBOM (Syft)
```

---

## STRIDE Analysis

### S — Spoofing (Identity)

| Threat | Risk | Mitigation | Status |
|--------|------|-----------|--------|
| Stolen JWT token | HIGH | Token in localStorage (XSS accessible); migrate to httpOnly cookies | Documented migration path in AuthContext.jsx |
| Weak passwords | MEDIUM | Backend enforces minimum length; no complexity rules yet | Add password strength meter |
| Session fixation | LOW | JWT is stateless; new token per login | Mitigated |
| Cross-tab session theft | LOW | BroadcastChannel syncs logout across tabs | Mitigated |
| Brute-force login | MEDIUM | No rate limiting on /api/auth/login | Add backend rate limiting (Phase 3) |

### T — Tampering (Data Integrity)

| Threat | Risk | Mitigation | Status |
|--------|------|-----------|--------|
| XSS injection via CMS content | HIGH | DOMPurify with strict 33-tag allow-list on all rendered HTML | Mitigated (SafeHtml.jsx) |
| SQL injection | LOW | Spring Data JPA parameterized queries | Mitigated |
| CSRF on API mutations | LOW | JWT in Authorization header (not cookies) = immune to CSRF | Mitigated |
| Tampered quiz answers | MEDIUM | Server-side validation of quiz submissions | Mitigated |
| File upload exploits | MEDIUM | Backend validates file type; no client-side execution of uploads | Verify backend content-type check |

### R — Repudiation (Audit Trail)

| Threat | Risk | Mitigation | Status |
|--------|------|-----------|--------|
| Admin actions not logged | MEDIUM | No audit log for staff/course/certificate changes | Add audit trail table |
| Certificate forgery | LOW | Certificates issued server-side with unique numbers | Mitigated |
| Quiz attempt tampering | LOW | Attempts recorded server-side with timestamps | Mitigated |

### I — Information Disclosure

| Threat | Risk | Mitigation | Status |
|--------|------|-----------|--------|
| Dev credentials in prod | HIGH | TestCredentialsSidebar gated behind `import.meta.env.DEV` | Mitigated |
| Error stack traces leaked | MEDIUM | Backend should return generic errors in prod profile | Verify prod error handler |
| Secrets in git history | HIGH | TruffleHog + ggshield scan full history in CI | Mitigated |
| Container vulnerabilities | MEDIUM | Trivy scans images for CVEs | Mitigated |
| Dependency CVEs | MEDIUM | OWASP Dep-Check (Java) + npm audit (JS) | Mitigated |

### D — Denial of Service

| Threat | Risk | Mitigation | Status |
|--------|------|-----------|--------|
| API flooding | MEDIUM | No rate limiting | Add backend rate limiting |
| Large file upload abuse | LOW | Backend limits upload size | Verify max size config |
| Client-side memory via large lists | LOW | TanStack Query pagination-ready; current tables small | Monitor as data grows |
| ReDoS in DOMPurify | LOW | DOMPurify maintained by Cure53; auto-updated via Dependabot | Mitigated |

### E — Elevation of Privilege

| Threat | Risk | Mitigation | Status |
|--------|------|-----------|--------|
| Trainee accessing admin routes | LOW | Frontend RequireTrainee guard + backend role checks | Mitigated |
| Admin accessing SuperAdmin actions | LOW | Backend validates role per endpoint | Mitigated |
| JWT role tampering | LOW | JWT signed with server secret; tampered tokens fail verification | Mitigated |
| Insecure direct object reference (IDOR) | MEDIUM | Backend checks ownership on trainee data access | Verify per-endpoint |

---

## Security Controls Summary

### Preventive

| Control | Tool/Implementation | Coverage |
|---------|-------------------|----------|
| SAST | CodeQL + Semgrep | JS + Java source code |
| SCA | OWASP Dep-Check + npm audit | Java + JS dependencies |
| Secret detection | TruffleHog + ggshield | Full git history |
| Container scanning | Trivy | Docker images + filesystem |
| Input sanitization | DOMPurify | All rendered HTML |
| Auth | JWT + role-based access | All API endpoints |
| CSRF | Bearer token auth | All mutations |
| XSS | CSP headers + DOMPurify | Rendering pipeline |

### Detective

| Control | Tool | Trigger |
|---------|------|---------|
| DAST | OWASP ZAP baseline + API | Post-deploy to staging |
| CodeQL scheduled | GitHub CodeQL | Weekly Monday 6 AM |
| Dependency updates | Dependabot | Weekly grouped PRs |
| SBOM | Syft | Every CI run |

### Responsive

| Control | Mechanism |
|---------|-----------|
| 401 auto-logout | Global interceptor + cross-tab sync |
| Error boundary | React ErrorBoundary catches crashes |
| CI gate | TruffleHog failure blocks merge |
| SARIF uploads | All findings in GitHub Security tab |

---

## Risk Register

| ID | Threat | Likelihood | Impact | Risk | Status | Owner |
|----|--------|-----------|--------|------|--------|-------|
| R1 | JWT in localStorage (XSS) | Low (DOMPurify mitigates) | High | MEDIUM | Accepted (migrate to httpOnly later) | Backend team |
| R2 | No rate limiting | Medium | Medium | MEDIUM | Open (Phase 3 hardening) | Backend team |
| R3 | No audit trail | Low | Medium | LOW | Open (future feature) | Product team |
| R4 | IDOR on some endpoints | Low | High | MEDIUM | Review needed | Backend team |

---

## Compliance Mapping

| Standard | Requirement | SLOGBAA Status |
|----------|------------|----------------|
| OWASP Top 10 2021 | A01 Broken Access Control | Role-based JWT + frontend guards |
| | A02 Cryptographic Failures | JWT with strong secret; HTTPS required |
| | A03 Injection | DOMPurify (XSS), JPA (SQL), parameterized queries |
| | A05 Security Misconfiguration | Prod profile; CSP recommended |
| | A06 Vulnerable Components | OWASP Dep-Check + Trivy + Dependabot |
| | A07 Auth Failures | JWT auth; rate limiting pending |
| | A08 Software Integrity | SBOM + CI verification + lockfiles |
| | A09 Logging Failures | Audit trail pending |
| NIST 800-53 | SA-11 Developer Testing | SAST + SCA + DAST in CI |
| | SI-10 Information Input Validation | DOMPurify + server-side validation |
| GDPR (if applicable) | Data minimization | Only necessary user data collected |

---

## Review Schedule

- **Monthly**: Review Security tab alerts, update suppressions
- **Quarterly**: Review threat model, prune risk register, update STRIDE
- **On incident**: Update threat model with lessons learned
