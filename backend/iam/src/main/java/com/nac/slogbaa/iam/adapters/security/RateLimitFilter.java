package com.nac.slogbaa.iam.adapters.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory rate limiting filter for auth and sensitive endpoints.
 * Uses a sliding-window counter per client IP.
 * <p>
 * Protects against:
 * <ul>
 *   <li>Brute-force login attempts</li>
 *   <li>Password reset abuse</li>
 *   <li>Registration spam</li>
 * </ul>
 * <p>
 * In Phase 4, this will be backed by Redis for distributed rate limiting.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

    private final int authMaxRequests;
    private final int uploadMaxRequests;
    private final int adminMutationMaxRequests;
    private final long windowSeconds;

    // Key: "clientIp:endpoint-group", Value: window state
    private final Map<String, RateWindow> windows = new ConcurrentHashMap<>();

    public RateLimitFilter(
            @Value("${app.rate-limit.auth.max-requests:20}") int authMaxRequests,
            @Value("${app.rate-limit.upload.max-requests:30}") int uploadMaxRequests,
            @Value("${app.rate-limit.admin-mutation.max-requests:30}") int adminMutationMaxRequests,
            @Value("${app.rate-limit.window-seconds:60}") long windowSeconds) {
        this.authMaxRequests = authMaxRequests;
        this.uploadMaxRequests = uploadMaxRequests;
        this.adminMutationMaxRequests = adminMutationMaxRequests;
        this.windowSeconds = windowSeconds;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = resolveClientIp(request);

        int maxRequests;
        String group;

        if (path.startsWith("/api/auth/")) {
            group = "auth";
            maxRequests = authMaxRequests;
        } else if (path.startsWith("/api/files/upload")) {
            group = "upload";
            maxRequests = uploadMaxRequests;
        } else if (path.startsWith("/api/admin/") && isMutationMethod(method)) {
            group = "admin-mutation";
            maxRequests = adminMutationMaxRequests;
        } else {
            // No rate limiting for other endpoints
            filterChain.doFilter(request, response);
            return;
        }

        String key = clientIp + ":" + group;
        RateWindow window = windows.compute(key, (k, existing) -> {
            long now = Instant.now().getEpochSecond();
            if (existing == null || existing.isExpired(now, windowSeconds)) {
                return new RateWindow(now);
            }
            return existing;
        });

        int count = window.incrementAndGet();

        // Add rate limit headers
        response.setIntHeader("X-RateLimit-Limit", maxRequests);
        response.setIntHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - count));
        response.setHeader("X-RateLimit-Reset", String.valueOf(window.windowStart + windowSeconds));

        if (count > maxRequests) {
            log.warn("Rate limit exceeded for {} on {} group (count={}, max={})",
                    clientIp, group, count, maxRequests);
            response.setStatus(429);
            response.setContentType("application/problem+json");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().write(
                    "{\"type\":\"about:blank\",\"title\":\"Too Many Requests\",\"status\":429,"
                            + "\"detail\":\"Rate limit exceeded. Please try again later.\"}");
            return;
        }

        filterChain.doFilter(request, response);

        // Periodic cleanup (every ~100 requests) to prevent memory leak
        if (count == 1 && windows.size() > 10000) {
            cleanupExpiredWindows();
        }
    }

    private boolean isMutationMethod(String method) {
        return "POST".equals(method) || "PUT".equals(method) ||
               "PATCH".equals(method) || "DELETE".equals(method);
    }

    private String resolveClientIp(HttpServletRequest request) {
        // Check X-Forwarded-For for clients behind proxy/load balancer
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // Take only the first (client) IP — downstream proxies append
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void cleanupExpiredWindows() {
        long now = Instant.now().getEpochSecond();
        windows.entrySet().removeIf(e -> e.getValue().isExpired(now, windowSeconds));
    }

    private static class RateWindow {
        final long windowStart;
        private final AtomicInteger count = new AtomicInteger(0);

        RateWindow(long windowStart) {
            this.windowStart = windowStart;
        }

        int incrementAndGet() {
            return count.incrementAndGet();
        }

        boolean isExpired(long now, long windowSeconds) {
            return now - windowStart >= windowSeconds;
        }
    }
}
