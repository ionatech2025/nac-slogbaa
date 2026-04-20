import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { AdminNavigatePills } from '../components/admin/AdminNavigatePills.jsx'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'
import { queryKeys } from '../../../lib/query-keys.js'
import * as api from '../../../api/homepage.js'

const s = {
  section: { marginBottom: '2rem' },
  title: { margin: '0 0 0.5rem', fontSize: '1.375rem', fontWeight: 700, color: 'var(--slogbaa-blue)' },
  subtitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: 'var(--slogbaa-text)' },
  card: { padding: '1rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '1rem' },
  input: { padding: '0.5rem 0.75rem', border: '1px solid var(--slogbaa-border)', borderRadius: 8, fontSize: '0.875rem', background: 'var(--slogbaa-bg)' },
  textarea: { padding: '0.5rem 0.75rem', border: '1px solid var(--slogbaa-border)', borderRadius: 8, fontSize: '0.875rem', background: 'var(--slogbaa-bg)', minHeight: 60, resize: 'vertical' },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  btn: { padding: '0.45rem 0.875rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 },
  btnPrimary: { background: 'var(--slogbaa-blue)', color: '#fff' },
  btnDanger: { background: 'rgba(220,38,38,0.1)', color: 'var(--slogbaa-error)' },
  empty: { color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem', padding: '1rem 0' },
  label: { fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slogbaa-text)' },
}

const CMS_STYLE = `
  .admin-cms-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    width: 100%;
  }
  .admin-cms-item-row {
    position: relative;
    padding: 1.25rem;
    border-radius: 14px;
    border: 1px solid var(--slogbaa-border);
    background: var(--slogbaa-surface);
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }
  .admin-cms-item-row:hover {
    border-color: var(--slogbaa-blue);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .admin-cms-item-thumb {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
    background: var(--slogbaa-bg);
    flex-shrink: 0;
  }

  .admin-cms-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-bottom: 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 1200px) {
    .admin-cms-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .admin-cms-grid { grid-template-columns: 1fr; }
    .admin-cms-item-row { flex-direction: column; }
    .admin-cms-item-thumb { width: 100%; height: 160px; }
  }

  .cms-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
  .cms-form-full {
    grid-column: span 2;
  }
  @media (max-width: 768px) {
    .cms-form-grid { grid-template-columns: 1fr; }
    .cms-form-full { grid-column: span 1; }
  }

  .file-drop-zone {
    border: 2px dashed var(--slogbaa-border);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    background: var(--slogbaa-bg);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .file-drop-zone:hover {
    border-color: var(--slogbaa-blue);
    background: rgba(59, 130, 246, 0.05);
  }
  .file-drop-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

function CmsSection({ title, queryKey, fetchFn, createFn, deleteFn, fields, token, isSuperAdmin }) {
  const qc = useQueryClient()
  const { data: items = [], isLoading } = useQuery({ queryKey, queryFn: () => fetchFn(token), staleTime: 30_000 })
  const createMut = useMutation({ mutationFn: (data) => createFn(token, data), onSuccess: () => qc.invalidateQueries({ queryKey }) })
  const deleteMut = useMutation({ mutationFn: (id) => deleteFn(token, id), onSuccess: () => qc.invalidateQueries({ queryKey }) })
  const [form, setForm] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploading, setUploading] = useState(null) // key of the field being uploaded
  const [fileMode, setFileMode] = useState({}) // { [key]: 'upload' | 'url' }

  const truncateWords = (str, limit = 150) => {
    if (!str) return ''
    const words = str.split(/\s+/)
    if (words.length <= limit) return str
    return words.slice(0, limit).join(' ') + '...'
  }

  // Pagination state
  const [page, setPage] = useState(0)
  const pageSize = 12
  const totalPages = Math.ceil(items.length / pageSize)
  const paginatedItems = items.slice(page * pageSize, (page + 1) * pageSize)

  const handleFileUpload = async (key, file, subdir = 'library') => {
    if (!file) return
    setUploading(key)
    try {
      const res = await api.uploadFile(token, file, subdir)
      setForm(prev => ({ ...prev, [key]: res.url }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert(`File upload failed: ${err.message}`)
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createMut.mutate(form)
    setForm({})
    setShowForm(false)
  }

  return (
    <section style={s.section}>
      <style>{CMS_STYLE}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={s.subtitle}>{title} ({items.length})</h3>
        {isSuperAdmin && (
          <button type="button" style={{ ...s.btn, ...s.btnPrimary }} onClick={() => setShowForm((v) => !v)}>
            <Icon icon={icons.enroll} size={14} /> {showForm ? 'Cancel' : 'Add'}
          </button>
        )}
      </div>

      {showForm && isSuperAdmin && (
        <form style={{ ...s.form, padding: '2rem' }} onSubmit={handleSubmit}>
          <div className="cms-form-grid">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' || f.fullWidth ? 'cms-form-full' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={s.label}>{f.label} {f.required && <span style={{ color: 'var(--slogbaa-error)' }}>*</span>}</label>
                
                {f.type === 'textarea' ? (
                  <textarea 
                    style={{ ...s.textarea, width: '100%', minHeight: '100px' }} 
                    value={form[f.key] || ''} 
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} 
                    required={f.required} 
                  />
                ) : f.type === 'select' ? (
                  <select 
                    style={{ ...s.input, width: '100%', height: '42px' }} 
                    value={form[f.key] || ''} 
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} 
                    required={f.required}
                  >
                    <option value="">Select category...</option>
                    {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : f.type === 'file' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <button 
                        type="button" 
                        onClick={() => setFileMode(p => ({ ...p, [f.key]: 'upload' }))}
                        style={{ ...s.btn, padding: '0.25rem 0.6rem', background: (fileMode[f.key] || 'upload') === 'upload' ? 'var(--slogbaa-blue)' : 'var(--slogbaa-bg)', color: (fileMode[f.key] || 'upload') === 'upload' ? '#fff' : 'var(--slogbaa-text)' }}
                      >
                        Upload
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setFileMode(p => ({ ...p, [f.key]: 'url' }))}
                        style={{ ...s.btn, padding: '0.25rem 0.6rem', background: fileMode[f.key] === 'url' ? 'var(--slogbaa-blue)' : 'var(--slogbaa-bg)', color: fileMode[f.key] === 'url' ? '#fff' : 'var(--slogbaa-text)' }}
                      >
                        External URL
                      </button>
                    </div>

                    {(fileMode[f.key] || 'upload') === 'upload' ? (
                      <div className="file-drop-zone" style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {uploading === f.key ? (
                          <p style={{ color: 'var(--slogbaa-blue)', fontSize: '0.875rem' }}>Uploading...</p>
                        ) : form[f.key] ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%' }}>
                            <Icon icon={icons.check} size={16} color="var(--slogbaa-success)" />
                            <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                              {form[f.key].split('/').pop()}
                            </span>
                            <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem' }} onClick={() => setForm(p => ({ ...p, [f.key]: '' }))}>Remove</button>
                          </div>
                        ) : (
                          <>
                            <Icon icon={icons.upload} size={20} color="var(--slogbaa-blue)" />
                            <p style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', marginLeft: '1rem' }}>
                              Click to upload {f.label}
                            </p>
                            <input 
                              type="file" 
                              className="file-drop-input" 
                              accept={f.accept} 
                              onChange={(e) => handleFileUpload(f.key, e.target.files[0], f.subdir)} 
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <input 
                        style={{ ...s.input, width: '100%', height: '42px' }} 
                        type="text" 
                        value={form[f.key] || ''} 
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} 
                        placeholder="https://..." 
                      />
                    )}
                  </div>
                ) : (
                  <input 
                    style={{ ...s.input, width: '100%', height: '42px' }} 
                    type={f.type || 'text'} 
                    value={form[f.key] || ''} 
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} 
                    required={f.required} 
                    placeholder={f.placeholder || ''} 
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--slogbaa-border)', paddingTop: '1.5rem' }}>
            <button type="submit" style={{ ...s.btn, ...s.btnPrimary, minWidth: '160px', height: '46px', fontSize: '0.875rem' }} disabled={createMut.isPending || !!uploading}>
              {createMut.isPending ? 'Saving...' : `Save ${title.replace(/s$/i, '')}`}
            </button>
            <button type="button" style={{ ...s.btn, height: '46px', background: 'transparent', color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem' }} onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? <p style={s.empty}>Loading...</p> : items.length === 0 ? <p style={s.empty}>No items yet.</p> : (
        <>
          <div className={title === 'Public Library Resources' ? 'admin-cms-row' : 'admin-cms-grid'}>
            {paginatedItems.map((item) => (
              <div key={item.id} className={title === 'Public Library Resources' ? 'admin-cms-item-row' : 'admin-cms-card'}>
                {title === 'Public Library Resources' && (
                  <img src={item.imageUrl || 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=200&auto=format&fit=crop'} alt="" className="admin-cms-item-thumb" />
                )}
                <div style={{ flex: 1, minWidth: 0, paddingRight: isSuperAdmin ? '3rem' : '1rem' }}>
                  {item.category && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ 
                        fontSize: '0.6875rem', 
                        fontWeight: 800, 
                        letterSpacing: '0.05em', 
                        textTransform: 'uppercase',
                        color: 'var(--slogbaa-blue)',
                        background: 'rgba(59,130,246,0.1)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {item.category}
                      </span>
                    </div>
                  )}

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--slogbaa-text)', fontSize: '1.125rem', display: 'block' }}>
                      {item.title || item.authorName || item.name || 'Item'}
                    </strong>
                  </div>
                  
                  {(item.subtitle || item.description) && (
                    <div style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                      {truncateWords(item.subtitle || item.description, 50)}
                    </div>
                  )}
                  
                  {item.fileUrl && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Icon icon={icons.download} size={12} color="var(--slogbaa-text-muted)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--slogbaa-blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', textDecoration: 'underline' }}>
                        {item.fileUrl}
                      </span>
                    </div>
                  )}
                  
                  {item.quoteText && (
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', fontStyle: 'italic' }}>
                      "{truncateWords(item.quoteText, 50)}"
                    </p>
                  )}
                  
                  {item.youtubeUrl && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Icon icon={icons.video} size={12} color="var(--slogbaa-text-muted)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {item.youtubeUrl}
                      </span>
                    </div>
                  )}
                </div>

                {isSuperAdmin && (
                  <button 
                    type="button" 
                    style={{ ...s.btn, ...s.btnDanger, position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem' }} 
                    onClick={() => setDeleteTarget(item)}
                    title="Delete item"
                  >
                    <Icon icon={icons.delete} size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                style={{ ...s.btn, ...s.btnPrimary, opacity: page === 0 ? 0.5 : 1 }} 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span style={s.label}>Page {page + 1} of {totalPages}</span>
              <button 
                type="button" 
                style={{ ...s.btn, ...s.btnPrimary, opacity: page === totalPages - 1 ? 0.5 : 1 }} 
                disabled={page === totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.title || deleteTarget.authorName || deleteTarget.name}"?`}
          onContinue={() => { deleteMut.mutate(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  )
}

export function AdminCmsPage() {
  const { token, isSuperAdmin } = useOutletContext()
  useDocumentTitle('Homepage CMS')

  return (
    <>
      <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Homepage CMS' }]} />
      <h2 style={s.title}>Homepage Content Management</h2>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
        Manage public homepage sections. Changes appear on the homepage immediately.
      </p>

      <CmsSection title="Public Library Resources" queryKey={queryKeys.admin.cms.libraryResources()} fetchFn={api.getAdminLibraryResources} createFn={api.createLibraryResource} deleteFn={api.deleteLibraryResource} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Title', required: true },
          { key: 'category', label: 'Category', type: 'select', options: ['GENERAL', 'MANUAL', 'REPORT', 'POLICY'], required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true },
          { key: 'fileUrl', label: 'Resource File (PDF, etc.)', type: 'file', subdir: 'library', required: true },
          { key: 'imageUrl', label: 'Cover Image (JPEG, PNG)', type: 'file', subdir: 'library' },
          { key: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
      <CmsSection title="Impact Stories" queryKey={queryKeys.admin.cms.stories()} fetchFn={api.getAdminStories} createFn={api.createStory} deleteFn={api.deleteStory} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'authorName', label: 'Author Name', required: true },
          { key: 'authorRole', label: 'Author Role' },
          { key: 'quoteText', label: 'Story Text', type: 'textarea', required: true },
          { key: 'imageUrl', label: 'Author Image', type: 'file', subdir: 'profiles' },
        ]}
      />
      <CmsSection title="Videos" queryKey={queryKeys.admin.cms.videos()} fetchFn={api.getAdminVideos} createFn={api.createVideo} deleteFn={api.deleteVideo} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Title', required: true },
          { key: 'youtubeUrl', label: 'YouTube URL', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
        ]}
      />
      <CmsSection title="Partner Logos" queryKey={queryKeys.admin.cms.partners()} fetchFn={api.getAdminPartners} createFn={api.createPartner} deleteFn={api.deletePartner} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'name', label: 'Partner Name', required: true },
          { key: 'logoUrl', label: 'Logo Image', type: 'file', subdir: 'profiles' },
          { key: 'websiteUrl', label: 'Website URL', placeholder: 'https://...' },
        ]}
      />
      <CmsSection title="News & Updates" queryKey={queryKeys.admin.cms.news()} fetchFn={api.getAdminNews} createFn={api.createNewsItem} deleteFn={api.deleteNewsItem} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Title', required: true },
          { key: 'tag', label: 'Tag', placeholder: 'e.g. Courses, Events, Updates' },
          { key: 'summary', label: 'Summary', type: 'textarea', required: true },
          { key: 'image', label: 'Cover Image', type: 'file', subdir: 'library' },
          { key: 'publishedDate', label: 'Published Date', type: 'date' },
        ]}
      />
      <AdminNavigatePills />
    </>
  )
}
