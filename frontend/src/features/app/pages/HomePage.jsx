import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { getHomepageContent } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'

// Import styles
import '../styles/HomePage.css'


// Import extracted home components
import {
  HeroSection,
  AboutSection,
  ImpactSection,
  HowItWorksSection,
  ImpactStoriesSection,
  LibrarySection,
  PartnersSection,
  LibraryModal
} from '../components/home'

// Import fallback data
import { IMPACT_STORIES } from '../components/home/data'

/* ─── Page ───────────────────────────────────────────────────────────────── */
export function HomePage() {
  const [modalResource, setModalResource] = useState(null)
  const { data: cms } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
    retry: false,
  })

  const { theme } = useTheme()

  useEffect(() => {
    if (!sessionStorage.getItem('slogbaa-visited')) {
      // recordVisit()
      sessionStorage.setItem('slogbaa-visited', '1')
    }

    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [])

  const stories = cms?.stories?.length ? cms.stories : IMPACT_STORIES

  return (
    <div className={`slg-page ${theme}-theme`}>
      <Navbar />

      <HeroSection banners={cms?.banners} />

      <AboutSection variant="white" />
      {/* <ImpactSection /> silenced till numbers grow..*/}

      <HowItWorksSection variant="alt" />

      <ImpactStoriesSection stories={stories} variant="white" />

      <LibrarySection library={cms?.library} onOpenDetails={setModalResource} variant="alt" />

      <PartnersSection partners={cms?.partners} variant="white" />

      <CtaSection />

      <Footer />

      <LibraryModal resource={modalResource} onClose={() => setModalResource(null)} />
    </div >
  )
}