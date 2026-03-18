package com.nac.slogbaa.app.cms.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "site_visit")
public class SiteVisit {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "visited_at") private Instant visitedAt;
    private String fingerprint;

    @PrePersist void onCreate() { if (visitedAt == null) visitedAt = Instant.now(); }

    public UUID getId() { return id; }
    public Instant getVisitedAt() { return visitedAt; }
    public void setVisitedAt(Instant v) { this.visitedAt = v; }
    public String getFingerprint() { return fingerprint; }
    public void setFingerprint(String f) { this.fingerprint = f; }
}
