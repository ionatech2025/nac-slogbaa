import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../../shared/icons.jsx'
import { useTheme } from '../../../../contexts/ThemeContext.jsx'
import { getImpactStats } from '../../../../api/homepage.js'
import { queryKeys } from '../../../../lib/query-keys.js'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

export function ImpactSection() {
  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.homepage.impact(),
    queryFn: getImpactStats,
    staleTime: 5 * 60 * 1000,
  })

  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (isLoading) return null

  const genderData = [
    { name: 'Male', value: stats?.demographicsByGender?.MALE || 0, color: '#F58220' },
    { name: 'Female', value: stats?.demographicsByGender?.FEMALE || 0, color: '#34d399' },
  ]

  const districtData = Object.entries(stats?.demographicsByDistrict || {}).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value).slice(0, 5)

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    return (
      <div className="slg-stars">
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            icon={i < full ? icons.star : (i === full && half ? icons.starHalf : icons.starOutline)}
            size={18}
            fill={i < full || (i === full && half) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="slg-section" id="impact">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="slg-eyebrow" style={{ justifyContent: 'center' }}>Our Global Reach</span>
        <h2 className="slg-section-title" style={{ textAlign: 'center' }}>
          Real Impact, <em>Quantified</em>
        </h2>
        <p className="slg-section-desc" style={{ margin: '0.875rem auto 0', textAlign: 'center' }}>
          Tracking our progress as we empower citizens through civic education and leadership training across the region.
        </p>
      </div>

      <div className="slg-impact-grid">
        <div className="slg-impact-card">
          <div className="slg-impact-icon">◈</div>
          <div className="slg-impact-val">{(stats?.coursesDone || 0).toLocaleString()}+</div>
          <div className="slg-impact-label">Courses Completed</div>
        </div>
        <div className="slg-impact-card">
          <div className="slg-impact-icon">◉</div>
          <div className="slg-impact-val">{(stats?.certificatesIssued || 0).toLocaleString()}</div>
          <div className="slg-impact-label">Certificates Issued</div>
        </div>
        <div className="slg-impact-card">
          <div className="slg-impact-icon">◎</div>
          <div className="slg-impact-val">{(stats?.traineeCount || 0).toLocaleString()}</div>
          <div className="slg-impact-label">Active Trainees</div>
        </div>
      </div>

      <div className="slg-impact-visual">
        <div className="slg-chart-container">
          <div className="slg-chart-header">
            <div>
              <h3 className="slg-chart-title">Trainee Distribution</h3>
              <p className="slg-chart-subtitle">Top 5 Districts by Enrollment</p>
            </div>
            <div className="slg-impact-icon" style={{ width: 40, height: 40, fontSize: '1rem', marginBottom: 0 }}>◓</div>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#a1a1aa' : '#52525b', fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    background: isDark ? '#1e1e26' : '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" fill="#F58220" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="slg-chart-container">
          <div className="slg-chart-header">
            <div>
              <h3 className="slg-chart-title">Gender Inclusivity</h3>
              <p className="slg-chart-subtitle">Commitment to Gender Balanced Learning</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: 300 }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#1e1e26' : '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="slg-pie-legend">
              {genderData.map((entry) => (
                <div key={entry.name} className="slg-pie-legend-item">
                  <div className="slg-pie-dot" style={{ background: entry.color }} />
                  <span style={{ fontWeight: 600 }}>{entry.name}:</span>
                  <span>{((entry.value / (stats?.traineeCount || 1)) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="slg-impact-grid" style={{ marginTop: '2.5rem' }}>
        <div className="slg-chart-container" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <span className="slg-impact-label" style={{ marginBottom: '1.5rem' }}>Trainee Satisfaction</span>
          <div className="slg-rating-strip">
            <span className="slg-rating-val">{(stats?.avgTraineeRating || 0).toFixed(1)}</span>
            {renderStars(stats?.avgTraineeRating || 0)}
          </div>
          <p className="slg-chart-subtitle" style={{ marginTop: '1rem' }}>Overall Course Rating from Trainees</p>
        </div>
        <div className="slg-chart-container" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <span className="slg-impact-label" style={{ marginBottom: '1.5rem' }}>Admin Evaluation</span>
          <div className="slg-rating-strip">
            <span className="slg-rating-val">{(stats?.avgAdminRating || 0).toFixed(1)}</span>
            {renderStars(stats?.avgAdminRating || 0)}
          </div>
          <p className="slg-chart-subtitle" style={{ marginTop: '1rem' }}>Internal Course Quality Rating</p>
        </div>
        <div className="slg-impact-card" style={{ background: 'var(--orange)', color: '#fff', border: 'none', justifyContent: 'flex-start' }}>
          <h3 className="slg-serif" style={{ fontSize: '1.625rem', marginBottom: '0.5rem', fontWeight: 800 }}>Join SLOGBAA</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem' }}>Empowering citizens through knowledge and action.</p>
          <div className="slg-impact-btn-stack">
            <Link to="/auth/register" className="slg-btn-hero-primary" style={{ background: '#fff', color: 'var(--orange)', border: 'none', width: '100%', textAlign: 'center', cursor: 'pointer', position: 'relative', zIndex: 2 }}>
              Register Now
            </Link>
            <Link to="/public/courses-view" className="slg-btn-hero-secondary" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', width: '100%', textAlign: 'center', cursor: 'pointer', position: 'relative', zIndex: 2 }}>
              View Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
