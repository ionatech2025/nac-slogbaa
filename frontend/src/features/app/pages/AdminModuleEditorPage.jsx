import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getAdminCourseDetails, addContentBlock, updateContentBlock, deleteContentBlock, updateModule } from '../../../api/admin/courses.js'
import { BlockTypePickerModal } from '../components/admin/BlockTypePickerModal.jsx'
import { AddBlockModal } from '../components/admin/AddBlockModal.jsx'
import { EditBlockModal } from '../components/admin/EditBlockModal.jsx'
import { BlockOptionsMenu, applyTextStyle, isBlockEmpty } from '../components/admin/BlockOptionsMenu.jsx'
import { GripVertical, Pencil } from 'lucide-react'

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
    maxWidth: 720,
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
    background: 'rgba(241, 134, 37, 0.06)',
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
    borderLeft: '4px solid var(--slogbaa-orange)',
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

function TextBlockEditable({ block, innerRef, onBlur, onFocus }) {
  const { richText } = block
  const ref = useRef(null)
  const combinedRef = (el) => {
    ref.current = el
    if (typeof innerRef === 'function') innerRef(el)
    else if (innerRef) innerRef.current = el
  }
  useEffect(() => {
    if (!ref.current) return
    if (document.activeElement === ref.current) return
    ref.current.innerHTML = richText || ''
  }, [block.id, richText])

  return (
    <div
      ref={combinedRef}
      contentEditable
      suppressContentEditableWarning
      style={{ ...styles.blockContent, ...styles.blockContentHtml }}
      onBlur={(e) => { const html = e.currentTarget.innerHTML; onBlur?.(html) }}
      onFocus={onFocus}
      data-placeholder="Type something…"
    />
  )
}

function ContentBlockPreview({ block, contentEditable, innerRef, onBlur, onFocus }) {
  const { blockType, richText, imageUrl, imageAltText, imageCaption, videoUrl, videoId, activityInstructions, activityResources } = block

  if (blockType === 'TEXT') {
    if (contentEditable) {
      return <TextBlockEditable block={block} innerRef={innerRef} onBlur={onBlur} onFocus={onFocus} />
    }
    return <div style={styles.blockContentHtml} dangerouslySetInnerHTML={{ __html: richText || '' }} />
  }
  if (blockType === 'IMAGE' && imageUrl) {
    return (
      <figure style={{ margin: 0 }}>
        <img src={imageUrl} alt={imageAltText || ''} style={styles.blockImage} loading="lazy" />
        {imageCaption && <figcaption style={styles.blockImageCaption}>{imageCaption}</figcaption>}
      </figure>
    )
  }
  if (blockType === 'VIDEO' && (videoId || videoUrl)) {
    const embedId = videoId || videoUrl?.match(/(?:v=|\/)([\w-]{11})(?:&|$)/)?.[1]
    return embedId ? (
      <iframe
        title="Video"
        src={`https://www.youtube.com/embed/${embedId}`}
        style={styles.blockVideo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--slogbaa-blue)' }}>Watch video</a>
    )
  }
  if (blockType === 'ACTIVITY' && (activityInstructions || activityResources)) {
    return (
      <div style={styles.activityBlock}>
        {activityInstructions && <div style={styles.blockContentHtml} dangerouslySetInnerHTML={{ __html: activityInstructions }} />}
        {activityResources && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--slogbaa-border)' }} dangerouslySetInnerHTML={{ __html: activityResources }} />
        )}
      </div>
    )
  }
  return <span style={styles.emptyBlock}>Empty {blockType?.toLowerCase() || 'block'}</span>
}

function AddBlockRow({ onAdd, isSuperAdmin, rowRef, focused, onFocus }) {
  return (
    <div
      ref={rowRef}
      tabIndex={0}
      className="block-group"
      style={{
        ...styles.addBlockRow,
        ...(focused ? styles.blockRowFocused : {}),
      }}
      onClick={(e) => { if (e.target === e.currentTarget || !e.target.closest('button')) onFocus?.() }}
      onFocus={onFocus}
    >
      {isSuperAdmin && (
        <div className="block-icons" style={styles.blockIcons}>
          <button
            type="button"
            style={styles.iconBtn}
            onClick={onAdd}
            title="Add block"
            aria-label="Add block"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  )
}

function BlockRow({
  block,
  module,
  courseId,
  isSuperAdmin,
  onAddBefore,
  onEdit,
  onDelete,
  onStyleChange,
  rowRef,
  contentRef,
  focused,
  onFocus,
  onTextBlur,
}) {
  const isEmpty = isBlockEmpty(block)
  const isText = block?.blockType === 'TEXT'

  return (
    <div
      ref={rowRef}
      className="block-group"
      tabIndex={0}
      style={{
        ...styles.blockRow,
        ...(focused ? styles.blockRowFocused : {}),
      }}
      onClick={(e) => {
        if (isText && contentRef.current && !e.target.closest('button')) {
          onFocus?.()
          if (document.activeElement !== contentRef.current) {
            contentRef.current.focus()
            focusBlockAndCursorStart(contentRef.current)
          }
        } else if (!isText && !e.target.closest('button')) {
          onFocus?.()
          onEdit?.()
        }
      }}
    >
      {isSuperAdmin && (
        <div className="block-icons" style={styles.blockIcons}>
          <BlockOptionsMenu
            block={block}
            module={module}
            courseId={courseId}
            isSuperAdmin={isSuperAdmin}
            visible={true}
            inline
            empty={isEmpty}
            onAddBefore={onAddBefore}
            onEdit={onEdit}
            onDelete={onDelete}
            onStyleChange={onStyleChange}
          />
        </div>
      )}
      {isText ? (
        <ContentBlockPreview
          block={block}
          contentEditable={isSuperAdmin}
          innerRef={contentRef}
          onBlur={onTextBlur}
          onFocus={onFocus}
        />
      ) : (
        <div style={styles.blockContent} onClick={onEdit}>
          <ContentBlockPreview block={block} />
        </div>
      )}
    </div>
  )
}

export function AdminModuleEditorPage() {
  const { courseId, moduleId } = useParams()
  const { token, isSuperAdmin } = useOutletContext()
  const [course, setCourse] = useState(null)
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [modalContext, setModalContext] = useState(null)

  const refresh = useCallback(async () => {
    if (!token || !courseId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminCourseDetails(token, courseId)
      setCourse(data)
      const m = data.modules?.find((mod) => mod.id === moduleId)
      setModule((prev) => {
        if (!m) return null
        return {
          ...m,
          title: m.title ?? prev?.title ?? '',
          description: m.description ?? prev?.description ?? '',
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

  const openBlockPicker = (insertAfterIndex) => {
    setModalContext({ insertAfterIndex })
    setModal('blockPicker')
  }

  const handleBlockTypeSelected = (blockType) => {
    setModal('addBlock')
    setModalContext((prev) => ({ ...prev, preselectedType: blockType }))
  }

  const handleAddBlock = async (data) => {
    await addContentBlock(token, courseId, moduleId, data)
    setModal(null)
    setModalContext(null)
    await refresh()
  }

  const handleEditBlock = (block) => {
    setModalContext({ block })
    setModal('editBlock')
  }

  const handleUpdateBlock = async (blockId, payload) => {
    await updateContentBlock(token, courseId, moduleId, blockId, payload)
    setModal(null)
    setModalContext(null)
    await refresh()
  }

  const handleDeleteBlock = async (blockId) => {
    await deleteContentBlock(token, courseId, moduleId, blockId)
    await refresh()
  }

  const handleBlockStyleChange = async (blockId, block, style) => {
    const richText = applyTextStyle(block.richText, style)
    await updateContentBlock(token, courseId, moduleId, blockId, {
      blockType: block.blockType || 'TEXT',
      blockOrder: block.blockOrder ?? 0,
      richText,
      imageUrl: block.imageUrl ?? undefined,
      imageAltText: block.imageAltText ?? undefined,
      imageCaption: block.imageCaption ?? undefined,
      videoUrl: block.videoUrl ?? undefined,
      videoId: block.videoId ?? undefined,
      activityInstructions: block.activityInstructions ?? undefined,
      activityResources: block.activityResources ?? undefined,
    })
    await refresh()
  }

  const [focusedRowIndex, setFocusedRowIndex] = useState(null)
  const [titleMenuOpen, setTitleMenuOpen] = useState(false)
  const [descriptionMenuOpen, setDescriptionMenuOpen] = useState(false)
  const rowRefs = useRef([])
  const blockContentRefs = useRef([])
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const titleRowRef = useRef(null)
  const descriptionRowRef = useRef(null)

  const getRowRef = (i) => {
    if (!rowRefs.current[i]) rowRefs.current[i] = { current: null }
    return rowRefs.current[i]
  }

  const blockCountRef = useRef(0)
  blockCountRef.current = module?.contentBlocks?.length ?? 0
  const totalRows = 2 + blockCountRef.current + (isSuperAdmin ? 1 : 0)

  const focusRowByIndex = useCallback((index) => {
    if (index < 0 || index >= totalRows) return
    setFocusedRowIndex(index)
    let focusEl = null
    if (index === 0) focusEl = titleRef.current
    else if (index === 1) focusEl = descriptionRef.current
    else if (index >= 2 && module?.contentBlocks?.[index - 2]?.blockType === 'TEXT')
      focusEl = blockContentRefs.current[index - 2]?.current
    else focusEl = getRowRef(index).current
    if (focusEl && typeof focusEl.focus === 'function') {
      focusEl.focus()
      focusBlockAndCursorStart(focusEl)
    }
  }, [module, isSuperAdmin, totalRows])

  const handleEditorAreaClick = useCallback((e) => {
    if (!module) return
    if (e.target.closest('a[href]') || e.target.closest('button') || e.target.closest('[role="menu"]')) return
    setTitleMenuOpen(false)
    setDescriptionMenuOpen(false)
    const clickY = e.clientY
    const blockCount = module.contentBlocks?.length ?? 0
    const rowRefsList = [titleRowRef, descriptionRowRef]
    for (let i = 0; i < blockCount; i++) rowRefsList.push(getRowRef(2 + i))
    if (isSuperAdmin) rowRefsList.push(getRowRef(2 + blockCount))
    let closestIndex = 0
    let closestDist = Infinity
    rowRefsList.forEach((ref, i) => {
      const el = ref?.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const mid = rect.top + rect.height / 2
      const dist = Math.abs(clickY - mid)
      if (dist < closestDist) {
        closestDist = dist
        closestIndex = i
      }
    })
    focusRowByIndex(closestIndex)
  }, [module, isSuperAdmin, focusRowByIndex])

  const handleEditorKeyDown = useCallback((e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const current = focusedRowIndex ?? 0
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusRowByIndex(Math.min(current + 1, totalRows - 1))
    } else {
      e.preventDefault()
      focusRowByIndex(Math.max(current - 1, 0))
    }
  }, [focusedRowIndex, totalRows, focusRowByIndex])

  const handleTitleBlur = useCallback(async (text) => {
    const trimmed = (text ?? '').trim() || module?.title || ''
    if (trimmed === module?.title) return
    setModule((m) => (m ? { ...m, title: trimmed } : m))
    try {
      await updateModule(token, courseId, moduleId, { title: trimmed, description: module?.description ?? '' })
    } catch (_) {}
  }, [module, token, courseId, moduleId])
  const handleDescriptionBlur = useCallback(async (text) => {
    const trimmed = (text ?? '').trim()
    if (trimmed === (module?.description ?? '')) return
    setModule((m) => (m ? { ...m, description: trimmed } : m))
    try {
      await updateModule(token, courseId, moduleId, { title: module?.title ?? '', description: trimmed })
    } catch (_) {}
  }, [module, token, courseId, moduleId])

  useEffect(() => {
    if (titleRef.current && document.activeElement !== titleRef.current)
      titleRef.current.textContent = module?.title ?? ''
  }, [module?.title, module?.id])
  useEffect(() => {
    if (descriptionRef.current && document.activeElement !== descriptionRef.current)
      descriptionRef.current.textContent = module?.description ?? ''
  }, [module?.description, module?.id])

  if (loading) return <p style={styles.loading}>Loading module…</p>
  if (error || !course) return <p style={styles.error}>{error || 'Course not found.'}</p>
  if (!module) return <p style={styles.error}>Module not found.</p>

  const blockCount = module.contentBlocks?.length ?? 0

  return (
    <div style={styles.page} onClick={handleEditorAreaClick}>
      <Link to={`/admin/learning/${courseId}`} style={styles.backLink}>
        ← Back to {course.title}
      </Link>

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
              <button type="button" style={styles.iconBtn} title="Add block" aria-label="Add block" onClick={(e) => { e.stopPropagation(); openBlockPicker(-1) }}>
                <Plus size={16} strokeWidth={2.5} />
              </button>
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
              <button type="button" style={styles.iconBtn} title="Add block" aria-label="Add block" onClick={(e) => { e.stopPropagation(); openBlockPicker(0) }}>
                <Plus size={16} strokeWidth={2.5} />
              </button>
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

        {/* Content blocks */}
        {module.contentBlocks?.map((block, i) => (
          <BlockRow
            key={block.id}
            block={block}
            module={module}
            courseId={courseId}
            isSuperAdmin={isSuperAdmin}
            onAddBefore={() => openBlockPicker(i)}
            onEdit={() => handleEditBlock(block)}
            onDelete={() => handleDeleteBlock(block.id)}
            onStyleChange={(style) => handleBlockStyleChange(block.id, block, style)}
            rowRef={getRowRef(2 + i)}
            contentRef={blockContentRefs.current[i] || (blockContentRefs.current[i] = { current: null })}
            focused={focusedRowIndex === 2 + i}
            onFocus={() => setFocusedRowIndex(2 + i)}
            onTextBlur={(html) => block.blockType === 'TEXT' && handleUpdateBlock(block.id, {
              blockType: 'TEXT',
              blockOrder: block.blockOrder ?? i,
              richText: html || undefined,
              imageUrl: block.imageUrl ?? undefined,
              imageAltText: block.imageAltText ?? undefined,
              imageCaption: block.imageCaption ?? undefined,
              videoUrl: block.videoUrl ?? undefined,
              videoId: block.videoId ?? undefined,
              activityInstructions: block.activityInstructions ?? undefined,
              activityResources: block.activityResources ?? undefined,
            })}
          />
        ))}

        {isSuperAdmin && (
          <AddBlockRow
            isSuperAdmin={isSuperAdmin}
            onAdd={() => openBlockPicker(blockCount)}
            rowRef={getRowRef(2 + blockCount)}
            focused={focusedRowIndex === 2 + blockCount}
            onFocus={() => setFocusedRowIndex(2 + blockCount)}
          />
        )}
      </div>

      {modal === 'blockPicker' && (
        <BlockTypePickerModal
          onClose={() => { setModal(null); setModalContext(null) }}
          onSelect={handleBlockTypeSelected}
        />
      )}
      {modal === 'addBlock' && (
        <AddBlockModal
          course={course}
          module={module}
          preselectedType={modalContext?.preselectedType}
          onClose={() => { setModal(null); setModalContext(null) }}
          onSubmit={(data) => handleAddBlock(data)}
        />
      )}
      {modal === 'editBlock' && modalContext?.block && (
        <EditBlockModal
          block={modalContext.block}
          courseId={courseId}
          module={module}
          onClose={() => { setModal(null); setModalContext(null) }}
          onSubmit={(payload) => handleUpdateBlock(modalContext.block.id, payload)}
        />
      )}
    </div>
  )
}
