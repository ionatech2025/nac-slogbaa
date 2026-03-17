import { useState } from 'react'
import { Icon, icons } from '../../../shared/icons.jsx'
import { useDocumentTitle } from '../../../shared/hooks/useDocumentTitle.js'

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
    maxWidth: 900,
    margin: '0 auto',
    width: '100%',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    margin: '0 0 0.75rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  accordionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  accordionItem: {
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 14,
    boxShadow: 'var(--slogbaa-glass-shadow)',
    overflow: 'hidden',
  },
  accordionTrigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.875rem 1.25rem',
    minHeight: 44,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
    textAlign: 'left',
    gap: '0.75rem',
  },
  chevron: (open) => ({
    flexShrink: 0,
    transition: 'transform 0.25s ease',
    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
    opacity: 0.6,
  }),
  accordionBody: (open) => ({
    maxHeight: open ? 500 : 0,
    opacity: open ? 1 : 0,
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, opacity 0.25s ease, padding 0.25s ease',
    padding: open ? '0 1.25rem 1rem' : '0 1.25rem 0',
  }),
  answer: {
    margin: 0,
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--slogbaa-text-muted)',
  },
  contactCard: {
    padding: '1.5rem',
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 16,
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  contactTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  contactDescription: {
    margin: '0 0 1rem',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    color: 'var(--slogbaa-text-muted)',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
  },
  contactLink: {
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
    fontWeight: 500,
  },
}

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={styles.accordionItem}>
      <button
        type="button"
        style={styles.accordionTrigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <Icon icon={icons.chevronRight} size={16} style={styles.chevron(open)} />
      </button>
      <div style={styles.accordionBody(open)} aria-hidden={!open}>
        <div style={styles.answer}>{answer}</div>
      </div>
    </div>
  )
}

function AccordionSection({ title, items }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.accordionList}>
        {items.map((item) => (
          <AccordionItem key={item.q} question={item.q} answer={item.a} />
        ))}
      </div>
    </section>
  )
}

const gettingStartedFaq = [
  {
    q: 'How do I enroll in a course?',
    a: (
      <>
        Navigate to <strong>Courses</strong> from the sidebar or dashboard. Browse the available
        courses, click on the one you are interested in, and then click the{' '}
        <strong>Enroll</strong> button on the course detail page. Once enrolled, the course will
        appear on your dashboard and you can begin working through its modules.
      </>
    ),
  },
  {
    q: 'How do I track my progress?',
    a: (
      <>
        Your <strong>Dashboard</strong> shows an overview of your learning activity including
        courses in progress, completion percentages, daily streaks, and XP earned. Each course
        detail page also displays a progress bar showing how many modules you have completed.
      </>
    ),
  },
  {
    q: 'What are badges and XP?',
    a: (
      <>
        <strong>XP (Experience Points)</strong> are earned as you complete modules, quizzes, and
        daily learning goals. <strong>Badges</strong> are achievements you unlock by reaching
        milestones, for example completing your first course or maintaining a learning streak.
        You can view your badges and XP on your dashboard.
      </>
    ),
  },
  {
    q: 'How do I take a quiz?',
    a: (
      <>
        First, read through all the module notes. Once you have completed the reading material,
        the quiz section will unlock at the end of the module. Click <strong>Start Quiz</strong>,
        answer the questions within the time limit (if one is set), and submit your answers.
        Your score and correct answers will be shown after submission.
      </>
    ),
  },
]

const accountFaq = [
  {
    q: 'How do I change my password?',
    a: (
      <>
        Use the <strong>Forgot Password</strong> link on the sign-in page. Enter your email
        address and you will receive a password reset link. Follow the link to set a new
        password. For security, there is no in-app password change; all password changes go
        through the email verification flow.
      </>
    ),
  },
  {
    q: 'How do I update my profile?',
    a: (
      <>
        Click your name or avatar in the top navigation bar, then select{' '}
        <strong>Profile</strong> from the dropdown menu. From there you can edit your full name,
        phone number, and other profile details.
      </>
    ),
  },
  {
    q: 'How do I export my data?',
    a: (
      <>
        Go to <strong>Settings</strong> from the user menu, then open the{' '}
        <strong>Privacy</strong> section. Click <strong>Export My Data</strong> to download a
        copy of your personal data and learning records.
      </>
    ),
  },
  {
    q: 'How do I delete my account?',
    a: (
      <>
        Go to <strong>Settings</strong> from the user menu, then open the{' '}
        <strong>Privacy</strong> section. Click <strong>Delete My Account</strong> and confirm
        the action. Please note that account deletion is permanent and cannot be reversed.
      </>
    ),
  },
]

const learningFaq = [
  {
    q: 'Can I retake a quiz?',
    a: (
      <>
        It depends on the course settings. Some quizzes allow multiple attempts up to a maximum
        number set by the instructor. If retakes are available, you will see a{' '}
        <strong>Retake Quiz</strong> button after viewing your results. Each attempt is recorded
        and your best score is used.
      </>
    ),
  },
  {
    q: 'How do bookmarks work?',
    a: (
      <>
        While reading module content, click the <strong>bookmark icon</strong> on any content
        block to save it for later. You can view all your bookmarks from the dashboard. Clicking
        a bookmark takes you directly back to that content block.
      </>
    ),
  },
  {
    q: 'What if I lose internet connection?',
    a: (
      <>
        The platform uses offline caching so you can continue reading content you have already
        loaded. Any progress or quiz answers you submit while offline will be saved locally and
        automatically synced to the server when your connection is restored.
      </>
    ),
  },
  {
    q: 'How do discussions work?',
    a: (
      <>
        Each module has a <strong>Discussions</strong> section where you can ask questions or
        start a conversation. Other learners and staff can reply to your threads. Staff members
        can mark threads as resolved once the question has been answered.
      </>
    ),
  },
]

export function HelpPage() {
  useDocumentTitle('Help')

  return (
    <div style={styles.layout}>
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Help Center</h1>
          <p style={styles.subtitle}>
            Find answers to common questions about using the learning platform.
          </p>
        </header>

        <AccordionSection title="Getting Started" items={gettingStartedFaq} />
        <AccordionSection title="Account & Settings" items={accountFaq} />
        <AccordionSection title="Learning" items={learningFaq} />

        <section style={styles.section}>
          <div style={styles.contactCard}>
            <h2 style={styles.contactTitle}>Contact Support</h2>
            <p style={styles.contactDescription}>
              For issues not covered in the FAQ, reach out to our support team.
            </p>
            <div style={styles.contactRow}>
              <Icon icon={icons.envelope} size={16} style={{ opacity: 0.7 }} />
              <a href="mailto:support@nac.go.ug" style={styles.contactLink}>
                support@nac.go.ug
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
