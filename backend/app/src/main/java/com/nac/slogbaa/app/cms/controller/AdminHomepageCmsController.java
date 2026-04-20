package com.nac.slogbaa.app.cms.controller;

import com.nac.slogbaa.app.cms.entity.*;
import com.nac.slogbaa.app.cms.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Admin CRUD for all homepage CMS sections.
 * List: ADMIN + SUPER_ADMIN. Create/Update/Delete: SUPER_ADMIN only.
 */
@RestController
@RequestMapping("/api/admin/homepage")
public class AdminHomepageCmsController {

    private final BannerRepository bannerRepo;
    private final StoryRepository storyRepo;
    private final VideoRepository videoRepo;
    private final PartnerRepository partnerRepo;
    private final NewsRepository newsRepo;
    private final SiteVisitRepository visitRepo;
    private final PublicLibraryResourceRepository publicLibraryRepo;

    public AdminHomepageCmsController(BannerRepository bannerRepo, StoryRepository storyRepo,
                                      VideoRepository videoRepo, PartnerRepository partnerRepo,
                                      NewsRepository newsRepo, SiteVisitRepository visitRepo,
                                      PublicLibraryResourceRepository publicLibraryRepo) {
        this.bannerRepo = bannerRepo;
        this.storyRepo = storyRepo;
        this.videoRepo = videoRepo;
        this.partnerRepo = partnerRepo;
        this.newsRepo = newsRepo;
        this.visitRepo = visitRepo;
        this.publicLibraryRepo = publicLibraryRepo;
    }

    // ── Visitor count ──
    @GetMapping("/visitors")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Map<String, Long>> getVisitorCount() {
        return ResponseEntity.ok(Map.of("total", visitRepo.count()));
    }

    // ── Banners ──
    @GetMapping("/banners")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<HomepageBanner> listBanners() { return bannerRepo.findAll(); }

    @PostMapping("/banners")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageBanner> createBanner(@Valid @RequestBody HomepageBanner b) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerRepo.save(b));
    }

    @PutMapping("/banners/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageBanner> updateBanner(@PathVariable UUID id, @Valid @RequestBody HomepageBanner b) {
        return bannerRepo.findById(id).map(existing -> {
            existing.setTitle(b.getTitle());
            existing.setSubtitle(b.getSubtitle());
            existing.setImageUrl(b.getImageUrl());
            existing.setSortOrder(b.getSortOrder());
            existing.setActive(b.isActive());
            return ResponseEntity.ok(bannerRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/banners/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteBanner(@PathVariable UUID id) {
        if (!bannerRepo.existsById(id)) return ResponseEntity.notFound().build();
        bannerRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Stories ──
    @GetMapping("/stories")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<HomepageStory> listStories() { return storyRepo.findAll(); }

    @PostMapping("/stories")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageStory> createStory(@Valid @RequestBody HomepageStory s) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storyRepo.save(s));
    }

    @PutMapping("/stories/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageStory> updateStory(@PathVariable UUID id, @Valid @RequestBody HomepageStory s) {
        return storyRepo.findById(id).map(existing -> {
            existing.setAuthorName(s.getAuthorName());
            existing.setAuthorRole(s.getAuthorRole());
            existing.setQuoteText(s.getQuoteText());
            existing.setImageUrl(s.getImageUrl());
            existing.setSortOrder(s.getSortOrder());
            existing.setActive(s.isActive());
            return ResponseEntity.ok(storyRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/stories/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteStory(@PathVariable UUID id) {
        if (!storyRepo.existsById(id)) return ResponseEntity.notFound().build();
        storyRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Videos ──
    @GetMapping("/videos")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<HomepageVideo> listVideos() { return videoRepo.findAll(); }

    @PostMapping("/videos")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageVideo> createVideo(@Valid @RequestBody HomepageVideo v) {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoRepo.save(v));
    }

    @PutMapping("/videos/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageVideo> updateVideo(@PathVariable UUID id, @Valid @RequestBody HomepageVideo v) {
        return videoRepo.findById(id).map(existing -> {
            existing.setTitle(v.getTitle());
            existing.setYoutubeUrl(v.getYoutubeUrl());
            existing.setSortOrder(v.getSortOrder());
            existing.setActive(v.isActive());
            return ResponseEntity.ok(videoRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/videos/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteVideo(@PathVariable UUID id) {
        if (!videoRepo.existsById(id)) return ResponseEntity.notFound().build();
        videoRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Partners ──
    @GetMapping("/partners")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<HomepagePartner> listPartners() { return partnerRepo.findAll(); }

    @PostMapping("/partners")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepagePartner> createPartner(@Valid @RequestBody HomepagePartner p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(partnerRepo.save(p));
    }

    @PutMapping("/partners/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepagePartner> updatePartner(@PathVariable UUID id, @Valid @RequestBody HomepagePartner p) {
        return partnerRepo.findById(id).map(existing -> {
            existing.setName(p.getName());
            existing.setLogoUrl(p.getLogoUrl());
            existing.setWebsiteUrl(p.getWebsiteUrl());
            existing.setSortOrder(p.getSortOrder());
            existing.setActive(p.isActive());
            return ResponseEntity.ok(partnerRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/partners/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deletePartner(@PathVariable UUID id) {
        if (!partnerRepo.existsById(id)) return ResponseEntity.notFound().build();
        partnerRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── News ──
    @GetMapping("/news")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<HomepageNews> listNews() { return newsRepo.findAll(); }

    @PostMapping("/news")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageNews> createNews(@Valid @RequestBody HomepageNews n) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsRepo.save(n));
    }

    @PutMapping("/news/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageNews> updateNews(@PathVariable UUID id, @Valid @RequestBody HomepageNews n) {
        return newsRepo.findById(id).map(existing -> {
            existing.setTitle(n.getTitle());
            existing.setSummary(n.getSummary());
            existing.setTag(n.getTag());
            existing.setPublishedDate(n.getPublishedDate());
            existing.setSortOrder(n.getSortOrder());
            existing.setActive(n.isActive());
            return ResponseEntity.ok(newsRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/news/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteNews(@PathVariable UUID id) {
        if (!newsRepo.existsById(id)) return ResponseEntity.notFound().build();
        newsRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Public Library ──
    @GetMapping("/library-resources")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<PublicLibraryResource> listResources() { return publicLibraryRepo.findAll(); }

    @PostMapping("/library-resources")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<PublicLibraryResource> createResource(@Valid @RequestBody PublicLibraryResource r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(publicLibraryRepo.save(r));
    }

    @PutMapping("/library-resources/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<PublicLibraryResource> updateResource(@PathVariable UUID id, @Valid @RequestBody PublicLibraryResource r) {
        return publicLibraryRepo.findById(id).map(existing -> {
            existing.setTitle(r.getTitle());
            existing.setDescription(r.getDescription());
            existing.setCategory(r.getCategory());
            existing.setFileUrl(r.getFileUrl());
            existing.setImageUrl(r.getImageUrl());
            existing.setSortOrder(r.getSortOrder());
            existing.setActive(r.isActive());
            return ResponseEntity.ok(publicLibraryRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/library-resources/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable UUID id) {
        if (!publicLibraryRepo.existsById(id)) return ResponseEntity.notFound().build();
        publicLibraryRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
