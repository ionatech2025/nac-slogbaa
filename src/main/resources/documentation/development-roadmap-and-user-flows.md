# Development Roadmap and User Flows

This document guides the dev team on **what to build first** and **how users move through the platform**. Use it to prioritise work and to align backend, frontend, and QA.

---

## 1. What to Work On First

### 1.1 IAM (Identity & Access Management) — First

**Do IAM before anything else.** All other features depend on it:

- **Trainees** must register and log in to enroll and take courses.
- **Staff** must log in with a role (SuperAdmin / Admin) for the admin dashboard and content management.
- Every other API (learning, progress, assessment, website) needs to know **who** the user is and **what** they are allowed to do.

**Deliver:** Registration, login, JWT/session, role on the backend; login and register pages and auth state on the frontend. Then move on.

---

### 1.2 Recommended Order After IAM

Build one **complete trainee journey** first, then add admin and public site.

| Order | Area | What to deliver |
|-------|------|-----------------|
| **1** | **IAM** | Registration, login, roles, auth (backend + frontend). |
| **2** | **Learning** | Minimal: list published courses, view course, view module and content blocks. |
| **3** | **Progress** | Enrollment (“Enroll” on a course), “My courses”, resume point. |
| **4** | **Assessment** | Quizzes on modules, attempt, pass/fail, store attempt history. |
| **5** | **Certificates** | Issue certificate when course is completed with passing score; trainee can view/download. |
| **6** | **Website + Admin** | Public homepage content; admin dashboard (SuperAdmin: manage homepage, courses, users; Admin: view and reports). Can be built in parallel or after the trainee flow. |

**Rationale:** Delivering one end-to-end trainee path (register → learn → quiz → certificate) proves the core value and forces IAM, learning, progress, and assessment to integrate. The public homepage can stay simple at first; the full website module and admin dashboard can follow.

---

### 1.3 Alternative: Public Site + Admin First

If the product owner prefers to show the public site and content management first:

1. **IAM** (same as above).
2. **Website** — Public homepage so visitors see something and have “Register” / “Login”.
3. **Admin dashboard** — SuperAdmin can manage homepage and (later) courses.
4. Then implement the **trainee** flow (enrollment, learning, quizzes, certificates).

Use this only if the priority is “visible public site and admin” before “trainee can complete a course”.

---

## 2. User Flows

### 2.1 Trainee Flow

1. **Land** on the platform (public homepage or login page).
2. **Register** (IAM): email, password, profile (name, district, category, etc.).
3. **Log in** (IAM): email + password → session/JWT.
4. **Browse** published courses (Learning).
5. **Enroll** in a course (Learning + Progress): creates “my course” and progress record.
6. **Learn:** open course → see modules in order → open module → consume content blocks (text, video, etc.).
7. **Quiz:** when a module has a quiz, take it (Assessment); pass/fail and attempt history stored.
8. **Progress:** system records completion (module/course) and resume point; trainee can leave and return later.
9. **Complete course:** when all required modules (and their quizzes) are passed → course marked complete (Progress).
10. **Certificate:** system issues certificate (Assessment); trainee can view/download and see it in profile.
11. **Profile:** trainee can view and edit own profile (IAM) and see “my courses” and certificates.

---

### 2.2 Staff (SuperAdmin) Flow

1. **Log in** (IAM) with SuperAdmin role.
2. **Open admin dashboard** (e.g. `/admin`).
3. **Manage content:** homepage (banners, stories, news, etc.), courses/modules/content blocks, library, quizzes.
4. **Manage users:** staff (create/edit/delete), view/filter trainees.
5. **Reports:** view analytics, progress, certificates; revoke certificate if needed.

---

### 2.3 Staff (Admin) Flow

1. **Log in** (IAM) with Admin role.
2. **Open admin dashboard** (same entry point, reduced permissions).
3. **View only** content and users; **filter and search** trainees; **run reports** (progress, analytics). No create/edit/delete of content or staff.

---

### 2.4 Public Visitor (Not Logged In) Flow

1. **Land** on public homepage.
2. **Browse** public content (about the program, impact stories, news).
3. **Register** or **Log in** when they decide to become a trainee (or when given a staff account).

---

## 3. Quick Reference

| User type | First step | Main journey |
|-----------|------------|--------------|
| **Trainee** | Register / Log in | Browse → Enroll → Learn (modules, content) → Quiz → Complete course → Certificate |
| **SuperAdmin** | Log in | Admin dashboard → Manage content (homepage, courses, library, quizzes) and users → Reports |
| **Admin** | Log in | Admin dashboard → View content/users → Filter, search, reports (no edit) |
| **Public visitor** | Land on homepage | Browse → Register or Log in when ready |

---

## 4. Related Documentation

- [Project structure explained](project-structure-explained.md) — Repo layout, modules, frontend.
- [Domain model design](domain-model-design.md) — Bounded contexts, aggregates, business rules.
- [Admin and content management](admin-and-content-management.md) — SuperAdmin vs Admin, admin dashboard approach.
- [STRUCTURE.md](STRUCTURE.md) — Full target file tree and backend layout.

---

**Document purpose:** Guide the dev team on prioritisation (IAM first, then trainee flow, then website/admin) and on how each user type moves through the platform. Update this doc when priorities or flows change.
