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


## 4. Impact Stories / Testimonials
**Endpoint:** `/api/cms/stories`
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Person name |
| `role` | String | Designation/Organization |
| `content` | Text | The testimonial text |
| `initials` | String | Fallback avatar text (2 chars) |
| `tag` | String | Category tag (e.g., "Student", "Facilitator") |

## 5. News & Updates
**Endpoint:** `/api/cms/news`
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | News headline |
| `date` | Date | Publication date |
| `excerpt` | Text | Brief snippet |
| `image_url` | URL | Thumbnail |
| `slug` | String | Link identifier |

## 6. Public Library (External Resources)
**Endpoint:** `/api/cms/library`
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Document/Folder name |
| `type` | Enum | `pdf`, `folder`, `link` |
| `url` | URL | Destination |
| `description` | Text | Short description |

---
**Note:** All CMS endpoints should return structured JSON that matches these fields to ensure frontend compatibility.
