import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, Icon, icons } from '../../../shared/icons.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useEnrolledCourses, usePublishedCourses, useEnrollInCourse } from '../../../lib/hooks/use-courses.js'
import { useMyCertificates } from '../../../lib/hooks/use-certificates.js'
import { downloadCertificate, sendCertificateEmail } from '../../../api/certificates.js'
import { CourseCard } from '../components/trainee/CourseCard.jsx'
import { Tabs } from '../../../shared/components/Tabs.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'
import { CoursePreviewModal } from '../../learning/components/CoursePreviewModal.jsx'
import { CertificateCard } from '../components/trainee/CertificateCard.jsx'

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--slogbaa-bg)',
  },
  main: {
    flex: 1,
    padding: '1.5rem 2rem',
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
  },
  greeting: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  greetingDivider: {
    height: 0,
    border: 'none',
    borderBottom: '2px solid var(--slogbaa-border)',
    margin: '0 0 1.5rem',
  },
  tabs: {
    display: 'flex',
    gap: 0,
    borderBottom: '2px solid var(--slogbaa-border)',
    marginBottom: '1.5rem',
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.75rem 1.25rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text-muted)',
    position: 'relative',
    marginBottom: -2,
  },
  tabActive: {
    color: 'var(--slogbaa-blue)',
    borderBottom: '2px solid var(--slogbaa-blue)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  viewToggle: {
    display: 'flex',
    gap: 0,
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    overflow: 'hidden',
    background: 'var(--slogbaa-surface)',
  },
  viewToggleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.5rem 0.75rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
  },
  viewToggleBtnActive: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
  },
  tabIcon: {
    width: '1em',
    opacity: 0.9,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  // Continue Learning rail
  continueRail: {
    marginBottom: '1.75rem',
  },
  continueScroll: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem',
  },
  continueCard: {
    flex: '0 0 280px',
    padding: '1rem 1.25rem',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    textDecoration: 'none',
    color: 'var(--slogbaa-text)',
    display: 'block',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  continueTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  continueProgressWrap: {
    height: 6,
    borderRadius: 3,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
    marginBottom: '0.35rem',
  },
  continueProgressFill: {
    height: '100%',
    borderRadius: 3,
    background: 'linear-gradient(90deg, var(--slogbaa-blue), var(--slogbaa-green))',
    transition: 'width 0.3s',
  },
  continueMeta: {
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
    fontWeight: 500,
  },
  // Motivation stats row
  statsRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 140px',
    padding: '1rem 1.25rem',
    borderRadius: 12,
    border: '1px solid var(--slogbaa-border)',
    background: 'var(--slogbaa-surface)',
    textAlign: 'center',
  },
  statValue: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--slogbaa-blue)',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--slogbaa-text-muted)',
    marginTop: '0.25rem',
  },
}

export function TraineeDashboardPage() {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState('courses')
  const [courseView, setCourseView] = useState('vertical')
  const [recommendedCourseView, setRecommendedCourseView] = useState('vertical')
  const [certificateActionId, setCertificateActionId] = useState(null)
  const [certificateError, setCertificateError] = useState(null)
  const [previewCourse, setPreviewCourse] = useState(null)

  // TanStack Query hooks — shared cache, no duplicated fetches
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useEnrolledCourses()
  const { data: publishedCourses = [], isLoading: publishedLoading, error: coursesError } = usePublishedCourses()
  const { data: certificates = [], isLoading: certificatesLoading } = useMyCertificates({ enabled: activeTab === 'certificates' })
  const enrollMutation = useEnrollInCourse()

  const displayName = user?.fullName || user?.email || 'Trainee'
  const enrolledIds = new Set(enrolledCourses.map((c) => c.id))
  const recommendedCourses = publishedCourses.filter((c) => !enrolledIds.has(c.id))

  const toast = useToast()

  const handleEnroll = async (course) => {
    setPreviewCourse(null)
    enrollMutation.mutate(course.id, {
      onSuccess: () => toast.success(`Enrolled in "${course.title}"!`),
      onError: (err) => toast.error(err?.message ?? 'Enrollment failed.'),
    })
  }

  const handlePreview = (course) => setPreviewCourse(course)

  const handlePreviewCertificate = async (cert) => {
    if (!token || certificateActionId) return
    setCertificateActionId(cert.id)
    setCertificateError(null)
    try {
      const blob = await downloadCertificate(token, cert.id)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch {
      setCertificateError('Could not preview certificate. Please try downloading instead.')
    } finally {
      setCertificateActionId(null)
    }
  }

  const handleDownloadCertificate = async (cert, alsoSendEmail = false) => {
    if (!token || certificateActionId) return
    setCertificateActionId(cert.id)
    setCertificateError(null)
    try {
      const blob = await downloadCertificate(token, cert.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cert.certificateNumber || 'certificate'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      if (alsoSendEmail) {
        await sendCertificateEmail(token, cert.id)
      }
    } catch {
      setCertificateError('Could not download certificate. Please try again.')
    } finally {
      setCertificateActionId(null)
    }
  }

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <h1 style={styles.greeting}>Welcome Back, {displayName}!</h1>
        <hr style={styles.greetingDivider} aria-hidden />

        {/* Motivation stats */}
        {!enrolledLoading && (
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <span style={styles.statValue}>{enrolledCourses.length}</span>
              <div style={styles.statLabel}>Enrolled</div>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>{enrolledCourses.filter((c) => (c.completionPercentage ?? 0) >= 100).length}</span>
              <div style={styles.statLabel}>Completed</div>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>
                {enrolledCourses.length > 0
                  ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.completionPercentage ?? 0), 0) / enrolledCourses.length)
                  : 0}%
              </span>
              <div style={styles.statLabel}>Avg Progress</div>
            </div>
            <div style={{ ...styles.statCard, borderColor: 'rgba(5, 150, 105, 0.25)', background: 'rgba(5, 150, 105, 0.04)' }}>
              <span style={{ ...styles.statValue, color: 'var(--slogbaa-green)' }}>
                {enrolledCourses.filter((c) => (c.completionPercentage ?? 0) > 0 && (c.completionPercentage ?? 0) < 100).length}
              </span>
              <div style={styles.statLabel}>In Progress</div>
            </div>
          </div>
        )}

        {/* Continue Learning rail — in-progress courses */}
        {(() => {
          const inProgress = enrolledCourses.filter((c) => (c.completionPercentage ?? 0) > 0 && (c.completionPercentage ?? 0) < 100)
          if (inProgress.length === 0) return null
          return (
            <div style={styles.continueRail}>
              <h2 style={{ ...styles.sectionTitle, marginBottom: '0.75rem' }}>Continue Learning</h2>
              <div style={styles.continueScroll}>
                {inProgress.map((course) => (
                  <Link key={course.id} to={`/dashboard/courses/${course.id}`} style={styles.continueCard}>
                    <div style={styles.continueTitle}>{course.title}</div>
                    <div style={styles.continueProgressWrap}>
                      <div style={{ ...styles.continueProgressFill, width: `${Math.min(100, course.completionPercentage ?? 0)}%` }} />
                    </div>
                    <div style={styles.continueMeta}>
                      {course.completionPercentage ?? 0}% complete &middot; {course.moduleCount ?? 0} module{(course.moduleCount ?? 0) !== 1 ? 's' : ''}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        <Tabs
          tabs={[
            { value: 'courses', label: 'Courses', icon: <Icon icon={icons.course} size="1em" /> },
            { value: 'certificates', label: 'Certificates', icon: <Icon icon={icons.certificate} size="1em" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'courses' && (
          <>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>My Courses</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/dashboard/library" style={{ fontSize: '0.9375rem', color: 'var(--slogbaa-blue)', textDecoration: 'none', fontWeight: 500 }}>
                  Library →
                </Link>
                <Link to="/dashboard/courses" style={{ fontSize: '0.9375rem', color: 'var(--slogbaa-blue)', textDecoration: 'none', fontWeight: 500 }}>
                  Browse courses to enroll →
                </Link>
              </span>
              {enrolledCourses.length > 0 && (
                <div style={styles.viewToggle} role="group" aria-label="Course view">
                  <button type="button" style={{ ...styles.viewToggleBtn, ...(courseView === 'vertical' ? styles.viewToggleBtnActive : {}) }} onClick={() => setCourseView('vertical')} aria-pressed={courseView === 'vertical'} title="Card view">
                    <FontAwesomeIcon icon={icons.viewCards} style={styles.tabIcon} />
                    Cards
                  </button>
                  <button type="button" style={{ ...styles.viewToggleBtn, ...(courseView === 'horizontal' ? styles.viewToggleBtnActive : {}) }} onClick={() => setCourseView('horizontal')} aria-pressed={courseView === 'horizontal'} title="Row view">
                    <FontAwesomeIcon icon={icons.viewList} style={styles.tabIcon} />
                    Rows
                  </button>
                </div>
              )}
            </div>
            {enrolledLoading ? (
              <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>Loading…</p>
            ) : enrolledCourses.length === 0 ? (
              <p style={{ margin: '0 0 1rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
                You&apos;re not enrolled in any courses yet. <Link to="/dashboard/courses" style={{ color: 'var(--slogbaa-blue)' }}>Browse courses</Link> to enroll and get started.
              </p>
            ) : (
              <div style={courseView === 'horizontal' ? styles.cardList : styles.cardGrid}>
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={{
                      id: course.id,
                      title: course.title,
                      description: course.description || 'No description.',
                      imageUrl: course.imageUrl,
                      meta: course.moduleCount != null ? `${course.moduleCount} module${course.moduleCount !== 1 ? 's' : ''}` : undefined,
                    }}
                    enrolled
                    completionPercentage={course.completionPercentage}
                    viewHref={`/dashboard/courses/${course.id}`}
                    variant={courseView}
                  />
                ))}
              </div>
            )}

            <div style={{ marginTop: '2.5rem' }}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Recommended Courses</h2>
                <Link to="/dashboard/courses" style={{ fontSize: '0.9375rem', color: 'var(--slogbaa-blue)', textDecoration: 'none', fontWeight: 500 }}>
                  View all courses →
                </Link>
                {recommendedCourses.length > 0 && (
                  <div style={styles.viewToggle} role="group" aria-label="Recommended course view">
                    <button type="button" style={{ ...styles.viewToggleBtn, ...(recommendedCourseView === 'vertical' ? styles.viewToggleBtnActive : {}) }} onClick={() => setRecommendedCourseView('vertical')} aria-pressed={recommendedCourseView === 'vertical'} title="Card view">
                      <FontAwesomeIcon icon={icons.viewCards} style={styles.tabIcon} />
                      Cards
                    </button>
                    <button type="button" style={{ ...styles.viewToggleBtn, ...(recommendedCourseView === 'horizontal' ? styles.viewToggleBtnActive : {}) }} onClick={() => setRecommendedCourseView('horizontal')} aria-pressed={recommendedCourseView === 'horizontal'} title="Row view">
                      <FontAwesomeIcon icon={icons.viewList} style={styles.tabIcon} />
                      Rows
                    </button>
                  </div>
                )}
              </div>
              {coursesError && (
                <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-error)', fontSize: '0.9375rem' }}>{coursesError.message || 'Failed to load courses.'}</p>
              )}
              {publishedLoading ? (
                <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>Loading recommended courses…</p>
              ) : recommendedCourses.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)' }}>
                  No recommended courses right now. <Link to="/dashboard/courses" style={{ color: 'var(--slogbaa-blue)' }}>Browse all courses</Link>.
                </p>
              ) : (
                <div style={recommendedCourseView === 'horizontal' ? styles.cardList : styles.cardGrid}>
                  {recommendedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={{
                        id: course.id,
                        title: course.title,
                        description: course.description || 'No description.',
                        imageUrl: course.imageUrl,
                        meta: `${course.moduleCount} module${course.moduleCount !== 1 ? 's' : ''}`,
                      }}
                      onEnroll={handleEnroll}
                      onPreview={handlePreview}
                      variant={recommendedCourseView}
                      enrolling={enrollMutation.isPending && enrollMutation.variables === course.id}
                    />
                  ))}
                </div>
              )}
            </div>
            {previewCourse && (
              <CoursePreviewModal
                course={previewCourse}
                onClose={() => setPreviewCourse(null)}
                onEnroll={(c) => handleEnroll(c)}
              />
            )}
          </>
        )}

        {activeTab === 'certificates' && (
          <>
            <h2 style={styles.sectionTitle}>Achieved Certificates</h2>
            {certificateError && (
              <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-error)', fontSize: '0.9375rem' }}>{certificateError}</p>
            )}
            {certificatesLoading ? (
              <p style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>Loading certificates…</p>
            ) : certificates.length === 0 ? (
              <p style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
                No certificates yet. Complete courses with passing quiz scores to earn certificates.
              </p>
            ) : (
              <div style={styles.cardGrid}>
                {certificates.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    certificate={{
                      id: cert.id,
                      title: cert.courseTitle || cert.certificateNumber,
                      description: `Score: ${cert.finalScorePercent}%. Issued: ${cert.issuedDate}.`,
                      certificateNumber: cert.certificateNumber,
                      fileUrl: cert.fileUrl,
                    }}
                    actionLoading={certificateActionId === cert.id}
                    onPreview={handlePreviewCertificate}
                    onDownload={(c) => handleDownloadCertificate(c)}
                    onSendEmail={(c) => handleDownloadCertificate(c, true)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
