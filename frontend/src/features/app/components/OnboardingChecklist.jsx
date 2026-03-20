import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon, icons } from '../../../shared/icons.jsx'

const STORAGE_KEY = 'slogbaa-onboarding-dismissed'

const styles = {
  card: {
    padding: '1.25rem 1.5rem',
    borderRadius: 16,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    marginBottom: '1.5rem',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  closeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    minHeight: 32,
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s ease',
  },
  progressBarWrap: {
    height: 6,
    borderRadius: 3,
    background: 'var(--slogbaa-border)',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    background: 'linear-gradient(90deg, var(--slogbaa-blue), var(--slogbaa-green))',
    transition: 'width 0.4s ease',
  },
  progressLabel: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    marginBottom: '0.75rem',
  },
  stepList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem 0.75rem',
    borderRadius: 10,
    border: '1px solid var(--slogbaa-glass-border)',
    background: 'var(--slogbaa-glass-bg-subtle)',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },
  stepCompleted: {
    borderColor: 'rgba(5, 150, 105, 0.25)',
    background: 'rgba(5, 150, 105, 0.04)',
  },
  checkbox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'background 0.2s ease, border-color 0.2s ease',
  },
  checkboxUnchecked: {
    border: '2px solid var(--slogbaa-border)',
    background: 'transparent',
  },
  checkboxChecked: {
    border: '2px solid var(--slogbaa-green)',
    background: 'var(--slogbaa-green)',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
    minWidth: 0,
  },
  stepTextCompleted: {
    textDecoration: 'line-through',
    color: 'var(--slogbaa-text-muted)',
  },
  ctaLink: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  ctaButton: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-blue)',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  allDone: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderRadius: 12,
    background: 'rgba(5, 150, 105, 0.08)',
    border: '1px solid rgba(5, 150, 105, 0.25)',
  },
  allDoneText: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-green)',
  },
  allDoneSub: {
    margin: '0.15rem 0 0',
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: 'var(--slogbaa-text-muted)',
  },
}

function isProfileComplete(profile) {
  if (!profile) return false
  const hasPhone = !!(profile.phoneCountryCode && profile.phoneNationalNumber)
  const hasDistrict = !!profile.districtName?.trim()
  return hasPhone && hasDistrict
}

export function OnboardingChecklist({ profile, enrolledCourses = [], onEditProfile }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const steps = useMemo(() => {
    const profileDone = isProfileComplete(profile)
    const hasEnrolled = enrolledCourses.length > 0
    const hasStartedModule = enrolledCourses.some((c) => (c.completionPercentage ?? 0) > 0)
    const hasPassedQuiz = enrolledCourses.some((c) => {
      const pct = c.completionPercentage ?? 0
      const modules = c.moduleCount ?? 1
      return pct >= (100 / modules)
    })

    return [
      {
        id: 'profile',
        label: 'Complete your profile',
        done: profileDone,
        ctaType: 'button',
        ctaLabel: 'Edit profile',
        onCtaClick: onEditProfile,
      },
      {
        id: 'enroll',
        label: 'Enroll in your first course',
        done: hasEnrolled,
        ctaType: 'link',
        ctaLabel: 'Browse courses',
        ctaTo: '/dashboard/courses',
      },
      {
        id: 'module',
        label: 'Complete your first module',
        done: hasStartedModule,
        ctaType: 'link',
        ctaLabel: 'Continue learning',
        ctaTo: '/dashboard/courses',
      },
      {
        id: 'quiz',
        label: 'Pass your first quiz',
        done: hasPassedQuiz,
        ctaType: 'link',
        ctaLabel: 'Go to courses',
        ctaTo: '/dashboard/courses',
      },
    ]
  }, [profile, enrolledCourses, onEditProfile])

  const completedCount = steps.filter((s) => s.done).length
  const allDone = completedCount === steps.length

  if (dismissed) return null
  if (allDone && dismissed) return null

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // localStorage may be unavailable
    }
    setDismissed(true)
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Icon icon={icons.target} size="1.125em" />
          Getting Started
        </h2>
        <button
          type="button"
          style={styles.closeBtn}
          onClick={handleDismiss}
          aria-label="Dismiss onboarding checklist"
          title="Dismiss"
        >
          <Icon icon={icons.close} size="1em" />
        </button>
      </div>

      <div style={styles.progressLabel}>{completedCount} of {steps.length} completed</div>
      <div style={styles.progressBarWrap}>
        <div
          style={{
            ...styles.progressBarFill,
            width: `${(completedCount / steps.length) * 100}%`,
          }}
        />
      </div>

      {allDone ? (
        <div style={styles.allDone}>
          <Icon icon={icons.partyPopper} size="1.5em" style={{ color: 'var(--slogbaa-green)', flexShrink: 0 }} />
          <div>
            <p style={styles.allDoneText}>All set!</p>
            <p style={styles.allDoneSub}>You have completed all onboarding steps. Happy learning!</p>
          </div>
        </div>
      ) : (
        <ul style={styles.stepList}>
          {steps.map((step) => (
            <li
              key={step.id}
              style={{
                ...styles.step,
                ...(step.done ? styles.stepCompleted : {}),
              }}
            >
              <span
                style={{
                  ...styles.checkbox,
                  ...(step.done ? styles.checkboxChecked : styles.checkboxUnchecked),
                }}
                aria-hidden="true"
              >
                {step.done && <Icon icon={icons.enrolled} size="0.75em" />}
              </span>
              <span
                style={{
                  ...styles.stepText,
                  ...(step.done ? styles.stepTextCompleted : {}),
                }}
              >
                {step.label}
              </span>
              {!step.done && step.ctaType === 'link' && (
                <Link to={step.ctaTo} style={styles.ctaLink}>
                  {step.ctaLabel} <Icon icon={icons.arrowRight} size="0.75em" style={{ verticalAlign: 'middle' }} />
                </Link>
              )}
              {!step.done && step.ctaType === 'button' && (
                <button type="button" style={styles.ctaButton} onClick={step.onCtaClick}>
                  {step.ctaLabel} <Icon icon={icons.arrowRight} size="0.75em" style={{ verticalAlign: 'middle' }} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
