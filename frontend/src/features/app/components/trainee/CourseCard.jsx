import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'
import { getAssetUrl } from '../../../../api/client.js'
import defaultCourseImg from '../../../../assets/images/courses/course1.jpg'

const DEFAULT_IMG = defaultCourseImg

function ProgressRing({ percent = 0, size = 44, strokeWidth = 3.5 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference
  const isComplete = percent >= 100
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--slogbaa-border)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={isComplete ? 'var(--slogbaa-green)' : 'var(--slogbaa-blue)'}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        style={{ fontSize: size * 0.26, fontWeight: 700, fill: 'var(--slogbaa-text)' }}>
        {Math.round(percent)}%
      </text>
    </svg>
  )
}

const styles = {
  card: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid var(--slogbaa-border)',
    transition: 'box-shadow 0.2s',
  },
  cardHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 'auto',
  },
  imageWrap: {
    height: 160,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
  },
  imageWrapHorizontal: {
    width: 'clamp(200px, 30%, 280px)',
    minWidth: 200,
    flexShrink: 0,
    flexGrow: 1,
    height: 'auto',
    minHeight: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageHorizontal: {
    minHeight: 200,
    height: '100%',
  },
  imageBadgeWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  imageBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'rgba(0,0,0,0.65)',
    color: '#fff',
  },
  imageBadgeLight: {
    background: 'rgba(255,255,255,0.9)',
    color: 'var(--slogbaa-text)',
  },
  body: {
    padding: '1rem 1.25rem',
  },
  bodyHorizontal: {
    flex: 1,
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  titleHorizontal: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  description: {
    margin: '0 0 0.75rem',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.45,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  descriptionHorizontal: {
    WebkitLineClamp: 3,
    marginBottom: '0.75rem',
    flex: '1 1 auto',
  },
  meta: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    marginBottom: '0.75rem',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    marginBottom: '1rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'var(--slogbaa-green)',
    color: '#fff',
    marginBottom: '0.75rem',
  },
  badgeHorizontal: {
    marginBottom: 0,
    marginTop: 'auto',
    alignSelf: 'flex-start',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
  },
  buttonSecondary: {
    background: 'transparent',
    color: 'var(--slogbaa-blue)',
    border: '1px solid var(--slogbaa-blue)',
  },
  buttonRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    width: '100%',
  },
  buttonHorizontal: {
    width: 'auto',
    alignSelf: 'flex-start',
    marginTop: 'auto',
    padding: '0.5rem 1.25rem',
  },
  badgeIcon: {
    marginRight: '0.35rem',
  },
  progressWrap: {
    marginBottom: '0.75rem',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.35rem',
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    background: 'var(--slogbaa-blue)',
    transition: 'width 0.2s ease',
  },
}

export function CourseCard({ course, enrolled, completionPercentage, onEnroll, onPreview, variant = 'vertical', viewHref, enrolling }) {
  const imgSrc = getAssetUrl(course.imageUrl) || DEFAULT_IMG
  const isHorizontal = variant === 'horizontal'

  const imageBadges = []
  if (enrolled) imageBadges.push({ label: 'ENROLLED', light: false })
  if (course.badges?.length) {
    course.badges.forEach((b) => imageBadges.push({ label: b, light: true }))
  }

  const cardStyle = { ...styles.card, ...(isHorizontal ? styles.cardHorizontal : {}) }
  const imageWrapStyle = {
    ...styles.imageWrap,
    ...(isHorizontal ? styles.imageWrapHorizontal : {}),
  }
  const imageStyle = { ...styles.image, ...(isHorizontal ? styles.imageHorizontal : {}) }
  const bodyStyle = { ...styles.body, ...(isHorizontal ? styles.bodyHorizontal : {}) }
  const titleStyle = {
    ...styles.title,
    ...(isHorizontal ? styles.titleHorizontal : {}),
    ...(viewHref ? { color: 'var(--slogbaa-blue)' } : {}),
  }
  const descriptionStyle = {
    ...styles.description,
    ...(isHorizontal ? styles.descriptionHorizontal : {}),
  }
  const showMetaRow = isHorizontal && (course.modules || course.duration || course.audience || course.language || course.level)
  const metaItems = showMetaRow && [
    course.modules && `${course.modules} modules`,
    course.duration,
    course.audience,
    course.language,
    course.level,
  ].filter(Boolean)

  return (
    <article style={cardStyle}>
      <div style={imageWrapStyle}>
        <img
          src={imgSrc}
          alt={`Course: ${course.title}`}
          style={imageStyle}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = DEFAULT_IMG
          }}
        />
        {isHorizontal && imageBadges.length > 0 && (
          <div style={styles.imageBadgeWrap}>
            {imageBadges.map((b) => (
              <span
                key={b.label}
                style={{ ...styles.imageBadge, ...(b.light ? styles.imageBadgeLight : {}) }}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={bodyStyle}>
        <h3 style={titleStyle}>
          {viewHref ? (
            <Link to={viewHref} style={{ color: 'inherit', textDecoration: 'inherit' }}>
              {course.title}
            </Link>
          ) : (
            course.title
          )}
        </h3>
        <p style={descriptionStyle}>{course.description}</p>
        {showMetaRow && metaItems?.length > 0 ? (
          <div style={styles.metaRow}>{metaItems.join(' · ')}</div>
        ) : (
          course.meta && <p style={styles.meta}>{course.meta}</p>
        )}
        {enrolled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', ...(isHorizontal ? { marginTop: 'auto' } : {}) }}>
            <ProgressRing percent={completionPercentage ?? 0} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.progressLabel}>
                <span>{(completionPercentage ?? 0) >= 100 ? 'Completed' : 'In progress'}</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${Math.min(100, Math.max(0, completionPercentage ?? 0))}%` }} />
              </div>
            </div>
          </div>
        )}
        {!enrolled && (onEnroll || onPreview) && (
          <div style={{ ...styles.buttonRow, ...(isHorizontal ? { marginTop: 'auto' } : {}) }}>
            {onPreview && (
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...(isHorizontal ? styles.buttonHorizontal : { flex: 1 }),
                }}
                onClick={() => onPreview(course)}
              >
                <FontAwesomeIcon icon={icons.eye} />
                Preview
              </button>
            )}
            {onEnroll && (
              <button
                type="button"
                disabled={enrolling}
                style={{
                  ...styles.button,
                  ...(isHorizontal ? styles.buttonHorizontal : { flex: 1 }),
                  ...(enrolling ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
                }}
                onClick={() => onEnroll(course)}
              >
                <FontAwesomeIcon icon={icons.enroll} />
                {enrolling ? 'Enrolling…' : 'ENROLL NOW →'}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
