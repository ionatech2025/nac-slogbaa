/**
 * Centralized query key factory for TanStack Query.
 * Follows the key hierarchy: [domain, scope, ...params] pattern.
 */
export const queryKeys = {
  // === Categories ===
  categories: {
    all: () => ['categories'],
  },

  // === Trainee courses ===
  courses: {
    all: ['courses'],
    published: () => [...queryKeys.courses.all, 'published'],
    enrolled: () => [...queryKeys.courses.all, 'enrolled'],
    detail: (courseId) => [...queryKeys.courses.all, 'detail', courseId],
    enrollment: (courseId) => [...queryKeys.courses.all, 'enrollment', courseId],
    resume: (courseId) => [...queryKeys.courses.all, 'resume', courseId],
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

  // === Leaderboard ===
  leaderboard: {
    all: ['leaderboard'],
    top: (limit) => [...queryKeys.leaderboard.all, 'top', limit],
  },

  // === Bookmarks ===
  bookmarks: {
    all: ['bookmarks'],
    list: (courseId) => courseId ? ['bookmarks', 'course', courseId] : ['bookmarks', 'all'],
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
  },
}
