import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getEnrolledCourses, getPublishedCourses, enrollInCourse } from '../../../api/learning/courses.js'
import { getMyCertificates, downloadCertificate, sendCertificateEmail } from '../../../api/certificates.js'
import { CourseCard } from '../components/trainee/CourseCard.jsx'
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
    borderBottom: '2px solid var(--slogbaa-orange)',
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
}

export function TraineeDashboardPage() {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState('courses')
  const [courseView, setCourseView] = useState('vertical')
  const [recommendedCourseView, setRecommendedCourseView] = useState('vertical')
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [publishedCourses, setPublishedCourses] = useState([])
  const [enrolledLoading, setEnrolledLoading] = useState(true)
  const [publishedLoading, setPublishedLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [certificatesLoading, setCertificatesLoading] = useState(false)
  const [certificateActionId, setCertificateActionId] = useState(null)
  const [certificateError, setCertificateError] = useState(null)
  const [previewCourse, setPreviewCourse] = useState(null)
  const [coursesError, setCoursesError] = useState(null)
  const displayName = user?.fullName || user?.email || 'Trainee'

  useEffect(() => {
    if (!token) return
    setEnrolledLoading(true)
    getEnrolledCourses(token)
      .then(setEnrolledCourses)
      .catch(() => setEnrolledCourses([]))
      .finally(() => setEnrolledLoading(false))
  }, [token])

  useEffect(() => {
    if (!token) return
    setPublishedLoading(true)
    setCoursesError(null)
    getPublishedCourses(token)
      .then(setPublishedCourses)
      .catch((err) => {
        setCoursesError(err?.message ?? 'Failed to load courses.')
        setPublishedCourses([])
      })
      .finally(() => setPublishedLoading(false))
  }, [token])

  const enrolledIds = new Set(enrolledCourses.map((c) => c.id))
  const recommendedCourses = publishedCourses.filter((c) => !enrolledIds.has(c.id))

  const handleEnroll = async (course) => {
    if (!token || enrollingId) return
    setEnrollingId(course.id)
    setPreviewCourse(null)
    try {
      await enrollInCourse(token, course.id)
      setEnrolledCourses((prev) => [...prev, { ...course, moduleCount: course.moduleCount }])
    } catch (err) {
      setCoursesError(err?.message ?? 'Enrollment failed.')
    } finally {
      setEnrollingId(null)
    }
  }

  const handlePreview = (course) => setPreviewCourse(course)

  const loadCertificates = useCallback(async () => {
    if (!token) return
    setCertificatesLoading(true)
    try {
      const data = await getMyCertificates(token)
      setCertificates(data ?? [])
    } catch {
      setCertificates([])
    } finally {
      setCertificatesLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (activeTab === 'certificates') loadCertificates()
  }, [activeTab, loadCertificates])

  const handlePreviewCertificate = async (cert) => {
    if (!token || certificateActionId) return
    setCertificateActionId(cert.id)
    setCertificateError(null)
    try {
      const blob = await downloadCertificate(token, cert.id)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (e) {
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
    } catch (e) {
      setCertificateError('Could not download certificate. Please try again.')
    } finally {
      setCertificateActionId(null)
    }
  }

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <h1 style={styles.greeting}>Welcome Back, {displayName}! 👋</h1>
        <hr style={styles.greetingDivider} aria-hidden />
        <div style={styles.tabs}>
          <button
            type="button"
            style={{ ...styles.tab, ...(activeTab === 'courses' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('courses')}
          >
            <FontAwesomeIcon icon={icons.course} style={styles.tabIcon} />
            Courses
          </button>
          <button
            type="button"
            style={{ ...styles.tab, ...(activeTab === 'certificates' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('certificates')}
          >
            <FontAwesomeIcon icon={icons.certificate} style={styles.tabIcon} />
            Certificates
          </button>
        </div>

        {activeTab === 'courses' && (
          <>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>My Courses</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link
                  to="/dashboard/library"
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--slogbaa-blue)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Library →
                </Link>
                <Link
                  to="/dashboard/courses"
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--slogbaa-blue)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Browse courses to enroll →
                </Link>
              </span>
              {enrolledCourses.length > 0 && (
                <div style={styles.viewToggle} role="group" aria-label="Course view">
                  <button
                    type="button"
                    style={{
                      ...styles.viewToggleBtn,
                      ...(courseView === 'vertical' ? styles.viewToggleBtnActive : {}),
                    }}
                    onClick={() => setCourseView('vertical')}
                    aria-pressed={courseView === 'vertical'}
                    title="Card view"
                  >
                    <FontAwesomeIcon icon={icons.viewCards} style={styles.tabIcon} />
                    Cards
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.viewToggleBtn,
                      ...(courseView === 'horizontal' ? styles.viewToggleBtnActive : {}),
                    }}
                    onClick={() => setCourseView('horizontal')}
                    aria-pressed={courseView === 'horizontal'}
                    title="Row view"
                  >
                    <FontAwesomeIcon icon={icons.viewList} style={styles.tabIcon} />
                    Rows
                  </button>
                </div>
              )}
            </div>
            {enrolledLoading ? (
              <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
                Loading…
              </p>
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
                <Link
                  to="/dashboard/courses"
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--slogbaa-blue)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  View all courses →
                </Link>
                {recommendedCourses.length > 0 && (
                  <div style={styles.viewToggle} role="group" aria-label="Recommended course view">
                    <button
                      type="button"
                      style={{
                        ...styles.viewToggleBtn,
                        ...(recommendedCourseView === 'vertical' ? styles.viewToggleBtnActive : {}),
                      }}
                      onClick={() => setRecommendedCourseView('vertical')}
                      aria-pressed={recommendedCourseView === 'vertical'}
                      title="Card view"
                    >
                      <FontAwesomeIcon icon={icons.viewCards} style={styles.tabIcon} />
                      Cards
                    </button>
                    <button
                      type="button"
                      style={{
                        ...styles.viewToggleBtn,
                        ...(recommendedCourseView === 'horizontal' ? styles.viewToggleBtnActive : {}),
                      }}
                      onClick={() => setRecommendedCourseView('horizontal')}
                      aria-pressed={recommendedCourseView === 'horizontal'}
                      title="Row view"
                    >
                      <FontAwesomeIcon icon={icons.viewList} style={styles.tabIcon} />
                      Rows
                    </button>
                  </div>
                )}
              </div>
              {coursesError && (
                <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-error)', fontSize: '0.9375rem' }}>{coursesError}</p>
              )}
              {publishedLoading ? (
                <p style={{ margin: '0 0 1rem', color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
                  Loading recommended courses…
                </p>
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
                      enrolling={enrollingId === course.id}
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
