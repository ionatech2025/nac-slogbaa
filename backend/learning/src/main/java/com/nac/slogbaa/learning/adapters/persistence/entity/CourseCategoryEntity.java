package com.nac.slogbaa.learning.adapters.persistence.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "course_category", uniqueConstraints = {
        @UniqueConstraint(name = "uq_course_category_slug", columnNames = {"slug"})
})
public class CourseCategoryEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "slug", nullable = false, length = 100)
    private String slug;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
}
