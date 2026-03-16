# SLOGBAA Design System — Component API Reference

All 23 shared components live in `frontend/src/shared/components/`.

---

## Button

```jsx
import { Button } from '@/shared/components/Button.jsx'
<Button variant="primary" size="md" onClick={handleClick}>Save</Button>
```

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | `'primary'` | `'primary'` (blue), `'secondary'` (border), `'danger'` (red), `'ghost'`, `'accent'` (green), `'warm'` (amber) |
| `size` | string | `'md'` | `'sm'`, `'md'`, `'lg'` |
| `disabled` | boolean | `false` | |

Style: borderRadius 10px, fontWeight 600, press animation scale(0.98).

---

## Input

```jsx
import { Input } from '@/shared/components/Input.jsx'
<Input name="email" hasError={!!err} errorMessage={err} placeholder="Email" />
```

| Prop | Type | Notes |
|------|------|-------|
| `hasError` | boolean | Red border |
| `errorMessage` | string | `role="alert"` error below |

Style: borderRadius 10px, `--slogbaa-bg` background, blue glow on focus.

---

## Card

```jsx
import { Card, CardHeader, CardTitle } from '@/shared/components/Card.jsx'
<Card padding="md"><CardHeader><CardTitle>Title</CardTitle></CardHeader>...</Card>
```

| Prop | Options |
|------|---------|
| `padding` | `'none'`, `'sm'`, `'md'`, `'lg'` |

Style: borderRadius 14px, subtle shadow with hover transition.

---

## Badge

```jsx
import { Badge } from '@/shared/components/Badge.jsx'
<Badge variant="success">Published</Badge>
```

| Variant | Color | Use |
|---------|-------|-----|
| `'default'` | Muted gray | Neutral status |
| `'primary'` | Blue tint | Active/primary |
| `'success'` | Green tint | Published, completed |
| `'danger'` | Red tint | Revoked, failed |
| `'info'` | Blue tint | Information |
| `'warm'` | Amber tint | Highlights |

---

## Avatar

```jsx
import { Avatar } from '@/shared/components/Avatar.jsx'
<Avatar src={url} name="Jane" size="lg" />
```

| Prop | Options |
|------|---------|
| `size` | `'xs'` (24), `'sm'` (32), `'md'` (40), `'lg'` (56), `'xl'` (72) |

Fallback: blue→green gradient with initials.

---

## Tabs

```jsx
import { Tabs } from '@/shared/components/Tabs.jsx'
<Tabs tabs={[{ value: 'a', label: 'Tab A', icon: <Icon.../> }]} activeTab={tab} onChange={setTab} />
```

WAI-ARIA compliant. Keyboard: Arrow Left/Right, Home, End.

---

## Modal

```jsx
import { Modal } from '@/shared/components/Modal.jsx'
<Modal title="Edit" onClose={close} maxWidth={520}>...</Modal>
```

Focus trap, return-focus, Escape key, frosted glass overlay (`backdrop-filter: blur(4px)`), borderRadius 16px.

---

## ConfirmModal

```jsx
import { ConfirmModal } from '@/shared/components/ConfirmModal.jsx'
<ConfirmModal message="Delete?" onContinue={del} onCancel={close} />
```

`role="alertdialog"`, auto-focuses Cancel. Same frosted overlay as Modal.

---

## Toast

```jsx
import { useToast } from '@/shared/hooks/useToast.js'
const toast = useToast()
toast.success('Saved!')    // green border, check icon
toast.error('Failed.')     // red border, X icon, 6s
toast.info('Updated.')     // blue border, eye icon
toast.warning('Caution.')  // amber border, clipboard icon
```

Auto-dismiss: 4s default, 6s errors. Slide-in animation. `ToastContainer` in App.jsx.

---

## CommandPalette

```jsx
import { CommandPalette } from '@/shared/components/CommandPalette.jsx'
<CommandPalette onClose={close} commands={[
  { label: 'Go to Overview', group: 'Nav', onSelect: () => nav('/admin/overview'), shortcut: 'G O' },
]} />
```

Open with Ctrl+K. Frosted glass overlay. Arrow nav + Enter + Escape.

---

## SafeHtml

```jsx
import { SafeHtml } from '@/shared/components/SafeHtml.jsx'
<SafeHtml html={untrustedHtml} as="div" />
```

DOMPurify with 33 allowed tags. All anchors get `rel="noopener noreferrer"`.

---

## QueryError

```jsx
import { QueryError } from '@/shared/components/QueryError.jsx'
{error && <QueryError error={error} onRetry={refetch} message="Failed to load" />}
```

Icon + message + "Try again" button.

---

## EmptyState

```jsx
import { EmptyState } from '@/shared/components/EmptyState.jsx'
<EmptyState icon={icons.course} title="No courses" description="Check back later." />
```

---

## ContentSkeletons

```jsx
import { CardGridSkeleton, TableSkeleton, StatsSkeleton } from '@/shared/components/ContentSkeletons.jsx'
{loading && <CardGridSkeleton count={6} />}
{loading && <TableSkeleton rows={5} cols={4} />}
```

Layout-matching animated placeholders.

---

## ErrorBoundary

Wraps entire app in `App.jsx`. Catches unhandled React errors. Shows "Try again" / "Reload" recovery UI.

---

## ScrollToTop

Inside `BrowserRouter` in `App.jsx`. Scrolls to top on every route change.

---

## PageSkeleton

Suspense fallback for lazy routes. Centered spinner with `role="status"`.

---

## LoadingButton

```jsx
import { LoadingButton } from '@/shared/components/LoadingButton.jsx'
<LoadingButton loading={saving} style={styles.btn}>Save</LoadingButton>
```

Spinner icon + shimmer animation after 500ms. `aria-busy` while loading.

---

## FilterSortBar

```jsx
<FilterSortBar searchValue={q} onSearchChange={setQ} filters={...} sortOptions={...} />
```

Search input + filter dropdowns + sort selector. Used with `useDebounce`.

---

## Skeleton

```jsx
import { Skeleton, SkeletonText } from '@/shared/components/Skeleton.jsx'
<Skeleton height={16} width="70%" />
<SkeletonText lines={3} />
```

Pulse animation placeholder.

---

## Icon

```jsx
import { Icon, FontAwesomeIcon, icons } from '@/shared/icons.jsx'
<Icon icon={icons.home} size="1em" />
```

48 Lucide icons. `FontAwesomeIcon` is a backward-compatible alias.

---

## Hooks

| Hook | File | Usage |
|------|------|-------|
| `useToast()` | `hooks/useToast.js` | `toast.success('Done!')` |
| `useDebounce(val, 250)` | `hooks/useDebounce.js` | Debounce search inputs |
| `useLocalStorage(key, def)` | `hooks/useLocalStorage.js` | `[val, setVal]` like useState |
| `useAnnounce()` | `components/LiveRegion.jsx` | Screen reader announcements |
