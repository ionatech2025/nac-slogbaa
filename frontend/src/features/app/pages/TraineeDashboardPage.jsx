import { useState } from 'react'
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
    imageUrl: '/assets/images/courses/civic-engagement.jpg',
  },
]
const MOCK_AVAILABLE_COURSES = [
  {
    id: '2',
    title: 'Digital Literacy for Leaders',
    description: 'Building digital skills for effective communication and advocacy.',
    meta: '4 modules',
    imageUrl: '/assets/images/courses/digital-literacy.jpg',
  },
  {
    id: '3',
    title: 'Budget Advocacy Basics',
    description: 'Understand local budgets and how to advocate for community priorities.',
    meta: '6 modules',
    imageUrl: '/assets/images/courses/budget-advocacy.jpg',
  },
]
const MOCK_CERTIFICATES = [
  {
    id: 'c1',
    title: 'Introduction to Civic Engagement',
    description: 'Completed on completion of all modules and passing the final assessment.',
    imageUrl: '/assets/images/certificates/sample-cert.jpg',
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
  tabs: {
    display: 'flex',
    gap: 0,
    borderBottom: '2px solid var(--slogbaa-border)',
    marginBottom: '1.5rem',
  },
  tab: {
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
  sectionTitle: {
    margin: '0 0 1rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
}

export function TraineeDashboardPage() {
  const [activeTab, setActiveTab] = useState('courses')

  const handleEnroll = (course) => {
    console.log('Enroll', course.id)
    // TODO: call enrollment API when ready
  }

  const handlePreviewCertificate = (cert) => {
    if (cert.pdfUrl && cert.pdfUrl !== '#') window.open(cert.pdfUrl, '_blank')
    else console.log('Preview', cert.id)
  }

  const handleDownloadCertificate = (cert) => {
    console.log('Download', cert.id)
    // TODO: trigger download when API is ready
  }

  return (
    <div style={styles.layout}>
      <TraineeNav />
      <main style={styles.main}>
        <div style={styles.tabs}>
          <button
            type="button"
            style={{ ...styles.tab, ...(activeTab === 'courses' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            type="button"
            style={{ ...styles.tab, ...(activeTab === 'certificates' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('certificates')}
          >
            Certificates
          </button>
        </div>

        {activeTab === 'courses' && (
          <>
            <h2 style={styles.sectionTitle}>My Courses</h2>
            <div style={styles.cardGrid}>
              {MOCK_MY_COURSES.map((course) => (
                <CourseCard key={course.id} course={course} enrolled />
              ))}
            </div>
            <h2 style={styles.sectionTitle}>Available Courses</h2>
            <div style={styles.cardGrid}>
              {MOCK_AVAILABLE_COURSES.map((course) => (
                <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
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
