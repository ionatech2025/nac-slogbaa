import { FontAwesomeIcon, icons } from '../../../../shared/icons.js'
import { Modal } from '../../../../shared/components/Modal.jsx'

const styles = {
  text: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--slogbaa-text-muted)',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--slogbaa-border)',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.25rem',
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
}

export function UpdateCoursesModal({ onClose }) {
  return (
    <Modal title="Update Courses" onClose={onClose}>
      <p style={styles.text}>
        Course management (create, edit, publish) will be available here once the Learning module is connected. You will be able to update course catalog and content from this panel.
      </p>
      <div style={styles.actions}>
        <button type="button" style={styles.btn} onClick={onClose}>
          <FontAwesomeIcon icon={icons.updateCourses} />
          OK
        </button>
      </div>
    </Modal>
  )
}
