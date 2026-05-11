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
    private final PartnerRepository partnerRepo;
    private final SiteVisitRepository visitRepo;
    private final PublicLibraryResourceRepository publicLibraryRepo;

    public AdminHomepageCmsController(BannerRepository bannerRepo, StoryRepository storyRepo,
                                      PartnerRepository partnerRepo, SiteVisitRepository visitRepo,
                                      PublicLibraryResourceRepository publicLibraryRepo) {
        this.bannerRepo = bannerRepo;
        this.storyRepo = storyRepo;
        this.partnerRepo = partnerRepo;
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
    public ResponseEntity<?> createBanner(@Valid @RequestBody HomepageBanner b) {
        if (bannerRepo.count() >= 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Maximum of 3 banners allowed"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerRepo.save(b));
    }

    @PutMapping("/banners/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<HomepageBanner> updateBanner(@PathVariable UUID id, @Valid @RequestBody HomepageBanner b) {
        return bannerRepo.findById(id).map(existing -> {
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
            existing.setTitle(s.getTitle());
            existing.setLocation(s.getLocation());
            existing.setCoursesCompleted(s.getCoursesCompleted());
            existing.setProjectImpact(s.getProjectImpact());
            existing.setCertification(s.getCertification());
            existing.setStoryText(s.getStoryText());
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
