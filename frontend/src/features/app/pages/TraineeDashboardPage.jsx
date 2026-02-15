import { useState } from 'react'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { useAuth } from '../../iam/context/AuthContext.jsx'
import { TraineeNav } from '../components/trainee/TraineeNav.jsx'
import { CourseCard } from '../components/trainee/CourseCard.jsx'
import { CertificateCard } from '../components/trainee/CertificateCard.jsx'

// Placeholder data until backend is connected
const MOCK_MY_COURSES = [
  {
    id: '1',
    title: 'Introduction to Civic Engagement',
    description: 'Foundational course on civic participation and community leadership for youth across Uganda.',
    meta: '5 modules · Certificate on completion',
    imageUrl: '/assets/images/courses/course1.jpg',
  },
]
const MOCK_AVAILABLE_COURSES = [
  {
    id: '2',
    title: 'Digital Literacy for Leaders',
    description: 'Building digital skills for effective communication and advocacy.',
    meta: '4 modules',
    imageUrl: '/assets/images/courses/course2.jpg',
  },
  {
    id: '3',
    title: 'Budget Advocacy Basics',
    description: 'Understand local budgets and how to advocate for community priorities.',
    meta: '6 modules',
    imageUrl: '/assets/images/courses/course3.jpg',
  },
]
const MOCK_CERTIFICATES = [
  {
    id: 'c1',
    title: 'Introduction to Civic Engagement',
    description: 'Completed on completion of all modules and passing the final assessment.',
    imageUrl: '/assets/images/certificates/cert1.jpg',
    pdfUrl: '#',
  },
  {
    id: 'c2',
    title: 'Digital Literacy for Leaders',
    description: 'Completed on completion of all modules and passing the final assessment.',
    imageUrl: '/assets/images/certificates/cert2.jpg',
    pdfUrl: '#',
  },
]

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
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('courses')
  const [courseView, setCourseView] = useState('vertical')
  const displayName = user?.fullName || user?.email || 'Trainee'

  const handleEnroll = (course) => {
    console.log('Enroll', course.id)
  }

  const handlePreviewCertificate = (cert) => {
    if (cert.pdfUrl && cert.pdfUrl !== '#') window.open(cert.pdfUrl, '_blank')
    else console.log('Preview', cert.id)
  }

  const handleDownloadCertificate = (cert) => {
    console.log('Download', cert.id)
  }

  return (
    <div style={styles.layout}>
      <TraineeNav />
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
            </div>
            <div style={courseView === 'horizontal' ? styles.cardList : styles.cardGrid}>
              {MOCK_MY_COURSES.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled
                  variant={courseView}
                />
              ))}
            </div>
            <h2 style={styles.sectionTitle}>Available Courses</h2>
            <div style={courseView === 'horizontal' ? styles.cardList : styles.cardGrid}>
              {MOCK_AVAILABLE_COURSES.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  variant={courseView}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'certificates' && (
          <>
            <h2 style={styles.sectionTitle}>Achieved Certificates</h2>
            <div style={styles.cardGrid}>
              {MOCK_CERTIFICATES.length === 0 ? (
                <p style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.9375rem' }}>
                  No certificates yet. Complete courses to earn certificates.
                </p>
              ) : (
                MOCK_CERTIFICATES.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    certificate={cert}
                    onPreview={handlePreviewCertificate}
                    onDownload={handleDownloadCertificate}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
