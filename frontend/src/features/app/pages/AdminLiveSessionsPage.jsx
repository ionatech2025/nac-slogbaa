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
    speakers: [],
  }
}

function sessionToForm(session) {
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
    speakers: Array.isArray(session.speakers) ? [...session.speakers] : [],
  }
}

const s = {
  title: { margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--slogbaa-text)', letterSpacing: '-0.025em' },
  card: { padding: '1.5rem', borderRadius: 20, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem', borderRadius: 24, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-surface)', marginBottom: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' },
  input: { padding: '0.75rem 1rem', border: '1px solid var(--slogbaa-border)', borderRadius: 12, fontSize: '0.9375rem', background: 'var(--slogbaa-bg)', width: '100%', boxSizing: 'border-box', color: 'var(--slogbaa-text)', transition: 'border-color 0.2s, box-shadow 0.2s' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'transform 0.1s, opacity 0.2s' },
  btnSecondary: { background: 'var(--slogbaa-bg)', color: 'var(--slogbaa-text)', border: '1px solid var(--slogbaa-border)' },
  btnPrimary: { background: 'var(--slogbaa-blue)', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' },
  btnDanger: { background: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  btnGhost: { background: 'transparent', color: 'var(--slogbaa-text-muted)', border: '1px solid transparent' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: 'var(--slogbaa-text)', marginBottom: '0.5rem', display: 'block' },
  badge: (provider) => ({ display: 'inline-block', padding: '0.25rem 0.625rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, background: provider === 'ZOOM' ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.1)', color: provider === 'ZOOM' ? 'var(--slogbaa-blue)' : '#10b981' }),
  phase: (ph) => ({
    display: 'inline-block', marginLeft: '0.5rem', padding: '0.25rem 0.625rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
    background: ph === 'LIVE' ? 'rgba(239,68,68,0.1)' : ph === 'UPCOMING' ? 'rgba(37,99,235,0.1)' : 'rgba(107,114,128,0.1)',
    color: ph === 'LIVE' ? '#ef4444' : ph === 'UPCOMING' ? 'var(--slogbaa-blue)' : '#6b7280',
  }),
  empty: { color: 'var(--slogbaa-text-muted)', fontSize: '1rem', textAlign: 'center', padding: '4rem 0' },
  joinBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: 12, background: 'var(--slogbaa-blue)', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 },
  sectionTitle: { margin: '2.5rem 0 1rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--slogbaa-text)', display: 'flex', alignItems: 'center', gap: '0.75rem' },
  banner: { width: '100%', height: 160, objectFit: 'cover', borderRadius: 16, marginBottom: '1.25rem' },
  speakerItem: { padding: '1.25rem', borderRadius: 16, border: '1px solid var(--slogbaa-border)', background: 'var(--slogbaa-bg)', marginBottom: '1rem', position: 'relative' },
  speakerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.75rem' },
}

function SpeakerManager({ speakers, onUpdate }) {
  const addSpeaker = () => {
    onUpdate([...speakers, { name: '', role: '', bio: '', photoUrl: '', displayOrder: speakers.length }])
  }

  const updateSpeaker = (index, field, value) => {
    const next = [...speakers]
    next[index] = { ...next[index], [field]: value }
    onUpdate(next)
  }

  const removeSpeaker = (index) => {
    onUpdate(speakers.filter((_, i) => i !== index))
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label style={s.label}>Speakers ({speakers.length})</label>
        <button type="button" onClick={addSpeaker} style={{ ...s.btn, ...s.btnSecondary, padding: '0.35rem 0.75rem' }}>
          <Icon icon={icons.enroll} size={14} /> Add Speaker
        </button>
      </div>
      
      {speakers.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed var(--slogbaa-border)', borderRadius: 16, color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem' }}>
          No speakers added yet. Click "Add Speaker" to include them.
        </div>
      )}

      {speakers.map((sp, i) => (
        <div key={i} style={s.speakerItem}>
          <button 
            type="button" 
            onClick={() => removeSpeaker(i)} 
            style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', ...s.btnGhost, color: '#ef4444', padding: '0.25rem' }}
          >
            <Icon icon={icons.delete} size={16} />
          </button>
          
          <div style={s.row}>
            <div>
              <label style={{ ...s.label, fontSize: '0.75rem' }}>Name *</label>
              <input 
                style={{ ...s.input, padding: '0.5rem 0.75rem' }} 
                value={sp.name} 
                onChange={(e) => updateSpeaker(i, 'name', e.target.value)} 
                placeholder="Full Name"
                required
              />
            </div>
            <div>
              <label style={{ ...s.label, fontSize: '0.75rem' }}>Role / Organization</label>
              <input 
                style={{ ...s.input, padding: '0.5rem 0.75rem' }} 
                value={sp.role} 
                onChange={(e) => updateSpeaker(i, 'role', e.target.value)} 
                placeholder="e.g. Senior Advocate"
              />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label style={{ ...s.label, fontSize: '0.75rem' }}>Bio</label>
            <textarea 
              style={{ ...s.input, padding: '0.5rem 0.75rem', minHeight: 60 }} 
              value={sp.bio} 
              onChange={(e) => updateSpeaker(i, 'bio', e.target.value)} 
              placeholder="Short bio for the speaker..."
            />
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ ...s.label, fontSize: '0.75rem' }}>Photo URL</label>
              <input 
                style={{ ...s.input, padding: '0.5rem 0.75rem' }} 
                value={sp.photoUrl} 
                onChange={(e) => updateSpeaker(i, 'photoUrl', e.target.value)} 
                placeholder="https://images.unsplash.com/photo-xxx..."
              />
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--slogbaa-border)', overflow: 'hidden', border: '1px solid var(--slogbaa-border)', flexShrink: 0 }}>
              {sp.photoUrl ? (
                <img src={getAssetUrl(sp.photoUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = ''; e.target.style.display = 'none' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slogbaa-text-muted)' }}>
                  <Icon icon={icons.profile} size={18} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SessionCard({ session, isSuperAdmin, onEdit, onDelete, phase }) {
  const banner = getAssetUrl(session.bannerImageUrl)
  return (
    <div style={{ ...s.card, padding: 0, overflow: 'hidden', border: '1px solid var(--slogbaa-border)', position: 'relative', background: 'var(--slogbaa-surface)' }}>
      {/* Flyer Banner Section */}
      <div style={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden' }}>
        {banner ? (
          <img src={banner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(225deg, #1e293b 0%, #0f172a 100%)' }} />
        )}
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ ...s.badge(session.provider), background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {session.provider === 'GOOGLE_MEET' ? 'Google Meet' : 'Zoom'}
            </span>
            <span style={s.phase(phase)}>{phase === 'LIVE' ? 'Live now' : phase === 'UPCOMING' ? 'Upcoming' : 'Past'}</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{session.title}</h3>
          
          {/* Prominent Speakers on Flyer */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {session.speakers?.map((sp, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.12)', padding: '0.5rem 1rem', borderRadius: 16, backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, var(--slogbaa-blue), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
                  {sp.photoUrl ? (
                    <img 
                      src={getAssetUrl(sp.photoUrl)} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  <div style={{ display: sp.photoUrl ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', fontWeight: 800 }}>
                    {sp.name?.[0]}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{sp.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', fontWeight: 500 }}>
            <Icon icon={icons.enroll} size={14} />
            {new Date(session.scheduledAt).toLocaleString()} &middot; {session.durationMinutes} min
            {typeof session.registrationCount === 'number' ? ` · ${session.registrationCount} registered` : ''}
          </div>
          {session.description && <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.5 }}>{session.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" style={s.joinBtn}>
            <Icon icon={icons.externalLink} size={16} /> Open
          </a>
          {isSuperAdmin && (
            <>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => onEdit(session)}>
                <Icon icon={icons.edit} size={16} />
              </button>
              <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => onDelete(session)}>
                <Icon icon={icons.delete} size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function AdminLiveSessionsPage() {
  const { token, isSuperAdmin } = useOutletContext()
  const qc = useQueryClient()
  const toast = useToast()
  useDocumentTitle('Live Sessions Admin')

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
    if (!form.title.trim()) { toast.error('Title is required'); return null }
    if (!form.meetingUrl.trim()) { toast.error('Meeting URL is required'); return null }
    if (!form.scheduledAt) { toast.error('Date and time are required'); return null }

    const speakers = form.speakers.map((s, idx) => ({ ...s, displayOrder: idx }))

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const busy = createMut.isPending || updateMut.isPending

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Live Sessions' }]} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ ...s.title, margin: 0 }}>Live Sessions</h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
            Schedule and manage live training sessions for trainees.
          </p>
        </div>
        {isSuperAdmin && (
          <button
            type="button"
            style={{ ...s.btn, ...s.btnPrimary, padding: '0.75rem 1.5rem' }}
            onClick={() => {
              if (showForm) resetFormAndClose()
              else {
                setForm(initialForm())
                setEditingId(null)
                setShowForm(true)
              }
            }}
          >
            <Icon icon={showForm ? icons.close : icons.enroll} size={18} />{' '}
            {showForm ? 'Cancel' : 'New Session'}
          </button>
        )}
      </div>

      {showForm && isSuperAdmin && (
        <form style={s.form} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--slogbaa-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon icon={editingId ? icons.edit : icons.enroll} size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{editingId ? 'Edit Session' : 'Schedule New Session'}</h3>
          </div>
          
          <div style={s.row}>
            <div>
              <label style={s.label}>Session Title *</label>
              <input 
                style={s.input} 
                value={form.title} 
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} 
                required 
                placeholder="e.g., Community Organizing 101"
              />
            </div>
            <div>
              <label style={s.label}>Platform Provider</label>
              <select style={s.input} value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}>
                <option value="ZOOM">Zoom Video</option>
                <option value="GOOGLE_MEET">Google Meet</option>
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div style={{ flex: 2 }}>
              <label style={s.label}>Meeting URL *</label>
              <input style={s.input} value={form.meetingUrl} onChange={(e) => setForm((f) => ({ ...f, meetingUrl: e.target.value }))} required placeholder="https://zoom.us/j/... or meet.google.com/..." />
            </div>
            <div>
              <label style={s.label}>Date & Start Time *</label>
              <input style={s.input} type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))} required />
            </div>
          </div>

          <div style={s.row}>
            <div><label style={s.label}>Meeting ID (Optional)</label><input style={s.input} value={form.meetingId} onChange={(e) => setForm((f) => ({ ...f, meetingId: e.target.value }))} placeholder="123 456 789" /></div>
            <div><label style={s.label}>Passcode (Optional)</label><input style={s.input} value={form.meetingPassword} onChange={(e) => setForm((f) => ({ ...f, meetingPassword: e.target.value }))} placeholder="Secret123" /></div>
            <div><label style={s.label}>Duration (min)</label><input style={s.input} type="number" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} min={1} /></div>
          </div>

          <div>
            <label style={s.label}>Banner Image URL</label>
            <input style={s.input} value={form.bannerImageUrl} onChange={(e) => setForm((f) => ({ ...f, bannerImageUrl: e.target.value }))} placeholder="https://images.unsplash.com/..." />
          </div>

          <div>
            <label style={s.label}>Summary / Short Description</label>
            <textarea style={{ ...s.input, minHeight: 60, resize: 'vertical' }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Briefly describe what this session is about..." />
          </div>

          <div>
            <label style={s.label}>Agenda / Session Details</label>
            <textarea style={{ ...s.input, minHeight: 100, resize: 'vertical' }} value={form.sessionDetails} onChange={(e) => setForm((f) => ({ ...f, sessionDetails: e.target.value }))} placeholder="Outline the topics, bullet points, or instructions for trainees..." />
          </div>

          <div style={{ padding: '1.5rem', borderRadius: 20, border: '1px solid var(--slogbaa-border)', background: 'rgba(0,0,0,0.02)' }}>
            <SpeakerManager speakers={form.speakers} onUpdate={(sp) => setForm(f => ({ ...f, speakers: sp }))} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9375rem', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" style={{ width: 18, height: 18 }} checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
              Publish session (visible to all trainees)
            </label>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={resetFormAndClose}>
                Cancel
              </button>
              <button type="submit" style={{ ...s.btn, ...s.btnPrimary, minWidth: 140 }} disabled={busy}>
                {busy ? 'Saving...' : editingId ? 'Save Changes' : 'Schedule Session'}
              </button>
            </div>
          </div>
        </form>
      )}

      {isError && (
        <div style={{ ...s.empty, color: 'var(--slogbaa-error)', background: 'rgba(239,68,68,0.05)', borderRadius: 20, border: '1px solid rgba(239,68,68,0.1)' }}>
          <Icon icon={icons.warning} size={40} style={{ marginBottom: '1rem' }} />
          <p>{queryError?.message ?? 'Failed to load live sessions. Please try again later.'}</p>
        </div>
      )}
      
      {!isError && (
        <div style={{ minHeight: 400 }}>
          {isLoading ? (
            <p style={s.empty}>Loading schedule...</p>
          ) : sessions.length === 0 ? (
            <div style={s.empty}>
              <Icon icon={icons.blockVideo} size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No live sessions have been scheduled yet.</p>
            </div>
          ) : (
            <>
              {grouped.live.length > 0 && (
                <section>
                  <h3 style={s.sectionTitle}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444', animation: 'pulse 2s infinite' }} />
                    Live Now
                  </h3>
                  {grouped.live.map(({ session, phase }) => (
                    <SessionCard key={session.id} session={session} phase={phase} isSuperAdmin={isSuperAdmin} onEdit={startEdit} onDelete={setDeleteTarget} />
                  ))}
                </section>
              )}
              
              {grouped.upcoming.length > 0 && (
                <section>
                  <h3 style={s.sectionTitle}><Icon icon={icons.enroll} size={20} /> Upcoming Sessions</h3>
                  {grouped.upcoming.map(({ session, phase }) => (
                    <SessionCard key={session.id} session={session} phase={phase} isSuperAdmin={isSuperAdmin} onEdit={startEdit} onDelete={setDeleteTarget} />
                  ))}
                </section>
              )}
              
              {grouped.past.length > 0 && (
                <section>
                  <h3 style={{ ...s.sectionTitle, color: 'var(--slogbaa-text-muted)' }}><Icon icon={icons.close} size={20} /> Past Sessions</h3>
                  {grouped.past.map(({ session, phase }) => (
                    <SessionCard key={session.id} session={session} phase={phase} isSuperAdmin={isSuperAdmin} onEdit={startEdit} onDelete={setDeleteTarget} />
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          onContinue={() => { deleteMut.mutate(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <AdminNavigatePills />
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
