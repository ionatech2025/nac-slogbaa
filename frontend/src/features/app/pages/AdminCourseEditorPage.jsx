import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { getAdminCourseDetails, addModule, addContentBlock, updateContentBlock, deleteContentBlock, publishCourse } from '../../../api/admin/courses.js'
import { getAssetUrl } from '../../../api/client.js'
import { BlockTypePickerModal } from '../components/admin/BlockTypePickerModal.jsx'
import { AddBlockModal } from '../components/admin/AddBlockModal.jsx'
import { EditBlockModal } from '../components/admin/EditBlockModal.jsx'
import { BlockOptionsMenu, applyTextStyle } from '../components/admin/BlockOptionsMenu.jsx'
import { AddModuleModal } from '../components/admin/AddModuleModal.jsx'

const styles = {
  page: {
    maxWidth: 720,
    margin: '0 auto',
    paddingBottom: '3rem',
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
  badge: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 500,
    background: 'rgba(81, 175, 56, 0.15)',
    color: 'var(--slogbaa-green, #0a7c42)',
  },
  badgeDraft: {
    background: 'rgba(128,128,128,0.15)',
    color: 'var(--slogbaa-text-muted)',
  },
  module: {
    marginBottom: '2.5rem',
  },
  moduleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--slogbaa-orange)',
  },
  moduleTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  blockWrap: {
    position: 'relative',
    marginBottom: '0.5rem',
    minHeight: 24,
    padding: '0.5rem 0',
    borderLeft: '2px solid transparent',
    borderRadius: 4,
    transition: 'border-color 0.15s, background 0.15s',
  },
  blockWrapHover: {
    borderLeftColor: 'var(--slogbaa-orange)',
    background: 'rgba(241, 134, 37, 0.04)',
  },
  blockAddBtn: {
    position: 'absolute',
    left: -12,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    fontSize: '0.75rem',
    opacity: 0,
    transition: 'opacity 0.15s, background 0.15s, color 0.15s',
  },
  blockAddBtnVisible: {
    opacity: 1,
  },
  blockAddBtnHover: {
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    borderColor: 'var(--slogbaa-orange)',
  },
  blockContent: {
    marginLeft: 52,
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text)',
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
  addModuleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-surface)',
    border: '2px dashed var(--slogbaa-border)',
    borderRadius: 8,
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
  addModuleBtnHover: {
    borderColor: 'var(--slogbaa-orange)',
    color: 'var(--slogbaa-orange)',
  },
  publishBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '0.5rem',
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
        <img src={getAssetUrl(imageUrl)} alt={imageAltText || ''} style={styles.blockImage} loading="lazy" />
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
      style={{
        ...styles.blockWrap,
        marginLeft: 24,
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        ...(hover && isSuperAdmin ? styles.blockWrapHover : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isSuperAdmin && (
        <button
          type="button"
          style={{
            ...styles.blockAddBtn,
            ...(hover ? styles.blockAddBtnVisible : {}),
          }}
          onClick={onAdd}
          title="Add block"
          aria-label="Add block"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      )}
      <span style={{ marginLeft: isSuperAdmin ? 28 : 0, fontSize: '0.875rem', color: hover && isSuperAdmin ? 'var(--slogbaa-orange)' : 'var(--slogbaa-text-muted)' }}>Add block</span>
    </div>
  )
}

function BlockWithAdd({
  block,
  module,
  courseId,
  isSuperAdmin,
  onAddBefore,
  onEdit,
  onDelete,
  onStyleChange,
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      style={{
        ...styles.blockWrap,
        ...(hover && isSuperAdmin ? styles.blockWrapHover : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isSuperAdmin && (
        <BlockOptionsMenu
          block={block}
          module={module}
          courseId={courseId}
          isSuperAdmin={isSuperAdmin}
          visible={hover}
          onAddBefore={onAddBefore}
          onEdit={onEdit}
          onDelete={onDelete}
          onStyleChange={onStyleChange}
        />
      )}
      <div style={styles.blockContent}>
        <ContentBlockPreview block={block} />
      </div>
    </div>
  )
}

export function AdminCourseEditorPage() {
  const { courseId } = useParams()
  const { token, isSuperAdmin } = useOutletContext()
  const [course, setCourse] = useState(null)
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
    } catch (err) {
      setError(err?.message ?? 'Failed to load course.')
    } finally {
      setLoading(false)
    }
  }, [token, courseId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const openBlockPicker = (module, insertAfterIndex) => {
    setModalContext({ module, insertAfterIndex })
    setModal('blockPicker')
  }

  const handleBlockTypeSelected = (blockType) => {
    setModal('addBlock')
    setModalContext((prev) => ({ ...prev, preselectedType: blockType }))
  }

  const handleAddBlock = async (moduleId, data) => {
    await addContentBlock(token, courseId, moduleId, data)
    setModal(null)
    setModalContext(null)
    await refresh()
  }

  const handleAddModule = async (data) => {
    await addModule(token, courseId, data)
    setModal(null)
    setModalContext(null)
    await refresh()
  }

  const handlePublish = async () => {
    await publishCourse(token, courseId)
    await refresh()
  }

  const handleEditBlock = (module, block) => {
    setModalContext({ module, block })
    setModal('editBlock')
  }

  const handleUpdateBlock = async (moduleId, blockId, payload) => {
    await updateContentBlock(token, courseId, moduleId, blockId, payload)
    setModal(null)
    setModalContext(null)
    await refresh()
  }

  const handleDeleteBlock = async (moduleId, blockId) => {
    await deleteContentBlock(token, courseId, moduleId, blockId)
    await refresh()
  }

  const handleBlockStyleChange = async (moduleId, blockId, block, style) => {
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

  if (loading) return <p style={styles.loading}>Loading course…</p>
  if (error || !course) return <p style={styles.error}>{error || 'Course not found.'}</p>

  return (
    <div style={styles.page}>
      <Link to="/admin/learning" style={styles.backLink}>
        ← Back to Learning
      </Link>

      <header style={styles.header}>
        <h1 style={styles.title}>{course.title}</h1>
        {course.description && <p style={styles.description}>{course.description}</p>}
        <span style={{ ...styles.badge, ...(course.published ? {} : styles.badgeDraft) }}>
          {course.published ? 'Published' : 'Draft'}
        </span>
        {isSuperAdmin && !course.published && (
          <button type="button" style={styles.publishBtn} onClick={handlePublish}>
            <FontAwesomeIcon icon={icons.publish} /> Publish
          </button>
        )}
      </header>

      {course.modules?.map((module) => (
        <section key={module.id} style={styles.module}>
          <div style={styles.moduleHeader}>
            <h2 style={styles.moduleTitle}>{module.title}</h2>
          </div>
          {module.description && (
            <p style={{ margin: '0 0 1rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>{module.description}</p>
          )}

          {/* Content blocks with + and options */}
          {module.contentBlocks?.map((block, i) => (
            <BlockWithAdd
              key={block.id}
              block={block}
              module={module}
              courseId={courseId}
              isSuperAdmin={isSuperAdmin}
              onAddBefore={() => openBlockPicker(module, i)}
              onEdit={() => handleEditBlock(module, block)}
              onDelete={() => handleDeleteBlock(module.id, block.id)}
              onStyleChange={(style) => handleBlockStyleChange(module.id, block.id, block, style)}
            />
          ))}

          {/* Add block row - + button and "Add block" label */}
          {isSuperAdmin && (
            <AddBlockRow
              isSuperAdmin={isSuperAdmin}
              onAdd={() => openBlockPicker(module, module.contentBlocks?.length ?? 0)}
            />
          )}
        </section>
      ))}

      {isSuperAdmin && (
        <button
          type="button"
          style={styles.addModuleBtn}
          onClick={() => setModal('addModule')}
          title="Add module"
        >
          <FontAwesomeIcon icon={icons.modules} /> Add module
        </button>
      )}

      {modal === 'blockPicker' && modalContext?.module && (
        <BlockTypePickerModal
          onClose={() => { setModal(null); setModalContext(null) }}
          onSelect={handleBlockTypeSelected}
        />
      )}
      {modal === 'addBlock' && modalContext?.module && (
        <AddBlockModal
          course={course}
          module={modalContext.module}
          preselectedType={modalContext.preselectedType}
          onClose={() => { setModal(null); setModalContext(null) }}
          onSubmit={(data) => handleAddBlock(modalContext.module.id, data)}
        />
      )}
      {modal === 'addModule' && (
        <AddModuleModal
          course={course}
          onClose={() => setModal(null)}
          onSubmit={handleAddModule}
        />
      )}
      {modal === 'editBlock' && modalContext?.block && modalContext?.module && (
        <EditBlockModal
          block={modalContext.block}
          courseId={courseId}
          module={modalContext.module}
          onClose={() => { setModal(null); setModalContext(null) }}
          onSubmit={(payload) => handleUpdateBlock(modalContext.module.id, modalContext.block.id, payload)}
        />
      )}
    </div>
  )
}
