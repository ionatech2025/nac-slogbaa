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
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Filter that validates JWT using AuthTokenPort and sets Spring Security context.
 * Uses only the application port (AuthTokenPort); JWT library is in JwtTokenAdapter.
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
            // Normalize: strip accidental "Bearer " prefix (e.g. from API client paste)
            if (token.toLowerCase().startsWith("bearer ")) {
                token = token.substring(7).trim();
            }
            Optional<AuthenticatedIdentity> identity = authTokenPort.parseToken(token);
            if (identity.isEmpty()) {
                log.warn("JWT token rejected for {} {} — check logs above for parse failure (expired/malformed/signature)", request.getMethod(), request.getRequestURI());
            }
            identity.ifPresent(id -> {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        id,
                        null,
                        Stream.of(id.getRole().name())
                                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                                .collect(Collectors.toList())
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }
        filterChain.doFilter(request, response);
    }
}
