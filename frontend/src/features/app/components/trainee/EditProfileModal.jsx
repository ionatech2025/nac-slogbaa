import { useState, useEffect } from 'react'
import { Modal } from '../../../../shared/components/Modal.jsx'

const CATEGORY_OPTIONS = [
  { value: 'LEADER', label: 'Leader' },
  { value: 'CIVIL_SOCIETY_MEMBER', label: 'Civil Society Member' },
  { value: 'COMMUNITY_MEMBER', label: 'Community Member' },
]

const GENDER_OPTIONS = [
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
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--slogbaa-text)',
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 6,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
  },
  select: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 6,
    fontSize: '1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  btnSecondary: {
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnPrimary: {
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: {
    fontSize: '0.875rem',
    color: 'var(--slogbaa-error)',
  },
}

function toForm(profile) {
  if (!profile) return {}
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    gender: profile.gender ?? '',
    districtName: profile.districtName ?? '',
    region: profile.region ?? '',
    category: profile.category ?? '',
    street: profile.street ?? '',
    city: profile.city ?? '',
    postalCode: profile.postalCode ?? '',
  }
}

export function EditProfileModal({ profile, onClose, onSave, saving = false, error: externalError }) {
  const [form, setForm] = useState(toForm(profile))
  const [error, setError] = useState(externalError ?? null)

  useEffect(() => {
    setForm(toForm(profile))
  }, [profile])

  useEffect(() => {
    setError(externalError ?? null)
  }, [externalError])

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    const required = ['firstName', 'lastName', 'gender', 'districtName', 'category']
    const missing = required.filter((k) => !String(form[k]).trim())
    if (missing.length) {
      setError('Please fill in all required fields (name, gender, district, category).')
      return
    }
    onSave({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      districtName: form.districtName.trim(),
      region: form.region?.trim() ?? '',
      category: form.category,
      street: form.street?.trim() ?? '',
      city: form.city?.trim() ?? '',
      postalCode: form.postalCode?.trim() ?? '',
    })
  }

  const displayError = error ?? externalError

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-firstName">First name *</label>
            <input
              id="edit-firstName"
              type="text"
              style={styles.input}
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              required
              autoComplete="given-name"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-lastName">Last name *</label>
            <input
              id="edit-lastName"
              type="text"
              style={styles.input}
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-gender">Gender *</label>
            <select
              id="edit-gender"
              style={styles.select}
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
              required
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-category">Category *</label>
            <select
              id="edit-category"
              style={styles.select}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              required
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-district">District *</label>
            <input
              id="edit-district"
              type="text"
              style={styles.input}
              value={form.districtName}
              onChange={(e) => update('districtName', e.target.value)}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-region">Region</label>
            <input
              id="edit-region"
              type="text"
              style={styles.input}
              value={form.region}
              onChange={(e) => update('region', e.target.value)}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label} htmlFor="edit-street">Street</label>
          <input
            id="edit-street"
            type="text"
            style={styles.input}
            value={form.street}
            onChange={(e) => update('street', e.target.value)}
          />
        </div>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-city">City</label>
            <input
              id="edit-city"
              type="text"
              style={styles.input}
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-postalCode">Postal code</label>
            <input
              id="edit-postalCode"
              type="text"
              style={styles.input}
              value={form.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
            />
          </div>
        </div>

        {displayError && <p style={styles.error}>{displayError}</p>}

        <div style={styles.actions}>
          <button type="button" style={styles.btnSecondary} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" style={styles.btnPrimary} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
