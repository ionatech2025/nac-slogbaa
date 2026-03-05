package com.nac.slogbaa.progress.application.dto;

import java.util.UUID;

/**
 * Resume point for a trainee's progress in a course.
 */
public record ResumePoint(UUID lastModuleId, UUID lastContentBlockId) {}
