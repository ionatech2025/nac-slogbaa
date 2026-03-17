package com.nac.slogbaa.progress.core.exception;

/**
 * Thrown when a trainee attempts to enroll in a course whose prerequisite has not been completed.
 */
public final class PrerequisiteNotMetException extends RuntimeException {

    private final String prerequisiteCourseTitle;

    public PrerequisiteNotMetException(String prerequisiteCourseTitle) {
        super("Prerequisite not met: complete \"" + prerequisiteCourseTitle + "\" first");
        this.prerequisiteCourseTitle = prerequisiteCourseTitle;
    }

    public String getPrerequisiteCourseTitle() {
        return prerequisiteCourseTitle;
    }
}
