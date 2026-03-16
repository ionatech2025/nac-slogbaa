import { useState } from 'react'
import { Icon, icons } from '../../../shared/icons.jsx'
import {
  useDiscussionThreads,
  useDiscussionThread,
  useCreateThread,
  useReplyToThread,
  useResolveThread,
} from '../../../lib/hooks/use-discussion.js'
import { useAuth } from '../../iam/hooks/useAuth.js'

const s = {
  wrapper: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  heading: {
    margin: '0 0 1rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  askBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.55rem 1.25rem',
    borderRadius: 10,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  formCard: {
    padding: '1.25rem',
    marginBottom: '1.25rem',
    borderRadius: 14,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.75rem',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-glass-bg-subtle)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '0.75rem',
  },
  textarea: {
    width: '100%',
    minHeight: 80,
    padding: '0.65rem 0.75rem',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-glass-bg-subtle)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  btnRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.75rem',
  },
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.55rem 1.25rem',
    borderRadius: 10,
    border: 'none',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.55rem 1rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  threadCard: {
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
    borderRadius: 12,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  threadHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  threadTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  resolvedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    padding: '0.15rem 0.5rem',
    borderRadius: 20,
    background: 'rgba(34, 197, 94, 0.12)',
    color: '#16a34a',
    fontSize: '0.75rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  threadMeta: {
    marginTop: '0.35rem',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  authorBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    padding: '0.1rem 0.4rem',
    borderRadius: 4,
    background: 'rgba(37, 99, 235, 0.1)',
    color: 'var(--slogbaa-blue)',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  replyCount: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  threadBody: {
    margin: '0.75rem 0 0',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
  },
  replyCard: {
    padding: '0.75rem 1rem',
    marginLeft: '1.5rem',
    marginBottom: '0.5rem',
    borderRadius: 10,
    background: 'var(--slogbaa-glass-bg-subtle)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border-subtle)',
  },
  replyAuthor: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  replyBody: {
    margin: '0.3rem 0 0',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.5,
  },
  replyDate: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },
  emptyText: {
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  errorText: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error, #c53030)',
    marginTop: '0.5rem',
  },
  resolveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.35rem 0.75rem',
    borderRadius: 8,
    border: '1px solid #16a34a',
    background: 'transparent',
    color: '#16a34a',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
}

function formatDate(isoString) {
  if (!isoString) return ''
  try {
    return new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

function ThreadDetail({ courseId, threadId, onBack }) {
  const { data, isLoading } = useDiscussionThread(courseId, threadId)
  const replyMutation = useReplyToThread()
  const resolveMutation = useResolveThread()
  const { user } = useAuth()
  const [replyBody, setReplyBody] = useState('')

  if (isLoading) return <p style={s.emptyText}>Loading thread...</p>
  if (!data) return <p style={s.emptyText}>Thread not found.</p>

  const { thread, replies } = data
  // Show resolve button for staff always; for trainees, the backend will
  // authorize based on thread ownership. We show it to all users and handle errors.
  const isStaff = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
  const canResolve = !thread.isResolved && (isStaff || thread.authorType === 'TRAINEE')

  const handleReply = (e) => {
    e.preventDefault()
    if (!replyBody.trim()) return
    replyMutation.mutate(
      { courseId, threadId, body: replyBody.trim() },
      { onSuccess: () => setReplyBody('') }
    )
  }

  const handleResolve = () => {
    resolveMutation.mutate({ courseId, threadId })
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        style={{ ...s.cancelBtn, marginBottom: '1rem' }}
      >
        ← Back to discussions
      </button>

      <div style={s.formCard}>
        <div style={s.threadHeader}>
          <h4 style={s.threadTitle}>
            {thread.title}
            {thread.isResolved && (
              <span style={s.resolvedBadge}>
                <Icon icon={icons.checkCircle} size="0.8em" /> Resolved
              </span>
            )}
          </h4>
        </div>
        <div style={s.threadMeta}>
          <span>{thread.authorDisplayName}</span>
          {thread.authorType === 'STAFF' && <span style={s.authorBadge}>Staff</span>}
          <span>{formatDate(thread.createdAt)}</span>
        </div>
        <p style={s.threadBody}>{thread.body}</p>
        {canResolve && (
          <button
            type="button"
            onClick={handleResolve}
            disabled={resolveMutation.isPending}
            style={s.resolveBtn}
          >
            <Icon icon={icons.checkCircle} size="0.85em" />
            {resolveMutation.isPending ? 'Resolving...' : 'Mark Resolved'}
          </button>
        )}
        {resolveMutation.isError && (
          <p style={s.errorText}>{resolveMutation.error?.message ?? 'Failed to resolve thread.'}</p>
        )}
      </div>

      {/* Replies */}
      {replies && replies.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {replies.map((reply) => (
            <div key={reply.id} style={s.replyCard}>
              <div style={s.replyAuthor}>
                {reply.authorDisplayName}
                {reply.authorType === 'STAFF' && <span style={s.authorBadge}>Staff</span>}
                <span style={s.replyDate}>{formatDate(reply.createdAt)}</span>
              </div>
              <p style={s.replyBody}>{reply.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <form onSubmit={handleReply} style={{ ...s.formCard, marginLeft: '1.5rem' }}>
        <label style={s.formLabel}>Your reply</label>
        <textarea
          style={s.textarea}
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          placeholder="Write a reply..."
          maxLength={5000}
          rows={3}
        />
        <div style={s.btnRow}>
          <button
            type="submit"
            disabled={!replyBody.trim() || replyMutation.isPending}
            style={{ ...s.submitBtn, opacity: !replyBody.trim() || replyMutation.isPending ? 0.5 : 1 }}
          >
            {replyMutation.isPending ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
        {replyMutation.isError && (
          <p style={s.errorText}>{replyMutation.error?.message ?? 'Failed to post reply.'}</p>
        )}
      </form>
    </div>
  )
}

export function DiscussionPanel({ courseId, moduleId }) {
  const { data: threads = [], isLoading } = useDiscussionThreads(courseId, moduleId)
  const createMutation = useCreateThread()
  const [showForm, setShowForm] = useState(false)
  const [selectedThreadId, setSelectedThreadId] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    createMutation.mutate(
      { courseId, moduleId: moduleId || null, title: title.trim(), body: body.trim() },
      {
        onSuccess: () => {
          setTitle('')
          setBody('')
          setShowForm(false)
        },
      }
    )
  }

  if (selectedThreadId) {
    return (
      <div style={s.wrapper}>
        <h3 style={s.heading}>
          <Icon icon={icons.messageSquare} size="1.1em" />
          Discussion
        </h3>
        <ThreadDetail
          courseId={courseId}
          threadId={selectedThreadId}
          onBack={() => setSelectedThreadId(null)}
        />
      </div>
    )
  }

  return (
    <div style={s.wrapper}>
      <h3 style={s.heading}>
        <Icon icon={icons.messageSquare} size="1.1em" />
        Discussion
      </h3>

      {/* Ask a question button */}
      {!showForm && (
        <button type="button" onClick={() => setShowForm(true)} style={s.askBtn}>
          <Icon icon={icons.enroll} size="0.9em" /> Ask a Question
        </button>
      )}

      {/* Thread creation form */}
      {showForm && (
        <form onSubmit={handleCreate} style={s.formCard}>
          <label style={s.formLabel}>Title</label>
          <input
            type="text"
            style={s.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question?"
            maxLength={500}
          />
          <label style={s.formLabel}>Details</label>
          <textarea
            style={s.textarea}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide more details about your question..."
            maxLength={5000}
            rows={4}
          />
          <div style={s.btnRow}>
            <button
              type="submit"
              disabled={!title.trim() || !body.trim() || createMutation.isPending}
              style={{
                ...s.submitBtn,
                opacity: !title.trim() || !body.trim() || createMutation.isPending ? 0.5 : 1,
              }}
            >
              {createMutation.isPending ? 'Posting...' : 'Post Question'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitle(''); setBody('') }}
              style={s.cancelBtn}
            >
              Cancel
            </button>
          </div>
          {createMutation.isError && (
            <p style={s.errorText}>{createMutation.error?.message ?? 'Failed to post question.'}</p>
          )}
        </form>
      )}

      {/* Thread list */}
      {isLoading ? (
        <p style={s.emptyText}>Loading discussions...</p>
      ) : threads.length === 0 ? (
        <p style={s.emptyText}>No discussions yet. Be the first to ask a question!</p>
      ) : (
        threads.map((thread) => (
          <div
            key={thread.id}
            style={s.threadCard}
            onClick={() => setSelectedThreadId(thread.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedThreadId(thread.id) }}
          >
            <div style={s.threadHeader}>
              <h4 style={s.threadTitle}>
                {thread.title}
                {thread.isResolved && (
                  <span style={s.resolvedBadge}>
                    <Icon icon={icons.checkCircle} size="0.8em" /> Resolved
                  </span>
                )}
              </h4>
            </div>
            <div style={s.threadMeta}>
              <span>{thread.authorDisplayName}</span>
              {thread.authorType === 'STAFF' && <span style={s.authorBadge}>Staff</span>}
              <span style={s.replyCount}>
                <Icon icon={icons.messageSquare} size="0.85em" /> {thread.replyCount}
              </span>
              <span>{formatDate(thread.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
