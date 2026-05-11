import { useState } from 'react'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAdminActivities, useAllStaff } from '../../../lib/hooks/use-system-admin.js'
import { useSetStaffActive, useSetStaffPassword, useUpdateStaffProfile } from '../../../lib/hooks/use-admin-users.js'
import { timeAgo } from '../../../lib/notification-utils.js'
import { useToast } from '../../../shared/hooks/useToast.js'

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1.5rem',
  },
  card: {
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)',
    borderRadius: 16,
    padding: '1.5rem',
    boxShadow: 'var(--slogbaa-glass-shadow)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(245, 130, 32, 0.1)', // Orange tint
    color: '#FF7F24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  activityFeed: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: 400,
    paddingRight: '0.5rem',
  },
  activityItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--slogbaa-blue)',
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityDesc: {
    margin: '0 0 0.25rem',
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text)',
    lineHeight: 1.4,
  },
  activityMeta: {
    margin: 0,
    fontSize: '0.75rem',
    color: 'var(--slogbaa-text-secondary)',
  },
  staffGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
    maxHeight: 400,
    overflowY: 'auto',
  },
  staffCard: {
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 12,
    padding: '1rem',
    background: 'var(--slogbaa-surface)',
  },
  staffHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  staffName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  staffEmail: {
    margin: 0,
    fontSize: '0.8125rem',
    color: 'var(--slogbaa-text-secondary)',
  },
  staffRoleBadge: {
    fontSize: '0.6875rem',
    padding: '0.15rem 0.5rem',
    borderRadius: 12,
    background: 'rgba(245, 130, 32, 0.1)',
    color: '#FF7F24',
    fontWeight: 600,
  },
  staffActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  actionBtn: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    borderRadius: 6,
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid var(--slogbaa-border)',
  },
  statLabel: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-secondary)',
  },
  statValue: {
    margin: 0,
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text)',
  },
  statusIndicator: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 6,
    background: '#10B981', // green
  }
}

export function SystemAdminDashboardPage() {
  const { data: activitiesData, isLoading: loadingActivities } = useAdminActivities()
  const { data: staffData, isLoading: loadingStaff } = useAllStaff()
  const toast = useToast()
  const setStaffActive = useSetStaffActive()

  const activities = activitiesData || []
  const staffList = staffData || []

  const toggleStaffStatus = async (staffId, currentStatus) => {
    try {
      await setStaffActive.mutateAsync({ staffId, active: !currentStatus })
      toast.success(`Staff account ${!currentStatus ? 'activated' : 'deactivated'}.`)
    } catch (e) {
      toast.error('Failed to update staff status.')
    }
  }

  return (
    <div style={styles.grid}>
      {/* 1. Activity Oversight (Spans 8 columns) */}
      <div style={{ ...styles.card, gridColumn: 'span 8' }}>
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <FontAwesomeIcon icon={icons.history} />
          </div>
          <h2 style={styles.cardTitle}>Global Activity Feed</h2>
        </div>
        <div style={styles.activityFeed}>
          {loadingActivities ? (
            <p>Loading activities...</p>
          ) : activities.length === 0 ? (
            <p>No activity logs found.</p>
          ) : (
            activities.map(act => (
              <div key={act.id} style={styles.activityItem}>
                <div style={styles.activityDot} />
                <div style={styles.activityContent}>
                  <p style={styles.activityDesc}><strong>{act.actorEmail}</strong> ({act.actorRole}) - {act.description}</p>
                  <p style={styles.activityMeta}>{timeAgo(act.createdAt)} • Action: {act.actionType}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. System Monitoring (Spans 4 columns) */}
      <div style={{ ...styles.card, gridColumn: 'span 4' }}>
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <FontAwesomeIcon icon={icons.server} />
          </div>
          <h2 style={styles.cardTitle}>System Monitoring</h2>
        </div>
        <div>
          <div style={styles.statRow}>
            <p style={styles.statLabel}>Backend Service</p>
            <p style={styles.statValue}><span style={styles.statusIndicator}/> Healthy</p>
          </div>
          <div style={styles.statRow}>
            <p style={styles.statLabel}>Database Connectivity</p>
            <p style={styles.statValue}><span style={styles.statusIndicator}/> Connected</p>
          </div>
          <div style={styles.statRow}>
            <p style={styles.statLabel}>Authentication Service</p>
            <p style={styles.statValue}><span style={styles.statusIndicator}/> Operational</p>
          </div>
          <div style={styles.statRow}>
            <p style={styles.statLabel}>Active Sessions</p>
            <p style={styles.statValue}>142</p>
          </div>
        </div>
      </div>

      {/* 2. Staff Management (Spans 12 columns) */}
      <div style={{ ...styles.card, gridColumn: 'span 12' }}>
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <FontAwesomeIcon icon={icons.users} />
          </div>
          <h2 style={styles.cardTitle}>Staff Directory</h2>
        </div>
        <div style={styles.staffGrid}>
          {loadingStaff ? (
            <p>Loading staff...</p>
          ) : staffList.length === 0 ? (
            <p>No staff found.</p>
          ) : (
            staffList.map(staff => (
              <div key={staff.id} style={styles.staffCard}>
                <div style={styles.staffHeader}>
                  <div>
                    <h3 style={styles.staffName}>{staff.fullName}</h3>
                    <p style={styles.staffEmail}>{staff.email}</p>
                  </div>
                  <span style={styles.staffRoleBadge}>{staff.role}</span>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ ...styles.statusIndicator, background: staff.active ? '#10B981' : '#EF4444' }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--slogbaa-text-secondary)' }}>
                    {staff.active ? 'Active' : 'Suspended'}
                  </span>
                </div>
                <div style={styles.staffActions}>
                  <button 
                    style={styles.actionBtn} 
                    onClick={() => toggleStaffStatus(staff.id, staff.active)}
                    disabled={setStaffActive.isPending}
                  >
                    {staff.active ? 'Suspend' : 'Activate'}
                  </button>
                  <button style={styles.actionBtn}>
                    Reset Pass
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
