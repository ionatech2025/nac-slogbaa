import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { queryKeys } from '../../../lib/query-keys.js'
import { getAssetUrl } from '../../../api/client.js'
import { getLiveSessions, registerForLiveSession, unregisterFromLiveSession } from '../../../api/liveSessions.js'
import { useToast } from '../../../shared/hooks/useToast.js'

const s = {
  wrap: { width: '100%', maxWidth: 900 },
  title: { margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  subtitle: { margin: '0 0 1.5rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--slogbaa-text)' },
  sectionTitleMuted: { margin: '2rem 0 1rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' },
  card: {
    padding: '1.25rem', borderRadius: 16, marginBottom: '1rem',
    background: 'var(--slogbaa-glass-bg)', backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)', boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  badge: (provider) => ({
    display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.6875rem', fontWeight: 700,
    background: provider === 'ZOOM' ? 'rgba(37,99,235,0.1)' : 'rgba(5,150,105,0.1)',
    color: provider === 'ZOOM' ? 'var(--slogbaa-blue)' : 'var(--slogbaa-green)',
  }),
  phasePill: (phase) => ({
    display: 'inline-block', marginLeft: '0.35rem', padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.6875rem', fontWeight: 700,
    background: phase === 'LIVE' ? 'rgba(220,38,38,0.12)' : 'rgba(37,99,235,0.1)',
    color: phase === 'LIVE' ? '#b91c1c' : 'var(--slogbaa-blue)',
  }),
  joinBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem',
    borderRadius: 10, background: 'var(--slogbaa-blue)', color: '#fff', textDecoration: 'none',
    fontSize: '0.9375rem', fontWeight: 600, transition: 'background 0.15s, box-shadow 0.15s', border: 'none', cursor: 'pointer',
  },
  ghostBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: 10,
    background: 'transparent', color: 'var(--slogbaa-text)', border: '1px solid var(--slogbaa-border)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
  },
  empty: { textAlign: 'center', color: 'var(--slogbaa-text-muted)', padding: '2rem 0', fontSize: '0.9375rem' },
  banner: { width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 12, marginBottom: '0.75rem' },
  credBox: {
    marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', fontSize: '0.8125rem',
  },
  speaker: { display: 'flex', gap: '0.75rem', marginTop: '0.65rem', alignItems: 'flex-start' },
  speakerPhoto: { width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: 'var(--slogbaa-border)' },
}

function SpeakersList({ speakers, variant = 'default' }) {
  const list = Array.isArray(speakers) ? speakers : []
  if (list.length === 0) return null

  if (variant === 'flyer') {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        {list.map((sp, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.06)', padding: '0.75rem 1.25rem', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 18, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0, background: 'linear-gradient(135deg, var(--slogbaa-blue), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {sp.photoUrl ? (
                <img 
                  src={getAssetUrl(sp.photoUrl)} 
                  alt={sp.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                />
              ) : null}
              <div style={{ display: sp.photoUrl ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>
                {sp.name?.[0] || 'S'}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '0.125rem' }}>{sp.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sp.role || 'Guest Speaker'}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slogbaa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Featured Speakers</p>
      {list.map((sp, i) => (
        <div key={i} style={s.speaker}>
          {sp.photoUrl ? (
            <img src={getAssetUrl(sp.photoUrl)} alt="" style={s.speakerPhoto} />
          ) : (
            <div style={{ ...s.speakerPhoto, background: 'var(--slogbaa-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slogbaa-text-muted)', fontWeight: 700 }}>
              {sp.name?.[0] || '?'}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--slogbaa-text)' }}>{sp.name || 'Speaker'}</div>
            {sp.role && <div style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-blue)' }}>{sp.role}</div>}
            {sp.bio && <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.45 }}>{sp.bio}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function ActiveSessionCard({ session, regMut }) {
  const banner = getAssetUrl(session.bannerImageUrl)
  const creds = session.credentials
  const canRegister = session.phase === 'UPCOMING' || session.phase === 'LIVE'
  
  return (
    <div style={{ ...s.card, padding: 0, overflow: 'hidden', border: '1px solid var(--slogbaa-border)', position: 'relative', background: 'var(--slogbaa-surface)' }}>
      {/* Banner / Poster Section */}
      <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden' }}>
        {banner ? (
          <img src={banner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(225deg, #1e293b 0%, #0f172a 100%)' }} />
        )}
        
        {/* Glass Overlay for Details */}
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <span style={{ ...s.badge(session.provider), background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              {session.provider === 'GOOGLE_MEET' ? 'Google Meet' : 'Zoom'}
            </span>
            {session.phase === 'LIVE' && <span style={{ ...s.phasePill('LIVE'), background: '#ef4444', color: '#fff' }}>LIVE NOW</span>}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{session.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', opacity: 0.9, fontSize: '0.875rem', fontWeight: 500 }}>
             <Icon icon={icons.enroll} size={14} />
             {new Date(session.scheduledAt).toLocaleString('en-UG', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
             {' '}&middot; {session.durationMinutes} minutes
          </div>
          
          <SpeakersList speakers={session.speakers} variant="flyer" />
        </div>
      </div>

      {/* Action / Context Section */}
      <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          {session.description && <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text)', fontWeight: 500 }}>{session.description}</p>}
          {session.sessionDetails && (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.5 }}>
              {session.sessionDetails}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {canRegister && (
            session.registered ? (
              <button
                type="button"
                style={{ ...s.ghostBtn, borderRadius: 12 }}
                disabled={regMut.isPending}
                onClick={() => regMut.mutate({ id: session.id, register: false })}
              >
                Cancel Registration
              </button>
            ) : (
              <button
                type="button"
                style={{ ...s.joinBtn, background: 'var(--slogbaa-green)', borderRadius: 12, padding: '0.625rem 1.5rem' }}
                disabled={regMut.isPending}
                onClick={() => regMut.mutate({ id: session.id, register: true })}
              >
                Register for Event
              </button>
            )
          )}
          {creds?.meetingUrl && (
            <a href={creds.meetingUrl} target="_blank" rel="noopener noreferrer" style={{ ...s.joinBtn, borderRadius: 12, padding: '0.625rem 1.5rem' }}>
              <Icon icon={icons.externalLink} size={16} /> Join Event
            </a>
          )}
        </div>
      </div>

      {session.registered && creds && (creds.meetingId || creds.meetingPassword) && (
        <div style={{ margin: '0 1.5rem 1.5rem', padding: '1rem', borderRadius: 12, background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)', display: 'flex', gap: '2rem' }}>
          {creds.meetingId && (
            <div><div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slogbaa-blue)', textTransform: 'uppercase' }}>Meeting ID</div><div style={{ fontSize: '1rem', fontWeight: 600 }}>{creds.meetingId}</div></div>
          )}
          {creds.meetingPassword && (
            <div><div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slogbaa-blue)', textTransform: 'uppercase' }}>Passcode</div><div style={{ fontSize: '1rem', fontWeight: 600 }}>{creds.meetingPassword}</div></div>
          )}
        </div>
      )}
    </div>
  )
}

export function LiveSessionsPage() {
  const { token } = useAuth()
  const qc = useQueryClient()
  const toast = useToast()
  useDocumentTitle('Live Sessions')

  const { data: sessionsRaw, isLoading, isError, error: queryError } = useQuery({
    queryKey: queryKeys.liveSessions.active(),
    queryFn: () => getLiveSessions(token),
    staleTime: 30_000,
    enabled: !!token,
  })
  const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : []

  const regMut = useMutation({
    mutationFn: ({ id, register }) => (register ? registerForLiveSession(token, id) : unregisterFromLiveSession(token, id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.liveSessions.active() }),
    onError: (e) => toast.error(e?.message ?? 'Could not update registration.'),
  })

  const byTimeAsc = (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
  const byTimeDesc = (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)

  const liveList = sessions.filter((x) => x.phase === 'LIVE').sort(byTimeAsc)
  const upcomingList = sessions.filter((x) => x.phase === 'UPCOMING').sort(byTimeAsc)
  const pastList = sessions.filter((x) => x.phase === 'PAST').sort(byTimeDesc)

  return (
    <div style={s.wrap}>
      <h1 style={s.title}>Live Sessions</h1>
      <p style={s.subtitle}>
        Sessions are grouped into <strong>live now</strong>, <strong>upcoming</strong>, and <strong>past</strong>. Register for an upcoming or current session to receive the meeting link, ID, and passcode.
      </p>

      {isError && (
        <p style={{ ...s.empty, color: 'var(--slogbaa-error)' }} role="alert">
          {queryError?.message ?? 'Failed to load sessions.'}
        </p>
      )}
      {!isError && isLoading && <p style={s.empty}>Loading sessions...</p>}
      {!isError && !isLoading && sessions.length === 0 ? (
        <div style={s.empty}>
          <Icon icon={icons.blockVideo} size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          <p>No live sessions scheduled yet. Check back later.</p>
        </div>
      ) : !isError && !isLoading ? (
        <>
          {liveList.length > 0 && (
            <section aria-labelledby="live-sessions-live-heading">
              <h2 id="live-sessions-live-heading" style={s.sectionTitle}>Live now</h2>
              {liveList.map((session) => (
                <ActiveSessionCard key={session.id} session={session} regMut={regMut} />
              ))}
            </section>
          )}
          {upcomingList.length > 0 && (
            <section aria-labelledby="live-sessions-upcoming-heading">
              <h2 id="live-sessions-upcoming-heading" style={liveList.length > 0 ? s.sectionTitleMuted : s.sectionTitle}>Upcoming</h2>
              {upcomingList.map((session) => (
                <ActiveSessionCard key={session.id} session={session} regMut={regMut} />
              ))}
            </section>
          )}
          {pastList.length > 0 && (
            <section aria-labelledby="live-sessions-past-heading">
              <h2 id="live-sessions-past-heading" style={(liveList.length > 0 || upcomingList.length > 0) ? s.sectionTitleMuted : s.sectionTitle}>Past sessions</h2>
              {pastList.map((session) => {
                const banner = getAssetUrl(session.bannerImageUrl)
                const creds = session.credentials
                return (
                  <div key={session.id} style={{ ...s.card, opacity: 0.88 }}>
                    {banner ? <img src={banner} alt="" style={{ ...s.banner, maxHeight: 120 }} /> : null}
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slogbaa-text)' }}>{session.title}</h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>
                      {new Date(session.scheduledAt).toLocaleString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {session.registered && creds?.meetingUrl && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <a href={creds.meetingUrl} target="_blank" rel="noopener noreferrer" style={{ ...s.joinBtn, fontSize: '0.8125rem', padding: '0.4rem 0.9rem' }}>
                          Open recording / link
                        </a>
                        {(creds.meetingId || creds.meetingPassword) && (
                          <div style={{ ...s.credBox, marginTop: '0.5rem' }}>
                            {creds.meetingId && <div><strong>Meeting ID:</strong> {creds.meetingId}</div>}
                            {creds.meetingPassword && <div style={{ marginTop: '0.35rem' }}><strong>Passcode:</strong> {creds.meetingPassword}</div>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )}
        </>
      ) : null}
    </div>
  )
}
