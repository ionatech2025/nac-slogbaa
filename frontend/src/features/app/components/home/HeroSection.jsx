import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getImpactStats } from '../../../../api/homepage.js'
import { queryKeys } from '../../../../lib/query-keys.js'

const HERO_SLIDES = [
  {
    eyebrow: 'Civic Education Platform',
    title: 'Empowering Active Citizens',
    highlight: 'Through Online Learning',
    subtitle: 'Build your civic leadership skills with structured courses, validated assessments, and recognised certificates.',
    accent: '#F58220',
  },
  {
    eyebrow: 'Learn Your Way',
    title: 'Train at Your Own Pace',
    highlight: 'From Any Device',
    subtitle: 'Access training modules and downloadable resources. Your progress saves automatically.',
    accent: '#34d399',
  },
  {
    eyebrow: 'Certificates & Recognition',
    title: 'Earn Credentials That',
    highlight: 'Open Doors',
    subtitle: 'Pass assessments, receive downloadable certificates, and have your achievements emailed directly to you.',
    accent: '#a78bfa',
  },
]

export function HeroSection({ banners }) {
  const { data: stats } = useQuery({
    queryKey: queryKeys.homepage.impact(),
    queryFn: getImpactStats,
    staleTime: 5 * 60 * 1000,
  })

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const slides = HERO_SLIDES.map((slide, i) => {
    const cmsBanner = banners && banners[i]
    return cmsBanner ? { ...slide, ...cmsBanner } : slide
  })
  const total = slides.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(next, 3000)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = slides[current] || slides[0] || {}

  const dynamicStats = [
    { value: stats ? `${(stats.traineeCount || 0).toLocaleString()}+` : '500+', label: 'Active Learners' },
    { value: stats ? (stats.coursesAvailable || 0) : '12', label: 'Courses Available' },
    { value: stats ? `${Math.round(((stats.coursesDone || 0) / (stats.traineeCount || 1)) * 100)}%` : '95%', label: 'Completion Rate' },
    { value: stats ? (stats.districtsCount || 0) : '8', label: 'Districts Reached' },
  ]

  return (
    <section
      className="slg-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="slg-background-image"
        style={{
          backgroundImage: slide.imageUrl || slide.image ? `url(${slide.imageUrl || slide.image})` : undefined
        }}
      />
      <div className="slg-hero-overlay" />
      <div className="slg-hero-bg" />
      <div className="slg-hero-grid" />

      <div className="slg-hero-content">
        {slide.eyebrow && (
          <div className="slg-hero-eyebrow" key={`eyebrow-${current}`}>
            {slide.eyebrow}
          </div>
        )}

        {slide.title && (
          <h1 className="slg-hero-title slg-serif" key={`title-${current}`}>
            {slide.title}{' '}
            {slide.highlight && <em>{slide.highlight}</em>}
          </h1>
        )}

        {slide.subtitle && (
          <h2 className="slg-hero-sub" key={`sub-${current}`} style={{ fontSize: '1.25rem', fontWeight: 400, opacity: 0.9 }}>
            {slide.subtitle}
          </h2>
        )}

        <div className="slg-hero-actions">
          <Link to="/auth/register" className="slg-btn-hero-primary">
            Get Started — It&apos;s Free
          </Link>
          <Link to="/auth/login" className="slg-btn-hero-secondary">
            Sign In
          </Link>
        </div>

        <div className="slg-stats-bar">
          {dynamicStats.map((s) => (
            <div key={s.label} className="slg-stat-item">
              <span className="slg-stat-val">{s.value}</span>
              <span className="slg-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="slg-dots" style={{ marginTop: '2.5rem' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`slg-dot ${i === current ? 'slg-dot-active' : 'slg-dot-inactive'}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
