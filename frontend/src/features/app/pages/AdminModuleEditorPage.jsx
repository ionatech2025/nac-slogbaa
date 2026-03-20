import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useLocation, Link, useOutletContext } from 'react-router-dom'
import { getAdminCourseDetails, addContentBlock, updateContentBlock, updateModule } from '../../../api/admin/courses.js'
import { uploadFile } from '../../../api/files.js'
import { getAssetUrl } from '../../../api/client.js'
import { getCourseDetails } from '../../../api/learning/courses.js'
import { ModuleEditorJs } from '../components/admin/ModuleEditorJs.jsx'
import { EditorJsReadOnly } from '../components/admin/EditorJsReadOnly.jsx'
import { SafeHtml } from '../../../shared/components/SafeHtml.jsx'
import { AdminQuizEditor } from '../../assessment/components/AdminQuizEditor.jsx'
import { AdminQuizReadOnly } from '../../assessment/components/AdminQuizReadOnly.jsx'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'
import { icons as iconSet } from '../../../shared/icons.jsx'
const GripVertical = iconSet.grip
const Pencil = iconSet.edit

function focusBlockAndCursorStart(el) {
  if (!el || typeof el.focus !== 'function') return
  el.focus()
  try {
    const sel = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  } catch (_) {}
}

const styles = {
  page: {
    maxWidth: 960,
    margin: '0 auto',
    paddingTop: '4rem',
    paddingBottom: '4rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    marginBottom: '1rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
  editorArea: {
    outline: 'none',
  },
  blockRow: {
    position: 'relative',
    minHeight: 28,
    marginBottom: '0.25rem',
    borderRadius: 6,
    transition: 'background 0.15s ease',
  },
  blockRowFocused: {
    background: 'rgba(37, 99, 235, 0.06)',
  },
  blockIcons: {
    position: 'absolute',
    left: -52,
    top: 0,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    paddingTop: 4,
    width: 52,
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    border: 'none',
    borderRadius: 6,
    background: 'transparent',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  blockContent: {
    marginLeft: 52,
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text)',
    outline: 'none',
    minHeight: '1.5em',
  },
  blockContentTitle: {
    marginLeft: 52,
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    outline: 'none',
    minHeight: '1.5em',
  },
  blockContentDescription: {
    marginLeft: 52,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    outline: 'none',
    minHeight: '1.5em',
  },
  blockContentHtml: {
    fontSize: '0.9375rem',
    lineHeight: 1.6,
  },
  blockImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
  },
  blockImageCaption: {
    margin: '0.35rem 0 0',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    fontStyle: 'italic',
  },
  blockVideo: {
    aspectRatio: '16/9',
    width: '100%',
    maxWidth: 560,
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
  },
  activityBlock: {
    padding: '1rem 1.25rem',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    borderLeft: '4px solid var(--slogbaa-blue)',
  },
  emptyBlock: {
    color: 'var(--slogbaa-text-muted)',
    fontStyle: 'italic',
  },
  addBlockRow: {
    position: 'relative',
    minHeight: 32,
    marginTop: '0.5rem',
    marginBottom: '0.25rem',
    borderRadius: 6,
  },
  rowMenu: {
    position: 'absolute',
    left: 0,
    top: '100%',
    marginTop: 4,
    minWidth: 140,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    zIndex: 100,
    overflow: 'hidden',
  },
  rowMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text)',
    textAlign: 'left',
  },
  loading: { padding: '2rem', color: 'var(--slogbaa-text-muted)' },
  error: { padding: '1.5rem', color: 'var(--slogbaa-error)' },
}

/** True if string looks like Editor.js output (has "time" and "blocks"). */
function isEditorJsJson(str) {
  if (!str || typeof str !== 'string') return false
  const t = str.trim()
  if (!t.startsWith('{')) return false
  try {
    const o = JSON.parse(t)
    return o != null && typeof o === 'object' && 'blocks' in o
  } catch {
    return false
  }
}

/** Renders a single content block (read-only). Same logic as trainee CourseDetailPage. */
function AdminContentBlockRenderer({ block }) {
  const blockType = block?.blockType ?? block?.block_type ?? ''
  const richText = block?.richText ?? block?.rich_text ?? null
  const imageUrl = block?.imageUrl ?? block?.image_url
  const imageAltText = block?.imageAltText ?? block?.image_alt_text
  const imageCaption = block?.imageCaption ?? block?.image_caption
  const videoUrl = block?.videoUrl ?? block?.video_url
  const videoId = block?.videoId ?? block?.video_id
  const activityInstructions = block?.activityInstructions ?? block?.activity_instructions
  const activityResources = block?.activityResources ?? block?.activity_resources

  if (blockType === 'TEXT' && richText) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        {isEditorJsJson(richText) ? (
          <EditorJsReadOnly data={richText} style={styles.blockContentHtml} />
        ) : (
          <SafeHtml html={richText} style={styles.blockContentHtml} />
        )}
      </div>
    )
  }
  if (blockType === 'IMAGE' && imageUrl) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <figure style={{ margin: 0 }}>
          // codeql[js/xss]: imageUrl is normalized via getAssetUrl() before use in img src.
          <img src={getAssetUrl(imageUrl)} alt={imageAltText || ''} style={styles.blockImage} loading="lazy" />
          {imageCaption && <figcaption style={styles.blockImageCaption}>{imageCaption}</figcaption>}
        </figure>
      </div>
    )
  }
  if (blockType === 'VIDEO' && (videoId || videoUrl)) {
    const embedId = videoId || (videoUrl && videoUrl.match(/(?:v=|\/)([\w-]{11})(?:&|$)/)?.[1])
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        {embedId ? (
          <iframe
            title="Video content"
            src={`https://www.youtube.com/embed/${embedId}`}
            style={styles.blockVideo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--slogbaa-blue)' }}>
            Watch video
          </a>
        )}
      </div>
    )
  }
  if (blockType === 'ACTIVITY' && (activityInstructions || activityResources)) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={styles.activityBlock}>
          {activityInstructions && (
            <SafeHtml html={activityInstructions} style={styles.blockContentHtml} />
          )}
          {activityResources && (
            <SafeHtml html={activityResources} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--slogbaa-border)' }} />
          )}
        </div>
      </div>
    )
  }
  return null
}

export function AdminModuleEditorPage() {
  const { courseId, moduleId } = useParams()
  const location = useLocation()
  const { token, isSuperAdmin } = useOutletContext()
  const toast = useToast()
  const quizSectionRef = useRef(null)
  const [course, setCourse] = useState(null)
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const refresh = useCallback(async () => {
    if (!token || !courseId) return
    setLoading(true)
    setError(null)
    try {
      let data
      try {
        data = await getCourseDetails(token, courseId)
      } catch {
        data = await getAdminCourseDetails(token, courseId)
      }
      const m = data.modules?.find((mod) => String(mod.id) === String(moduleId))
      const blocks = m?.contentBlocks ?? m?.content_blocks ?? []

      setCourse(data)
      setModule((prev) => {
        if (!m) return null
        return {
          ...m,
          contentBlocks: blocks,
          title: m.title ?? prev?.title ?? '',
          description: m.description ?? prev?.description ?? '',
          imageUrl: m.imageUrl ?? prev?.imageUrl ?? null,
        }
      })
    } catch (err) {
      setError(err?.message ?? 'Failed to load course.')
    } finally {
      setLoading(false)
    }
  }, [token, courseId, moduleId])

  useEffect(() => {
    refresh()
  }, [refresh])

  /** First content block used to store Editor.js JSON; backend derives block_type from first block. */
  const editorBlock = module?.contentBlocks?.length ? module.contentBlocks[0] : null
  const richText = editorBlock?.richText ?? editorBlock?.rich_text ?? null
  const editorInitialData = editorBlock && isEditorJsJson(richText) ? richText : null

  const handleEditorSave = useCallback(async (editorJsJson) => {
    if (!token || !courseId || !moduleId) {
      throw new Error('Missing token, courseId, or moduleId. Please refresh the page.')
    }
    setSaveError(null)
    setSaveSuccess(false)
    setSaving(true)
    try {
      if (editorBlock?.id) {
        await updateContentBlock(token, courseId, moduleId, editorBlock.id, {
          blockType: 'TEXT',
          blockOrder: 0,
          richText: editorJsJson,
        })
      } else {
        await addContentBlock(token, courseId, moduleId, {
          blockType: 'TEXT',
          blockOrder: 0,
          richText: editorJsJson,
        })
      }
      await refresh()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err?.message ?? 'Failed to save content. Try again.')
      throw err
    } finally {
      setSaving(false)
    }
  }, [token, courseId, moduleId, editorBlock?.id, refresh])

  const handleSaveContent = useCallback(async () => {
    const saveFn = editorJsRef.current?.save
    if (typeof saveFn !== 'function') {
      setEditorReady(false)
      setSaveError('Editor is not ready yet. Wait a moment and try again.')
      return
    }
    setSaveError(null)
    setSaveSuccess(false)
    setSaving(true)
    try {
      await saveFn()
    } catch (err) {
      const msg = err?.message ?? 'Save failed. Check the console or try again.'
      if (msg.includes('not ready')) setEditorReady(false)
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }, [])

  const [focusedRowIndex, setFocusedRowIndex] = useState(null)
  const [titleMenuOpen, setTitleMenuOpen] = useState(false)
  const [descriptionMenuOpen, setDescriptionMenuOpen] = useState(false)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const titleRowRef = useRef(null)
  const descriptionRowRef = useRef(null)
  const editorJsRef = useRef(null)
  const [editorReady, setEditorReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Reset editor ready when switching module so Save shows "Waiting for editor…" until new instance is ready
  useEffect(() => {
    setEditorReady(false)
  }, [moduleId])

  // Scroll to quiz section when navigating with #quiz (e.g. from Assessment page)
  useEffect(() => {
    if (location.hash !== '#quiz' || !module) return
    const el = document.getElementById('quiz') || quizSectionRef.current
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash, module])

  const handleEditorAreaClick = useCallback((e) => {
    if (e.target.closest('a[href]') || e.target.closest('button') || e.target.closest('[role="menu"]')) return
    setTitleMenuOpen(false)
    setDescriptionMenuOpen(false)
  }, [])

  const handleEditorKeyDown = useCallback(() => {}, [])

  const handleTitleBlur = useCallback(async (text) => {
    const trimmed = (text ?? '').trim() || module?.title || ''
    if (trimmed === module?.title) return
    setModule((m) => (m ? { ...m, title: trimmed } : m))
    try {
      await updateModule(token, courseId, moduleId, { title: trimmed, description: module?.description ?? '', imageUrl: module?.imageUrl ?? undefined, estimatedMinutes: module?.estimatedMinutes ?? undefined })
    } catch (e) { toast.error(e?.message ?? 'Failed to save title.') }
  }, [module, token, courseId, moduleId, toast])
  const handleDescriptionBlur = useCallback(async (text) => {
    const trimmed = (text ?? '').trim()
    if (trimmed === (module?.description ?? '')) return
    setModule((m) => (m ? { ...m, description: trimmed } : m))
    try {
      await updateModule(token, courseId, moduleId, { title: module?.title ?? '', description: trimmed, imageUrl: module?.imageUrl ?? undefined, estimatedMinutes: module?.estimatedMinutes ?? undefined })
    } catch (e) { toast.error(e?.message ?? 'Failed to save description.') }
  }, [module, token, courseId, moduleId, toast])

  const [imageUploading, setImageUploading] = useState(false)
  const moduleImageInputRef = useRef(null)
  const handleModuleImageUpload = useCallback(async (e) => {
    const file = e.target?.files?.[0]
    if (!file || !token) return
    setImageUploading(true)
    try {
      const { url } = await uploadFile(token, file, 'courses')
      setModule((m) => (m ? { ...m, imageUrl: url } : m))
      await updateModule(token, courseId, moduleId, { title: module?.title ?? '', description: module?.description ?? '', imageUrl: url, estimatedMinutes: module?.estimatedMinutes ?? undefined })
      await refresh()
    } catch (e) { toast.error(e?.message ?? 'Failed to upload image.') }
    finally {
      setImageUploading(false)
      if (moduleImageInputRef.current) moduleImageInputRef.current.value = ''
    }
  }, [token, courseId, moduleId, module?.title, module?.description, refresh])

  // Re-sync title/description into contentEditable refs after load or refresh (e.g. after Editor.js save).
  // When loading goes true→false we remount the divs; deps [module?.title, module?.id] are unchanged so
  // we must depend on loading too so the effect runs and repopulates the new divs.
  useEffect(() => {
    if (loading || !module) return
    if (titleRef.current && document.activeElement !== titleRef.current)
      titleRef.current.textContent = module.title ?? ''
    if (descriptionRef.current && document.activeElement !== descriptionRef.current)
      descriptionRef.current.textContent = module.description ?? ''
  }, [loading, module?.id, module?.title, module?.description])

  // Only show full-page loading when we don't have a module yet (initial load). When refreshing after save, keep the UI so title/description don't disappear.
  if (loading && !module) return <p style={styles.loading}>Loading module…</p>
  if (error || !course) return <p style={styles.error}>{error || 'Course not found.'}</p>
  if (!module) return <p style={styles.error}>Module not found.</p>

  return (
    <div style={styles.page} onClick={handleEditorAreaClick}>
      <Breadcrumbs items={[
        { label: 'Admin', to: '/admin' },
        { label: 'Learning', to: '/admin/learning' },
        { label: course?.title || '...', to: `/admin/learning/${courseId}` },
        { label: module?.title || '...' },
      ]} />

      <div
        style={styles.editorArea}
        tabIndex={0}
        onKeyDown={handleEditorKeyDown}
        role="document"
        aria-label="Module content"
      >
        {/* Block 0: Module title */}
        <div
          ref={titleRowRef}
          className="block-group"
          style={{
            ...styles.blockRow,
            ...(focusedRowIndex === 0 ? styles.blockRowFocused : {}),
          }}
          onClick={(e) => { if (!e.target.closest('button') && !e.target.closest('[role="menu"]')) { setFocusedRowIndex(0); titleRef.current?.focus(); focusBlockAndCursorStart(titleRef.current) } }}
        >
          {isSuperAdmin && (
            <div className="block-icons" style={styles.blockIcons}>
              <div style={{ position: 'relative' }}>
                <button type="button" style={styles.iconBtn} title="Options" aria-label="Options" aria-expanded={titleMenuOpen} onClick={(e) => { e.stopPropagation(); setTitleMenuOpen((o) => !o); setDescriptionMenuOpen(false) }}>
                  <GripVertical size={14} strokeWidth={2} />
                </button>
                {titleMenuOpen && (
                  <div style={styles.rowMenu} role="menu">
                    <button type="button" style={styles.rowMenuItem} role="menuitem" onClick={(e) => { e.stopPropagation(); setTitleMenuOpen(false); titleRef.current?.focus(); focusBlockAndCursorStart(titleRef.current) }}>
                      <Pencil size={14} /> Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            ref={titleRef}
            contentEditable={isSuperAdmin}
            suppressContentEditableWarning
            style={styles.blockContentTitle}
            onBlur={(e) => isSuperAdmin && handleTitleBlur(e.currentTarget.textContent)}
            onFocus={() => setFocusedRowIndex(0)}
          />
        </div>

        {/* Block 1: Module description */}
        <div
          ref={descriptionRowRef}
          className="block-group"
          style={{
            ...styles.blockRow,
            ...(focusedRowIndex === 1 ? styles.blockRowFocused : {}),
          }}
          onClick={(e) => { if (!e.target.closest('button') && !e.target.closest('[role="menu"]')) { setFocusedRowIndex(1); descriptionRef.current?.focus(); focusBlockAndCursorStart(descriptionRef.current) } }}
        >
          {isSuperAdmin && (
            <div className="block-icons" style={styles.blockIcons}>
              <div style={{ position: 'relative' }}>
                <button type="button" style={styles.iconBtn} title="Options" aria-label="Options" aria-expanded={descriptionMenuOpen} onClick={(e) => { e.stopPropagation(); setDescriptionMenuOpen((o) => !o); setTitleMenuOpen(false) }}>
                  <GripVertical size={14} strokeWidth={2} />
                </button>
                {descriptionMenuOpen && (
                  <div style={styles.rowMenu} role="menu">
                    <button type="button" style={styles.rowMenuItem} role="menuitem" onClick={(e) => { e.stopPropagation(); setDescriptionMenuOpen(false); descriptionRef.current?.focus(); focusBlockAndCursorStart(descriptionRef.current) }}>
                      <Pencil size={14} /> Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            ref={descriptionRef}
            contentEditable={isSuperAdmin}
            suppressContentEditableWarning
            style={styles.blockContentDescription}
            onBlur={(e) => isSuperAdmin && handleDescriptionBlur(e.currentTarget.textContent)}
            onFocus={() => setFocusedRowIndex(1)}
          />
        </div>

        {/* Module image (SuperAdmin only) */}
        {isSuperAdmin && (
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
              Module image (optional)
            </label>
            <input
              ref={moduleImageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleModuleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => moduleImageInputRef.current?.click()}
              disabled={imageUploading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.75rem',
                background: 'var(--slogbaa-surface)',
                border: '1px solid var(--slogbaa-border)',
                borderRadius: 8,
                fontSize: '0.875rem',
                color: 'var(--slogbaa-text)',
                cursor: imageUploading ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🖼</span>
              {imageUploading ? 'Uploading…' : (module?.imageUrl ? 'Change image' : 'Upload image')}
            </button>
            {module?.imageUrl && (
              <div style={{ marginTop: '0.5rem' }}>
                <img
                  src={typeof module?.imageUrl === 'string' && (module.imageUrl.startsWith('/') || module.imageUrl.startsWith('http://') || module.imageUrl.startsWith('https://')) ? getAssetUrl(module.imageUrl) : ''}
                  alt="Module"
                  style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, border: '1px solid var(--slogbaa-border)', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Estimated minutes (SuperAdmin only) */}
        {isSuperAdmin && (
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
              Estimated minutes (optional)
            </label>
            <input
              type="number"
              min="0"
              value={module?.estimatedMinutes ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value, 10)
                setModule((m) => (m ? { ...m, estimatedMinutes: val } : m))
              }}
              onBlur={async (e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value, 10)
                try {
                  await updateModule(token, courseId, moduleId, { title: module?.title ?? '', description: module?.description ?? '', imageUrl: module?.imageUrl ?? undefined, estimatedMinutes: val })
                } catch (err) { toast.error(err?.message ?? 'Failed to save estimated minutes.') }
              }}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--slogbaa-border)',
                borderRadius: 8,
                fontSize: '0.9375rem',
                background: 'var(--slogbaa-surface)',
                color: 'var(--slogbaa-text)',
                width: 120,
              }}
              placeholder="e.g. 15"
            />
          </div>
        )}

        {/* Block-based content: Editor.js for SuperAdmin (editable), read-only blocks for Admin */}
        <div style={{ marginTop: '1.5rem' }}>
          {isSuperAdmin ? (
            <div
              className="ce-editor-holder"
              data-editor-holder
              style={{
                padding: '1.5rem',
                minHeight: 320,
                background: 'var(--slogbaa-surface)',
                border: '2px solid var(--slogbaa-blue)',
                borderRadius: 12,
                borderLeft: '4px solid var(--slogbaa-blue)',
              }}
            >
              <p style={{
                margin: '0 0 1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--slogbaa-blue)',
              }}>
                Add or edit content blocks below
              </p>
              <ModuleEditorJs
                ref={editorJsRef}
                key={moduleId}
                initialData={editorInitialData}
                onSave={handleEditorSave}
                onReady={() => setEditorReady(true)}
                readOnly={false}
                holderId={`module-editor-${moduleId}`}
              />
            </div>
          ) : (
            <div style={{ minHeight: 120 }}>
              {module.contentBlocks?.length ? (
                module.contentBlocks.map((block) => (
                  <AdminContentBlockRenderer key={block.id} block={block} />
                ))
              ) : (
                <p style={{ color: 'var(--slogbaa-text-muted)', fontStyle: 'italic' }}>
                  No content in this module yet.
                </p>
              )}
            </div>
          )}
          {isSuperAdmin && (
            <div style={{ marginTop: '1.5rem' }}>
              {saveError && (
                <p style={{ margin: '0 0 0.75rem', color: 'var(--slogbaa-error, #c0392b)', fontSize: '0.875rem' }}>
                  {saveError}
                </p>
              )}
              {saveSuccess && (
                <p style={{ margin: '0 0 0.75rem', color: 'var(--slogbaa-green, #0a7c42)', fontSize: '0.875rem', fontWeight: 500 }}>
                  Saved successfully. Content is now in the database.
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <LoadingButton
                  type="button"
                  onClick={handleSaveContent}
                  loading={saving}
                  disabled={!editorReady}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--slogbaa-blue)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    cursor: editorReady ? 'pointer' : 'not-allowed',
                  }}
                >
                  {editorReady ? 'Save content' : 'Waiting for editor…'}
                </LoadingButton>
                <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>
                  {editorReady ? 'Click to push editor content to the module. Trainees will see it after save.' : 'Editor is loading…'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Module quiz: read-only for admin, editable for SuperAdmin */}
        {(module.hasQuiz === true || module.has_quiz === true) && (
          <div id="quiz" ref={quizSectionRef}>
            {isSuperAdmin ? (
              <AdminQuizEditor
                token={token}
                moduleId={moduleId}
                onSaved={() => refresh()}
              />
            ) : (
              <AdminQuizReadOnly token={token} moduleId={moduleId} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
