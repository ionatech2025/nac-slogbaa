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

function CmsSection({ title, queryKey, fetchFn, createFn, deleteFn, fields, token, isSuperAdmin }) {
  const qc = useQueryClient()
  const { data: items = [], isLoading } = useQuery({ queryKey, queryFn: () => fetchFn(token), staleTime: 30_000 })
  const createMut = useMutation({ mutationFn: (data) => createFn(token, data), onSuccess: () => qc.invalidateQueries({ queryKey }) })
  const deleteMut = useMutation({ mutationFn: (id) => deleteFn(token, id), onSuccess: () => qc.invalidateQueries({ queryKey }) })
  const [form, setForm] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    createMut.mutate(form)
    setForm({})
    setShowForm(false)
  }

  return (
    <section style={s.section}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={s.subtitle}>{title} ({items.length})</h3>
        {isSuperAdmin && (
          <button type="button" style={{ ...s.btn, ...s.btnPrimary }} onClick={() => setShowForm((v) => !v)}>
            <Icon icon={icons.enroll} size={14} /> {showForm ? 'Cancel' : 'Add'}
          </button>
        )}
      </div>

      {showForm && isSuperAdmin && (
        <form style={s.form} onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div key={f.key}>
              <label style={s.label}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea style={s.textarea} value={form[f.key] || ''} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} required={f.required} />
              ) : (
                <input style={s.input} type={f.type || 'text'} value={form[f.key] || ''} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} required={f.required} placeholder={f.placeholder || ''} />
              )}
            </div>
          ))}
          <button type="submit" style={{ ...s.btn, ...s.btnPrimary, alignSelf: 'flex-start' }} disabled={createMut.isPending}>
            {createMut.isPending ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}

      {isLoading ? <p style={s.empty}>Loading...</p> : items.length === 0 ? <p style={s.empty}>No items yet.</p> : (
        items.map((item) => (
          <div key={item.id} style={s.card}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ color: 'var(--slogbaa-text)' }}>{item.title || item.authorName || item.name || 'Item'}</strong>
              {item.subtitle && <span style={{ marginLeft: '0.5rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.8125rem' }}>{item.subtitle}</span>}
              {item.quoteText && <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>{item.quoteText.slice(0, 80)}...</p>}
              {item.youtubeUrl && <span style={{ fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)' }}>{item.youtubeUrl}</span>}
            </div>
            {isSuperAdmin && (
              <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => setDeleteTarget(item)}>
                <Icon icon={icons.delete} size={14} />
              </button>
            )}
          </div>
        ))
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

      <CmsSection title="Banner Slides" queryKey={queryKeys.admin.cms.banners()} fetchFn={api.getAdminBanners} createFn={api.createBanner} deleteFn={api.deleteBanner} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Title', required: true },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
          { key: 'imageUrl', label: 'Image URL', placeholder: 'https://...' },
          { key: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
      <CmsSection title="Impact Stories" queryKey={queryKeys.admin.cms.stories()} fetchFn={api.getAdminStories} createFn={api.createStory} deleteFn={api.deleteStory} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'authorName', label: 'Author Name', required: true },
          { key: 'authorRole', label: 'Author Role' },
          { key: 'quoteText', label: 'Story Text', type: 'textarea', required: true },
          { key: 'imageUrl', label: 'Image URL', placeholder: 'https://...' },
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
          { key: 'logoUrl', label: 'Logo URL', placeholder: 'https://...' },
          { key: 'websiteUrl', label: 'Website URL', placeholder: 'https://...' },
        ]}
      />
      <CmsSection title="News & Updates" queryKey={queryKeys.admin.cms.news()} fetchFn={api.getAdminNews} createFn={api.createNewsItem} deleteFn={api.deleteNewsItem} token={token} isSuperAdmin={isSuperAdmin}
        fields={[
          { key: 'title', label: 'Title', required: true },
          { key: 'summary', label: 'Summary', type: 'textarea' },
          { key: 'tag', label: 'Tag', placeholder: 'e.g. Courses, Events, Updates' },
          { key: 'publishedDate', label: 'Published Date', type: 'date' },
        ]}
      />
      <AdminNavigatePills />
    </>
  )
}
