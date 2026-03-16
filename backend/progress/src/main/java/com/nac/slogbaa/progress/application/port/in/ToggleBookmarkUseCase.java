package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.BookmarkResult;

import java.util.UUID;

/**
 * Use case: toggle a bookmark on/off. If it exists, delete it; if not, create it.
 * Accepts an optional note for creation.
 */
public interface ToggleBookmarkUseCase {

    /**
     * Toggle bookmark.
     *
     * @param traineeId      current trainee (from auth)
     * @param courseId        course to bookmark
     * @param moduleId        module to bookmark
     * @param contentBlockId  optional content block id
     * @param note            optional note text
     * @return the created bookmark, or null if the bookmark was removed
     */
    BookmarkResult toggle(UUID traineeId, UUID courseId, UUID moduleId, UUID contentBlockId, String note);
}
