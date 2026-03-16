# SLOGBAA Backend Architecture

Technical reference for the Spring Boot backend. Updated March 2026.

---

## Build System

| Property | Value |
|----------|-------|
| Build tool | Gradle 8.14.3 Kotlin DSL |
| Java version | 21 (toolchain-enforced) |
| Spring Boot | 4.0.2 |
| Dependency management | Spring Boot BOM via `io.spring.dependency-management` plugin |
| Fat JAR | Only `app` module produces a bootable JAR (72 MB) |

### Gradle Commands

```bash
./gradlew build              # Compile all + run all tests
./gradlew compileJava        # Compile only
./gradlew test               # Tests only
./gradlew :iam:test          # Single module tests
./gradlew :app:bootRun       # Run the application
./gradlew :app:bootJar       # Build fat JAR (skip tests: add -x test)
./gradlew clean              # Clean all build outputs
./gradlew dependencies       # Show dependency tree
```

---

## Module Architecture

7 modules following hexagonal (ports & adapters) architecture:

### shared-ports (zero dependencies)

Pure Java interfaces defining contracts between modules. No Spring, no framework code.

| Interface | Purpose |
|-----------|---------|
| `FileStoragePort` | Store uploaded files, return URL |
| `CertificatePdfGeneratorPort` | Generate certificate PDFs |
| `TraineeNotificationPort` | Send trainee emails (welcome, certificate, password) |
| `StaffNotificationPort` | Send staff emails (welcome, password) |
| `PasswordResetNotificationPort` | Send password reset links |
| `TraineeCourseQuizScorePort` | Cross-module quiz score lookup |
| `CourseDeletionCheckPort` | Cross-module enrollment check |

### infrastructure

Implements shared-ports interfaces with real infrastructure:

| Adapter | Implements | Technology |
|---------|-----------|------------|
| `LocalFileStorageAdapter` | `FileStoragePort` | Local filesystem with UUID naming |
| `EmailService` | — | Spring Mail (SMTP) |
| `EmailTraineeNotificationAdapter` | `TraineeNotificationPort` | @Async email via virtual threads |
| `EmailStaffNotificationAdapter` | `StaffNotificationPort` | @Async email via virtual threads |
| `LoggingTraineeNotificationAdapter` | `TraineeNotificationPort` | Fallback when SMTP not configured |
| `LoggingStaffNotificationAdapter` | `StaffNotificationPort` | Fallback when SMTP not configured |
| `PasswordResetNotificationAdapter` | `PasswordResetNotificationPort` | @Async email |
| `CertificatePdfGenerator` | `CertificatePdfGeneratorPort` | OpenHTMLtoPDF |

### iam (Identity & Access Management)

**Domain (core/):**
- Aggregates: `Trainee`, `StaffUser`
- Entities: `Profile`, `PasswordResetToken`
- Value objects: `Email`, `TraineeId`, `StaffUserId`, `FullName`, `PhoneNumber`, `District`, `PhysicalAddress`, `Gender`, `TraineeCategory`, `StaffRole`, `AuthenticatedIdentity`, `AuthenticatedRole`
- Domain exceptions: 12 typed exceptions

**Application (application/):**
- 14 use case ports (in-ports): `AuthenticateUserUseCase`, `RegisterTraineeUseCase`, `CreateStaffUseCase`, `DeleteStaffUseCase`, `PasswordResetUseCase`, etc.
- 6 out-ports: `AuthTokenPort`, `PasswordHasherPort`, `TraineeRepositoryPort`, `StaffUserRepositoryPort`, `PasswordResetTokenRepositoryPort`
- 14 application services implementing use cases

**Adapters:**
- REST controllers (8): Auth, PasswordReset, AdminStaff, AdminTrainees, AdminDashboard, AdminMe, Trainee, Test
- Persistence adapters (3): Trainee, StaffUser, PasswordResetToken (JPA)
- Security adapters: `JwtTokenAdapter`, `JwtAuthenticationFilter`, `RateLimitFilter`, `PasswordEncoderAdapter`, `AuditLogger`

**Config:**
- `IamSecurityConfiguration` — Security filter chain, CORS, HSTS, BCrypt bean
- `IamConfiguration` — Wires use case beans to service implementations

### learning

**Domain:** `Course`, `CourseWithModules`, `Module`, `ContentBlock` aggregates and entities.

**Application:** Use cases for published courses, admin courses, course details, library resources (CRUD + publish/unpublish).

**Adapters:**
- REST controllers (4): Course, AdminCourse, LibraryResource, AdminLibraryResource
- Persistence adapters with `@Cacheable` on read queries and `@CacheEvict` on mutations

### assessment

**Domain:** Quiz, Question, Option, QuizAttempt.

**Application:** Quiz CRUD, attempt management, scoring.

**Adapters:**
- REST controllers (3): TraineeQuiz, AdminQuiz, AdminQuizAttempts

### progress

**Domain:** `TraineeProgress` aggregate.

**Application:** Enrollment, progress tracking, module completion, certificate issuance/revocation.

**Adapters:**
- REST controllers (6): Enrollment, Progress, Certificate, AdminCertificate, AdminCourseManagement, TraineeSettings

### app (entry point)

The only module producing a bootable JAR. Aggregates all modules.

| Component | Purpose |
|-----------|---------|
| `SlogbaaApplication` | Main class with @ComponentScan, @EntityScan, @EnableJpaRepositories |
| `CacheConfig` | @EnableCaching with 4 cache regions |
| `AsyncConfig` | @EnableAsync with virtual thread executor |
| `StartupValidator` | Validates JWT, CORS, DB config on startup |
| `TokenCleanupScheduler` | Purges expired reset tokens every 6 hours |
| `FileUploadController` | Hardened file upload with magic-byte validation |
| `GlobalExceptionHandler` | RFC 9457 catch-all error handler |
| `RequestTracingFilter` | MDC traceId/userId propagation |
| `FileStorageWebConfig` | Serves /uploads with Cache-Control headers |
| `WebMvcConfig` | SPA fallback for client-side routing |

---

## Security Architecture

### Authentication Flow

```
Client → [Rate Limit Filter] → [JWT Auth Filter] → [Spring Security] → Controller
                                      │
                               Extracts Bearer token
                               Validates structure (2 dots)
                               Rejects nested Bearer
                               Parses via JwtTokenAdapter
                               Sets SecurityContext
```

### JWT Token Structure

| Claim | Value |
|-------|-------|
| `sub` | User UUID |
| `iss` | `slogbaa-lms` |
| `aud` | `slogbaa-frontend` |
| `iat` | Issued at timestamp |
| `exp` | Expiry (24h dev, 1h prod) |
| `userId` | User UUID |
| `email` | User email |
| `role` | TRAINEE / ADMIN / SUPER_ADMIN |

### Rate Limiting

| Endpoint Group | Dev Limit | Prod Limit | Window |
|---------------|-----------|------------|--------|
| `/api/auth/**` | 20 req | 10 req | 60 seconds |
| `/api/files/upload` | 30 req | 20 req | 60 seconds |

### Endpoint Authorization

| Pattern | Access |
|---------|--------|
| `/api/auth/**` | Public |
| `/actuator/health`, `/actuator/info` | Public |
| `/actuator/prometheus` | ADMIN, SUPER_ADMIN |
| `/actuator/**` | SUPER_ADMIN |
| `/api/files/upload` | ADMIN, SUPER_ADMIN |
| All other `/api/**` | Authenticated |

---

## Observability

### Actuator Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `/actuator/health` | Public | Liveness + readiness probes |
| `/actuator/info` | Public | Application info |
| `/actuator/metrics` | SUPER_ADMIN | Micrometer metrics |
| `/actuator/prometheus` | ADMIN | Prometheus scrape target |
| `/actuator/loggers` | SUPER_ADMIN | Runtime log level management |

### Logging

- **Dev:** Colored console, DEBUG for app + Hibernate SQL + Spring Security
- **Prod:** JSON structured output, WARN root, INFO for app code
- **MDC fields:** `traceId` (from X-Request-ID or generated), `userId` (from auth context)
- **AUDIT logger:** Structured security events (login, registration, password reset, access denied)

### Metrics

Micrometer + Prometheus registry. Application-level tag: `application=slogbaa`.

---

## Caching

| Cache Name | What | Evicted On |
|------------|------|------------|
| `publishedCourses` | Published course list | Course create/update/publish/unpublish/delete |
| `adminCourses` | All courses (admin view) | Course create/update/publish/unpublish/delete |
| `publishedLibrary` | Published library resources | Resource create/update/publish/unpublish |
| `adminLibrary` | All library resources | Resource create/update/publish/unpublish |

Backend: `ConcurrentMapCacheManager` (in-memory). For multi-instance: swap to Redis.

---

## Database

- **Engine:** PostgreSQL 16
- **Migrations:** Flyway 10.14, 13 versioned scripts (V1–V13)
- **Location:** `app/src/main/resources/db/migration/` (single canonical directory)
- **Strategy:** `baseline-on-migrate=true`, `validate-on-migrate=true`, `clean-disabled=true`
- **JPA:** `ddl-auto=none`, `open-in-view=false`

### Schema Overview

| Migration | Tables |
|-----------|--------|
| V1 | `staff_user`, `trainee` (IAM aggregates) |
| V2 | `course`, `module`, `content_block`, `library_resource` |
| V3 | `quiz`, `question`, `option`, `quiz_attempt` |
| V4 | `trainee_progress`, `module_progress`, `certificate` |
| V5 | Website content tables |
| V6 | Engagement tracking tables |
| V7 | Seed data |
| V8 | BCrypt password hash updates |
| V9 | Trainee phone field |
| V10 | Password reset tokens |
| V11 | Additional course seed data |
| V12 | Course/module image URL columns |
| V13 | Trainee settings |

---

## Docker

### Backend Dockerfile

Multi-stage build:
1. **Build stage:** `eclipse-temurin:21-jdk-alpine` — runs `./gradlew :app:bootJar`
2. **Runtime stage:** `eclipse-temurin:21-jre-alpine` — non-root user (app:1000), exposes 8080

Layer caching: Gradle wrapper + build scripts copied first; source copied second.

### Frontend Dockerfile

Multi-stage build:
1. **Build stage:** `node:20-alpine` — `npm ci && npm run build`
2. **Runtime stage:** `nginx:1.27-alpine` — SPA routing, API proxy to backend, gzip, cache headers, security headers

### Docker Compose

3 services:
- `postgres` — PostgreSQL 16 with health checks and persistent volume
- `backend` — Spring Boot API on port 8080
- `frontend` — nginx on port 3000, proxies `/api` and `/uploads` to backend

---

## Test Architecture

98 tests across 14 test classes in the `iam` module:

### Domain Tests (40 tests)
- `EmailTest` (14) — Validation, normalization, equality
- `FullNameTest` (7) — Blank rejection, trimming
- `PhoneNumberTest` (9) — Format validation, both-or-neither rule
- `PasswordResetTokenTest` (6) — Expiry, null rejection
- `TraineeTest` (4) — Aggregate construction

### Application Service Tests (31 tests)
- `AuthenticateUserServiceTest` (4) — Login success/failure
- `RegisterTraineeServiceTest` (3) — Registration, duplicate email
- `PasswordResetServiceTest` (10) — Full reset flow
- `CreateStaffServiceTest` (6) — Create, role limits, email uniqueness
- `DeleteStaffServiceTest` (5) — Delete, self-delete, last super admin
- `ChangeStaffPasswordServiceTest` (3) — Password change, wrong current

### Adapter Tests (16 tests)
- `JwtTokenAdapterTest` (11) — Token lifecycle, validation
- `RateLimitFilterTest` (5) — Rate limiting behavior

### Architecture Tests (5 rules)
- Core must not depend on adapters
- Core must not depend on Spring
- Core must not depend on application layer
- Application must not depend on adapters
- Port types must be interfaces
