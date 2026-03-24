import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { queryKeys } from '../../../lib/query-keys.js'
import { getAssetUrl } from '../../../api/client.js'
import { getLiveSessions, registerForLiveSession, unregisterFromLiveSession } from '../../../api/liveSessions.js'
import { useToast } from '../../../shared/hooks/useToast.js'

const s = {
  layout: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slogbaa-bg)' },
  main: { flex: 1, padding: '1.5rem 2rem', maxWidth: 900, margin: '0 auto', width: '100%' },
  title: { margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  subtitle: { margin: '0 0 1.5rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' },
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
  empty: { textAlign: 'center', color: 'var(--slogbaa-text-muted)', padding: '3rem 0', fontSize: '0.9375rem' },
  banner: { width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 12, marginBottom: '0.75rem' },
  credBox: {
    marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', fontSize: '0.8125rem',
  },
  speaker: { display: 'flex', gap: '0.75rem', marginTop: '0.65rem', alignItems: 'flex-start' },
  speakerPhoto: { width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: 'var(--slogbaa-border)' },
}

function SpeakersList({ speakers }) {
  const list = Array.isArray(speakers) ? speakers : []
  if (list.length === 0) return null
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slogbaa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Speakers</p>
      {list.map((sp, i) => (
        <div key={i} style={s.speaker}>
          {sp.photoUrl ? <img src={getAssetUrl(sp.photoUrl)} alt="" style={s.speakerPhoto} /> : <div style={s.speakerPhoto} aria-hidden />}
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

  const activeList = sessions.filter((x) => x.phase === 'UPCOMING' || x.phase === 'LIVE')
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  const pastList = sessions.filter((x) => x.phase === 'PAST')
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))

  return (
    <div style={s.layout}>
      <main style={s.main}>
        <h1 style={s.title}>Live Sessions</h1>
        <p style={s.subtitle}>Register for upcoming sessions to receive the meeting link, ID, and passcode. Join opens the provider in a new tab.</p>

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
            {activeList.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--slogbaa-text)' }}>Upcoming & live</h2>
                {activeList.map((session) => {
                  const banner = getAssetUrl(session.bannerImageUrl)
                  const creds = session.credentials
                  const canRegister = session.phase === 'UPCOMING' || session.phase === 'LIVE'
                  return (
                    <div key={session.id} style={s.card}>
                      {banner ? <img src={banner} alt="" style={s.banner} /> : null}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                          <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--slogbaa-text)' }}>{session.title}</h3>
                          <span style={s.badge(session.provider)}>{session.provider === 'GOOGLE_MEET' ? 'Google Meet' : 'Zoom'}</span>
                          {session.phase === 'LIVE' && <span style={s.phasePill('LIVE')}>Live now</span>}
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
                            {new Date(session.scheduledAt).toLocaleString('en-UG', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            {' '}&middot; {session.durationMinutes} min
                          </span>
                          {session.description && <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.5 }}>{session.description}</p>}
                          {session.sessionDetails && (
                            <pre style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.45 }}>{session.sessionDetails}</pre>
                          )}
                          <SpeakersList speakers={session.speakers} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'stretch' }}>
                          {canRegister && (
                            session.registered ? (
                              <button
                                type="button"
                                style={s.ghostBtn}
                                disabled={regMut.isPending}
                                onClick={() => regMut.mutate({ id: session.id, register: false })}
                              >
                                Unregister
                              </button>
                            ) : (
                              <button
                                type="button"
                                style={{ ...s.joinBtn, background: 'var(--slogbaa-green)', justifyContent: 'center' }}
                                disabled={regMut.isPending}
                                onClick={() => regMut.mutate({ id: session.id, register: true })}
                              >
                                Register
                              </button>
                            )
                          )}
                          {creds?.meetingUrl ? (
                            <a href={creds.meetingUrl} target="_blank" rel="noopener noreferrer" style={{ ...s.joinBtn, justifyContent: 'center' }}>
                              <Icon icon={icons.externalLink} size={16} /> Join session
                            </a>
                          ) : session.registered ? (
                            <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>Join link will appear here when available.</span>
                          ) : null}
                        </div>
                      </div>
                      {session.registered && creds && (creds.meetingId || creds.meetingPassword) && (
                        <div style={s.credBox}>
                          {creds.meetingId && (
                            <div><strong>Meeting ID:</strong> {creds.meetingId}</div>
                          )}
                          {creds.meetingPassword && (
                            <div style={{ marginTop: '0.35rem' }}><strong>Passcode:</strong> {creds.meetingPassword}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {pastList.length > 0 && (
              <div>
                <h2 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' }}>Past sessions</h2>
                {pastList.map((session) => {
                  const banner = getAssetUrl(session.bannerImageUrl)
                  const creds = session.credentials
                  return (
                    <div key={session.id} style={{ ...s.card, opacity: 0.85 }}>
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
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
