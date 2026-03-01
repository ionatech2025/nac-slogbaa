# Content Block Lifecycle

This document traces the full flow from when a super admin adds a content block (UI or Postman) to when a trainee views the module and its content blocks. It also explains why content may not appear in the database and how to fix it.

---

## 1. Super Admin Adds Content Block (UI)

### Route
`/admin/learning/:courseId/modules/:moduleId` → **AdminModuleEditorPage**

### Flow

1. **Navigation:** Admin clicks a module card on AdminCoursePage → navigates to AdminModuleEditorPage.
2. **Load:** `getAdminCourseDetails(token, courseId)` → GET `/api/admin/courses/:id`
   - Backend: `AdminCourseController.getCourseDetails` → `GetAdminCourseDetailsUseCase` → `CourseDetailsQueryAdapter.findCourseDetailsByIdForAdmin`
   - Reads from DB: `course` → `module` (by `module_order`) → `content_block` (by `block_order`) via `JpaContentBlockRepository.findByModuleIdOrderByBlockOrder`
3. **Editor:** `ModuleEditorJs` mounts with `initialData` = first content block's `richText` (or `null` if no blocks).
   - Editor.js creates paragraph, header, list, image, embed tools.
   - User adds blocks (paragraphs, headings, etc.) in the editor.
4. **Save (critical step):** User must click **"Save content"**.
   - `handleSaveContent` → `editorJsRef.current.save()` → Editor.js returns output JSON.
   - `handleEditorSave(JSON.stringify(output))` is called.
5. **API call:**
   - If no existing block: `addContentBlock(token, courseId, moduleId, { blockType: 'TEXT', blockOrder: 0, richText: editorJsJson })`
   - If block exists: `updateContentBlock(token, courseId, moduleId, blockId, { ... })`
6. **Backend:** POST `/api/admin/courses/:courseId/modules/:moduleId/blocks`
   - `AdminCourseController.addContentBlock` → `AddContentBlockToModuleUseCase` → `AddContentBlockToModuleService` (with `@Transactional`)
   - `CourseWriteAdapter.addContentBlock` → creates `ContentBlockEntity`, sets `rich_text` = Editor.js JSON, saves via `JpaContentBlockRepository.save`
7. **Refresh:** `refresh()` re-fetches course details; the new/updated block is now in `module.contentBlocks`.

### Why content may not appear in the DB (UI)

- **Most common:** The user adds blocks in Editor.js but **does not click "Save content"**. Editor.js does not auto-save; the button must be clicked to persist.
- Network/401 errors during save.
- Validation errors (e.g. invalid blockType, missing fields) causing 400.

---

## 2. Super Admin Adds Content Block (Postman)

### Request
```
POST http://localhost:8080/api/admin/courses/{courseId}/modules/{moduleId}/blocks
Authorization: Bearer <token>
Content-Type: application/json

{
  "blockType": "TEXT",
  "blockOrder": 0,
  "richText": "{\"time\":1234567890,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"Hello world\"}}]}"
}
```

### Flow
- Same backend path as UI: `AdminCourseController.addContentBlock` → `AddContentBlockToModuleService` → `CourseWriteAdapter.addContentBlock` → `jpaContentBlockRepository.save`.
- `blockOrder` is optional (defaults to 0 if omitted).

---

## 3. Database Storage

### Table: `content_block`
| Column              | Purpose                                              |
|---------------------|------------------------------------------------------|
| id                  | UUID                                                 |
| module_id           | FK to module                                         |
| block_type          | TEXT, IMAGE, VIDEO, ACTIVITY                         |
| block_order         | Order within module                                  |
| rich_text           | Editor.js JSON (for TEXT) or HTML                    |
| image_url, ...      | Used when block_type = IMAGE, VIDEO, ACTIVITY        |

### Editor.js model (AdminModuleEditorPage)
- One **TEXT** content block per module holds the full Editor.js JSON.
- Editor.js blocks (paragraph, header, list, image, embed) are inside that JSON, not separate DB rows.

---

## 4. Trainee Views Module and Content Blocks

### Route
`/dashboard/courses/:courseId` and `/dashboard/courses/:courseId/modules/:moduleId` → **CourseDetailPage**

### Flow

1. **Load:** `getCourseDetails(token, courseId)` → GET `/api/courses/:id`
   - Backend: `CourseController.getCourseDetails` → `GetCourseDetailsUseCase` → `CourseDetailsQueryPort.findCourseDetailsById`
   - **Filter:** Only **published** courses: `.filter(CourseEntity::isPublished)`
2. **Enrollment:** `checkEnrollment(token, courseId)` → trainee must be enrolled to see content.
3. **Rendering:** For each `contentBlock` in `selectedModule.contentBlocks`:
   - `ContentBlockRenderer` checks `blockType`.
   - For `TEXT` with Editor.js JSON: `EditorJsReadOnly` parses `richText`, renders paragraphs, headers, lists, images, embeds.
   - For IMAGE, VIDEO, ACTIVITY: renders the relevant fields.

### Why trainees may not see content

1. **Course not published** – Trainees only see published courses. Publish via Admin UI or API.
2. **Not enrolled** – Trainee must enroll in the course.
3. **Content not saved** – Admin added blocks but did not click "Save content".

---

## 5. End-to-End Lifecycle Diagram

```
[Admin UI: AdminModuleEditorPage]
        │
        │ 1. Load course/modules/blocks
        ▼
GET /api/admin/courses/:id  ──►  CourseDetailsQueryAdapter.findCourseDetailsByIdForAdmin
        │                           └─► JpaContentBlockRepository.findByModuleIdOrderByBlockOrder
        │
        │ 2. User edits in Editor.js, clicks "Save content"
        ▼
POST /api/admin/courses/:id/modules/:moduleId/blocks  (add)
PUT  /api/admin/courses/:id/modules/:moduleId/blocks/:blockId  (update)
        │
        ▼
AddContentBlockToModuleService (@Transactional)
        │
        ▼
CourseWriteAdapter.addContentBlock
        │
        ▼
JpaContentBlockRepository.save  ──►  content_block table
        │
        │ 3. Admin publishes course
        ▼
POST /api/admin/courses/:id/publish  ──►  course.is_published = true
        │
        │ 4. Trainee enrolls
        ▼
POST /api/courses/:id/enroll
        │
        │ 5. Trainee views module
        ▼
GET /api/courses/:id  ──►  findCourseDetailsById (published only)
        │
        ▼
[CourseDetailPage] ContentBlockRenderer + EditorJsReadOnly
```

---

## 6. Concepts Used

### Spring Boot / Backend
| Concept | Where |
|---------|-------|
| `@Transactional` | `AddContentBlockToModuleService` – ensures persistence in a single transaction |
| JPA Repository | `JpaContentBlockRepository.save`, `findByModuleIdOrderByBlockOrder` |
| Use case / port | `AddContentBlockToModuleUseCase`, `CourseWritePort` |
| DTO / Request | `AddContentBlockRequest` – validates blockType, blockOrder; blockOrder defaults to 0 |
| REST controller | `AdminCourseController.addContentBlock`, `CourseController.getCourseDetails` |
| Published filter | `CourseDetailsQueryAdapter.findCourseDetailsById` – `.filter(CourseEntity::isPublished)` |

### React / Vite
| Concept | Where |
|---------|-------|
| `useParams` | `AdminModuleEditorPage` – `courseId`, `moduleId` |
| `useOutletContext` | `AdminModuleEditorPage` – `token`, `isSuperAdmin` |
| `useRef` + `useImperativeHandle` | `ModuleEditorJs` – exposes `save()` to parent |
| Dynamic import | `ModuleEditorJs` – `import('@editorjs/editorjs')` for code splitting |
| Key for remount | `ModuleEditorJs key={moduleId}` – fresh instance per module |

### Data model
| Concept | Description |
|---------|-------------|
| Editor.js JSON | Stored in `content_block.rich_text`; structure `{ time, blocks: [{ type, data }] }` |
| Block types | TEXT (Editor.js), IMAGE, VIDEO, ACTIVITY |
| Single block per module (Editor.js) | AdminModuleEditorPage uses one TEXT block for the full Editor.js document |

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Content not in DB | "Save content" not clicked | Click **Save content** after editing in the module editor |
| Trainee sees "No content" | Course not published | Publish the course in Admin |
| Trainee sees "Enroll" gate | Not enrolled | Enroll in the course |
| 400 on add block | Missing blockOrder / blockType | Send `blockOrder: 0` and `blockType: "TEXT"` in JSON |
| 401 on add block | Invalid/expired token | Re-login and use a fresh token |
