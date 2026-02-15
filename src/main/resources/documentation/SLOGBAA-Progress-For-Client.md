# SLOGBAA Platform — What’s Ready So Far

**A short overview of what has been built and what you can test.**

---

## What is SLOGBAA?

SLOGBAA is NAC’s online learning platform for local governance and budget accountability. It will let **trainees** (e.g. youth across Uganda) register, take courses, complete quizzes, and earn certificates. **Staff** (Admins and SuperAdmins) will manage the platform, content, and people. We are building it step by step; this document describes what is ready today.

---

## What You Can Do Right Now

### For trainees (learners)

- **Create an account**  
  Anyone can sign up on the platform with email, password, and profile details (name, gender, district, region, category, address).

- **Log in**  
  After registering, trainees log in with their email and password.

- **Trainee dashboard**  
  Once logged in, a trainee sees:
  - A welcome message with their name  
  - **My courses** — a section where their enrolled courses will appear (for now it’s a placeholder; real courses come in the next phase)  
  - **Certificates** — a section where earned certificates will appear (placeholder for now)  
  - **Profile** — they can **view** their profile (name, email, personal details, location, address) and **edit** it (change name, district, region, address, etc.)  
  - **Sign out**

So today: trainees can **register, log in, use their dashboard, and view and update their own profile**. Course content and real certificates are not in the system yet.

---

### For staff (Admin and SuperAdmin)

Staff do **not** register themselves. A **SuperAdmin** creates staff accounts (email, role, and initial password). Those staff then log in with the credentials they are given.

- **Log in**  
  Staff log in with their email and password (same login page as trainees; the system sends them to the right place based on their role).

- **Admin dashboard**  
  After login, staff see an admin area with:
  - **Overview** — summary numbers (e.g. how many trainees, how many staff)  
  - **People** — lists of trainees and staff  

  What each role can do:
  - **SuperAdmin**  
    - See lists of all trainees and all staff  
    - **Create** new staff (add email, role, password)  
    - **Remove** staff  
    - **View** a trainee’s full profile (by opening a trainee from the list)  
  - **Admin**  
    - See the same Overview and People sections  
    - **View** trainees and staff (no creating or removing staff; no editing)  
    - **View** a trainee’s profile  

Staff can also **change their own password** from the admin area.

So today: staff can **log in, see the overview and people lists, and (for SuperAdmin) create and remove staff and view trainee profiles**. Content management (homepage, courses, quizzes) and reports will come later.

---

## Security and Roles

- The platform knows who is logged in and whether they are a **trainee**, an **Admin**, or a **SuperAdmin**.
- Trainees only see their own dashboard and profile. They cannot see other trainees or the admin area.
- Admins see the admin dashboard but cannot create or delete staff.
- SuperAdmins can manage staff and view trainee details as described above.

---

## What’s Next (Not Built Yet)

The next steps will add the real learning experience:

- **Courses and learning** — publish courses and modules; trainees browse and enrol.
- **Progress** — “My courses” will show real enrollments and where the trainee left off.
- **Quizzes** — quizzes on modules; the system will record attempts and pass/fail.
- **Certificates** — when a trainee completes a course (with a passing score), they receive a certificate and can view or download it.
- **Content and reports** — staff management of homepage and courses; reports and analytics.

We will prioritise these with you so the platform matches your goals.

---

## How You Can Test

When the platform is deployed (e.g. on a test link we send you), you will be able to:

1. **As a visitor** — open the link, then register as a trainee or go to the login page.
2. **As a trainee** — log in, open your profile from the dashboard, and try editing your details (name, district, address, etc.).
3. **As staff** — we will create at least one SuperAdmin account for you; with that account you can log in, see the overview and people lists, create an Admin or another SuperAdmin, and open a trainee’s profile to see their details.

If you have any questions or want to adjust what we do next, we can discuss in our meeting.

---

*Document prepared for the client. Last updated to reflect: trainee and staff login and roles, trainee profile view and edit, admin overview and people (trainees and staff), SuperAdmin staff creation and removal, and deployment readiness.*
