package com.nac.slogbaa.app.cms.controller;

import com.nac.slogbaa.app.cms.entity.*;
import com.nac.slogbaa.app.cms.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public (no auth) endpoints for homepage content.
 * Also handles visitor tracking increment.
 */
@RestController
@RequestMapping("/api/public/homepage")
public class PublicHomepageController {

    private final BannerRepository bannerRepo;
    private final StoryRepository storyRepo;
    private final VideoRepository videoRepo;
    private final PartnerRepository partnerRepo;
    private final NewsRepository newsRepo;
    private final SiteVisitRepository visitRepo;

    public PublicHomepageController(BannerRepository bannerRepo, StoryRepository storyRepo,
                                   VideoRepository videoRepo, PartnerRepository partnerRepo,
                                   NewsRepository newsRepo, SiteVisitRepository visitRepo) {
        this.bannerRepo = bannerRepo;
        this.storyRepo = storyRepo;
        this.videoRepo = videoRepo;
        this.partnerRepo = partnerRepo;
        this.newsRepo = newsRepo;
        this.visitRepo = visitRepo;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        return ResponseEntity.ok(Map.of(
            "banners", bannerRepo.findByActiveTrueOrderBySortOrderAsc(),
            "stories", storyRepo.findByActiveTrueOrderBySortOrderAsc(),
            "videos", videoRepo.findByActiveTrueOrderBySortOrderAsc(),
            "partners", partnerRepo.findByActiveTrueOrderBySortOrderAsc(),
            "news", newsRepo.findByActiveTrueOrderBySortOrderAsc()
        ));
    }

    /** Track a page visit (fire-and-forget from frontend). */
    @PostMapping("/visit")
    public ResponseEntity<Void> recordVisit(@RequestBody(required = false) Map<String, String> body) {
        SiteVisit visit = new SiteVisit();
        if (body != null && body.containsKey("fingerprint")) {
            visit.setFingerprint(body.get("fingerprint"));
        }
        visitRepo.save(visit);
        return ResponseEntity.noContent().build();
    }
}
