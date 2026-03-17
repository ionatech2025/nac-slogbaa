package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.BookmarkResult;
import com.nac.slogbaa.progress.application.port.in.GetBookmarksUseCase;
import com.nac.slogbaa.progress.application.port.in.ToggleBookmarkUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for trainee bookmarks.
 */
@RestController
@RequestMapping("/api/me/bookmarks")
public class BookmarkController {

    private final ToggleBookmarkUseCase toggleBookmarkUseCase;
    private final GetBookmarksUseCase getBookmarksUseCase;

    public BookmarkController(ToggleBookmarkUseCase toggleBookmarkUseCase,
                               GetBookmarksUseCase getBookmarksUseCase) {
        this.toggleBookmarkUseCase = toggleBookmarkUseCase;
        this.getBookmarksUseCase = getBookmarksUseCase;
    }

    @PostMapping
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<BookmarkResult> toggleBookmark(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestBody ToggleBookmarkRequest request) {
        BookmarkResult result = toggleBookmarkUseCase.toggle(
                identity.getUserId(),
                request.courseId(),
                request.moduleId(),
                request.contentBlockId(),
                request.note()
        );
        if (result == null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Page<BookmarkResult>> getBookmarks(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestParam(required = false) UUID courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        Page<BookmarkResult> result = getBookmarksUseCase.getBookmarks(identity.getUserId(), courseId, pageable);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<BookmarkResult> updateNote(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id,
            @RequestBody UpdateNoteRequest request) {
        BookmarkResult result = getBookmarksUseCase.updateNote(identity.getUserId(), id, request.note());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> deleteBookmark(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id) {
        getBookmarksUseCase.deleteBookmark(identity.getUserId(), id);
        return ResponseEntity.noContent().build();
    }

    public record ToggleBookmarkRequest(UUID courseId, UUID moduleId, UUID contentBlockId, String note) {}
    public record UpdateNoteRequest(String note) {}
}
