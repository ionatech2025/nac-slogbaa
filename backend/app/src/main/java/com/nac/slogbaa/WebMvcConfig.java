package com.nac.slogbaa;

import org.springframework.boot.autoconfigure.condition.ConditionalOnResource;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Serves the React SPA when built into the JAR: static files from /static, and index.html
 * for client-side routes so /dashboard, /admin, /auth/login work on refresh. Disabled in dev
 * when classpath:static/index.html is absent (frontend runs via Vite).
 */
@Configuration
@ConditionalOnResource(resources = "classpath:static/index.html")
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String path, Resource location) throws IOException {
                        Resource r = location.createRelative(path);
                        if (r.exists() && r.isReadable()) {
                            return r;
                        }
                        return location.createRelative("index.html");
                    }
                });
    }
    
}
