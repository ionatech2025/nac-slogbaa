import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { register as registerApi, login as loginApi } from '../../../api/iam/auth.js'
import { PHONE_COUNTRY_CODES } from '../../../shared/countryCodes.js'
import { LoadingButton } from '../../../shared/components/LoadingButton.jsx'

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
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const required = ['firstName', 'lastName', 'email', 'password', 'gender', 'districtName', 'traineeCategory']
    const missing = required.filter((k) => !String(form[k]).trim())
    if (missing.length) {
      setError('Please fill in all required fields (name, email, password, gender, district, category).')
      return
    }
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const result = await registerApi(form)
      if (result.error) {
        setError(result.error)
        return
      }
      const loginResult = await loginApi(form.email.trim(), form.password)
      if (loginResult.error) {
        setError('Account created but sign-in failed. Please sign in manually.')
        return
      }
      const { token, userId, email: userEmail, role, fullName } = loginResult.data
      setAuth(token, { userId, email: userEmail, role, fullName })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message ?? 'Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
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
