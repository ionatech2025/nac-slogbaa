# NAC-SLOGBAA Online Learning Platform
## Domain Model Design Documentation

**Project:** NAC-SLOGBAA Online Learning Platform  
**Document Version:** 1.0  
**Date:** February 9, 2026  
**Architecture Pattern:** Domain-Driven Design (DDD) with Hexagonal Architecture

---

## Table of Contents

1. [Introduction](#introduction)
2. [Bounded Contexts Overview](#bounded-contexts-overview)
3. [Domain Model Details](#domain-model-details)
   - [Identity & Access Management Context](#1-identity--access-management-iam-context)
   - [Learning Management Context](#2-learning-management-context)
   - [Assessment & Certification Context](#3-assessment--certification-context)
   - [Progress & Analytics Context](#4-progress--analytics-context)
   - [Public Website Context](#5-public-website-context)
   - [Engagement & Communication Context](#6-engagement--communication-context)
4. [Domain Events](#domain-events)
5. [Application Layer Ports](#application-layer-ports)
6. [Next Steps](#next-steps)

---

## Introduction

This document defines the domain model for the NAC-SLOGBAA Online Learning Platform, a training and content management system designed to educate 30,000 youth across Uganda. The design follows Domain-Driven Design (DDD) principles with clear bounded contexts, aggregates, entities, and value objects.

### Design Principles

- **Domain-Driven Design (DDD):** Business logic encapsulated in rich domain models
- **Hexagonal Architecture:** Clean separation between domain, application, and infrastructure
- **CQRS Pattern:** Separate read and write models for analytics
- **Event-Driven:** Domain events for cross-context communication

---

## Bounded Contexts Overview

The system is divided into six bounded contexts:

1. **Identity & Access Management (IAM)** - User authentication and authorization
2. **Learning Management** - Course content and structure
3. **Assessment & Certification** - Quizzes, evaluations, and certificates
4. **Progress & Analytics** - Learning tracking and reporting
5. **Public Website** - Public-facing content management
6. **Engagement & Communication** - Live sessions and notifications

---

## Domain Model Details

### 1. Identity & Access Management (IAM) Context

This context manages the security, authentication, and categorization of all system participants.

#### Aggregate Root: Trainee

```
Trainee (Aggregate Root)
├── TraineeId (Identity)
├── Profile (Entity)
│   ├── FullName (Value Object: { FirstName, LastName })
│   ├── ContactInfo (Value Object)
│   │   ├── Email (validated)
│   │   └── PhysicalAddress (Value Object: { Street, City, PostalCode })
│   ├── Gender (Value Object: Enum - Male, Female)
│   ├── District (Value Object)
│   │   ├── DistrictName
│   │   └── Region
│   └── TraineeCategory (Value Object: Enum)
│       ├── Leader
│       ├── CivilSocietyMember
│       └── CommunityMember
├── PasswordHash
├── IsActive
├── RegistrationDate
├── LastLoginAt
└── EmailVerified
```

**Business Rules:**
- Email must be unique across all trainees
- All fields in Profile are required for registration
- TraineeCategory determines filtering and reporting capabilities
- Email verification required before course enrollment

**Value Objects:**
- `FullName`: Combines FirstName and LastName with validation rules
- `ContactInfo`: Encapsulates email and physical address as a cohesive unit
- `Gender`: Enumeration with domain-specific validation
- `District`: Contains district name and region for geographic reporting
- `TraineeCategory`: Defines the trainee's role in the community

#### Aggregate Root: StaffUser

```
StaffUser (Aggregate Root)
├── StaffUserId (Identity)
├── FullName (Value Object)
├── Email (Value Object)
├── PasswordHash
├── StaffRole (Value Object: Enum)
│   ├── SuperAdmin (full system access)
│   └── Admin (view-only, filtering, and searching)
├── IsActive
├── CreatedAt
└── LastLoginAt
```

**Business Rules:**
- SuperAdmin can create, edit, delete content and manage users
- Admin has read-only access with filtering and reporting capabilities
- Email must be unique across all staff users
- Cannot delete own account (must be done by another SuperAdmin)

**Value Objects:**
- `StaffRole`: Encapsulates permission logic and access control rules

---

### 2. Learning Management Context

This context delivers the core educational content and manages the learning structure.

#### Aggregate Root: Course

```
Course (Aggregate Root)
├── CourseId (Identity)
├── Title
├── Description
├── IsPublished
├── CreatedBy (StaffUserId)
├── CreatedAt
├── UpdatedAt
│
└── Modules (Collection of Module Entities - ordered)
    └── Module (Entity)
        ├── ModuleId (Identity)
        ├── Title
        ├── Description
        ├── ModuleOrder (Value Object: ensures sequence)
        │   ├── Position (1, 2, 3...)
        │   └── IsFirst/IsLast (computed)
        │
        ├── ContentBlocks (Collection - ordered)
        │   └── ContentBlock (Entity)
        │       ├── BlockId (Identity)
        │       ├── BlockType (Value Object: Enum)
        │       │   ├── Text
        │       │   ├── Image
        │       │   ├── Video
        │       │   └── Activity
        │       ├── Content (polymorphic)
        │       │   ├── TextContent: { RichText }
        │       │   ├── ImageContent: { Url, AltText, Caption }
        │       │   ├── VideoContent: { YouTubeLink (Value Object) }
        │       │   └── ActivityContent: { Instructions, Resources }
        │       └── Order (within module)
        │
        └── HasQuiz (boolean - links to Quiz aggregate)
```

**Business Rules:**
- Courses cannot be deleted if trainees are enrolled
- Modules must maintain sequential order (no gaps)
- Content blocks are processed in order
- Unpublished courses are invisible to trainees
- Module cannot be deleted if associated quiz has attempts

**Value Objects:**
- `ModuleOrder`: Encapsulates ordering logic, prevents gaps in sequence
- `YouTubeLink`: Validates YouTube URLs and extracts video IDs
  - Patterns: `youtube.com/watch?v=VIDEO_ID` or `youtu.be/VIDEO_ID`
  - Extracts and stores video ID for embedding

**Entities:**
- `Module`: A structured learning unit within a course
- `ContentBlock`: Dynamic content element (text, image, video, or activity)

#### Aggregate Root: LibraryResource

```
LibraryResource (Aggregate Root)
├── ResourceId (Identity)
├── Title
├── Description
├── ResourceType (Value Object: Enum)
│   ├── Document
│   ├── PolicyDocument
│   └── ReadingMaterial
├── FileUrl (Value Object: validated URL)
├── FileSize
├── FileType (PDF, DOCX, etc.)
├── UploadedBy (StaffUserId)
├── UploadedAt
└── IsPublished
```

**Business Rules:**
- File size limits enforced (e.g., max 10MB)
- Supported file types: PDF, DOCX, XLSX
- Unpublished resources invisible to trainees
- Resources can be tagged for searchability

**Value Objects:**
- `ResourceType`: Categorizes documents for filtering
- `FileUrl`: Validated URL with storage location logic

---

### 3. Assessment & Certification Context

This context handles evaluation, testing, and the awarding of certificates.

#### Aggregate Root: Quiz

```
Quiz (Aggregate Root)
├── QuizId (Identity)
├── ModuleId (Foreign Reference)
├── Title
├── PassThreshold (Value Object: Percentage)
│   ├── Value (70% or 80%)
│   └── IsConfigurable
├── MaxAttempts (optional - null means unlimited)
├── TimeLimit (optional - minutes)
│
└── Questions (Collection of Question Entities)
    └── Question (Entity)
        ├── QuestionId (Identity)
        ├── QuestionText
        ├── QuestionType (Value Object: Enum)
        │   ├── MultipleChoice
        │   ├── TrueFalse
        │   ├── ShortAnswer
        │   └── Essay (optional)
        ├── Points
        ├── Order
        │
        └── Options (Collection of Option Entities - for MC questions)
            └── Option (Entity)
                ├── OptionId (Identity)
                ├── OptionText
                ├── IsCorrect
                └── Order
```

**Business Rules:**
- Quiz cannot be taken before module completion
- PassThreshold is configurable per quiz (default: 70%)
- Retakes are allowed unless MaxAttempts is set
- Questions are weighted by Points for scoring
- At least one correct option required for multiple choice questions

**Value Objects:**
- `PassThreshold`: Configurable percentage with validation (0-100%)
- `QuestionType`: Defines answer format and scoring logic

**Entities:**
- `Question`: Individual assessment item within a quiz
- `Option`: Possible answer for multiple choice questions

#### Aggregate Root: TraineeAssessment

```
TraineeAssessment (Aggregate Root)
├── AssessmentId (Identity)
├── TraineeId (Reference)
├── QuizId (Reference)
├── ModuleId (Reference - for context)
│
└── QuizAttempts (Collection of QuizAttempt Entities)
    └── QuizAttempt (Entity)
        ├── AttemptId (Identity)
        ├── AttemptNumber (1, 2, 3...)
        ├── Score (Value Object: Percentage)
        │   ├── PointsEarned
        │   ├── TotalPoints
        │   └── Percentage (computed)
        ├── IsPassed (computed from PassThreshold)
        ├── StartedAt
        ├── CompletedAt
        ├── Duration (computed)
        │
        └── Answers (Collection of Answer Value Objects)
            └── Answer (Value Object)
                ├── QuestionId
                ├── SelectedOptionId (for MC)
                ├── TextAnswer (for open-ended)
                ├── IsCorrect
                └── PointsAwarded
```

**Business Rules:**
- All attempt history is preserved (audit trail)
- Score is automatically calculated based on correct answers
- IsPassed status determined by comparing score to PassThreshold
- Duration calculated from StartedAt to CompletedAt
- Cannot submit quiz after time limit expires

**Value Objects:**
- `Score`: Encapsulates points earned, total points, and percentage
- `Answer`: Immutable record of trainee's response

**Entities:**
- `QuizAttempt`: Single attempt at taking a quiz

#### Aggregate Root: Certificate

```
Certificate (Aggregate Root)
├── CertificateId (Identity)
├── TraineeId (Reference)
├── CourseId (Reference)
├── CertificateNumber (Value Object: unique)
│   ├── Prefix ("SLOGBA")
│   ├── Year (2026)
│   └── SequentialNumber (0001, 0002...)
│   Format: "SLOGBA-2026-0001"
├── IssuedDate
├── FinalScore (Value Object: Percentage)
├── CertificateTemplate (Value Object)
│   ├── TemplateVersion
│   └── LayoutType
├── VerificationCode (Value Object: UUID or hash)
├── FileUrl (generated PDF path)
├── EmailSentAt
└── IsRevoked (for admin control)
```

**Business Rules:**
- Certificate issued only after course completion with passing score
- CertificateNumber must be unique across all certificates
- PDF generated automatically upon issuance
- Email sent automatically with certificate attached
- Certificates can be revoked by SuperAdmin only
- VerificationCode allows public verification of authenticity

**Value Objects:**
- `CertificateNumber`: Formatted unique identifier (SLOGBA-YYYY-####)
- `CertificateTemplate`: Defines visual design and layout version
- `VerificationCode`: Cryptographically secure identifier for validation

---

### 4. Progress & Analytics Context

This context tracks learning trajectories and provides insights for the 30,000 youth target.

#### Aggregate Root: TraineeProgress

```
TraineeProgress (Aggregate Root)
├── ProgressId (Identity)
├── TraineeId (Reference)
├── CourseId (Reference)
├── EnrollmentDate
├── Status (Enum: InProgress, Completed, Failed)
├── CompletionPercentage (Value Object: computed)
├── ResumePoint (Value Object)
│   ├── LastModuleId
│   ├── LastContentBlockId
│   └── LastAccessedAt
│
├── CompletionRecords (Collection of CompletionRecord Entities)
│   └── CompletionRecord (Entity)
│       ├── RecordId (Identity)
│       ├── RecordType (Enum: Module, Quiz, ContentBlock)
│       ├── ReferenceId (polymorphic)
│       ├── CompletedAt
│       └── TimeSpent (optional)
│
└── ModuleProgress (Collection - denormalized for quick access)
    └── ModuleProgress (Entity)
        ├── ModuleId
        ├── Status (Enum: NotStarted, InProgress, Completed)
        ├── StartedAt
        ├── CompletedAt
        └── QuizStatus (Enum: NotAttempted, Attempted, Passed)
```

**Business Rules:**
- Progress tracked at module, quiz, and content block levels
- ResumePoint updated automatically on content access
- CompletionPercentage calculated from completed modules
- Status transitions: InProgress → Completed (when all modules passed)
- Status transitions: InProgress → Failed (if retries exhausted)
- Module marked complete only after quiz is passed (if quiz exists)

**Value Objects:**
- `ResumePoint`: Precise location for continuing learning
- `CompletionPercentage`: Calculated from completed vs. total modules

**Entities:**
- `CompletionRecord`: Granular audit trail of completed items
- `ModuleProgress`: Denormalized view for dashboard performance

#### Read Model: AnalyticsSnapshot

```
AnalyticsSnapshot (Read Model - CQRS pattern)
├── SnapshotId (Identity)
├── SnapshotDate
├── GeneratedAt
│
├── OverallStats
│   ├── TotalVisitors (from web analytics)
│   ├── TotalRegisteredTrainees
│   ├── TraineesInProgress
│   ├── GraduatedTrainees
│   ├── FailedTrainees
│   └── TargetProgress (toward 30,000 goal)
│
└── DemographicStats (Collection of DemographicStat Value Objects)
    └── DemographicStat (Value Object)
        ├── Dimension (Enum: Gender, District, Category)
        ├── BreakdownValues (Map<string, int>)
        │   Example for Gender: { "Male": 1200, "Female": 800 }
        │   Example for District: { "Kampala": 500, "Yumbe": 300, ... }
        │   Example for Category: { "Leader": 400, "CSM": 600, "Citizen": 1000 }
        └── Timestamp
```

**Business Rules:**
- Snapshots generated daily for historical tracking
- Aggregates data from TraineeProgress and Trainee aggregates
- Read-only model optimized for dashboard queries
- Supports pie charts, graphs, and summary statistics

**Value Objects:**
- `DemographicStat`: Flexible breakdown by any dimension
- Supports extensibility for new filtering dimensions

---

### 5. Public Website Context

This context manages public-facing content and engagement without requiring authentication.

#### Aggregate Root: HomepageContent

```
HomepageContent (Aggregate Root - Singleton pattern)
├── ContentId (Identity)
├── LastUpdatedBy (StaffUserId)
├── LastUpdatedAt
│
├── BannerImages (Collection of BannerImage Entities)
│   └── BannerImage (Entity)
│       ├── ImageId (Identity)
│       ├── Image (Value Object: { Url, AltText })
│       ├── DisplayOrder
│       ├── IsActive
│       └── UploadedAt
│
├── ImpactStories (Collection of ImpactStory Entities)
│   └── ImpactStory (Entity)
│       ├── StoryId (Identity)
│       ├── Title
│       ├── Summary (short text for card)
│       ├── FullStory (rich text)
│       ├── Image (Value Object)
│       ├── PublishedAt
│       ├── IsPublished
│       └── ViewCount (analytics)
│
├── NewsUpdates (Collection of NewsUpdate Entities)
│   └── NewsUpdate (Entity)
│       ├── UpdateId (Identity)
│       ├── Title
│       ├── Content
│       ├── PublishedAt
│       └── IsPublished
│
├── Videos (Collection of VideoContent Entities)
│   └── VideoContent (Entity)
│       ├── VideoId (Identity)
│       ├── Title
│       ├── YouTubeLink (Value Object)
│       ├── DisplayOrder
│       └── AddedAt
│
├── PartnerLogos (Collection of PartnerLogo Entities)
│   └── PartnerLogo (Entity)
│       ├── LogoId (Identity)
│       ├── PartnerName
│       ├── Logo (Value Object: { Url, AltText })
│       ├── DisplayOrder
│       ├── IsActive
│       └── AddedAt
│
└── SocialLinks (Value Object)
    ├── WhatsAppUrl
    ├── FacebookUrl (and/or embedded feed)
    ├── TwitterUrl
    └── LastUpdated
```

**Business Rules:**
- Only one HomepageContent instance exists (Singleton)
- BannerImages displayed in carousel (minimum 3 recommended)
- New logos do not replace old ones (append to collection)
- Only published content visible to public visitors
- Layout structure must be maintained (positioning preserved)
- ViewCount incremented on story access for analytics

**Value Objects:**
- `Image`: Url, AltText, dimensions
- `YouTubeLink`: Validated YouTube URL
- `SocialLinks`: Grouped social media URLs

**Entities:**
- `BannerImage`: Hero section carousel images
- `ImpactStory`: Community impact narratives
- `NewsUpdate`: Latest announcements
- `VideoContent`: Educational or promotional videos
- `PartnerLogo`: Organization partners and sponsors

---

### 6. Engagement & Communication Context

This context facilitates live training sessions and real-time interaction.

#### Aggregate Root: LiveSession

```
LiveSession (Aggregate Root)
├── SessionId (Identity)
├── Title
├── Description
├── CourseId (optional - can be standalone)
├── ModuleId (optional - more specific link)
├── Schedule (Value Object)
│   ├── ScheduledDateTime
│   ├── Duration (minutes)
│   ├── TimeZone
│   └── ReminderSentAt
├── SessionLink (Value Object)
│   ├── Platform (Enum: Zoom, GoogleMeet)
│   ├── MeetingUrl (validated)
│   ├── MeetingId
│   └── Password (encrypted, optional)
├── CreatedBy (StaffUserId)
├── MaxAttendees (optional)
├── Status (Enum: Scheduled, InProgress, Completed, Cancelled)
│
└── Attendees (Collection of SessionAttendee Entities)
    └── SessionAttendee (Entity)
        ├── AttendeeId (Identity)
        ├── TraineeId
        ├── RegisteredAt
        ├── JoinedAt (null if didn't attend)
        ├── LeftAt
        └── DurationInSession (computed)
```

**Business Rules:**
- Sessions can be linked to courses/modules or standalone
- Reminders sent automatically before scheduled time
- MaxAttendees enforced during registration (if set)
- Status transitions: Scheduled → InProgress → Completed
- Status can be set to Cancelled by admin
- Attendance tracked for completion records

**Value Objects:**
- `Schedule`: ScheduledDateTime, Duration, TimeZone, ReminderSentAt
- `SessionLink`: Platform-specific meeting details with validation

**Entities:**
- `SessionAttendee`: Individual participant in live session

---

## Domain Events

Domain events enable loose coupling between bounded contexts and support event-driven workflows.

### IAM Context Events

```
- TraineeRegistered
  ├── TraineeId
  ├── Email
  ├── RegistrationDate
  └── Profile data
  
- TraineeProfileUpdated
  ├── TraineeId
  └── Updated fields
  
- StaffUserCreated
  ├── StaffUserId
  ├── Role
  └── CreatedBy
```

### Learning Context Events

```
- CoursePublished
  ├── CourseId
  ├── Title
  └── PublishedAt
  
- ModuleContentUpdated
  ├── ModuleId
  ├── CourseId
  └── UpdatedBy
  
- LibraryResourceAdded
  ├── ResourceId
  ├── ResourceType
  └── UploadedBy
```

### Assessment Context Events

```
- QuizAttempted
  ├── AttemptId
  ├── TraineeId
  ├── QuizId
  └── StartedAt
  
- QuizPassed
  ├── AttemptId
  ├── TraineeId
  ├── QuizId
  ├── Score
  └── CompletedAt
  
- QuizFailed
  ├── AttemptId
  ├── TraineeId
  ├── QuizId
  ├── Score
  └── RemainingAttempts
  
- CertificateIssued
  ├── CertificateId
  ├── TraineeId
  ├── CourseId
  ├── CertificateNumber
  └── IssuedDate
```

### Progress Context Events

```
- ModuleStarted
  ├── TraineeId
  ├── ModuleId
  └── StartedAt
  
- ModuleCompleted
  ├── TraineeId
  ├── ModuleId
  ├── CompletedAt
  └── TimeSpent
  
- CourseCompleted
  ├── TraineeId
  ├── CourseId
  ├── FinalScore
  └── CompletedAt
  
- LearningResumed
  ├── TraineeId
  ├── CourseId
  └── ResumePoint
```

### Website Context Events

```
- ImpactStoryPublished
  ├── StoryId
  ├── Title
  └── PublishedAt
  
- HomepageContentUpdated
  ├── ContentId
  ├── UpdatedBy
  └── UpdatedAt
```

### Communication Context Events

```
- LiveSessionScheduled
  ├── SessionId
  ├── Title
  ├── ScheduledDateTime
  └── CreatedBy
  
- LiveSessionStarted
  ├── SessionId
  └── StartedAt
  
- AttendeeJoined
  ├── SessionId
  ├── TraineeId
  └── JoinedAt
```

---

## Application Layer Ports

The Application Layer defines ports (interfaces) that separate business logic from infrastructure concerns, following the Hexagonal Architecture pattern.

### Inbound Ports (Use Cases - Driving Side)

These interfaces define the use cases that drive the application.

#### IAM Context Use Cases

```java
public interface RegisterTraineeUseCase {
    TraineeId execute(RegisterTraineeCommand command);
}

public interface AuthenticateUserUseCase {
    AuthenticationResult execute(AuthenticationCommand command);
}

public interface UpdateTraineeProfileUseCase {
    void execute(UpdateProfileCommand command);
}

public interface GetTraineeByIdUseCase {
    TraineeDetails execute(TraineeQuery query);
}

public interface FilterTraineesUseCase {
    List<TraineeSummary> execute(TraineeFilters filters);
}
```

#### Learning Context Use Cases

```java
public interface EnrollTraineeInCourseUseCase {
    EnrollmentResult execute(EnrollmentCommand command);
}

public interface GetCourseDetailsUseCase {
    CourseDetails execute(CourseQuery query);
}

public interface CreateCourseUseCase {
    CourseId execute(CreateCourseCommand command);
}

public interface AddModuleToCourseUseCase {
    ModuleId execute(AddModuleCommand command);
}

public interface AddContentBlockToModuleUseCase {
    BlockId execute(AddContentBlockCommand command);
}

public interface PublishCourseUseCase {
    void execute(PublishCourseCommand command);
}

public interface UploadLibraryResourceUseCase {
    ResourceId execute(UploadResourceCommand command);
}

public interface GetPublishedCoursesUseCase {
    List<CourseSummary> execute();
}
```

#### Assessment Context Use Cases

```java
public interface CreateQuizUseCase {
    QuizId execute(CreateQuizCommand command);
}

public interface StartQuizAttemptUseCase {
    AttemptId execute(StartQuizCommand command);
}

public interface SubmitQuizUseCase {
    QuizResult execute(SubmitQuizCommand command);
}

public interface GetQuizResultsUseCase {
    List<QuizAttempt> execute(QuizResultsQuery query);
}

public interface GenerateCertificateUseCase {
    Certificate execute(GenerateCertificateCommand command);
}

public interface VerifyCertificateUseCase {
    CertificateValidation execute(VerificationCode code);
}
```

#### Progress Context Use Cases

```java
public interface UpdateLearningProgressUseCase {
    ProgressUpdate execute(UpdateProgressCommand command);
}

public interface GetTraineeDashboardUseCase {
    DashboardData execute(DashboardQuery query);
}

public interface RecordModuleCompletionUseCase {
    void execute(ModuleCompletionCommand command);
}

public interface GetResumePointUseCase {
    ResumePoint execute(ResumePointQuery query);
}
```

#### Analytics Context Use Cases

```java
public interface GetAdminDashboardStatsUseCase {
    AnalyticsDashboard execute(AdminDashboardQuery query);
}

public interface GenerateAnalyticsSnapshotUseCase {
    SnapshotId execute(GenerateSnapshotCommand command);
}

public interface GetDemographicBreakdownUseCase {
    List<DemographicStat> execute(DemographicQuery query);
}
```

#### Website Context Use Cases

```java
public interface PublishImpactStoryUseCase {
    StoryId execute(PublishStoryCommand command);
}

public interface UpdateHomepageContentUseCase {
    void execute(UpdateHomepageCommand command);
}

public interface AddBannerImageUseCase {
    ImageId execute(AddBannerCommand command);
}

public interface AddPartnerLogoUseCase {
    LogoId execute(AddPartnerCommand command);
}

public interface GetHomepageContentUseCase {
    HomepageData execute();
}
```

#### Communication Context Use Cases

```java
public interface ScheduleLiveSessionUseCase {
    SessionId execute(ScheduleSessionCommand command);
}

public interface RegisterForSessionUseCase {
    void execute(SessionRegistrationCommand command);
}

public interface GetUpcomingSessionsUseCase {
    List<LiveSession> execute(UpcomingSessionsQuery query);
}

public interface RecordSessionAttendanceUseCase {
    void execute(AttendanceCommand command);
}
```

---

### Outbound Ports (Repository & External Services - Driven Side)

These interfaces define what the domain needs from external systems.

#### Repository Ports (Persistence)

```java
// IAM Repositories
public interface TraineeRepositoryPort {
    void save(Trainee trainee);
    Optional<Trainee> findById(TraineeId id);
    Optional<Trainee> findByEmail(Email email);
    List<Trainee> findByFilters(TraineeFilters filters);
    boolean existsByEmail(Email email);
    long count();
}

public interface StaffUserRepositoryPort {
    void save(StaffUser staffUser);
    Optional<StaffUser> findById(StaffUserId id);
    Optional<StaffUser> findByEmail(Email email);
    List<StaffUser> findAll();
}

// Learning Repositories
public interface CourseRepositoryPort {
    void save(Course course);
    Optional<Course> findById(CourseId id);
    List<Course> findPublishedCourses();
    void delete(CourseId id);
}

public interface LibraryResourceRepositoryPort {
    void save(LibraryResource resource);
    Optional<LibraryResource> findById(ResourceId id);
    List<LibraryResource> findPublishedResources();
    void delete(ResourceId id);
}

// Assessment Repositories
public interface QuizRepositoryPort {
    void save(Quiz quiz);
    Optional<Quiz> findById(QuizId id);
    Optional<Quiz> findByModuleId(ModuleId moduleId);
    void delete(QuizId id);
}

public interface TraineeAssessmentRepositoryPort {
    void save(TraineeAssessment assessment);
    Optional<TraineeAssessment> findByTraineeAndQuiz(TraineeId traineeId, QuizId quizId);
    List<QuizAttempt> findAttemptsByTrainee(TraineeId traineeId);
}

public interface CertificateRepositoryPort {
    void save(Certificate certificate);
    Optional<Certificate> findById(CertificateId id);
    Optional<Certificate> findByTraineeAndCourse(TraineeId traineeId, CourseId courseId);
    Optional<Certificate> findByVerificationCode(VerificationCode code);
    boolean existsByCertificateNumber(CertificateNumber number);
    long generateNextSequentialNumber(int year);
}

// Progress Repositories
public interface ProgressRepositoryPort {
    void save(TraineeProgress progress);
    Optional<TraineeProgress> findByTraineeAndCourse(TraineeId traineeId, CourseId courseId);
    List<TraineeProgress> findByTrainee(TraineeId traineeId);
    long countByStatus(ProgressStatus status);
}

public interface AnalyticsSnapshotRepositoryPort {
    void save(AnalyticsSnapshot snapshot);
    Optional<AnalyticsSnapshot> findLatest();
    List<AnalyticsSnapshot> findByDateRange(DateRange range);
}

// Website Repositories
public interface HomepageContentRepositoryPort {
    void save(HomepageContent content);
    Optional<HomepageContent> findCurrent();
}

// Communication Repositories
public interface LiveSessionRepositoryPort {
    void save(LiveSession session);
    Optional<LiveSession> findById(SessionId id);
    List<LiveSession> findUpcoming();
    List<LiveSession> findByCourse(CourseId courseId);
}
```

#### External Service Ports

```java
// Email Notification Service
public interface EmailNotificationPort {
    void sendWelcomeEmail(Email recipient, TraineeName name);
    void sendCertificateEmail(Email recipient, Certificate certificate);
    void sendQuizResultEmail(Email recipient, QuizResult result);
    void sendSessionReminderEmail(Email recipient, LiveSession session);
    void sendPasswordResetEmail(Email recipient, String resetToken);
}

// PDF Generation Service
public interface CertificateGeneratorPort {
    FileUrl generatePdf(Certificate certificate, CertificateTemplate template);
    byte[] generatePdfBytes(Certificate certificate, CertificateTemplate template);
}

// File Storage Service
public interface FileStoragePort {
    FileUrl upload(File file, StorageLocation location);
    void delete(FileUrl url);
    Optional<File> download(FileUrl url);
    boolean exists(FileUrl url);
}

// Video Embedding Service
public interface VideoEmbedPort {
    EmbedCode generateYouTubeEmbed(YouTubeLink link);
    boolean validateYouTubeUrl(String url);
    String extractVideoId(YouTubeLink link);
}

// Analytics Tracking Service
public interface AnalyticsPort {
    void trackPageView(String page, TraineeId traineeId);
    void trackEvent(String eventName, Map<String, Object> properties);
    VisitorStats getVisitorStats(DateRange range);
}

// Meeting Platform Integration
public interface MeetingPlatformPort {
    SessionLink createZoomMeeting(MeetingDetails details);
    SessionLink createGoogleMeetLink(MeetingDetails details);
    void cancelMeeting(SessionLink link);
}

// Authentication Service
public interface AuthenticationPort {
    String hashPassword(String plainPassword);
    boolean verifyPassword(String plainPassword, String hashedPassword);
    String generateJwtToken(UserId userId, UserRole role);
    Optional<UserId> validateJwtToken(String token);
}

// Event Publishing (for Domain Events)
public interface EventPublisherPort {
    void publish(DomainEvent event);
    void publishAll(List<DomainEvent> events);
}
```

---

## Next Steps

### 1. Technology Stack Selection ✓ (Recommended Next)

**Decision Points:**
- **Backend Framework:** Java/Spring Boot, C#/.NET Core, Node.js/NestJS, Python/Django
- **Database:** PostgreSQL (recommended), MySQL, MongoDB
- **ORM/Data Access:** Hibernate, Entity Framework, TypeORM, Prisma
- **File Storage:** AWS S3, Azure Blob Storage, Google Cloud Storage, Local Filesystem
- **Email Service:** SendGrid, AWS SES, Mailgun, SMTP
- **Authentication:** JWT, OAuth2, Session-based
- **API Documentation:** OpenAPI/Swagger, Postman
- **Frontend:** React, Vue.js, Angular, Next.js
- **State Management:** Redux, Zustand, Pinia, NgRx

### 2. Database Schema Design

Transform aggregates into normalized database tables with:
- Primary keys and foreign keys
- Indexes for query performance
- Audit columns (created_at, updated_at, deleted_at)
- Event store tables for domain events
- Read model tables for analytics (CQRS)

### 3. API Endpoint Design

Map use cases to RESTful endpoints:
- Resource naming conventions
- HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Request/Response DTOs
- Error handling standards
- Pagination and filtering strategies
- Authentication/Authorization middleware

### 4. Frontend Architecture

Define:
- Component hierarchy and structure
- Page layouts and routing
- Form validation and error handling
- State management approach
- API integration layer
- Responsive design breakpoints

### 5. Infrastructure & Deployment

Plan:
- Containerization (Docker)
- Orchestration (Kubernetes, Docker Compose)
- CI/CD pipeline (GitHub Actions, GitLab CI, Jenkins)
- Environment management (Dev, Staging, Production)
- Monitoring and logging (Prometheus, ELK Stack)
- Backup and disaster recovery

### 6. Security Implementation

Implement:
- Authentication mechanisms
- Authorization rules (role-based, permission-based)
- Input validation and sanitization
- SQL injection prevention
- XSS and CSRF protection
- Rate limiting
- Secure file upload handling
- HTTPS/TLS configuration

---

## Appendix: Key Design Decisions

### Why Hexagonal Architecture?

- **Testability:** Business logic isolated from infrastructure
- **Flexibility:** Easy to swap implementations (e.g., change database)
- **Maintainability:** Clear separation of concerns
- **Domain Focus:** Core logic remains pure and technology-agnostic

### Why CQRS for Analytics?

- **Performance:** Read models optimized for queries
- **Scalability:** Separate scaling of reads and writes
- **Simplicity:** Complex aggregations pre-computed
- **Historical Tracking:** Snapshots enable trend analysis

### Why Domain Events?

- **Decoupling:** Bounded contexts remain independent
- **Audit Trail:** Complete history of system changes
- **Integration:** Easy to add new features without modifying existing code
- **Async Processing:** Background tasks (emails, notifications) triggered by events

### Value Objects vs Entities

- **Value Objects:** Immutable, compared by value, no identity
  - Examples: Email, District, Score, Percentage
- **Entities:** Mutable, compared by identity, lifecycle managed
  - Examples: Module, Question, QuizAttempt

---

**Document Maintained By:** Development Team  
**Last Updated:** February 9, 2026  
**Version:** 1.0
