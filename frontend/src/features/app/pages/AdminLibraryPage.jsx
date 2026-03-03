import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { getAdminLibraryResources, createLibraryResource, publishLibraryResource, updateLibraryResource, unpublishLibraryResource } from '../../../api/admin/library.js'
import { Modal } from '../../../shared/components/Modal.jsx'

const RESOURCE_TYPES = [
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'POLICY_DOCUMENT', label: 'Policy document' },
  { value: 'READING_MATERIAL', label: 'Reading material' },
]

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    background: 'var(--slogbaa-bg)',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  link: {
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  badgePublished: {
    background: 'var(--slogbaa-green)',
    color: '#fff',
  },
  badgeDraft: {
    background: 'var(--slogbaa-text-muted)',
    color: '#fff',
  },
  btn: {
    padding: '0.35rem 0.75rem',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
  },
  btnSecondary: {
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
  },
  label: { fontSize: '0.875rem', fontWeight: 500, color: 'var(--slogbaa-text)', marginBottom: '0.25rem' },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
  },
  formRow: { marginBottom: '1rem' },
  formActions: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' },
  actionCell: { display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' },
  iconBtn: {
    padding: '0.4rem',
    border: 'none',
    borderRadius: 6,
    background: 'transparent',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
  },
  iconBtnHover: { color: 'var(--slogbaa-text)' },
  iconBtnPrimary: { color: 'var(--slogbaa-orange)' },
  placeholderBox: {
    padding: '0.75rem',
    borderRadius: 8,
    background: 'var(--slogbaa-bg)',
    border: '1px dashed var(--slogbaa-border)',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.875rem',
  },
}

export function AdminLibraryPage() {
  const { token, isSuperAdmin } = useOutletContext()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editResource, setEditResource] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', resourceType: 'DOCUMENT', fileUrl: '', fileType: '' })
  const [submitting, setSubmitting] = useState(false)
  const [publishingId, setPublishingId] = useState(null)
  const [unpublishingId, setUnpublishingId] = useState(null)
  const [savingEditId, setSavingEditId] = useState(null)

  const load = () => {
    if (!token) return
    setLoading(true)
    setError(null)
    getAdminLibraryResources(token)
      .then(setResources)
      .catch((e) => setError(e?.message ?? 'Failed to load.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [token])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!token || !form.title?.trim() || !form.fileUrl?.trim()) return
    setSubmitting(true)
    try {
      await createLibraryResource(token, {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        resourceType: form.resourceType,
        fileUrl: form.fileUrl.trim(),
        fileType: form.fileType?.trim() || undefined,
      })
      setModalOpen(false)
      setForm({ title: '', description: '', resourceType: 'DOCUMENT', fileUrl: '', fileType: '' })
      load()
    } catch (e) {
      setError(e?.message ?? 'Failed to create.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePublish = async (id) => {
    if (!token || publishingId) return
    setPublishingId(id)
    try {
      await publishLibraryResource(token, id)
      load()
    } catch (e) {
      setError(e?.message ?? 'Failed to publish.')
    } finally {
      setPublishingId(null)
    }
  }

  const handleUnpublish = async (id) => {
    if (!token || unpublishingId) return
    setUnpublishingId(id)
    try {
      await unpublishLibraryResource(token, id)
      load()
    } catch (e) {
      setError(e?.message ?? 'Failed to unpublish.')
    } finally {
      setUnpublishingId(null)
    }
  }

  const openEditModal = (r) => {
    setEditResource(r)
    setForm({
      title: r.title ?? '',
      description: r.description ?? '',
      resourceType: r.resourceType ?? 'DOCUMENT',
      fileUrl: r.fileUrl ?? '',
      fileType: r.fileType ?? '',
    })
  }

  const closeEditModal = () => {
    setEditResource(null)
    setForm({ title: '', description: '', resourceType: 'DOCUMENT', fileUrl: '', fileType: '' })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!token || !editResource || !form.title?.trim() || !form.fileUrl?.trim()) return
    setSavingEditId(editResource.id)
    try {
      await updateLibraryResource(token, editResource.id, {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        resourceType: form.resourceType,
        fileUrl: form.fileUrl.trim(),
        fileType: form.fileType?.trim() || undefined,
      })
      closeEditModal()
      load()
    } catch (e) {
      setError(e?.message ?? 'Failed to update.')
    } finally {
      setSavingEditId(null)
    }
  }

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Library resources</h1>
        {isSuperAdmin && (
          <button
            type="button"
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onClick={() => setModalOpen(true)}
          >
            <FontAwesomeIcon icon={icons.addBlock} style={{ marginRight: '0.35rem' }} />
            Add resource
          </button>
        )}
      </div>

      {error && (
        <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-error)', fontSize: '0.9375rem' }}>{error}</p>
      )}
      {loading && <p style={{ color: 'var(--slogbaa-text-muted)' }}>Loading…</p>}
      {!loading && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Link</th>
              {isSuperAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} style={{ ...styles.td, color: 'var(--slogbaa-text-muted)' }}>
                  No library resources yet. {isSuperAdmin && 'Click "Add resource" to create one.'}
                </td>
              </tr>
            )}
            {resources.map((r) => (
              <tr key={r.id}>
                <td style={styles.td}>{r.title}</td>
                <td style={styles.td}>{r.resourceType?.replace(/_/g, ' ') ?? '—'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(r.published ? styles.badgePublished : styles.badgeDraft) }}>
                    {r.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={styles.td}>
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    Open
                  </a>
                </td>
                {isSuperAdmin && (
                  <td style={styles.td}>
                    <div style={styles.actionCell}>
                      <button
                        type="button"
                        style={styles.iconBtn}
                        title="View / Edit"
                        onClick={() => openEditModal(r)}
                      >
                        <FontAwesomeIcon icon={icons.eye} />
                      </button>
                      {r.published ? (
                        <button
                          type="button"
                          style={styles.iconBtn}
                          title="Unpublish"
                          disabled={unpublishingId !== null}
                          onClick={() => handleUnpublish(r.id)}
                        >
                          <FontAwesomeIcon icon={icons.unpublish} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          style={{ ...styles.iconBtn, ...styles.iconBtnPrimary }}
                          title="Publish"
                          disabled={publishingId !== null}
                          onClick={() => handlePublish(r.id)}
                        >
                          <FontAwesomeIcon icon={icons.publish} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editResource && (
        <Modal title="View / Edit library resource" onClose={closeEditModal} maxWidth={480}>
          <form onSubmit={handleEditSubmit}>
            <div style={styles.formRow}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                style={styles.input}
                placeholder="Resource title"
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                style={{ ...styles.input, minHeight: 80 }}
                placeholder="Optional description"
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Type</label>
              <select
                value={form.resourceType}
                onChange={(e) => setForm((f) => ({ ...f, resourceType: e.target.value }))}
                style={styles.input}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File URL *</label>
              <input
                type="url"
                value={form.fileUrl}
                onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                style={styles.input}
                placeholder="https://…"
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File type (e.g. PDF)</label>
              <input
                type="text"
                value={form.fileType}
                onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                style={styles.input}
                placeholder="PDF, DOCX, etc."
              />
            </div>
            {['DOCUMENT', 'POLICY_DOCUMENT', 'READING_MATERIAL'].includes(form.resourceType) && (
              <div style={styles.formRow}>
                <label style={styles.label}>Replace document</label>
                <div style={styles.placeholderBox}>
                  Upload new document — coming soon
                </div>
              </div>
            )}
            <div style={styles.formActions}>
              <button type="button" style={{ ...styles.btn, ...styles.btnSecondary }} onClick={closeEditModal}>
                Cancel
              </button>
              <button type="submit" style={styles.btn} disabled={savingEditId !== null}>
                {savingEditId === editResource?.id ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modalOpen && (
        <Modal title="Add library resource" onClose={() => setModalOpen(false)} maxWidth={480}>
          <form onSubmit={handleCreate}>
            <div style={styles.formRow}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                style={styles.input}
                placeholder="Resource title"
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                style={{ ...styles.input, minHeight: 80 }}
                placeholder="Optional description"
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Type</label>
              <select
                value={form.resourceType}
                onChange={(e) => setForm((f) => ({ ...f, resourceType: e.target.value }))}
                style={styles.input}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File URL *</label>
              <input
                type="url"
                value={form.fileUrl}
                onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                style={styles.input}
                placeholder="https://…"
                required
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>File type (e.g. PDF)</label>
              <input
                type="text"
                value={form.fileType}
                onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                style={styles.input}
                placeholder="PDF, DOCX, etc."
              />
            </div>
            <div style={styles.formActions}>
              <button type="button" style={{ ...styles.btn, ...styles.btnSecondary }} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" style={styles.btn} disabled={submitting}>
                {submitting ? 'Adding…' : 'Add resource'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
