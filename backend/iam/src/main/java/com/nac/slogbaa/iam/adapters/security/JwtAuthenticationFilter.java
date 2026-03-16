package com.nac.slogbaa.iam.adapters.security;

import com.nac.slogbaa.iam.application.port.out.AuthTokenPort;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import jakarta.servlet.FilterChain;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

/**
 * JWT authentication filter with hardened token extraction.
 * <ul>
 *   <li>Rejects malformed Authorization headers (nested Bearer, whitespace-only tokens)</li>
 *   <li>Validates token structure before parsing</li>
 *   <li>Returns 401 immediately for clearly invalid tokens instead of falling through</li>
 * </ul>
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final AuthTokenPort authTokenPort;

    public JwtAuthenticationFilter(AuthTokenPort authTokenPort) {
        this.authTokenPort = authTokenPort;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(AUTHORIZATION_HEADER);

        if (header != null && header.startsWith(BEARER_PREFIX)) {
            String token = header.substring(BEARER_PREFIX.length()).trim();

            // Reject malformed tokens: nested Bearer prefix, empty, or suspiciously short
            if (token.isEmpty()) {
                log.debug("Empty Bearer token for {} {}", request.getMethod(), request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }
            if (token.toLowerCase().startsWith("bearer")) {
                log.warn("Rejected malformed Authorization header with nested Bearer prefix from {}",
                        request.getRemoteAddr());
                sendUnauthorized(response, "Malformed Authorization header");
                return;
            }

            // Basic JWT structure check: must have exactly 2 dots (header.payload.signature)
            long dotCount = token.chars().filter(c -> c == '.').count();
            if (dotCount != 2) {
                log.warn("Rejected token with invalid JWT structure (dots={}) from {}",
                        dotCount, request.getRemoteAddr());
                sendUnauthorized(response, "Invalid token format");
                return;
            }

            Optional<AuthenticatedIdentity> identity = authTokenPort.parseToken(token);
            if (identity.isPresent()) {
                AuthenticatedIdentity id = identity.get();
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        id,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + id.getRole().name()))
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                log.debug("JWT token rejected for {} {} from {}",
                        request.getMethod(), request.getRequestURI(), request.getRemoteAddr());
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String detail) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/problem+json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(
                "{\"type\":\"about:blank\",\"title\":\"Unauthorized\",\"status\":401,"
                        + "\"detail\":\"" + detail + "\"}");
    }
}
