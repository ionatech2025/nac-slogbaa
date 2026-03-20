# SLOGBAA — Database Schema Reference

Complete schema documentation for the Neon PostgreSQL database. Updated March 2026.

---

## Database Infrastructure

| Property | Value |
|----------|-------|
| **Engine** | PostgreSQL 17.8 (Neon Serverless) |
| **Host** | Neon `aws-ap-southeast-1` (Singapore) |
| **Project** | AgriTradeHub (`wispy-term-57694063`) |
| **Database** | `slogbaa` on `main` branch |
| **SSL** | Required (`sslmode=require`) |
| **Schema management** | Flyway (13 versioned migrations, 734 lines SQL) |
| **ORM** | Spring Data JPA / Hibernate (`ddl-auto=none`) |
| **Caching** | In-memory `ConcurrentMapCacheManager` (4 cache zones) |

### Connection

```bash
# Dev (env vars override local defaults)
DATASOURCE_URL=jdbc:postgresql://<neon-host>/slogbaa?sslmode=require
DATASOURCE_USERNAME=<set-in-env>
DATASOURCE_PASSWORD=<set-in-env>
```

---

## Entity Relationship Diagram

```
┌─────────────────┐      ┌─────────────────┐
│   staff_user    │──┐   │     trainee     │──────────────────────────────┐
│   (IAM)         │  │   │     (IAM)       │                              │
└────────┬────────┘  │   └───────┬─────────┘                              │
         │           │           │                                         │
         │  created_by│           │ trainee_id                              │
         │           │           │                                         │
┌────────▼────────┐  │   ┌──────▼──────────┐    ┌───────────────────┐     │
│     course      │◄─┘   │trainee_progress │───▶│ module_progress   │     │
│   (Learning)    │       │   (Progress)    │    │   (Progress)      │     │
└────────┬────────┘       └────────┬────────┘    └───────────────────┘     │
         │                         │                                       │
         │ course_id               │ trainee_progress_id                   │
         │                         │                                       │
┌────────▼────────┐       ┌────────▼────────┐    ┌───────────────────┐     │
│     module      │       │completion_record│    │   certificate     │◄────┘
│   (Learning)    │       │   (Progress)    │    │   (Assessment)    │
└────────┬────────┘       └─────────────────┘    └───────────────────┘
         │
         │ module_id
         │
┌────────▼────────┐
│  content_block  │       ┌─────────────────┐    ┌───────────────────┐
│   (Learning)    │       │      quiz       │───▶│    question       │
└─────────────────┘       │  (Assessment)   │    │   (Assessment)    │
                          └────────┬────────┘    └────────┬──────────┘
                                   │                      │
                          ┌────────▼────────┐    ┌────────▼──────────┐
                          │trainee_assessment│   │   quiz_option     │
                          │  (Assessment)   │    │   (Assessment)    │
                          └────────┬────────┘    └───────────────────┘
                                   │
                          ┌────────▼────────┐    ┌───────────────────┐
                          │  quiz_attempt   │───▶│   quiz_answer     │
                          │  (Assessment)   │    │   (Assessment)    │
                          └─────────────────┘    └───────────────────┘
```

---

## Tables by Domain

### 1. IAM (Identity & Access Management)

#### `staff_user`
Admin and super admin accounts.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `full_name` | VARCHAR(255) | NOT NULL |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE |
| `password_hash` | VARCHAR(255) | NOT NULL (BCrypt strength 13) |
| `staff_role` | VARCHAR(50) | NOT NULL, CHECK (`SUPER_ADMIN`, `ADMIN`) |
| `is_active` | BOOLEAN | NOT NULL, default `true` |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` |
| `last_login_at` | TIMESTAMPTZ | nullable |

**Indexes:** `email` (unique), `is_active` (partial, WHERE true)

#### `trainee`
Trainee learner accounts.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `first_name` | VARCHAR(100) | NOT NULL |
| `last_name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE |
| `password_hash` | VARCHAR(255) | NOT NULL |
| `gender` | VARCHAR(20) | NOT NULL, CHECK (`MALE`, `FEMALE`) |
| `district_name` | VARCHAR(100) | NOT NULL |
| `region` | VARCHAR(100) | nullable |
| `trainee_category` | VARCHAR(50) | NOT NULL, CHECK (`LEADER`, `CIVIL_SOCIETY_MEMBER`, `COMMUNITY_MEMBER`) |
| `street` | VARCHAR(255) | nullable |
| `city` | VARCHAR(100) | nullable |
| `postal_code` | VARCHAR(20) | nullable |
| `phone_country_code` | VARCHAR(10) | nullable (V9) |
| `phone_national_number` | VARCHAR(20) | nullable (V9) |
| `is_active` | BOOLEAN | NOT NULL, default `true` |
| `email_verified` | BOOLEAN | NOT NULL, default `false` |
| `registration_date` | TIMESTAMPTZ | NOT NULL |
| `last_login_at` | TIMESTAMPTZ | nullable |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

**Indexes:** `email`, `is_active` (partial), `trainee_category`, `district_name`, `registration_date`

#### `password_reset_tokens` (V10)

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `token` | VARCHAR(255) | NOT NULL, UNIQUE |
| `user_email` | VARCHAR(255) | NOT NULL |
| `expiry_date` | TIMESTAMPTZ | NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL |

**Indexes:** `token`, `user_email`, `expiry_date`

#### `trainee_settings` (V13)

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `trainee_id` | UUID | NOT NULL, FK → `trainee(id)`, UNIQUE |
| `certificate_email_opt_in` | BOOLEAN | NOT NULL, default `false` |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

---

### 2. Learning Management

#### `course`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `title` | VARCHAR(500) | NOT NULL |
| `description` | TEXT | nullable |
| `image_url` | VARCHAR(2048) | nullable (V12) |
| `is_published` | BOOLEAN | NOT NULL, default `false` |
| `created_by` | UUID | NOT NULL, FK → `staff_user(id)` |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

**Indexes:** `is_published` (partial), `created_by`

#### `module`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `course_id` | UUID | NOT NULL, FK → `course(id)` CASCADE |
| `title` | VARCHAR(500) | NOT NULL |
| `description` | TEXT | nullable |
| `image_url` | VARCHAR(2048) | nullable (V12) |
| `module_order` | INT | NOT NULL, UNIQUE per course |
| `has_quiz` | BOOLEAN | NOT NULL, default `false` |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

#### `content_block`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `module_id` | UUID | NOT NULL, FK → `module(id)` CASCADE |
| `block_type` | VARCHAR(30) | NOT NULL, CHECK (`TEXT`, `IMAGE`, `VIDEO`, `ACTIVITY`) |
| `block_order` | INT | NOT NULL |
| `rich_text` | TEXT | nullable |
| `image_url` | VARCHAR(2048) | nullable |
| `image_alt_text` | VARCHAR(255) | nullable |
| `image_caption` | VARCHAR(500) | nullable |
| `video_url` | VARCHAR(2048) | nullable |
| `video_id` | VARCHAR(50) | nullable |
| `activity_instructions` | TEXT | nullable |
| `activity_resources` | TEXT | nullable |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

#### `library_resource`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `title` | VARCHAR(500) | NOT NULL |
| `description` | TEXT | nullable |
| `resource_type` | VARCHAR(50) | CHECK (`DOCUMENT`, `POLICY_DOCUMENT`, `READING_MATERIAL`) |
| `file_url` | VARCHAR(2048) | NOT NULL |
| `file_size` | BIGINT | nullable |
| `file_type` | VARCHAR(50) | nullable |
| `uploaded_by` | UUID | FK → `staff_user(id)` |
| `is_published` | BOOLEAN | NOT NULL, default `false` |
| `uploaded_at` | TIMESTAMPTZ | NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

---

### 3. Assessment & Certification

#### `quiz`
One quiz per module (1:1).

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `module_id` | UUID | NOT NULL, FK → `module(id)` CASCADE, UNIQUE |
| `title` | VARCHAR(500) | NOT NULL |
| `pass_threshold_percent` | INT | NOT NULL, default 70, CHECK 0-100 |
| `max_attempts` | INT | nullable (unlimited if null) |
| `time_limit_minutes` | INT | nullable (no limit if null) |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

#### `question`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `quiz_id` | UUID | NOT NULL, FK → `quiz(id)` CASCADE |
| `question_text` | TEXT | NOT NULL |
| `question_type` | VARCHAR(30) | CHECK (`MULTIPLE_CHOICE`, `TRUE_FALSE`, `SHORT_ANSWER`, `ESSAY`) |
| `points` | INT | NOT NULL, default 1 |
| `question_order` | INT | NOT NULL |

#### `quiz_option`
Answer options for MC/TF questions.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `question_id` | UUID | NOT NULL, FK → `question(id)` CASCADE |
| `option_text` | TEXT | NOT NULL |
| `is_correct` | BOOLEAN | NOT NULL, default `false` |
| `option_order` | INT | NOT NULL |

#### `trainee_assessment`
Links a trainee to a quiz (one record per trainee-quiz pair).

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `trainee_id` | UUID | FK → `trainee(id)` CASCADE |
| `quiz_id` | UUID | FK → `quiz(id)` CASCADE |
| `module_id` | UUID | FK → `module(id)` |
| UNIQUE | | `(trainee_id, quiz_id)` |

#### `quiz_attempt`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `trainee_assessment_id` | UUID | FK → `trainee_assessment(id)` CASCADE |
| `attempt_number` | INT | NOT NULL |
| `points_earned` | INT | NOT NULL, default 0 |
| `total_points` | INT | NOT NULL, default 0 |
| `is_passed` | BOOLEAN | NOT NULL, default `false` |
| `started_at` | TIMESTAMPTZ | NOT NULL |
| `completed_at` | TIMESTAMPTZ | nullable |

#### `quiz_answer`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `quiz_attempt_id` | UUID | FK → `quiz_attempt(id)` CASCADE |
| `question_id` | UUID | FK → `question(id)` |
| `selected_option_id` | UUID | FK → `quiz_option(id)`, nullable |
| `text_answer` | TEXT | nullable |
| `is_correct` | BOOLEAN | NOT NULL, default `false` |
| `points_awarded` | INT | NOT NULL, default 0 |

#### `certificate`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `trainee_id` | UUID | FK → `trainee(id)` CASCADE |
| `course_id` | UUID | FK → `course(id)` CASCADE |
| `certificate_number` | VARCHAR(50) | NOT NULL, UNIQUE |
| `issued_date` | DATE | NOT NULL |
| `final_score_percent` | INT | NOT NULL, CHECK 0-100 |
| `verification_code` | VARCHAR(255) | NOT NULL, UNIQUE |
| `file_url` | VARCHAR(2048) | nullable |
| `email_sent_at` | TIMESTAMPTZ | nullable |
| `is_revoked` | BOOLEAN | NOT NULL, default `false` |
| UNIQUE | | `(trainee_id, course_id)` |

---

### 4. Progress & Analytics

#### `trainee_progress`
Enrollment and course-level progress.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `trainee_id` | UUID | FK → `trainee(id)` CASCADE |
| `course_id` | UUID | FK → `course(id)` CASCADE |
| `enrollment_date` | DATE | NOT NULL, default `current_date` |
| `status` | VARCHAR(30) | CHECK (`IN_PROGRESS`, `COMPLETED`, `FAILED`) |
| `completion_percentage` | INT | NOT NULL, default 0, CHECK 0-100 |
| `last_module_id` | UUID | FK → `module(id)`, nullable |
| `last_content_block_id` | UUID | FK → `content_block(id)`, nullable |
| `last_accessed_at` | TIMESTAMPTZ | nullable |
| UNIQUE | | `(trainee_id, course_id)` |

#### `module_progress`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `trainee_progress_id` | UUID | FK → `trainee_progress(id)` CASCADE |
| `module_id` | UUID | FK → `module(id)` CASCADE |
| `status` | VARCHAR(30) | CHECK (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`) |
| `quiz_status` | VARCHAR(30) | default `NOT_ATTEMPTED`, CHECK (`NOT_ATTEMPTED`, `ATTEMPTED`, `PASSED`) |
| `started_at` | TIMESTAMPTZ | nullable |
| `completed_at` | TIMESTAMPTZ | nullable |
| UNIQUE | | `(trainee_progress_id, module_id)` |

#### `completion_record`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `trainee_progress_id` | UUID | FK → `trainee_progress(id)` CASCADE |
| `record_type` | VARCHAR(30) | CHECK (`MODULE`, `QUIZ`, `CONTENT_BLOCK`) |
| `reference_id` | UUID | NOT NULL |
| `completed_at` | TIMESTAMPTZ | NOT NULL |
| `time_spent_minutes` | INT | nullable |

#### `analytics_snapshot` (CQRS read model)

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `snapshot_date` | DATE | NOT NULL |
| `total_visitors` | INT | default 0 |
| `total_registered_trainees` | INT | default 0 |
| `trainees_in_progress` | INT | default 0 |
| `graduated_trainees` | INT | default 0 |
| `failed_trainees` | INT | default 0 |
| `target_progress` | INT | default 0 |

#### `demographic_stat`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `analytics_snapshot_id` | UUID | FK → `analytics_snapshot(id)` CASCADE |
| `dimension` | VARCHAR(30) | CHECK (`GENDER`, `DISTRICT`, `CATEGORY`) |
| `breakdown_values` | JSONB | NOT NULL, default `{}` |

---

### 5. Website (Public CMS)

#### `homepage_content` (singleton)

| Column | Type |
|--------|------|
| `id` | UUID PK |
| `whatsapp_url` | VARCHAR(2048) |
| `facebook_url` | VARCHAR(2048) |
| `twitter_url` | VARCHAR(2048) |
| `last_updated_by` | UUID FK → `staff_user(id)` |
| `last_updated_at` | TIMESTAMPTZ |

**Child tables:** `banner_image`, `impact_story`, `news_update`, `video_content`, `partner_logo` — all linked via `homepage_content_id` FK.

---

### 6. Engagement

#### `live_session`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `title` | VARCHAR(500) | NOT NULL |
| `course_id` | UUID | FK → `course(id)` SET NULL |
| `module_id` | UUID | FK → `module(id)` SET NULL |
| `scheduled_date_time` | TIMESTAMPTZ | NOT NULL |
| `duration_minutes` | INT | NOT NULL |
| `platform` | VARCHAR(30) | CHECK (`ZOOM`, `GOOGLE_MEET`) |
| `meeting_url` | VARCHAR(2048) | nullable |
| `status` | VARCHAR(30) | default `SCHEDULED`, CHECK (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) |
| `created_by` | UUID | FK → `staff_user(id)` |

#### `session_attendee`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `live_session_id` | UUID | FK → `live_session(id)` CASCADE |
| `trainee_id` | UUID | FK → `trainee(id)` CASCADE |
| `registered_at` | TIMESTAMPTZ | NOT NULL |
| `joined_at` | TIMESTAMPTZ | nullable |
| `left_at` | TIMESTAMPTZ | nullable |
| UNIQUE | | `(live_session_id, trainee_id)` |

---

## Flyway Migration History

| Version | Description | Key Changes |
|---------|-------------|-------------|
| V1 | Create IAM tables | `staff_user`, `trainee` |
| V2 | Create learning tables | `course`, `module`, `content_block`, `library_resource` |
| V3 | Create assessment tables | `quiz`, `question`, `quiz_option`, `trainee_assessment`, `quiz_attempt`, `quiz_answer`, `certificate` |
| V4 | Create progress/analytics | `trainee_progress`, `completion_record`, `module_progress`, `analytics_snapshot`, `demographic_stat` |
| V5 | Create website tables | `homepage_content`, `banner_image`, `impact_story`, `news_update`, `video_content`, `partner_logo` |
| V6 | Create engagement tables | `live_session`, `session_attendee` |
| V7 | Seed sample data | Staff users, trainees, courses, modules, content |
| V8 | Update seed passwords | BCrypt hashes for test accounts |
| V9 | Add trainee phone | `phone_country_code`, `phone_national_number` columns |
| V10 | Password reset tokens | `password_reset_tokens` table |
| V11 | Seed more courses | Additional course/module data |
| V12 | Course/module images | `image_url` column on `course` and `module` |
| V13 | Trainee settings | `trainee_settings` table (certificate email opt-in) |

---

## Table Count Summary

| Domain | Tables | Purpose |
|--------|--------|---------|
| **IAM** | 4 | `staff_user`, `trainee`, `password_reset_tokens`, `trainee_settings` |
| **Learning** | 4 | `course`, `module`, `content_block`, `library_resource` |
| **Assessment** | 7 | `quiz`, `question`, `quiz_option`, `trainee_assessment`, `quiz_attempt`, `quiz_answer`, `certificate` |
| **Progress** | 4 | `trainee_progress`, `module_progress`, `completion_record`, `analytics_snapshot` + `demographic_stat` |
| **Website** | 6 | `homepage_content`, `banner_image`, `impact_story`, `news_update`, `video_content`, `partner_logo` |
| **Engagement** | 2 | `live_session`, `session_attendee` |
| **System** | 1 | `flyway_schema_history` |
| **Total** | **28** | |
