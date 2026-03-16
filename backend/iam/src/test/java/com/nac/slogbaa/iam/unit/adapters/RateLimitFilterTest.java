package com.nac.slogbaa.iam.unit.adapters;

import com.nac.slogbaa.iam.adapters.security.RateLimitFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitFilterTest {

    private RateLimitFilter filter;
    private FilterChain noopChain;

    @BeforeEach
    void setUp() {
        // 5 requests per 60 seconds for auth
        filter = new RateLimitFilter(5, 10, 60);
        noopChain = (req, res) -> {};
    }

    @Test
    void allowsRequestsUnderLimit() throws ServletException, IOException {
        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = createAuthRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, noopChain);
            assertNotEquals(429, response.getStatus(), "Request " + i + " should be allowed");
        }
    }

    @Test
    void blocksRequestsOverLimit() throws ServletException, IOException {
        // Exhaust the limit
        for (int i = 0; i < 5; i++) {
            filter.doFilter(createAuthRequest(), new MockHttpServletResponse(), noopChain);
        }

        // Next request should be blocked
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(createAuthRequest(), response, noopChain);
        assertEquals(429, response.getStatus());
        assertTrue(response.getContentAsString().contains("Too Many Requests"));
    }

    @Test
    void nonAuthEndpointsAreNotRateLimited() throws ServletException, IOException {
        for (int i = 0; i < 100; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/courses");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, noopChain);
            assertNotEquals(429, response.getStatus());
        }
    }

    @Test
    void rateLimitHeadersAreSet() throws ServletException, IOException {
        MockHttpServletRequest request = createAuthRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, noopChain);

        assertNotNull(response.getHeader("X-RateLimit-Limit"));
        assertNotNull(response.getHeader("X-RateLimit-Remaining"));
        assertNotNull(response.getHeader("X-RateLimit-Reset"));
    }

    @Test
    void differentIpsHaveSeparateLimits() throws ServletException, IOException {
        // Client A uses up the limit
        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest req = createAuthRequest();
            req.setRemoteAddr("192.168.1.1");
            filter.doFilter(req, new MockHttpServletResponse(), noopChain);
        }

        // Client B should still be allowed
        MockHttpServletRequest reqB = createAuthRequest();
        reqB.setRemoteAddr("192.168.1.2");
        MockHttpServletResponse resB = new MockHttpServletResponse();
        filter.doFilter(reqB, resB, noopChain);
        assertNotEquals(429, resB.getStatus());
    }

    private MockHttpServletRequest createAuthRequest() {
        return new MockHttpServletRequest("POST", "/api/auth/login");
    }
}
