import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { TraineeNav } from '../components/trainee/TraineeNav.jsx'
import { ProfileViewModal } from '../components/trainee/ProfileViewModal.jsx'
import { EditProfileModal } from '../components/trainee/EditProfileModal.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getTraineeProfile, updateTraineeProfile } from '../../../api/trainee.js'

export function TraineeLayout() {
  const { token } = useAuth()
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaveError, setProfileSaveError] = useState(null)

  const handleOpenProfile = useCallback(() => {
    setProfileModalOpen(true)
    setProfileError(null)
    setProfileData(null)
    if (!token) return
    setProfileLoading(true)
    getTraineeProfile(token)
      .then((data) => setProfileData(data))
      .catch((err) => setProfileError(err?.message ?? 'Failed to load profile.'))
      .finally(() => setProfileLoading(false))
  }, [token])

  const handleCloseProfile = useCallback(() => {
    setProfileModalOpen(false)
    setProfileData(null)
    setProfileError(null)
  }, [])

  const handleEditProfile = useCallback(() => {
    setProfileSaveError(null)
    setEditProfileOpen(true)
  }, [])

  const handleCloseEditProfile = useCallback(() => {
    setEditProfileOpen(false)
    setProfileSaveError(null)
  }, [])

  const handleSaveProfile = useCallback(
    async (payload) => {
      if (!token) return
      setProfileSaveError(null)
      setProfileSaving(true)
      try {
        await updateTraineeProfile(token, payload)
        setEditProfileOpen(false)
        const updated = await getTraineeProfile(token)
        setProfileData(updated)
      } catch (err) {
        setProfileSaveError(err?.message ?? 'Failed to update profile.')
      } finally {
        setProfileSaving(false)
      }
    },
    [token]
  )

  return (
    <>
      <TraineeNav onOpenProfile={handleOpenProfile} />
      {profileModalOpen && profileData && (
        <ProfileViewModal
          profile={profileData}
          onClose={handleCloseProfile}
          onEdit={handleEditProfile}
        />
      )}
      {editProfileOpen && profileData && (
        <EditProfileModal
          profile={profileData}
          onClose={handleCloseEditProfile}
          onSave={handleSaveProfile}
          saving={profileSaving}
          error={profileSaveError}
        />
      )}
      {profileModalOpen && profileLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            fontSize: '0.9375rem',
            color: 'var(--slogbaa-text)',
          }}
        >
          Loading profile…
        </div>
      )}
      {profileModalOpen && profileError && !profileData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'var(--slogbaa-surface)',
              padding: '1.5rem',
              borderRadius: 12,
              maxWidth: 400,
              border: '1px solid var(--slogbaa-border)',
            }}
          >
            <p
              style={{
                margin: '0 0 0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--slogbaa-text)',
              }}
            >
              Couldn't load profile
            </p>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-error)' }}>{profileError}</p>
            <button
              type="button"
              onClick={handleCloseProfile}
              style={{
                marginTop: '1.25rem',
                padding: '0.5rem 1rem',
                border: '1px solid var(--slogbaa-border)',
                borderRadius: 8,
                background: 'var(--slogbaa-surface)',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Outlet />
    </>
  )
}
