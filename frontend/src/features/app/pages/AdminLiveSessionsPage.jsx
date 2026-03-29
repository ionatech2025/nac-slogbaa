import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs.jsx'
import { AdminNavigatePills } from '../components/admin/AdminNavigatePills.jsx'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'
import { queryKeys } from '../../../lib/query-keys.js'
import { useToast } from '../../../shared/hooks/useToast.js'
import { getAssetUrl } from '../../../api/client.js'
import * as api from '../../../api/liveSessions.js'

function toDatetimeLocalValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function computePhase(scheduledAt, durationMinutes) {
  if (!scheduledAt) return 'UPCOMING'
  const now = Date.now()
  const start = new Date(scheduledAt).getTime()
  const end = start + Number(durationMinutes || 0) * 60_000
  if (now < start) return 'UPCOMING'
  if (now <= end) return 'LIVE'
  return 'PAST'
}

function initialForm() {
  return {
    title: '',
    description: '',
    sessionDetails: '',
    bannerImageUrl: '',
    provider: 'ZOOM',
    meetingUrl: '',
    meetingId: '',
    meetingPassword: '',
    scheduledAt: '',
    durationMinutes: 60,
    active: true,
    speakersJson: '[]',
  }
}

function sessionToForm(session) {
  const sp = session.speakers
  const arr = Array.isArray(sp) ? sp : []
  return {
    title: session.title || '',
    description: session.description || '',
    sessionDetails: session.sessionDetails || '',
    bannerImageUrl: session.bannerImageUrl || '',
    provider: session.provider || 'ZOOM',
    meetingUrl: session.meetingUrl || '',
    meetingId: session.meetingId || '',
    meetingPassword: session.meetingPassword || '',
    scheduledAt: toDatetimeLocalValue(session.scheduledAt),
    durationMinutes: session.durationMinutes ?? 60,
    active: session.active !== false,
    speakersJson: JSON.stringify(arr, null, 2),
  }
}

const s = {
  title: { margin: '0 0 1rem', fontSize: '1.375rem', fontWeight: 700, color: 'var(--slogbaa-blue)' },
  card: { padding: '1.25rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '0.75rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '1.5rem' },
  input: { padding: '0.5rem 0.75rem', border: '1px solid var(--slogbaa-border)', borderRadius: 8, fontSize: '0.875rem', background: 'var(--slogbaa-bg)', width: '100%', boxSizing: 'border-box' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' },
  btn: { padding: '0.45rem 0.875rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 },
  btnSecondary: { background: 'var(--slogbaa-border)', color: 'var(--slogbaa-text)' },
  btnPrimary: { background: 'var(--slogbaa-blue)', color: '#fff' },
  btnDanger: { background: 'rgba(220,38,38,0.1)', color: 'var(--slogbaa-error)' },
  label: { fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slogbaa-text)', marginBottom: '0.2rem', display: 'block' },
  badge: (provider) => ({ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.6875rem', fontWeight: 700, background: provider === 'ZOOM' ? 'rgba(37,99,235,0.1)' : 'rgba(5,150,105,0.1)', color: provider === 'ZOOM' ? 'var(--slogbaa-blue)' : 'var(--slogbaa-green)' }),
  phase: (ph) => ({
    display: 'inline-block', marginLeft: '0.35rem', padding: '0.12rem 0.45rem', borderRadius: 6, fontSize: '0.625rem', fontWeight: 700,
    background: ph === 'LIVE' ? 'rgba(220,38,38,0.12)' : ph === 'UPCOMING' ? 'rgba(37,99,235,0.1)' : 'rgba(100,116,139,0.12)',
    color: ph === 'LIVE' ? '#b91c1c' : ph === 'UPCOMING' ? 'var(--slogbaa-blue)' : 'var(--slogbaa-text-muted)',
  }),
  empty: { color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' },
  joinBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: 8, background: 'var(--slogbaa-blue)', color: '#fff', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' },
  sectionTitle: { margin: '1.25rem 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  banner: { width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 10, marginBottom: '0.75rem' },
}

function SessionCard({ session, isSuperAdmin, onEdit, onDelete, phase }) {
  const banner = getAssetUrl(session.bannerImageUrl)
  return (
    <div style={s.card}>
      {banner ? <img src={banner} alt="" style={s.banner} /> : null}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: 'var(--slogbaa-text)' }}>{session.title}</h3>
          <span style={s.badge(session.provider)}>{session.provider === 'GOOGLE_MEET' ? 'Google Meet' : 'Zoom'}</span>
          <span style={s.phase(phase)}>{phase === 'LIVE' ? 'Live now' : phase === 'UPCOMING' ? 'Upcoming' : 'Past'}</span>
          <span style={{ marginLeft: '0.5rem', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>
            {new Date(session.scheduledAt).toLocaleString()} &middot; {session.durationMinutes} min
            {typeof session.registrationCount === 'number' ? ` · ${session.registrationCount} registered` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" style={s.joinBtn}>
            <Icon icon={icons.externalLink} size={14} /> Join
          </a>
          {isSuperAdmin && (
            <>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => onEdit(session)}>
                <Icon icon={icons.edit} size={14} /> Edit
              </button>
              <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => onDelete(session)}>
                <Icon icon={icons.delete} size={14} />
              </button>
            </>
          )}
        </div>
      </div>
      {session.description && <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>{session.description}</p>}
      {session.sessionDetails && (
        <pre style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text)', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{session.sessionDetails}</pre>
      )}
    </div>
  )
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

  const grouped = useMemo(() => {
    const upcoming = []
    const live = []
    const past = []
    for (const session of sessions) {
      const ph = computePhase(session.scheduledAt, session.durationMinutes)
      if (ph === 'UPCOMING') upcoming.push({ session, phase: ph })
      else if (ph === 'LIVE') live.push({ session, phase: ph })
      else past.push({ session, phase: ph })
    }
    upcoming.sort((a, b) => new Date(a.session.scheduledAt) - new Date(b.session.scheduledAt))
    live.sort((a, b) => new Date(a.session.scheduledAt) - new Date(b.session.scheduledAt))
    past.sort((a, b) => new Date(b.session.scheduledAt) - new Date(a.session.scheduledAt))
    return { upcoming, live, past }
  }, [sessions])

  const createMut = useMutation({
    mutationFn: (data) => api.createLiveSession(token, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.liveSessions.all() }),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => api.updateLiveSession(token, id, data),
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
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const resetFormAndClose = () => {
    setForm(initialForm())
    setEditingId(null)
    setShowForm(false)
  }

  const buildPayload = () => {
    let speakers
    try {
      speakers = form.speakersJson.trim() ? JSON.parse(form.speakersJson) : []
      if (!Array.isArray(speakers)) throw new Error('Speakers must be a JSON array')
    } catch {
      toast.error('Speakers must be valid JSON (array of { name, role, bio, photoUrl }).')
      return null
    }
    return {
      title: form.title.trim(),
      description: form.description || null,
      sessionDetails: form.sessionDetails || null,
      bannerImageUrl: form.bannerImageUrl?.trim() || null,
      provider: form.provider,
      meetingUrl: form.meetingUrl.trim(),
      meetingId: form.meetingId?.trim() || null,
      meetingPassword: form.meetingPassword?.trim() || null,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      durationMinutes: Number(form.durationMinutes) || 60,
      active: form.active,
      speakers,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = buildPayload()
    if (!payload) return
    try {
      if (editingId) {
        await updateMut.mutateAsync({ id: editingId, data: payload })
        toast.success('Session updated.')
      } else {
        await createMut.mutateAsync(payload)
        toast.success('Session scheduled.')
      }
      resetFormAndClose()
    } catch (err) {
      toast.error(err?.message ?? (editingId ? 'Failed to update session.' : 'Failed to create session.'))
    }
  }

  const startEdit = (session) => {
    setForm(sessionToForm(session))
    setEditingId(session.id)
    setShowForm(true)
  }

  const busy = createMut.isPending || updateMut.isPending

  return (
    <>
      <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Live Sessions' }]} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ ...s.title, margin: 0 }}>Live Sessions</h2>
        {isSuperAdmin && (
          <button
            type="button"
            style={{ ...s.btn, ...s.btnPrimary }}
            onClick={() => {
              if (showForm) resetFormAndClose()
              else {
                setForm(initialForm())
                setEditingId(null)
                setShowForm(true)
              }
            }}
          >
            <Icon icon={icons.enroll} size={14} />{' '}
            {showForm ? 'Close' : 'Schedule Session'}
          </button>
        )}
      </div>

      {showForm && isSuperAdmin && (
        <form style={s.form} onSubmit={handleSubmit}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            {editingId ? 'Update session details, speakers, banner, and join credentials.' : 'Super Admin only: create a session. Trainees are notified and can register to receive join details.'}
          </p>
          <div style={s.row}>
            <div><label style={s.label}>Title *</label><input style={s.input} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required /></div>
            <div><label style={s.label}>Provider</label><select style={s.input} value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}><option value="ZOOM">Zoom</option><option value="GOOGLE_MEET">Google Meet</option></select></div>
          </div>
          <div><label style={s.label}>Meeting URL *</label><input style={s.input} value={form.meetingUrl} onChange={(e) => setForm((f) => ({ ...f, meetingUrl: e.target.value }))} required placeholder="https://zoom.us/j/... or Meet link" /></div>
          <div style={s.row}>
            <div><label style={s.label}>Meeting ID</label><input style={s.input} value={form.meetingId} onChange={(e) => setForm((f) => ({ ...f, meetingId: e.target.value }))} placeholder="Optional" /></div>
            <div><label style={s.label}>Passcode / password</label><input style={s.input} value={form.meetingPassword} onChange={(e) => setForm((f) => ({ ...f, meetingPassword: e.target.value }))} placeholder="Optional" /></div>
          </div>
          <div style={s.row}>
            <div><label style={s.label}>Date & Time *</label><input style={s.input} type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))} required /></div>
            <div><label style={s.label}>Duration (min)</label><input style={s.input} type="number" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} min={1} /></div>
          </div>
          <div><label style={s.label}>Banner image URL</label><input style={s.input} value={form.bannerImageUrl} onChange={(e) => setForm((f) => ({ ...f, bannerImageUrl: e.target.value }))} placeholder="https://..." /></div>
          <div><label style={s.label}>Short description</label><textarea style={{ ...s.input, minHeight: 50, resize: 'vertical' }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
          <div><label style={s.label}>Session details / agenda</label><textarea style={{ ...s.input, minHeight: 80, resize: 'vertical' }} value={form.sessionDetails} onChange={(e) => setForm((f) => ({ ...f, sessionDetails: e.target.value }))} placeholder="What will be covered (shown to trainees)" /></div>
          <div><label style={s.label}>Speakers (JSON array)</label><textarea style={{ ...s.input, minHeight: 120, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8125rem' }} value={form.speakersJson} onChange={(e) => setForm((f) => ({ ...f, speakersJson: e.target.value }))} spellCheck={false} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Active (visible to trainees)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="submit" style={{ ...s.btn, ...s.btnPrimary }} disabled={busy}>
              {busy ? 'Saving...' : editingId ? 'Update session' : 'Create session'}
            </button>
            <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={resetFormAndClose}>
              Cancel
            </button>
          </div>
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
        <>
          {grouped.live.length > 0 && (
            <>
              <h3 style={s.sectionTitle}>Live now</h3>
              {grouped.live.map(({ session, phase }) => (
                <SessionCard key={session.id} session={session} phase={phase} isSuperAdmin={isSuperAdmin} onEdit={startEdit} onDelete={setDeleteTarget} />
              ))}
            </>
          )}
          {grouped.upcoming.length > 0 && (
            <>
              <h3 style={s.sectionTitle}>Upcoming</h3>
              {grouped.upcoming.map(({ session, phase }) => (
                <SessionCard key={session.id} session={session} phase={phase} isSuperAdmin={isSuperAdmin} onEdit={startEdit} onDelete={setDeleteTarget} />
              ))}
            </>
          )}
          {grouped.past.length > 0 && (
            <>
              <h3 style={s.sectionTitle}>Past</h3>
              {grouped.past.map(({ session, phase }) => (
                <SessionCard key={session.id} session={session} phase={phase} isSuperAdmin={isSuperAdmin} onEdit={startEdit} onDelete={setDeleteTarget} />
              ))}
            </>
          )}
        </>
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
