package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedRole;
import com.nac.slogbaa.progress.application.dto.ReplyResult;
import com.nac.slogbaa.progress.application.dto.ThreadResult;
import com.nac.slogbaa.progress.application.port.in.CreateDiscussionThreadUseCase;
import com.nac.slogbaa.progress.application.port.in.GetDiscussionThreadsUseCase;
import com.nac.slogbaa.progress.application.port.in.ReplyToThreadUseCase;
import com.nac.slogbaa.progress.application.port.in.ResolveThreadUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for course Q&A discussion threads.
 */
@RestController
@RequestMapping("/api/courses/{courseId}/discussions")
public class DiscussionController {

    private final CreateDiscussionThreadUseCase createThreadUseCase;
    private final ReplyToThreadUseCase replyToThreadUseCase;
    private final GetDiscussionThreadsUseCase getThreadsUseCase;
    private final ResolveThreadUseCase resolveThreadUseCase;

    public DiscussionController(CreateDiscussionThreadUseCase createThreadUseCase,
                                ReplyToThreadUseCase replyToThreadUseCase,
                                GetDiscussionThreadsUseCase getThreadsUseCase,
                                ResolveThreadUseCase resolveThreadUseCase) {
        this.createThreadUseCase = createThreadUseCase;
        this.replyToThreadUseCase = replyToThreadUseCase;
        this.getThreadsUseCase = getThreadsUseCase;
        this.resolveThreadUseCase = resolveThreadUseCase;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ThreadResult>> getThreads(
            @PathVariable UUID courseId,
            @RequestParam(required = false) UUID moduleId) {
        return ResponseEntity.ok(getThreadsUseCase.getThreads(courseId, moduleId));
    }

    @GetMapping("/{threadId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ThreadDetailResponse> getThread(
            @PathVariable UUID courseId,
            @PathVariable UUID threadId) {
        ThreadResult thread = getThreadsUseCase.getThread(threadId);
        List<ReplyResult> replies = getThreadsUseCase.getReplies(threadId);
        return ResponseEntity.ok(new ThreadDetailResponse(thread, replies));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ThreadResult> createThread(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @RequestBody CreateThreadRequest request) {
        String authorType = identity.isStaff() ? "STAFF" : "TRAINEE";
        ThreadResult result = createThreadUseCase.create(
                courseId,
                request.moduleId(),
                identity.getUserId(),
                authorType,
                request.title(),
                request.body()
        );
        return ResponseEntity.created(
                URI.create("/api/courses/" + courseId + "/discussions/" + result.id())
        ).body(result);
    }

    @PostMapping("/{threadId}/replies")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReplyResult> replyToThread(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @PathVariable UUID threadId,
            @RequestBody ReplyRequest request) {
        String authorType = identity.isStaff() ? "STAFF" : "TRAINEE";
        ReplyResult result = replyToThreadUseCase.reply(
                threadId,
                identity.getUserId(),
                authorType,
                request.body()
        );
        return ResponseEntity.created(
                URI.create("/api/courses/" + courseId + "/discussions/" + threadId + "/replies/" + result.id())
        ).body(result);
    }

    @PatchMapping("/{threadId}/resolve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> resolveThread(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @PathVariable UUID threadId) {
        boolean isStaff = identity.getRole() == AuthenticatedRole.ADMIN
                || identity.getRole() == AuthenticatedRole.SUPER_ADMIN;
        resolveThreadUseCase.resolve(threadId, identity.getUserId(), isStaff);
        return ResponseEntity.noContent().build();
    }

    public record CreateThreadRequest(UUID moduleId, String title, String body) {}
    public record ReplyRequest(String body) {}
    public record ThreadDetailResponse(ThreadResult thread, List<ReplyResult> replies) {}
}
