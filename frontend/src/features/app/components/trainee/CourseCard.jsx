const styles = {
  card: {
    background: 'var(--slogbaa-surface)',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid var(--slogbaa-border)',
    transition: 'box-shadow 0.2s',
  },
  imageWrap: {
    height: 160,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    padding: '1rem 1.25rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
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
  meta: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    marginBottom: '0.75rem',
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
  button: {
    padding: '0.5rem 1rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
  },
}

export function CourseCard({ course, enrolled, onEnroll }) {
  const imgSrc = course.imageUrl || '/assets/images/courses/placeholder.jpg'

  return (
    <article style={styles.card}>
      <div style={styles.imageWrap}>
        <img
          src={imgSrc}
          alt=""
          style={styles.image}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://placehold.co/400x200/e0e0e0/6b6b6b?text=Course'
          }}
        />
      </div>
      <div style={styles.body}>
        <h3 style={styles.title}>{course.title}</h3>
        <p style={styles.description}>{course.description}</p>
        {course.meta && <p style={styles.meta}>{course.meta}</p>}
        {enrolled && <span style={styles.badge}>ENROLLED</span>}
        {!enrolled && onEnroll && (
          <button type="button" style={styles.button} onClick={() => onEnroll(course)}>
            ENROLL
          </button>
        )}
      </div>
    </article>
  )
}
