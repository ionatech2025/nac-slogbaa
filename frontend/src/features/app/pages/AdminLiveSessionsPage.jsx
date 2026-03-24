import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { AdminNavigatePills } from '../components/admin/AdminNavigatePills.jsx'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'
import { queryKeys } from '../../../lib/query-keys.js'
import { useToast } from '../../../shared/hooks/useToast.js'
import * as api from '../../../api/liveSessions.js'

const s = {
  title: { margin: '0 0 1rem', fontSize: '1.375rem', fontWeight: 700, color: 'var(--slogbaa-blue)' },
  card: { padding: '1.25rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '0.75rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '1.5rem' },
  input: { padding: '0.5rem 0.75rem', border: '1px solid var(--slogbaa-border)', borderRadius: 8, fontSize: '0.875rem', background: 'var(--slogbaa-bg)', width: '100%', boxSizing: 'border-box' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' },
  btn: { padding: '0.45rem 0.875rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 },
  btnPrimary: { background: 'var(--slogbaa-blue)', color: '#fff' },
  btnDanger: { background: 'rgba(220,38,38,0.1)', color: 'var(--slogbaa-error)' },
  label: { fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slogbaa-text)', marginBottom: '0.2rem', display: 'block' },
  badge: (provider) => ({ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.6875rem', fontWeight: 700, background: provider === 'ZOOM' ? 'rgba(37,99,235,0.1)' : 'rgba(5,150,105,0.1)', color: provider === 'ZOOM' ? 'var(--slogbaa-blue)' : 'var(--slogbaa-green)' }),
  empty: { color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' },
  joinBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: 8, background: 'var(--slogbaa-blue)', color: '#fff', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' },
}

export function AdminLiveSessionsPage() {
  const { token, isSuperAdmin } = useOutletContext()
  const qc = useQueryClient()
  const toast = useToast()
  useDocumentTitle('Live Sessions')

  const { data: sessionsRaw, isLoading, isError, error: queryError } = useQuery({
    queryKey: queryKeys.admin.liveSessions.all(),
    queryFn: () => api.getAdminLiveSessions(token),
    staleTime: 30_000,
    enabled: !!token,
  })
  const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : []
  const createMut = useMutation({
    mutationFn: (data) => api.createLiveSession(token, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.liveSessions.all() }),
  })
  const deleteMut = useMutation({
    mutationFn: (id) => api.deleteLiveSession(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.liveSessions.all() })
      toast.success('Session removed.')
    },
    onError: (e) => toast.error(e?.message ?? 'Failed to delete session.'),
  })

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', provider: 'ZOOM', meetingUrl: '', scheduledAt: '', durationMinutes: 60 })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createMut.mutateAsync({
        ...form,
        durationMinutes: Number(form.durationMinutes) || 60,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      })
      setForm({ title: '', description: '', provider: 'ZOOM', meetingUrl: '', scheduledAt: '', durationMinutes: 60 })
      setShowForm(false)
      toast.success('Session scheduled.')
    } catch (err) {
      toast.error(err?.message ?? 'Failed to create session.')
    }
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Live Sessions' }]} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ ...s.title, margin: 0 }}>Live Sessions</h2>
        {isSuperAdmin && (
          <button type="button" style={{ ...s.btn, ...s.btnPrimary }} onClick={() => setShowForm((v) => !v)}>
            <Icon icon={icons.enroll} size={14} /> {showForm ? 'Cancel' : 'Schedule Session'}
          </button>
        )}
      </div>

      {showForm && isSuperAdmin && (
        <form style={s.form} onSubmit={handleSubmit}>
          <div style={s.row}>
            <div><label style={s.label}>Title *</label><input style={s.input} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required /></div>
            <div><label style={s.label}>Provider</label><select style={s.input} value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}><option value="ZOOM">Zoom</option><option value="GOOGLE_MEET">Google Meet</option></select></div>
          </div>
          <div><label style={s.label}>Meeting URL *</label><input style={s.input} value={form.meetingUrl} onChange={(e) => setForm((f) => ({ ...f, meetingUrl: e.target.value }))} required placeholder="https://zoom.us/j/..." /></div>
          <div style={s.row}>
            <div><label style={s.label}>Date & Time *</label><input style={s.input} type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))} required /></div>
            <div><label style={s.label}>Duration (min)</label><input style={s.input} type="number" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} min={1} /></div>
          </div>
          <div><label style={s.label}>Description</label><textarea style={{ ...s.input, minHeight: 50, resize: 'vertical' }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
          <button type="submit" style={{ ...s.btn, ...s.btnPrimary, alignSelf: 'flex-start' }} disabled={createMut.isPending}>
            {createMut.isPending ? 'Saving...' : 'Create Session'}
          </button>
        </form>
      )}

      {isError && (
        <p style={{ ...s.empty, color: 'var(--slogbaa-error)' }} role="alert">
          {queryError?.message ?? 'Failed to load live sessions.'}
        </p>
      )}
      {!isError && isLoading && <p style={s.empty}>Loading...</p>}
      {!isError && !isLoading && sessions.length === 0 && <p style={s.empty}>No live sessions scheduled yet.</p>}
      {!isError && !isLoading && sessions.length > 0 && (
        sessions.map((session) => (
          <div key={session.id} style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: 'var(--slogbaa-text)' }}>{session.title}</h3>
                <span style={s.badge(session.provider)}>{session.provider === 'GOOGLE_MEET' ? 'Google Meet' : 'Zoom'}</span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>
                  {new Date(session.scheduledAt).toLocaleString()} &middot; {session.durationMinutes} min
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" style={s.joinBtn}>
                  <Icon icon={icons.externalLink} size={14} /> Join
                </a>
                {isSuperAdmin && (
                  <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => setDeleteTarget(session)}>
                    <Icon icon={icons.delete} size={14} />
                  </button>
                )}
              </div>
            </div>
            {session.description && <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>{session.description}</p>}
          </div>
        ))
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete session "${deleteTarget.title}"?`}
          onContinue={() => { deleteMut.mutate(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <AdminNavigatePills />
    </>
  )
}
