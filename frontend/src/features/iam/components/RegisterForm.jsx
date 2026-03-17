import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { register as registerApi, resendVerification } from '../../../api/iam/auth.js'
import { PHONE_COUNTRY_CODES } from '../../../shared/countryCodes.js'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'
import { registerSchema } from '../validation/schemas.js'

const TRAINEE_CATEGORIES = [
  { value: '', label: 'Select category' },
  { value: 'LEADER', label: 'Leader' },
  { value: 'CIVIL_SOCIETY_MEMBER', label: 'Civil Society Member' },
  { value: 'COMMUNITY_MEMBER', label: 'Community Member' },
]

const GENDERS = [
  { value: '', label: 'Select gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
]

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
    letterSpacing: '0.01em',
  },
  input: {
    width: '100%',
    minWidth: 0,
    padding: '0.625rem 0.875rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-bg)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  },
  iconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
  },
  leadingIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--slogbaa-text-muted)',
    pointerEvents: 'none',
    fontSize: '0.9375rem',
    zIndex: 1,
  },
  passwordWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
  },
  passwordInput: {
    flex: 1,
    paddingRight: '2.5rem',
  },
  toggleVisibility: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.75rem',
    border: 'none',
    background: 'none',
    color: 'var(--slogbaa-text-muted)',
    cursor: 'pointer',
  },
  select: {
    width: '100%',
    minWidth: 0,
    padding: '0.625rem 0.875rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 10,
    fontSize: '0.9375rem',
    background: 'var(--slogbaa-bg)',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  submit: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    marginTop: '0.5rem',
    padding: '0.7rem 1.25rem',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s, box-shadow 0.15s',
  },
  error: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error)',
  },
  successBox: {
    padding: '1.25rem',
    background: 'rgba(5, 150, 105, 0.1)',
    borderRadius: 10,
    textAlign: 'center',
  },
  successText: {
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-success, #059669)',
    margin: '0 0 0.75rem',
    fontWeight: 500,
  },
  successDetail: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-text-muted)',
    margin: '0 0 1rem',
  },
  resendLink: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-blue)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  resendMessage: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-success, #059669)',
    marginTop: '0.5rem',
  },
  loginLink: {
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--slogbaa-blue)',
    textDecoration: 'none',
  },
}

export function RegisterForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    districtName: '',
    region: '',
    traineeCategory: '',
    phoneCountryCode: '',
    phoneNationalNumber: '',
    street: '',
    city: '',
    postalCode: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [resendMsg, setResendMsg] = useState(null)
  const [resendLoading, setResendLoading] = useState(false)

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleResend = async () => {
    setResendMsg(null)
    setResendLoading(true)
    try {
      const result = await resendVerification(form.email.trim())
      setResendMsg(result.error ?? result.data?.message ?? 'Verification email sent.')
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const parsed = registerSchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setLoading(true)
    try {
      const result = await registerApi(form)
      if (result.error) {
        setError(result.error)
        return
      }
      setRegistered(true)
    } catch (err) {
      setError(err?.message ?? 'Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div style={styles.successBox}>
        <p style={styles.successText}>
          <FontAwesomeIcon icon={icons.enrolled} style={{ marginRight: '0.5rem' }} />
          Account created!
        </p>
        <p style={styles.successDetail}>
          Check your email for a verification link. You must verify your email before signing in.
        </p>
        <button
          type="button"
          style={styles.resendLink}
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? 'Sending...' : 'Resend verification email'}
        </button>
        {resendMsg && <p style={styles.resendMessage}>{resendMsg}</p>}
        <Link to="/auth/login" style={styles.loginLink}>
          Go to Sign in
        </Link>
      </div>
    )
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-firstName">First name *</label>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={icons.viewProfile} style={styles.leadingIcon} />
            <input
              id="reg-firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              style={{ ...styles.input, paddingLeft: '2.5rem' }}
              placeholder="Jane"
            />
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-lastName">Last name *</label>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={icons.viewProfile} style={styles.leadingIcon} />
            <input
              id="reg-lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              style={{ ...styles.input, paddingLeft: '2.5rem' }}
              placeholder="Akello"
            />
          </div>
        </div>
      </div>
      <div style={styles.field}>
        <label style={styles.label} htmlFor="reg-email">Email *</label>
        <div style={styles.iconWrap}>
          <FontAwesomeIcon icon={icons.envelope} style={styles.leadingIcon} />
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            style={{ ...styles.input, paddingLeft: '2.5rem' }}
            placeholder="jane.akello@example.com"
          />
        </div>
      </div>
      <div style={styles.field}>
        <label style={styles.label} htmlFor="reg-password">Password *</label>
        <div style={styles.passwordWrap}>
          <FontAwesomeIcon icon={icons.lock} style={styles.leadingIcon} />
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            style={{ ...styles.input, ...styles.passwordInput, paddingLeft: '2.5rem' }}
            placeholder="At least 6 characters"
          />
          <button
            type="button"
            style={styles.toggleVisibility}
            onClick={() => setShowPassword((v) => !v)}
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <FontAwesomeIcon icon={showPassword ? icons.eyeSlash : icons.eye} />
          </button>
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-phone-country">Phone (optional)</label>
          <select
            id="reg-phone-country"
            value={form.phoneCountryCode}
            onChange={(e) => update('phoneCountryCode', e.target.value)}
            style={styles.select}
          >
            {PHONE_COUNTRY_CODES.map((o) => (
              <option key={o.value || 'none'} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-phone-number">Phone number</label>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={icons.phone} style={styles.leadingIcon} />
            <input
              id="reg-phone-number"
              type="tel"
              autoComplete="tel-national"
              value={form.phoneNationalNumber}
              onChange={(e) => update('phoneNationalNumber', e.target.value.replace(/\D/g, '').slice(0, 15))}
              style={{ ...styles.input, paddingLeft: '2.5rem' }}
              placeholder="e.g. 712345678"
            />
          </div>
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-gender">Gender *</label>
          <select
            id="reg-gender"
            value={form.gender}
            onChange={(e) => update('gender', e.target.value)}
            style={styles.select}
          >
            {GENDERS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-category">Trainee category *</label>
          <select
            id="reg-category"
            value={form.traineeCategory}
            onChange={(e) => update('traineeCategory', e.target.value)}
            style={styles.select}
          >
            {TRAINEE_CATEGORIES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-district">District *</label>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={icons.mapPin} style={styles.leadingIcon} />
            <input
              id="reg-district"
              type="text"
              autoComplete="address-level2"
              value={form.districtName}
              onChange={(e) => update('districtName', e.target.value)}
              style={{ ...styles.input, paddingLeft: '2.5rem' }}
              placeholder="e.g. Kampala"
            />
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-region">Region</label>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={icons.globe} style={styles.leadingIcon} />
            <input
              id="reg-region"
              type="text"
              value={form.region}
              onChange={(e) => update('region', e.target.value)}
              style={{ ...styles.input, paddingLeft: '2.5rem' }}
              placeholder="e.g. Central"
            />
          </div>
        </div>
      </div>
      <div style={{ ...styles.field, ...styles.fullWidth }}>
        <label style={styles.label} htmlFor="reg-street">Street address</label>
        <div style={styles.iconWrap}>
          <FontAwesomeIcon icon={icons.building} style={styles.leadingIcon} />
          <input
            id="reg-street"
            type="text"
            autoComplete="street-address"
            value={form.street}
            onChange={(e) => update('street', e.target.value)}
            style={{ ...styles.input, paddingLeft: '2.5rem' }}
            placeholder="Plot 10 Main St"
          />
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-city">City</label>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={icons.mapPin} style={styles.leadingIcon} />
            <input
              id="reg-city"
              type="text"
              autoComplete="address-level1"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              style={{ ...styles.input, paddingLeft: '2.5rem' }}
              placeholder="Kampala"
            />
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="reg-postal">Postal code</label>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={icons.hash} style={styles.leadingIcon} />
            <input
              id="reg-postal"
              type="text"
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
              style={{ ...styles.input, paddingLeft: '2.5rem' }}
              placeholder="256"
            />
          </div>
        </div>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <LoadingButton type="submit" loading={loading} style={styles.submit}>
        <FontAwesomeIcon icon={icons.register} />
        Create account
      </LoadingButton>
    </form>
  )
}
