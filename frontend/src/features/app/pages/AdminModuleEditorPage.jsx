import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { getAdminCourseDetails, addContentBlock, updateContentBlock, deleteContentBlock } from '../../../api/admin/courses.js'
import { BlockTypePickerModal } from '../components/admin/BlockTypePickerModal.jsx'
import { AddBlockModal } from '../components/admin/AddBlockModal.jsx'
import { EditBlockModal } from '../components/admin/EditBlockModal.jsx'
import { BlockOptionsMenu, applyTextStyle } from '../components/admin/BlockOptionsMenu.jsx'

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
  header: {
    marginBottom: '2rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  description: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  blockRow: {
    position: 'relative',
    minHeight: 28,
    marginBottom: '0.25rem',
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
  iconBtnHover: {
    background: 'rgba(241, 134, 37, 0.15)',
    color: 'var(--slogbaa-orange)',
  },
  blockContent: {
    marginLeft: 52,
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text)',
    outline: 'none',
  },
  blockContentEditable: {
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
    minHeight: 40,
    marginTop: '0.5rem',
    marginBottom: '0.25rem',
  },
  addBlockBtn: {
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
  addBlockLabel: {
    marginLeft: 52,
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  addBlockLabelHover: {
    color: 'var(--slogbaa-orange)',
  },
  loading: { padding: '2rem', color: 'var(--slogbaa-text-muted)' },
  error: { padding: '1.5rem', color: 'var(--slogbaa-error)' },
}

function ContentBlockPreview({ block }) {
  const { blockType, richText, imageUrl, imageAltText, imageCaption, videoUrl, videoId, activityInstructions, activityResources } = block

  if (blockType === 'TEXT' && richText) {
    return <div style={styles.blockContentHtml} dangerouslySetInnerHTML={{ __html: richText }} />
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

function AddBlockRow({ onAdd, isSuperAdmin }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="block-group"
      style={styles.addBlockRow}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
      <span
        style={{
          ...styles.addBlockLabel,
          marginLeft: 52,
          ...(hover && isSuperAdmin ? styles.addBlockLabelHover : {}),
        }}
      >
        Add block
      </span>
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
}) {
  return (
    <div className="block-group" style={styles.blockRow}>
      {isSuperAdmin && (
        <div className="block-icons" style={styles.blockIcons}>
          <BlockOptionsMenu
            block={block}
            module={module}
            courseId={courseId}
            isSuperAdmin={isSuperAdmin}
            visible={true}
            inline
            onAddBefore={onAddBefore}
            onEdit={onEdit}
            onDelete={onDelete}
            onStyleChange={onStyleChange}
          />
        </div>
      )}
      <div
        style={styles.blockContent}
        onClick={onEdit}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onEdit?.()}
      >
        <ContentBlockPreview block={block} />
      </div>
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
      setModule(m ?? null)
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

  if (loading) return <p style={styles.loading}>Loading module…</p>
  if (error || !course) return <p style={styles.error}>{error || 'Course not found.'}</p>
  if (!module) return <p style={styles.error}>Module not found.</p>

  return (
    <div style={styles.page}>
      <Link to={`/admin/learning/${courseId}`} style={styles.backLink}>
        ← Back to {course.title}
      </Link>

      <header style={styles.header}>
        <h1 style={styles.title}>{module.title}</h1>
        {module.description && <p style={styles.description}>{module.description}</p>}
      </header>

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
        />
      ))}

      {isSuperAdmin && (
        <AddBlockRow
          isSuperAdmin={isSuperAdmin}
          onAdd={() => openBlockPicker(module.contentBlocks?.length ?? 0)}
        />
      )}

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
