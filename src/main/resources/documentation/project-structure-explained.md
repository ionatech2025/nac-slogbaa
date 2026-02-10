# NAC-SLOGBAA Project Structure — Explained for Contributors

This document explains how the project is organized and what **modules** mean. It complements the detailed file tree in [STRUCTURE.md](STRUCTURE.md).

---

## 1. Overall Structure

The project is organized as a **multi-module monolith**: one repository, one deployable application, but the code is split into **Maven modules**. Each module is a **bounded context** (a distinct area of the business) and is built as its own Maven artifact. The **app** module (referred to as “bootstrap” in STRUCTURE.md) wires everything together and contains the main class and global configuration.

So: **one application**, **many modules** (packages/artifacts), not multiple deployable services.

---

## 2. What “Modules” Mean

In this project, **“module”** means two things:

1. **A Maven module** — a directory with its own `pom.xml` that is listed under `<modules>` in the root POM (e.g. `iam`, `learning`, `bootstrap`).
2. **A bounded context / domain** — one cohesive area of the product (e.g. “who can log in”, “courses and content”, “quizzes and certificates”).

So when we say “IAM module” or “Learning module”, we mean both that **slice of the product** and the **corresponding Maven module** (and its Java package, e.g. `com.nac.slogbaa.iam`).

### List of Modules (from STRUCTURE.md)

| Module | Purpose |
|--------|---------|
| **iam** | Identity & Access Management — trainees, staff users, authentication |
| **learning** | Courses, modules, content blocks, library resources, enrollment |
| **assessment** | Quizzes, attempts, certificates |
| **progress** | Trainee progress, completion records, analytics/dashboard |
| **website** | Public homepage, banners, impact stories, news |
| **communication** | Live sessions, attendees, meeting links |
| **system** | Cross-cutting: shared exceptions, events, security, storage, validation |
| **bootstrap / app** | Main application class, global config, CORS, OpenAPI, exception handling |

**Note:** Additional modules (learning, assessment, progress, website, communication, system) will be added as we work on them. STRUCTURE.md describes the full target layout; the *concept* of each module is a bounded context with the same internal layers.

---

## 2b. Current Layout (Multi-Module Restructuring)

The project has been restructured into a **multi-module Maven build** as follows.

### Root POM (`pom.xml` at project root)

- **Packaging:** `pom` (aggregator only — the root does not produce a JAR).
- **Maven requirement:** Any POM that declares `<modules>` must use `packaging=pom`, so the runnable application lives in a separate module.
- **Contents:** `<modules>` listing `iam` and `app`, plus `<dependencyManagement>` for internal artifacts (e.g. `iam`) and shared dependency versions (e.g. Flyway PostgreSQL).
- **No application code** — all source and resources for the running app live under `iam/` and `app/`.

### IAM module (`iam/`)

- **Role:** Library module for Identity & Access Management. Contains the full IAM bounded context: domain (core), application (ports, services, DTOs), adapters (persistence, REST, security), and config.
- **Packaging:** `jar`. Built as a **library** (Spring Boot repackage is skipped via `<skip>true</skip>`).
- **Location:** All IAM code lives under `iam/src/main/java/com/nac/slogbaa/iam/` and tests under `iam/src/test/...`. The root no longer contains any `com.nac.slogbaa.iam` source.
- **Dependencies:** Spring Boot Web, Data JPA, Validation, PostgreSQL (runtime), and test starters. No Flyway here — migrations are in the app module.

### App module (`app/`)

- **Role:** The **runnable** Spring Boot application. Contains the main class, global configuration, and shared infrastructure (e.g. Flyway, DB config).
- **Packaging:** `jar` (executable). Uses `spring-boot-maven-plugin` with `mainClass=com.nac.slogbaa.SlogbaaApplication`.
- **Contents:**
  - **Main class:** `app/src/main/java/com/nac/slogbaa/SlogbaaApplication.java`
  - **Resources:** `application.properties`, `db/migration/` (V1–V7 Flyway scripts). Component scanning picks up all beans from the `com.nac.slogbaa` package (including `com.nac.slogbaa.iam` from the IAM JAR).
- **Dependencies:** `iam`, Flyway (and `flyway-database-postgresql`), Spring Boot Web, Data JPA, PostgreSQL. The app depends on IAM; it does not contain IAM source.

### Directory tree (current)

```
slogbaa/
├── pom.xml                    # packaging pom, modules: iam, app
├── iam/
│   ├── pom.xml
│   └── src/main/java/com/nac/slogbaa/iam/   # full IAM (adapters, application, core, config)
│   └── src/main/resources/application-iam.properties
│   └── src/test/...
├── app/
│   ├── pom.xml
│   └── src/main/java/com/nac/slogbaa/SlogbaaApplication.java
│   └── src/main/resources/application.properties, db/migration/
├── frontend/                  # React + Vite SPA (see §2c)
│   └── src/features/iam/, app/, api/, shared/, layouts/
└── src/main/resources/        # optional: documentation, etc.
```

### Build and run

- **Build everything:** `mvn clean package` (builds `iam` first, then `app`).
- **Run the application:** `java -jar app/target/app-0.0.1-SNAPSHOT.jar` or `mvn spring-boot:run -pl app`.
- **Build only IAM:** `mvn clean compile -pl iam`.

---

## 2c. Frontend (React + Vite)

The **frontend** is a React application built with **Vite**, living in the top-level **`frontend/`** directory. It is organized by **feature** (aligned with backend bounded contexts) and uses **`.jsx`** for React components.

### Role and tech

- **Role:** Single-page application (SPA) for trainees and staff; consumes the backend REST API.
- **Stack:** React 18, Vite 6, React Router 6. All UI code is JavaScript (`.jsx` / `.js`), not TypeScript.
- **Dev server:** Vite runs on port **5173** and proxies `/api` to the backend (e.g. `http://localhost:8080`).

### Directory layout

```
frontend/
├── package.json
├── vite.config.js
├── index.html
├── public/
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root component, router wrapper
    ├── api/                   # Backend API client
    │   ├── client.js          # Base HTTP client
    │   └── iam/
    │       ├── auth.js        # Auth API (login, register)
    │       └── index.js
    ├── features/              # Feature modules (aligned with backend contexts)
    │   ├── iam/               # Identity & Access Management
    │   │   ├── components/    # LoginForm, RegisterForm, etc.
    │   │   ├── hooks/         # useAuth, etc.
    │   │   ├── pages/         # LoginPage, RegisterPage
    │   │   ├── routes.jsx     # Routes under /auth/*
    │   │   └── index.js
    │   └── app/               # App shell / main layout context
    │       ├── components/    # AppShell, etc.
    │       ├── pages/         # HomePage, etc.
    │       ├── routes.jsx     # Top-level routes (/, /auth/*, fallback)
    │       └── index.js
    ├── shared/                # Cross-cutting UI
    │   ├── components/        # Button, Input, etc.
    │   ├── hooks/             # useLocalStorage, etc.
    │   └── utils/             # cn, etc.
    └── layouts/               # App-wide layouts
        └── AppLayout.jsx
```

### Features (contexts) and routes

- **app** — App shell: root layout, top-level routing, home page. Routes: `/`, catch-all to `/`.
- **iam** — Auth and identity: login, registration. Routes under `/auth/*` (e.g. `/auth/login`, `/auth/register`).

New backend contexts (learning, assessment, progress, etc.) will get corresponding **`features/<context>/`** folders (components, hooks, pages, routes) as needed.

### Build and run

- **Install:** `cd frontend && npm install`
- **Dev:** `npm run dev` (Vite dev server; ensure backend is running for API calls).
- **Build:** `npm run build` (output in `frontend/dist/`).
- **Preview build:** `npm run preview`

The built output can be copied into `app/src/main/resources/static/` and served by Spring Boot in production if desired.

**Brand and colours:** The UI uses a palette aligned with [slogbaa.org](https://slogbaa.org/). See [frontend-design-notes.md](frontend-design-notes.md) and `frontend/src/index.css` for variables.

---

## 3. Inside Each (Domain) Module: Hexagonal Layers

Each domain module (e.g. IAM) is structured in **three main layers** plus config:

```
module (e.g. iam)/
├── adapters/      ← Infrastructure (outside world)
├── application/   ← Use cases & ports (orchestration)
├── core/          ← Domain (business logic only)
└── config/       ← Spring configuration for this module
```

### Core (domain)

- **Aggregates** (e.g. `Trainee`, `StaffUser`) — the main domain objects with identity and lifecycle.
- **Entities** — objects with identity that live inside an aggregate (e.g. `Profile`).
- **Value objects** — immutable concepts (e.g. `Email`, `FullName`, `TraineeCategory`).
- **Events** — things that happened in the domain (e.g. `TraineeRegistered`).
- **Specifications** — reusable business rules (e.g. “trainee can enroll”).
- **Exceptions** — domain-specific errors.

No frameworks here; only business logic and types. Dependencies point **inward**: core does not depend on application or adapters.

### Application (use cases / ports)

- **Port in (API)** — interfaces that define what the app can do (e.g. `RegisterTraineeUseCase`, `GetTraineeByIdUseCase`). These are the “use cases.”
- **Port out (SPI)** — interfaces for things the domain needs from the outside (e.g. `TraineeRepositoryPort`, `AuthenticationPort`).
- **Service** — implementations of the “in” ports; they call domain and out-ports (e.g. `RegisterTraineeService`).
- **DTOs** — **command** (inputs), **query** (read inputs), **result** (outputs) for use cases — no HTTP or DB details here.

So “application” = **orchestration**: it implements the use cases and defines how the domain is used and what it needs from the outside (ports).

### Adapters (infrastructure)

- **Persistence** — JPA entities, Spring Data repositories, **adapters** that implement the repository *ports*, **mappers** domain ↔ entities.
- **REST** — controllers, HTTP request/response DTOs, mappers to/from application DTOs.
- **Other** — security (JWT, password encoding), PDF, email, etc. — each implements a port the application layer depends on.

So “adapters” = **implementations of the out-ports** and **entrypoints** (e.g. REST) that call the in-ports (use cases).

### Config

- **Module-specific configuration** (e.g. `IamConfiguration`, `IamSecurityConfiguration`) — beans and settings that only this module needs.

---

## 4. How It Fits Together (Hexagonal)

- **Driving (inbound):** HTTP request → **REST adapter** (controller) → **application port in** (use case interface) → **service** (implementation) → **core** (domain).
- **Driven (outbound):** service needs to save a trainee → **application port out** (e.g. `TraineeRepositoryPort`) → **adapter** (e.g. `TraineeRepositoryAdapter`) → JPA repository → database.

So:

- **Core** = “what is a Trainee and what are the rules.”
- **Application** = “register trainee” (use case) and “I need something that can save trainees” (port).
- **Adapters** = “here is the REST API” and “here is the implementation that saves trainees with JPA.”

Modules talk to each other only through **application-layer ports** (and shared types in **system**), not by pulling in each other’s adapters or persistence. That keeps domains and infrastructure decoupled.

---

## 5. Quick Reference

- **Structure** = one application made of several **Maven modules**, each representing a **bounded context** (IAM, learning, assessment, etc.).
- **“Module”** in this doc = that **Maven module + its domain** (e.g. “IAM module” = IAM domain + `iam` artifact).
- **Inside each module**: **core** (domain), **application** (use cases + ports + DTOs), **adapters** (REST, DB, security, etc.), **config**.
- **Hexagonal idea**: domain in the center; application defines ports; adapters implement ports and talk to the world.
- **Current layout**: root is `pom`-only; **iam** is a library; **app** is the runnable jar (see [§2b. Current Layout](#2b-current-layout-multi-module-restructuring)).
- **Frontend**: React + Vite in **`frontend/`**, feature-based (`features/iam`, `features/app`), `.jsx` (see [§2c. Frontend](#2c-frontend-react--vite)).

For the full file tree and Maven POM examples, see [STRUCTURE.md](STRUCTURE.md). For the domain model and business rules, see [domain-model-design.md](domain-model-design.md). For who manages content (SuperAdmin vs Admin) and how to design the admin dashboard, see [admin-and-content-management.md](admin-and-content-management.md). For what to build first and how each user type flows through the system, see [development-roadmap-and-user-flows.md](development-roadmap-and-user-flows.md).
