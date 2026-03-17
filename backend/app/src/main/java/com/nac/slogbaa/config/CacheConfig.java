package com.nac.slogbaa.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Cache configuration using Caffeine (high-performance in-memory).
 * For production with horizontal scaling, swap to Redis:
 * {@code spring.cache.type=redis} + spring-boot-starter-data-redis.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String PUBLISHED_COURSES = "publishedCourses";
    public static final String ADMIN_COURSES = "adminCourses";
    public static final String PUBLISHED_LIBRARY = "publishedLibrary";
    public static final String ADMIN_LIBRARY = "adminLibrary";
    public static final String COURSE_DETAIL = "courseDetail";
    public static final String CATEGORIES = "categories";
    public static final String LEADERBOARD = "leaderboard";

    @Bean
    CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .recordStats());
        manager.setCacheNames(java.util.List.of(
                PUBLISHED_COURSES,
                ADMIN_COURSES,
                PUBLISHED_LIBRARY,
                ADMIN_LIBRARY,
                COURSE_DETAIL,
                CATEGORIES,
                LEADERBOARD
        ));
        return manager;
    }
}
