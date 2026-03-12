import { useState, useEffect, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { getAdminCourses, getAdminCourseDetails } from '../../../api/admin/courses.js'
import { getAdminCertificates, revokeCertificate } from '../../../api/admin/certificates.js'
import { getAdminQuizAttempts } from '../../../api/admin/assessment.js'
import { ConfirmModal } from '../../../shared/components/ConfirmModal.jsx'

const TAB_QUIZZES = 'quizzes'
const TAB_CERTIFICATES = 'certificates'
const TAB_ATTEMPTS = 'attempts'

const styles = {
  pageTitle: {
    margin: '0 0 1rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--slogbaa-orange)',
    letterSpacing: '-0.02em',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid var(--slogbaa-border)',
  },
  tab: {
    padding: '0.75rem 1.25rem',
    border: 'none',
    background: 'transparent',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: -2,
    transition: 'color 0.15s, border-color 0.15s',
  },
  tabActive: {
    color: 'var(--slogbaa-orange)',
    borderBottomColor: 'var(--slogbaa-orange)',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    margin: '0 0 1rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  tableWrap: {
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    background: 'var(--slogbaa-surface)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9375rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.875rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.8125rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--slogbaa-text-muted)',
    background: 'rgba(0,0,0,0.03)',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  td: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--slogbaa-border)',
    color: 'var(--slogbaa-text)',
  },
  trLast: {
    borderBottom: 'none',
  },
  link: {
    color: 'var(--slogbaa-orange)',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  linkHover: {
    textDecoration: 'underline',
  },
  emptyState: {
    padding: '2.5rem',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.9375rem',
  },
  card: {
    padding: '1.5rem',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    marginBottom: '1rem',
  },
  cardTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  cardText: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: 6,
    background: 'rgba(241, 134, 37, 0.15)',
    color: 'var(--slogbaa-orange)',
  },
  btnRevoke: {
    padding: '0.35rem 0.6rem',
    fontSize: '0.8125rem',
    border: '1px solid var(--slogbaa-error)',
    background: 'transparent',
    color: 'var(--slogbaa-error)',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 500,
  },
  badgeRevoked: {
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: 6,
    background: 'rgba(192, 57, 43, 0.15)',
    color: 'var(--slogbaa-error)',
  },
}

export function AdminAssessmentPage() {
  const { token, isSuperAdmin } = useOutletContext()
  const [activeTab, setActiveTab] = useState(TAB_QUIZZES)
  const [quizModules, setQuizModules] = useState([])
  const [certificates, setCertificates] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [certLoading, setCertLoading] = useState(false)
  const [attemptsLoading, setAttemptsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [certError, setCertError] = useState(null)
  const [attemptsError, setAttemptsError] = useState(null)
  const [revokeModal, setRevokeModal] = useState(null)

  const loadQuizModules = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const courses = await getAdminCourses(token)
      const details = await Promise.all(
        (courses || []).map((c) => getAdminCourseDetails(token, c.id).catch(() => null))
      )
      const modules = []
      ;(courses || []).forEach((course, i) => {
        const detail = details[i]
        if (!detail?.modules) return
        detail.modules
          .filter((m) => m.hasQuiz === true || m.has_quiz === true)
          .forEach((m) => {
            modules.push({
              courseId: course.id,
              courseTitle: course.title || detail.title,
              moduleId: m.id,
              moduleTitle: m.title,
            })
          })
      })
      setQuizModules(modules)
    } catch (err) {
      setError(err?.message ?? 'Failed to load quizzes.')
    } finally {
      setLoading(false)
    }
  }, [token])

  const loadCertificates = useCallback(async () => {
    if (!token) return
    setCertLoading(true)
    setCertError(null)
    try {
      const data = await getAdminCertificates(token)
      setCertificates(data ?? [])
    } catch (err) {
      setCertError(err?.message ?? 'Failed to load certificates.')
    } finally {
      setCertLoading(false)
    }
  }, [token])

  const loadAttempts = useCallback(async () => {
    if (!token) return
    setAttemptsLoading(true)
    setAttemptsError(null)
    try {
      const data = await getAdminQuizAttempts(token)
      setAttempts(data ?? [])
    } catch (err) {
      setAttemptsError(err?.message ?? 'Failed to load quiz attempts.')
    } finally {
      setAttemptsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (activeTab === TAB_QUIZZES) loadQuizModules()
    if (activeTab === TAB_CERTIFICATES) loadCertificates()
    if (activeTab === TAB_ATTEMPTS) loadAttempts()
  }, [activeTab, loadQuizModules, loadCertificates, loadAttempts])

  const handleRevoke = useCallback(async (cert) => {
    if (!token || !isSuperAdmin) return
    try {
      await revokeCertificate(token, cert.id)
      setCertificates((prev) => prev.map((c) => (c.id === cert.id ? { ...c, revoked: true } : c)))
      setRevokeModal(null)
    } catch (err) {
      setCertError(err?.message ?? 'Failed to revoke certificate.')
    }
  }, [token, isSuperAdmin])

  return (
    <div>
      <h1 style={styles.pageTitle}>Assessment</h1>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
        Manage quizzes and certificates. {!isSuperAdmin && 'You have view-only access.'}
      </p>

      <div style={styles.tabs}>
        <button
          type="button"
          style={{ ...styles.tab, ...(activeTab === TAB_QUIZZES ? styles.tabActive : {}) }}
          onClick={() => setActiveTab(TAB_QUIZZES)}
        >
          <FontAwesomeIcon icon={icons.blockActivity} style={{ marginRight: '0.5rem' }} />
          Quizzes
        </button>
        <button
          type="button"
          style={{ ...styles.tab, ...(activeTab === TAB_CERTIFICATES ? styles.tabActive : {}) }}
          onClick={() => setActiveTab(TAB_CERTIFICATES)}
        >
          <FontAwesomeIcon icon={icons.certificate} style={{ marginRight: '0.5rem' }} />
          Certificates
        </button>
      </div>

      {activeTab === TAB_QUIZZES && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Module quizzes</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            Quizzes are managed per module. Click a row to {isSuperAdmin ? 'edit' : 'view'} the quiz in the module editor.
          </p>
          {loading && (
            <p style={styles.emptyState}>Loading quizzes…</p>
          )}
          {error && (
            <p style={{ ...styles.emptyState, color: 'var(--slogbaa-error)' }}>{error}</p>
          )}
          {!loading && !error && quizModules.length === 0 && (
            <div style={styles.tableWrap}>
              <div style={styles.emptyState}>
                No modules with quizzes yet. Add a quiz when editing a module in Learning → Course → Module.
              </div>
            </div>
          )}
          {!loading && !error && quizModules.length > 0 && (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Module</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizModules.map((row, i) => (
                    <tr key={`${row.courseId}-${row.moduleId}`} style={i === quizModules.length - 1 ? styles.trLast : {}}>
                      <td style={styles.td}>{row.courseTitle}</td>
                      <td style={styles.td}>{row.moduleTitle}</td>
                      <td style={styles.td}>
                        <Link
                          to={`/admin/learning/${row.courseId}/modules/${row.moduleId}#quiz`}
                          style={styles.link}
                          title={isSuperAdmin ? 'Edit quiz' : 'View quiz'}
                        >
                          {isSuperAdmin ? (
                            <FontAwesomeIcon icon={icons.edit} />
                          ) : (
                            <FontAwesomeIcon icon={icons.eye} />
                          )}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === TAB_CERTIFICATES && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Certificates</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            Certificates are issued when trainees complete a course with a passing quiz score.
            {isSuperAdmin && ' As SuperAdmin, you can revoke certificates if needed.'}
          </p>
          {certLoading && <p style={styles.emptyState}>Loading certificates…</p>}
          {certError && (
            <p style={{ ...styles.emptyState, color: 'var(--slogbaa-error)' }}>{certError}</p>
          )}
          {!certLoading && !certError && certificates.length === 0 && (
            <div style={styles.tableWrap}>
              <div style={styles.emptyState}>No certificates issued yet.</div>
            </div>
          )}
          {!certLoading && !certError && certificates.length > 0 && (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Certificate</th>
                    <th style={styles.th}>Trainee</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Score</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    {isSuperAdmin && <th style={styles.th}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert, i) => (
                    <tr key={cert.id} style={i === certificates.length - 1 ? styles.trLast : {}}>
                      <td style={styles.td}>{cert.certificateNumber}</td>
                      <td style={styles.td}>{cert.traineeName}</td>
                      <td style={styles.td}>{cert.courseTitle}</td>
                      <td style={styles.td}>{cert.finalScorePercent}%</td>
                      <td style={styles.td}>{cert.issuedDate}</td>
                      <td style={styles.td}>
                        {cert.revoked ? (
                          <span style={styles.badgeRevoked}>Revoked</span>
                        ) : (
                          <span style={styles.badge}>Active</span>
                        )}
                      </td>
                      {isSuperAdmin && (
                        <td style={styles.td}>
                          {!cert.revoked && (
                            <button
                              type="button"
                              style={styles.btnRevoke}
                              onClick={() => setRevokeModal(cert)}
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {revokeModal && (
            <ConfirmModal
              message={`Revoke certificate ${revokeModal.certificateNumber} for ${revokeModal.traineeName}? This action cannot be undone.`}
              onContinue={() => handleRevoke(revokeModal)}
              onCancel={() => setRevokeModal(null)}
            />
          )}
        </div>
      )}

      {activeTab === TAB_ATTEMPTS && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quiz attempts</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
            Completed quiz attempts by trainees. Shows the most recent 500.
          </p>
          {attemptsLoading && <p style={styles.emptyState}>Loading attempts…</p>}
          {attemptsError && (
            <p style={{ ...styles.emptyState, color: 'var(--slogbaa-error)' }}>{attemptsError}</p>
          )}
          {!attemptsLoading && !attemptsError && attempts.length === 0 && (
            <div style={styles.tableWrap}>
              <div style={styles.emptyState}>No completed quiz attempts yet.</div>
            </div>
          )}
          {!attemptsLoading && !attemptsError && attempts.length > 0 && (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Trainee</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Module / Quiz</th>
                    <th style={styles.th}>Attempt</th>
                    <th style={styles.th}>Score</th>
                    <th style={styles.th}>Result</th>
                    <th style={styles.th}>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a, i) => (
                    <tr key={a.id} style={i === attempts.length - 1 ? styles.trLast : {}}>
                      <td style={styles.td}>{a.traineeName}</td>
                      <td style={styles.td}>{a.courseTitle}</td>
                      <td style={styles.td}>{a.moduleTitle} / {a.quizTitle}</td>
                      <td style={styles.td}>#{a.attemptNumber}</td>
                      <td style={styles.td}>{a.pointsEarned}/{a.totalPoints} ({a.scorePercent}%)</td>
                      <td style={styles.td}>
                        {a.passed ? (
                          <span style={styles.badge}>Passed</span>
                        ) : (
                          <span style={styles.badgeRevoked}>Failed</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {a.completedAt ? new Date(a.completedAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
