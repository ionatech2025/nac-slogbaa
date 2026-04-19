import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'
import { useAuth } from '../../../features/iam/context/AuthContext.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'
import { CourseCard } from '../components/trainee/CourseCard.jsx'
import { useEnrollInCourse, useEnrolledCourses } from '../../../lib/hooks/use-courses.js'
import { useCategories } from '../../../lib/hooks/use-categories.js'
import { useToast } from '../../../shared/hooks/useToast.js'
import { CardGridSkeleton } from '../../../shared/components/ContentSkeletons.jsx'
import { getPublishedCourses } from '../../../api/homepage.js'

const PAGE_CSS = `
  .slg-pub-courses-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  
  .slg-hero-pub {
    padding: 6rem 2rem 4rem; text-align: center; background: var(--bg-2);
    border-bottom: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .slg-pub-filters {
    max-width: 1200px; margin: -2rem auto 0; padding: 1.5rem 2rem;
    background: var(--bg); border: 1px solid var(--border); border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
    position: relative; z-index: 10;
  }
  .slg-search-wrap { position: relative; flex: 1; min-width: 300px; }
  .slg-search-input {
    width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border-radius: 10px;
    border: 1px solid var(--border); background: var(--bg-2); color: var(--text);
    font-size: 0.9375rem; transition: border-color 0.2s;
  }
  .slg-search-input:focus { outline: none; border-color: var(--orange); }
  .slg-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-3); }

  .slg-filter-group { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem; }
  .slg-filter-btn {
    padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg-2); color: var(--text-2); font-size: 0.8125rem; font-weight: 600;
    white-space: nowrap; cursor: pointer; transition: all 0.2s;
  }
  .slg-filter-btn.active { background: var(--orange); color: #fff; border-color: var(--orange); }

  .slg-courses-main { max-width: 1200px; margin: 4rem auto; padding: 0 2rem; }
  .slg-courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }

  .slg-auth-modal-content { text-align: center; padding: 1rem 0; }
  .slg-auth-modal-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: var(--text); }
  .slg-auth-modal-text { color: var(--text-3); margin-bottom: 2rem; line-height: 1.6; }
  .slg-auth-modal-actions { display: flex; gap: 1rem; justify-content: center; }
`

export function PublicCoursesPage() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['public', 'courses'],
    queryFn: getPublishedCourses,
    staleTime: 5 * 60 * 1000,
  })

  const { data: categories = [] } = useCategories()
  const { data: enrolled = [] } = useEnrolledCourses()
  const enrolledIds = useMemo(() => new Set(enrolled.map(c => c.id)), [enrolled])
  
  const enrollMutation = useEnrollInCourse()

  const categoryOptions = useMemo(() => {
    return ['All', ...categories.map(c => c.name)]
  }, [categories])

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          (c.description || '').toLowerCase().includes(search.toLowerCase())
      const matchesCat = activeCategory === 'All' || c.categoryName === activeCategory
      return matchesSearch && matchesCat
    })
  }, [courses, search, activeCategory])

  const handleEnrollClick = (course) => {
    if (!isAuthenticated) {
      setSelectedCourse(course)
      setShowAuthModal(true)
      return
    }

    if (enrolledIds.has(course.id)) {
      navigate(`/dashboard/courses/${course.id}`)
      return
    }

    enrollMutation.mutate(course.id, {
      onSuccess: () => {
        toast.success(`You have successfully enrolled in ${course.title}!`)
        navigate(`/dashboard/courses/${course.id}`)
      },
      onError: (err) => {
        toast.error(err?.message || 'Enrollment failed')
      }
    })
  }

  return (
    <div className={`slg-pub-courses-page ${theme}-theme`}>
      <style>{PAGE_CSS}</style>
      <Navbar />

      <header className="slg-hero-pub">
        <span className="slg-eyebrow">Learning Platform</span>
        <h1 className="slg-section-title" style={{ fontSize: '3.5rem' }}>Public <em>Courses</em></h1>
        <p className="slg-section-desc" style={{ margin: '0 auto' }}>
          Discover and enroll in a wide range of civic education and governance courses tailored for active citizens.
        </p>
      </header>

      <div className="slg-pub-filters">
        <div className="slg-search-wrap">
          <div className="slg-search-icon"><Icon icon={icons.search} size={18} /></div>
          <input 
            type="text" 
            placeholder="Search for courses..." 
            className="slg-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="slg-filter-group">
          {categoryOptions.map(cat => (
            <button 
              key={cat} 
              className={`slg-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="slg-courses-main">
        {coursesLoading ? (
          <CardGridSkeleton count={6} />
        ) : filtered.length > 0 ? (
          <div className="slg-courses-grid">
            {filtered.map(course => (
              <CourseCard 
                key={course.id}
                course={{
                  ...course,
                  description: course.description || 'No description available.',
                  meta: `${course.moduleCount} modules`,
                }}
                enrolled={enrolledIds.has(course.id)}
                onEnroll={() => handleEnrollClick(course)}
                onCardClick={() => handleEnrollClick(course)}
                enrolling={enrollMutation.isPending && enrollMutation.variables === course.id}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <Icon icon={icons.search} size={48} style={{ color: 'var(--text-4)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-2)' }}>No courses found</h3>
            <p style={{ color: 'var(--text-3)' }}>Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>

      <CtaSection />
      <Footer />

      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)} title="Join the Movement">
          <div className="slg-auth-modal-content">
            <h3 className="slg-auth-modal-title">Enrollment Required</h3>
            <p className="slg-auth-modal-text">
              To enroll in <strong>{selectedCourse?.title}</strong> and start your learning journey, 
              please sign in to your account or register a new one.
            </p>
            <div className="slg-auth-modal-actions">
              <Link to="/auth/login" className="slg-btn-hero-secondary" style={{ flex: 1, textAlign: 'center' }}>
                Login
              </Link>
              <Link to="/auth/register" className="slg-btn-hero-primary" style={{ flex: 1, textAlign: 'center' }}>
                Register Now
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
