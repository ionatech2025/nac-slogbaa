# Minimal Dashboards — Trainee, Admin, SuperAdmin

Minimal scope for what each dashboard should **contain** and **allow**. Use this to build the first version of each dashboard; expand later.

---

## 1. Trainee dashboard

**Entry:** `/dashboard` (after login as TRAINEE).

| Contains | Allows |
|----------|--------|
| **Welcome** — Greeting (e.g. “Hello, [name]”) | — |
| **My courses** — List of enrolled courses (empty at first) | **Enroll** on a course (when learning module exists); open a course to continue learning |
| **Profile** — Link or section to view/edit own profile (name, district, category, address) | View and edit own profile (IAM) |
| **Certificates** — List of earned certificates (empty until assessment is done) | View/download certificates (when assessment module exists) |
| **Sign out** | Log out |

**Minimal first slice:** Welcome + “My courses” (placeholder list or empty state) + Sign out. Add Enroll, course detail, profile, and certificates as those features are built.

---

## 2. Admin dashboard

**Entry:** `/admin` (after login as ADMIN). Same layout as SuperAdmin but **read-only** for content and people; **full** for reports.

| Contains | Allows |
|----------|--------|
| **Overview** — Summary stats (e.g. total trainees, courses, recent activity) | View only |
| **Content** — Homepage, courses, modules, library, quizzes | **View only** (no create/edit/delete) |
| **People** — Staff list, trainee list | **View, filter, search** trainees and staff; **no** create/edit/delete staff |
| **Reports & analytics** — Progress, completion, analytics snapshots | **Run and view** reports; export if implemented |
| **Sign out** | Log out |

**Minimal first slice:** Overview (placeholder or simple counts) + People (list trainees, read-only) + Sign out. Add Content and Reports sections when those APIs exist.

---

## 3. SuperAdmin dashboard

**Entry:** `/admin` (after login as SUPER_ADMIN). Same URL as Admin; content and actions **vary by role**.

| Contains | Allows |
|----------|--------|
| **Overview** — Same summary stats as Admin | View only |
| **Homepage / Website** — Banners, impact stories, news, etc. | **Create, edit, delete** homepage content |
| **Learning** — Courses, modules, content blocks, library | **Create, edit, delete, publish** courses and content |
| **Assessment** — Quizzes, questions, certificates | **Create, edit** quizzes; **revoke** certificates if needed |
| **People** — Staff and trainees | **Create, edit, delete** staff; view/filter/search trainees (and manage if policy allows) |
| **Reports & analytics** | Same as Admin: run and view reports |
| **Sign out** | Log out |

**Minimal first slice:** Overview + **People** (list staff and trainees; **create staff** — e.g. “Add staff” with email, role, initial password) + Sign out. Add Homepage, Learning, Assessment sections when those modules/APIs exist.

---

## 4. Summary

| Role        | Dashboard route | Minimal “must have” now | Expand later |
|-------------|-----------------|--------------------------|--------------|
| **Trainee** | `/dashboard`    | Welcome, My courses (placeholder), Sign out | Enroll, course detail, profile, certificates |
| **Admin**   | `/admin`        | Overview (placeholder), People (view/filter trainees), Sign out | Content (read-only), Reports |
| **SuperAdmin** | `/admin`     | Overview, People (list + **create staff**), Sign out | Homepage, Learning, Assessment, Reports |

**Routing:**  
- Trainee → `/dashboard` (trainee dashboard).  
- Admin and SuperAdmin → `/admin` (admin dashboard; show/hide or enable/disable sections and actions by role).

**Reference:** [Development roadmap and user flows](development-roadmap-and-user-flows.md), [Admin and content management](admin-and-content-management.md).
