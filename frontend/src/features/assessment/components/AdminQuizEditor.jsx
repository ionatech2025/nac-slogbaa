import { useState, useEffect, useCallback } from 'react'
import { getAdminQuiz, saveAdminQuiz, deleteAdminQuiz } from '../../../api/admin/assessment.js'

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple choice' },
  { value: 'TRUE_FALSE', label: 'True / False' },
  { value: 'SHORT_ANSWER', label: 'Short answer' },
  { value: 'ESSAY', label: 'Essay' },
]

const styles = {
  card: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    borderRadius: 12,
    background: 'var(--slogbaa-surface)',
    border: '1px solid var(--slogbaa-border)',
  },
  title: {
    margin: '0 0 1rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  field: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.35rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    padding: '0.5rem 0.75rem',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
  },
  numberInput: {
    width: 80,
    padding: '0.5rem 0.75rem',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
    color: 'var(--slogbaa-text)',
    fontSize: '0.9375rem',
  },
  questionBlock: {
    marginTop: '1.25rem',
    padding: '1rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-bg)',
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  btn: (variant = 'primary') => ({
    padding: '0.5rem 0.9rem',
    borderRadius: 8,
    border: '1px solid ' + (variant === 'secondary' ? 'var(--slogbaa-border)' : 'transparent'),
    background: variant === 'primary' ? 'var(--slogbaa-orange)' : 'transparent',
    color: variant === 'primary' ? '#fff' : 'var(--slogbaa-text)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  }),
  btnDanger: {
    padding: '0.5rem 0.9rem',
    borderRadius: 8,
    border: '1px solid var(--slogbaa-error)',
    background: 'transparent',
    color: 'var(--slogbaa-error)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: { marginTop: '0.5rem', color: 'var(--slogbaa-error)', fontSize: '0.875rem' },
  success: { marginTop: '0.5rem', color: 'var(--slogbaa-green)', fontSize: '0.875rem' },
}

function newOption(order) {
  return { id: null, optionText: '', correct: false, optionOrder: order }
}

function newQuestion(order) {
  return {
    id: null,
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    points: 1,
    questionOrder: order,
    options: [newOption(0), newOption(1)],
  }
}

function mapResponseToForm(data) {
  if (!data) return null
  const questions = (data.questions || []).map((q, i) => ({
    id: q.id || null,
    questionText: q.questionText || '',
    questionType: q.questionType || 'MULTIPLE_CHOICE',
    points: q.points ?? 1,
    questionOrder: q.questionOrder ?? i,
    options: (q.options || []).map((o, j) => ({
      id: o.id || null,
      optionText: o.optionText || '',
      correct: o.correct === true,
      optionOrder: o.optionOrder ?? j,
    })),
  }))
  return {
    id: data.id || null,
    title: data.title || 'Module quiz',
    passThresholdPercent: data.passThresholdPercent ?? 70,
    maxAttempts: data.maxAttempts ?? null,
    timeLimitMinutes: data.timeLimitMinutes ?? null,
    questions,
  }
}

function formToPayload(form, moduleId) {
  return {
    id: form.id || null,
    title: form.title || 'Module quiz',
    passThresholdPercent: Math.max(0, Math.min(100, form.passThresholdPercent || 70)),
    maxAttempts: form.maxAttempts == null || form.maxAttempts === '' ? null : Number(form.maxAttempts),
    timeLimitMinutes: form.timeLimitMinutes == null || form.timeLimitMinutes === '' ? null : Number(form.timeLimitMinutes),
    questions: (form.questions || []).map((q, i) => ({
      id: q.id || null,
      questionText: q.questionText || '',
      questionType: q.questionType || 'MULTIPLE_CHOICE',
      points: Math.max(0, Number(q.points) || 1),
      questionOrder: q.questionOrder ?? i,
      options: (q.options || []).map((o, j) => ({
        id: o.id || null,
        optionText: o.optionText || '',
        correct: o.correct === true,
        optionOrder: o.optionOrder ?? j,
      })),
    })),
  }
}

export function AdminQuizEditor({ token, moduleId, onSaved }) {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const load = useCallback(async () => {
    if (!token || !moduleId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminQuiz(token, moduleId)
      setForm(mapResponseToForm(data) || {
        id: null,
        title: 'Module quiz',
        passThresholdPercent: 70,
        maxAttempts: null,
        timeLimitMinutes: null,
        questions: [newQuestion(0)],
      })
    } catch (e) {
      setForm({
        id: null,
        title: 'Module quiz',
        passThresholdPercent: 70,
        maxAttempts: null,
        timeLimitMinutes: null,
        questions: [newQuestion(0)],
      })
      setError(e?.message ?? 'Failed to load quiz.')
    } finally {
      setLoading(false)
    }
  }, [token, moduleId])

  useEffect(() => {
    load()
  }, [load])

  const handleSave = async () => {
    if (!token || !moduleId || !form) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const payload = formToPayload(form, moduleId)
      await saveAdminQuiz(token, moduleId, payload)
      setSuccess('Quiz saved.')
      onSaved?.()
      load()
    } catch (e) {
      setError(e?.message ?? 'Failed to save quiz.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !moduleId || !confirm('Delete this quiz? Trainees will no longer see it for this module.')) return
    setDeleting(true)
    setError(null)
    setSuccess(null)
    try {
      await deleteAdminQuiz(token, moduleId)
      setSuccess('Quiz deleted.')
      onSaved?.()
      setForm({
        id: null,
        title: 'Module quiz',
        passThresholdPercent: 70,
        maxAttempts: null,
        timeLimitMinutes: null,
        questions: [newQuestion(0)],
      })
    } catch (e) {
      setError(e?.message ?? 'Failed to delete quiz.')
    } finally {
      setDeleting(false)
    }
  }

  const updateForm = (updater) => {
    setForm((prev) => {
      if (!prev) return prev
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next ? { ...prev, ...next } : prev
    })
  }

  const addQuestion = () => {
    updateForm((prev) => ({
      questions: [...(prev.questions || []), newQuestion(prev.questions?.length ?? 0)],
    }))
  }

  const removeQuestion = (index) => {
    updateForm((prev) => ({
      questions: prev.questions?.filter((_, i) => i !== index) ?? [],
    }))
  }

  const updateQuestion = (index, patch) => {
    updateForm((prev) => {
      const qs = [...(prev.questions || [])]
      qs[index] = { ...qs[index], ...patch }
      return { questions: qs }
    })
  }

  const addOption = (qIndex) => {
    updateForm((prev) => {
      const qs = [...(prev.questions || [])]
      const q = qs[qIndex]
      const opts = [...(q.options || []), newOption(q.options?.length ?? 0)]
      qs[qIndex] = { ...q, options: opts }
      return { questions: qs }
    })
  }

  const removeOption = (qIndex, oIndex) => {
    updateForm((prev) => {
      const qs = [...(prev.questions || [])]
      const q = { ...qs[qIndex] }
      q.options = (q.options || []).filter((_, i) => i !== oIndex)
      qs[qIndex] = q
      return { questions: qs }
    })
  }

  const updateOption = (qIndex, oIndex, patch) => {
    updateForm((prev) => {
      const qs = [...(prev.questions || [])]
      const q = { ...qs[qIndex] }
      const opts = [...(q.options || [])]
      opts[oIndex] = { ...opts[oIndex], ...patch }
      q.options = opts
      qs[qIndex] = q
      return { questions: qs }
    })
  }

  if (loading && !form) return <p style={{ color: 'var(--slogbaa-text-muted)' }}>Loading quiz…</p>

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Module quiz</h3>
      <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
        Create or edit the quiz for this module. Trainees see it when they open the module (if “Has quiz” is enabled).
      </p>

      <div style={styles.field}>
        <label style={styles.label}>Quiz title</label>
        <input
          style={styles.input}
          value={form?.title ?? ''}
          onChange={(e) => updateForm({ title: e.target.value })}
          placeholder="e.g. Module 1 quiz"
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={styles.field}>
          <label style={styles.label}>Pass mark (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            style={styles.numberInput}
            value={form?.passThresholdPercent ?? 70}
            onChange={(e) => updateForm({ passThresholdPercent: Number(e.target.value) || 70 })}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Max attempts (optional)</label>
          <input
            type="number"
            min={1}
            style={styles.numberInput}
            value={form?.maxAttempts ?? ''}
            onChange={(e) => updateForm({ maxAttempts: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="Unlimited"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Time limit (min, optional)</label>
          <input
            type="number"
            min={1}
            style={styles.numberInput}
            value={form?.timeLimitMinutes ?? ''}
            onChange={(e) => updateForm({ timeLimitMinutes: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="None"
          />
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={styles.label}>Questions</label>
        {(form?.questions || []).map((q, qIndex) => (
          <div key={qIndex} style={styles.questionBlock}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slogbaa-text-muted)' }}>Q{qIndex + 1}</span>
              <button type="button" style={{ ...styles.btn('secondary'), padding: '0.25rem 0.5rem' }} onClick={() => removeQuestion(qIndex)}>
                Remove
              </button>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Question text</label>
              <input
                style={styles.input}
                value={q.questionText}
                onChange={(e) => updateQuestion(qIndex, { questionText: e.target.value })}
                placeholder="Enter the question"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={styles.field}>
                <label style={styles.label}>Type</label>
                <select
                  style={styles.input}
                  value={q.questionType}
                  onChange={(e) => updateQuestion(qIndex, { questionType: e.target.value })}
                >
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Points</label>
                <input
                  type="number"
                  min={1}
                  style={styles.numberInput}
                  value={q.points}
                  onChange={(e) => updateQuestion(qIndex, { points: Number(e.target.value) || 1 })}
                />
              </div>
            </div>
            {(q.questionType === 'MULTIPLE_CHOICE' || q.questionType === 'TRUE_FALSE') && (
              <div style={{ marginTop: '0.75rem' }}>
                <label style={styles.label}>Options (mark one as correct)</label>
                {(q.options || []).map((o, oIndex) => (
                  <div key={oIndex} style={styles.optionRow}>
                    <input
                      type="radio"
                      name={`correct_${qIndex}`}
                      checked={o.correct}
                      onChange={() => {
                        const opts = (q.options || []).map((opt, i) => ({ ...opt, correct: i === oIndex }))
                        updateQuestion(qIndex, { options: opts })
                      }}
                    />
                    <input
                      style={{ ...styles.input, flex: 1, maxWidth: 360 }}
                      value={o.optionText}
                      onChange={(e) => updateOption(qIndex, oIndex, { optionText: e.target.value })}
                      placeholder="Option text"
                    />
                    <button type="button" style={{ ...styles.btn('secondary'), padding: '0.25rem 0.5rem' }} onClick={() => removeOption(qIndex, oIndex)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" style={{ ...styles.btn('secondary'), marginTop: '0.5rem' }} onClick={() => addOption(qIndex)}>
                  + Add option
                </button>
              </div>
            )}
          </div>
        ))}
        <button type="button" style={{ ...styles.btn('secondary'), marginTop: '0.75rem' }} onClick={addQuestion}>
          + Add question
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={handleSave} disabled={saving} style={styles.btn('primary')}>
          {saving ? 'Saving…' : 'Save quiz'}
        </button>
        {form?.id && (
          <button type="button" onClick={handleDelete} disabled={deleting} style={styles.btnDanger}>
            {deleting ? 'Deleting…' : 'Delete quiz'}
          </button>
        )}
      </div>
    </div>
  )
}
