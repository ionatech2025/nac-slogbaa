import { useMemo } from 'react'
import { Link, useOutletContext, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Skeleton } from '../../../shared/components/Skeleton.jsx'
import { AnimatedCounter } from '../../../shared/components/AnimatedCounter.jsx'
import {
  useAdminCourses,
  useAdminCertificates,
  useAdminQuizAttempts,
  useAdminLibrary,
} from '../../../lib/hooks/use-admin.js'
import { getVisitorCount } from '../../../api/homepage.js'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

// ── Color constants for Recharts (CSS vars don't work in SVG) ──
const COLORS = {
  green: '#059669',
  blue: '#2563eb',
  orange: '#d97706',
  error: '#dc2626',
}

// ── Helpers ──

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-UG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

// ── Custom Recharts tooltip ──

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      style={{
        padding: '0.5rem 0.75rem',
        borderRadius: 10,
        border: '1px solid var(--slogbaa-glass-border)',
        background: 'var(--slogbaa-glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: 'var(--slogbaa-glass-shadow)',
        fontSize: '0.75rem',
        color: 'var(--slogbaa-text)',
        lineHeight: 1.5,
      }}
    >
      {label && (
        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{label}</div>
      )}
      {payload.map((entry, i) => (
        <div key={i} style={{ color: entry.color || 'var(--slogbaa-text)' }}>
          {entry.name}: <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  )
}

// ── Styles ──

const s = {
  hero: {
    marginBottom: '1.75rem',
  },
  greeting: {
    margin: 0,
    fontSize: '1.625rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.02em',
    lineHeight: 1.3,
  },
  dateLine: {
    margin: '0.2rem 0 0',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    fontWeight: 400,
  },
  tagline: {
    margin: '0.4rem 0 0',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },

  // KPI grid
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
    gap: '0.875rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    padding: '1.125rem 1rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  kpiIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.625rem',
    fontSize: '1.125rem',
  },
  kpiValue: {
    margin: 0,
    fontSize: '1.625rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    lineHeight: 1.2,
  },
  kpiLabel: {
    margin: '0.2rem 0 0',
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--slogbaa-text-muted)',
  },
  kpiSub: {
    margin: '0.15rem 0 0',
    fontSize: '0.6875rem',
    color: 'var(--slogbaa-text-muted)',
  },

  // Section title
  sectionLabel: {
    margin: '0 0 0.875rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--slogbaa-blue)',
  },
  sectionTitle: {
    margin: '0 0 1rem',
    fontSize: '1.0625rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },

  // Quick actions
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
    gap: '0.875rem',
    marginBottom: '2rem',
  },
  actionCard: {
    display: 'block',
    padding: '1.125rem 1rem',
    borderRadius: 16,
    textDecoration: 'none',
    color: 'var(--slogbaa-text)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
  },
  actionTitle: {
    margin: '0.625rem 0 0.2rem',
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  actionDesc: {
    margin: 0,
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.4,
  },

  // Two-column layout
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },

  // Panel (glass card for sections)
  panel: {
    padding: '1.25rem',
    borderRadius: 18,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },

  // Activity feed
  feedList: {
    maxHeight: 340,
    overflowY: 'auto',
  },
  feedItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.625rem',
    padding: '0.625rem 0',
    borderBottom: '1px solid var(--slogbaa-border)',
    fontSize: '0.8125rem',
    lineHeight: 1.45,
  },
  feedDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '0.35rem',
  },
  feedBody: {
    flex: 1,
    minWidth: 0,
  },
  feedName: {
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  feedDetail: {
    color: 'var(--slogbaa-text-muted)',
  },
  feedTime: {
    fontSize: '0.6875rem',
    color: 'var(--slogbaa-text-muted)',
    marginTop: '0.15rem',
  },

  // Course health
  courseRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--slogbaa-border)',
    fontSize: '0.8125rem',
  },
  courseTitle: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    fontWeight: 600,
  },
  courseMeta: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },

  // Insights grid
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '0.875rem',
    marginBottom: '1.25rem',
  },
  insightTile: {
    padding: '1rem',
    borderRadius: 14,
    border: '1px solid var(--slogbaa-glass-border-subtle)',
    background: 'var(--slogbaa-glass-bg-subtle)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    textAlign: 'center',
  },
  insightValue: {
    margin: 0,
    fontSize: '1.375rem',
    fontWeight: 800,
    color: 'var(--slogbaa-text)',
    lineHeight: 1.2,
  },
  insightLabel: {
    margin: '0.2rem 0 0',
    fontSize: '0.6875rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text-muted)',
  },

  // Charts section
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  chartPanel: {
    padding: '1.25rem',
    borderRadius: 18,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  chartTitle: {
    margin: '0 0 0.75rem',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },

  // Quick nav
  navPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.625rem',
  },
  navPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.45rem 0.875rem',
    borderRadius: 999,
    background: 'var(--slogbaa-glass-bg-subtle)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border-subtle)',
    color: 'var(--slogbaa-text)',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    fontWeight: 500,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
  },

  empty: {
    padding: '1.5rem 0',
    textAlign: 'center',
    color: 'var(--slogbaa-text-muted)',
    fontSize: '0.875rem',
  },
}

// ── Color accents for KPI icons ──
const ACCENT = {
  blue: { bg: 'rgba(37, 99, 235, 0.12)', color: 'var(--slogbaa-blue)' },
  green: { bg: 'rgba(5, 150, 105, 0.12)', color: 'var(--slogbaa-green)' },
  orange: { bg: 'rgba(217, 119, 6, 0.12)', color: 'var(--slogbaa-orange)' },
}

// ── Quick actions config ──
const ACTIONS = [
  { to: '/admin/overview', icon: icons.users, title: 'Manage People', desc: 'Staff & trainee management', accent: ACCENT.blue },
  { to: '/admin/learning', icon: icons.course, title: 'Manage Courses', desc: 'Create and edit learning content', accent: ACCENT.green },
  { to: '/admin/library', icon: icons.library, title: 'Resource Library', desc: 'Upload and organize materials', accent: ACCENT.orange },
  { to: '/admin/assessment', icon: icons.assessment, title: 'Assessments', desc: 'Quizzes, attempts & certificates', accent: ACCENT.blue },
]

// ── Nav links ──
const NAV_LINKS = [
  { to: '/admin/overview', icon: icons.overview, label: 'Overview' },
  { to: '/admin/learning', icon: icons.learning, label: 'Learning' },
  { to: '/admin/coursemanagement', icon: icons.course, label: 'Course Mgmt' },
  { to: '/admin/library', icon: icons.library, label: 'Library' },
  { to: '/admin/assessment', icon: icons.assessment, label: 'Assessment' },
]

// ── Pie chart label renderer ──
const PIE_COLORS = [COLORS.green, COLORS.orange]

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  if (value === 0) return null
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {value}
    </text>
  )
}

// ── Sub-components ──

function KpiCard({ icon, accent, value, label, sub, loading, delay = 0, suffix = '', isText = false, to }) {
  const navigate = useNavigate()
  if (loading) {
    return (
      <div style={s.kpiCard}>
        <Skeleton style={{ width: 38, height: 38, borderRadius: 10, marginBottom: 10 }} />
        <Skeleton style={{ width: 50, height: 24, borderRadius: 6, marginBottom: 6 }} />
        <Skeleton style={{ width: 70, height: 10, borderRadius: 4 }} />
      </div>
    )
  }
  const clickable = !!to
  const handleClick = clickable ? () => navigate(to) : undefined
  const handleKeyDown = clickable
    ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(to) } }
    : undefined
  return (
    <div
      style={{ ...s.kpiCard, ...(clickable ? { cursor: 'pointer' } : {}) }}
      className={`glass-hover glass-enter${delay ? ` glass-enter-delay-${delay}` : ''}${clickable ? ' kpi-clickable' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...(clickable ? { role: 'link', tabIndex: 0, 'aria-label': `View ${label} details` } : {})}
    >
      <div style={{ ...s.kpiIconWrap, background: accent.bg, color: accent.color }}>
        <Icon icon={icon} size={20} />
      </div>
      <p style={s.kpiValue}>
        {isText ? (
          value
        ) : (
          <AnimatedCounter
            value={typeof value === 'number' ? value : Number(value) || 0}
            suffix={suffix}
            duration={900}
          />
        )}
      </p>
      <p style={s.kpiLabel}>{label}</p>
      {sub && <p style={s.kpiSub}>{sub}</p>}
    </div>
  )
}

function FeedItem({ item }) {
  const dotColor = item.type === 'certificate'
    ? 'var(--slogbaa-green)'
    : item.passed
      ? 'var(--slogbaa-green)'
      : 'var(--slogbaa-error)'

  return (
    <div style={s.feedItem}>
      <span style={{ ...s.feedDot, background: dotColor }} />
      <div style={s.feedBody}>
        <span style={s.feedName}>{item.name}</span>{' '}
        {item.type === 'certificate' ? (
          <span style={s.feedDetail}>
            earned certificate for <strong>{item.detail}</strong> ({item.score}%)
          </span>
        ) : (
          <span style={s.feedDetail}>
            scored <strong>{item.score}%</strong> on {item.detail}
            {item.passed ? ' — passed' : ' — failed'}
          </span>
        )}
        <div style={s.feedTime}>{timeAgo(item.date)}</div>
      </div>
    </div>
  )
}

// ── Main Component ──

export function AdminHomePage() {
  const {
    staff = [],
    trainees = [],
    courseCount = 0,
    overviewLoading,
    displayName,
    token,
  } = useOutletContext()
  const navigate = useNavigate()

  useDocumentTitle('Admin Home')

  const { data: courses = [], isLoading: coursesLoading } = useAdminCourses()
  const { data: certificates = [], isLoading: certsLoading } = useAdminCertificates()
  const { data: attempts = [], isLoading: attemptsLoading } = useAdminQuizAttempts()
  const { data: library = [], isLoading: libraryLoading } = useAdminLibrary()

  // Site visitor count
  const { data: visitorData } = useQuery({
    queryKey: ['admin', 'cms', 'visitors'],
    queryFn: () => getVisitorCount(token),
    staleTime: 60_000,
    retry: false,
    enabled: !!token,
  })
  const totalVisitors = visitorData?.total ?? 0

  // Derived KPIs
  const publishedCount = useMemo(() => courses.filter((c) => c.published).length, [courses])
  const draftCount = useMemo(() => courses.filter((c) => !c.published).length, [courses])
  const activeCerts = useMemo(() => certificates.filter((c) => !c.revoked).length, [certificates])
  const passRate = useMemo(() => {
    if (!attempts.length) return 0
    return Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100)
  }, [attempts])
  const avgScore = useMemo(() => {
    if (!attempts.length) return 0
    return Math.round(attempts.reduce((sum, a) => sum + (a.scorePercent || 0), 0) / attempts.length)
  }, [attempts])

  // Activity feed
  const activityFeed = useMemo(() => {
    const items = []
    attempts.forEach((a) =>
      items.push({
        type: 'quiz',
        name: a.traineeName,
        detail: `${a.quizTitle || a.moduleTitle} (${a.courseTitle})`,
        score: a.scorePercent,
        passed: a.passed,
        date: a.completedAt,
      })
    )
    certificates.forEach((c) =>
      items.push({
        type: 'certificate',
        name: c.traineeName,
        detail: c.courseTitle,
        score: c.finalScorePercent,
        date: c.issuedDate,
      })
    )
    items.sort((a, b) => new Date(b.date) - new Date(a.date))
    return items.slice(0, 10)
  }, [attempts, certificates])

  // Top courses
  const topCourses = useMemo(
    () => [...courses].sort((a, b) => (b.moduleCount || 0) - (a.moduleCount || 0)).slice(0, 5),
    [courses]
  )

  // Most active district
  const topDistrict = useMemo(() => {
    const counts = {}
    trainees.forEach((t) => {
      const d = t.districtName || t.district
      if (d) counts[d] = (counts[d] || 0) + 1
    })
    const entries = Object.entries(counts)
    if (!entries.length) return 'N/A'
    entries.sort((a, b) => b[1] - a[1])
    return entries[0][0]
  }, [trainees])

  const revokedRate = useMemo(() => {
    if (!certificates.length) return 0
    return Math.round((certificates.filter((c) => c.revoked).length / certificates.length) * 100)
  }, [certificates])

  // ── Chart data: PieChart for course health ──
  const courseHealthPieData = useMemo(
    () => [
      { name: 'Published', value: publishedCount },
      { name: 'Draft', value: draftCount },
    ],
    [publishedCount, draftCount]
  )

  // ── Chart data: BarChart for quiz score distribution ──
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81-100', min: 81, max: 100, count: 0 },
    ]
    attempts.forEach((a) => {
      const score = a.scorePercent || 0
      for (const r of ranges) {
        if (score >= r.min && score <= r.max) {
          r.count++
          break
        }
      }
    })
    return ranges.map((r) => ({ range: r.range, Attempts: r.count }))
  }, [attempts])

  // ── Chart data: AreaChart for 7-day activity ──
  const activityByDay = useMemo(() => {
    const dayMap = {}
    const now = new Date()
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dayMap[key] = { date: key, label: d.toLocaleDateString('en-UG', { weekday: 'short', day: 'numeric' }), activity: 0 }
    }
    // Count attempts per day
    attempts.forEach((a) => {
      if (!a.completedAt) return
      const key = new Date(a.completedAt).toISOString().slice(0, 10)
      if (dayMap[key]) dayMap[key].activity++
    })
    // Count certificates per day
    certificates.forEach((c) => {
      if (!c.issuedDate) return
      const key = new Date(c.issuedDate).toISOString().slice(0, 10)
      if (dayMap[key]) dayMap[key].activity++
    })
    return Object.values(dayMap)
  }, [attempts, certificates])

  const feedLoading = attemptsLoading || certsLoading

  return (
    <div>
      {/* ── Hero Greeting ── */}
      <div style={s.hero} className="glass-enter">
        <h2 style={s.greeting}>
          {getGreeting()}, {displayName}
        </h2>
        <p style={s.dateLine}>{formatDate()}</p>
        <p style={s.tagline}>Here's what's happening on SLOGBAA today.</p>
      </div>

      {/* ── KPI Stat Cards ── */}
      <p style={s.sectionLabel}>Platform Overview</p>
      <div style={s.kpiGrid}>
        <KpiCard
          icon={icons.globe}
          accent={ACCENT.green}
          value={totalVisitors}
          label="Site Visitors"
          loading={!visitorData}
        />
        <KpiCard
          icon={icons.users}
          accent={ACCENT.blue}
          value={trainees.length}
          label="Trainees"
          loading={overviewLoading}
          to="/admin/overview#trainees"
        />
        <KpiCard
          icon={icons.shield}
          accent={ACCENT.green}
          value={staff.length}
          label="Staff"
          loading={overviewLoading}
          delay={1}
          to="/admin/overview#staff"
        />
        <KpiCard
          icon={icons.course}
          accent={ACCENT.blue}
          value={courseCount}
          label="Courses"
          sub={coursesLoading ? '...' : `${publishedCount} published / ${draftCount} draft`}
          loading={overviewLoading}
          delay={2}
          to="/admin/learning"
        />
        <KpiCard
          icon={icons.certificate}
          accent={ACCENT.green}
          value={activeCerts}
          label="Certificates"
          loading={certsLoading}
          delay={3}
          to="/admin/assessment?tab=certificates"
        />
        <KpiCard
          icon={icons.grades}
          accent={passRate >= 70 ? ACCENT.green : ACCENT.orange}
          value={passRate}
          suffix="%"
          label="Pass Rate"
          sub={attemptsLoading ? '' : `${attempts.length} attempt${attempts.length !== 1 ? 's' : ''}`}
          loading={attemptsLoading}
          delay={4}
          to="/admin/assessment?tab=attempts"
        />
        <KpiCard
          icon={icons.library}
          accent={ACCENT.blue}
          value={library.length}
          label="Resources"
          loading={libraryLoading}
          delay={4}
          to="/admin/library"
        />
      </div>

      {/* ── Quick Actions ── */}
      <p style={s.sectionLabel}>Quick Actions</p>
      <div style={s.actionsGrid}>
        {ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} style={s.actionCard} className="glass-card glass-hover">
            <div style={{ ...s.kpiIconWrap, background: a.accent.bg, color: a.accent.color }}>
              <Icon icon={a.icon} size={20} />
            </div>
            <p style={s.actionTitle}>{a.title}</p>
            <p style={s.actionDesc}>{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* ── Two-Column: Activity + Course Health ── */}
      <div style={s.twoCol}>
        {/* Recent Activity */}
        <div style={s.panel}>
          <h3 style={s.sectionTitle}>Recent Activity</h3>
          {feedLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} style={{ height: 16, borderRadius: 4 }} />
              ))}
            </div>
          ) : activityFeed.length === 0 ? (
            <p style={s.empty}>No recent activity yet.</p>
          ) : (
            <div style={s.feedList}>
              {activityFeed.map((item, i) => (
                <FeedItem key={`${item.type}-${item.date}-${i}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Course Health */}
        <div style={s.panel}>
          <h3 style={s.sectionTitle}>Course Health</h3>
          {coursesLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Skeleton style={{ height: 10, borderRadius: 5, marginBottom: 8 }} />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} style={{ height: 16, borderRadius: 4 }} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p style={s.empty}>No courses yet. <Link to="/admin/learning" style={{ color: 'var(--slogbaa-blue)' }}>Create one</Link></p>
          ) : (
            <>
              {/* Published vs Draft PieChart */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '100%', maxWidth: 180, height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseHealthPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={renderPieLabel}
                        stroke="none"
                      >
                        {courseHealthPieData.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx]} />
                        ))}
                      </Pie>
                      <Tooltip content={<GlassTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.green, flexShrink: 0 }} />
                    <span style={{ color: 'var(--slogbaa-text)', fontWeight: 600 }}>{publishedCount}</span>
                    <span style={{ color: 'var(--slogbaa-text-muted)' }}>Published</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.orange, flexShrink: 0 }} />
                    <span style={{ color: 'var(--slogbaa-text)', fontWeight: 600 }}>{draftCount}</span>
                    <span style={{ color: 'var(--slogbaa-text-muted)' }}>Draft</span>
                  </div>
                </div>
              </div>

              {/* Top courses */}
              {topCourses.map((c) => (
                <div key={c.id} style={s.courseRow}>
                  <Link to={`/admin/learning/${c.id}`} style={s.courseTitle}>
                    {c.title}
                  </Link>
                  <span style={s.courseMeta}>
                    <span>{c.moduleCount || 0} module{(c.moduleCount || 0) !== 1 ? 's' : ''}</span>
                    <Badge variant={c.published ? 'success' : 'warm'}>
                      {c.published ? 'Published' : 'Draft'}
                    </Badge>
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── Platform Insights ── */}
      <p style={s.sectionLabel}>Platform Insights</p>
      <div style={s.insightsGrid}>
        <div
          style={{ ...s.insightTile, cursor: 'pointer' }}
          className="kpi-clickable"
          role="link"
          tabIndex={0}
          aria-label="View quiz score details"
          onClick={() => navigate('/admin/assessment')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/admin/assessment') } }}
        >
          <p style={s.insightValue}>
            {attemptsLoading ? '—' : <AnimatedCounter value={avgScore} suffix="%" duration={900} />}
          </p>
          <p style={s.insightLabel}>Avg Quiz Score</p>
        </div>
        <div
          style={{ ...s.insightTile, cursor: 'pointer' }}
          className="kpi-clickable"
          role="link"
          tabIndex={0}
          aria-label="View quiz attempts"
          onClick={() => navigate('/admin/assessment')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/admin/assessment') } }}
        >
          <p style={s.insightValue}>
            {attemptsLoading ? '—' : <AnimatedCounter value={attempts.length} duration={900} />}
          </p>
          <p style={s.insightLabel}>Total Attempts</p>
        </div>
        <div style={s.insightTile}>
          <p style={s.insightValue}>{overviewLoading ? '—' : topDistrict}</p>
          <p style={s.insightLabel}>Top District</p>
        </div>
        <div style={s.insightTile}>
          <p style={s.insightValue}>
            {certsLoading ? '—' : <AnimatedCounter value={revokedRate} suffix="%" duration={900} />}
          </p>
          <p style={s.insightLabel}>Revocation Rate</p>
        </div>
      </div>

      {/* ── Charts: Score Distribution + 7-Day Activity ── */}
      <div style={s.chartsRow}>
        {/* Quiz Score Distribution BarChart */}
        <div style={s.chartPanel}>
          <h4 style={s.chartTitle}>Quiz Score Distribution</h4>
          {attemptsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} style={{ height: 16, borderRadius: 4 }} />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <p style={s.empty}>No quiz attempts yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoreDistribution} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--slogbaa-border)" vertical={false} />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 11, fill: 'var(--slogbaa-text-muted)' }}
                  axisLine={{ stroke: 'var(--slogbaa-border)' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: 'var(--slogbaa-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} />
                <Bar dataKey="Attempts" fill={COLORS.blue} radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 7-Day Activity AreaChart */}
        <div style={s.chartPanel}>
          <h4 style={s.chartTitle}>Activity (Last 7 Days)</h4>
          {feedLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} style={{ height: 16, borderRadius: 4 }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={activityByDay} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS.green} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--slogbaa-border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--slogbaa-text-muted)' }}
                  axisLine={{ stroke: 'var(--slogbaa-border)' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: 'var(--slogbaa-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<GlassTooltip />} />
                <Area
                  type="monotone"
                  dataKey="activity"
                  name="Activity"
                  stroke={COLORS.green}
                  strokeWidth={2}
                  fill="url(#activityGradient)"
                  dot={{ r: 3, fill: COLORS.green, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: COLORS.green, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Quick Navigation ── */}
      <p style={s.sectionLabel}>Navigate</p>
      <div style={s.navPills}>
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to} style={s.navPill} className="glass-hover">
            <Icon icon={link.icon} size={14} />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
