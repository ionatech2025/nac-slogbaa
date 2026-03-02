package com.nac.slogbaa.iam.config;

import com.nac.slogbaa.iam.adapters.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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
 * Security configuration: permit /api/auth/** (login, register), protect other
 * endpoints with JWT. CORS enabled for frontend origins.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class IamSecurityConfiguration {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
	private String allowedOrigins;

	public IamSecurityConfiguration(JwtAuthenticationFilter jwtAuthenticationFilter) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",\\s*")));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
		config.setExposedHeaders(List.of("Authorization"));
		config.setAllowCredentials(true);
		config.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
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
	            .requestMatchers("/api/auth/**").permitAll()
	            .requestMatchers("/actuator/health").permitAll()
	            .anyRequest().authenticated()
	        )
	        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
	        .exceptionHandling(exception -> exception
	            .authenticationEntryPoint((request, response, ex) -> {
	                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	                response.setContentType("application/json");
	                response.setCharacterEncoding(StandardCharsets.UTF_8.name());
	                String body = "{\"detail\":\"Authentication required. Please log in or provide a valid token.\"}";
	                response.getWriter().write(body);
	            }
	        ));

	    return http.build();
	}

	@Bean // TODO: remove this later - using it to get seeds
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
