import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { queryKeys } from '../../../lib/query-keys.js'
import { getLiveSessions } from '../../../api/liveSessions.js'

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
  joinBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem',
    borderRadius: 10, background: 'var(--slogbaa-blue)', color: '#fff', textDecoration: 'none',
    fontSize: '0.9375rem', fontWeight: 600, transition: 'background 0.15s, box-shadow 0.15s',
  },
  empty: { textAlign: 'center', color: 'var(--slogbaa-text-muted)', padding: '3rem 0', fontSize: '0.9375rem' },
}

export function LiveSessionsPage() {
  const { token } = useAuth()
  useDocumentTitle('Live Sessions')

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: queryKeys.liveSessions.active(),
    queryFn: () => getLiveSessions(token),
    staleTime: 30_000,
  })

  const upcoming = sessions.filter((s) => new Date(s.scheduledAt) >= new Date())
  const past = sessions.filter((s) => new Date(s.scheduledAt) < new Date())

  return (
    <div style={s.layout}>
      <main style={s.main}>
        <h1 style={s.title}>Live Sessions</h1>
        <p style={s.subtitle}>Join live training sessions with instructors and fellow trainees.</p>

        {isLoading ? <p style={s.empty}>Loading sessions...</p> : sessions.length === 0 ? (
          <div style={s.empty}>
            <Icon icon={icons.blockVideo} size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p>No live sessions scheduled yet. Check back later.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--slogbaa-text)' }}>Upcoming</h2>
                {upcoming.map((session) => (
                  <div key={session.id} style={s.card}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--slogbaa-text)' }}>{session.title}</h3>
                        <span style={s.badge(session.provider)}>{session.provider === 'GOOGLE_MEET' ? 'Google Meet' : 'Zoom'}</span>
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
                          {new Date(session.scheduledAt).toLocaleString('en-UG', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {' '}&middot; {session.durationMinutes} min
                        </span>
                        {session.description && <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.5 }}>{session.description}</p>}
                      </div>
                      <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" style={s.joinBtn}>
                        <Icon icon={icons.externalLink} size={16} /> Join Session
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' }}>Past Sessions</h2>
                {past.map((session) => (
                  <div key={session.id} style={{ ...s.card, opacity: 0.6 }}>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slogbaa-text)' }}>{session.title}</h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' }}>
                      {new Date(session.scheduledAt).toLocaleString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
