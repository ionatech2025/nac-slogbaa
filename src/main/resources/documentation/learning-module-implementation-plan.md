# Learning Module — Implementation Plan

**Purpose:** Step-by-step plan for implementing the Learning Management module, in small, testable chunks.

**References:**
- [development-roadmap-and-user-flows.md](development-roadmap-and-user-flows.md) — Learning is #2 after IAM; minimal scope: list published courses, view course, view module and content blocks.
- [domain-model-design.md](domain-model-design.md) — Learning Management Context: Course, Module, ContentBlock, LibraryResource.
- [project-structure-explained.md](project-structure-explained.md) — Hexagonal layers, Maven modules, package layout.
- [STRUCTURE.md](STRUCTURE.md) — Target file tree for learning module.
- [admin-and-content-management.md](admin-and-content-management.md) — SuperAdmin creates/edits learning content; Admin view-only.

**Current state:**
- Learning Maven module exists (`learning/`) but contains no Java source yet.
- Flyway migration `V2__create_learning_tables.sql` already defines `course`, `module`, `content_block`, `library_resource` tables.
- Frontend has admin route `/admin/learning` with placeholder page; trainee dashboard shows “My courses” placeholder.

---

## Phases Overview

| Phase | Scope | Depends on |
|-------|-------|------------|
| 1 | Backend skeleton & Course read-only | IAM (auth) |
| 2 | List published courses API | Phase 1 |
| 3 | Course details (with modules & blocks) API | Phase 2 |
| 4 | Frontend: trainee course browsing | Phase 3 |
| 5 | Enrollment (creates progress) | Phase 4, Progress module |
| 6 | Admin: create/edit/publish courses | Phase 3 |
| 7 | Library resources (read) | Phase 3 |

---

## Phase 1: Backend Skeleton & Course Read-Only

**Goal:** Learning module compiles, wires into app, and can return minimal course data.

### 1.1 Maven & package layout

- Ensure `learning` module is in root `pom.xml` and `app` depends on it.
- Create package: `com.nac.slogbaa.learning` with subpackages: `core`, `application`, `adapters`, `config`.
- Add `LearningConfiguration` (empty `@Configuration` for now).
- Add `learning` to app component scan and run a sanity build.

### 1.2 JPA entities (adapters/persistence/entity)

- `CourseEntity` — id, title, description, isPublished, createdBy, createdAt, updatedAt.
- `ModuleEntity` — id, courseId (FK), title, description, moduleOrder, hasQuiz, timestamps.
- `ContentBlockEntity` — id, moduleId (FK), blockType, blockOrder, polymorphic fields (richText, imageUrl, videoId, etc.), timestamps.
- `LibraryResourceEntity` — id, title, description, resourceType, fileUrl, uploadedBy, isPublished, timestamps.

Map to existing `V2__create_learning_tables.sql` schema.

### 1.3 Repositories

- `JpaCourseRepository` — `findByIsPublishedTrue()`, `findById(UUID)`.
- `JpaModuleRepository` — `findByCourseIdOrderByModuleOrder()`.
- `JpaContentBlockRepository` — `findByModuleIdOrderByBlockOrder()`.
- `JpaLibraryResourceRepository` — `findByIsPublishedTrue()` (for later).

---

## Phase 2: List Published Courses API

**Goal:** Trainees (authenticated) can GET a list of published courses.

### 2.1 Application layer

- **Port in:** `GetPublishedCoursesUseCase` — returns list of course summaries.
- **Port out:** `CourseRepositoryPort` — `findPublishedCourses()`, optional `findById()`.
- **Service:** `GetPublishedCoursesService` implementing `GetPublishedCoursesUseCase`.
- **DTOs:** `CourseSummary` (id, title, description, moduleCount or similar).

### 2.2 REST adapter

- `CourseController` — `GET /api/courses` (published only).
- Requires `TRAINEE` or `STAFF` role (or appropriate auth).
- Returns `List<CourseSummaryResponse>`.

### 2.3 Repository adapter

- `CourseRepositoryAdapter` implements `CourseRepositoryPort`.
- Uses `JpaCourseRepository` and `CourseEntityMapper` (domain ↔ entity).
- Domain types: `Course` (aggregate root), `CourseId` (value object).

### 2.4 Domain (minimal)

- `Course` aggregate (read model is acceptable for list: id, title, description, isPublished).
- `CourseId` value object.
- `CourseNotFoundException` for 404 cases.

---

## Phase 3: Course Details (with Modules & Content Blocks) API

**Goal:** Trainees can GET a single course with its modules and content blocks.

### 3.1 Application layer

- **Port in:** `GetCourseDetailsUseCase` — input: `CourseId` (or UUID); output: full course with ordered modules and content blocks.
- **Service:** `GetCourseDetailsService`.
- **DTOs:** `CourseDetails`, `ModuleSummary`, `ContentBlockSummary` (polymorphic by blockType).

### 3.2 REST adapter

- `GET /api/courses/{id}` — returns course details including modules and content blocks.
- 404 if not found or not published.

### 3.3 Domain & persistence

- Extend `Course` aggregate with `Module` entities and `ContentBlock` entities (or use read-model DTOs built from entities).
- `ModuleOrder`, `BlockType` value objects.
- Ensure modules and blocks are ordered consistently.

---

## Phase 4: Frontend — Trainee Course Browsing

**Goal:** Logged-in trainees see published courses and can open a course and its modules.

### 4.1 API client

- `frontend/src/api/learning/` — `getPublishedCourses()`, `getCourseDetails(id)`.
- Use existing `api/client.js` base.

### 4.2 Feature module

- `frontend/src/features/learning/` — pages, components, routes.
- **Pages:** `CourseListPage`, `CourseDetailPage`, `ModuleViewPage` (or combined course/module view).
- **Routes:** `/dashboard/courses`, `/dashboard/courses/:courseId`, `/dashboard/courses/:courseId/modules/:moduleId` (or similar).

### 4.3 Trainee dashboard integration

- Replace “My courses” placeholder with link to course list (or embedded list).
- Wire course list and course detail views to API.

### 4.4 Content block rendering

- Render `TEXT` (rich text), `IMAGE`, `VIDEO` (YouTube embed), `ACTIVITY` blocks.
- Use existing design tokens from `frontend-design-notes.md`.

---

## Phase 5: Enrollment (Bridge to Progress)

**Goal:** Trainees can enroll in a course; enrollment creates a progress record.

**Note:** Enrollment is shared between Learning and Progress. Options:

- **A)** Implement `EnrollTraineeInCourseUseCase` in Learning, which calls Progress port to create `TraineeProgress`.
- **B)** Implement enrollment in Progress module, which uses Learning port to validate course exists and is published.

Recommendation: Implement in Progress module (it owns `TraineeProgress`); Learning exposes read-only course APIs. Enrollment API can live under `/api/progress/enrollments` or `/api/courses/{id}/enroll`.

### 5.1 (If in Learning)

- **Port in:** `EnrollTraineeInCourseUseCase`.
- **Port out:** `ProgressRepositoryPort` (or similar) to create enrollment.
- **REST:** `POST /api/courses/{id}/enroll` — requires authenticated trainee.

### 5.2 (If in Progress)

- Progress module adds `EnrollTraineeUseCase` that depends on `CourseRepositoryPort` (from Learning) to verify course.
- Shared port in `shared-ports` or learning exposes a port for “course exists and published” check.

---

## Phase 6: Admin — Create/Edit/Publish Courses

**Goal:** SuperAdmin can create courses, add modules, add content blocks, and publish.

### 6.1 Application layer

- **Ports in:** `CreateCourseUseCase`, `AddModuleToCourseUseCase`, `AddContentBlockToModuleUseCase`, `PublishCourseUseCase`.
- **Port out:** `CourseRepositoryPort` with `save(Course)`, `findById()`.
- **Port out:** `StaffUserRepositoryPort` (or current user from security) for `createdBy`.

### 6.2 REST adapter

- `POST /api/admin/courses` — create course (SuperAdmin only).
- `PUT /api/admin/courses/{id}` — update course.
- `POST /api/admin/courses/{id}/modules` — add module.
- `POST /api/admin/courses/{id}/modules/{moduleId}/blocks` — add content block.
- `POST /api/admin/courses/{id}/publish` — publish course.

### Phase 6 Checklist (6.1, 6.2)

- [x] `CreateCourseUseCase`, `AddModuleToCourseUseCase`, `AddContentBlockToModuleUseCase`, `PublishCourseUseCase`, `UpdateCourseUseCase`.
- [x] `CourseWritePort` with `createCourse`, `updateCourse`, `addModule`, `addContentBlock`, `publish`.
- [x] Services and `CourseWriteAdapter`.
- [x] `POST /api/admin/courses` — create course (SuperAdmin only).
- [x] `PUT /api/admin/courses/{id}` — update course.
- [x] `POST /api/admin/courses/{id}/modules` — add module.
- [x] `POST /api/admin/courses/{id}/modules/{moduleId}/blocks` — add content block.
- [x] `POST /api/admin/courses/{id}/publish` — publish course.

### 6.3 Frontend admin

- Replace admin Learning placeholder with course management UI.
- List courses (all, not just published), create/edit forms, module/block editors.
- the content blocks should be added like blocks are added in Notion
- Role check: show only for SuperAdmin.

---

## Phase 7: Library Resources (Optional / Later)

**Goal:** Trainees can browse published library resources.

- `GetPublishedLibraryResourcesUseCase`, `GET /api/library/resources`.
- `LibraryResource` domain, repository, adapter.
- Frontend: simple list/download links.
- Admin upload (SuperAdmin) can be deferred.

---

## Implementation Order Summary

1. **Phase 1** — Skeleton, entities, repositories.
2. **Phase 2** — List published courses API.
3. **Phase 3** — Course details API.
4. **Phase 4** — Frontend trainee browsing.
5. **Phase 5** — Enrollment (coordinate with Progress).
6. **Phase 6** — Admin course management.
7. **Phase 7** — Library resources.

---

## Checklist: Phase 1 Deliverables

- [ ] `learning` module builds and is included in app.
- [ ] JPA entities for course, module, content_block, library_resource.
- [ ] Spring Data repositories.
- [ ] `CourseRepositoryPort` and `CourseRepositoryAdapter`.
- [ ] `LearningConfiguration` loads without error.

---

## Checklist: Phase 2 Deliverables

- [ ] `GetPublishedCoursesUseCase` and service.
- [ ] `GET /api/courses` returns published courses.
- [ ] Auth required (TRAINEE or STAFF).

---

## Checklist: Phase 3 Deliverables

- [ ] `GetCourseDetailsUseCase` and service.
- [ ] `GET /api/courses/{id}` returns course with modules and content blocks.
- [ ] 404 for non-existent or unpublished courses.

---

## Checklist: Phase 4 Deliverables

- [ ] `features/learning` with CourseListPage, CourseDetailPage.
- [ ] API client for courses.
- [ ] Routes under `/dashboard/courses`.
- [ ] Content blocks render (text, image, video, activity).

---

## Notes

- **Package:** Use `com.nac.slogbaa.learning` to match existing IAM/infrastructure packages.
- **Enrollment:** Decide in Phase 5 whether enrollment lives in Learning or Progress; document the decision.
- **Library:** Phase 7 is lower priority; can be skipped until core trainee journey is complete.
