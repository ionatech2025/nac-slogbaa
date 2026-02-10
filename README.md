# SLOGBAA — NAC Online Learning Platform

**SLOGBAA** is NAC’s online learning platform for local governance and budget accountability initiatives. It supports training and certification for youth across Uganda, with separate experiences for **trainees** and **staff**, and a clear path from registration to certificate issuance.

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
- [Documentation](#documentation)
- [License](#license)

---

## Overview

The platform is built as a **full-stack monorepo**:

- **Backend:** Java 21, Spring Boot 4, multi-module Maven (IAM + app). REST API, JPA, PostgreSQL, Flyway migrations.
- **Frontend:** React 18, Vite 6, React Router. Feature-based structure aligned with backend contexts (IAM, app shell).
- **Database:** PostgreSQL 16. Schema and seed data are managed by Flyway; JPA does not create or update schema.

Architecture follows **hexagonal (ports & adapters)** and **domain-driven** ideas: bounded contexts (IAM, and later learning, assessment, progress, etc.), clear application ports, and infrastructure adapters.

---

## Features

- **Identity & Access Management (IAM)** — Trainee and staff registration, login, profile, roles (SuperAdmin / Admin).
- **Learning management** — Courses, modules, content blocks, library resources (planned).
- **Assessment & certification** — Quizzes, attempts, certificates (planned).
- **Progress & analytics** — Enrollment, completion, dashboards (planned).
- **Public website & engagement** — Homepage content, live sessions (planned).

The first delivered slice is **IAM** (backend module + frontend feature shells). Other contexts are added incrementally.

---

## Technology Stack

| Layer      | Technologies |
|-----------|--------------|
| **Backend** | Java 21, Spring Boot 4, Spring Web, Spring Data JPA, Flyway, PostgreSQL 16 |
| **Frontend** | React 18, Vite 6, React Router 6 (JavaScript, `.jsx`) |
| **Database** | PostgreSQL 16 |
| **Build** | Maven 3.9+ (backend), npm (frontend) |
| **Runtime** | JRE 21 (backend), Node 18+ for frontend dev |

---

## Project Structure

```
slogbaa/
├── pom.xml                 # Root POM (aggregator), modules: iam, app
├── iam/                    # IAM backend module (library)
├── app/                    # Runnable Spring Boot application
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── features/       # iam, app (feature-based)
│       ├── api/            # Backend API client
│       ├── shared/         # Shared components, hooks, utils
│       └── layouts/
├── src/main/resources/    # Documentation, etc.
├── docker-compose.yml      # PostgreSQL + backend app
└── Dockerfile              # Backend container build
```

- **Backend:** Root is `pom`-only. `iam` is a library; `app` is the executable JAR (main class, config, Flyway scripts).
- **Frontend:** Single Vite app in `frontend/`, organized by feature (e.g. `features/iam`, `features/app`).

For detailed layout and conventions, see [Project structure (documentation)](#documentation).

---

## Prerequisites

- **Java 21** (backend)
- **Maven 3.9+** (backend)
- **Node.js 18+** and **npm** (frontend)
- **PostgreSQL 16** (or use Docker for the database)
- **Docker & Docker Compose** (optional, for running DB and/or backend in containers)

---

## Getting Started

### 1. Clone and build backend

```bash
git clone <repository-url>
cd slogbaa
mvn clean install -DskipTests
```

### 2. Database

**Option A — Local PostgreSQL**

Create a database and user, for example:

```sql
CREATE DATABASE slogbaa;
CREATE USER slogbaa WITH PASSWORD 'slogbaa';
GRANT ALL PRIVILEGES ON DATABASE slogbaa TO slogbaa;
```

**Option B — Docker (database only)**

```bash
docker compose up -d postgres
```

Default: host `localhost`, port `5432`, database/user/password `slogbaa` (see [Configuration](#configuration)).

### 3. Run the backend

```bash
mvn spring-boot:run -pl app
```

API base: **http://localhost:8080**. Flyway will run on first start (migrations + seed data if present).

### 4. Run the frontend (development)

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**. Vite proxies `/api` to `http://localhost:8080` (see `frontend/vite.config.js`).

### 5. Production build (frontend)

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/`. These files can be copied to `app/src/main/resources/static/` and served by Spring Boot if you want a single deployment.

---

## Configuration

Backend configuration is in `app/src/main/resources/application.properties`. Key settings:

| Property | Description | Default |
|----------|-------------|---------|
| `spring.datasource.url` | JDBC URL | `jdbc:postgresql://localhost:5432/slogbaa` |
| `spring.datasource.username` | DB user | `slogbaa` |
| `spring.datasource.password` | DB password | `slogbaa` |

Override via environment variables:

- `DATASOURCE_URL`
- `DATASOURCE_USERNAME`
- `DATASOURCE_PASSWORD`

Example (PowerShell):

```powershell
$env:DATASOURCE_PASSWORD="your-password"
mvn spring-boot:run -pl app
```

---

## Running Tests

**Backend**

```bash
mvn test
```

**Frontend**

```bash
cd frontend
npm run build   # or add a test script and run it
```

---

## Docker

**PostgreSQL + backend app** (from project root):

```bash
docker compose up -d --build
```

- **PostgreSQL:** port `5432`, database/user/password `slogbaa`.
- **Backend:** port `8080`; uses the `postgres` service as DB host.

If the repo is multi-module and the Dockerfile expects a single module, the build context or Dockerfile may need to be updated so the image builds the `app` module (e.g. build from root with `mvn package -pl app` and copy `app/target/app-*.jar`).

**Database only** (e.g. for local backend + frontend):

```bash
docker compose up -d postgres
```

Then run the backend and frontend locally as in [Getting Started](#getting-started).

---

## Documentation

| Document | Description |
|----------|-------------|
| [Project structure explained](src/main/resources/documentation/project-structure-explained.md) | Layout, modules, frontend, hexagonal layers, build/run commands. |
| [STRUCTURE.md](src/main/resources/documentation/STRUCTURE.md) | Full target file tree and Maven layout. |
| [Domain model design](src/main/resources/documentation/domain-model-design.md) | Bounded contexts, aggregates, use cases, events. |
| [Admin and content management](src/main/resources/documentation/admin-and-content-management.md) | SuperAdmin vs Admin, who manages homepage/learning content, admin dashboard approach. |
| [Development roadmap and user flows](src/main/resources/documentation/development-roadmap-and-user-flows.md) | What to build first (IAM → trainee flow → admin), and how trainees, staff, and visitors move through the platform. |
| [Frontend design notes](src/main/resources/documentation/frontend-design-notes.md) | Brand and colour reference ([slogbaa.org](https://slogbaa.org/)); palette and CSS variables. |

Start with **project-structure-explained.md** for a concise overview of the repo and how backend and frontend are organized.

---

## License

See the [LICENSE](LICENSE) file in this repository (if present).

---

**NAC SLOGBAA** — Training and content management for local governance and budget accountability.
