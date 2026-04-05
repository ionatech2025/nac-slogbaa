import { useEffect, useMemo, useRef, useState } from 'react'

/** Intentionally not in deps: when trainee passes, parent sets moduleCompleted true; re-running would clear `result`. */
function useLatest(value) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
import { Icon, icons } from '../../../shared/icons.jsx'
import {
  getQuizForModule,
  getLastPassedQuizResult,
  startQuizAttempt,
  submitQuizAttempt,
} from '../../../api/assessment/quizzes.js'
import { recordModuleCompletion } from '../../../api/learning/courses.js'

const styles = {
  card: {
    margin: '3rem 0',
    padding: '2.5rem',
    borderRadius: 20,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
    boxShadow: 'var(--slogbaa-glass-shadow-lg)',
  },
  headerRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.02em',
  },
  meta: {
    margin: '0.5rem 0 0',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
  },
  button: (variant = 'primary', disabled = false) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: 10,
    padding: '0.55rem 0.9rem',
    border: variant === 'ghost' ? `1px solid var(--slogbaa-border)` : '1px solid transparent',
    background: variant === 'primary' ? 'var(--slogbaa-blue)' : 'transparent',
    color: variant === 'primary' ? '#fff' : 'var(--slogbaa-text)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9375rem',
    whiteSpace: 'nowrap',
  }),
  error: {
    marginTop: '0.75rem',
    color: 'var(--slogbaa-error)',
    fontSize: '0.9375rem',
  },
  question: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  qText: {
    margin: 0,
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  opt: (locked) => ({
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'flex-start',
    padding: '0.5rem 0',
    cursor: locked ? 'default' : 'pointer',
    color: 'var(--slogbaa-text)',
    opacity: locked ? 0.9 : 1,
  }),
  textarea: (locked) => ({
    width: '100%',
    minHeight: 90,
    marginTop: '0.5rem',
    padding: '0.6rem 0.75rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: locked ? 'var(--slogbaa-surface)' : 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-text)',
    resize: 'vertical',
    opacity: locked ? 0.95 : 1,
  }),
  resultRow: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: (kind) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.6rem',
    borderRadius: 999,
    fontSize: '0.8125rem',
    fontWeight: 700,
    background: kind === 'pass' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(248, 113, 113, 0.12)',
    color: kind === 'pass' ? 'var(--slogbaa-green)' : 'var(--slogbaa-error)',
    border: `1px solid ${kind === 'pass' ? 'rgba(52, 211, 153, 0.35)' : 'rgba(248, 113, 113, 0.35)'}`,
  }),
  reviewSection: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  reviewToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem 0',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
  },
  reviewCard: (correct) => ({
    margin: '0.75rem 0 0',
    padding: '0.75rem 1rem',
    borderRadius: 12,
    border: `1px solid ${correct ? 'rgba(52, 211, 153, 0.35)' : 'rgba(248, 113, 113, 0.35)'}`,
    background: correct ? 'rgba(52, 211, 153, 0.04)' : 'rgba(248, 113, 113, 0.04)',
  }),
  reviewQText: {
    margin: '0 0 0.5rem',
    fontWeight: 600,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
  },
  reviewAnswer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.4rem',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  doneBanner: {
    marginTop: '1.5rem',
    padding: '1rem 1.25rem',
    borderRadius: 12,
    background: 'rgba(52, 211, 153, 0.08)',
    border: '1px solid rgba(52, 211, 153, 0.35)',
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: 'var(--slogbaa-green)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
}

function normalizeType(t) {
  return String(t || '').toUpperCase()
}

export function ModuleQuizPanel({
  token,
  courseId,
  moduleId,
  visible,
  showPanel = true,
  notesReadThrough = true,
  notesVisible = true,
  moduleCompleted = false,
  onStartQuiz,
  onRereadNotes,
  onModuleCompleted,
}) {
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  /** Loaded when opening an already-completed module (persisted pass). */
  const [savedResult, setSavedResult] = useState(null)
  const [error, setError] = useState(null)
  const [reviewExpanded, setReviewExpanded] = useState(true)
  const prevNotesVisibleRef = useRef(notesVisible)
  const moduleCompletedRef = useLatest(moduleCompleted)

  const effectiveResult = result || savedResult
  const hasPassed = Boolean(effectiveResult?.passed)
  const quizFinishedReadonly = Boolean(result) // submitted this session (pass or fail)
  const inputsLocked = quizFinishedReadonly || hasPassed

  const notesGateOk = notesReadThrough && !loading && quiz
  const canStartQuiz =
    notesGateOk && !attempt && !result && !savedResult && !moduleCompleted

  // Re-read Notes: drop in-progress attempt unless module is already completed / passed.
  useEffect(() => {
    if (moduleCompleted || hasPassed) {
      prevNotesVisibleRef.current = notesVisible
      return
    }
    if (notesVisible && prevNotesVisibleRef.current === false) {
      setAttempt(null)
      setResult(null)
      setAnswers({})
      setSubmitting(false)
      setError(null)
    }
    prevNotesVisibleRef.current = notesVisible
  }, [notesVisible, moduleCompleted, hasPassed])

  useEffect(() => {
    if (!visible || !token || !courseId || !moduleId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setQuiz(null)
    setAttempt(null)
    setAnswers({})
    setResult(null)
    setSavedResult(null)

    const run = async () => {
      try {
        if (moduleCompletedRef.current) {
          const [q, lastPassed] = await Promise.all([
            getQuizForModule(token, courseId, moduleId),
            getLastPassedQuizResult(token, courseId, moduleId),
          ])
          if (cancelled) return
          setQuiz(q)
          setSavedResult(lastPassed)
        } else {
          const q = await getQuizForModule(token, courseId, moduleId)
          if (cancelled) return
          setQuiz(q)
        }
      } catch (e) {
        if (cancelled) return
        setError(e?.message ?? 'Failed to load quiz.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()

    return () => {
      cancelled = true
    }
  }, [visible, token, courseId, moduleId])

  const questions = useMemo(() => quiz?.questions ?? [], [quiz])

  const start = async () => {
    if (!token || !courseId || !moduleId || !canStartQuiz || moduleCompleted) return
    setError(null)
    setSubmitting(false)
    setResult(null)
    setAnswers({})
    setLoading(true)
    try {
      const a = await startQuizAttempt(token, courseId, moduleId)
      setAttempt(a)
      setQuiz(a.quiz)
      onStartQuiz?.()
    } catch (e) {
      setError(e?.message ?? 'Failed to start attempt.')
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    if (!token || !attempt?.attemptId || inputsLocked) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = questions.map((q) => {
        const a = answers[q.id] ?? {}
        return {
          questionId: q.id,
          selectedOptionId: a.selectedOptionId ?? null,
          textAnswer: a.textAnswer ?? null,
        }
      })
      const r = await submitQuizAttempt(token, courseId, moduleId, attempt.attemptId, payload)
      setResult(r)
      if (r?.passed) {
        await recordModuleCompletion(token, courseId, moduleId, true)
        onModuleCompleted?.()
      }
    } catch (e) {
      setError(e?.message ?? 'Failed to submit attempt.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!visible || !showPanel) return null

  const showActiveQuestions = attempt?.attemptId && quiz && !hasPassed
  const reviewAnswers = effectiveResult?.answers

  return (
    <section style={styles.card}>
      <div style={styles.headerRow}>
        <div style={{ minWidth: 240, flex: 1 }}>
          <p style={styles.title}>{quiz?.title || 'Module quiz'}</p>
          <p style={styles.meta}>
            {loading ? 'Loading quiz…' : null}
            {!loading && quiz ? `${questions.length} question${questions.length === 1 ? '' : 's'} · Pass mark: ${quiz.passThresholdPercent}%` : null}
            {!loading && !quiz ? 'No quiz is configured for this module yet.' : null}
            {!loading && quiz && !notesReadThrough && !moduleCompleted
              ? ' Scroll the notes box above to the bottom to unlock the quiz.'
              : null}
            {moduleCompleted && !loading ? ' This module is complete — quiz is view only.' : null}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={start}
            disabled={!canStartQuiz}
            style={styles.button('primary', !canStartQuiz)}
          >
            Start quiz
          </button>
          {!notesVisible && typeof onRereadNotes === 'function' && !moduleCompleted && !hasPassed && (
            <button type="button" onClick={onRereadNotes} style={styles.button('ghost')}>
              Re-read Notes
            </button>
          )}
          {attempt?.attemptId && !hasPassed && (
            <button
              type="button"
              onClick={() => {
                setAttempt(null)
                setResult(null)
                setAnswers({})
              }}
              style={styles.button('ghost')}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {hasPassed && !loading && <div style={styles.doneBanner}>Quiz passed — your answers below are read only.</div>}

      {showActiveQuestions &&
        questions.map((q, idx) => {
          const type = normalizeType(q.questionType)
          const current = answers[q.id] ?? {}
          const locked = inputsLocked
          return (
            <div key={q.id} style={styles.question}>
              <p style={styles.qText}>
                {idx + 1}. {q.questionText}
              </p>

              {(type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') && (
                <div>
                  {(q.options ?? [])
                    .slice()
                    .sort((a, b) => (a.optionOrder ?? 0) - (b.optionOrder ?? 0))
                    .map((o) => (
                      <label key={o.id} style={styles.opt(locked)}>
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          checked={current.selectedOptionId === o.id}
                          disabled={locked}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: { ...prev[q.id], selectedOptionId: o.id },
                            }))
                          }
                        />
                        <span>{o.optionText}</span>
                      </label>
                    ))}
                </div>
              )}

              {(type === 'SHORT_ANSWER' || type === 'ESSAY') && (
                <textarea
                  style={styles.textarea(locked)}
                  placeholder="Type your answer…"
                  readOnly={locked}
                  value={current.textAnswer ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: { ...prev[q.id], textAnswer: e.target.value },
                    }))
                  }
                />
              )}
            </div>
          )
        })}

      {attempt?.attemptId && quiz && !hasPassed && (
        <div style={styles.resultRow}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem' }}>
              Attempt #{attempt.attemptNumber}
            </span>
            {result && (
              <>
                <span style={styles.pill(result.passed ? 'pass' : 'fail')}>
                  {result.passed ? 'PASSED' : 'FAILED'}
                </span>
                <span style={{ color: 'var(--slogbaa-text)', fontWeight: 600 }}>
                  Score: {result.percentScore}% ({result.pointsEarned}/{result.totalPoints})
                </span>
              </>
            )}
          </div>

          {!quizFinishedReadonly && (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              style={styles.button('primary', submitting)}
            >
              {submitting ? 'Submitting…' : 'Submit answers'}
            </button>
          )}
        </div>
      )}

      {hasPassed && effectiveResult && (
        <div style={{ ...styles.resultRow, marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={styles.pill('pass')}>PASSED</span>
            <span style={{ color: 'var(--slogbaa-text)', fontWeight: 600 }}>
              Score: {effectiveResult.percentScore}% ({effectiveResult.pointsEarned}/{effectiveResult.totalPoints})
            </span>
          </div>
        </div>
      )}

      {reviewAnswers && reviewAnswers.length > 0 && (
        <div style={styles.reviewSection}>
          <button
            type="button"
            onClick={() => setReviewExpanded((v) => !v)}
            style={styles.reviewToggle}
            aria-expanded={reviewExpanded}
          >
            <Icon icon={icons.enrolled} size="1em" />
            {reviewExpanded ? 'Hide review' : 'Review your answers'}
          </button>

          {reviewExpanded && (
            <div>
              {reviewAnswers.map((a, idx) => (
                <div key={a.questionId || idx} style={styles.reviewCard(a.correct)}>
                  <p style={styles.reviewQText}>
                    {idx + 1}. {a.questionText}
                  </p>
                  <div style={styles.reviewAnswer}>
                    <Icon
                      icon={a.correct ? icons.enrolled : icons.close}
                      size="1em"
                      style={{
                        color: a.correct ? 'var(--slogbaa-green)' : 'var(--slogbaa-error)',
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: a.correct ? 'var(--slogbaa-green)' : 'var(--slogbaa-error)' }}>
                      Your answer: {a.selectedOptionText || '(none)'}
                    </span>
                  </div>
                  {!a.correct && a.correctOptionText && (
                    <div style={styles.reviewAnswer}>
                      <Icon
                        icon={icons.enrolled}
                        size="1em"
                        style={{ color: 'var(--slogbaa-green)', marginTop: 2, flexShrink: 0 }}
                      />
                      <span style={{ color: 'var(--slogbaa-green)' }}>Correct answer: {a.correctOptionText}</span>
                    </div>
                  )}
                  <div style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)', marginTop: '0.25rem' }}>
                    {a.pointsAwarded}/{a.totalPoints} point{a.totalPoints !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
