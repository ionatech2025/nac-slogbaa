# SLOGBAA — NAC Online Learning Platform

**SLOGBAA** is NAC's online learning platform for local governance and budget accountability training across Uganda. It supports separate experiences for **trainees** and **staff** (Admin / Super Admin), with a complete path from registration through course completion to certificate issuance.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Docker](#docker)
- [Security](#security)
- [API Reference](#api-reference)
- [License](#license)

---

## Overview

The platform is a **full-stack monorepo** with cleanly separated `backend/` and `frontend/` directories:

- **Backend:** Java 21, Spring Boot 4.0.2, Gradle Kotlin DSL, 7-module hexagonal architecture. REST API, Spring Data JPA, PostgreSQL, Flyway migrations, Spring Security with JWT.
- **Frontend:** React 18, Vite, TanStack Query v5, Zustand v5. Feature-based structure aligned with backend bounded contexts.
- **Database:** PostgreSQL 16. Schema managed exclusively by Flyway (13 versioned migrations); JPA does not create or alter schema.

Architecture follows **hexagonal (ports & adapters)** with **domain-driven design**: bounded contexts (IAM, Learning, Assessment, Progress), clear application ports, infrastructure adapters, and ArchUnit-enforced boundaries.

---

## Features

- **Identity & Access Management (IAM)** — Trainee registration, staff management, JWT auth with rate limiting, password reset, role-based access (Super Admin / Admin / Trainee).
- **Learning Management** — Courses with modules and rich content blocks (text, image, video, activity via Editor.js), library resources, publish/unpublish workflow.
- **Assessment** — Quiz builder, question/option management, timed attempts with scoring, pass/fail enforcement.
- **Progress & Certification** — Course enrollment, module completion tracking, progress percentage, PDF certificate generation and email delivery.
- **Admin Dashboard** — Staff/trainee overview, course management, enrollment tracking, certificate issuance and revocation.
- **Public Homepage** — Marketing landing page with hero, features, testimonials, CTA.

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Java 21, Spring Boot 4.0.2, Spring Security 6+, Spring Data JPA, Flyway 10.14, PostgreSQL 16 |
| **Build** | Gradle 8.14.3 Kotlin DSL (backend), Vite 6 (frontend) |
| **Frontend** | React 18, React Router 6, TanStack Query 5, Zustand 5, Lucide React, DOMPurify, Editor.js |
| **Security** | JWT (JJWT 0.12.6) with issuer/audience binding, BCrypt-13, rate limiting, HSTS, CSP headers |
| **Observability** | Spring Boot Actuator, Micrometer + Prometheus, structured JSON logging, MDC tracing |
| **Runtime** | JRE 21 with virtual threads, Node 20 for frontend build |
| **Containers** | Docker multi-stage builds, Docker Compose orchestration |

---

## Project Structure

```
nac-slogbaa/
├── backend/                          # Spring Boot multi-module API
│   ├── build.gradle.kts              # Root build — Spring Boot BOM, shared config
│   ├── settings.gradle.kts           # Module declarations
│   ├── gradlew, gradle/              # Gradle 8.14.3 wrapper
│   ├── Dockerfile                    # Backend container (multi-stage, non-root)
│   │
│   ├── shared-ports/                 # Pure port interfaces (zero dependencies)
│   │   └── src/main/java/.../shared/ports/
│   │       ├── FileStoragePort.java
│   │       ├── CertificatePdfGeneratorPort.java
│   │       ├── TraineeNotificationPort.java
│   │       ├── StaffNotificationPort.java
│   │       └── PasswordResetNotificationPort.java
│   │
│   ├── infrastructure/               # Adapters for email, file storage, PDF
│   │   └── src/main/java/.../infrastructure/
│   │       ├── email/                # EmailService (SMTP)
│   │       ├── notification/         # Async email + logging fallback adapters
│   │       ├── storage/              # LocalFileStorageAdapter
│   │       └── certificate/          # PDF generation (OpenHTMLtoPDF)
│   │
│   ├── iam/                          # Identity & Access Management
│   │   └── src/main/java/.../iam/
│   │       ├── core/                 # Domain: Trainee, StaffUser, Email, PasswordResetToken
│   │       ├── application/          # Use cases, ports (in/out), services, DTOs
│   │       ├── adapters/
│   │       │   ├── rest/             # Controllers: Auth, Staff, Trainee, PasswordReset
│   │       │   ├── persistence/      # JPA entities, repositories, adapters
│   │       │   └── security/         # JwtTokenAdapter, JwtAuthFilter, RateLimitFilter,
│   │       │                         # PasswordEncoderAdapter, AuditLogger
│   │       └── config/               # IamSecurityConfiguration, IamConfiguration
│   │   └── src/test/java/.../iam/
│   │       ├── unit/core/            # Email, FullName, PhoneNumber, PasswordResetToken, Trainee
│   │       ├── unit/adapters/        # JwtTokenAdapter, RateLimitFilter
│   │       ├── unit/application/     # AuthenticateUser, RegisterTrainee, CreateStaff,
│   │       │                         # DeleteStaff, ChangeStaffPassword, PasswordReset
│   │       └── architecture/         # ArchUnit hexagonal boundary enforcement
│   │
│   ├── learning/                     # Courses, modules, content blocks, library
│   │   └── src/main/java/.../learning/
│   │       ├── core/                 # Course, Module, ContentBlock aggregates
│   │       ├── application/          # Use cases + services
│   │       └── adapters/             # REST controllers + JPA (with @Cacheable)
│   │
│   ├── assessment/                   # Quizzes, questions, attempts, scoring
│   │   └── src/main/java/.../assessment/
│   │       ├── core/                 # Quiz domain
│   │       ├── application/          # Use cases + services
│   │       └── adapters/             # REST controllers + JPA
│   │
│   ├── progress/                     # Enrollment, progress, certificates
│   │   └── src/main/java/.../progress/
│   │       ├── core/                 # TraineeProgress aggregate
│   │       ├── application/          # Use cases + services
│   │       └── adapters/             # REST controllers + JPA
│   │
│   └── app/                          # Spring Boot entry point
│       └── src/main/
│           ├── java/.../
│           │   ├── SlogbaaApplication.java
│           │   ├── config/           # CacheConfig, AsyncConfig, StartupValidator,
│           │   │                     # TokenCleanupScheduler
│           │   ├── controller/       # FileUploadController, GlobalExceptionHandler
│           │   ├── observability/    # RequestTracingFilter (MDC traceId/userId)
│           │   ├── FileStorageWebConfig.java
│           │   └── WebMvcConfig.java
│           └── resources/
│               ├── application.properties
│               ├── application-dev.properties
│               ├── application-prod.properties
│               ├── logback-spring.xml
│               └── db/migration/     # V1–V13 Flyway migrations (canonical)
│
├── frontend/                         # React SPA (Vite + React 18)
│   ├── package.json                  # Dependencies + scripts
│   ├── vite.config.js                # Dev proxy, code splitting, vendor chunks
│   ├── Dockerfile                    # Frontend container (nginx, SPA routing, API proxy)
│   ├── index.html
│   └── src/
│       ├── App.jsx                   # Provider stack (Query + Router + Theme + Auth)
│       ├── api/                      # Fetch client + domain API modules
│       ├── features/
│       │   ├── iam/                  # Auth context, login/register forms, password reset
│       │   ├── app/                  # Admin layout, trainee layout, 15+ pages
│       │   ├── learning/             # Course list, course detail, library
│       │   └── assessment/           # Quiz editor, quiz panel, read-only view
│       ├── shared/                   # 25+ reusable components (Button, Modal, Toast, etc.)
│       ├── stores/                   # Zustand UI store (theme, sidebar, toasts)
│       ├── contexts/                 # ThemeContext
│       └── lib/                      # TanStack Query client, hooks, query key factory
│
├── docker-compose.yml                # Orchestrates postgres + backend + frontend
├── .env.example                      # Template for secrets
├── docs/                             # Architecture and API documentation
└── .gitignore
```

---

## Prerequisites

- **Java 21** (backend)
- **Node.js 20+** (frontend)
- **PostgreSQL 16** (or use Docker)
- **Docker & Docker Compose** (optional, for containerized deployment)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd nac-slogbaa
```

### 2. Database

**Option A — Docker (recommended)**

```bash
cp .env.example .env
# Edit .env: set POSTGRES_PASSWORD
docker compose up -d postgres
```

**Option B — Local PostgreSQL**

```sql
CREATE DATABASE slogbaa;
CREATE USER slogbaa WITH PASSWORD '<your-password>';
GRANT ALL PRIVILEGES ON DATABASE slogbaa TO slogbaa;
```

### 3. Build and run the backend

```bash
cd backend
./gradlew build              # Compile + test all modules
./gradlew :app:bootRun       # Start on http://localhost:8080
```

Flyway runs on first start, applying all migrations and seed data.

### 4. Run the frontend (development)

```bash
cd frontend
npm install
npm run dev                  # Start on http://localhost:5173
```

Vite proxies `/api` and `/uploads` to `http://localhost:8080`.

### 5. Production build (frontend)

```bash
cd frontend
npm run build                # Output in dist/
```

---

## Configuration

Backend configuration lives in `backend/app/src/main/resources/`. Profiles: `dev` (default), `prod`.

### Required Environment Variables (Production)

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | Set to `prod` |
| `JWT_SECRET` | Random string, minimum 32 characters (256 bits) |
| `DATASOURCE_URL` | JDBC URL, e.g. `jdbc:postgresql://host:5432/slogbaa` |
| `DATASOURCE_USERNAME` | Database user |
| `DATASOURCE_PASSWORD` | Database password |
| `CORS_ALLOWED_ORIGINS` | HTTPS origins, e.g. `https://app.slogbaa.org` |
| `PASSWORD_RESET_BASE_URL` | Frontend URL for reset links |

### Optional Environment Variables

| Variable | Description |
|----------|-------------|
| `SMTP_HOST`, `SMTP_PORT` | Mail server (default: Gmail SMTP) |
| `SMTP_USERNAME`, `SMTP_PASSWORD` | Mail credentials |
| `FILE_UPLOAD_DIR` | Upload directory (default: `uploads`) |

See `.env.example` at the project root for a complete template.

---

## Running Tests

### Backend (98 tests)

```bash
cd backend
./gradlew test               # Run all tests
./gradlew :iam:test          # Run IAM module tests only
```

**Test suites:**

| Suite | Tests | Coverage |
|-------|-------|----------|
| EmailTest | 14 | Email validation, normalization, equality |
| FullNameTest | 7 | Blank rejection, trimming, concatenation |
| PhoneNumberTest | 9 | Country code format, national number, both-or-neither |
| PasswordResetTokenTest | 6 | Expiry, null rejection |
| TraineeTest | 4 | Aggregate construction, null validation |
| JwtTokenAdapterTest | 11 | Token lifecycle, wrong key/issuer/audience, weak secret |
| RateLimitFilterTest | 5 | Under/over limit, per-IP isolation, headers |
| AuthenticateUserServiceTest | 4 | Login success/failure paths |
| RegisterTraineeServiceTest | 3 | Registration, duplicate/staff email block |
| PasswordResetServiceTest | 10 | Token creation, expiry, completion, password policy |
| CreateStaffServiceTest | 6 | Create, duplicate email, role limits, notification |
| DeleteStaffServiceTest | 5 | Delete, self-delete block, last super admin block |
| ChangeStaffPasswordServiceTest | 3 | Password change, wrong current password |
| HexagonalArchitectureTest | 5 | ArchUnit: core isolation, ports are interfaces |

### Frontend

```bash
cd frontend
npm run build                # Verify production build succeeds
```

---

## Docker

### Full stack (database + backend + frontend)

```bash
cp .env.example .env         # Fill in secrets
docker compose up -d --build
```

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5432 | PostgreSQL 16 with health checks |
| `backend` | 8080 | Spring Boot API (non-root container) |
| `frontend` | 3000 | nginx serving SPA + proxying `/api` to backend |

### Database only (for local development)

```bash
docker compose up -d postgres
```

### Build images independently

```bash
docker build -t slogbaa-backend ./backend
docker build -t slogbaa-frontend ./frontend
```

---

## Security

The backend implements production-grade security hardening:

- **JWT Authentication** — HS256 with mandatory 256-bit secret, issuer/audience claim binding, 30s clock skew tolerance, 1-hour expiry in production.
- **Password Hashing** — BCrypt strength 13 (~400ms per hash).
- **Rate Limiting** — Per-IP sliding window: 10 req/min on auth endpoints (prod), 20 req/min on file uploads. X-RateLimit headers included.
- **File Upload Security** — Allow-listed subdirectories, MIME type + magic-byte content sniffing, 5MB size limit, admin-only access.
- **CORS** — HTTPS-only origins enforced in production, credentials scoped to `/api/**`.
- **Security Headers** — X-Content-Type-Options: nosniff, X-Frame-Options: DENY, HSTS with 1-year max-age.
- **Error Responses** — RFC 9457 ProblemDetail format globally. No stack traces or internal details ever leak to clients.
- **Startup Validation** — Application refuses to start in production if JWT secret is missing/weak or CORS origins are not configured.
- **Audit Logging** — Structured audit events for login, registration, password reset, and access denied on a dedicated AUDIT logger.
- **Token Cleanup** — Scheduled task purges expired password reset tokens every 6 hours.
- **Async Email** — All notification adapters use `@Async` with virtual threads; never log plaintext passwords.

---

## API Reference

The backend exposes 60+ REST endpoints across 5 bounded contexts. All protected endpoints require a `Bearer` JWT token.

| Context | Base Path | Endpoints | Auth |
|---------|-----------|-----------|------|
| **Auth** | `/api/auth` | login, register, password reset (request/verify/confirm) | Public |
| **Trainee** | `/api/trainee`, `/api/me` | Profile, settings | TRAINEE |
| **Courses** | `/api/courses` | Published list, detail, enroll, progress, resume, module completion | TRAINEE |
| **Library** | `/api/library` | Published resources | TRAINEE |
| **Certificates** | `/api/certificates` | List, download PDF, send email | TRAINEE |
| **Quizzes** | `/api/courses/{id}/modules/{id}/quiz` | Get quiz, start attempt, submit answers | TRAINEE |
| **Admin Dashboard** | `/api/admin/dashboard` | Overview (staff/trainee counts) | ADMIN |
| **Admin Courses** | `/api/admin/courses` | CRUD courses, modules, content blocks, publish/unpublish | ADMIN/SUPER_ADMIN |
| **Admin Library** | `/api/admin/library` | CRUD library resources, publish/unpublish | ADMIN/SUPER_ADMIN |
| **Admin Assessment** | `/api/admin/assessment` | Quiz CRUD, attempts list | ADMIN/SUPER_ADMIN |
| **Admin Certificates** | `/api/admin/certificates` | List, revoke | ADMIN/SUPER_ADMIN |
| **Admin Users** | `/api/admin/staff`, `/api/admin/trainees` | Staff/trainee CRUD, password management | SUPER_ADMIN |
| **Admin Enrollment** | `/api/admin/course-management` | Enrollments, deletion checks | SUPER_ADMIN |
| **File Upload** | `/api/files/upload` | Multipart image upload with validation | ADMIN/SUPER_ADMIN |
| **Actuator** | `/actuator` | health (public), prometheus (ADMIN), others (SUPER_ADMIN) | Varies |

---

## License

See the [LICENSE](LICENSE) file in this repository (if present).

---

**NAC SLOGBAA** — Training and certification for local governance and budget accountability.
