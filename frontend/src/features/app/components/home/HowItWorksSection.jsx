const STEPS = [
  { num: '01', title: 'Register', text: 'Create your free account with your name, email, and district.' },
  { num: '02', title: 'Learn', text: 'Study rich module content at your own pace — progress saves automatically.' },
  { num: '03', title: 'Certification', text: 'Complete all module assessments for a given course and earn a certificate of completion.' },
]

export function HowItWorksSection({ variant = 'alt' }) {
  return (
    <section className={`slg-home-section slg-section-${variant}`} id="how">
      <div className="slg-container">
        <div style={{ marginBottom: '3rem' }}>
          <span className="slg-eyebrow">How it works</span>
          <h2 className="slg-section-title">
            Three steps to<br /><em>civic leadership</em>
          </h2>
        </div>
        <div className="slg-steps">
          {STEPS.map((step) => (
            <div key={step.num} className="slg-step">
              <div className="slg-step-num">{step.num}</div>
              <h3 className="slg-step-title">{step.title}</h3>
              <p className="slg-step-text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
