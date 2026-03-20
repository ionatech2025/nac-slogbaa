import { useState, useEffect, useRef } from 'react'
import { Modal } from '../../../../shared/components/Modal.jsx'
import { LoadingButton } from '../../../../shared/components/LoadingButton.jsx'
import { PHONE_COUNTRY_CODES } from '../../../../shared/countryCodes.js'
import { getAssetUrl } from '../../../../api/client.js'
import { useUploadAvatar } from '../../../../lib/hooks/use-trainee.js'

const CATEGORY_OPTIONS = [
  { value: 'LEADER', label: 'Leader' },
  { value: 'CIVIL_SOCIETY_MEMBER', label: 'Civil Society Member' },
  { value: 'COMMUNITY_MEMBER', label: 'Community Member' },
]

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
]

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

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
    background: 'var(--slogbaa-blue)',
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
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    background: 'var(--slogbaa-border)',
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  avatarControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  changePhotoBtn: {
    padding: '0.4rem 1rem',
    background: 'var(--slogbaa-surface)',
    color: 'var(--slogbaa-blue)',
    border: '1px solid var(--slogbaa-blue)',
    borderRadius: 6,
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  avatarHint: {
    margin: 0,
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-muted)',
  },
  avatarUploading: {
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-muted)',
    fontStyle: 'italic',
  },
}

function getInitials(profile) {
  if (profile?.firstName && profile?.lastName) {
    return (profile.firstName[0] + profile.lastName[0]).toUpperCase()
  }
  if (profile?.firstName) return profile.firstName.slice(0, 2).toUpperCase()
  if (profile?.email) return profile.email.slice(0, 2).toUpperCase()
  return '?'
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
    phoneCountryCode: profile.phoneCountryCode ?? '',
    phoneNationalNumber: profile.phoneNationalNumber ?? '',
    street: profile.street ?? '',
    city: profile.city ?? '',
    postalCode: profile.postalCode ?? '',
  }
}

export function EditProfileModal({ profile, certificateEmailOptIn = false, onClose, onSave, saving = false, error: externalError }) {
  const [form, setForm] = useState({ ...toForm(profile), certificateEmailOptIn })
  const [error, setError] = useState(externalError ?? null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState(null)
  const fileInputRef = useRef(null)
  const uploadAvatar = useUploadAvatar()

  useEffect(() => {
    setForm((prev) => ({ ...toForm(profile), certificateEmailOptIn: certificateEmailOptIn ?? prev.certificateEmailOptIn }))
  }, [profile, certificateEmailOptIn])

  useEffect(() => {
    setError(externalError ?? null)
  }, [externalError])

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const currentAvatarUrl = avatarPreview
    ? avatarPreview
    : profile?.profileImageUrl
      ? getAssetUrl(profile.profileImageUrl)
      : null

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError('Please select a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setAvatarError('Image must be under 2 MB.')
      return
    }

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    // Upload
    uploadAvatar.mutate(file, {
      onError: (err) => {
        setAvatarError(err.message || 'Upload failed.')
        setAvatarPreview(null)
        URL.revokeObjectURL(previewUrl)
      },
      onSuccess: () => {
        // Preview stays; the profile query is invalidated by the hook
        URL.revokeObjectURL(previewUrl)
      },
    })

    // Reset file input so the same file can be re-selected
    e.target.value = ''
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
      phoneCountryCode: form.phoneCountryCode?.trim() || undefined,
      phoneNationalNumber: form.phoneNationalNumber?.trim() || undefined,
      street: form.street?.trim() ?? '',
      city: form.city?.trim() ?? '',
      postalCode: form.postalCode?.trim() ?? '',
      certificateEmailOptIn: !!form.certificateEmailOptIn,
    })
  }

  const displayError = error ?? externalError

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Avatar upload section */}
        <div style={styles.avatarSection}>
          {currentAvatarUrl ? (
            // codeql[js/xss]
            <img
              src={typeof currentAvatarUrl === 'string' && (currentAvatarUrl.startsWith('blob:') || currentAvatarUrl.startsWith('/') || currentAvatarUrl.startsWith('http://') || currentAvatarUrl.startsWith('https://')) ? currentAvatarUrl : ''}
              alt={`Avatar: ${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`}
              style={styles.avatarImage}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>{getInitials(profile)}</div>
          )}
          <div style={styles.avatarControls}>
            {uploadAvatar.isPending ? (
              <span style={styles.avatarUploading}>Uploading...</span>
            ) : (
              <button
                type="button"
                style={styles.changePhotoBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </button>
            )}
            <p style={styles.avatarHint}>JPEG, PNG, or WebP. Max 2 MB.</p>
            {avatarError && <p style={styles.error}>{avatarError}</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>

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

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-phone-country">Phone (optional)</label>
            <select
              id="edit-phone-country"
              style={styles.select}
              value={form.phoneCountryCode}
              onChange={(e) => update('phoneCountryCode', e.target.value)}
            >
              {PHONE_COUNTRY_CODES.map((o) => (
                <option key={o.value || 'none'} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="edit-phone-number">Phone number</label>
            <input
              id="edit-phone-number"
              type="tel"
              autoComplete="tel-national"
              style={styles.input}
              value={form.phoneNationalNumber}
              onChange={(e) => update('phoneNationalNumber', e.target.value.replace(/\D/g, '').slice(0, 15))}
              placeholder="e.g. 712345678"
            />
          </div>
        </div>

        <div style={{ ...styles.field, ...styles.fullWidth }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!form.certificateEmailOptIn}
              onChange={(e) => update('certificateEmailOptIn', e.target.checked)}
            />
            <span style={styles.label}>Send me certificates by email when I earn them</span>
          </label>
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
          <LoadingButton type="submit" loading={saving} style={styles.btnPrimary}>
            Save
          </LoadingButton>
        </div>
      </form>
    </Modal>
  )
}
