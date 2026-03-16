package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.BookmarkResult;

import java.util.List;
import java.util.UUID;

/**
 * Use case: retrieve bookmarks for a trainee, optionally filtered by courseId.
 */
public interface GetBookmarksUseCase {

    List<BookmarkResult> getBookmarks(UUID traineeId, UUID courseId);

    BookmarkResult updateNote(UUID traineeId, UUID bookmarkId, String note);

    void deleteBookmark(UUID traineeId, UUID bookmarkId);
}
