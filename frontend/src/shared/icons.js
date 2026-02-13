/**
 * Central export for Font Awesome icons used across the app.
 * Import { FontAwesomeIcon, icons } from '@/shared/icons' then use:
 * <FontAwesomeIcon icon={icons.home} />
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faChartPie,
  faBook,
  faClipboardCheck,
  faChartLine,
  faArrowsRotate,
  faUserPlus,
  faKey,
  faRightFromBracket,
  faUser,
  faUserPen,
  faGraduationCap,
  faPlus,
  faCheck,
  faFilePdf,
  faDownload,
  faGrip,
  faList,
  faRightToBracket,
  faXmark,
  faCertificate,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons'

export { FontAwesomeIcon }

export const icons = {
  home: faHome,
  overview: faChartPie,
  learning: faBook,
  assessment: faClipboardCheck,
  reports: faChartLine,
  updateCourses: faArrowsRotate,
  createStaff: faUserPlus,
  changePassword: faKey,
  signOut: faRightFromBracket,
  viewProfile: faUser,
  editProfile: faUserPen,
  grades: faGraduationCap,
  enroll: faPlus,
  enrolled: faCheck,
  previewPdf: faFilePdf,
  download: faDownload,
  viewCards: faGrip,
  viewList: faList,
  signIn: faRightToBracket,
  register: faUserPlus,
  close: faXmark,
  certificate: faCertificate,
  course: faBookOpen,
}
