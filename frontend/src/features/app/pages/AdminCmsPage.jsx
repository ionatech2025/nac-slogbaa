import { useState, useRef } from 'react'
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
  section: {
    marginBottom: '3rem',
    background: 'var(--slogbaa-surface)',
    borderRadius: 24,
    border: '1px solid var(--slogbaa-border)',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  },
  sectionHeader: {
    padding: '1.5rem 2rem',
    background: 'rgba(59,130,246,0.03)',
    borderBottom: '1px solid var(--slogbaa-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitle: { margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--slogbaa-blue)', display: 'flex', alignItems: 'center', gap: '0.75rem' },
  sectionBody: { padding: '2rem' },
  card: {
    padding: '1.25rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
    position: 'relative',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    padding: '2.5rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-blue)',
    background: 'var(--slogbaa-surface)',
    marginBottom: '2rem',
    boxShadow: '0 20px 40px rgba(59,130,246,0.08)'
  },
  input: { padding: '0.75rem 1rem', border: '1px solid var(--slogbaa-border)', borderRadius: 10, fontSize: '0.9375rem', background: 'var(--slogbaa-bg)', width: '100%' },
  textarea: { padding: '0.75rem 1rem', border: '1px solid var(--slogbaa-border)', borderRadius: 10, fontSize: '0.9375rem', background: 'var(--slogbaa-bg)', minHeight: 100, resize: 'vertical', width: '100%' },
  btn: { padding: '0.6rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' },
  btnPrimary: { background: 'var(--slogbaa-blue)', color: '#fff' },
  btnDanger: { background: 'rgba(220,38,38,0.1)', color: 'var(--slogbaa-error)' },
  empty: { color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem', padding: '3rem 0', textAlign: 'center' },
  label: { fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slogbaa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  hint: { fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)', marginTop: '0.4rem', lineHeight: 1.4 },
}

const UG_DISTRICTS = [
  "Abim", "Adjumani", "Agago", "Alebtong", "Amolatar", "Amudat", "Amuria", "Amuru", "Apac", "Arua",
  "Budaka", "Bududa", "Bugiri", "Bugweri", "Buhweju", "Buikwe", "Bukedea", "Bukomansimbi", "Bukwo", "Bulambuli", "Buliisa", "Bundibugyo", "Bunyangabu", "Bushenyi", "Busia", "Butaleja", "Butambala", "Butebo", "Buvuma", "Buyende",
  "Dokolo", "Gomba", "Gulu", "Hoima", "Ibanda", "Iganga", "Isingiro", "Jinja", "Kaabong", "Kabale", "Kabarole", "Kaberamaido", "Kagadi", "Kakumiro", "Kalaki", "Kalangala", "Kaliro", "Kalungu", "Kampala", "Kamuli", "Kamwenge", "Kanungu", "Kapchorwa", "Kapelebyong", "Karenga", "Kasanda", "Kasese", "Katakwi", "Kayunga", "Kazo", "Kibaale", "Kiboga", "Kibuku", "Kikuube", "Kiruhura", "Kiryandongo", "Kisoro", "Kitagwenda", "Kitgum", "Koboko", "Kole", "Kotido", "Kumi", "Kwania", "Kween", "Kyankwanzi", "Kyegegwa", "Kyenjojo", "Kyotera",
  "Lamwo", "Lira", "Luuka", "Luwero", "Lwengo", "Lyantonde", "Madi-Okollo", "Manafwa", "Maracha", "Masaka", "Masindi", "Mayuge", "Mbale", "Mbarara", "Mitooma", "Mityana", "Moroto", "Moyo", "Mpigi", "Mubende", "Mukono",
  "Nabilatuk", "Nakapiripirit", "Nakaseke", "Nakasongola", "Namayingo", "Namisindwa", "Namutumba", "Napak", "Nebbi", "Ngora", "Ntoroko", "Ntungamo", "Nwoya", "Obongi", "Omoro", "Otuke", "Oyam",
  "Pader", "Pakwach", "Pallisa", "Rakai", "Rubanda", "Rubirizi", "Rukiga", "Rukungiri", "Rwampara", "Sembabule", "Serere", "Sheema", "Sironko", "Soroti", "Terego", "Tororo", "Wakiso", "Yumbe", "Zombo"
].sort()

const CMS_STYLE = `
  .admin-cms-row {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
  }
  .admin-cms-item-row {
    position: relative;
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid var(--slogbaa-border);
    background: var(--slogbaa-bg);
    display: flex;
    gap: 1.75rem;
    align-items: center;
    transition: all 0.25s ease;
  }
  .admin-cms-item-row:hover {
    border-color: var(--slogbaa-blue);
    background: var(--slogbaa-surface);
    transform: translateX(4px);
  }
  .admin-cms-item-thumb {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    object-fit: cover;
    background: var(--slogbaa-bg-2);
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  /* Grid for cards */
  .admin-cms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }
  .admin-cms-card {
    position: relative;
    padding: 1.5rem;
    border-radius: 18px;
    border: 1px solid var(--slogbaa-border);
    background: var(--slogbaa-bg);
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    min-height: 200px;
  }
  .admin-cms-card:hover {
    border-color: var(--slogbaa-blue);
    box-shadow: 0 12px 30px rgba(0,0,0,0.1);
    transform: translateY(-4px);
  }

  .admin-video-thumb {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 10px;
    object-fit: cover;
    margin-bottom: 1rem;
    background: #000;
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

function CmsSection({ title, queryKey, fetchFn, createFn, updateFn, deleteFn, fields, token, isSuperAdmin }) {
  const qc = useQueryClient()
  const sectionRef = useRef(null)
  const { data: items = [], isLoading } = useQuery({ queryKey, queryFn: () => fetchFn(token), staleTime: 30_000 })
  const createMut = useMutation({ mutationFn: (data) => createFn(token, data), onSuccess: () => qc.invalidateQueries({ queryKey }) })
  const updateMut = useMutation({ mutationFn: (data) => updateFn(token, data.id, data), onSuccess: () => qc.invalidateQueries({ queryKey }) })
  const deleteMut = useMutation({ mutationFn: (id) => deleteFn(token, id), onSuccess: () => qc.invalidateQueries({ queryKey }) })
  const [form, setForm] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploading, setUploading] = useState(null) // key of the field being uploaded
  const [fileMode, setFileMode] = useState({}) // { [key]: 'upload' | 'url' }

  const truncateWords = (str, limit = 150) => {
    if (!str) return ''
    // Strip markdown for preview
    const plain = str.replace(/^[#>\s]+|##+|###+/gm, '')
    const words = plain.split(/\s+/)
    if (words.length <= limit) return plain
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
    if (editingId) {
      updateMut.mutate({ ...form, id: editingId })
    } else {
      createMut.mutate(form)
    }
    setForm({})
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (item) => {
    setForm(item)
    setEditingId(item.id)
    setShowForm(true)
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const cancelForm = () => {
    setForm({})
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <section ref={sectionRef} style={s.section}>
      <style>{CMS_STYLE}</style>
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>
          <Icon icon={title.includes('Library') ? icons.fileText : title.includes('Stories') ? icons.users : icons.video} size={20} />
          {title} <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: '0.5rem' }}>— {items.length} total</span>
        </h3>
        {isSuperAdmin && (
          <button type="button" style={{ ...s.btn, ...s.btnPrimary, background: showForm ? 'var(--slogbaa-error)' : 'var(--slogbaa-blue)' }} onClick={showForm ? cancelForm : () => { setShowForm(true); sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
            <Icon icon={showForm ? icons.close : icons.plus} size={16} /> {showForm ? 'Cancel' : 'Add New'}
          </button>
        )}
      </div>

      <div style={s.sectionBody}>
        {showForm && isSuperAdmin && (
          <form style={s.form} onSubmit={handleSubmit}>
            <div className="cms-form-grid">
              {fields.map((f) => (
                <div key={f.key} className={f.type === 'textarea' || f.fullWidth ? 'cms-form-full' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={s.label}>{f.label} {f.required && <span style={{ color: 'var(--slogbaa-error)' }}>*</span>}</label>

                  {f.type === 'textarea' ? (
                    <>
                      <textarea
                        style={{ ...s.textarea, width: '100%', minHeight: '100px' }}
                        value={form[f.key] || ''}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        required={f.required}
                      />
                      {f.instructions && 
                        <div style={s.hint}>{f.instructions}</div>}
                    </>
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
                ) : f.type === 'searchable' ? (
                  <>
                    <input
                      style={{ ...s.input, width: '100%', height: '42px' }}
                      list={`list-${f.key}`}
                      value={form[f.key] || ''}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      required={f.required}
                      placeholder={f.placeholder || 'Search or select...'}
                    />
                    <datalist id={`list-${f.key}`}>
                      {f.options.map(opt => <option key={opt} value={opt} />)}
                    </datalist>
                  </>
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
              <button type="submit" style={{ ...s.btn, ...s.btnPrimary, minWidth: '160px', height: '46px', fontSize: '0.875rem' }} disabled={createMut.isPending || updateMut.isPending || !!uploading}>
                {(createMut.isPending || updateMut.isPending) ? 'Saving...' : editingId ? `Update ${title.replace(/s$/i, '')}` : `Save ${title.replace(/s$/i, '')}`}
              </button>
              <button type="button" style={{ ...s.btn, height: '46px', background: 'transparent', color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem' }} onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        )}
        {isLoading ? (
          <div style={s.empty}><p>Loading components...</p></div>
        ) : items.length === 0 ? (
          <p style={s.empty}>No content items listed in this section.</p>
        ) : (
          <>
            <div className={title === 'Public Library Resources' || title === 'Impact Stories' ? 'admin-cms-row' : 'admin-cms-grid'}>
              {paginatedItems.map((item) => {
                const ytId = item.youtubeUrl ? (item.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/) || [])[1] : null;

                return (
                  <div key={item.id} className={title === 'Public Library Resources' || title === 'Impact Stories' ? 'admin-cms-item-row' : 'admin-cms-card'}>
                    {ytId && (
                      <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} className="admin-video-thumb" alt="" />
                    )}

                    {(item.imageUrl || item.image || item.logoUrl) && (
                      <img src={item.imageUrl || item.image || item.logoUrl} alt="" className="admin-cms-item-thumb" />
                    )}

                    <div style={{ flex: 1, minWidth: 0, paddingRight: isSuperAdmin ? '3rem' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        {item.category && (
                          <span style={{
                            fontSize: '0.625rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: 'var(--slogbaa-blue)',
                            background: 'rgba(59,130,246,0.1)',
                            padding: '0.15rem 0.6rem',
                            borderRadius: '100px'
                          }}>
                            {item.category}
                          </span>
                        )}
                        {item.sortOrder !== undefined && (
                          <span style={{ fontSize: '0.625rem', color: 'var(--slogbaa-text-muted)' }}>Order: {item.sortOrder}</span>
                        )}
                      </div>

                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--slogbaa-text)', fontSize: '1.25rem', display: 'block', lineHeight: 1.2 }}>
                          {item.title || item.authorName || item.name || 'Untitled Resource'}
                        </strong>
                        {(item.authorRole || item.location) && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                            {item.authorRole} {item.location && `• ${item.location}`}
                          </span>
                        )}
                      </div>

                      {(item.subtitle || item.description || item.storyText || item.summary) && (
                        <div style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                          {truncateWords(item.subtitle || item.description || item.storyText || item.summary, 30)}
                        </div>
                      )}

                      {item.fileUrl && (
                        <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                          <Icon icon={icons.fileText} size={12} color="var(--slogbaa-blue)" />
                          <span style={{ fontSize: '0.75rem', color: 'var(--slogbaa-blue)', textDecoration: 'underline' }}>
                            View Document Asset
                          </span>
                        </a>
                      )}

                      {item.youtubeUrl && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Icon icon={icons.video} size={12} color="var(--orange)" />
                          <span style={{ fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {item.youtubeUrl}
                          </span>
                        </div>
                      )}

                      {item.websiteUrl && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Icon icon={icons.link} size={12} color="var(--slogbaa-blue)" />
                          <span style={{ fontSize: '0.75rem', color: 'var(--slogbaa-blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.websiteUrl}
                          </span>
                        </div>
                      )}
                    </div>

                    {isSuperAdmin && (
                      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          style={{
                            ...s.btn,
                            background: 'rgba(59,130,246,0.1)',
                            color: 'var(--slogbaa-blue)',
                            width: '40px',
                            height: '40px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            boxShadow: '0 4px 12px rgba(59,130,246,0.1)'
                          }}
                          onClick={() => startEdit(item)}
                          title="Edit item"
                        >
                          <Icon icon={icons.edit} size={16} />
                        </button>
                        <button
                          type="button"
                          style={{
                            ...s.btn,
                            ...s.btnDanger,
                            width: '40px',
                            height: '40px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            boxShadow: '0 4px 12px rgba(220,38,38,0.1)'
                          }}
                          onClick={() => setDeleteTarget(item)}
                          title="Delete item"
                        >
                          <Icon icon={icons.delete} size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
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
      </div>

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

       <CmsSection title="Public Library Resources" queryKey={queryKeys.admin.cms.libraryResources()} fetchFn={api.getAdminLibraryResources} createFn={api.createLibraryResource} updateFn={api.updateLibraryResource} deleteFn={api.deleteLibraryResource} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Title', required: true },
          { key: 'category', label: 'Category', type: 'select', options: ['GENERAL', 'MANUAL', 'REPORT', 'POLICY'], required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true },
          { key: 'fileUrl', label: 'Resource File (PDF, etc.)', type: 'file', subdir: 'library', required: true },
          { key: 'imageUrl', label: 'Cover Image (JPEG, PNG)', type: 'file', subdir: 'library' },
          { key: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
      <CmsSection title="Impact Stories" queryKey={queryKeys.admin.cms.stories()} fetchFn={api.getAdminStories} createFn={api.createStory} updateFn={api.updateStory} deleteFn={api.deleteStory} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Story Title (H1)', required: true, fullWidth: true },
          { key: 'authorName', label: 'Author Name', required: true },
          { key: 'authorRole', label: 'Author Role in Community' },
          { key: 'location', label: 'Location (District in Uganda)', required: true, type: 'searchable', options: UG_DISTRICTS, placeholder: 'Search for a district...' },
          { key: 'storyText', label: 'Story Content', type: 'textarea', required: true, fullWidth: true, instructions: 'Use # for Category/Topic Headings (Stylized), ## for standard headings (h2), ### for subheadings (h3), > for blockquotes. Enter twice for new paragraphs.' },
          { key: 'imageUrl', label: 'Story Image', type: 'file', subdir: 'stories' },
          { key: 'coursesCompleted', label: 'Courses Completed (Optional)' },
          { key: 'projectImpact', label: 'Project Impact (Optional)', type: 'textarea' },
          { key: 'certification', label: 'Certification (Optional)' },
          { key: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
      <CmsSection title="Videos" queryKey={queryKeys.admin.cms.videos()} fetchFn={api.getAdminVideos} createFn={api.createVideo} updateFn={api.updateVideo} deleteFn={api.deleteVideo} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Title', required: true },
          { key: 'youtubeUrl', label: 'YouTube URL', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
        ]}
      />
      <CmsSection title="Partner Logos" queryKey={queryKeys.admin.cms.partners()} fetchFn={api.getAdminPartners} createFn={api.createPartner} updateFn={api.updatePartner} deleteFn={api.deletePartner} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'name', label: 'Partner Name', required: true },
          { key: 'logoUrl', label: 'Logo Image', type: 'file', subdir: 'profiles' },
          { key: 'websiteUrl', label: 'Website URL', placeholder: 'https://...' },
        ]}
      />
      <CmsSection title="News & Updates" queryKey={queryKeys.admin.cms.news()} fetchFn={api.getAdminNews} createFn={api.createNewsItem} updateFn={api.updateNewsItem} deleteFn={api.deleteNewsItem} token={token} isSuperAdmin={isSuperAdmin}
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
