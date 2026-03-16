import { useState, useCallback } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { TraineeNav } from '../components/trainee/TraineeNav.jsx'
import { ProfileViewModal } from '../components/trainee/ProfileViewModal.jsx'
import { EditProfileModal } from '../components/trainee/EditProfileModal.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useTraineeProfile, useTraineeSettings, useUpdateTraineeProfile, useUpdateTraineeSettings } from '../../../lib/hooks/use-trainee.js'
import { useEnrolledCourses } from '../../../lib/hooks/use-courses.js'

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  marginBottom: '1rem',
  padding: '0.5rem 0',
  fontSize: '0.9375rem',
  color: 'var(--slogbaa-blue)',
  textDecoration: 'none',
}

export function TraineeLayout() {
  const { token } = useAuth()
  const location = useLocation()
  const isDashboardIndex = location.pathname === '/dashboard' || location.pathname === '/dashboard/'
  const isCourseDetail = /^\/dashboard\/courses\/[^/]+/.test(location.pathname)

  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileSaveError, setProfileSaveError] = useState(null)

  // TanStack Query — shared cache, no duplicated fetches
  const { data: profileData, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useTraineeProfile()
  const { data: traineeSettings } = useTraineeSettings()
  const { data: enrolledCourses = [] } = useEnrolledCourses()
  const updateProfile = useUpdateTraineeProfile()
  const updateSettings = useUpdateTraineeSettings()

  const handleOpenProfile = useCallback(() => {
    setProfileModalOpen(true)
    refetchProfile()
  }, [refetchProfile])

  const handleCloseProfile = useCallback(() => {
    setProfileModalOpen(false)
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
      try {
        const { certificateEmailOptIn, ...profilePayload } = payload
        await Promise.all([
          updateProfile.mutateAsync(profilePayload),
          updateSettings.mutateAsync({ certificateEmailOptIn: !!certificateEmailOptIn }),
        ])
        setEditProfileOpen(false)
      } catch (err) {
        setProfileSaveError(err?.message ?? 'Failed to update profile.')
      }
    },
    [token, updateProfile, updateSettings]
  )

  const profileSaving = updateProfile.isPending || updateSettings.isPending

  const layoutWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--slogbaa-bg)',
  }
  const contentAreaStyle = {
    flex: 1,
    minHeight: 0,
    overflow: isCourseDetail ? 'hidden' : 'auto',
    display: isCourseDetail ? 'flex' : 'block',
    flexDirection: 'column',
  }

  return (
    <div style={layoutWrapperStyle}>
      <TraineeNav onOpenProfile={handleOpenProfile} />
      {profileModalOpen && profileData && (
        <ProfileViewModal
          profile={profileData}
          enrolledCourses={enrolledCourses}
          onClose={handleCloseProfile}
          onEdit={handleEditProfile}
        />
      )}
      {editProfileOpen && profileData && (
        <EditProfileModal
          profile={profileData}
          certificateEmailOptIn={traineeSettings?.certificateEmailOptIn ?? false}
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
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'var(--slogbaa-glass-bg)',
              backdropFilter: 'var(--slogbaa-glass-blur)',
              WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
              padding: '1.5rem',
              borderRadius: 20,
              maxWidth: 400,
              border: '1px solid var(--slogbaa-glass-border)',
              boxShadow: 'var(--slogbaa-glass-shadow-lg)',
            }}
          >
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slogbaa-text)' }}>
              Couldn't load profile
            </p>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-error)' }}>{profileError.message || 'Failed to load profile.'}</p>
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
      <div style={contentAreaStyle}>
        {!isDashboardIndex && !isCourseDetail && (
          <div style={{ padding: '0 1.5rem 0 2rem', maxWidth: 1200, margin: '0 auto', flexShrink: 0 }}>
            <Link to="/dashboard" style={backLinkStyle}>
              ← Back to dashboard
            </Link>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  )
}
