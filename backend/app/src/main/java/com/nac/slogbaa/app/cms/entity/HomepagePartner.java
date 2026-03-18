package com.nac.slogbaa.app.cms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "homepage_partner")
public class HomepagePartner {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "Partner name is required")
    private String name;
    @Column(name = "logo_url") private String logoUrl;
    @Column(name = "website_url") private String websiteUrl;
    @Column(name = "sort_order") private int sortOrder;
    private boolean active = true;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_at") private Instant createdAt;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "updated_at") private Instant updatedAt;

    @PrePersist void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String n) { this.name = n; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String u) { this.logoUrl = u; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String u) { this.websiteUrl = u; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int o) { this.sortOrder = o; }
    public boolean isActive() { return active; }
    public void setActive(boolean a) { this.active = a; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
