# Admin Roles, Content Management, and Dashboard Approach

This document clarifies **who is responsible for what** in the SLOGBAA platform (from the domain model and STRUCTURE.md) and recommends **how to expose it in the UI** via an admin dashboard.

---

## 1. What the Documentation Says

### Roles (domain-model-design.md)

| Role | Capabilities |
|------|--------------|
| **SuperAdmin** | Create, edit, delete **content** and **manage users**. Full system access. |
| **Admin** | **Read-only** access with **filtering and reporting**. No content creation or editing. |

So **content** (homepage, courses, modules, library, etc.) is created and updated by **staff**; the domain rules restrict write operations to **SuperAdmin**. Admins can view and run reports only.

### Where “content” and “staff” appear

Across the domain model and STRUCTURE.md:

- **Website module:** Homepage content (banners, impact stories, news, videos, partner logos, social links). Aggregate has `LastUpdatedBy (StaffUserId)`.
- **Learning module:** Courses (`CreatedBy`), modules, content blocks, library resources (`UploadedBy`). All created/updated by staff.
- **Assessment module:** Quizzes, questions, certificates (e.g. revoke: “SuperAdmin only”).
- **Progress module:** Analytics snapshots, dashboard stats — consumed by both roles; generation/export may be SuperAdmin or both depending on policy.
- **IAM:** Staff user management (create/edit/delete staff) is SuperAdmin-only; trainee filtering and search are available to both.

So **yes**: the design implies that the **Super Admin is responsible for**

- Homepage content (website module),
- Learning content (courses, modules, content blocks, library),
- Assessment setup (quizzes, certificates),
- Staff (and possibly trainee) management,
- And any other content or configuration that is “create, edit, delete.”

The **Admin** is responsible for **viewing** the same areas and using **filtering, searching, and reporting** (e.g. trainee lists, analytics dashboard, progress reports).

---

## 2. Is It “All in the Admin Dashboard”?

**STRUCTURE.md** does **not** define a single “admin dashboard” as one backend artifact. It defines:

- **Per-context REST controllers** (e.g. `HomepageController`, `CourseController`, `LibraryController`, `DashboardController`, `AnalyticsController`, `StaffController`).
- **Use cases** that back those APIs (e.g. `UpdateHomepageContentUseCase`, `CreateCourseUseCase`, `GetAdminDashboardStatsUseCase`).

So the **backend** is split by **bounded context** (website, learning, assessment, progress, IAM). There is no single “AdminDashboardController” that does everything; instead, there are many endpoints that together support “admin” and “super admin” workflows.

The **frontend** can still present **one coherent place** for staff: an **admin dashboard** (or “admin area”) that aggregates these capabilities. So:

- **Backend:** Multiple modules and controllers (as in STRUCTURE.md).
- **Frontend:** One **admin dashboard** (or area) that groups:
  - Homepage / public website content
  - Learning (courses, modules, content, library)
  - Assessment (quizzes, certificates)
  - Progress & analytics (reports, stats)
  - IAM (staff, trainees)

So **yes** — all of the above can (and should) be **included in the admin dashboard** from the user’s point of view, even though the backend stays modular.

---

## 3. Recommended Approach

### One admin area in the frontend

- **Single entry:** e.g. `/admin` (or `/dashboard`) after staff login.
- **Role-based visibility:**
  - **SuperAdmin:** Full access to all sections; create/edit/delete for content and users; access to analytics and reports.
  - **Admin:** Same sections, but **read-only** for content and user management; full access to **filtering, search, and reporting** (trainees, progress, analytics).
- **Sections** aligned with backend contexts (and STRUCTURE.md):

| Section | Purpose | SuperAdmin | Admin |
|--------|---------|------------|--------|
| **Homepage / Website** | Banners, impact stories, news, videos, partner logos, social links | Create, edit, delete | View only |
| **Learning** | Courses, modules, content blocks, library resources | Create, edit, delete, publish | View only |
| **Assessment** | Quizzes, questions, certificates (e.g. revoke) | Create, edit, revoke | View only |
| **Progress & Analytics** | Dashboards, reports, demographic breakdown, snapshots | Full access | Full access (read/report) |
| **People** | Staff users, trainees | Create/edit/delete staff; manage trainees | View, filter, search (no delete) |

Backend already exposes the right use cases and controllers; the frontend calls the appropriate APIs per section and shows/hides or enables/disables actions based on role (e.g. from JWT or user profile).

### Backend: keep modules and APIs as-is

- Do **not** merge website, learning, assessment, progress, IAM into one “admin” module. Keep **bounded contexts** and their **ports/adapters** (as in STRUCTURE.md).
- Enforce **SuperAdmin vs Admin** in the **application layer** (e.g. in use case implementations or in a small authorization layer that checks `StaffRole`). Controllers can remain per context; authorization decides whether the current user can perform the action.
- **IAM** already has (or will have) `StaffCanManageContentSpecification`; use it (or equivalent checks) so that only SuperAdmin can perform content mutations; Admin can only read and run reporting use cases.

### Frontend: one app, one admin area, feature-based

- Keep the existing **feature-based** frontend layout (e.g. `features/iam`, `features/app`). Add an **admin** feature (e.g. `features/admin` or `features/dashboard`) that:
  - Renders the **admin layout** (sidebar or tabs for the sections above).
  - Contains **sub-routes** or **sub-features** for: website, learning, assessment, progress, people (or reuse existing features under the admin layout with role checks).
- Reuse **api/** clients (website, learning, assessment, progress, IAM) from this admin area; no need for a single “admin API” on the backend.

### Summary

| Question | Answer |
|----------|--------|
| Does the design show Super Admin is responsible for homepage and learning content (and more)? | **Yes.** Domain model: SuperAdmin can create, edit, delete content and manage users; aggregates (Course, HomepageContent, LibraryResource, etc.) reference StaffUserId for creation/update. |
| Will all of that be in the admin dashboard? | **Yes, from the UI perspective.** One admin dashboard (or area) in the frontend can group homepage, learning, assessment, progress, and people. Backend stays as multiple modules/controllers. |
| How to approach it? | **One admin area** in the frontend with **role-based visibility** (SuperAdmin = full; Admin = read + reporting). **Sections** per context (website, learning, assessment, progress, people). **Backend** unchanged: per-context modules and APIs; enforce SuperAdmin vs Admin in application/authorization layer. |

This keeps the architecture in STRUCTURE.md and domain-model-design.md intact while giving staff a single, clear place to work (the admin dashboard) and a clear split between SuperAdmin and Admin duties.
