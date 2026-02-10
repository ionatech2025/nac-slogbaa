# NAC-SLOGBAA Online Learning Platform
## Java/Spring Boot Project Structure - Domain-First Organization (Scholaria Pattern)

**Project:** NAC-SLOGBAA Online Learning Platform  
**Technology Stack:** Java 17+ / Spring Boot 3.x  
**Build Tool:** Maven  
**Architecture:** Hexagonal (Ports & Adapters) - Domain-First Organization  
**Pattern Reference:** Scholaria Project Structure  
**Date:** February 9, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Complete Project Structure](#complete-project-structure)
3. [Maven Module Structure](#maven-module-structure)
4. [Domain Breakdown](#domain-breakdown)
5. [Shared Components](#shared-components)
6. [Configuration Files](#configuration-files)
7. [Implementation Guidelines](#implementation-guidelines)

---

## Project Overview

### Technology Stack

- **Language:** Java 17 or Java 21 (LTS)
- **Framework:** Spring Boot 3.2.x
- **Build Tool:** Maven 3.9.x
- **ORM:** Spring Data JPA with Hibernate
- **Database:** PostgreSQL (recommended)
- **Security:** Spring Security with JWT
- **Testing:** JUnit 5, Mockito, TestContainers
- **Documentation:** SpringDoc OpenAPI (Swagger)
- **Validation:** Jakarta Bean Validation
- **Logging:** SLF4J with Logback

### Spring Boot Dependencies

- `spring-boot-starter-web` - REST APIs
- `spring-boot-starter-data-jpa` - Database access
- `spring-boot-starter-security` - Authentication/Authorization
- `spring-boot-starter-validation` - Bean validation
- `spring-boot-starter-mail` - Email notifications
- `spring-boot-starter-test` - Testing framework
- `lombok` - Reduce boilerplate code
- `mapstruct` - Object mapping

---

## Complete Project Structure

```
nac-slogbaa-platform/
│
├── pom.xml                                       # Root Maven POM (parent)
├── README.md
├── LICENSE
├── .gitignore
├── docker-compose.yml
├── Dockerfile
│
├── iam/                                          # Identity & Access Management Module
│   ├── pom.xml                                   # IAM module POM
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/iam/
│       │   │       │
│       │   │       ├── adapters/                 # Infrastructure Adapters
│       │   │       │   ├── persistence/
│       │   │       │   │   ├── entity/
│       │   │       │   │   │   ├── TraineeEntity.java
│       │   │       │   │   │   ├── ProfileEntity.java
│       │   │       │   │   │   └── StaffUserEntity.java
│       │   │       │   │   ├── repository/
│       │   │       │   │   │   ├── JpaTraineeRepository.java
│       │   │       │   │   │   └── JpaStaffUserRepository.java
│       │   │       │   │   ├── adapter/
│       │   │       │   │   │   ├── TraineeRepositoryAdapter.java
│       │   │       │   │   │   └── StaffUserRepositoryAdapter.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       ├── TraineeEntityMapper.java
│       │   │       │   │       └── StaffUserEntityMapper.java
│       │   │       │   │
│       │   │       │   ├── rest/
│       │   │       │   │   ├── controller/
│       │   │       │   │   │   ├── AuthController.java
│       │   │       │   │   │   ├── TraineeController.java
│       │   │       │   │   │   └── StaffController.java
│       │   │       │   │   ├── dto/
│       │   │       │   │   │   ├── request/
│       │   │       │   │   │   │   ├── RegisterTraineeRequest.java
│       │   │       │   │   │   │   ├── LoginRequest.java
│       │   │       │   │   │   │   └── UpdateProfileRequest.java
│       │   │       │   │   │   └── response/
│       │   │       │   │   │       ├── TraineeResponse.java
│       │   │       │   │   │       ├── AuthResponse.java
│       │   │       │   │   │       └── StaffResponse.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       └── TraineeDtoMapper.java
│       │   │       │   │
│       │   │       │   └── security/
│       │   │       │       ├── JwtAuthenticationAdapter.java
│       │   │       │       ├── JwtTokenProvider.java
│       │   │       │       └── PasswordEncoderAdapter.java
│       │   │       │
│       │   │       ├── application/              # Application Layer
│       │   │       │   ├── port/
│       │   │       │   │   ├── in/              # Inbound Ports (Use Cases)
│       │   │       │   │   │   ├── RegisterTraineeUseCase.java
│       │   │       │   │   │   ├── AuthenticateUserUseCase.java
│       │   │       │   │   │   ├── UpdateTraineeProfileUseCase.java
│       │   │       │   │   │   ├── GetTraineeByIdUseCase.java
│       │   │       │   │   │   └── FilterTraineesUseCase.java
│       │   │       │   │   │
│       │   │       │   │   └── out/             # Outbound Ports (Repositories/Services)
│       │   │       │   │       ├── TraineeRepositoryPort.java
│       │   │       │   │       ├── StaffUserRepositoryPort.java
│       │   │       │   │       ├── AuthenticationPort.java
│       │   │       │   │       └── EmailNotificationPort.java
│       │   │       │   │
│       │   │       │   ├── service/             # Use Case Implementations
│       │   │       │   │   ├── RegisterTraineeService.java
│       │   │       │   │   ├── AuthenticateUserService.java
│       │   │       │   │   ├── UpdateTraineeProfileService.java
│       │   │       │   │   ├── GetTraineeByIdService.java
│       │   │       │   │   └── FilterTraineesService.java
│       │   │       │   │
│       │   │       │   └── dto/                 # Application DTOs
│       │   │       │       ├── command/
│       │   │       │       │   ├── RegisterTraineeCommand.java
│       │   │       │       │   ├── AuthenticationCommand.java
│       │   │       │       │   └── UpdateProfileCommand.java
│       │   │       │       ├── query/
│       │   │       │       │   ├── TraineeQuery.java
│       │   │       │       │   └── TraineeFilters.java
│       │   │       │       └── result/
│       │   │       │           ├── AuthenticationResult.java
│       │   │       │           ├── TraineeDetails.java
│       │   │       │           └── TraineeSummary.java
│       │   │       │
│       │   │       ├── core/                    # Domain Core (Business Logic)
│       │   │       │   ├── aggregate/
│       │   │       │   │   ├── Trainee.java
│       │   │       │   │   └── StaffUser.java
│       │   │       │   │
│       │   │       │   ├── entity/
│       │   │       │   │   └── Profile.java
│       │   │       │   │
│       │   │       │   ├── valueobject/
│       │   │       │   │   ├── TraineeId.java
│       │   │       │   │   ├── StaffUserId.java
│       │   │       │   │   ├── Email.java
│       │   │       │   │   ├── FullName.java
│       │   │       │   │   ├── ContactInfo.java
│       │   │       │   │   ├── Gender.java
│       │   │       │   │   ├── District.java
│       │   │       │   │   ├── PhysicalAddress.java
│       │   │       │   │   ├── TraineeCategory.java
│       │   │       │   │   └── StaffRole.java
│       │   │       │   │
│       │   │       │   ├── event/
│       │   │       │   │   ├── TraineeRegistered.java
│       │   │       │   │   ├── TraineeProfileUpdated.java
│       │   │       │   │   └── StaffUserCreated.java
│       │   │       │   │
│       │   │       │   ├── specification/
│       │   │       │   │   ├── TraineeCanEnrollSpecification.java
│       │   │       │   │   └── StaffCanManageContentSpecification.java
│       │   │       │   │
│       │   │       │   └── exception/
│       │   │       │       ├── DuplicateEmailException.java
│       │   │       │       ├── InvalidTraineeCategoryException.java
│       │   │       │       └── UnauthorizedAccessException.java
│       │   │       │
│       │   │       └── config/                  # Module Configuration
│       │   │           ├── IamConfiguration.java
│       │   │           └── IamSecurityConfiguration.java
│       │   │
│       │   └── resources/
│       │       ├── application-iam.yml
│       │       └── db/
│       │           └── migration/
│       │               └── V001__create_iam_tables.sql
│       │
│       └── test/
│           ├── java/
│           │   └── com/slogbaa/platform/iam/
│           │       ├── unit/
│           │       │   ├── core/
│           │       │   │   ├── TraineeTest.java
│           │       │   │   └── EmailTest.java
│           │       │   └── application/
│           │       │       └── RegisterTraineeServiceTest.java
│           │       │
│           │       └── integration/
│           │           ├── TraineeRepositoryAdapterTest.java
│           │           └── AuthControllerTest.java
│           │
│           └── resources/
│               ├── application-test.yml
│               └── test-data.sql
│
├── learning/                                     # Learning Management Module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/learning/
│       │   │       │
│       │   │       ├── adapters/
│       │   │       │   ├── persistence/
│       │   │       │   │   ├── entity/
│       │   │       │   │   │   ├── CourseEntity.java
│       │   │       │   │   │   ├── ModuleEntity.java
│       │   │       │   │   │   ├── ContentBlockEntity.java
│       │   │       │   │   │   └── LibraryResourceEntity.java
│       │   │       │   │   ├── repository/
│       │   │       │   │   │   ├── JpaCourseRepository.java
│       │   │       │   │   │   └── JpaLibraryResourceRepository.java
│       │   │       │   │   ├── adapter/
│       │   │       │   │   │   ├── CourseRepositoryAdapter.java
│       │   │       │   │   │   └── LibraryResourceRepositoryAdapter.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       ├── CourseEntityMapper.java
│       │   │       │   │       └── LibraryResourceEntityMapper.java
│       │   │       │   │
│       │   │       │   ├── rest/
│       │   │       │   │   ├── controller/
│       │   │       │   │   │   ├── CourseController.java
│       │   │       │   │   │   ├── ModuleController.java
│       │   │       │   │   │   ├── EnrollmentController.java
│       │   │       │   │   │   └── LibraryController.java
│       │   │       │   │   ├── dto/
│       │   │       │   │   │   ├── request/
│       │   │       │   │   │   │   ├── CreateCourseRequest.java
│       │   │       │   │   │   │   ├── AddModuleRequest.java
│       │   │       │   │   │   │   ├── EnrollmentRequest.java
│       │   │       │   │   │   │   └── UploadResourceRequest.java
│       │   │       │   │   │   └── response/
│       │   │       │   │   │       ├── CourseResponse.java
│       │   │       │   │   │       ├── ModuleResponse.java
│       │   │       │   │   │       └── LibraryResourceResponse.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       └── CourseDtoMapper.java
│       │   │       │   │
│       │   │       │   └── storage/
│       │   │       │       ├── FileStorageAdapter.java
│       │   │       │       └── YouTubeEmbedAdapter.java
│       │   │       │
│       │   │       ├── application/
│       │   │       │   ├── port/
│       │   │       │   │   ├── in/
│       │   │       │   │   │   ├── EnrollTraineeInCourseUseCase.java
│       │   │       │   │   │   ├── GetCourseDetailsUseCase.java
│       │   │       │   │   │   ├── CreateCourseUseCase.java
│       │   │       │   │   │   ├── AddModuleToCourseUseCase.java
│       │   │       │   │   │   ├── AddContentBlockToModuleUseCase.java
│       │   │       │   │   │   ├── PublishCourseUseCase.java
│       │   │       │   │   │   ├── UploadLibraryResourceUseCase.java
│       │   │       │   │   │   └── GetPublishedCoursesUseCase.java
│       │   │       │   │   │
│       │   │       │   │   └── out/
│       │   │       │   │       ├── CourseRepositoryPort.java
│       │   │       │   │       ├── LibraryResourceRepositoryPort.java
│       │   │       │   │       ├── FileStoragePort.java
│       │   │       │   │       └── VideoEmbedPort.java
│       │   │       │   │
│       │   │       │   ├── service/
│       │   │       │   │   ├── EnrollTraineeInCourseService.java
│       │   │       │   │   ├── GetCourseDetailsService.java
│       │   │       │   │   ├── CreateCourseService.java
│       │   │       │   │   ├── AddModuleToCourseService.java
│       │   │       │   │   ├── AddContentBlockToModuleService.java
│       │   │       │   │   ├── PublishCourseService.java
│       │   │       │   │   ├── UploadLibraryResourceService.java
│       │   │       │   │   └── GetPublishedCoursesService.java
│       │   │       │   │
│       │   │       │   └── dto/
│       │   │       │       ├── command/
│       │   │       │       │   ├── EnrollmentCommand.java
│       │   │       │       │   ├── CreateCourseCommand.java
│       │   │       │       │   ├── AddModuleCommand.java
│       │   │       │       │   ├── AddContentBlockCommand.java
│       │   │       │       │   ├── PublishCourseCommand.java
│       │   │       │       │   └── UploadResourceCommand.java
│       │   │       │       ├── query/
│       │   │       │       │   └── CourseQuery.java
│       │   │       │       └── result/
│       │   │       │           ├── EnrollmentResult.java
│       │   │       │           ├── CourseDetails.java
│       │   │       │           └── CourseSummary.java
│       │   │       │
│       │   │       ├── core/
│       │   │       │   ├── aggregate/
│       │   │       │   │   ├── Course.java
│       │   │       │   │   └── LibraryResource.java
│       │   │       │   │
│       │   │       │   ├── entity/
│       │   │       │   │   ├── Module.java
│       │   │       │   │   └── ContentBlock.java
│       │   │       │   │
│       │   │       │   ├── valueobject/
│       │   │       │   │   ├── CourseId.java
│       │   │       │   │   ├── ModuleId.java
│       │   │       │   │   ├── BlockId.java
│       │   │       │   │   ├── ResourceId.java
│       │   │       │   │   ├── ModuleOrder.java
│       │   │       │   │   ├── YouTubeLink.java
│       │   │       │   │   ├── BlockType.java
│       │   │       │   │   ├── ResourceType.java
│       │   │       │   │   └── FileUrl.java
│       │   │       │   │
│       │   │       │   ├── event/
│       │   │       │   │   ├── CoursePublished.java
│       │   │       │   │   ├── ModuleContentUpdated.java
│       │   │       │   │   └── LibraryResourceAdded.java
│       │   │       │   │
│       │   │       │   ├── specification/
│       │   │       │   │   ├── CourseCanBePublishedSpecification.java
│       │   │       │   │   └── ModuleCanBeDeletedSpecification.java
│       │   │       │   │
│       │   │       │   └── exception/
│       │   │       │       ├── CourseNotFoundException.java
│       │   │       │       ├── ModuleOrderException.java
│       │   │       │       └── InvalidYouTubeLinkException.java
│       │   │       │
│       │   │       └── config/
│       │   │           └── LearningConfiguration.java
│       │   │
│       │   └── resources/
│       │       ├── application-learning.yml
│       │       └── db/
│       │           └── migration/
│       │               └── V002__create_learning_tables.sql
│       │
│       └── test/
│           └── java/
│               └── com/slogbaa/platform/learning/
│                   ├── unit/
│                   └── integration/
│
├── assessment/                                   # Assessment & Certification Module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/assessment/
│       │   │       │
│       │   │       ├── adapters/
│       │   │       │   ├── persistence/
│       │   │       │   │   ├── entity/
│       │   │       │   │   │   ├── QuizEntity.java
│       │   │       │   │   │   ├── QuestionEntity.java
│       │   │       │   │   │   ├── OptionEntity.java
│       │   │       │   │   │   ├── AssessmentEntity.java
│       │   │       │   │   │   ├── QuizAttemptEntity.java
│       │   │       │   │   │   └── CertificateEntity.java
│       │   │       │   │   ├── repository/
│       │   │       │   │   │   ├── JpaQuizRepository.java
│       │   │       │   │   │   ├── JpaAssessmentRepository.java
│       │   │       │   │   │   └── JpaCertificateRepository.java
│       │   │       │   │   ├── adapter/
│       │   │       │   │   │   ├── QuizRepositoryAdapter.java
│       │   │       │   │   │   ├── AssessmentRepositoryAdapter.java
│       │   │       │   │   │   └── CertificateRepositoryAdapter.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       ├── QuizEntityMapper.java
│       │   │       │   │       ├── AssessmentEntityMapper.java
│       │   │       │   │       └── CertificateEntityMapper.java
│       │   │       │   │
│       │   │       │   ├── rest/
│       │   │       │   │   ├── controller/
│       │   │       │   │   │   ├── QuizController.java
│       │   │       │   │   │   ├── AssessmentController.java
│       │   │       │   │   │   └── CertificateController.java
│       │   │       │   │   ├── dto/
│       │   │       │   │   │   ├── request/
│       │   │       │   │   │   │   ├── CreateQuizRequest.java
│       │   │       │   │   │   │   ├── StartQuizRequest.java
│       │   │       │   │   │   │   └── SubmitQuizRequest.java
│       │   │       │   │   │   └── response/
│       │   │       │   │   │       ├── QuizResponse.java
│       │   │       │   │   │       ├── QuizResultResponse.java
│       │   │       │   │   │       └── CertificateResponse.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       └── QuizDtoMapper.java
│       │   │       │   │
│       │   │       │   └── pdf/
│       │   │       │       └── CertificateGeneratorAdapter.java
│       │   │       │
│       │   │       ├── application/
│       │   │       │   ├── port/
│       │   │       │   │   ├── in/
│       │   │       │   │   │   ├── CreateQuizUseCase.java
│       │   │       │   │   │   ├── StartQuizAttemptUseCase.java
│       │   │       │   │   │   ├── SubmitQuizUseCase.java
│       │   │       │   │   │   ├── GetQuizResultsUseCase.java
│       │   │       │   │   │   ├── GenerateCertificateUseCase.java
│       │   │       │   │   │   └── VerifyCertificateUseCase.java
│       │   │       │   │   │
│       │   │       │   │   └── out/
│       │   │       │   │       ├── QuizRepositoryPort.java
│       │   │       │   │       ├── AssessmentRepositoryPort.java
│       │   │       │   │       ├── CertificateRepositoryPort.java
│       │   │       │   │       ├── CertificateGeneratorPort.java
│       │   │       │   │       └── EmailNotificationPort.java
│       │   │       │   │
│       │   │       │   ├── service/
│       │   │       │   │   ├── CreateQuizService.java
│       │   │       │   │   ├── StartQuizAttemptService.java
│       │   │       │   │   ├── SubmitQuizService.java
│       │   │       │   │   ├── GetQuizResultsService.java
│       │   │       │   │   ├── GenerateCertificateService.java
│       │   │       │   │   └── VerifyCertificateService.java
│       │   │       │   │
│       │   │       │   └── dto/
│       │   │       │       ├── command/
│       │   │       │       │   ├── CreateQuizCommand.java
│       │   │       │       │   ├── StartQuizCommand.java
│       │   │       │       │   ├── SubmitQuizCommand.java
│       │   │       │       │   └── GenerateCertificateCommand.java
│       │   │       │       ├── query/
│       │   │       │       │   └── QuizResultsQuery.java
│       │   │       │       └── result/
│       │   │       │           ├── QuizResult.java
│       │   │       │           └── CertificateValidation.java
│       │   │       │
│       │   │       ├── core/
│       │   │       │   ├── aggregate/
│       │   │       │   │   ├── Quiz.java
│       │   │       │   │   ├── TraineeAssessment.java
│       │   │       │   │   └── Certificate.java
│       │   │       │   │
│       │   │       │   ├── entity/
│       │   │       │   │   ├── Question.java
│       │   │       │   │   ├── Option.java
│       │   │       │   │   └── QuizAttempt.java
│       │   │       │   │
│       │   │       │   ├── valueobject/
│       │   │       │   │   ├── QuizId.java
│       │   │       │   │   ├── AssessmentId.java
│       │   │       │   │   ├── CertificateId.java
│       │   │       │   │   ├── QuestionId.java
│       │   │       │   │   ├── AttemptId.java
│       │   │       │   │   ├── PassThreshold.java
│       │   │       │   │   ├── Score.java
│       │   │       │   │   ├── Percentage.java
│       │   │       │   │   ├── QuestionType.java
│       │   │       │   │   ├── Answer.java
│       │   │       │   │   ├── CertificateNumber.java
│       │   │       │   │   ├── CertificateTemplate.java
│       │   │       │   │   └── VerificationCode.java
│       │   │       │   │
│       │   │       │   ├── event/
│       │   │       │   │   ├── QuizAttempted.java
│       │   │       │   │   ├── QuizPassed.java
│       │   │       │   │   ├── QuizFailed.java
│       │   │       │   │   └── CertificateIssued.java
│       │   │       │   │
│       │   │       │   ├── specification/
│       │   │       │   │   ├── QuizCanBeAttemptedSpecification.java
│       │   │       │   │   └── CertificateCanBeIssuedSpecification.java
│       │   │       │   │
│       │   │       │   └── exception/
│       │   │       │       ├── QuizNotAvailableException.java
│       │   │       │       ├── MaxAttemptsExceededException.java
│       │   │       │       ├── ModuleNotCompletedException.java
│       │   │       │       └── CertificateNotFoundException.java
│       │   │       │
│       │   │       └── config/
│       │   │           └── AssessmentConfiguration.java
│       │   │
│       │   └── resources/
│       │       ├── application-assessment.yml
│       │       ├── db/
│       │       │   └── migration/
│       │       │       └── V003__create_assessment_tables.sql
│       │       └── templates/
│       │           └── certificate-template.html
│       │
│       └── test/
│           └── java/
│               └── com/slogbaa/platform/assessment/
│                   ├── unit/
│                   └── integration/
│
├── progress/                                     # Progress & Analytics Module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/progress/
│       │   │       │
│       │   │       ├── adapters/
│       │   │       │   ├── persistence/
│       │   │       │   │   ├── entity/
│       │   │       │   │   │   ├── ProgressEntity.java
│       │   │       │   │   │   ├── CompletionRecordEntity.java
│       │   │       │   │   │   ├── ModuleProgressEntity.java
│       │   │       │   │   │   └── AnalyticsSnapshotEntity.java
│       │   │       │   │   ├── repository/
│       │   │       │   │   │   ├── JpaProgressRepository.java
│       │   │       │   │   │   └── JpaAnalyticsSnapshotRepository.java
│       │   │       │   │   ├── adapter/
│       │   │       │   │   │   ├── ProgressRepositoryAdapter.java
│       │   │       │   │   │   └── AnalyticsSnapshotRepositoryAdapter.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       ├── ProgressEntityMapper.java
│       │   │       │   │       └── AnalyticsSnapshotEntityMapper.java
│       │   │       │   │
│       │   │       │   └── rest/
│       │   │       │       ├── controller/
│       │   │       │       │   ├── ProgressController.java
│       │   │       │       │   ├── DashboardController.java
│       │   │       │       │   └── AnalyticsController.java
│       │   │       │       ├── dto/
│       │   │       │       │   ├── request/
│       │   │       │       │   │   ├── UpdateProgressRequest.java
│       │   │       │       │   │   └── ModuleCompletionRequest.java
│       │   │       │       │   └── response/
│       │   │       │       │       ├── DashboardResponse.java
│       │   │       │       │       ├── ProgressResponse.java
│       │   │       │       │       └── AnalyticsResponse.java
│       │   │       │       └── mapper/
│       │   │       │           └── ProgressDtoMapper.java
│       │   │       │
│       │   │       ├── application/
│       │   │       │   ├── port/
│       │   │       │   │   ├── in/
│       │   │       │   │   │   ├── UpdateLearningProgressUseCase.java
│       │   │       │   │   │   ├── GetTraineeDashboardUseCase.java
│       │   │       │   │   │   ├── RecordModuleCompletionUseCase.java
│       │   │       │   │   │   ├── GetResumePointUseCase.java
│       │   │       │   │   │   ├── GetAdminDashboardStatsUseCase.java
│       │   │       │   │   │   ├── GenerateAnalyticsSnapshotUseCase.java
│       │   │       │   │   │   └── GetDemographicBreakdownUseCase.java
│       │   │       │   │   │
│       │   │       │   │   └── out/
│       │   │       │   │       ├── ProgressRepositoryPort.java
│       │   │       │   │       ├── AnalyticsSnapshotRepositoryPort.java
│       │   │       │   │       └── AnalyticsPort.java
│       │   │       │   │
│       │   │       │   ├── service/
│       │   │       │   │   ├── UpdateLearningProgressService.java
│       │   │       │   │   ├── GetTraineeDashboardService.java
│       │   │       │   │   ├── RecordModuleCompletionService.java
│       │   │       │   │   ├── GetResumePointService.java
│       │   │       │   │   ├── GetAdminDashboardStatsService.java
│       │   │       │   │   ├── GenerateAnalyticsSnapshotService.java
│       │   │       │   │   └── GetDemographicBreakdownService.java
│       │   │       │   │
│       │   │       │   └── dto/
│       │   │       │       ├── command/
│       │   │       │       │   ├── UpdateProgressCommand.java
│       │   │       │       │   ├── ModuleCompletionCommand.java
│       │   │       │       │   └── GenerateSnapshotCommand.java
│       │   │       │       ├── query/
│       │   │       │       │   ├── DashboardQuery.java
│       │   │       │       │   ├── ResumePointQuery.java
│       │   │       │       │   ├── AdminDashboardQuery.java
│       │   │       │       │   └── DemographicQuery.java
│       │   │       │       └── result/
│       │   │       │           ├── DashboardData.java
│       │   │       │           ├── ProgressUpdate.java
│       │   │       │           └── AnalyticsDashboard.java
│       │   │       │
│       │   │       ├── core/
│       │   │       │   ├── aggregate/
│       │   │       │   │   ├── TraineeProgress.java
│       │   │       │   │   └── AnalyticsSnapshot.java
│       │   │       │   │
│       │   │       │   ├── entity/
│       │   │       │   │   ├── CompletionRecord.java
│       │   │       │   │   └── ModuleProgress.java
│       │   │       │   │
│       │   │       │   ├── valueobject/
│       │   │       │   │   ├── ProgressId.java
│       │   │       │   │   ├── SnapshotId.java
│       │   │       │   │   ├── RecordId.java
│       │   │       │   │   ├── ProgressStatus.java
│       │   │       │   │   ├── ResumePoint.java
│       │   │       │   │   ├── CompletionPercentage.java
│       │   │       │   │   ├── DemographicStat.java
│       │   │       │   │   └── RecordType.java
│       │   │       │   │
│       │   │       │   ├── event/
│       │   │       │   │   ├── ModuleStarted.java
│       │   │       │   │   ├── ModuleCompleted.java
│       │   │       │   │   ├── CourseCompleted.java
│       │   │       │   │   └── LearningResumed.java
│       │   │       │   │
│       │   │       │   ├── specification/
│       │   │       │   │   └── ModuleCanBeCompletedSpecification.java
│       │   │       │   │
│       │   │       │   └── exception/
│       │   │       │       ├── ProgressNotFoundException.java
│       │   │       │       └── InvalidResumePointException.java
│       │   │       │
│       │   │       └── config/
│       │   │           └── ProgressConfiguration.java
│       │   │
│       │   └── resources/
│       │       ├── application-progress.yml
│       │       └── db/
│       │           └── migration/
│       │               └── V004__create_progress_tables.sql
│       │
│       └── test/
│           └── java/
│               └── com/slogbaa/platform/progress/
│                   ├── unit/
│                   └── integration/
│
├── website/                                      # Public Website Module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/website/
│       │   │       │
│       │   │       ├── adapters/
│       │   │       │   ├── persistence/
│       │   │       │   │   ├── entity/
│       │   │       │   │   │   ├── HomepageContentEntity.java
│       │   │       │   │   │   ├── BannerImageEntity.java
│       │   │       │   │   │   ├── ImpactStoryEntity.java
│       │   │       │   │   │   ├── NewsUpdateEntity.java
│       │   │       │   │   │   ├── VideoContentEntity.java
│       │   │       │   │   │   └── PartnerLogoEntity.java
│       │   │       │   │   ├── repository/
│       │   │       │   │   │   └── JpaHomepageContentRepository.java
│       │   │       │   │   ├── adapter/
│       │   │       │   │   │   └── HomepageContentRepositoryAdapter.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       └── HomepageContentEntityMapper.java
│       │   │       │   │
│       │   │       │   └── rest/
│       │   │       │       ├── controller/
│       │   │       │       │   ├── HomepageController.java
│       │   │       │       │   ├── ImpactStoryController.java
│       │   │       │       │   └── PublicContentController.java
│       │   │       │       ├── dto/
│       │   │       │       │   ├── request/
│       │   │       │       │   │   ├── PublishStoryRequest.java
│       │   │       │       │   │   ├── AddBannerRequest.java
│       │   │       │       │   │   └── AddPartnerRequest.java
│       │   │       │       │   └── response/
│       │   │       │       │       ├── HomepageResponse.java
│       │   │       │       │       └── ImpactStoryResponse.java
│       │   │       │       └── mapper/
│       │   │       │           └── HomepageDtoMapper.java
│       │   │       │
│       │   │       ├── application/
│       │   │       │   ├── port/
│       │   │       │   │   ├── in/
│       │   │       │   │   │   ├── PublishImpactStoryUseCase.java
│       │   │       │   │   │   ├── UpdateHomepageContentUseCase.java
│       │   │       │   │   │   ├── AddBannerImageUseCase.java
│       │   │       │   │   │   ├── AddPartnerLogoUseCase.java
│       │   │       │   │   │   └── GetHomepageContentUseCase.java
│       │   │       │   │   │
│       │   │       │   │   └── out/
│       │   │       │   │       ├── HomepageContentRepositoryPort.java
│       │   │       │   │       └── FileStoragePort.java
│       │   │       │   │
│       │   │       │   ├── service/
│       │   │       │   │   ├── PublishImpactStoryService.java
│       │   │       │   │   ├── UpdateHomepageContentService.java
│       │   │       │   │   ├── AddBannerImageService.java
│       │   │       │   │   ├── AddPartnerLogoService.java
│       │   │       │   │   └── GetHomepageContentService.java
│       │   │       │   │
│       │   │       │   └── dto/
│       │   │       │       ├── command/
│       │   │       │       │   ├── PublishStoryCommand.java
│       │   │       │       │   ├── UpdateHomepageCommand.java
│       │   │       │       │   ├── AddBannerCommand.java
│       │   │       │       │   └── AddPartnerCommand.java
│       │   │       │       └── result/
│       │   │       │           └── HomepageData.java
│       │   │       │
│       │   │       ├── core/
│       │   │       │   ├── aggregate/
│       │   │       │   │   └── HomepageContent.java
│       │   │       │   │
│       │   │       │   ├── entity/
│       │   │       │   │   ├── BannerImage.java
│       │   │       │   │   ├── ImpactStory.java
│       │   │       │   │   ├── NewsUpdate.java
│       │   │       │   │   ├── VideoContent.java
│       │   │       │   │   └── PartnerLogo.java
│       │   │       │   │
│       │   │       │   ├── valueobject/
│       │   │       │   │   ├── ContentId.java
│       │   │       │   │   ├── ImageId.java
│       │   │       │   │   ├── StoryId.java
│       │   │       │   │   ├── UpdateId.java
│       │   │       │   │   ├── VideoId.java
│       │   │       │   │   ├── LogoId.java
│       │   │       │   │   ├── Image.java
│       │   │       │   │   └── SocialLinks.java
│       │   │       │   │
│       │   │       │   ├── event/
│       │   │       │   │   ├── ImpactStoryPublished.java
│       │   │       │   │   └── HomepageContentUpdated.java
│       │   │       │   │
│       │   │       │   ├── specification/
│       │   │       │   │   └── StoryCanBePublishedSpecification.java
│       │   │       │   │
│       │   │       │   └── exception/
│       │   │       │       └── StoryNotFoundException.java
│       │   │       │
│       │   │       └── config/
│       │   │           └── WebsiteConfiguration.java
│       │   │
│       │   └── resources/
│       │       ├── application-website.yml
│       │       └── db/
│       │           └── migration/
│       │               └── V005__create_website_tables.sql
│       │
│       └── test/
│           └── java/
│               └── com/slogbaa/platform/website/
│                   ├── unit/
│                   └── integration/
│
├── communication/                                # Engagement & Communication Module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/communication/
│       │   │       │
│       │   │       ├── adapters/
│       │   │       │   ├── persistence/
│       │   │       │   │   ├── entity/
│       │   │       │   │   │   ├── LiveSessionEntity.java
│       │   │       │   │   │   └── SessionAttendeeEntity.java
│       │   │       │   │   ├── repository/
│       │   │       │   │   │   └── JpaLiveSessionRepository.java
│       │   │       │   │   ├── adapter/
│       │   │       │   │   │   └── LiveSessionRepositoryAdapter.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       └── LiveSessionEntityMapper.java
│       │   │       │   │
│       │   │       │   ├── rest/
│       │   │       │   │   ├── controller/
│       │   │       │   │   │   └── LiveSessionController.java
│       │   │       │   │   ├── dto/
│       │   │       │   │   │   ├── request/
│       │   │       │   │   │   │   ├── ScheduleSessionRequest.java
│       │   │       │   │   │   │   └── RegisterForSessionRequest.java
│       │   │       │   │   │   └── response/
│       │   │       │   │   │       └── LiveSessionResponse.java
│       │   │       │   │   └── mapper/
│       │   │       │   │       └── LiveSessionDtoMapper.java
│       │   │       │   │
│       │   │       │   └── meeting/
│       │   │       │       ├── ZoomAdapter.java
│       │   │       │       └── GoogleMeetAdapter.java
│       │   │       │
│       │   │       ├── application/
│       │   │       │   ├── port/
│       │   │       │   │   ├── in/
│       │   │       │   │   │   ├── ScheduleLiveSessionUseCase.java
│       │   │       │   │   │   ├── RegisterForSessionUseCase.java
│       │   │       │   │   │   ├── GetUpcomingSessionsUseCase.java
│       │   │       │   │   │   └── RecordSessionAttendanceUseCase.java
│       │   │       │   │   │
│       │   │       │   │   └── out/
│       │   │       │   │       ├── LiveSessionRepositoryPort.java
│       │   │       │   │       └── MeetingPlatformPort.java
│       │   │       │   │
│       │   │       │   ├── service/
│       │   │       │   │   ├── ScheduleLiveSessionService.java
│       │   │       │   │   ├── RegisterForSessionService.java
│       │   │       │   │   ├── GetUpcomingSessionsService.java
│       │   │       │   │   └── RecordSessionAttendanceService.java
│       │   │       │   │
│       │   │       │   └── dto/
│       │   │       │       ├── command/
│       │   │       │       │   ├── ScheduleSessionCommand.java
│       │   │       │       │   ├── SessionRegistrationCommand.java
│       │   │       │       │   └── AttendanceCommand.java
│       │   │       │       └── query/
│       │   │       │           └── UpcomingSessionsQuery.java
│       │   │       │
│       │   │       ├── core/
│       │   │       │   ├── aggregate/
│       │   │       │   │   └── LiveSession.java
│       │   │       │   │
│       │   │       │   ├── entity/
│       │   │       │   │   └── SessionAttendee.java
│       │   │       │   │
│       │   │       │   ├── valueobject/
│       │   │       │   │   ├── SessionId.java
│       │   │       │   │   ├── AttendeeId.java
│       │   │       │   │   ├── Schedule.java
│       │   │       │   │   ├── SessionLink.java
│       │   │       │   │   ├── MeetingPlatform.java
│       │   │       │   │   └── SessionStatus.java
│       │   │       │   │
│       │   │       │   ├── event/
│       │   │       │   │   ├── LiveSessionScheduled.java
│       │   │       │   │   ├── LiveSessionStarted.java
│       │   │       │   │   └── AttendeeJoined.java
│       │   │       │   │
│       │   │       │   ├── specification/
│       │   │       │   │   └── TraineeCanRegisterForSessionSpecification.java
│       │   │       │   │
│       │   │       │   └── exception/
│       │   │       │       ├── SessionFullException.java
│       │   │       │       └── SessionNotFoundException.java
│       │   │       │
│       │   │       └── config/
│       │   │           └── CommunicationConfiguration.java
│       │   │
│       │   └── resources/
│       │       ├── application-communication.yml
│       │       └── db/
│       │           └── migration/
│       │               └── V006__create_communication_tables.sql
│       │
│       └── test/
│           └── java/
│               └── com/slogbaa/platform/communication/
│                   ├── unit/
│                   └── integration/
│
├── system/                                       # Cross-Cutting Concerns Module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/system/
│       │   │       │
│       │   │       ├── exception/
│       │   │       │   ├── AppException.java
│       │   │       │   ├── ValidationException.java
│       │   │       │   ├── NotFoundException.java
│       │   │       │   ├── UnauthorizedException.java
│       │   │       │   └── DomainException.java
│       │   │       │
│       │   │       ├── shared/
│       │   │       │   ├── domain/
│       │   │       │   │   ├── AggregateRoot.java
│       │   │       │   │   ├── Entity.java
│       │   │       │   │   ├── ValueObject.java
│       │   │       │   │   ├── DomainEvent.java
│       │   │       │   │   └── Specification.java
│       │   │       │   │
│       │   │       │   ├── util/
│       │   │       │   │   ├── DateUtils.java
│       │   │       │   │   ├── StringUtils.java
│       │   │       │   │   ├── ValidationUtils.java
│       │   │       │   │   └── EncryptionUtils.java
│       │   │       │   │
│       │   │       │   └── constant/
│       │   │       │       ├── ErrorMessages.java
│       │   │       │       ├── AppConstants.java
│       │   │       │       └── RegexPatterns.java
│       │   │       │
│       │   │       ├── event/
│       │   │       │   ├── adapter/
│       │   │       │   │   └── EventPublisherAdapter.java
│       │   │       │   ├── port/
│       │   │       │   │   └── EventPublisherPort.java
│       │   │       │   ├── handler/
│       │   │       │   │   ├── TraineeRegisteredHandler.java
│       │   │       │   │   ├── QuizPassedHandler.java
│       │   │       │   │   ├── CertificateIssuedHandler.java
│       │   │       │   │   └── LiveSessionScheduledHandler.java
│       │   │       │   └── bus/
│       │   │       │       └── EventBus.java
│       │   │       │
│       │   │       ├── security/
│       │   │       │   ├── adapter/
│       │   │       │   │   ├── JwtAuthenticationAdapter.java
│       │   │       │   │   └── PasswordHashingAdapter.java
│       │   │       │   ├── port/
│       │   │       │   │   ├── AuthenticationPort.java
│       │   │       │   │   └── PasswordHashingPort.java
│       │   │       │   ├── filter/
│       │   │       │   │   ├── JwtAuthenticationFilter.java
│       │   │       │   │   └── JwtAuthorizationFilter.java
│       │   │       │   └── config/
│       │   │       │       └── SecurityConfiguration.java
│       │   │       │
│       │   │       ├── storage/
│       │   │       │   ├── adapter/
│       │   │       │   │   ├── S3StorageAdapter.java
│       │   │       │   │   ├── AzureBlobStorageAdapter.java
│       │   │       │   │   └── LocalFileStorageAdapter.java
│       │   │       │   ├── port/
│       │   │       │   │   └── FileStoragePort.java
│       │   │       │   ├── valueobject/
│       │   │       │   │   ├── FileUrl.java
│       │   │       │   │   ├── FileName.java
│       │   │       │   │   └── FileSize.java
│       │   │       │   └── exception/
│       │   │       │       ├── FileSizeExceededException.java
│       │   │       │       └── InvalidFileTypeException.java
│       │   │       │
│       │   │       ├── notification/
│       │   │       │   ├── adapter/
│       │   │       │   │   └── EmailNotificationAdapter.java
│       │   │       │   ├── port/
│       │   │       │   │   └── EmailNotificationPort.java
│       │   │       │   └── template/
│       │   │       │       └── EmailTemplateService.java
│       │   │       │
│       │   │       └── validation/
│       │   │           ├── validator/
│       │   │           │   ├── EmailValidator.java
│       │   │           │   └── PhoneNumberValidator.java
│       │   │           └── annotation/
│       │   │               ├── ValidEmail.java
│       │   │               └── ValidPhoneNumber.java
│       │   │
│       │   └── resources/
│       │       ├── application-system.yml
│       │       └── templates/
│       │           ├── email/
│       │           │   ├── welcome.html
│       │           │   ├── certificate.html
│       │           │   ├── quiz-result.html
│       │           │   └── session-reminder.html
│       │           └── pdf/
│       │               └── certificate-template.html
│       │
│       └── test/
│           └── java/
│               └── com/slogbaa/platform/system/
│
├── bootstrap/                                    # Application Bootstrap Module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/slogbaa/platform/
│       │   │       ├── SlogbaaPlatformApplication.java  # Main Spring Boot Application
│       │   │       │
│       │   │       ├── config/
│       │   │       │   ├── WebConfiguration.java
│       │   │       │   ├── CorsConfiguration.java
│       │   │       │   ├── OpenApiConfiguration.java
│       │   │       │   ├── DatabaseConfiguration.java
│       │   │       │   └── AsyncConfiguration.java
│       │   │       │
│       │   │       └── handler/
│       │   │           ├── GlobalExceptionHandler.java
│       │   │           └── LoggingHandler.java
│       │   │
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       ├── application-staging.yml
│       │       ├── application-prod.yml
│       │       ├── logback-spring.xml
│       │       └── banner.txt
│       │
│       └── test/
│           ├── java/
│           │   └── com/slogbaa/platform/
│           │       └── e2e/
│           │           ├── TraineeRegistrationFlowTest.java
│           │           ├── CourseEnrollmentFlowTest.java
│           │           ├── QuizTakingFlowTest.java
│           │           └── CertificateGenerationFlowTest.java
│           │
│           └── resources/
│               └── application-test.yml
│
├── docs/                                         # Documentation
│   ├── architecture/
│   │   ├── domain-model-design.md
│   │   ├── hexagonal-architecture.md
│   │   └── context-maps.md
│   │
│   ├── api/
│   │   ├── openapi.yaml
│   │   └── postman-collection.json
│   │
│   └── deployment/
│       ├── deployment-guide.md
│       └── infrastructure-setup.md
│
└── scripts/                                      # Utility Scripts
    ├── database/
    │   ├── seed-database.sh
    │   └── backup-database.sh
    │
    └── deployment/
        ├── deploy-staging.sh
        └── deploy-production.sh
```

---

## Maven Module Structure

### Root POM.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.slogbaa.platform</groupId>
    <artifactId>nac-slogbaa-platform</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <name>NAC-SLOGBAA Online Learning Platform</name>
    <description>Training and content management platform for 30,000 youth</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.2</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        
        <!-- Dependency Versions -->
        <lombok.version>1.18.30</lombok.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <testcontainers.version>1.19.3</testcontainers.version>
        <springdoc.version>2.3.0</springdoc.version>
    </properties>

    <modules>
        <module>system</module>
        <module>iam</module>
        <module>learning</module>
        <module>assessment</module>
        <module>progress</module>
        <module>website</module>
        <module>communication</module>
        <module>bootstrap</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <!-- Internal Modules -->
            <dependency>
                <groupId>com.slogbaa.platform</groupId>
                <artifactId>system</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.slogbaa.platform</groupId>
                <artifactId>iam</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.slogbaa.platform</groupId>
                <artifactId>learning</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.slogbaa.platform</groupId>
                <artifactId>assessment</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.slogbaa.platform</groupId>
                <artifactId>progress</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.slogbaa.platform</groupId>
                <artifactId>website</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.slogbaa.platform</groupId>
                <artifactId>communication</artifactId>
                <version>${project.version}</version>
            </dependency>

            <!-- Lombok -->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
                <scope>provided</scope>
            </dependency>

            <!-- MapStruct -->
            <dependency>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct</artifactId>
                <version>${mapstruct.version}</version>
            </dependency>

            <!-- TestContainers -->
            <dependency>
                <groupId>org.testcontainers</groupId>
                <artifactId>testcontainers-bom</artifactId>
                <version>${testcontainers.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- SpringDoc OpenAPI -->
            <dependency>
                <groupId>org.springdoc</groupId>
                <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
                <version>${springdoc.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.11.0</version>
                    <configuration>
                        <source>${java.version}</source>
                        <target>${java.version}</target>
                        <annotationProcessorPaths>
                            <path>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                                <version>${lombok.version}</version>
                            </path>
                            <path>
                                <groupId>org.mapstruct</groupId>
                                <artifactId>mapstruct-processor</artifactId>
                                <version>${mapstruct.version}</version>
                            </path>
                        </annotationProcessorPaths>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

### Module POM.xml Example (IAM Module)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.slogbaa.platform</groupId>
        <artifactId>nac-slogbaa-platform</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>iam</artifactId>
    <name>IAM - Identity and Access Management</name>
    <description>User authentication and authorization module</description>

    <dependencies>
        <!-- Internal Dependencies -->
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>system</artifactId>
        </dependency>

        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>postgresql</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### Bootstrap Module POM.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.slogbaa.platform</groupId>
        <artifactId>nac-slogbaa-platform</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>bootstrap</artifactId>
    <name>Bootstrap - Application Entry Point</name>
    <description>Main Spring Boot application module</description>

    <dependencies>
        <!-- All Internal Modules -->
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>system</artifactId>
        </dependency>
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>iam</artifactId>
        </dependency>
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>learning</artifactId>
        </dependency>
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>assessment</artifactId>
        </dependency>
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>progress</artifactId>
        </dependency>
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>website</artifactId>
        </dependency>
        <dependency>
            <groupId>com.slogbaa.platform</groupId>
            <artifactId>communication</artifactId>
        </dependency>

        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- Flyway for Database Migrations -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>

        <!-- SpringDoc OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>com.slogbaa.platform.SlogbaaPlatformApplication</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Domain Breakdown

### IAM Module Structure (Detailed Example)

```
iam/src/main/java/com/slogbaa/platform/iam/
│
├── adapters/
│   ├── persistence/
│   │   ├── entity/
│   │   │   ├── TraineeEntity.java              # JPA Entity
│   │   │   │   @Entity
│   │   │   │   @Table(name = "trainees")
│   │   │   │   - id, email, passwordHash, etc.
│   │   │   │
│   │   │   ├── ProfileEntity.java
│   │   │   │   @Embeddable (embedded in TraineeEntity)
│   │   │   │   - fullName, gender, district, etc.
│   │   │   │
│   │   │   └── StaffUserEntity.java
│   │   │       @Entity
│   │   │       @Table(name = "staff_users")
│   │   │
│   │   ├── repository/
│   │   │   ├── JpaTraineeRepository.java       # Spring Data JPA Repository
│   │   │   │   extends JpaRepository<TraineeEntity, UUID>
│   │   │   │   - findByEmail()
│   │   │   │   - existsByEmail()
│   │   │   │
│   │   │   └── JpaStaffUserRepository.java
│   │   │       extends JpaRepository<StaffUserEntity, UUID>
│   │   │
│   │   ├── adapter/
│   │   │   ├── TraineeRepositoryAdapter.java   # Implements TraineeRepositoryPort
│   │   │   │   @Component
│   │   │   │   - Uses JpaTraineeRepository
│   │   │   │   - Uses TraineeEntityMapper
│   │   │   │   - Translates between Domain and JPA entities
│   │   │   │
│   │   │   └── StaffUserRepositoryAdapter.java
│   │   │       Implements StaffUserRepositoryPort
│   │   │
│   │   └── mapper/
│   │       ├── TraineeEntityMapper.java        # MapStruct Mapper
│   │       │   @Mapper(componentModel = "spring")
│   │       │   - toDomain(TraineeEntity): Trainee
│   │       │   - toEntity(Trainee): TraineeEntity
│   │       │
│   │       └── StaffUserEntityMapper.java
│   │
│   ├── rest/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   │   @RestController
│   │   │   │   @RequestMapping("/api/auth")
│   │   │   │   - POST /register
│   │   │   │   - POST /login
│   │   │   │   - POST /refresh
│   │   │   │
│   │   │   ├── TraineeController.java
│   │   │   │   @RestController
│   │   │   │   @RequestMapping("/api/trainees")
│   │   │   │   - GET /{id}
│   │   │   │   - PUT /{id}
│   │   │   │   - GET / (with filters)
│   │   │   │
│   │   │   └── StaffController.java
│   │   │       @RestController
│   │   │       @RequestMapping("/api/staff")
│   │   │
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   ├── RegisterTraineeRequest.java
│   │   │   │   │   - email, password, fullName, etc.
│   │   │   │   │   - @Valid annotations
│   │   │   │   │
│   │   │   │   ├── LoginRequest.java
│   │   │   │   │   - email, password
│   │   │   │   │
│   │   │   │   └── UpdateProfileRequest.java
│   │   │   │
│   │   │   └── response/
│   │   │       ├── TraineeResponse.java
│   │   │       │   - id, email, fullName, profile data
│   │   │       │
│   │   │       ├── AuthResponse.java
│   │   │       │   - accessToken, refreshToken, expiresIn
│   │   │       │
│   │   │       └── StaffResponse.java
│   │   │
│   │   └── mapper/
│   │       └── TraineeDtoMapper.java           # MapStruct Mapper
│   │           @Mapper(componentModel = "spring")
│   │           - toResponse(Trainee): TraineeResponse
│   │           - toCommand(RegisterTraineeRequest): RegisterTraineeCommand
│   │
│   └── security/
│       ├── JwtAuthenticationAdapter.java       # Implements AuthenticationPort
│       │   @Component
│       │   - Uses JwtTokenProvider
│       │
│       ├── JwtTokenProvider.java
│       │   - generateToken()
│       │   - validateToken()
│       │   - getUserIdFromToken()
│       │
│       └── PasswordEncoderAdapter.java
│           @Component
│           - Uses BCryptPasswordEncoder
│
├── application/
│   ├── port/
│   │   ├── in/
│   │   │   ├── RegisterTraineeUseCase.java     # Interface
│   │   │   │   TraineeId execute(RegisterTraineeCommand command);
│   │   │   │
│   │   │   ├── AuthenticateUserUseCase.java
│   │   │   │   AuthenticationResult execute(AuthenticationCommand command);
│   │   │   │
│   │   │   ├── UpdateTraineeProfileUseCase.java
│   │   │   ├── GetTraineeByIdUseCase.java
│   │   │   └── FilterTraineesUseCase.java
│   │   │
│   │   └── out/
│   │       ├── TraineeRepositoryPort.java      # Interface
│   │       │   void save(Trainee trainee);
│   │       │   Optional<Trainee> findById(TraineeId id);
│   │       │   Optional<Trainee> findByEmail(Email email);
│   │       │   List<Trainee> findByFilters(TraineeFilters filters);
│   │       │
│   │       ├── StaffUserRepositoryPort.java
│   │       ├── AuthenticationPort.java
│   │       └── EmailNotificationPort.java
│   │
│   ├── service/
│   │   ├── RegisterTraineeService.java         # Implements RegisterTraineeUseCase
│   │   │   @Service
│   │   │   @Transactional
│   │   │   - Injects TraineeRepositoryPort
│   │   │   - Injects EventPublisherPort
│   │   │   - Creates Trainee aggregate
│   │   │   - Saves to repository
│   │   │   - Publishes TraineeRegistered event
│   │   │
│   │   ├── AuthenticateUserService.java
│   │   │   @Service
│   │   │   - Validates credentials
│   │   │   - Generates JWT token
│   │   │
│   │   ├── UpdateTraineeProfileService.java
│   │   ├── GetTraineeByIdService.java
│   │   └── FilterTraineesService.java
│   │
│   └── dto/
│       ├── command/
│       │   ├── RegisterTraineeCommand.java     # Immutable DTO
│       │   │   record RegisterTraineeCommand(
│       │   │       String email,
│       │   │       String password,
│       │   │       String firstName,
│       │   │       String lastName,
│       │   │       String gender,
│       │   │       String district,
│       │   │       String category
│       │   │   ) {}
│       │   │
│       │   ├── AuthenticationCommand.java
│       │   └── UpdateProfileCommand.java
│       │
│       ├── query/
│       │   ├── TraineeQuery.java
│       │   └── TraineeFilters.java
│       │
│       └── result/
│           ├── AuthenticationResult.java
│           │   record AuthenticationResult(
│           │       String accessToken,
│           │       String refreshToken,
│           │       Long expiresIn
│           │   ) {}
│           │
│           ├── TraineeDetails.java
│           └── TraineeSummary.java
│
├── core/
│   ├── aggregate/
│   │   ├── Trainee.java                        # Aggregate Root
│   │   │   public class Trainee extends AggregateRoot<TraineeId> {
│   │   │       private TraineeId id;
│   │   │       private Email email;
│   │   │       private String passwordHash;
│   │   │       private Profile profile;
│   │   │       private boolean isActive;
│   │   │       
│   │   │       // Factory method
│   │   │       public static Trainee register(...) {
│   │   │           Trainee trainee = new Trainee(...);
│   │   │           trainee.addDomainEvent(new TraineeRegistered(...));
│   │   │           return trainee;
│   │   │       }
│   │   │       
│   │   │       // Business methods
│   │   │       public void updateProfile(Profile newProfile) { ... }
│   │   │       public void deactivate() { ... }
│   │   │   }
│   │   │
│   │   └── StaffUser.java
│   │       public class StaffUser extends AggregateRoot<StaffUserId> { ... }
│   │
│   ├── entity/
│   │   └── Profile.java                        # Entity within Trainee
│   │       public class Profile extends Entity<UUID> {
│   │           private FullName fullName;
│   │           private ContactInfo contactInfo;
│   │           private Gender gender;
│   │           private District district;
│   │           private TraineeCategory category;
│   │       }
│   │
│   ├── valueobject/
│   │   ├── TraineeId.java                      # Value Object
│   │   │   public record TraineeId(UUID value) {
│   │   │       public static TraineeId generate() {
│   │   │           return new TraineeId(UUID.randomUUID());
│   │   │       }
│   │   │   }
│   │   │
│   │   ├── Email.java
│   │   │   public record Email(String value) {
│   │   │       public Email {
│   │   │           if (!isValid(value)) {
│   │   │               throw new IllegalArgumentException("Invalid email");
│   │   │           }
│   │   │       }
│   │   │       private static boolean isValid(String email) { ... }
│   │   │   }
│   │   │
│   │   ├── FullName.java
│   │   │   public record FullName(String firstName, String lastName) { ... }
│   │   │
│   │   ├── ContactInfo.java
│   │   │   public record ContactInfo(Email email, PhysicalAddress address) { ... }
│   │   │
│   │   ├── Gender.java
│   │   │   public enum Gender { MALE, FEMALE }
│   │   │
│   │   ├── District.java
│   │   │   public record District(String name, String region) { ... }
│   │   │
│   │   ├── PhysicalAddress.java
│   │   ├── TraineeCategory.java
│   │   │   public enum TraineeCategory { LEADER, CIVIL_SOCIETY_MEMBER, COMMUNITY_MEMBER }
│   │   │
│   │   └── StaffRole.java
│   │       public enum StaffRole { SUPER_ADMIN, ADMIN }
│   │
│   ├── event/
│   │   ├── TraineeRegistered.java              # Domain Event
│   │   │   public record TraineeRegistered(
│   │   │       TraineeId traineeId,
│   │   │       Email email,
│   │   │       LocalDateTime occurredAt
│   │   │   ) implements DomainEvent { ... }
│   │   │
│   │   ├── TraineeProfileUpdated.java
│   │   └── StaffUserCreated.java
│   │
│   ├── specification/
│   │   ├── TraineeCanEnrollSpecification.java  # Business Rule
│   │   │   public class TraineeCanEnrollSpecification implements Specification<Trainee> {
│   │   │       public boolean isSatisfiedBy(Trainee trainee) {
│   │   │           return trainee.isActive() && trainee.hasCompletedProfile();
│   │   │       }
│   │   │   }
│   │   │
│   │   └── StaffCanManageContentSpecification.java
│   │
│   └── exception/
│       ├── DuplicateEmailException.java        # Domain Exception
│       │   public class DuplicateEmailException extends DomainException {
│       │       public DuplicateEmailException(Email email) {
│       │           super("Email already exists: " + email.value());
│       │       }
│       │   }
│       │
│       ├── InvalidTraineeCategoryException.java
│       └── UnauthorizedAccessException.java
│
└── config/
    ├── IamConfiguration.java                   # Module Configuration
    │   @Configuration
    │   - Bean definitions
    │
    └── IamSecurityConfiguration.java
        @Configuration
        - Security-specific configuration
```

---

## Shared Components

### System Module Structure

```
system/src/main/java/com/slogbaa/platform/system/
│
├── exception/
│   ├── AppException.java                       # Base Application Exception
│   │   public abstract class AppException extends RuntimeException { ... }
│   │
│   ├── ValidationException.java
│   ├── NotFoundException.java
│   ├── UnauthorizedException.java
│   └── DomainException.java                    # Base Domain Exception
│
├── shared/
│   ├── domain/
│   │   ├── AggregateRoot.java                  # Base Aggregate Root
│   │   │   public abstract class AggregateRoot<ID> extends Entity<ID> {
│   │   │       private final List<DomainEvent> domainEvents = new ArrayList<>();
│   │   │       
│   │   │       protected void addDomainEvent(DomainEvent event) {
│   │   │           domainEvents.add(event);
│   │   │       }
│   │   │       
│   │   │       public List<DomainEvent> getDomainEvents() {
│   │   │           return Collections.unmodifiableList(domainEvents);
│   │   │       }
│   │   │       
│   │   │       public void clearDomainEvents() {
│   │   │           domainEvents.clear();
│   │   │       }
│   │   │   }
│   │   │
│   │   ├── Entity.java                         # Base Entity
│   │   │   public abstract class Entity<ID> {
│   │   │       protected ID id;
│   │   │       
│   │   │       @Override
│   │   │       public boolean equals(Object o) {
│   │   │           // Compare by ID
│   │   │       }
│   │   │       
│   │   │       @Override
│   │   │       public int hashCode() {
│   │   │           return Objects.hash(id);
│   │   │       }
│   │   │   }
│   │   │
│   │   ├── ValueObject.java                    # Base Value Object
│   │   │   public interface ValueObject {
│   │   │       // Marker interface
│   │   │       // Value objects should use records or override equals/hashCode
│   │   │   }
│   │   │
│   │   ├── DomainEvent.java                    # Base Domain Event
│   │   │   public interface DomainEvent {
│   │   │       UUID getEventId();
│   │   │       LocalDateTime getOccurredAt();
│   │   │   }
│   │   │
│   │   └── Specification.java                  # Specification Pattern
│   │       public interface Specification<T> {
│   │           boolean isSatisfiedBy(T candidate);
│   │       }
│   │
│   ├── util/
│   │   ├── DateUtils.java
│   │   ├── StringUtils.java
│   │   ├── ValidationUtils.java
│   │   └── EncryptionUtils.java
│   │
│   └── constant/
│       ├── ErrorMessages.java
│       ├── AppConstants.java
│       └── RegexPatterns.java
│
├── event/
│   ├── adapter/
│   │   └── EventPublisherAdapter.java          # Spring Event Publisher
│   │       @Component
│   │       public class EventPublisherAdapter implements EventPublisherPort {
│   │           private final ApplicationEventPublisher publisher;
│   │           
│   │           public void publish(DomainEvent event) {
│   │               publisher.publishEvent(event);
│   │           }
│   │       }
│   │
│   ├── port/
│   │   └── EventPublisherPort.java
│   │       public interface EventPublisherPort {
│   │           void publish(DomainEvent event);
│   │           void publishAll(List<DomainEvent> events);
│   │       }
│   │
│   ├── handler/
│   │   ├── TraineeRegisteredHandler.java       # Event Handler
│   │   │   @Component
│   │   │   public class TraineeRegisteredHandler {
│   │   │       @EventListener
│   │   │       public void handle(TraineeRegistered event) {
│   │   │           // Send welcome email
│   │   │       }
│   │   │   }
│   │   │
│   │   ├── QuizPassedHandler.java
│   │   ├── CertificateIssuedHandler.java
│   │   └── LiveSessionScheduledHandler.java
│   │
│   └── bus/
│       └── EventBus.java
│
├── security/
│   ├── adapter/
│   │   ├── JwtAuthenticationAdapter.java
│   │   └── 