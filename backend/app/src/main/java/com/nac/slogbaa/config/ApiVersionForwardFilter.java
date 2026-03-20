package com.nac.slogbaa.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Rewrites versioned API paths ({@code /api/v1/**}) to the unversioned
 * controller paths ({@code /api/**}) by wrapping the request.
 * <p>
 * This lets clients use {@code /api/v1/} immediately while all existing
 * {@code /api/} URLs continue to work unchanged. When a v2 is introduced,
 * controllers can be duplicated or branched while this filter keeps routing
 * v1 traffic to the original handlers.
 * <p>
 * Uses an {@link HttpServletRequestWrapper} (not a forward) so the rewritten
 * URI is visible to the entire downstream filter chain, including Spring
 * Security, rate limiting, and the DispatcherServlet.
 * <p>
 * Registered by {@link ApiVersioningConfiguration} at
 * {@code Ordered.HIGHEST_PRECEDENCE}.
 */
public class ApiVersionForwardFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ApiVersionForwardFilter.class);
    private static final String V1_PREFIX = "/api/v1/";
    private static final String V1_BARE = "/api/v1";
    private static final String API_PREFIX = "/api/";

    private static String sanitizeForLog(String value) {
        if (value == null) return null;
        // Prevent log injection by removing newlines/control chars.
        return value.replaceAll("[\\r\\n]", " ");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();

        if (uri.startsWith(V1_PREFIX) || uri.equals(V1_BARE)) {
            String rewritten = uri.startsWith(V1_PREFIX)
                    ? API_PREFIX + uri.substring(V1_PREFIX.length())
                    : API_PREFIX;
            log.debug("API version rewrite: {} -> {}", sanitizeForLog(uri), sanitizeForLog(rewritten));
            filterChain.doFilter(new RewrittenRequest(request, rewritten), response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Wraps the original request to override URI / servlet-path so the rest of
     * the filter chain (Security, DispatcherServlet) sees the rewritten path.
     */
    private static class RewrittenRequest extends HttpServletRequestWrapper {
        private final String newUri;

        RewrittenRequest(HttpServletRequest request, String newUri) {
            super(request);
            this.newUri = newUri;
        }

        @Override
        public String getRequestURI() {
            return newUri;
        }

        @Override
        public String getServletPath() {
            return newUri;
        }

        @Override
        public StringBuffer getRequestURL() {
            StringBuffer url = new StringBuffer();
            url.append(getScheme()).append("://").append(getServerName());
            int port = getServerPort();
            if (("http".equals(getScheme()) && port != 80)
                    || ("https".equals(getScheme()) && port != 443)) {
                url.append(':').append(port);
            }
            url.append(newUri);
            return url;
        }
    }
}
