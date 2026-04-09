# SLOGBAA Project: Comprehensive Training Guide

This document serves as a training resource for newbie students to understand the architecture, technologies, and concepts used in building **SLOGBAA**, the Network for Active Citizens (NAC) online learning platform.

---

## 🚀 1. Technology Stack & Training Roadmap

A modern, scalable stack designed for robustness and performance.

### **Frontend (React Ecosystem)**
*   **React 18**: Component-based UI, Hooks, and Concurrent Rendering.
    *   *Topics to study:* Lifecycle with `useEffect`, State management with `useState`, Custom Hooks, Memoization (`useMemo`, `useCallback`).
*   **Vite 6**: Modern build tool.
    *   *Topics to study:* HMR (Hot Module Replacement), Environment variables in Vite, Vite Proxy.
*   **Bun**: High-performance package manager.
*   **Vanilla CSS + Custom Design System**:
    *   *Topics to study:* CSS Variables (Tokens), Flexbox/Grid, Glassmorphism, CSS Animations.
*   **React Router Dom**:
    *   *Topics to study:* Protected Routes, Nested Routing, URL Parameters.
*   **Zod**: Form validation.
    *   *Topics to study:* Schema definition, Error mapping, Integration with React Hook Form.

### **Backend (Java & Spring Ecosystem)**
*   **Java 21 (OpenJDK)**:
    *   *Topics to study:* Records, Sealed Classes, Pattern Matching, **Virtual Threads (Project Loom)**, Streams API, Optional.
*   **Spring Boot 4.0.2**:
    *   *Topics to study:* Dependency Injection (`@Service`, `@Component`), Spring Security (JWT, Filter Chain), Spring Data JPA, **RFC 9457 Problem Details**.
*   **PostgreSQL & Flyway**:
    *   *Topics to study:* Relational DB design, SQL joins, Migration scripts (V1__init.sql).
*   **Gradle**:
    *   *Topics to study:* `build.gradle.kts`, multi-module project configuration.

---

## 🛠️ 2. Backend Concepts (by Complexity)

The backend follows a **Hexagonal Architecture** (also known as Ports and Adapters).

| Level | Concept | Recommended Training Topics | Example Files (Min 5) |
| :--- | :--- | :--- | :--- |
| **Simple** | **Domain Entities** | Encapsulation, POJOs, Java Records | `User.java`, `Course.java`, `Module.java`, `Block.java`, `Profile.java` |
| **Simple** | **Value Objects** | Immutability, `equals()` & `hashCode()`, DDD | `BlockId.java`, `CourseId.java`, `ModuleOrder.java`, `Email.java`, `BlockType.java` |
| **Medium** | **DTOs** | Records, `@JsonProperty`, Formatting | `LoginRequest.java`, `CourseResponse.java`, `EnrollRequest.java`, `QuizResult.java`, `SearchQuery.java` |
| **Medium** | **Ports** | Interface-driven development, Decoupling | `LoginUseCase.java`, `UserRepository.java`, `CourseUseCase.java`, `CourseRepository.java`, `FileStorePort.java` |
| **Complex** | **Application Services** | `@Transactional`, Orchestration, Errors | `AuthenticateUserService.java`, `RegisterTraineeService.java`, `RecordProgressService.java`, `SubmitQuizService.java`, `GetResumePointService.java` |
| **Complex** | **Persistence Adapters** | Spring Data JPA, JPQL, Entity Mapping | `JpaUserRepositoryAdapter.java`, `JpaCourseRepositoryAdapter.java`, `JpaModuleRepositoryAdapter.java`, `JpaEnrollmentRepositoryAdapter.java`, `JpaQuizRepositoryAdapter.java` |
| **Complex** | **Web Adapters** | `@RestController`, `@Valid`, Responses | `AuthController.java`, `CourseController.java`, `AdminCourseController.java`, `QuizController.java`, `LiveSessionController.java` |
| **Expert** | **Cross-Cutting** | Security, Filters, Caching, Exceptions | `SecurityConfig.java`, `ApiVersionForwardFilter.java`, `GlobalExceptionHandler.java`, `OpenApiConfig.java`, `CacheConfig.java` |

---

## 🎨 3. Frontend Concepts (by Complexity)

The frontend is organized using a **Feature-Based Architecture**.

| Level | Concept | Recommended Training Topics | Example Files (Min 5) |
| :--- | :--- | :--- | :--- |
| **Simple** | **JSX Components** | Functional components, Fragment syntax | `Button.jsx`, `Badge.jsx`, `Avatar.jsx`, `Card.jsx`, `Pagination.jsx` |
| **Simple** | **Props & State** | Unidirectional data flow, `useState` hook | `CourseCard.jsx`, `ModuleList.jsx`, `LoginForm.jsx`, `SettingsPage.jsx`, `ConfirmModal.jsx` |
| **Medium** | **React Hooks** | `useEffect` deps, Custom hook logic | `useAuth.js`, `usePagination.js`, `useDebounce.js`, `useToast.js`, `useIdleTimeout.js` |
| **Medium** | **Routing** | `<Routes>`, `<Route>`, `<Link>`, `useNavigate` | `App.jsx`, `DashboardLayout.jsx`, `AdminLayout.jsx`, `AuthLayout.jsx`, `PublicLayout.jsx` |
| **Complex** | **Global State** | Context API, Provider pattern, Stores | `AuthContext.jsx`, `ThemeContext.jsx`, `useNotificationStore.js`, `useUserStore.js`, `useProgressStore.js` |
| **Complex** | **Form Validation** | Zod schemas, Validating complex objects | `loginSchema.js`, `registerSchema.js`, `courseSchema.js`, `moduleSchema.js`, `quizSchema.js` |
| **Complex** | **API Services** | Fetch API, Async/Await, Error handling | `auth.js`, `courses.js`, `homepage.js`, `liveSessions.js`, `learning.js` |
| **Expert** | **Design System** | CSS Variables, Responsive design | `tokens.css`, `animations.css`, `glass.css`, `accessibility.css`, `responsive.css` |

---

## 🏛️ 4. Design Patterns & Advanced Topics

*   **Hexagonal Architecture**: Focus on *Separation of Concerns*. Study why we never import `javax.persistence` in the `core` package.
*   **Repository Pattern**: Focus on *Abstracting Data Sources*.
*   **Dependency Injection (DI)**: Study Inversion of Control (IoC).
*   **Mapper Pattern**: Study why we separate Entities from DTOs (security and API stability).
*   **Strategy Pattern**: Handling dynamic logic (e.g., different quiz question types).
*   **Builder Pattern**: Clean object construction (Lombok `@Builder`).

---

## 📂 5. Other Relevant Tools & Files

| Tool | Focus for Training | File(s) (Min 5) |
| :--- | :--- | :--- |
| **Docker Compose** | Lifecycle, Networking, Volumes | `docker-compose.yml`, `Dockerfile`, `.dockerignore`, `docker-compose.prod.yml`, `docker-entrypoint.sh` |
| **Workflow / CI** | CI/CD pipelines, YAML syntax | `deploy.yml`, `ci.yml`, `security_scan.yml`, `pr_check.yml`, `release.yml` |
| **DB / Migrations** | Schema versioning, SQL scripts | `V1__init.sql`, `V2__add_iam.sql`, `V3__courses.sql`, `V14__email_verification.sql`, `V30__live_sessions.sql` |
| **Environment** | Secrets management, fallbacks | `.env`, `.env.example`, `.env.test`, `.env.docker`, `.env.production` |
| **Configs / Meta** | Build systems, Linting, Metadata | `build.gradle.kts`, `settings.gradle.kts`, `vite.config.js`, `package.json`, `render.yaml` |

---
*Created for the NAC SLOGBAA Engineering Training Program – March 2026*
