package com.nac.slogbaa.observability;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Populates MDC with traceId and userId for every request, enabling
 * correlation across log lines. Runs early in the filter chain.
 * <p>
 * Respects incoming X-Request-ID header (from API gateway/load balancer)
 * or generates a new UUID if absent.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RequestTracingFilter extends OncePerRequestFilter {

    private static final String TRACE_ID = "traceId";
    private static final String USER_ID = "userId";
    private static final String REQUEST_ID_HEADER = "X-Request-ID";

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            // Trace ID: use incoming header or generate
            String traceId = request.getHeader(REQUEST_ID_HEADER);
            if (traceId == null || traceId.isBlank()) {
                traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            }
            MDC.put(TRACE_ID, traceId);
            response.setHeader(REQUEST_ID_HEADER, traceId);

            filterChain.doFilter(request, response);

            // After auth filter runs, userId may be available
            populateUserId();
        } finally {
            MDC.clear();
        }
    }

    private void populateUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AuthenticatedIdentity identity) {
            MDC.put(USER_ID, identity.getUserId().toString());
        }
    }
}
