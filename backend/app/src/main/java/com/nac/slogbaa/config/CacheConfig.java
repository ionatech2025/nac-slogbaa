package com.nac.slogbaa.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cache configuration using ConcurrentMap (in-memory).
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

    @Bean
    CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
                PUBLISHED_COURSES,
                ADMIN_COURSES,
                PUBLISHED_LIBRARY,
                ADMIN_LIBRARY
        );
    }
}
