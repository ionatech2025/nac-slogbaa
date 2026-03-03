# File Handling Implementation Plan

**SLOGBAA Learning Platform**  
**Version:** 1.0  
**Date:** March 3, 2026

## Overview

This document defines a step-wise implementation plan for a **reusable, database-efficient file handling system** to support:

1. **Course and Module images** — Superadmin attaches images when creating/editing; images display on cards in the UI.
2. **Future use cases** — Library resources (document uploads), Assessment module (e.g. certificates, question images), and other modules.

### Design Principles

- **Not database expensive:** Store only the **file path/URL** in the database (VARCHAR), never binary content (BLOB).
- **Efficient:** Files are stored on filesystem or object storage; served directly or via CDN.
- **Reusable:** A shared `FileStoragePort` and adapter(s) used by learning, library, assessment, and other modules.
- **Environment-flexible:** Local filesystem for development; S3/Azure Blob for production (future).

---

## Architecture

### Storage Strategy

| Aspect | Approach |
|--------|----------|
| **Storage** | Files on disk or object storage (S3/Azure) |
| **DB column** | `image_url` / `file_url` VARCHAR(2048) storing relative path or full URL |
| **Serving** | Spring `ResourceHandler` maps `/uploads/*` → local folder, or CDN URL in prod |
| **Port** | `FileStoragePort` in `shared-ports` (or infrastructure) |
| **Adapter** | `LocalFileStorageAdapter` (default); future `S3StorageAdapter` |

### Flow

1. Client uploads file via `multipart/form-data` to `POST /api/files/upload`.
2. Server validates (type, size), stores file, returns `{ "url": "/uploads/courses/abc123.jpg" }`.
3. Client includes this URL when creating/updating course or module.
4. UI renders images from the returned URL.

---

## Step-wise Implementation

### Phase 0: Document and Planning (Done)

- [x] Create this implementation document.

---

### Phase 1: Shared File Storage Port and Local Adapter

**Goal:** Define the port interface and implement a local filesystem adapter.

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 1.1 | Add `FileStoragePort` interface in `shared-ports` | `shared-ports/.../FileStoragePort.java` |
| 1.2 | Add `FileUploadResult` value object (url, size, contentType) | `shared-ports/.../FileUploadResult.java` |
| 1.3 | Add `LocalFileStorageAdapter` in `infrastructure` | `infrastructure/.../LocalFileStorageAdapter.java` |
| 1.4 | Add `app.file.upload-dir` and `app.file.max-size` config | `application.properties` |
| 1.5 | Register bean and configure static resource mapping for `/uploads/*` | `app/.../WebConfiguration.java` or similar |

**Port interface (conceptual):**
```java
public interface FileStoragePort {
    FileUploadResult store(MultipartFile file, String subdir) throws FileStorageException;
    void delete(String url) throws FileStorageException;  // optional for now
}
```

---

### Phase 2: File Upload REST Endpoint

**Goal:** Expose a generic upload endpoint usable by any module.

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 2.1 | Create `FileUploadController` | `infrastructure/.../FileUploadController.java` or in `app` |
| 2.2 | Add `POST /api/files/upload` accepting `multipart/form-data` | Same controller |
| 2.3 | Add validation (allowed types: image/*, application/pdf, etc.; max size) | Controller + config |
| 2.4 | Return `{ url, size, contentType }` on success | Response DTO |
| 2.5 | Secure endpoint for SUPER_ADMIN/ADMIN only | Security config |

---

### Phase 3: Database Schema Changes for Course and Module Images

**Goal:** Add image columns to course and module tables.

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 3.1 | Add Flyway migration `image_url VARCHAR(2048)` to `course` | `V12__add_course_module_image_url.sql` |
| 3.2 | Add `image_url VARCHAR(2048)` to `module` | Same migration |

---

### Phase 4: Domain and Persistence for Course Image

**Goal:** Wire image support into course aggregate and persistence.

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 4.1 | Add `imageUrl` to `Course` aggregate | `learning/.../aggregate/Course.java` |
| 4.2 | Add `imageUrl` to `CourseEntity` | `learning/.../entity/CourseEntity.java` |
| 4.3 | Add `imageUrl` to `CreateCourseCommand` and `UpdateCourseCommand` | `learning/.../dto/command/` |
| 4.4 | Add `imageUrl` to `CreateCourseRequest` and `UpdateCourseRequest` | `learning/.../dto/request/` |
| 4.5 | Add `imageUrl` to `AdminCourseSummaryResponse`, `CourseDetailsResponse`, `CourseSummary` | Response DTOs, result DTOs |
| 4.6 | Update mappers and service to pass `imageUrl` | Entity mapper, CreateCourseService, UpdateCourseService |
| 4.7 | Update `AdminCourseController` create/update to accept `imageUrl` in body | Controller |

---

### Phase 5: Domain and Persistence for Module Image

**Goal:** Wire image support into module aggregate and persistence.

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 5.1 | Add `imageUrl` to `Module` entity | `learning/.../entity/Module.java` |
| 5.2 | Add `imageUrl` to `ModuleEntity` | `learning/.../entity/ModuleEntity.java` |
| 5.3 | Add `imageUrl` to `AddModuleCommand`, `UpdateModuleCommand` | Command DTOs |
| 5.4 | Add `imageUrl` to `AddModuleRequest`, `UpdateModuleRequest` | Request DTOs |
| 5.5 | Add `imageUrl` to `ModuleSummaryResponse`, `ModuleSummary` | Response/result DTOs |
| 5.6 | Update mappers and services | Entity mapper, AddModuleService, UpdateModuleService |
| 5.7 | Update `AdminCourseController` add/update module to pass `imageUrl` | Controller |

---

### Phase 6: Frontend — Upload Utility and Create/Edit Forms

**Goal:** Superadmin can attach images when creating/editing courses and modules.

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 6.1 | Add `uploadFile(token, file, subdir)` in `frontend/src/api/files.js` | New API module |
| 6.2 | Add image upload field to `CreateCourseModal` (optional file input) | `CreateCourseModal.jsx` |
| 6.3 | Add image upload field to `EditCourseModal` | `EditCourseModal.jsx` |
| 6.4 | Add image upload field to `AddModuleModal` | `AddModuleModal.jsx` |
| 6.5 | Add image field to module edit (if modal exists) or inline edit | Module edit UI |
| 6.6 | Wire form submit: upload file first, then include returned URL in create/update payload | Modals |

---

### Phase 7: Frontend — Display Images on Cards

**Goal:** Course and module cards show their images in the UI.

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 7.1 | Add image to course row/card in `AdminLearningPage` (if applicable) | `AdminLearningPage.jsx` |
| 7.2 | Add image to module cards in `AdminCoursePage` | `AdminCoursePage.jsx` |
| 7.3 | Add course image to trainee-facing course cards (e.g. dashboard/courses list) | Learning pages |
| 7.4 | Add module image to module list/sidebar in `CourseDetailPage` (optional) | `CourseDetailPage.jsx` |
| 7.5 | Add placeholder/fallback when no image | Shared component or inline style |

---

### Phase 8: (Future) Library Resource and Assessment Integration

**Goal:** Reuse the same file handling for library documents and assessment assets.

| Step | Task | Notes |
|------|------|-------|
| 8.1 | Replace manual file URL input in `AdminLibraryPage` with real file upload | Use `uploadFile` + `courses` subdir or `library` subdir |
| 8.2 | When Assessment module is implemented, use `FileStoragePort` for certificate assets, question images, etc. | Same port, possibly new subdirs |

---

## Configuration Summary

```properties
# application.properties
app.file.upload-dir=${FILE_UPLOAD_DIR:uploads}
app.file.max-size-bytes=5242880
app.file.allowed-image-types=image/jpeg,image/png,image/gif,image/webp
app.file.allowed-document-types=application/pdf
```

---

## Subdirectory Convention

| Subdir | Use Case |
|--------|----------|
| `courses` | Course and module images |
| `library` | Library resource documents (future) |
| `assessment` | Assessment assets (future) |
| `profile` | Profile images (future) |

---

## Security and Validation

- **Allowed types:** Restrict to `image/jpeg`, `image/png`, `image/gif`, `image/webp` for images; extend for documents later.
- **Max file size:** e.g. 5MB for images.
- **File names:** Use UUID + original extension to avoid collisions and path traversal.
- **Authorization:** Upload endpoint and create/update endpoints require SUPER_ADMIN or ADMIN.

---

## Order of Execution

1. **Phase 1** — Shared port + local adapter
2. **Phase 2** — Upload REST endpoint
3. **Phase 3** — DB migration
4. **Phase 4** — Course image (backend)
5. **Phase 5** — Module image (backend)
6. **Phase 6** — Frontend forms with upload
7. **Phase 7** — Display images on cards
8. **Phase 8** — (Later) Library and assessment

---

## Checklist for Course and Module Image (Phases 1–7)

- [x] Phase 1: FileStoragePort + LocalFileStorageAdapter + config + static mapping
- [x] Phase 2: POST /api/files/upload
- [ ] Phase 3: Migration V12
- [ ] Phase 4: Course image (domain, entity, commands, requests, responses, controller)
- [ ] Phase 5: Module image (domain, entity, commands, requests, responses, controller)
- [ ] Phase 6: Frontend upload + create/edit forms
- [ ] Phase 7: Display images on cards
