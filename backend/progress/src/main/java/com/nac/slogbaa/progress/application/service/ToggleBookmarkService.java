package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeBookmarkEntity;
import com.nac.slogbaa.progress.application.dto.BookmarkResult;
import com.nac.slogbaa.progress.application.port.in.ToggleBookmarkUseCase;
import com.nac.slogbaa.progress.application.port.out.BookmarkPort;

import java.util.UUID;

/**
 * Application service: toggle a bookmark on/off.
 * If bookmark exists for the trainee+course+module+block, delete it.
 * If not, create it with optional note.
 */
public final class ToggleBookmarkService implements ToggleBookmarkUseCase {

    private final BookmarkPort bookmarkPort;
    private final CourseDetailsQueryPort courseDetailsQueryPort;

    public ToggleBookmarkService(BookmarkPort bookmarkPort,
                                  CourseDetailsQueryPort courseDetailsQueryPort) {
        this.bookmarkPort = bookmarkPort;
        this.courseDetailsQueryPort = courseDetailsQueryPort;
    }

    @Override
    public BookmarkResult toggle(UUID traineeId, UUID courseId, UUID moduleId, UUID contentBlockId, String note) {
        var existing = bookmarkPort.findByTraineeAndBlock(traineeId, courseId, moduleId, contentBlockId);
        if (existing.isPresent()) {
            bookmarkPort.delete(existing.get());
            return null;
        }

        var entity = new TraineeBookmarkEntity();
        entity.setTraineeId(traineeId);
        entity.setCourseId(courseId);
        entity.setModuleId(moduleId);
        entity.setContentBlockId(contentBlockId);
        entity.setNote(note);
        var saved = bookmarkPort.save(entity);
        return toResult(saved);
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
