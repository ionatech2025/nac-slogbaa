package com.nac.slogbaa.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * Registers the {@link ApiVersionForwardFilter} so that requests to
 * {@code /api/v1/**} are transparently forwarded to {@code /api/**}.
 * <p>
 * The filter runs at {@link Ordered#HIGHEST_PRECEDENCE} to ensure the
 * URI rewrite happens before Spring Security evaluates the path.
 */
@Configuration
public class ApiVersioningConfiguration {

    @Bean
    FilterRegistrationBean<ApiVersionForwardFilter> apiVersionForwardFilter() {
        FilterRegistrationBean<ApiVersionForwardFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new ApiVersionForwardFilter());
        registration.addUrlPatterns("/api/v1/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registration.setName("apiVersionForwardFilter");
        return registration;
    }
}
