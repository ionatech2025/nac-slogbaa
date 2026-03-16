package com.nac.slogbaa.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Validates critical configuration at startup. Fails fast in production
 * if required secrets or config values are missing.
 */
@Component
public class StartupValidator {

    private static final Logger log = LoggerFactory.getLogger(StartupValidator.class);

    private final Environment environment;

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.cors.allowed-origins:}")
    private String corsOrigins;

    public StartupValidator(Environment environment) {
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void validateConfiguration() {
        boolean isProd = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        List<String> warnings = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        // JWT secret validation
        if (jwtSecret.isBlank()) {
            errors.add("JWT_SECRET is not set");
        } else if (jwtSecret.contains("default-secret")) {
            if (isProd) {
                errors.add("JWT_SECRET contains default value — must use a strong secret in production");
            } else {
                warnings.add("JWT_SECRET contains default value — set a strong secret before deploying");
            }
        }

        // CORS validation
        if (corsOrigins.isBlank()) {
            warnings.add("No CORS origins configured (app.cors.allowed-origins)");
        }

        // Database
        String dbUrl = environment.getProperty("spring.datasource.url", "");
        if (isProd && dbUrl.contains("localhost")) {
            warnings.add("Production profile is using localhost database URL");
        }

        // Report
        for (String w : warnings) {
            log.warn("CONFIG WARNING: {}", w);
        }
        for (String e : errors) {
            log.error("CONFIG ERROR: {}", e);
        }

        if (isProd && !errors.isEmpty()) {
            throw new IllegalStateException(
                    "Production startup blocked: " + String.join("; ", errors));
        }

        if (errors.isEmpty() && warnings.isEmpty()) {
            log.info("Configuration validation passed");
        }
    }
}
