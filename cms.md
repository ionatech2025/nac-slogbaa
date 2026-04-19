# CMS & Content Requirements for SLOGBAA

This document outlines the content sections and data structures required for the SLOGBAA platform CMS. These requirements will guide the backend implementation and API design.

## 1. Homepage Hero Carousel
**Endpoint:** `/api/cms/homepage/hero`
| Field | Type | Description |
| :--- | :--- | :--- |
| `eyebrow` | String | Small text above headline (e.g., "LEARN YOUR WAY") |
| `title` | String | Main headline text |
| `highlight` | String | Highlighted word/phrase (renders in DM Serif Display) |
| `subtitle` | String | Longer descriptive sub-headline |
| `image_url` | URL | Background image for the slide |
| `order` | Integer | Sequence of the slide |

## 2. Platform Features
**Endpoint:** `/api/cms/homepage/features`
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Feature name |
| `description` | String | Explanation |
| `icon` | String | Slug for the icon component (e.g., "learning", "library") |

## 3. In-Person Training
**Endpoint:** `/api/cms/trainings` (Supports `?status=upcoming|past`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Name of the training session |
| `eyebrow` | String | Editorial category label (e.g., "Specialized Workshop") |
| `slug` | String | URL-friendly identifier for detail pages |
| `date` | DateTime | When the training starts |
| `location` | String | Physical venue or district name |
| `image_url` | URL | Featured high-resolution editorial image |
| `excerpt` | Text | Short 2-3 sentence summary for cards/modals |
| `thumbnail_url` | URL | Optimized image for the listing grid |
| `status` | Enum | `upcoming` (shows in top section) or `past` (archives) |
| `facilitators` | Array | List of lead facilitator names |
| `tags` | Array | Category tags (e.g., "Governance", "Advocacy") |

### Editorial Content (For Detail Pages)
The `content` field should ideally be a structured JSON array of blocks to support the brochure-style layout:
| Block Type | Fields | Description |
| :--- | :--- | :--- |
| `h2` | `value` | Section heading (renders in DM Serif Display) |
| `p` | `value` | Body paragraph |
| `quote` | `text`, `author` | Pull quote with attribution |

### Logistics & Sidebar
| Field | Type | Description |
| :--- | :--- | :--- |
| `duration` | String | e.g., "6 Hours (Intensive)" |
| `requirements`| String | e.g., "Basic Governance Module (L1)" |
| `materials` | String | e.g., "Printed Syllabus, Digital Toolkit" |


---
## 4. Impact Stories
**Endpoint:** `/api/cms/stories`  
*Supports both global listing and slug-based detail fetching.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Story headline |
| `meta` | String | Author/subject attribution (e.g., "Jane Doe — Lead Advocate") |
| `slug` | String | URL identifier for routing |
| `tag` | String | Category label (e.g., "Youth Engagement") |
| `image_url` | URL | Featured editorial image |
| `preview` | Text | 2-3 sentence summary for grid cards |
| `content` | HTML/Text | Rich content for the specialized detail page |

## 5. News & Updates
**Endpoint:** `/api/cms/news`

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | news/event headline |
| `slug` | String | URL identifier |
| `date` | String/Date | Display date (e.g., "June 15, 2024") |
| `tag` | Enum | `News & Updates` or `Events` |
| `image_url` | URL | High-quality card image |
| `summary` | Text | Brief snippet for the archive view |
| `content` | HTML/Text | Magazine-style layout content for detail pages |

## 6. Public Library (Resource Portal)
**Endpoint:** `/api/cms/library`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique resource identifier |
| `title` | String | Document/Resource name |
| `tag` | String | Type label (e.g., "Policy Guide", "Manual") |
| `image_url` | URL | High-contrast cover preview |
| `desc` | Text | Short card description |
| `full_desc` | Text | Detailed explanation for the resource modal |
| `download_url`| URL | Secure link to the PDF or document |
| `category` | String | Grouping for filtering (e.g., "Governance") |

## 7. Partner Logos (Scrolling Marquee)
**Endpoint:** `/api/cms/partners`

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Organization name |
| `logo_url` | URL | High-clarity PNG/SVG logo |
| `website_url`| URL | Official destination for external links |
| `order` | Integer | Sequence for the marquee track |

## 8. Video Content
**Endpoint:** `/api/cms/videos`

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Video description |
| `youtubeUrl` | URL | YouTube watch URL |
| `category` | String | e.g., "Leadership Basics" |
| `order` | Integer | Position in the gallery |

---
**Note:** All CMS endpoints should return structured JSON that matches these fields to ensure frontend compatibility. Assets (images/PDFs) should be served via CDNs or optimized storage buckets.
