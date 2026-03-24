package com.nac.slogbaa.app.cms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.nac.slogbaa.app.cms.dto.LiveSessionDtos.LiveSessionAdminResponse;
import com.nac.slogbaa.app.cms.dto.LiveSessionDtos.LiveSessionCredentialsResponse;
import com.nac.slogbaa.app.cms.dto.LiveSessionDtos.LiveSessionTraineeResponse;
import com.nac.slogbaa.app.cms.dto.LiveSessionDtos.LiveSessionUpsertRequest;
import com.nac.slogbaa.app.cms.entity.LiveSession;
import com.nac.slogbaa.app.cms.entity.LiveSessionRegistration;
import com.nac.slogbaa.app.cms.repository.LiveSessionRegistrationRepository;
import com.nac.slogbaa.app.cms.repository.LiveSessionRepository;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaTraineeRepository;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LiveSessionApplicationService {

    private static final Logger log = LoggerFactory.getLogger(LiveSessionApplicationService.class);
    private static final String NOTIFY_TYPE = "LIVE_SESSION_UPCOMING";

    private final LiveSessionRepository sessionRepository;
    private final LiveSessionRegistrationRepository registrationRepository;
    private final CreateNotificationUseCase createNotificationUseCase;
    private final JpaTraineeRepository traineeRepository;

    public LiveSessionApplicationService(
            LiveSessionRepository sessionRepository,
            LiveSessionRegistrationRepository registrationRepository,
            CreateNotificationUseCase createNotificationUseCase,
            JpaTraineeRepository traineeRepository) {
        this.sessionRepository = sessionRepository;
        this.registrationRepository = registrationRepository;
        this.createNotificationUseCase = createNotificationUseCase;
        this.traineeRepository = traineeRepository;
    }

    @Transactional(readOnly = true)
    public List<LiveSessionAdminResponse> listAllForAdmin() {
        return sessionRepository.findAll().stream()
                .sorted(Comparator.comparing(LiveSession::getScheduledAt).reversed())
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LiveSessionTraineeResponse> listForTrainee(UUID traineeId) {
        return sessionRepository.findByActiveTrueOrderByScheduledAtDesc().stream()
                .map(s -> toTraineeResponse(s, traineeId))
                .toList();
    }

    @Transactional
    public LiveSessionAdminResponse create(LiveSessionUpsertRequest req, UUID createdBy) {
        LiveSession body = new LiveSession();
        applyUpsert(body, req, true);
        body.setCreatedBy(createdBy);
        LiveSession saved = sessionRepository.save(body);
        notifyTraineesNewSession(saved);
        return toAdminResponse(saved);
    }

    @Transactional
    public LiveSessionAdminResponse update(UUID id, LiveSessionUpsertRequest patch) {
        LiveSession existing = sessionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Live session not found"));
        applyUpsert(existing, patch, false);
        return toAdminResponse(sessionRepository.save(existing));
    }

    private void applyUpsert(LiveSession target, LiveSessionUpsertRequest req, boolean isCreate) {
        target.setTitle(req.title());
        target.setDescription(req.description());
        target.setSessionDetails(req.sessionDetails());
        target.setBannerImageUrl(req.bannerImageUrl());
        target.setProvider(req.provider());
        target.setMeetingUrl(req.meetingUrl());
        target.setMeetingId(req.meetingId());
        target.setMeetingPassword(req.meetingPassword());
        target.setScheduledAt(req.scheduledAt());
        target.setDurationMinutes(req.durationMinutes());
        target.setActive(req.active());
        if (isCreate || req.speakers() != null) {
            target.setSpeakers(req.speakers() == null ? null : req.speakers());
        }
    }

    @Transactional
    public void delete(UUID id) {
        if (!sessionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Live session not found");
        }
        sessionRepository.deleteById(id);
    }

    @Transactional
    public void register(UUID sessionId, UUID traineeId) {
        LiveSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Live session not found"));
        if (!session.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This session is not available");
        }
        String phase = phase(session.getScheduledAt(), session.getDurationMinutes());
        if ("PAST".equals(phase)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot register for a session that has already ended");
        }
        if (registrationRepository.existsByLiveSessionIdAndTraineeId(sessionId, traineeId)) {
            return;
        }
        LiveSessionRegistration reg = new LiveSessionRegistration();
        reg.setLiveSessionId(sessionId);
        reg.setTraineeId(traineeId);
        registrationRepository.save(reg);
    }

    @Transactional
    public void unregister(UUID sessionId, UUID traineeId) {
        if (!registrationRepository.existsByLiveSessionIdAndTraineeId(sessionId, traineeId)) {
            return;
        }
        registrationRepository.deleteByLiveSessionIdAndTraineeId(sessionId, traineeId);
    }

    private void notifyTraineesNewSession(LiveSession session) {
        if (session.getScheduledAt() == null) {
            return;
        }
        Instant end = session.getScheduledAt().plus(session.getDurationMinutes(), ChronoUnit.MINUTES);
        if (!Instant.now().isBefore(end)) {
            return;
        }
        String when = DateTimeFormatter.ofPattern("MMM d, yyyy HH:mm z")
                .withZone(ZoneId.systemDefault())
                .format(session.getScheduledAt());
        String title = "New live session: " + session.getTitle();
        String message = "A live training session was scheduled for " + when
                + ". Open Live Sessions to register and get join details.";
        List<UUID> trainees = traineeRepository.findAllActiveTraineeIds();
        for (UUID traineeId : trainees) {
            try {
                createNotificationUseCase.create(traineeId, NOTIFY_TYPE, title, message, "/dashboard/live-sessions");
            } catch (Exception e) {
                log.warn("Could not notify trainee {} about live session: {}", traineeId, e.getMessage());
            }
        }
    }

    private LiveSessionAdminResponse toAdminResponse(LiveSession s) {
        long count = registrationRepository.countByLiveSessionId(s.getId());
        return new LiveSessionAdminResponse(
                s.getId(),
                s.getTitle(),
                s.getDescription(),
                s.getSessionDetails(),
                s.getBannerImageUrl(),
                speakersNode(s),
                s.getProvider(),
                s.getMeetingUrl(),
                s.getMeetingId(),
                s.getMeetingPassword(),
                s.getScheduledAt(),
                s.getDurationMinutes(),
                s.isActive(),
                count,
                s.getCreatedBy(),
                s.getCreatedAt(),
                s.getUpdatedAt());
    }

    private LiveSessionTraineeResponse toTraineeResponse(LiveSession s, UUID traineeId) {
        boolean registered = registrationRepository.existsByLiveSessionIdAndTraineeId(s.getId(), traineeId);
        String ph = phase(s.getScheduledAt(), s.getDurationMinutes());
        LiveSessionCredentialsResponse creds = null;
        if (registered) {
            creds = new LiveSessionCredentialsResponse(s.getMeetingUrl(), s.getMeetingId(), s.getMeetingPassword());
        }
        return new LiveSessionTraineeResponse(
                s.getId(),
                s.getTitle(),
                s.getDescription(),
                s.getSessionDetails(),
                s.getBannerImageUrl(),
                speakersNode(s),
                s.getProvider(),
                s.getScheduledAt(),
                s.getDurationMinutes(),
                ph,
                registered,
                creds);
    }

    private static JsonNode speakersNode(LiveSession s) {
        JsonNode n = s.getSpeakers();
        return n == null || n.isNull() ? NullNode.getInstance() : n;
    }

    public static String phase(Instant scheduledAt, int durationMinutes) {
        if (scheduledAt == null) {
            return "UPCOMING";
        }
        Instant now = Instant.now();
        Instant end = scheduledAt.plus(durationMinutes, ChronoUnit.MINUTES);
        if (now.isBefore(scheduledAt)) {
            return "UPCOMING";
        }
        if (!now.isAfter(end)) {
            return "LIVE";
        }
        return "PAST";
    }
}
