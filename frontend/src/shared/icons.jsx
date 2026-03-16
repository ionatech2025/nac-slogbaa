/**
 * Central icon system — Lucide React (tree-shakeable, ~5KB used vs FontAwesome ~98KB).
 *
 * Provides a drop-in <Icon> component that replaces <FontAwesomeIcon icon={icons.xxx} />.
 * Also exports as FontAwesomeIcon for backward compatibility during migration.
 *
 * Usage:
 *   import { Icon, icons } from '@/shared/icons'
 *   <Icon icon={icons.home} />                // new way
 *   <FontAwesomeIcon icon={icons.home} />     // compat (same component)
 */
import {
  Home, PieChart, BookOpen, Library, ClipboardCheck, BarChart3,
  RefreshCw, UserPlus, KeyRound, LogOut, User, UserPen,
  GraduationCap, Plus, Check, FileText, Download, Grid3X3,
  List, LogIn, X, Award, BookMarked, Trash2,
  Eye, EyeOff, Pencil, CloudUpload, CloudDownload, Layers,
  SquarePlus, AlignLeft, ImageIcon, Video, ClipboardList,
  Search, Sun, Moon, Mail, UserX, Users, Loader2,
  GripVertical, Save, Type,
  Phone, MapPin, Building2, Hash, Globe, Lock, ShieldCheck,
  Flame, Target,
} from 'lucide-react'

/**
 * Icon component — wraps Lucide icons for consistent sizing.
 * Accepts `icon` (a Lucide component), plus standard props (size, className, style, etc.).
 * Also accepts `aria-label` for accessible icon-only buttons.
 */
export function Icon({ icon: LucideIcon, size = '1em', style, className, ...rest }) {
  if (!LucideIcon) return null
  return (
    <LucideIcon
      size={size}
      strokeWidth={2}
      style={{ flexShrink: 0, ...style }}
      className={className}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  )
}

// Backward-compatible alias — same component, same API
export const FontAwesomeIcon = Icon

export const icons = {
  home: Home,
  overview: PieChart,
  learning: BookOpen,
  library: Library,
  assessment: ClipboardCheck,
  reports: BarChart3,
  updateCourses: RefreshCw,
  createStaff: UserPlus,
  changePassword: KeyRound,
  signOut: LogOut,
  viewProfile: User,
  editProfile: UserPen,
  grades: GraduationCap,
  enroll: Plus,
  enrolled: Check,
  previewPdf: FileText,
  download: Download,
  viewCards: Grid3X3,
  viewList: List,
  signIn: LogIn,
  register: UserPlus,
  close: X,
  certificate: Award,
  course: BookMarked,
  delete: Trash2,
  eye: Eye,
  eyeSlash: EyeOff,
  edit: Pencil,
  publish: CloudUpload,
  unpublish: CloudDownload,
  modules: Layers,
  addBlock: SquarePlus,
  blockText: AlignLeft,
  blockImage: ImageIcon,
  blockVideo: Video,
  blockActivity: ClipboardList,
  search: Search,
  sun: Sun,
  moon: Moon,
  envelope: Mail,
  userSlash: UserX,
  users: Users,
  loader: Loader2,
  grip: GripVertical,
  save: Save,
  type: Type,
  phone: Phone,
  mapPin: MapPin,
  building: Building2,
  hash: Hash,
  globe: Globe,
  lock: Lock,
  shield: ShieldCheck,
  flame: Flame,
  target: Target,
}
