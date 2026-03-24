import { useState, useCallback, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { TraineeNav } from '../components/trainee/TraineeNav.jsx'
import { TraineeSidebar } from '../components/trainee/TraineeSidebar.jsx'
import { TraineeNavigatePills } from '../components/trainee/TraineeNavigatePills.jsx'
import { ProfileViewModal } from '../components/trainee/ProfileViewModal.jsx'
import { EditProfileModal } from '../components/trainee/EditProfileModal.jsx'
import { GlobalSearchPalette, useCommandPaletteShortcut } from '../../../shared/components/GlobalSearchPalette.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useTraineeProfile, useTraineeSettings, useUpdateTraineeProfile, useUpdateTraineeSettings } from '../../../lib/hooks/use-trainee.js'
import { useEnrolledCourses } from '../../../lib/hooks/use-courses.js'
import { useTheme } from '../../../contexts/ThemeContext.jsx'

const darkSidebarShell = {
  width: 260,
  flexShrink: 0,
  height: '100%',
  background: 'rgba(15, 23, 42, 0.85)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.25rem 0',
  boxShadow: '1px 0 12px rgba(0,0,0,0.08)',
  overflowY: 'auto',
  overflowX: 'hidden',
}

const lightSidebarShell = {
  ...darkSidebarShell,
  background: 'var(--slogbaa-glass-bg)',
  backdropFilter: 'var(--slogbaa-glass-blur)',
  WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
  borderRight: '1px solid var(--slogbaa-glass-border)',
  boxShadow: 'var(--slogbaa-glass-shadow)',
}

export function TraineeLayout() {
  const { token, user } = useAuth()
  const { theme } = useTheme()
  const location = useLocation()
  const isDashboardIndex = location.pathname === '/dashboard' || location.pathname === '/dashboard/'
  const isCourseDetail = /^\/dashboard\/courses\/[^/]+/.test(location.pathname)

  const { open: searchOpen, close: closeSearch, toggle: toggleSearch } = useCommandPaletteShortcut()

  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileSaveError, setProfileSaveError] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const outletContext = useMemo(() => ({
    profileData,
    onEditProfile: handleEditProfile,
  }), [profileData, handleEditProfile])

  const displayName = profileData?.fullName || user?.fullName || user?.email || 'Trainee'
  const sidebarShell = theme === 'light' ? lightSidebarShell : darkSidebarShell

  const layoutWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--slogbaa-bg)',
  }

  const bodyRowStyle = {
    flex: 1,
    display: 'flex',
    minHeight: 0,
    overflow: 'hidden',
  }

  const mainStyle = {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: isCourseDetail ? 'hidden' : 'auto',
    background: 'var(--slogbaa-bg)',
    borderLeft: '1px solid var(--slogbaa-border)',
  }

  const identityHeaderStyle = {
    background: 'var(--identity-header-blue, #0072BB)',
    borderBottom: '3px solid var(--primary-orange, #F58220)',
    padding: '1.25rem 2rem',
    flexShrink: 0,
  }

  const greetingStyle = {
    margin: 0,
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#FFFFFF',
  }

  const scrollInnerStyle = {
    // Course player: flex column + minHeight 0 so CourseDetailPage’s nested flex/overflow chain
    // receives a bounded height (article overflowY:auto can scroll to quiz).
    ...(isCourseDetail
      ? {
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          maxWidth: 'none',
        }
      : {
          padding: '1.5rem 2rem',
          maxWidth: 1200,
        }),
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  }

  const showHeaderAndPills = !isCourseDetail
  const mobileMenuBtnStyle = {
    display: 'none',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    padding: '0.625rem 1rem',
    minHeight: 44,
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.15)',
    color: '#FFFFFF',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  }

  return (
    <div style={layoutWrapperStyle}>
      <TraineeNav onOpenProfile={handleOpenProfile} onOpenSearch={toggleSearch} />
      <GlobalSearchPalette open={searchOpen} onClose={closeSearch} />
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

      <div style={bodyRowStyle}>
        <aside className="trainee-sidebar" style={sidebarShell} aria-label="Trainee navigation">
          <TraineeSidebar theme={theme === 'light' ? 'light' : 'dark'} onNavigate={() => setMobileMenuOpen(false)} />
        </aside>

        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 900,
            }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        {mobileMenuOpen && (
          <aside
            className="trainee-sidebar-mobile"
            style={{
              ...sidebarShell,
              position: 'fixed',
              left: 0,
              top: 0,
              height: '100vh',
              zIndex: 901,
              width: 280,
              boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
            }}
            aria-label="Trainee navigation menu"
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1rem 0' }}>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  minWidth: 44,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={icons.close} />
              </button>
            </div>
            <TraineeSidebar theme={theme === 'light' ? 'light' : 'dark'} onNavigate={() => setMobileMenuOpen(false)} />
          </aside>
        )}

        <main className="trainee-main-content" style={mainStyle}>
          {showHeaderAndPills && (
            <header style={identityHeaderStyle}>
              <button
                type="button"
                className="trainee-mobile-menu-btn"
                style={mobileMenuBtnStyle}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <FontAwesomeIcon icon={icons.viewList} /> Menu
              </button>
              <h1 style={greetingStyle}>
                {isDashboardIndex ? `Welcome back, ${displayName}!` : `Hello, ${displayName}`}
              </h1>
            </header>
          )}
          <div className="trainee-main-inner" style={scrollInnerStyle}>
            <Outlet context={outletContext} />
            {showHeaderAndPills && <TraineeNavigatePills />}
          </div>
        </main>
      </div>
    </div>
  )
}
