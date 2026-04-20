/**
 * Centralized query key factory for TanStack Query.
 * Follows the key hierarchy: [domain, scope, ...params] pattern.
 */
export const queryKeys = {
  // === Trainee courses ===
  courses: {
    all: ['courses'],
    published: () => [...queryKeys.courses.all, 'published'],
    enrolled: () => [...queryKeys.courses.all, 'enrolled'],
    detail: (courseId) => [...queryKeys.courses.all, 'detail', courseId],
    enrollment: (courseId) => [...queryKeys.courses.all, 'enrollment', courseId],
    resume: (courseId) => [...queryKeys.courses.all, 'resume', courseId],
    completedModules: (courseId) => [...queryKeys.courses.all, 'completed-modules', courseId],
  },

  // === Library ===
  library: {
    all: ['library'],
    published: () => [...queryKeys.library.all, 'published'],
  },

  // === Certificates ===
  certificates: {
    all: ['certificates'],
    mine: () => [...queryKeys.certificates.all, 'mine'],
  },

  // === Reviews ===
  reviews: {
    all: ['reviews'],
    byCourse: (courseId) => [...queryKeys.reviews.all, 'course', courseId],
    rating: (courseId) => [...queryKeys.reviews.all, 'rating', courseId],
  },

  // === Discussions ===
  discussions: {
    all: ['discussions'],
    byCourse: (courseId) => [...queryKeys.discussions.all, 'course', courseId],
    byCourseAndModule: (courseId, moduleId) => [...queryKeys.discussions.all, 'course', courseId, 'module', moduleId],
    thread: (courseId, threadId) => [...queryKeys.discussions.all, 'course', courseId, 'thread', threadId],
  },

  // === Leaderboard ===
  leaderboard: {
    all: ['leaderboard'],
    top: (limit) => [...queryKeys.leaderboard.all, 'top', limit],
  },

  // === Streak ===
  streak: {
    all: ['streak'],
    current: () => [...queryKeys.streak.all, 'current'],
  },

  // === Bookmarks ===
  bookmarks: {
    all: ['bookmarks'],
    list: (courseId) => [...queryKeys.bookmarks.all, 'list', courseId],
  },

  // === Achievements ===
  achievements: {
    all: () => ['achievements'],
  },

  // === Notifications ===
  notifications: {
    all: ['notifications'],
    list: (page) => ['notifications', 'list', page],
    unreadCount: () => ['notifications', 'unread-count'],
  },

  staffNotifications: {
    all: ['staff-notifications'],
    list: (page) => [...queryKeys.staffNotifications.all, 'list', page],
    unreadCount: () => [...queryKeys.staffNotifications.all, 'unread-count'],
  },

  // === Categories ===
  categories: {
    all: () => ['categories'],
  },

  // === Trainee profile ===
  trainee: {
    all: ['trainee'],
    profile: () => [...queryKeys.trainee.all, 'profile'],
    settings: () => [...queryKeys.trainee.all, 'settings'],
  },

  // === Admin dashboard ===
  admin: {
    all: ['admin'],
    overview: () => [...queryKeys.admin.all, 'overview'],
    courseCount: () => [...queryKeys.admin.all, 'courseCount'],

    // Admin courses
    courses: {
      all: () => [...queryKeys.admin.all, 'courses'],
      list: () => [...queryKeys.admin.all, 'courses', 'list'],
      detail: (courseId) => [...queryKeys.admin.all, 'courses', 'detail', courseId],
    },

    // Admin library
    library: {
      all: () => [...queryKeys.admin.all, 'library'],
      list: () => [...queryKeys.admin.all, 'library', 'list'],
    },

    // Admin assessment
    assessment: {
      all: () => [...queryKeys.admin.all, 'assessment'],
      quiz: (moduleId) => [...queryKeys.admin.all, 'assessment', 'quiz', moduleId],
      attempts: () => [...queryKeys.admin.all, 'assessment', 'attempts'],
      certificates: () => [...queryKeys.admin.all, 'assessment', 'certificates'],
    },

    // Admin users
    users: {
      staff: (staffId) => [...queryKeys.admin.all, 'users', 'staff', staffId],
      trainee: (traineeId) => [...queryKeys.admin.all, 'users', 'trainee', traineeId],
      traineeEnrolled: (traineeId) => [...queryKeys.admin.all, 'users', 'trainee', traineeId, 'enrolled'],
    },

    // Admin course management
    courseManagement: {
      enrollments: (courseId) => [...queryKeys.admin.all, 'courseManagement', 'enrollments', courseId],
      canDeleteCourse: (courseId) => [...queryKeys.admin.all, 'courseManagement', 'canDeleteCourse', courseId],
      canDeleteModule: (courseId, moduleId) => [...queryKeys.admin.all, 'courseManagement', 'canDeleteModule', courseId, moduleId],
    },

    // Admin CMS (homepage content)
    cms: {
      banners: () => [...queryKeys.admin.all, 'cms', 'banners'],
      stories: () => [...queryKeys.admin.all, 'cms', 'stories'],
      videos: () => [...queryKeys.admin.all, 'cms', 'videos'],
      partners: () => [...queryKeys.admin.all, 'cms', 'partners'],
      news: () => [...queryKeys.admin.all, 'cms', 'news'],
      visitors: () => [...queryKeys.admin.all, 'cms', 'visitors'],
      libraryResources: () => [...queryKeys.admin.all, 'cms', 'library-resources'],
    },

    // Admin live sessions
    liveSessions: {
      all: () => [...queryKeys.admin.all, 'liveSessions'],
    },

    engagementAnalytics: () => [...queryKeys.admin.all, 'engagement-analytics'],
  },

  // === Public homepage content ===
  homepage: {
    all: ['homepage'],
    content: () => ['homepage', 'content'],
    impact: () => ['homepage', 'impact'],
  },

  // === Live sessions (trainee view) ===
  liveSessions: {
    all: ['liveSessions'],
    active: () => ['liveSessions', 'active'],
  },
}
