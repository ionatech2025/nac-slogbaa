package com.nac.slogbaa.iam.config;

import com.nac.slogbaa.iam.adapters.security.JwtAuthenticationFilter;
import com.nac.slogbaa.iam.adapters.security.RateLimitFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

/**
 * Security configuration: JWT-based stateless auth, hardened CORS,
 * proper password encoding, and locked-down endpoint permissions.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class IamSecurityConfiguration {

    private static final int BCRYPT_STRENGTH = 13;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitFilter rateLimitFilter;
    private final Environment environment;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    public IamSecurityConfiguration(JwtAuthenticationFilter jwtAuthenticationFilter,
                                     RateLimitFilter rateLimitFilter,
                                     Environment environment) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.rateLimitFilter = rateLimitFilter;
        this.environment = environment;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> origins = Arrays.asList(allowedOrigins.split(",\\s*"));
        // In prod, enforce HTTPS-only origins
        boolean isProd = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        if (isProd) {
            origins = origins.stream()
                    .filter(o -> o.startsWith("https://"))
                    .toList();
            if (origins.isEmpty()) {
                throw new IllegalStateException(
                        "Production CORS requires at least one HTTPS origin in app.cors.allowed-origins");
            }
            // Vercel preview deploys use unique hosts (*.vercel.app). Exact origins alone block them.
            // Pattern allows any https subdomain of vercel.app (still HTTPS-only in prod).
            config.addAllowedOriginPattern("https://*.vercel.app");
        }
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Request-ID"));
        config.setExposedHeaders(List.of("Authorization", "X-Request-ID", "Content-Disposition"));
        config.setAllowCredentials(true);
        // Short max-age in dev for faster iteration; longer in prod
        config.setMaxAge(isProd ? 3600L : 600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/api/v1/**", config);
        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/v1/auth/**").permitAll()
                .requestMatchers("/api/public/**", "/api/v1/public/**").permitAll()
                .requestMatchers("/api/internal/debug/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/health", "/actuator/health/**", "/actuator/info").permitAll()
                .requestMatchers("/actuator/prometheus").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/actuator/**").hasRole("SUPER_ADMIN")
                // Static assets served by SPA build (index.html, JS, CSS) — not /uploads
                .requestMatchers("/", "/index.html", "/assets/**", "/favicon.ico").permitAll()
                // Uploaded files: browsers never send Bearer on <img src>, <a href>, etc.
                // Upload remains POST /api/files/upload with @PreAuthorize(ADMIN).
                // Objects use UUID filenames (see LocalFileStorageAdapter).
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.HEAD, "/uploads/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, ex) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/problem+json");
                    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                    String body = """
                        {"type":"about:blank","title":"Unauthorized","status":401,\
                        "detail":"Authentication required. Please log in or provide a valid token."}""";
                    response.getWriter().write(body);
                })
                .accessDeniedHandler((request, response, ex) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/problem+json");
                    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                    String body = """
                        {"type":"about:blank","title":"Forbidden","status":403,\
                        "detail":"You do not have permission to access this resource."}""";
                    response.getWriter().write(body);
                })
            )
            .headers(headers -> headers
                .contentTypeOptions(contentType -> {}) // X-Content-Type-Options: nosniff
                .frameOptions(frame -> frame.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)
                )
            );

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(BCRYPT_STRENGTH);
    }
}
