package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeBookmarkEntity;
import com.nac.slogbaa.progress.application.dto.BookmarkResult;
import com.nac.slogbaa.progress.application.port.in.GetBookmarksUseCase;
import com.nac.slogbaa.progress.application.port.out.BookmarkPort;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Application service: retrieve bookmarks for a trainee, optionally filtered by courseId.
 */
public final class GetBookmarksService implements GetBookmarksUseCase {

    private final BookmarkPort bookmarkPort;
    private final CourseDetailsQueryPort courseDetailsQueryPort;

    public GetBookmarksService(BookmarkPort bookmarkPort,
                                CourseDetailsQueryPort courseDetailsQueryPort) {
        this.bookmarkPort = bookmarkPort;
        this.courseDetailsQueryPort = courseDetailsQueryPort;
    }

    @Override
    public List<BookmarkResult> getBookmarks(UUID traineeId, UUID courseId) {
        List<TraineeBookmarkEntity> entities;
        if (courseId != null) {
            entities = bookmarkPort.findByTraineeAndCourse(traineeId, courseId);
        } else {
            entities = bookmarkPort.findByTrainee(traineeId);
        }
        return entities.stream().map(this::toResult).toList();
    }

    @Override
    public Page<BookmarkResult> getBookmarks(UUID traineeId, UUID courseId, Pageable pageable) {
        Page<TraineeBookmarkEntity> page;
        if (courseId != null) {
            page = bookmarkPort.findByTraineeAndCourse(traineeId, courseId, pageable);
        } else {
            page = bookmarkPort.findByTrainee(traineeId, pageable);
        }
        return page.map(this::toResult);
    }

    @Override
    public BookmarkResult updateNote(UUID traineeId, UUID bookmarkId, String note) {
        var entity = bookmarkPort.findById(bookmarkId)
                .filter(e -> e.getTraineeId().equals(traineeId))
                .orElseThrow(() -> new IllegalArgumentException("Bookmark not found"));
        entity.setNote(note);
        var saved = bookmarkPort.save(entity);
        return toResult(saved);
    }

    @Override
    public void deleteBookmark(UUID traineeId, UUID bookmarkId) {
        bookmarkPort.findById(bookmarkId)
                .filter(e -> e.getTraineeId().equals(traineeId))
                .ifPresent(bookmarkPort::delete);
    }

    private BookmarkResult toResult(TraineeBookmarkEntity entity) {
        String courseTitle = "";
        String moduleTitle = "";
        try {
            var courseOpt = courseDetailsQueryPort.findCourseDetailsByIdIncludingUnpublished(entity.getCourseId());
            if (courseOpt.isPresent()) {
                courseTitle = courseOpt.get().getTitle();
                moduleTitle = courseOpt.get().getModules().stream()
                        .filter(m -> m.getId().equals(entity.getModuleId()))
                        .map(m -> m.getTitle())
                        .findFirst()
                        .orElse("");
            }
        } catch (Exception ignored) { /* best-effort title resolution */ }
        return new BookmarkResult(
                entity.getId(),
                entity.getCourseId(),
                courseTitle,
                entity.getModuleId(),
                moduleTitle,
                entity.getContentBlockId(),
                entity.getNote(),
                entity.getCreatedAt()
        );
    }
}
