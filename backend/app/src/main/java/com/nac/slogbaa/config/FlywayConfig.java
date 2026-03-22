package com.nac.slogbaa.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Ensures Flyway repair runs before migrate when repair-on-migrate is enabled.
 * Spring Boot's repair-on-migrate can fail because validation runs first and throws
 * before repair executes (e.g. checksum mismatch after editing applied migrations).
 * This strategy explicitly runs repair() then migrate() so production deploys succeed.
 */
@Configuration
@ConditionalOnProperty(name = "spring.flyway.repair-on-migrate", havingValue = "true")
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }
}
