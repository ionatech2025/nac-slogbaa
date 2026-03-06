import { useState, useEffect } from 'react'
import { getAdminQuiz } from '../../../api/admin/assessment.js'

const styles = {
  card: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    borderRadius: 12,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  meta: {
    margin: '0 0 1rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  sectionLabel: {
    margin: '1rem 0 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slogbaa-text-muted)',
  },
  questionBlock: {
    marginTop: '0.75rem',
    padding: '1rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
  },
  questionText: {
    margin: 0,
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
  },
  questionType: {
    margin: '0.25rem 0 0',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  optionList: {
    margin: '0.5rem 0 0',
    paddingLeft: '1.25rem',
    listStyle: 'disc',
  },
  optionItem: {
    marginTop: '0.25rem',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
  },
  error: { marginTop: '0.5rem', color: 'var(--slogbaa-error)', fontSize: '0.875rem' },
}

function normalizeType(t) {
  return String(t || '').toUpperCase()
}

export function AdminQuizReadOnly({ token, moduleId }) {
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token || !moduleId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getAdminQuiz(token, moduleId)
      .then((data) => {
        if (cancelled) return
        setQuiz(data)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e?.message ?? 'Failed to load quiz.')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [token, moduleId])

  if (loading) return <div style={styles.card}><p style={{ margin: 0, color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>Loading quiz…</p></div>
  if (error) return <div style={styles.card}><p style={styles.error}>{error}</p></div>
  if (!quiz) return null

  const questions = quiz.questions ?? []
  const sortedQuestions = questions.slice().sort((a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0))

  return (
    <div style={styles.card}>
      <p style={styles.sectionLabel}>Module quiz (read-only)</p>
      <h3 style={styles.title}>{quiz.title || 'Module quiz'}</h3>
      <p style={styles.meta}>
        {questions.length} question{questions.length === 1 ? '' : 's'} · Pass mark: {quiz.passThresholdPercent ?? 70}%
        {quiz.maxAttempts != null && quiz.maxAttempts !== '' ? ` · Max attempts: ${quiz.maxAttempts}` : ''}
        {quiz.timeLimitMinutes != null && quiz.timeLimitMinutes !== '' ? ` · Time limit: ${quiz.timeLimitMinutes} min` : ''}
      </p>
      {sortedQuestions.length === 0 ? (
        <p style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>No questions yet.</p>
      ) : (
        sortedQuestions.map((q, idx) => {
          const type = normalizeType(q.questionType)
          const options = (q.options ?? []).slice().sort((a, b) => (a.optionOrder ?? 0) - (b.optionOrder ?? 0))
          return (
            <div key={q.id || idx} style={styles.questionBlock}>
              <p style={styles.questionText}>
                {idx + 1}. {q.questionText || '(No question text)'}
              </p>
              <p style={styles.questionType}>
                {type === 'MULTIPLE_CHOICE' && 'Multiple choice'}
                {type === 'TRUE_FALSE' && 'True / False'}
                {type === 'SHORT_ANSWER' && 'Short answer'}
                {type === 'ESSAY' && 'Essay'}
              </p>
              {(type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') && options.length > 0 && (
                <ul style={styles.optionList}>
                  {options.map((o) => (
                    <li key={o.id} style={styles.optionItem}>
                      {o.optionText}
                      {o.correct === true ? ' ✓' : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
